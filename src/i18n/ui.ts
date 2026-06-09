import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

export const ui = {
  fr: {
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.projects': 'Réalisations',
    'nav.about': 'À propos',
    'nav.pricing': 'Tarifs',
    'nav.contact': 'Contact',
    'cta.requestQuote': 'Demander un devis',
    'cta.discoverServices': 'Découvrir nos services',
    'cta.seeProjects': 'Voir nos réalisations',
    'cta.discussProject': 'Discuter de votre projet',
    'cta.contactUs': 'Nous contacter',
    'meta.home.title': 'Karib Teck – Agence Web aux Antilles',
    'meta.home.description':
      'Karib Teck, agence web aux Antilles. Création de sites web, applications mobiles et solutions digitales clé en main pour les entreprises des DOM.',
    'hero.badge': 'Agence Web aux Antilles',
    'hero.title.lead': 'Nous créons des',
    'hero.title.hl': 'sites web',
    'hero.title.tail': 'qui propulsent votre entreprise.',
    'hero.sub':
      'Karib Teck accompagne les entreprises, entrepreneurs et marques des DOM dans leur transformation digitale avec des sites modernes, rapides et performants.',
    'services.badge': 'Nos Services',
    'services.title.lead': 'Des solutions',
    'services.title.hl': 'adaptées à vos ambitions',
    'services.sub':
      "De la vitrine en ligne à l'application métier complexe, nous couvrons l'intégralité de votre besoin digital avec une expertise de pointe.",
    'stack.label': 'Des technologies modernes pour des résultats durables',
    'process.badge': 'Notre Méthode',
    'process.title.lead': 'Un processus',
    'process.title.hl': 'simple et transparent',
    'process.sub':
      'De la première réunion à la mise en ligne, nous vous accompagnons à chaque étape avec clarté et rigueur.',
    'why.badge': 'Pourquoi Karib Teck',
    'why.title.lead': 'Une agence',
    'why.title.hl': 'ancrée aux Antilles,',
    'why.title.tail': 'tournée vers le monde',
    'why.sub':
      'Nous connaissons les réalités du marché local des DOM tout en maîtrisant les standards internationaux du développement web et logiciel.',
    'why.expertiseLabel': "Nos domaines d'expertise",
    'projects.badge': 'Nos Réalisations',
    'projects.title.lead': 'Des projets qui',
    'projects.title.hl': "parlent d'eux-mêmes",
    'projects.sub':
      'Exemples de projets que nous concevons et réalisons pour les entreprises de Guadeloupe, Martinique et des DOM.',
    'pricing.badge': 'Tarifs',
    'pricing.title.lead': 'Des offres',
    'pricing.title.hl': 'transparentes',
    'pricing.sub':
      'Chaque projet est unique. Ces tarifs sont indicatifs — contactez-nous pour un devis sur mesure adapté à vos besoins exacts.',
    'pricing.popular': '⭐ Le plus choisi',
    'contact.badge': 'Contact',
    'contact.title.lead': 'Parlons de votre',
    'contact.title.hl': 'projet',
    'contact.intro':
      'Une idée, un besoin, un projet à lancer ? Remplissez le formulaire ou contactez-nous directement. Nous vous répondons sous 24h.',
    'contact.form.firstName': 'Prénom',
    'contact.form.firstName.placeholder': 'Jean',
    'contact.form.lastName': 'Nom',
    'contact.form.lastName.placeholder': 'Dupont',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'jean@entreprise.com',
    'contact.form.phone': 'Téléphone',
    'contact.form.phone.placeholder': '+590 690 ...',
    'contact.form.company': 'Entreprise',
    'contact.form.company.placeholder': 'Nom de votre entreprise',
    'contact.form.message': 'Votre message',
    'contact.form.message.placeholder':
      'Parlez-nous de votre projet, de vos objectifs, de votre budget approximatif...',
    'contact.form.submit': 'Envoyer ma demande de devis',
    'footer.servicesTitle': 'Services',
    'footer.companyTitle': 'Entreprise',
    'footer.legalTitle': 'Légal',
    'footer.followTitle': 'Suivez-nous',
    'footer.legal.mentions': 'Mentions légales',
    'footer.legal.privacy': 'Politique de confidentialité',
    'footer.legal.cgv': 'CGV',
    'footer.rights': 'Tous droits réservés.',
  },
} as const;

export const routes = {
  fr: {
    home: '/',
  },
  en: {
    home: '/en/',
  },
} as const;

export type RouteKey = keyof (typeof routes)['fr'];

export type UiKey = keyof (typeof ui)['fr'];

export const SUPPORTED_UI_LOCALES = Object.keys(ui) as Locale[];

export function getUiDict(locale: Locale) {
  return ui[locale as keyof typeof ui] ?? ui[DEFAULT_LOCALE as keyof typeof ui];
}
