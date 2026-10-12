import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const audit = JSON.parse(readFileSync(new URL("../data/audiobook-import.json", import.meta.url), "utf8"));
const vault = new URL("../vault/books/", import.meta.url);

test("the import accounts for every track exactly once, including excluded commentary", () => {
  const paths = audit.books.flatMap((book) => book.audioFiles).concat(audit.excludedCommentaryFiles);
  assert.equal(paths.length, audit.audioFileCount);
  assert.equal(new Set(paths).size, paths.length);
  assert.equal(audit.books.length, audit.bookCount);
  const ids = new Set(audit.books.map((book) => book.bookId));
  assert.equal(ids.size, audit.bookCount);
  const records = new Set(readdirSync(vault));
  const removed = new Set((audit.removedFromCatalog ?? []).map((book) => book.bookId));
  for (const id of removed) {
    assert.ok(ids.has(id), `Removal must refer to an imported record: ${id}`);
    assert.ok(!records.has(`${id}.md`), `Removed record is still in the catalog: ${id}`);
  }
  for (const id of ids) {
    assert.ok(records.has(`${id}.md`) || removed.has(id), `Missing imported record: ${id}`);
  }
});

test("alternate narrations are reconciled while the original short version stays distinct", () => {
  const wind = audit.books.find((book) => book.bookId === "patrick-rothfuss-the-name-of-the-wind");
  assert.ok(wind.audioFiles.some((path) => path.includes("Nick Podehl")));
  assert.ok(wind.audioFiles.some((path) => path.includes("Rupert Degas")));
  assert.ok(wind.audioFiles.some((path) => path.includes("Fred Majors")));
  assert.ok(audit.books.some((book) => book.bookId === "orson-scott-card-ender-s-game-original-novelette"));
});
