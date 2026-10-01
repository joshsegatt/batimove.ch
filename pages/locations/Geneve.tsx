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
      name: "Marc & Valérie D.",
      role: "Particuliers",
      quote: "Déménagement d'un 4 pièces de Champel vers Cologny. Équipe ponctuelle, très respectueuse des meubles anciens et des parties communes. Les panneaux de stationnement étaient déjà posés à notre arrivée.",
      rating: 5,
      location: "Genève (Champel)"
    },
    {
      name: "Sébastien L.",
      role: "Directeur de Cabinet",
      quote: "Transfert de nos bureaux près des Nations Unies. Tout s'est fait sur un week-end sans la moindre interruption pour nos collaborateurs le lundi matin. Un professionnalisme exemplaire.",
      rating: 5,
      location: "Genève (Nations)"
    },
    {
      name: "Isabelle M.",
      role: "Propriétaire",
      quote: "Le monte-meubles a sauvé notre déménagement dans la vieille ville avec une cage d'escalier minuscule. Le devis a été respecté au centime près. Bravo Batimove !",
      rating: 5,
      location: "Genève (Vieille-Ville)"
    }
  ]
};

export const Geneve: React.FC = () => {
  return <LocationLandingTemplate config={genevaConfig} />;
};
export default Geneve;
