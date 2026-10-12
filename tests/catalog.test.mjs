import assert from "node:assert/strict";
import test from "node:test";
import { compareTitles, matchesQuery, matchesShelf, matchesStatus, shelfGenres, statusLabel } from "../src/lib/catalog.mjs";

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

test("library sorting ignores only leading articles and keeps numeric volume order", () => {
  const titles = ["The Way of Kings", "An Ember", "A Change of Plans", "The Book 10", "Book 2", "Theatre"];
  assert.deepEqual(titles.sort(compareTitles), [
    "Book 2", "The Book 10", "A Change of Plans", "An Ember", "Theatre", "The Way of Kings",
  ]);
  assert.ok(compareTitles("  tHe Apple", "Banana") < 0);
  assert.ok(compareTitles("A", "Apple") < 0);
  assert.ok(compareTitles("A Tale", "The Tale") < 0);
});

test("universe filtering includes series and standalones without changing series filters", () => {
  assert.equal(matchesShelf("Mistborn", "The Cosmere", "universe:The Cosmere"), true);
  assert.equal(matchesShelf("", "The Cosmere", "universe:The Cosmere"), true);
  assert.equal(matchesShelf("Skyward", "", "universe:The Cosmere"), false);
  assert.equal(matchesShelf("", "", "universe:The Cosmere"), false);
  assert.equal(matchesShelf("Mistborn", "The Cosmere", "Mistborn"), true);
  assert.equal(matchesShelf("Mistborn", "The Cosmere", "The Stormlight Archive"), false);
  assert.equal(matchesShelf("", "The Cosmere", "__standalone"), true);
  assert.equal(matchesShelf("Mistborn", "The Cosmere", "__standalone"), false);
  assert.equal(matchesShelf("Skyward", "", ""), true);
  assert.equal(matchesQuery("Warbreaker Brandon Sanderson The Cosmere", "cosmere warbreaker"), true);
});

test("changing to Cosmere excludes stale Dystopian genre while retaining compatible genres", () => {
  const books = [
    { series: "Divergent", universe: "", genres: ["Dystopian", "Science Fiction"] },
    { series: "Mistborn", universe: "The Cosmere", genres: ["Fantasy"] },
    { series: "", universe: "The Cosmere", genres: ["Fantasy", "Science Fiction"] },
  ];
  assert.equal(shelfGenres(books, "Divergent").has("Dystopian"), true);
  const cosmere = shelfGenres(books, "universe:The Cosmere");
  assert.equal(cosmere.has("Dystopian"), false);
  assert.equal(cosmere.has("Fantasy"), true);
  assert.equal(cosmere.has("Science Fiction"), true);
  assert.equal(shelfGenres(books, "").has("Dystopian"), true);
});
