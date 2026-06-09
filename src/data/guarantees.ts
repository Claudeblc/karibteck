import type { Guarantee, Locale, Localized } from '@/types';

interface GuaranteeData {
  icon: string;
  title: Localized<string>;
  description: Localized<string>;
}

const GUARANTEES_DATA: GuaranteeData[] = [
  {
    icon: '⏱️',
    title: { fr: 'Devis sous 24h', en: 'Quote within 24h' },
    description: {
      fr: 'Vous nous contactez, nous revenons vers vous sous 24h avec une première réponse claire.',
      en: 'You reach out, we get back to you within 24h with a clear first answer.',
    },
  },
  {
    icon: '🧱',
    title: { fr: 'Code propre & maintenable', en: 'Clean, maintainable code' },
    description: {
      fr: 'Un code structuré et documenté, pensé pour durer et évoluer — jamais une boîte noire.',
      en: 'Structured, documented code built to last and evolve — never a black box.',
    },
  },
  {
    icon: '⚡',
    title: { fr: 'Performance & SEO inclus', en: 'Performance & SEO included' },
    description: {
      fr: 'Rapidité, accessibilité et référencement sont intégrés dès la conception, pas en option.',
      en: 'Speed, accessibility and search optimization are built in from the start, not an add-on.',
    },
  },
  {
    icon: '🔑',
    title: { fr: 'Vous êtes propriétaire', en: 'You own everything' },
    description: {
      fr: 'Le code, les accès et les données vous appartiennent intégralement à la livraison.',
      en: 'The code, accesses and data are fully yours on delivery.',
    },
  },
  {
    icon: '💬',
    title: { fr: 'Accompagnement continu', en: 'Ongoing support' },
    description: {
      fr: 'Nous restons disponibles après la mise en ligne : maintenance, évolutions et conseils.',
      en: 'We stay available after launch: maintenance, evolutions and advice.',
    },
  },
  {
    icon: '🪪',
    title: { fr: 'Transparence des prix', en: 'Transparent pricing' },
    description: {
      fr: 'Un devis détaillé et sans surprise : vous savez exactement ce que vous payez et pourquoi.',
      en: 'A detailed, no-surprise quote: you know exactly what you pay and why.',
    },
  },
];

export function getGuarantees(locale: Locale): Guarantee[] {
  return GUARANTEES_DATA.map((g) => ({
    icon: g.icon,
    title: g.title[locale],
    description: g.description[locale],
  }));
}
