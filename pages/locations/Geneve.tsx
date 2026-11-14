import React from 'react';
import { cityHome, type LocationConfig } from '../../data/localHome';
import { Home } from '../Home';
import { getReviews } from '../../data/reviews';
import { defineCopy, useLang } from '../../i18n';

const genevaConfig: LocationConfig = {
  cityName: 'Genève',
  regionBadge: 'Canton de Genève • Ville & Communes',
  heroHeadlineMain: "Déménagement Professionnel à",
  heroHeadlineHighlight: "Genève & Environs !",
  heroSubtitle: "Entreprise suisse basée à Genève. Équipes qualifiées, réservation des panneaux de stationnement sur demande et assurance RC jusqu'à 5M CHF.",
  metaTitle: "Déménagement Genève | Devis Gratuit en 30 min - Batimove",
  metaDescription: "Entreprise de déménagement à Genève pour particuliers et entreprises. Stationnement sur demande, monte-meubles, devis gratuit dès CHF 550. RC 5M CHF.",
  canonicalUrl: "https://www.batimove.ch/demenagement-geneve",
  geoPosition: {
    lat: 46.2044,
    lng: 6.1432,
    postalCode: "1201",
    street: "Rue de Monthoux 64"
  },
  districts: [
    { name: "Genève Centre & Vieille-Ville", desc: "Maîtrise des accès piétons, ruelles pavées et contraintes d'horaires stricts de livraison." },
    { name: "Champel & Florissant", desc: "Immeubles résidentiels cossus, protection complète des parquets, halls et ascenseurs." },
    { name: "Eaux-Vives & Cologny", desc: "Déménagements d'appartements et villas de maître au bord du lac, emballage d'œuvres d'art." },
    { name: "Plainpalais & Jonction", desc: "Prise en charge rapide des appartements d'étudiants, jeunes actifs et commerces locaux." },
    { name: "Servette, Petit-Saconnex & Nations", desc: "Spécialiste de la clientèle internationale, expatriés, diplomates et ONG." },
    { name: "Carouge, Lancy & Meyrin", desc: "Transferts de bureaux, logistique industrielle et résidences familiales modernes." }
  ],
  localFeatures: [
    {
      title: "Autorisation de stationnement Ville de Genève",
      desc: "Sur demande, nous effectuons les démarches et posons les panneaux d'interdiction officiels 48 h avant le déménagement."
    },
    {
      title: "Monte-meubles extérieur électrique",
      desc: "Idéal pour les immeubles anciens sans ascenseur à Plainpalais, Servette ou Carouge pour éviter d'endommager les cages d'escalier."
    },
    {
      title: "Couverture régies immobilières genevoises",
      desc: "Formules adaptées aux exigences très strictes des régies de la place pour un état des lieux sans litige."
    },
    {
      title: "Garde-meubles sécurisé à Genève",
      desc: "Dépôt temporaire ou longue durée ventilé, sous surveillance vidéo permanente et accessible facilement."
    }
  ],
  regiesList: [
    "SPG", "Naef Immobilier", "Wincasa", "Privera", "Moser Vernet & Cie", "Rosset & Cie", "Brolliet"
  ],
  faqList: [
    {
      question: "Comment réserver une place de stationnement pour mon déménagement à Genève ?",
      answer: "À Genève, il est obligatoire d'obtenir une autorisation de la police du stationnement et de poser des panneaux officiels. C'est en principe au client de le faire ; sur demande, Batimove s'occupe de l'ensemble de la procédure auprès de la Ville de Genève et de l'installation des panneaux 48h à l'avance pour sécuriser l'emplacement de notre camion."
    },
    {
      question: "Combien coûte un déménagement à Genève avec Batimove ?",
      answer: "Nos déménagements démarrent dès CHF 550. Le coût exact dépend du volume en m³, de l'étage et des options choisies (emballage, monte-meubles). Vous recevez un devis ferme et sans surprise sous 30 min (8h-19h)."
    },
    {
      question: "Intervenez-vous dans les communes autour de Genève ?",
      answer: "Oui, nous couvrons 100% du canton de Genève : Carouge, Meyrin, Vernier, Lancy, Cologny, Versoix, Thônex, Chêne-Bougeries, Veyrier, etc., sans aucun supplément kilométrique abusif."
    },
    {
      question: "Que se passe-t-il si un objet est endommagé pendant le déménagement ?",
      answer: "Tous nos transports et manipulations sont couverts par notre assurance Responsabilité Civile professionnelle (RC) conclue auprès d'une compagnie suisse de premier ordre, avec une couverture intégrale jusqu'à CHF 5'000'000."
    }
  ],
  // Avis réels, texte et localisation depuis data/reviews.ts (source unique)
  testimonials: getReviews(['wagner', 'pedro', 'andressa'])
};

// Inglês: mesmas régies, coordenadas e avis (a citação fica em francês).
const genevaConfigEn: LocationConfig = {
  ...genevaConfig,
  cityName: 'Geneva',
  regionBadge: 'Canton of Geneva • City & municipalities',
  heroHeadlineMain: 'Professional removals in',
  heroHeadlineHighlight: 'Geneva & surroundings',
  heroSubtitle:
    'A Swiss company based in Geneva. Qualified teams, parking signs booked on request and liability insurance up to CHF 5M.',
  metaTitle: 'Removals Geneva | Free Quote in 30 min - Batimove',
  metaDescription:
    'Removal company in Geneva for private clients and businesses. Parking on request, furniture lift, free quote, from CHF 550. CHF 5M liability cover.',
  canonicalUrl: 'https://www.batimove.ch/en/removals-geneva',
  districts: [
    { name: 'Geneva centre & Old Town', desc: 'Expert handling of pedestrian access, cobbled lanes and strict delivery time restrictions.' },
    { name: 'Champel & Florissant', desc: 'Upmarket residential buildings, with full protection for parquet floors, entrance halls and lifts.' },
    { name: 'Eaux-Vives & Cologny', desc: 'Flat and grand villa moves by the lake, including fine art packing.' },
    { name: 'Plainpalais & Jonction', desc: 'Fast service for student flats, young professionals and local shops.' },
    { name: 'Servette, Petit-Saconnex & Nations', desc: 'Specialists in international clients: expatriates, diplomats and NGOs.' },
    { name: 'Carouge, Lancy & Meyrin', desc: 'Office relocations, industrial logistics and modern family homes.' }
  ],
  localFeatures: [
    {
      title: 'City of Geneva parking permit',
      desc: 'On request, we handle the paperwork and put up the official no-parking signs 48 h before the move.'
    },
    {
      title: 'Electric external furniture lift',
      desc: 'Ideal for older buildings without a lift in Plainpalais, Servette or Carouge, to avoid damaging the stairwells.'
    },
    {
      title: 'Cover for Geneva letting agencies',
      desc: 'Services tailored to the very strict standards of local letting agencies, for a dispute-free check-out inspection.'
    },
    {
      title: 'Secure furniture storage in Geneva',
      desc: 'Ventilated short or long-term storage, under permanent video surveillance and easy to access.'
    }
  ],
  faqList: [
    {
      question: 'How do I reserve a parking space for my move in Geneva?',
      answer: 'In Geneva, you must obtain a permit from the parking police and put up official signs. This is normally up to the client; on request, Batimove handles the entire procedure with the City of Geneva and installs the signs 48 h in advance to secure the space for our lorry.'
    },
    {
      question: 'How much does a move in Geneva with Batimove cost?',
      answer: 'Our removals start from CHF 550. The exact cost depends on the volume in m³, the floor and the options you choose (packing, furniture lift). You receive a fixed quote with no surprises within 30 min (8 am to 7 pm).'
    },
    {
      question: 'Do you work in the municipalities around Geneva?',
      answer: 'Yes, we cover 100% of the canton of Geneva: Carouge, Meyrin, Vernier, Lancy, Cologny, Versoix, Thônex, Chêne-Bougeries, Veyrier and more, with no excessive mileage surcharges.'
    },
    {
      question: 'What happens if an item is damaged during the move?',
      answer: 'All our transport and handling is covered by our professional public liability insurance, taken out with a leading Swiss insurer, with full cover up to CHF 5,000,000.'
    }
  ]
};

const CONFIG = defineCopy<LocationConfig>(genevaConfig, genevaConfigEn);

export const Geneve: React.FC = () => {
  const { lang } = useLang();
  return <Home local={cityHome('geneve', CONFIG[lang], lang)} />;
};
export default Geneve;
