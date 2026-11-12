import test from "node:test";
import assert from "node:assert/strict";
import { createBoard, reveal, toggleFlag, statusOf, neighbours } from "./apps/bughunt.js";
import { initialCalc, press } from "./apps/calc.js";
import { resolveUrl, run } from "./apps/dos.js";

const keys = (seq) => seq.reduce(press, initialCalc).display;

test("calculator arithmetic and edge cases", () => {
  assert.equal(keys(["1", "2", "+", "3", "="]), "15");
  assert.equal(keys(["2", "+", "3", "*", "4", "="]), "20"); // left to right, like a real one
  assert.equal(keys(["0", ".", "1", "+", "0", ".", "2", "="]), "0.3");
  assert.equal(keys(["5", "/", "0", "="]), "Error");
  assert.equal(keys(["5", "/", "0", "=", "C"]), "0");
  assert.equal(keys(["5", "/", "0", "=", "7"]), "7");
  assert.equal(keys(["9", "sqrt"]), "3");
  assert.equal(keys(["1", ".", ".", "5"]), "1.5");
});

test("bug hunt: first click is safe and has no adjacent bugs", () => {
  for (let i = 0; i < 50; i++) {
    const cells = createBoard(9, 9, 10, 40);
    assert.equal(cells.filter((c) => c.bug).length, 10);
    assert.equal(cells[40].bug, false);
    assert.equal(cells[40].near, 0);
  }
});

test("bug hunt: reveal floods, flags block, win and loss detected", () => {
  let cells = createBoard(3, 1, 1, 0, () => 0.99);
  assert.deepEqual(cells.map((c) => c.bug), [false, false, true]);
  cells = reveal(cells, 0, 3, 1);
  assert.deepEqual(cells.map((c) => c.open), [true, true, false]);
  assert.equal(statusOf(cells), "won");
  assert.equal(statusOf(reveal(cells, 2, 3, 1)), "lost");
  const flagged = toggleFlag(cells, 2);
  assert.equal(reveal(flagged, 2, 3, 1)[2].open, false);
  assert.deepEqual(neighbours(0, 3, 1), [1]);
});

test("dos commands", () => {
  assert.deepEqual(run("xyzzy", "C:\\").out, ["Bad command or file name"]);
  assert.equal(run("CD PROJECTS", "C:\\").cwd, "C:\\PROJECTS");
  assert.equal(run("cd..", "C:\\PROJECTS").cwd, "C:\\");
  assert.equal(run("open murmur", "C:\\").url, "https://usemurmur.live/");
  assert.equal(run("start notepad", "C:\\").app, "notepad");
  assert.equal(run("start sudoku", "C:\\").app, "sudoku");
  assert.ok(run("type readme.txt", "C:\\").out[0].startsWith("Welcome"));
  assert.equal(run("exit", "C:\\").exit, true);
  assert.equal(run("resume", "C:\\").app, "resume");
  assert.deepEqual(run("", "C:\\").out, []);
});

test("run dialog only ever resolves web URLs", () => {
  assert.equal(resolveUrl("javascript:alert(1)"), null);
  assert.equal(resolveUrl("data:text/html,x"), null);
  assert.equal(resolveUrl("notepadd"), null);
  assert.equal(resolveUrl("github.com"), "https://github.com/");
  assert.equal(resolveUrl("http://example.com/a"), "http://example.com/a");
});
