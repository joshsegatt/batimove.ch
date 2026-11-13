import React from 'react';
import { LocationLandingTemplate, LocationConfig } from '../../components/LocationLandingTemplate';
import { getReviews } from '../../data/reviews';
import { defineCopy, useLang } from '../../i18n';

const vaudConfig: LocationConfig = {
  cityName: 'Canton de Vaud',
  regionBadge: 'Canton de Vaud • La Côte, Riviera & Nord Vaudois',
  heroHeadlineMain: "Déménagement de Prestige dans le",
  heroHeadlineHighlight: "Canton de Vaud !",
  heroSubtitle: "De Nyon à Montreux, en passant par Morges et Yverdon. Service complet pour appartements, villas et entreprises vaudoises avec rigueur helvétique et assurance 5M CHF.",
  metaTitle: "Déménagement Vaud | La Côte & Riviera - Batimove",
  metaDescription: "Déménagement dans le canton de Vaud : Nyon, Morges, Vevey, Montreux, Yverdon. Déménageurs qualifiés, garde-meubles et devis gratuit sous 30 min dès CHF 550.",
  canonicalUrl: "https://www.batimove.ch/demenagement-vaud",
  geoPosition: {
    lat: 46.5197,
    lng: 6.6323,
    postalCode: "1000",
    street: "Canton de Vaud"
  },
  districts: [
    { name: "La Côte (Nyon, Gland, Rolle)", desc: "Déménagements résidentiels le long du lac, villas contemporaines et expatriés." },
    { name: "Région de Morges & Aubonne", desc: "Prise en charge de domaines viticoles, propriétés privées et centres urbains historiques." },
    { name: "Riviera Vaudoise (Vevey & Montreux)", desc: "Gestion des accès en corniche, mobilier haut de gamme et résidences hôtelières." },
    { name: "Nord Vaudois (Yverdon & Grandson)", desc: "Transport de familles, artisans, industries et fermes rénovées du Jura vaudois." },
    { name: "La Broye & Gros-de-Vaud (Payerne, Echallens)", desc: "Déménagements spacieux, surfaces rurales et transferts d'ateliers professionnels." },
    { name: "Aigle, Bex & Chablais Vaudois", desc: "Liaisons régulières vers les Préalpes et le Valais avec flotte de camions capitonnés." }
  ],
  localFeatures: [
    {
      title: "Flotte moderne adaptée à tout le canton",
      desc: "Fourgons agiles pour les centres historiques étroits et camions grands volumes pour villas vaudoises."
    },
    {
      title: "Formalités administratives cantonales",
      desc: "Sur demande, nous nous occupons des réservations de voirie communale et des formalités eDéménagement Vaud."
    },
    {
      title: "Stockage sécurisé et garde-meubles",
      desc: "Entrepôts sécurisés sous scellés pour entreposer votre mobilier entre deux baux immobiliers."
    },
    {
      title: "Couverture régies et protection RC 5M CHF",
      desc: "Chaque déménagement est garanti conforme aux exigences des gérances immobilières du canton."
    }
  ],
  regiesList: [
    "Bernard Nicod", "Cogestim", "Régie du Rhône", "Naef Vaud", "Domicim", "De Rham", "Privera Vaud"
  ],
  faqList: [
    {
      question: "Intervenez-vous dans toutes les communes du canton de Vaud ?",
      answer: "Oui, Batimove dessert l'intégralité du canton de Vaud : district de Nyon, Morges, Lausanne, Riviera-Pays-d'Enhaut, Jura-Nord vaudois, Broye-Vully, Lavaux-Oron et Aigle, avec un tarif clair et sans majoration kilométrique injustifiée."
    },
    {
      question: "Pouvez-vous stocker mes meubles si la date d'entrée dans mon nouveau logement est décalée ?",
      answer: "Absolument. Nous mettons à disposition des box de garde-meubles sous scellés, sécurisés, ventilés et sous vidéosurveillance 24h/24 pour quelques jours, quelques mois ou davantage."
    },
    {
      question: "Proposez-vous la fourniture de cartons de déménagement dans le canton de Vaud ?",
      answer: "Oui, nous livrons directement à votre domicile des cartons professionnels renforcés (standards, livres, penderies pour vêtements sur cintres, caisses vaisselle avec alvéoles et papier bulle)."
    },
    {
      question: "Combien de temps à l'avance faut-il réserver son déménagement dans le canton de Vaud ?",
      answer: "Nous recommandons de réserver 2 à 4 semaines à l'avance, particulièrement pour les fins de mois officielles vaudoises (trimestres de baux fin mars, fin juin, fin septembre, fin décembre). Des créneaux urgents restent néanmoins disponibles sous 48h."
    }
  ],
  // Avis réels, texte et localisation depuis data/reviews.ts (source unique)
  testimonials: getReviews(['julien', 'wagner', 'andressa'])
};

// Inglês: mesmas régies, coordenadas e avis (a citação fica em francês).
// cityName "Vaud" entra em frases como "Ready for a stress-free move in Vaud?".
const vaudConfigEn: LocationConfig = {
  ...vaudConfig,
  cityName: 'Vaud',
  regionBadge: 'Canton of Vaud • La Côte, Riviera & Northern Vaud',
  heroHeadlineMain: 'Prestige removals across the',
  heroHeadlineHighlight: 'canton of Vaud',
  heroSubtitle:
    'From Nyon to Montreux, by way of Morges and Yverdon. A complete service for flats, villas and businesses across Vaud, with Swiss precision and CHF 5M insurance.',
  metaTitle: 'Removals Vaud | La Côte & Riviera - Batimove',
  metaDescription:
    'Removals in the canton of Vaud: Nyon, Morges, Vevey, Montreux, Yverdon. Qualified movers, furniture storage and a free quote within 30 min, from CHF 550.',
  canonicalUrl: 'https://www.batimove.ch/en/removals-vaud',
  districts: [
    { name: 'La Côte (Nyon, Gland, Rolle)', desc: 'Home moves along the lake, contemporary villas and expatriates.' },
    { name: 'Morges & Aubonne area', desc: 'Wine estates, private properties and historic town centres.' },
    { name: 'Vaud Riviera (Vevey & Montreux)', desc: 'Access along the corniche roads, high-end furniture and hotel residences.' },
    { name: 'Northern Vaud (Yverdon & Grandson)', desc: 'Moves for families, craftspeople and industry, and renovated farmhouses in the Vaud Jura.' },
    { name: 'La Broye & Gros-de-Vaud (Payerne, Echallens)', desc: 'Large-volume moves, rural properties and workshop relocations.' },
    { name: 'Aigle, Bex & the Vaud Chablais', desc: 'Regular trips to the Alpine foothills and Valais with a fleet of padded lorries.' }
  ],
  localFeatures: [
    {
      title: 'A modern fleet for the whole canton',
      desc: 'Nimble vans for narrow historic centres and high-volume lorries for Vaud villas.'
    },
    {
      title: 'Cantonal paperwork',
      desc: 'On request, we handle municipal road-space bookings and eDéménagement Vaud formalities.'
    },
    {
      title: 'Secure furniture storage',
      desc: 'Secure, sealed warehouses to store your furniture between two leases.'
    },
    {
      title: 'Letting agency standards and CHF 5M public liability',
      desc: 'Every move is guaranteed to meet the standards of the canton’s letting agencies.'
    }
  ],
  faqList: [
    {
      question: 'Do you work in every municipality in the canton of Vaud?',
      answer: 'Yes, Batimove covers the entire canton of Vaud: the districts of Nyon, Morges, Lausanne, Riviera-Pays-d’Enhaut, Jura-Nord vaudois, Broye-Vully, Lavaux-Oron and Aigle, with clear pricing and no unjustified mileage surcharges.'
    },
    {
      question: 'Can you store my furniture if the move-in date for my new home is pushed back?',
      answer: 'Absolutely. We provide sealed furniture storage units that are secure, ventilated and under 24/7 video surveillance, for a few days, a few months or longer.'
    },
    {
      question: 'Do you supply moving boxes in the canton of Vaud?',
      answer: 'Yes, we deliver reinforced professional boxes straight to your home (standard boxes, book boxes, wardrobe boxes for clothes on hangers, and dish packs with dividers and bubble wrap).'
    },
    {
      question: 'How far in advance should I book my move in the canton of Vaud?',
      answer: 'We recommend booking 2 to 4 weeks ahead, especially for Vaud’s official end-of-month moving dates (quarterly lease terms ending in March, June, September and December). Urgent slots are still available within 48 h.'
    }
  ]
};

const CONFIG = defineCopy<LocationConfig>(vaudConfig, vaudConfigEn);

export const Vaud: React.FC = () => {
  const { lang } = useLang();
  return <LocationLandingTemplate config={CONFIG[lang]} />;
};
export default Vaud;
