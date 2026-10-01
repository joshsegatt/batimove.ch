import React from 'react';
import { LocationLandingTemplate, LocationConfig } from '../../components/LocationLandingTemplate';

const genevaConfig: LocationConfig = {
  cityName: 'Genève',
  regionBadge: 'Canton de Genève • Ville & Communes',
  heroHeadlineMain: "Déménagement Professionnel à",
  heroHeadlineHighlight: "Genève & Environs !",
  heroSubtitle: "Entreprise suisse certifiée basée à Genève. Équipes qualifiées, réservation des panneaux de stationnement auprès de la Ville de Genève et assurance RC jusqu'à 5M CHF.",
  metaTitle: "Déménagement Genève | Devis Gratuit 24h & Service Pro - Batimove",
  metaDescription: "Entreprise de déménagement à Genève pour particuliers et entreprises. Réservation de stationnement, monte-meubles, devis gratuit dès CHF 550. RC 5M CHF.",
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
      title: "Autorisation de Stationnement Ville de Genève",
      desc: "Nous effectuons les démarches administratives et posons les panneaux d'interdiction officiels 48h avant le déménagement."
    },
    {
      title: "Monte-Meubles Extérieur Électrique",
      desc: "Idéal pour les immeubles anciens sans ascenseur à Plainpalais, Servette ou Carouge pour éviter d'endommager les cages d'escalier."
    },
    {
      title: "Couverture Régies Immobilières Genevoises",
      desc: "Formules adaptées aux exigences très strictes des régies de la place pour un état des lieux sans litige."
    },
    {
      title: "Garde-Meubles Sécurisé à Genève",
      desc: "Dépôt temporaire ou longue durée ventilé, sous surveillance vidéo permanente et accessible facilement."
    }
  ],
  regiesList: [
    "SPG", "Naef Immobilier", "Wincasa", "Privera", "Moser Vernet & Cie", "Rosset & Cie", "Brolliet"
  ],
  faqList: [
    {
      question: "Comment réserver une place de stationnement pour mon déménagement à Genève ?",
      answer: "À Genève, il est obligatoire d'obtenir une autorisation de la police du stationnement et de poser des panneaux officiels. Batimove s'occupe de l'ensemble de la procédure auprès de la Ville de Genève et de l'installation des panneaux 48h à l'avance pour sécuriser l'emplacement de notre camion."
    },
    {
      question: "Combien coûte un déménagement à Genève avec Batimove ?",
      answer: "Nos tarifs démarrent dès CHF 550 pour la formule Basic (camion et déménageurs). Le coût exact dépend du volume en m³, de l'étage et des options choisies (emballage, monte-meubles). Vous recevez un devis ferme et sans surprise sous 2 heures ouvrées."
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
  testimonials: [
    {
      name: "Wagner Custódio",
      role: "Déménagement Clés en Main • Avis Google",
      quote: "Batimove est une entreprise merveilleuse ! Tout s’est très bien passé du début à la fin. L’équipe est professionnelle, efficace et très sympathique. Mon déménagement s’est déroulé sans aucun problème. Je recommande cette entreprise les yeux fermés !",
      rating: 5,
      location: "Genève",
      avatar: "/reviews/wagner.png"
    },
    {
      name: "Pedro Silva",
      role: "Transport & Déménagement • Avis Google",
      quote: "Une entreprise sérieuse avec d'excellents professionnels ! Félicitations pour le travail remarquable ! Je recommande vivement !",
      rating: 5,
      location: "Genève & Environs",
      avatar: "/reviews/pedro.png"
    },
    {
      name: "Andressa Segat",
      role: "Déménagement International • Avis Google",
      quote: "Excellente expérience avec BATIMOVE ! Ils ont fait mon déménagement de Londres vers la Suisse et tout s’est parfaitement déroulé. Équipe organisée, ponctuelle, très professionnelle et soigneuse avec les meubles.",
      rating: 5,
      location: "Genève & Suisse",
      avatar: "/reviews/andressa.png"
    }
  ]
};

export const Geneve: React.FC = () => {
  return <LocationLandingTemplate config={genevaConfig} />;
};
export default Geneve;
