import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    locale: z.enum(['fr', 'en']),
    translationKey: z.string(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
