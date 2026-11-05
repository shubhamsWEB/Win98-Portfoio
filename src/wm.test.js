import test from "node:test";
import assert from "node:assert/strict";
import { reducer, initialState, focusedId } from "./wm.js";

const viewport = { w: 1000, h: 700 };
const size = { w: 400, h: 300 };
const open = (s, id, props) => reducer(s, { type: "open", id, size, viewport, props });

test("opening raises and focuses; reopening does not duplicate", () => {
  let s = open(open(initialState, "a"), "b");
  assert.equal(focusedId(s), "b");
  s = open(s, "a", { tab: 1 });
  assert.deepEqual(s.order, ["b", "a"]);
  assert.deepEqual(s.windows.a.props, { tab: 1 });
});

test("taskbar click cycles focus -> minimize -> restore", () => {
  let s = open(open(initialState, "a"), "b");
  s = reducer(s, { type: "taskbar", id: "a" });
  assert.equal(focusedId(s), "a");
  s = reducer(s, { type: "taskbar", id: "a" });
  assert.equal(s.windows.a.minimized, true);
  assert.equal(focusedId(s), "b");
  s = reducer(s, { type: "taskbar", id: "a" });
  assert.equal(s.windows.a.minimized, false);
  assert.equal(focusedId(s), "a");
});

test("closing hands focus to the next window", () => {
  let s = open(open(initialState, "a"), "b");
  s = reducer(s, { type: "close", id: "b" });
  assert.equal(s.windows.b, undefined);
  assert.equal(focusedId(s), "a");
  assert.equal(focusedId(reducer(s, { type: "close", id: "a" })), null);
});

test("windows always fit a small viewport", () => {
  const s = reducer(initialState, {
    type: "open", id: "a", size: { w: 900, h: 900 }, viewport: { w: 320, h: 500 },
  });
  const { x, y, w, h } = s.windows.a;
  assert.ok(x >= 0 && y >= 0 && x + w <= 320 && y + h <= 500);
});
