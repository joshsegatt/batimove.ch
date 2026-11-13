import type { QuoteServiceId } from './quoteServices';

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

export const SERVICE_LANDINGS: Record<'debarras' | 'nettoyage' | 'garde-meubles', ServiceLanding> = {
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
