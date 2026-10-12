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
  return "Not recorded";
}

export function matchesStatus(read, listened, filter) {
  if (filter === "read") return read === true;
  if (filter === "listened") return listened === true;
  if (filter === "both") return read === true && listened === true;
  return true;
}
