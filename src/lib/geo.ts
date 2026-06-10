import { SITE_URL, ORGANIZATION_NAME, AREA_SERVED } from '@/lib/constants';
import { getServices } from '@/data/services';
import { getFaq } from '@/data/faq';
import { loadPosts, entrySlug } from '@/lib/blog';
import { localizeBlogPostPath } from '@/i18n/utils';

const AI_USER_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
];

export function buildRobotsTxt(): string {
  const lines = ['User-agent: *', 'Allow: /', ''];
  for (const ua of AI_USER_AGENTS) {
    lines.push(`User-agent: ${ua}`, 'Allow: /', '');
  }
  lines.push(`Sitemap: ${SITE_URL}/sitemap-index.xml`, '');
  return lines.join('\n');
}

export function buildLlmsTxt(): string {
  const services = getServices('fr');
  return [
    `# ${ORGANIZATION_NAME}`,
    '',
    `> Agence web aux Antilles/DOM. Création de sites web, applications mobiles, logiciels métier, e-commerce et intégration d'IA pour les entreprises de ${AREA_SERVED.join(', ')}.`,
    '',
    '## Services',
    ...services.map((s) => `- [${s.title}](${SITE_URL}/#services): ${s.description}`),
    '',
    '## Liens',
    `- [Accueil](${SITE_URL}/)`,
    `- [Version anglaise](${SITE_URL}/en/)`,
    '',
  ].join('\n');
}

export async function buildLlmsFullTxt(): Promise<string> {
  const services = getServices('fr');
  const faq = getFaq('fr');
  const posts = await loadPosts('fr');
  return [
    buildLlmsTxt(),
    '## Détail des services',
    ...services.flatMap((s) => [
      `### ${s.title}`,
      s.description,
      `Technologies : ${s.tags.join(', ')}`,
      '',
    ]),
    '## Articles du blog',
    ...posts.map(
      (p) =>
        `- [${p.data.title}](${SITE_URL}${localizeBlogPostPath(entrySlug(p), 'fr')}): ${p.data.excerpt}`,
    ),
    '',
    '## FAQ',
    ...faq.flatMap((f) => [`### ${f.question}`, f.answer, '']),
  ].join('\n');
}

export function buildAiTxt(): string {
  return [
    `# AI usage policy — ${ORGANIZATION_NAME}`,
    '',
    'Content on this site may be used by AI systems to answer questions about our services,',
    'provided the agency is cited accurately and not misrepresented.',
    '',
    `Contact: ${SITE_URL}/#contact`,
    '',
  ].join('\n');
}
