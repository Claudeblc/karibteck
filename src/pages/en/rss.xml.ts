import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadPosts, entrySlug } from '@/lib/blog';
import { localizeBlogPostPath } from '@/i18n/utils';
import { ORGANIZATION_NAME } from '@/lib/constants';

export async function GET(context: APIContext) {
  const posts = await loadPosts('en');
  return rss({
    title: `${ORGANIZATION_NAME} — Blog`,
    description: 'Articles by Karib Teck, web agency in the French West Indies.',
    site: context.site!,
    items: posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.excerpt,
      pubDate: entry.data.date,
      link: localizeBlogPostPath(entrySlug(entry), 'en'),
    })),
  });
}
