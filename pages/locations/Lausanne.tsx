import React from 'react';
import { LocationLandingTemplate, LocationConfig } from '../../components/LocationLandingTemplate';

const lausanneConfig: LocationConfig = {
  cityName: 'Lausanne',
  regionBadge: 'Capitale Vaudoise • Lausanne & Agglomération',
  heroHeadlineMain: "Déménagement de Confiance à",
  heroHeadlineHighlight: "Lausanne & Environs !",
  heroSubtitle: "Équipes spécialisées dans les accès lausannois et les fortes déclivités. Matériel adapté, respect des régies vaudoises et assurance complète 5M CHF.",
  metaTitle: "Déménagement Lausanne | Prix Fixe & Garantie Régies - Batimove",
  metaDescription: "Déménageur professionnel à Lausanne et agglomération. Spécialiste des accès en pente, monte-meubles et eDéménagement Vaud. Devis gratuit sous 2h dès CHF 550.",
  canonicalUrl: "https://www.batimove.ch/demenagement-lausanne",
  geoPosition: {
    lat: 46.5197,
    lng: 6.6323,
    postalCode: "1003",
    street: "Place Saint-François"
  },
  districts: [
    { name: "Lausanne Centre & Le Flon", desc: "Prise en charge en zone piétonne, coordination des accès et autorisations municipales." },
    { name: "Ouchy & Sous-Gare", desc: "Gestion des immeubles de caractère, fortes déclivités et résidences au bord du lac Léman." },
    { name: "Chailly & La Sallaz", desc: "Quartiers familiaux, maisons individuelles et appartements avec accès en pente." },
    { name: "Montchoisi & Georgette", desc: "Quartiers résidentiels haut de gamme, emballage protecteur pour mobilier de valeur." },
    { name: "Beaulieu, Grey & Borde", desc: "Déménagements d'appartements et transferts d'activités tertiaires et médicales." },
    { name: "Pully, Prilly & Renens", desc: "Interventions rapides dans toute la première couronne lausannoise sans surcoût." }
  ],
  localFeatures: [
    {
      title: "Gestion des Accès en Pente & Déclivités",
      desc: "Nos camions et chauffeurs sont formés aux contraintes topographiques spécifiques de la ville de Lausanne."
    },
    {
      title: "Accompagnement eDéménagement Vaud",
      desc: "Conseils et attestations pour votre annonce officielle de changement d'adresse auprès du contrôle des habitants vaudois."
    },
    {
      title: "Garantie Régies Immobilières Vaudoises",
      desc: "Nettoyage fin de bail et transport reconnus par Bernard Nicod, Cogestim, Régie du Rhône et Domicim."
    },
    {
      title: "Monte-Meubles pour Rues Étroites",
      desc: "Élévateurs compacts permettant le passage sécurisé par fenêtre sans bloquer la circulation de quartier."
    }
  ],
  regiesList: [
    "Bernard Nicod", "Cogestim", "Régie du Rhône", "Gérofinance", "Domicim", "De Rham", "Wincasa Lausanne"
  ],
  faqList: [
    {
      question: "Comment gérer un déménagement dans les rues en pente de Lausanne ?",
      answer: "Lausanne présente un dénivelé important de plus de 500 mètres entre le lac et le haut de la ville. Nos véhicules sont équipés de cales de sécurité professionnelles, hayons élévateurs et matériel de portage adapté pour sécuriser chaque chargement, même dans les rues les plus escarpées."
    },
    {
      question: "Quel est le délai pour obtenir un devis de déménagement à Lausanne ?",
      answer: "Vous pouvez calculer immédiatement votre cubage avec notre calculateur 3D en ligne ou recevoir un devis détaillé et fixe sous 2 heures ouvrées par email ou téléphone au 0800 825 925."
    },
    {
      question: "Proposez-vous le nettoyage de fin de bail avec garantie pour la régie ?",
      answer: "Oui, notre équipe de nettoyage assure un état des lieux 100% garanti. Si la régie (Bernard Nicod, Cogestim, etc.) demande une retouche le jour de l'état des lieux, nous intervenons immédiatement sans aucun frais supplémentaire."
    },
    {
      question: "Faites-vous les déménagements entre Lausanne et Genève ou le Valais ?",
      answer: "Absolument. Nous effectuons des liaisons quotidiennes sur l'arc lémanique (Lausanne-Genève) ainsi que vers le Valais, Fribourg, Neuchâtel et toute la Suisse."
    }
  ],
  testimonials: [
    {
      name: "Julien B.",
      role: "Partenaire Certifié MOVU • Avis Google",
      quote: "Une entreprise de déménagement au Top ! Réservé via MOVU, prix très compétitif pour un travail très qualitatif ! Rapidité et qualité, deux mots désignant parfaitement l’équipe ! Je recommande vivement !",
      rating: 5,
      location: "Lausanne & Vaud",
      avatar: "/reviews/julien.png"
    },
    {
      name: "Andressa Segat",
      role: "Déménagement International • Avis Google",
      quote: "Excellente expérience avec BATIMOVE ! Ils ont fait mon déménagement de Londres vers la Suisse et tout s’est parfaitement déroulé. Équipe organisée, ponctuelle, très professionnelle et soigneuse avec les meubles.",
      rating: 5,
      location: "Lausanne & Suisse Romande",
      avatar: "/reviews/andressa.png"
    },
    {
      name: "Wagner Custódio",
      role: "Déménagement Résidentiel • Avis Google",
      quote: "Batimove est une entreprise merveilleuse ! Tout s’est très bien passé du début à la fin. L’équipe est professionnelle, efficace et très sympathique. Mon déménagement s’est déroulé sans aucun problème.",
      rating: 5,
      location: "Arc Lémanique",
      avatar: "/reviews/wagner.png"
    }
  ]
};

export const Lausanne: React.FC = () => {
  return <LocationLandingTemplate config={lausanneConfig} />;
};
export default Lausanne;
