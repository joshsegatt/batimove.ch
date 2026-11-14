import React from 'react';
import { cityHome, type LocationConfig } from '../../data/localHome';
import { Home } from '../Home';
import { getReviews } from '../../data/reviews';
import { defineCopy, useLang } from '../../i18n';

const lausanneConfig: LocationConfig = {
  cityName: 'Lausanne',
  regionBadge: 'Capitale Vaudoise • Lausanne & Agglomération',
  heroHeadlineMain: "Déménagement de Confiance à",
  heroHeadlineHighlight: "Lausanne & Environs !",
  heroSubtitle: "Équipes spécialisées dans les accès lausannois et les fortes déclivités. Matériel adapté, respect des régies vaudoises et assurance complète 5M CHF.",
  metaTitle: "Déménagement Lausanne | Prix Fixe & Garantie Régies",
  metaDescription: "Déménageur professionnel à Lausanne et agglomération. Spécialiste des accès en pente, monte-meubles et eDéménagement. Devis gratuit sous 30 min dès CHF 550.",
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
      title: "Gestion des accès en pente et déclivités",
      desc: "Nos camions et chauffeurs sont formés aux contraintes topographiques spécifiques de la ville de Lausanne."
    },
    {
      title: "Accompagnement eDéménagement Vaud",
      desc: "Conseils et attestations pour votre annonce officielle de changement d'adresse auprès du contrôle des habitants vaudois."
    },
    {
      title: "Garantie régies immobilières vaudoises",
      desc: "Nettoyage fin de bail et transport reconnus par Bernard Nicod, Cogestim, Régie du Rhône et Domicim."
    },
    {
      title: "Monte-meubles pour rues étroites",
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
      answer: "Vous pouvez calculer immédiatement votre cubage avec notre calculateur 3D en ligne ou recevoir un devis détaillé et fixe sous 30 min (8h-19h) par email ou téléphone au 0800 825 925."
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
  // Avis réels, texte et localisation depuis data/reviews.ts (source unique)
  testimonials: getReviews(['julien', 'andressa', 'wagner'])
};

// Inglês: mesmas régies, coordenadas e avis (a citação fica em francês).
const lausanneConfigEn: LocationConfig = {
  ...lausanneConfig,
  cityName: 'Lausanne',
  regionBadge: 'Capital of Vaud • Lausanne & surrounding area',
  heroHeadlineMain: 'Trusted removals in',
  heroHeadlineHighlight: 'Lausanne & surroundings',
  heroSubtitle:
    'Teams specialised in Lausanne’s tricky access and steep slopes. The right equipment, full respect for Vaud letting agencies’ standards and comprehensive CHF 5M insurance.',
  metaTitle: 'Removals Lausanne | Fixed Price & Letting Agency Guarantee',
  metaDescription:
    'Professional movers in Lausanne and the surrounding area. Specialists in steep access, furniture lifts and eDéménagement. Free quote within 30 min, from CHF 550.',
  canonicalUrl: 'https://www.batimove.ch/en/removals-lausanne',
  districts: [
    { name: 'Lausanne centre & Le Flon', desc: 'Service in pedestrian zones, with access coordination and municipal permits.' },
    { name: 'Ouchy & Sous-Gare', desc: 'Period buildings, steep gradients and residences on the shores of Lake Geneva.' },
    { name: 'Chailly & La Sallaz', desc: 'Family neighbourhoods, detached houses and flats with sloping access.' },
    { name: 'Montchoisi & Georgette', desc: 'Upmarket residential areas, with protective packing for valuable furniture.' },
    { name: 'Beaulieu, Grey & Borde', desc: 'Flat moves and relocations of offices and medical practices.' },
    { name: 'Pully, Prilly & Renens', desc: 'Fast service throughout Lausanne’s inner suburbs at no extra cost.' }
  ],
  localFeatures: [
    {
      title: 'Handling steep access and gradients',
      desc: 'Our lorries and drivers are trained for the specific topography of the city of Lausanne.'
    },
    {
      title: 'eDéménagement Vaud support',
      desc: 'Advice and certificates for your official change-of-address notification to the Vaud residents’ registration office.'
    },
    {
      title: 'Vaud letting agency guarantee',
      desc: 'End of tenancy cleaning and transport recognised by Bernard Nicod, Cogestim, Régie du Rhône and Domicim.'
    },
    {
      title: 'Furniture lifts for narrow streets',
      desc: 'Compact lifts for safe access through windows, without blocking neighbourhood traffic.'
    }
  ],
  faqList: [
    {
      question: 'How do you handle a move on Lausanne’s steep streets?',
      answer: 'Lausanne has a height difference of more than 500 metres between the lake and the top of the city. Our vehicles are fitted with professional safety chocks, tail lifts and suitable carrying equipment to secure every load, even on the steepest streets.'
    },
    {
      question: 'How quickly can I get a removal quote in Lausanne?',
      answer: 'You can calculate your volume straight away with our online 3D calculator, or receive a detailed fixed quote within 30 min (8 am to 7 pm) by email or by phone on 0800 825 925.'
    },
    {
      question: 'Do you offer end of tenancy cleaning with a guarantee for the letting agency?',
      answer: 'Yes, our cleaning team guarantees a 100% successful check-out inspection. If the letting agency (Bernard Nicod, Cogestim, etc.) asks for a touch-up on the day of the inspection, we step in immediately at no extra cost.'
    },
    {
      question: 'Do you handle moves between Lausanne and Geneva or Valais?',
      answer: 'Absolutely. We run daily trips around Lake Geneva (Lausanne–Geneva) as well as to Valais, Fribourg, Neuchâtel and the rest of Switzerland.'
    }
  ]
};

const CONFIG = defineCopy<LocationConfig>(lausanneConfig, lausanneConfigEn);

export const Lausanne: React.FC = () => {
  const { lang } = useLang();
  return <Home local={cityHome('lausanne', CONFIG[lang], lang)} />;
};
export default Lausanne;
