import assert from "node:assert/strict";
import test from "node:test";
import { matchesQuery, matchesStatus, statusLabel } from "../src/lib/catalog.mjs";

test("search combines title, author and series words and ignores punctuation", () => {
  const text = "The Wise Man’s Fear Patrick Rothfuss The Kingkiller Chronicle";
  assert.equal(matchesQuery(text, "rothfuss kingkiller fear"), true);
  assert.equal(matchesQuery(text, "wise man's"), true);
  assert.equal(matchesQuery(text, "stormlight"), false);
  assert.equal(matchesQuery("Shōgun", "shogun"), true);
  assert.equal(matchesQuery(text, "   "), true);
});

test("reading and listening remain independent, including unknown history", () => {
  assert.equal(statusLabel(null, true), "Listened");
  assert.equal(statusLabel(true, false), "Read");
  assert.equal(statusLabel(true, true), "Read & listened");
  assert.equal(matchesStatus(null, true, "read"), false);
  assert.equal(matchesStatus(null, true, "both"), false);
  assert.equal(matchesStatus(true, true, "both"), true);
  assert.equal(matchesStatus(true, true, "listened"), true);
  assert.equal(matchesStatus(false, false, "all"), true);
});
