import type { QuoteServiceId } from './quoteServices';
import type { Lang } from '../i18n';

// Conteúdo das páginas próprias de serviço (/debarras, /nettoyage-fin-de-bail).
// Regra do site: só afirmações já sustentadas em outras partes do site ou
// confirmadas pela Batimove (tri e valorização, reciclagem, garantia de entrega
// das chaves do FAQ, preço ferme, RC Pro 5M + All Risk, joignable 7j/7).

export interface ServiceLanding {
  serviceId: QuoteServiceId;
  path: string;
  seoTitle: string;
  seoDescription: string;
  breadcrumb: string;
  /** Foto do topo (imagens provisórias geradas, a trocar pelas fotos reais da equipe) */
  hero: { src: string; srcSmall: string; width: number; height: number; alt: string; position: string };
  h1: string;
  lead: string;
  included: string[];
  steps: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
}

export type ServiceLandingId = 'demenagement' | 'debarras' | 'nettoyage' | 'garde-meubles';

/** Versão francesa (idioma de origem). */
export const SERVICE_LANDINGS: Record<ServiceLandingId, ServiceLanding> = {
  // Só usada pelas páginas por cidade (/demenagement-nyon…); o hub é /services?type=prive.
  // Afirmações já feitas no site: emballage et déballage, démontage, monte-meubles,
  // protection des parties communes, autorisation de stationnement, cartons livrés,
  // garde-meubles, RC Pro 5M, prix ferme, devis sous 30 min.
  demenagement: {
    serviceId: 'prive',
    path: '/services?type=prive',
    seoTitle: 'Déménagement privé | Batimove',
    seoDescription: 'Déménagement privé en Suisse romande : emballage, démontage, transport et livraison. Prix ferme, devis gratuit sous 30 min.',
    breadcrumb: 'Déménagement',
    hero: {
      src: '/hero-debarras.jpg',
      srcSmall: '/hero-debarras-sm.jpg',
      width: 1920,
      height: 1072,
      alt: 'Deux déménageurs sortent un fauteuil emballé d’un immeuble vers une camionnette',
      position: '50% 55%',
    },
    h1: 'Déménagement',
    lead: 'Appartement, maison ou bureau : nous emballons, démontons, transportons et livrons à la nouvelle adresse, à la date convenue.',
    included: [
      'Emballage et déballage, cartons livrés chez vous',
      'Démontage des meubles et protection du mobilier',
      'Sols, murs et cages d’escalier protégés',
      'Autorisation de stationnement demandée pour vous',
      'Monte-meubles si l’accès l’exige',
      'Garde-meubles entre deux logements',
    ],
    steps: [
      { title: 'Devis gratuit sous 30 min', text: 'Décrivez le logement, les accès et la date. Vous recevez un prix ferme, de 8h à 19h.' },
      { title: 'Préparation', text: 'Cartons livrés, autorisation de stationnement demandée, équipe et camion choisis selon les accès.' },
      { title: 'Le jour J', text: 'Emballage, chargement, transport et livraison à la nouvelle adresse, avec un interlocuteur joignable 7j/7.' },
    ],
    faq: [
      {
        question: 'Le prix peut-il changer le jour du déménagement ?',
        answer: 'Non. Une fois le devis accepté, le prix est ferme : aucun surcoût ne vous sera facturé.',
      },
      {
        question: 'De quoi dépend le prix ?',
        answer: 'Du volume à déménager, des accès (étages, ascenseur, distance au camion), de la date et des options choisies, comme l’emballage ou le monte-meubles.',
      },
      {
        question: 'Pouvez-vous stocker mes meubles si mon nouveau logement n’est pas prêt ?',
        answer: 'Oui, dans notre garde-meubles à Genève, pour quelques semaines ou plusieurs mois.',
      },
      {
        question: 'Pouvez-vous aussi nettoyer l’ancien logement ?',
        answer: 'Oui. Nous organisons le nettoyage de fin de bail après le déménagement, pour que le logement soit prêt pour l’état des lieux.',
      },
    ],
  },
  debarras: {
    serviceId: 'debarras',
    path: '/debarras',
    seoTitle: 'Débarras Genève & Vaud | Devis Gratuit en 30 min - Batimove',
    seoDescription:
      "Débarras d'appartement, maison, cave ou grenier à Genève et dans le canton de Vaud. Tri, évacuation et recyclage. Prix ferme, devis gratuit sous 30 min.",
    breadcrumb: 'Débarras',
    hero: {
      src: '/hero-debarras.jpg',
      srcSmall: '/hero-debarras-sm.jpg',
      width: 1920,
      height: 1072,
      alt: 'Deux déménageurs sortent un fauteuil emballé d’un immeuble vers une camionnette',
      position: '50% 55%',
    },
    h1: 'Débarras à Genève et dans le canton de Vaud',
    lead:
      "Appartement, maison, cave ou grenier : nous trions, évacuons et rendons les lieux vides. Ce qui peut encore servir est valorisé, le reste part au recyclage.",
    included: [
      'Tri sur place : ce qui se garde, se donne ou se recycle',
      'Évacuation complète par nos équipes',
      'Valorisation des objets réutilisables',
      'Parties communes protégées pendant l’intervention',
      'Autorisation de stationnement demandée pour vous',
      'Nettoyage de fin de bail possible dans la foulée',
    ],
    steps: [
      { title: 'Devis gratuit sous 30 min', text: 'Décrivez ce qu’il faut débarrasser. Vous recevez un prix ferme, de 8h à 19h.' },
      { title: 'Intervention à la date convenue', text: 'Nos équipes trient, évacuent et protègent les parties communes.' },
      { title: 'Des lieux vides', text: 'Prêts pour une vente, une relocation ou l’état des lieux.' },
    ],
    faq: [
      {
        question: 'Que devient ce que vous évacuez ?',
        answer:
          'Les objets réutilisables sont valorisés. Le reste est trié sur place puis acheminé vers les filières de recyclage adaptées.',
      },
      {
        question: 'Le prix peut-il changer le jour de l’intervention ?',
        answer: 'Non. Une fois le devis accepté, le prix est ferme : aucun surcoût ne vous sera facturé.',
      },
      {
        question: 'Intervenez-vous pour une seule cave ou un grenier ?',
        answer: 'Oui. Nous débarrassons aussi bien une cave ou un grenier qu’un appartement ou une maison entière.',
      },
      {
        question: 'Pouvez-vous enchaîner avec le nettoyage de fin de bail ?',
        answer:
          'Oui. Nous organisons le nettoyage juste après le débarras, pour que le logement soit prêt pour l’état des lieux.',
      },
    ],
  },
  nettoyage: {
    serviceId: 'nettoyage',
    path: '/nettoyage-fin-de-bail',
    seoTitle: 'Nettoyage de Fin de Bail Genève & Vaud - Batimove',
    seoDescription:
      'Nettoyage de fin de bail conforme aux exigences des régies, à Genève et dans le canton de Vaud. Retouche gratuite en cas de remarque. Devis sous 30 min.',
    breadcrumb: 'Nettoyage de fin de bail',
    hero: {
      src: '/hero-nettoyage.jpg',
      srcSmall: '/hero-nettoyage-sm.jpg',
      width: 1920,
      height: 1072,
      alt: 'Nettoyage de fin de bail dans un appartement vide avec vue sur le lac',
      position: '50% 50%',
    },
    h1: 'Nettoyage de fin de bail à Genève et dans le canton de Vaud',
    lead:
      'Un logement rendu selon les exigences des régies, pour un état des lieux sans retouche. Et si la régie fait une remarque, nous réintervenons gratuitement.',
    included: [
      'Nettoyage complet du logement, pièce par pièce',
      'Conforme aux exigences des régies immobilières suisses',
      'Garantie de remise des clés : retouche gratuite en cas de remarque',
      'Combinable avec votre déménagement ou un débarras',
      'Prix ferme, sans surcoût une fois le devis accepté',
      'Du studio à la maison',
    ],
    steps: [
      { title: 'Devis gratuit sous 30 min', text: 'Indiquez la taille du logement et la date de l’état des lieux. Vous recevez un prix ferme.' },
      { title: 'Nettoyage avant l’état des lieux', text: 'Nos équipes rendent le logement selon les exigences de la régie.' },
      { title: 'Remise des clés', text: 'Si la régie relève un point, nous revenons sans frais.' },
    ],
    faq: [
      {
        question: "Le nettoyage de fin de bail inclut-il une garantie pour l'état des lieux ?",
        answer:
          "Oui, notre service de nettoyage de fin de bail inclut une garantie remise de clés 100% conforme aux exigences des régies immobilières suisses. En cas de remarque lors de l'état des lieux, nous réintervenons gratuitement.",
      },
      {
        question: 'Pouvez-vous combiner le nettoyage avec mon déménagement ?',
        answer:
          'Oui. Nous enchaînons le déménagement puis le nettoyage, avec un seul devis pour les deux.',
      },
      {
        question: 'Le prix peut-il changer après le devis ?',
        answer: 'Non. Une fois le devis accepté, le prix est ferme : aucun surcoût ne vous sera facturé.',
      },
      {
        question: 'Quelles tailles de logement prenez-vous en charge ?',
        answer: 'Du studio à la maison, à Genève et dans le canton de Vaud.',
      },
    ],
  },
  'garde-meubles': {
    serviceId: 'garde-meubles',
    path: '/garde-meubles',
    seoTitle: 'Garde-Meubles Genève - Stockage Sécurisé | Batimove',
    seoDescription:
      'Garde-meubles à Genève : dépôt ventilé sous vidéosurveillance, stockage court ou long terme, enlèvement à Genève et dans le canton de Vaud.',
    breadcrumb: 'Garde-meubles',
    hero: {
      src: '/hero-garde-meubles.jpg',
      srcSmall: '/hero-garde-meubles-sm.jpg',
      width: 1920,
      height: 1072,
      alt: 'Dépôt de garde-meubles propre et organisé, meubles emballés et caisses de stockage',
      position: '50% 50%',
    },
    h1: 'Garde-meubles sécurisé à Genève',
    lead:
      'Pour quelques semaines ou plusieurs mois : nous emballons, transportons et stockons vos biens dans un dépôt ventilé sous vidéosurveillance, puis vous les livrons quand vous êtes prêt.',
    included: [
      'Dépôt ventilé sous vidéosurveillance permanente',
      'Stockage temporaire ou de longue durée',
      'Enlèvement à Genève et dans le canton de Vaud',
      'Emballage et protection de vos biens avant le stockage',
      'Livraison à votre nouvelle adresse quand vous êtes prêt',
      'Prix ferme, aucun surcoût une fois le devis accepté',
    ],
    steps: [
      { title: 'Devis gratuit sous 30 min', text: 'Indiquez le volume et la durée. Vous recevez un prix ferme, de 8h à 19h.' },
      { title: 'Enlèvement et stockage', text: 'Nos équipes emballent, transportent et rangent vos biens dans le dépôt.' },
      { title: 'Livraison', text: 'Quand vous êtes prêt, nous livrons à l’adresse de votre choix.' },
    ],
    faq: [
      {
        question: 'Où se trouve le garde-meubles ?',
        answer: 'À Genève. Nous venons chercher vos biens à Genève et dans le canton de Vaud.',
      },
      {
        question: 'Combien de temps puis-je stocker mes affaires ?',
        answer: 'Le stockage peut être temporaire ou de longue durée : de quelques semaines à plusieurs mois.',
      },
      {
        question: 'Puis-je stocker seulement quelques cartons ?',
        answer: 'Oui. Nous stockons aussi bien quelques cartons que le contenu complet d’un appartement ou d’une maison.',
      },
      {
        question: 'Le prix peut-il changer après le devis ?',
        answer: 'Non. Une fois le devis accepté, le prix est ferme : aucun surcoût ne vous sera facturé.',
      },
    ],
  },
};

/**
 * Versão inglesa. `path` continua sendo o caminho FRANCÊS: o template passa
 * por lp() para chegar ao endereço em inglês. Fotos iguais, só o alt muda.
 */
export const SERVICE_LANDINGS_EN: Record<ServiceLandingId, ServiceLanding> = {
  demenagement: {
    ...SERVICE_LANDINGS.demenagement,
    seoTitle: 'Home Removals | Batimove',
    seoDescription: 'Home removals in French-speaking Switzerland: packing, dismantling, transport and delivery. Fixed price, free quote within 30 min.',
    breadcrumb: 'Removals',
    hero: {
      ...SERVICE_LANDINGS.demenagement.hero,
      alt: 'Two removal workers carrying a wrapped armchair out of a building towards a van',
    },
    h1: 'Removals',
    lead: 'Flat, house or office: we pack, dismantle, transport and deliver to your new address on the agreed date.',
    included: [
      'Packing and unpacking, boxes delivered to your door',
      'Furniture dismantling and protection',
      'Floors, walls and stairwells protected',
      'Parking permit requested for you',
      'Furniture lift if the access requires it',
      'Storage between two homes',
    ],
    steps: [
      { title: 'Free quote within 30 min', text: 'Tell us about the property, the access and the date. You get a fixed price, between 8am and 7pm.' },
      { title: 'Preparation', text: 'Boxes delivered, parking permit requested, team and lorry chosen to suit the access.' },
      { title: 'Moving day', text: 'Packing, loading, transport and delivery to your new address, with a contact you can reach 7 days a week.' },
    ],
    faq: [
      {
        question: 'Can the price change on moving day?',
        answer: 'No. Once you accept the quote the price is fixed: you will not be charged anything extra.',
      },
      {
        question: 'What does the price depend on?',
        answer: 'The volume to move, the access (floors, lift, distance to the lorry), the date and the options you choose, such as packing or a furniture lift.',
      },
      {
        question: 'Can you store my furniture if my new home is not ready?',
        answer: 'Yes, in our storage facility in Geneva, for a few weeks or several months.',
      },
      {
        question: 'Can you also clean the old home?',
        answer: 'Yes. We arrange the end of tenancy cleaning after the move, so the property is ready for the check-out inspection.',
      },
    ],
  },
  debarras: {
    ...SERVICE_LANDINGS.debarras,
    seoTitle: 'House Clearance Geneva & Vaud | Free Quote in 30 min',
    seoDescription:
      'House clearance for flats, houses, cellars and attics in Geneva and the canton of Vaud. Sorting, removal and recycling. Fixed price, free quote within 30 min.',
    breadcrumb: 'House clearance',
    hero: {
      ...SERVICE_LANDINGS.debarras.hero,
      alt: 'Two removal workers carrying a wrapped armchair out of a building towards a van',
    },
    h1: 'House clearance in Geneva and the canton of Vaud',
    lead:
      'Flat, house, cellar or attic: we sort, clear and leave the space empty. Anything still usable is given a second life; the rest goes for recycling.',
    included: [
      'On-site sorting: what to keep, donate or recycle',
      'Complete clearance by our own teams',
      'Reusable items given a second life',
      'Communal areas protected throughout the job',
      'Parking permit requested on your behalf',
      'End of tenancy cleaning available straight afterwards',
    ],
    steps: [
      { title: 'Free quote within 30 min', text: 'Tell us what needs clearing. You receive a fixed price, from 8 am to 7 pm.' },
      { title: 'Clearance on the agreed date', text: 'Our teams sort, clear and protect the communal areas.' },
      { title: 'An empty property', text: 'Ready for a sale, a new tenant or the check-out inspection.' },
    ],
    faq: [
      {
        question: 'What happens to everything you take away?',
        answer:
          'Reusable items are given a second life. Everything else is sorted on site and taken to the appropriate recycling streams.',
      },
      {
        question: 'Can the price change on the day?',
        answer: 'No. Once you accept the quote, the price is fixed: you will not be charged anything extra.',
      },
      {
        question: 'Do you clear just a cellar or an attic?',
        answer: 'Yes. We clear a single cellar or attic just as we clear an entire flat or house.',
      },
      {
        question: 'Can you follow on with end of tenancy cleaning?',
        answer:
          'Yes. We schedule the cleaning straight after the clearance, so the property is ready for the check-out inspection.',
      },
    ],
  },
  nettoyage: {
    ...SERVICE_LANDINGS.nettoyage,
    seoTitle: 'End of Tenancy Cleaning Geneva & Vaud | Batimove',
    seoDescription:
      'End of tenancy cleaning to letting agency standards in Geneva and the canton of Vaud. Free touch-up if anything is flagged. Quote within 30 min.',
    breadcrumb: 'End of tenancy cleaning',
    hero: {
      ...SERVICE_LANDINGS.nettoyage.hero,
      alt: 'End of tenancy cleaning in an empty flat with a view of the lake',
    },
    h1: 'End of tenancy cleaning in Geneva and the canton of Vaud',
    lead:
      'A property handed back to letting agency standards, for a check-out inspection with nothing to redo. And if the agency flags anything, we come back free of charge.',
    included: [
      'Complete cleaning of the property, room by room',
      'Meets the standards of Swiss letting agencies',
      'Key handover guarantee: free touch-up if anything is flagged',
      'Can be combined with your move or a house clearance',
      'Fixed price, no extra charges once the quote is accepted',
      'From studios to houses',
    ],
    steps: [
      { title: 'Free quote within 30 min', text: 'Tell us the size of the property and the date of the check-out inspection. You receive a fixed price.' },
      { title: 'Cleaning before the inspection', text: 'Our teams leave the property to the letting agency’s standards.' },
      { title: 'Key handover', text: 'If the agency flags anything, we come back at no cost.' },
    ],
    faq: [
      {
        question: 'Does end of tenancy cleaning come with a guarantee for the check-out inspection?',
        answer:
          'Yes. Our end of tenancy cleaning includes a key handover guarantee, 100% compliant with the standards of Swiss letting agencies. If anything is flagged at the check-out inspection, we come back free of charge.',
      },
      {
        question: 'Can you combine the cleaning with my move?',
        answer: 'Yes. We carry out the move and then the cleaning, with a single quote for both.',
      },
      {
        question: 'Can the price change after the quote?',
        answer: 'No. Once you accept the quote, the price is fixed: you will not be charged anything extra.',
      },
      {
        question: 'What size of property do you cover?',
        answer: 'From studios to houses, in Geneva and the canton of Vaud.',
      },
    ],
  },
  'garde-meubles': {
    ...SERVICE_LANDINGS['garde-meubles'],
    seoTitle: 'Furniture Storage Geneva - Secure Storage | Batimove',
    seoDescription:
      'Furniture storage in Geneva: ventilated depot under video surveillance, short or long-term storage, collection in Geneva and the canton of Vaud.',
    breadcrumb: 'Storage',
    hero: {
      ...SERVICE_LANDINGS['garde-meubles'].hero,
      alt: 'Clean, well-organised furniture storage depot with wrapped furniture and storage crates',
    },
    h1: 'Secure furniture storage in Geneva',
    lead:
      'For a few weeks or several months: we pack, transport and store your belongings in a ventilated depot under video surveillance, then deliver them when you are ready.',
    included: [
      'Ventilated depot under round-the-clock video surveillance',
      'Short-term or long-term storage',
      'Collection in Geneva and the canton of Vaud',
      'Your belongings packed and protected before storage',
      'Delivery to your new address when you are ready',
      'Fixed price, no extra charges once the quote is accepted',
    ],
    steps: [
      { title: 'Free quote within 30 min', text: 'Tell us the volume and the duration. You receive a fixed price, from 8 am to 7 pm.' },
      { title: 'Collection and storage', text: 'Our teams pack, transport and store your belongings in the depot.' },
      { title: 'Delivery', text: 'When you are ready, we deliver to the address of your choice.' },
    ],
    faq: [
      {
        question: 'Where is the storage depot?',
        answer: 'In Geneva. We collect your belongings in Geneva and the canton of Vaud.',
      },
      {
        question: 'How long can I store my belongings?',
        answer: 'Storage can be short-term or long-term: from a few weeks to several months.',
      },
      {
        question: 'Can I store just a few boxes?',
        answer: 'Yes. We store anything from a few boxes to the entire contents of a flat or house.',
      },
      {
        question: 'Can the price change after the quote?',
        answer: 'No. Once you accept the quote, the price is fixed: you will not be charged anything extra.',
      },
    ],
  },
};

/** As duas versões, por idioma: SERVICE_LANDINGS_BY_LANG[lang].debarras */
export const SERVICE_LANDINGS_BY_LANG: Record<Lang, Record<ServiceLandingId, ServiceLanding>> = {
  fr: SERVICE_LANDINGS,
  en: SERVICE_LANDINGS_EN,
};
