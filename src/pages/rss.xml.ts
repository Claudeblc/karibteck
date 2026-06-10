import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadPosts, entrySlug } from '@/lib/blog';
import { localizeBlogPostPath } from '@/i18n/utils';
import { ORGANIZATION_NAME } from '@/lib/constants';

export async function GET(context: APIContext) {
  const posts = await loadPosts('fr');
  return rss({
    title: `${ORGANIZATION_NAME} — Blog`,
    description: 'Articles de Karib Teck, agence web aux Antilles.',
    site: context.site!,
    items: posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.excerpt,
      pubDate: entry.data.date,
      link: localizeBlogPostPath(entrySlug(entry), 'fr'),
    })),
  });
}
