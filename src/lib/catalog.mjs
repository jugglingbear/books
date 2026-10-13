/** Normalize accents and punctuation so filenames and display titles search alike. */
export function normalize(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

/** Match every query word, allowing title, author, and series to work together. */
export function matchesQuery(text, query) {
  const haystack = normalize(text);
  return normalize(query).split(/\s+/).every((word) => haystack.includes(word));
}

/** Unknown reading history is deliberately distinct from an explicit false. */
export function statusLabel(read, listened) {
  if (read === true && listened) return "Read & listened";
  if (read === true) return "Read";
  if (listened) return "Listened";
  if (read === false) return "Not read or listened";
  return "Not recorded";
}

export function matchesStatus(read, listened, filter, queued = false) {
  if (filter === "queue") return queued;
  if (filter === "read") return read === true;
  if (filter === "listened") return listened === true;
  if (filter === "both") return read === true && listened === true;
  return true;
}

/** Alphabetize titles without leading English articles, retaining numeric volume order. */
export function compareTitles(left, right) {
  const key = (title) => title.trim().replace(/^(?:a|an|the)\s+/i, "");
  return key(left).localeCompare(key(right), "en", { numeric: true, sensitivity: "base" })
    || left.localeCompare(right, "en", { numeric: true });
}

/** Universe membership is independent of series membership, including standalone works. */
export function matchesShelf(series, universe, selection) {
  if (!selection) return true;
  if (selection.startsWith("universe:")) return universe === selection.slice("universe:".length);
  return selection === "__standalone" ? !series : series === selection;
}

/** Only offer genres represented on the selected series or universe shelf. */
export function shelfGenres(books, selection) {
  return new Set(books.filter((book) => matchesShelf(book.series, book.universe, selection))
    .flatMap((book) => book.genres));
}

/** Sample without replacement, leaving the collection and its ordering unchanged. */
export function sampleBooks(items, count, random = Math.random) {
  const pool = [...items];
  const selected = [];
  while (selected.length < count && pool.length) {
    const index = Math.floor(random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }
  return selected;
}
