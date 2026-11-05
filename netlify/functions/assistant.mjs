import { createHash } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { getStore } from "@netlify/blobs";
import { MAX_OUTPUT_TOKENS, MODEL, buildSystemPrompt, consumeAllowance, validateChat } from "../../src/assistant.js";

const MAX_BODY_BYTES = 20_000;
const WRITE_ATTEMPTS = 5;
const SYSTEM = buildSystemPrompt();
const json = (status, error) => Response.json({ error }, { status });

function sameOrigin(req) {
  const origin = req.headers.get("origin");
  try {
    return origin && new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

// One blob holds today's counts and resets itself each day, so nothing accumulates.
// The day is mixed into the hash, so stored IPs can't be linked across days.
async function spendAllowance(ip) {
  const store = getStore({ name: "floppy-usage", consistency: "strong" });
  const day = new Date().toISOString().slice(0, 10);
  const ipKey = createHash("sha256").update(`${day}:${ip}`).digest("hex").slice(0, 16);
  for (let attempt = 0; attempt < WRITE_ATTEMPTS; attempt++) {
    const current = await store.getWithMetadata("usage", { type: "json" });
    // onlyIfMatch: undefined would silently write unconditionally and break the ceiling.
    if (current && !current.etag) throw new Error("usage blob has no etag");
    const { allowed, usage } = consumeAllowance(current?.data, day, ipKey);
    if (!allowed) return "daily";
    // Compare-and-swap: a parallel request that wrote first makes this retry, so bursts can't overspend.
    const { modified } = await store.setJSON("usage", usage, current ? { onlyIfMatch: current.etag } : { onlyIfNew: true });
    if (modified) return "ok";
  }
  return "busy"; // lost every race: refuse rather than risk an uncounted request
}

function apiErrorResponse(error) {
  // Log the type only: visitors' messages and upstream details stay out of logs and responses.
  console.error("assistant error:", error?.status ?? error?.name);
  if (error instanceof Anthropic.RateLimitError) return json(429, "busy");
  return json(502, "unavailable");
}

export default async function handler(req, context) {
  if (req.method !== "POST") return json(405, "method not allowed");
  if (!sameOrigin(req)) return json(403, "forbidden");
  if (!process.env.ANTHROPIC_API_KEY) return json(503, "not configured");

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, "too large");
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, "invalid json");
  }
  const { messages, error } = validateChat(body);
  if (error) return json(400, error);

  let allowance;
  try {
    allowance = await spendAllowance(context?.ip ?? "unknown");
  } catch (err) {
    // Fail closed: if the counter can't be read, the spending ceiling can't be enforced.
    console.error("assistant allowance error:", err?.name);
    return json(503, "unavailable");
  }
  if (allowance !== "ok") return json(429, allowance);

  const stream = new Anthropic({ maxRetries: 1 }).messages.stream({
    model: MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    thinking: { type: "disabled" },
    output_config: { effort: "low" },
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    messages,
  });

  // Wait for the first event so connection and auth failures can still return a real status.
  const events = stream[Symbol.asyncIterator]();
  let first;
  try {
    first = await events.next();
  } catch (err) {
    return apiErrorResponse(err);
  }

  const encoder = new TextEncoder();
  const textOf = (event) =>
    event?.type === "content_block_delta" && event.delta.type === "text_delta" ? event.delta.text : "";

  const output = new ReadableStream({
    async start(controller) {
      try {
        const opening = textOf(first.value);
        if (opening) controller.enqueue(encoder.encode(opening));
        for (let next = await events.next(); !next.done; next = await events.next()) {
          const text = textOf(next.value);
          if (text) controller.enqueue(encoder.encode(text));
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "max_tokens") controller.enqueue(encoder.encode("..."));
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("Sorry, I can't help with that one. Ask me about Shubham's work instead!"));
        }
      } catch (err) {
        console.error("assistant stream error:", err?.status ?? err?.name);
        controller.enqueue(encoder.encode("\n\nOops, I lost my connection. Please try again."));
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(output, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

export const config = {
  path: "/api/assistant",
  // Stops bursts at the edge before the function runs. The daily ceiling lives in spendAllowance.
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
