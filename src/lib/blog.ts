import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/types';

export type BlogEntry = CollectionEntry<'blog'>;

/** Slug without the locale folder prefix (e.g. "fr/foo" -> "foo"). */
export function entrySlug(entry: BlogEntry): string {
  return entry.id.replace(/^(fr|en)\//, '').replace(/\.mdx$/, '');
}

export async function loadPosts(locale: Locale): Promise<BlogEntry[]> {
  const all = await getCollection('blog');
  return all
    .filter((e) => e.data.locale === locale && !e.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function loadPostsByTag(locale: Locale, tag: string): Promise<BlogEntry[]> {
  return (await loadPosts(locale)).filter((e) => e.data.tags.includes(tag));
}

export async function allTags(locale: Locale): Promise<string[]> {
  const posts = await loadPosts(locale);
  return [...new Set(posts.flatMap((e) => e.data.tags))].sort();
}

/** The same article in the other locale, if it exists. */
export async function findTranslation(
  entry: BlogEntry,
  target: Locale,
): Promise<BlogEntry | undefined> {
  const all = await getCollection('blog');
  return all.find(
    (e) => e.data.locale === target && e.data.translationKey === entry.data.translationKey,
  );
}
