import { CONTACT_EMAIL, ORGANIZATION_NAME, SITE_URL } from '@/lib/constants';
import type { Locale, LegalDoc, Localized } from '@/types';

/**
 * Honest GENERIC legal templates. Bracketed `[…]` tokens are intentional
 * placeholders for the legal entity to complete (raison sociale, SIRET, RCS,
 * directeur de publication, hébergeur). `UPDATED` is a fixed literal date —
 * never `Date.now()` — so the published "last updated" line is stable.
 */
const UPDATED = '2026-06-09';

const LEGAL_NOTICE: Localized<LegalDoc> = {
  fr: {
    title: 'Mentions légales',
    description: `Mentions légales de ${ORGANIZATION_NAME}, agence web aux Antilles : éditeur, hébergeur et propriété intellectuelle.`,
    updated: UPDATED,
    sections: [
      {
        heading: 'Éditeur du site',
        paragraphs: [
          `Le présent site ${SITE_URL} est édité par ${ORGANIZATION_NAME}, [forme juridique] au capital de [montant] €.`,
          'Raison sociale : [Raison sociale]. SIRET : [SIRET]. RCS : [RCS — ville et numéro]. TVA intracommunautaire : [n° TVA].',
          `Siège social : [Adresse postale complète]. Contact : ${CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: 'Directeur de la publication',
        paragraphs: ['Le directeur de la publication est [Nom du directeur de la publication].'],
      },
      {
        heading: 'Hébergement',
        paragraphs: [
          'Le site est hébergé par [Hébergeur — raison sociale, adresse et téléphone à compléter].',
        ],
      },
      {
        heading: 'Propriété intellectuelle',
        paragraphs: [
          `L'ensemble des contenus de ce site (textes, visuels, logos, code) est la propriété de ${ORGANIZATION_NAME} ou de ses partenaires, sauf mention contraire. Toute reproduction ou réutilisation sans autorisation écrite préalable est interdite.`,
        ],
      },
    ],
  },
  en: {
    title: 'Legal notice',
    description: `Legal notice for ${ORGANIZATION_NAME}, a web agency in the French Caribbean: publisher, host and intellectual property.`,
    updated: UPDATED,
    sections: [
      {
        heading: 'Site publisher',
        paragraphs: [
          `This website ${SITE_URL} is published by ${ORGANIZATION_NAME}, [legal form] with a share capital of €[amount].`,
          'Company name: [Registered company name]. Company number (SIRET): [SIRET]. Trade register (RCS): [RCS — city and number]. VAT number: [VAT number].',
          `Registered office: [Full postal address]. Contact: ${CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: 'Publication director',
        paragraphs: ['The publication director is [Name of the publication director].'],
      },
      {
        heading: 'Hosting',
        paragraphs: [
          'This website is hosted by [Host — company name, address and phone number to be completed].',
        ],
      },
      {
        heading: 'Intellectual property',
        paragraphs: [
          `All content on this site (text, images, logos, code) is the property of ${ORGANIZATION_NAME} or its partners unless otherwise stated. Any reproduction or reuse without prior written consent is prohibited.`,
        ],
      },
    ],
  },
};

const PRIVACY: Localized<LegalDoc> = {
  fr: {
    title: 'Politique de confidentialité',
    description: `Comment ${ORGANIZATION_NAME} protège vos données personnelles : collecte, finalité, conservation et vos droits au titre du RGPD.`,
    updated: UPDATED,
    sections: [
      {
        heading: 'Données collectées',
        paragraphs: [
          'Lorsque vous utilisez notre formulaire de contact, nous collectons les données que vous nous transmettez : nom, prénom, adresse e-mail, téléphone (facultatif), entreprise (facultatif) et le contenu de votre message.',
        ],
      },
      {
        heading: 'Finalité et base légale',
        paragraphs: [
          'Ces données sont utilisées uniquement pour traiter votre demande et y répondre. La base légale du traitement est votre consentement, recueilli lors de l’envoi du formulaire.',
        ],
      },
      {
        heading: 'Sous-traitants',
        paragraphs: [
          'L’envoi du formulaire de contact est assuré par Web3Forms, qui transmet votre message à notre adresse e-mail en qualité de sous-traitant. L’hébergement du site est assuré par [Hébergeur].',
          'Si des outils de mesure d’audience sont activés, ils sont configurés sans cookie de suivi publicitaire.',
        ],
      },
      {
        heading: 'Durée de conservation',
        paragraphs: [
          'Vos données sont conservées le temps nécessaire au traitement de votre demande, puis archivées ou supprimées conformément aux obligations légales applicables.',
        ],
      },
      {
        heading: 'Vos droits',
        paragraphs: [
          `Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, de suppression, de limitation et d’opposition au traitement de vos données. Pour exercer ces droits, écrivez-nous à ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    description: `How ${ORGANIZATION_NAME} protects your personal data: collection, purpose, retention and your rights under the GDPR.`,
    updated: UPDATED,
    sections: [
      {
        heading: 'Data we collect',
        paragraphs: [
          'When you use our contact form, we collect the data you provide: first and last name, email address, phone number (optional), company (optional) and the content of your message.',
        ],
      },
      {
        heading: 'Purpose and legal basis',
        paragraphs: [
          'This data is used solely to process and respond to your request. The legal basis for processing is your consent, given when you submit the form.',
        ],
      },
      {
        heading: 'Processors',
        paragraphs: [
          'Contact-form submissions are handled by Web3Forms, which forwards your message to our email address as a data processor. The website is hosted by [Host].',
          'Where audience-measurement tools are enabled, they are configured without advertising tracking cookies.',
        ],
      },
      {
        heading: 'Retention period',
        paragraphs: [
          'Your data is kept for as long as needed to process your request, then archived or deleted in line with applicable legal obligations.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          `Under the GDPR, you have the right to access, rectify, erase, restrict and object to the processing of your data. To exercise these rights, contact us at ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
};

const TERMS: Localized<LegalDoc> = {
  fr: {
    title: 'Conditions générales de vente',
    description: `Conditions générales de vente de ${ORGANIZATION_NAME} : devis, commande, tarifs, délais, livraison et responsabilité.`,
    updated: UPDATED,
    sections: [
      {
        heading: 'Objet',
        paragraphs: [
          `Les présentes conditions générales de vente régissent les prestations de services (conception de sites web, applications et solutions digitales) fournies par ${ORGANIZATION_NAME} à ses clients professionnels.`,
        ],
      },
      {
        heading: 'Devis et commande',
        paragraphs: [
          'Toute prestation fait l’objet d’un devis détaillé. La commande est ferme à la signature du devis (ou validation écrite) et au versement de l’acompte éventuellement prévu.',
        ],
      },
      {
        heading: 'Tarifs et paiement',
        paragraphs: [
          'Les prix sont indiqués en euros et hors taxes, sauf mention contraire. Les modalités et échéances de paiement sont précisées sur le devis. Tout retard de paiement peut entraîner des pénalités au taux légal en vigueur.',
        ],
      },
      {
        heading: 'Délais, livraison et recette',
        paragraphs: [
          'Les délais sont communiqués à titre indicatif et dépendent de la fourniture par le client des éléments nécessaires. La livraison donne lieu à une phase de recette ; à défaut de réserves écrites sous [X] jours, la prestation est réputée acceptée.',
        ],
      },
      {
        heading: 'Propriété et responsabilité',
        paragraphs: [
          'Le transfert des droits sur les livrables intervient après paiement intégral. La responsabilité de l’agence est limitée au montant de la prestation concernée.',
          'Les présentes conditions sont soumises au droit français ; tout litige relève des tribunaux compétents du ressort du siège de l’agence.',
        ],
      },
    ],
  },
  en: {
    title: 'Terms of sale',
    description: `Terms of sale for ${ORGANIZATION_NAME}: quotes, orders, prices, timelines, delivery and liability.`,
    updated: UPDATED,
    sections: [
      {
        heading: 'Purpose',
        paragraphs: [
          `These terms of sale govern the services (website, application and digital-solution design) provided by ${ORGANIZATION_NAME} to its business clients.`,
        ],
      },
      {
        heading: 'Quote and order',
        paragraphs: [
          'Each engagement is covered by a detailed quote. The order is firm upon signature of the quote (or written approval) and payment of any agreed deposit.',
        ],
      },
      {
        heading: 'Prices and payment',
        paragraphs: [
          'Prices are stated in euros, excluding tax, unless otherwise indicated. Payment terms and due dates are set out in the quote. Late payment may incur penalties at the applicable statutory rate.',
        ],
      },
      {
        heading: 'Timelines, delivery and acceptance',
        paragraphs: [
          'Timelines are indicative and depend on the client providing the required materials. Delivery triggers an acceptance phase; failing written reservations within [X] days, the work is deemed accepted.',
        ],
      },
      {
        heading: 'Ownership and liability',
        paragraphs: [
          'Rights to the deliverables transfer after full payment. The agency’s liability is limited to the amount of the relevant engagement.',
          'These terms are governed by French law; any dispute falls under the competent courts of the agency’s registered office.',
        ],
      },
    ],
  },
};

export function getLegalNotice(locale: Locale): LegalDoc {
  return LEGAL_NOTICE[locale];
}

export function getPrivacy(locale: Locale): LegalDoc {
  return PRIVACY[locale];
}

export function getTerms(locale: Locale): LegalDoc {
  return TERMS[locale];
}
