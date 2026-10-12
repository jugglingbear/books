import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const books = defineCollection({
  loader: glob({ pattern: "*.md", base: "./vault/books" }),
  schema: z.object({
    title: z.string().min(1),
    author: z.string().min(1),
    genres: z.array(z.string().min(1)).min(1),
    series: z.string().default(""),
    order: z.number().nullable().default(null),
    read: z.boolean().nullable().default(null),
    listened: z.boolean().default(false),
    audioSources: z.array(z.enum(["Audible", "GraphicAudio"])).default([]),
    cover: z.url().or(z.literal("")).default(""),
    coverCrop: z.object({
      top: z.number().min(0).max(40),
      right: z.number().min(0).max(40),
      bottom: z.number().min(0).max(40),
      left: z.number().min(0).max(40),
    }).optional(),
    coverSource: z.url().or(z.literal("")).default(""),
    coverRegion: z.string().default(""),
    source: z.url().or(z.literal("")).default(""),
    year: z.number().nullable().default(null),
    kind: z.string().default("Book"),
    descriptionStatus: z.enum(["reviewed", "needs-review"]).default("reviewed"),
  }),
});
const series = defineCollection({
  loader: glob({ pattern: "*.md", base: "./vault/series" }),
  schema: z.object({ title: z.string().min(1), author: z.string().min(1) }),
});
export const collections = { books, series };
