import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const language = z.enum(["en", "vi", "de"]);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const THEME_TAGS = {
  "hanh-chinh": "Hành chính",
  "so-thich": "Sở thích",
  pride: "Pride",
} as const;

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      lang: language,
      slug,
      tags: z.array(z.string()).default([]),
      theme: z.enum(["hanh-chinh", "so-thich", "pride"]).default("so-thich"),
      draft: z.boolean().default(false),
    })
    // No tags? Fall back to a label derived from the theme.
    .transform((data) => ({
      ...data,
      tags: data.tags.length ? data.tags : [THEME_TAGS[data.theme]],
    })),
});

const translations = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/translations",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    translationOf: slug,
    lang: language,
    sourceHash: z.string().min(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, translations };
