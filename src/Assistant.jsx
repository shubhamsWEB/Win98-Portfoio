import { useCallback, useEffect, useRef, useState } from "react";
import { apps } from "./apps.jsx";
import { newestFirst, parseReply, splitLinks, MAX_USER_CHARS } from "./assistant.js";
import FloppyCharacter from "./FloppyCharacter.jsx";
import { profile } from "./content.js";
import { getSettings, setSettings, useSettings } from "./settings.js";
import { play } from "./sound.js";
import { useContextMenu } from "./ui/Menu.jsx";

const NEWS = newestFirst();
const SUGGESTIONS = ["What has Shubham built?", "What's new lately?", "Why hire Shubham?"];
const HISTORY_SENT = 10; // must stay at or under MAX_MESSAGES
const OPEN_EVENT = "floppy-open";
const HINTS = ["Ask me anything!", "Curious about Shubham?", "Psst... I'm an AI. Try me!"];
const HINT_MS = 5000;
const TIP_DELAY_MS = 1500;
const TIP_GAP_MS = 45_000;
const TIP_VISIBLE_MS = 10_000;
const TIP_QUIET_START_MS = 6000; // leaves the first moments to the welcome window and any news

// Clippy-style help, shown once per visit when someone opens a matching window.
const TIPS = {
  projects: { text: "Browsing the projects? I can point out the highlights.", ask: "Which projects should I look at first?" },
  resume: { text: "Reading the resume? I can give you the short version.", ask: "Why hire Shubham?" },
  about: { text: "Want a quick summary of Shubham's experience?", ask: "Summarize Shubham's experience." },
  contact: { text: "Before you write, I can answer quick questions about Shubham.", ask: null },
};
const ACTION_LABELS = { projects: "My Projects", about: "About Shubham", resume: "My Resume", contact: "New Message", browser: "Live Demos" };

const ERRORS = {
  429: "So many questions! Give me a minute to catch my breath.",
  daily: "That's all the questions I can take today. Please send Shubham a message instead, or check back tomorrow!",
  503: "My AI brain isn't plugged in right now, but you can still send Shubham a message.",
};

function markSeen(id) {
  const { seenUpdates } = getSettings();
  if (!seenUpdates.includes(id)) setSettings({ seenUpdates: [...seenUpdates, id] });
}

export default function Assistant({ openApp, focused }) {
  const windowOpen = Boolean(focused);
  const { assistant, seenUpdates, floppyUsed } = useSettings();
  const [view, setView] = useState(null); // null | greet | news | chat
  const [newsIndex, setNewsIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [happy, setHappy] = useState(false);
  const [tip, setTip] = useState(null);
  const [hint, setHint] = useState(0);
  const tipsShown = useRef(new Set());
  const lastTipAt = useRef(0);
  const mountedAt = useRef(Date.now());
  const previousFocus = useRef(focused);
  const abort = useRef(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const [menu, openMenu] = useContextMenu();
  const windowOpenRef = useRef(windowOpen);
  windowOpenRef.current = windowOpen;
  const viewRef = useRef(view);
  viewRef.current = view;

  const showNews = useCallback((index) => {
    setNewsIndex(index);
    setView("news");
    markSeen(NEWS[index].id);
  }, []);

  // Pop up once per visit: unseen news first, otherwise a hello for first-timers.
  useEffect(() => {
    if (!assistant) return;
    let shown = false;
    try {
      shown = sessionStorage.getItem("floppy-greeted") === "1";
      sessionStorage.setItem("floppy-greeted", "1");
    } catch {
      // Storage blocked: at worst the greeting repeats.
    }
    if (shown) return;
    const timer = setTimeout(() => {
      // A window fills a phone screen, so news waits behind the tray dot instead of covering it.
      if (windowOpenRef.current && matchMedia("(max-width: 720px)").matches) return;
      // Never interrupt someone already using Floppy. The tray dot still shows unread news.
      if (viewRef.current) return;
      const unseen = NEWS.findIndex((u) => !getSettings().seenUpdates.includes(u.id));
      play("on");
      if (unseen >= 0) showNews(unseen);
      else setView("greet");
    }, 4000);
    return () => clearTimeout(timer);
  }, [assistant, showNews]);

  useEffect(() => {
    if (view !== "greet") return;
    const timer = setTimeout(() => setView(null), 12000);
    return () => clearTimeout(timer);
  }, [view]);

  // Offer help that matches what the visitor just opened. Never on first load or over the chat.
  useEffect(() => {
    if (focused === previousFocus.current) return;
    previousFocus.current = focused;
    const candidate = TIPS[focused];
    if (!assistant || !candidate || tipsShown.current.has(focused)) return;
    if (Date.now() - mountedAt.current < TIP_QUIET_START_MS) return;
    if (Date.now() - lastTipAt.current < TIP_GAP_MS || matchMedia("(max-width: 720px)").matches) return;
    const timer = setTimeout(() => {
      if (viewRef.current) return;
      tipsShown.current.add(focused);
      lastTipAt.current = Date.now();
      setTip(candidate);
      setView("tip");
    }, TIP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [focused, assistant]);

  useEffect(() => {
    if (view !== "tip") return;
    const timer = setTimeout(() => setView(null), TIP_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [view]);

  // Keeps a visible invitation next to Floppy until the visitor has tried the chat once.
  useEffect(() => {
    if (floppyUsed) return;
    const timer = setInterval(() => setHint((h) => (h + 1) % HINTS.length), HINT_MS);
    return () => clearInterval(timer);
  }, [floppyUsed]);

  useEffect(() => {
    if (view === "chat" && !floppyUsed) setSettings({ floppyUsed: true });
  }, [view, floppyUsed]);

  useEffect(() => {
    if (!happy) return;
    const timer = setTimeout(() => setHappy(false), 2000);
    return () => clearTimeout(timer);
  }, [happy]);

  useEffect(() => {
    const open = () => {
      setSettings({ assistant: true });
      setView("chat");
    };
    addEventListener(OPEN_EVENT, open);
    return () => removeEventListener(OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    if (view === "chat") inputRef.current?.focus({ preventScroll: true });
  }, [view]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => () => abort.current?.abort(), []);

  const appendToLast = (text) =>
    setMessages((all) => [...all.slice(0, -1), { ...all.at(-1), content: all.at(-1).content + text }]);

  const ask = async (question) => {
    const text = question.trim();
    if (!text || busy) return;
    const history = [...messages.filter((m) => m.content), { role: "user", content: text }];
    let sent = history.slice(-HISTORY_SENT);
    if (sent[0].role !== "user") sent = sent.slice(1);
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setView("chat");
    setBusy(true);
    const controller = new AbortController();
    abort.current = controller;
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: sent }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({}));
        appendToLast(ERRORS[error] ?? ERRORS[res.status] ?? "Something went wrong on my end. Please try again.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        appendToLast(decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if (err.name !== "AbortError") appendToLast("I couldn't connect. Please check your internet and try again.");
    } finally {
      setBusy(false);
      setHappy(true);
    }
  };

  if (!assistant && view === null) return menu;

  const close = () => {
    abort.current?.abort();
    setView(null);
  };
  const hide = () => {
    close();
    setSettings({ assistant: false });
  };
  const contextItems = [
    { label: "Ask a Question", onClick: () => setView("chat") },
    { label: "What's New", onClick: () => showNews(0) },
    { separator: true },
    { label: "Hide Floppy", onClick: hide },
  ];
  const nextUnseen = NEWS.findIndex((u, i) => i !== newsIndex && !seenUpdates.includes(u.id));
  const item = NEWS[newsIndex];

  if (view === "chat") {
    const lastReply = messages.at(-1)?.role === "assistant" ? parseReply(messages.at(-1).content).text : "";
    const mood = busy ? (lastReply ? "talk" : "think") : input ? "listen" : happy ? "happy" : "idle";
    const status = { think: "Thinking...", talk: "Answering...", listen: "Listening...", happy: "Happy to help!", idle: "Online. Ask me anything!" }[mood];
    return (
      <section className="window chat-window" role="dialog" aria-labelledby="chat-title">
        <div className="title-bar">
          <div className="title-bar-text" id="chat-title">
            <FloppyArt size={16} /> Ask Floppy
          </div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={close} />
          </div>
        </div>
        <div className="chat-head">
          <FloppyCharacter mood={mood} size={64} />
          <div>
            <b>Floppy</b>
            <small><i className="chat-online" /> {status}</small>
          </div>
        </div>
        <div className="chat-log" ref={logRef} role="log" aria-live="polite">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <h3>Hi, I'm Floppy!</h3>
              <p>I'm an AI helper. Ask me anything about {profile.name}'s work.</p>
              <div className="chips-row">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => ask(s)}>{s}</button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => {
              const last = i === messages.length - 1;
              const { text, actions } = m.role === "assistant" ? parseReply(m.content) : { text: m.content, actions: [] };
              const thinking = m.role === "assistant" && !text && busy && last;
              if (!text && !thinking) return null;
              return (
                <div key={i} className={`chat-msg ${m.role}`}>
                  {thinking ? (
                    <span className="typing" aria-label="Floppy is typing"><i /><i /><i /></span>
                  ) : m.role === "assistant" ? (
                    <MessageText text={text} />
                  ) : (
                    text
                  )}
                  {actions.length > 0 && !(busy && last) && (
                    <div className="chat-actions">
                      {actions.map((id) => (
                        <button key={id} onClick={() => openApp(id)}>Open {ACTION_LABELS[id] ?? apps[id].title}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            ref={inputRef}
            type="text"
            aria-label="Your question"
            placeholder="Ask a question..."
            autoComplete="off"
            maxLength={MAX_USER_CHARS}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {busy ? (
            <button type="button" onClick={() => abort.current?.abort()}>Stop</button>
          ) : (
            <button type="submit" className="default" disabled={!input.trim()}>Send</button>
          )}
        </form>
        <div className="chat-foot">
          <small>AI can make mistakes. Chats are processed by Anthropic.</small>
          {messages.length > 0 && !busy && (
            <button className="chat-clear" onClick={() => setMessages([])}>New chat</button>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className={`floppy ${view ? "has-bubble" : ""} ${windowOpen && !view ? "tucked" : ""}`}>
      {view && (
        <div className="bubble" role="status" aria-label="Floppy, the portfolio assistant">
          <button className="bubble-close" aria-label="Close" onClick={close}>×</button>

          {view === "tip" && tip && (
            <>
              <p>{tip.text}</p>
              <div className="row">
                <button
                  className="default"
                  onClick={() => {
                    setView("chat");
                    if (tip.ask) ask(tip.ask);
                  }}
                >
                  Yes, please
                </button>
                <button onClick={close}>No, thanks</button>
              </div>
            </>
          )}

          {view === "greet" && (
            <>
              <p>Hi, I'm Floppy! It looks like you're checking out {profile.name}'s portfolio. Would you like help?</p>
              <div className="row">
                <button className="default" onClick={() => setView("chat")}>Ask me anything</button>
                <button onClick={() => showNews(0)}>What's new?</button>
              </div>
            </>
          )}

          {view === "news" && item && (
            <>
              <small className="news-meta">{item.source} · {item.date}</small>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="row">
                {item.url && <a className="btn-link" href={item.url} target="_blank" rel="noreferrer">Read more</a>}
                {NEWS.length > 1 && (
                  <button onClick={() => showNews(nextUnseen >= 0 ? nextUnseen : (newsIndex + 1) % NEWS.length)}>
                    {nextUnseen >= 0 ? "Next update" : "Older"}
                  </button>
                )}
                <button onClick={() => setView("chat")}>Ask me</button>
              </div>
            </>
          )}
        </div>
      )}

      <button
        className="floppy-char"
        aria-label="Ask Floppy, the AI assistant"
        title="Click to chat. Right-click for options."
        onClick={() => setView("chat")}
        onContextMenu={(e) => openMenu(e, contextItems)}
      >
        {!floppyUsed && !view && (
          <span className="fd-hint" key={hint} aria-hidden="true">{HINTS[hint]}</span>
        )}
        <FloppyCharacter mood={view === "news" || view === "greet" || view === "tip" ? "happy" : "idle"} />
      </button>
      {menu}
    </div>
  );
}

function MessageText({ text }) {
  return splitLinks(text).map((part, i) =>
    part.url ? (
      <a key={i} href={part.url} target="_blank" rel="noreferrer">{part.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a>
    ) : (
      part.text
    )
  );
}

export function FloppyArt({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M1 1h12l2 2v12H1z" fill="#23409a" stroke="#000" strokeWidth=".5" />
      <rect x="4" y="1" width="7" height="4" fill="#c0c0c0" />
      <rect x="8" y="1.500" width="2" height="3" fill="#23409a" />
      <rect x="3" y="7" width="10" height="7.500" fill="#fff" />
      <g className="floppy-eyes">
        <rect x="5" y="8.500" width="1.500" height="2" fill="#000" />
        <rect x="9.500" y="8.500" width="1.500" height="2" fill="#000" />
      </g>
      <path d="M6 12h1v1h2v-1h1" fill="none" stroke="#000" strokeWidth=".6" />
    </svg>
  );
}
