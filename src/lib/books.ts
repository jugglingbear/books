import { compareTitles } from "./catalog.mjs";
import { getCollection, type CollectionEntry } from "astro:content";

export type Book = CollectionEntry<"books">;
export type Universe = CollectionEntry<"universes">;
export type Series = CollectionEntry<"series">;
export const base = import.meta.env.BASE_URL.replace(/\/$/, "");
export const bookUrl = (book: Book) => `${base}/book/${book.id}/`;
export const seriesUrl = (series: Series) => `${base}/series/${series.id}/`;
export const universeUrl = (universe: Universe) => `${base}/universe/${universe.id}/`;
export const sortedBooks = (books: Book[]) => [...books].sort((a, b) =>
  compareTitles(a.data.title, b.data.title));

export async function catalog() {
  const books = sortedBooks(await getCollection("books"));
  const series = (await getCollection("series")).sort((a, b) => compareTitles(a.data.title, b.data.title));
  const universes = (await getCollection("universes")).sort((a, b) => compareTitles(a.data.title, b.data.title));
  const universeNames = new Set(universes.map((item) => item.data.title));
  if (universeNames.size !== universes.length) throw new Error("Duplicate universe title");
  for (const universe of universes) {
    if (!universe.body?.trim()) throw new Error(`${universe.id}: missing spoiler-free description`);
    const related = universe.data.relatedBooks;
    if (new Set(related).size !== related.length) throw new Error(`${universe.id}: duplicate related book`);
    for (const id of related) {
      const book = books.find((item) => item.id === id);
      if (!book) throw new Error(`${universe.id}: unknown related book ${id}`);
      if (book.data.universe === universe.data.title) throw new Error(`${id}: both canonical and related`);
    }
  }
  const names = new Set(series.map((item) => item.data.title));
  for (const book of books) {
    if (book.data.series && !names.has(book.data.series)) {
      throw new Error(`${book.id}: unknown series ${book.data.series}`);
    }
    if (book.data.universe && !universeNames.has(book.data.universe)) {
      throw new Error(`${book.id}: unknown universe ${book.data.universe}`);
    }
    if (!book.body?.trim()) throw new Error(`${book.id}: missing spoiler-free description`);
  }
  return { books, series, universes, authors: [...new Set(books.map((book) => book.data.author))].sort() };
}

export function inSeries(books: Book[], name: string) {
  return books.filter((book) => book.data.series === name).sort((a, b) =>
    (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || compareTitles(a.data.title, b.data.title));
}

export function inUniverse(books: Book[], name: string) {
  return books.filter((book) => book.data.universe === name);
}
