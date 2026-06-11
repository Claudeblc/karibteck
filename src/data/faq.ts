import type { FaqItem, Locale, Localized } from '@/types';

interface FaqData {
  question: Localized<string>;
  answer: Localized<string>;
}

const FAQ_DATA: FaqData[] = [
  {
    question: { fr: 'Combien coûte un site web ?', en: 'How much does a website cost?' },
    answer: {
      fr: 'Un site vitrine démarre autour de 990€, un site ou une application plus avancée autour de 2 900€, et les projets sur mesure (logiciels, apps mobiles) sont sur devis. Chaque projet étant unique, nous établissons un devis précis après un premier échange.',
      en: 'A brochure site starts around €990, a more advanced site or app around €2,900, and custom projects (software, mobile apps) are quoted individually. Since every project is unique, we provide a precise quote after a first conversation.',
    },
  },
  {
    question: { fr: 'En combien de temps livrez-vous ?', en: 'How long does delivery take?' },
    answer: {
      fr: 'Un site vitrine prend généralement 2 à 4 semaines, un projet plus complexe quelques mois. Nous fixons un calendrier clair dès la phase de conception et livrons par étapes.',
      en: 'A brochure site usually takes 2 to 4 weeks, a more complex project a few months. We set a clear schedule from the design phase and deliver in stages.',
    },
  },
  {
    question: {
      fr: 'Travaillez-vous à distance, hors de la Guadeloupe ?',
      en: 'Do you work remotely, outside Guadeloupe?',
    },
    answer: {
      fr: 'Oui. Nous sommes ancrés aux Antilles et connaissons le marché local des DOM, mais nous travaillons avec des clients partout, en présentiel comme à distance.',
      en: 'Yes. We are rooted in the French West Indies and know the local overseas market, but we work with clients anywhere, on-site or remotely.',
    },
  },
  {
    question: { fr: 'Assurez-vous la maintenance ?', en: 'Do you handle maintenance?' },
    answer: {
      fr: 'Oui. Nous proposons maintenance, mises à jour de sécurité et évolutions après la mise en ligne. Nous ne disparaissons pas après la livraison.',
      en: 'Yes. We offer maintenance, security updates and evolutions after launch. We don’t disappear after delivery.',
    },
  },
  {
    question: {
      fr: 'À qui appartient le site une fois livré ?',
      en: 'Who owns the site once delivered?',
    },
    answer: {
      fr: 'À vous, intégralement : le code, les accès, le nom de domaine et les données vous appartiennent. Vous n’êtes jamais prisonnier de notre agence.',
      en: 'You do, entirely: the code, accesses, domain name and data are yours. You are never locked into our agency.',
    },
  },
  {
    question: {
      fr: 'Gérez-vous le référencement (SEO) ?',
      en: 'Do you handle search optimization (SEO)?',
    },
    answer: {
      fr: 'Oui. L’optimisation technique pour le référencement et la performance est intégrée à chaque site dès sa conception, pour que vous soyez visible sur Google et les moteurs IA.',
      en: 'Yes. Technical optimization for search and performance is built into every site from the start, so you’re visible on Google and AI search engines.',
    },
  },
  {
    question: { fr: 'Quelles technologies utilisez-vous ?', en: 'Which technologies do you use?' },
    answer: {
      fr: 'Nous choisissons la technologie adaptée à votre besoin : WordPress, React/Next.js, React Native ou Flutter pour le mobile, Node.js, PHP/Laravel et PostgreSQL côté back-end, et l’intégration d’IA quand elle apporte de la valeur.',
      en: 'We pick the right technology for your need: WordPress, React/Next.js, React Native or Flutter for mobile, Node.js, PHP/Laravel and PostgreSQL on the back-end, and AI integration when it adds value.',
    },
  },
];

export function getFaq(locale: Locale): FaqItem[] {
  return FAQ_DATA.map((f) => ({
    question: f.question[locale],
    answer: f.answer[locale],
  }));
}
