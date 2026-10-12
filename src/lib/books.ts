import { compareTitles } from "./catalog.mjs";
import { getCollection, type CollectionEntry } from "astro:content";

export type Book = CollectionEntry<"books">;
export type Series = CollectionEntry<"series">;
export const base = import.meta.env.BASE_URL.replace(/\/$/, "");
export const bookUrl = (book: Book) => `${base}/book/${book.id}/`;
export const seriesUrl = (series: Series) => `${base}/series/${series.id}/`;
export const sortedBooks = (books: Book[]) => [...books].sort((a, b) =>
  compareTitles(a.data.title, b.data.title));

export async function catalog() {
  const books = sortedBooks(await getCollection("books"));
  const series = (await getCollection("series")).sort((a, b) => compareTitles(a.data.title, b.data.title));
  const names = new Set(series.map((item) => item.data.title));
  for (const book of books) {
    if (book.data.series && !names.has(book.data.series)) {
      throw new Error(`${book.id}: unknown series ${book.data.series}`);
    }
    if (!book.body?.trim()) throw new Error(`${book.id}: missing spoiler-free description`);
  }
  return { books, series, authors: [...new Set(books.map((book) => book.data.author))].sort() };
}

export function inSeries(books: Book[], name: string) {
  return books.filter((book) => book.data.series === name).sort((a, b) =>
    (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || compareTitles(a.data.title, b.data.title));
}
