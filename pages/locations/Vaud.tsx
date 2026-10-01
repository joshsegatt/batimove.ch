import React from 'react';
import { LocationLandingTemplate, LocationConfig } from '../../components/LocationLandingTemplate';

const vaudConfig: LocationConfig = {
  cityName: 'Canton de Vaud',
  regionBadge: 'Canton de Vaud • La Côte, Riviera & Nord Vaudois',
  heroHeadlineMain: "Déménagement de Prestige dans le",
  heroHeadlineHighlight: "Canton de Vaud !",
  heroSubtitle: "De Nyon à Montreux, en passant par Morges et Yverdon. Service complet pour appartements, villas et entreprises vaudoises avec rigueur helvétique et assurance 5M CHF.",
  metaTitle: "Entreprise de Déménagement Vaud | La Côte & Riviera - Batimove",
  metaDescription: "Déménagement dans tout le canton de Vaud : Nyon, Morges, Vevey, Montreux, Yverdon. Déménageurs qualifiés, garde-meubles et devis gratuit 24h dès CHF 550.",
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
      title: "Flotte Moderne Adaptée à Tout le Canton",
      desc: "Fourgons agiles pour les centres historiques étroits et camions grands volumes pour villas vaudoises."
    },
    {
      title: "Formalités Administratives Cantonales",
      desc: "Accompagnement complet pour les réservations de voirie communale et formalités eDéménagement Vaud."
    },
    {
      title: "Stockage Sécurisé & Garde-Meubles",
      desc: "Entrepôts sécurisés sous scellés pour entreposer votre mobilier entre deux baux immobiliers."
    },
    {
      title: "Couverture Régies & Protection RC 5M CHF",
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
  testimonials: [
    {
      name: "Jean-Pierre & Martine G.",
      role: "Retraités",
      quote: "Déménagement de notre maison de Morges vers un appartement à Vevey. Une équipe polie, serviable, qui a pris grand soin de nos tableaux et bibelots fragiles. Service 5 étoiles.",
      rating: 5,
      location: "Morges & Vevey"
    },
    {
      name: "Alexandre K.",
      role: "Cadre International",
      quote: "Installation à Nyon depuis Zurich. Communication parfaite, respect scrupuleux des horaires et camion d'une propreté exemplaire. Une expérience sans le moindre souci.",
      rating: 5,
      location: "Nyon (La Côte)"
    },
    {
      name: "Dominique B.",
      role: "Artisan",
      quote: "Transfert d'atelier et de logement à Yverdon-les-Bains. Le matériel lourd a été transporté sans aucune difficulté grâce à leur monte-meubles. Très satisfait des tarifs.",
      rating: 5,
      location: "Yverdon-les-Bains"
    }
  ]
};

export const Vaud: React.FC = () => {
  return <LocationLandingTemplate config={vaudConfig} />;
};
export default Vaud;
