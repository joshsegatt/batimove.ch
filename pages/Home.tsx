import React, { useState } from 'react';
import { useRevealOnce } from '../hooks/useRevealOnce';
import { useGoogleRating } from '../hooks/useGoogleRating';
import { CUSTOMER_REVIEWS, localizeReview } from '../data/reviews';
import { HOME_FAQ_BY_LANG } from '../data/homeFaq';
import { QUOTE_SERVICES, localizeQuoteService } from '../data/quoteServices';
import { HOME_ENGAGEMENTS_BY_LANG, HOME_FICHE_BY_LANG } from '../data/homeTrust';
import { defineCopy, useLang, type Lang } from '../i18n';
import { 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  ChevronDown,
  ChevronRight,
  Phone,
  ShieldCheck, 
  Clock, 
  MapPin, 
  Mail, 
  Truck, 
  Package, 
  Building2, 
  Globe, 
  Shield, 
  Star, 
  Award, 
  Sparkles, 
  Warehouse, 
  ArrowUpRight, 
  FileText, 
  Wrench, 
  Send, 
  Headphones, 
  Layers,
  Navigation,
  Car
} from 'lucide-react';
import { Button, buttonClass } from '../components/UIComponents';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

// --- Custom Duotone Vector Icons Matching Reference ---
const ParachuteCargoIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Parachute Canopy */}
    <path
      d="M32 7C16 7 10 20 10 27C16 27 20 23 24 23C28 23 30 27 32 27C34 27 36 23 40 23C44 23 48 27 54 27C54 20 48 7 32 7Z"
      stroke="#0284c7"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M22 11C26 15 28 20 28 25" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 11C38 15 36 20 36 25" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    {/* Suspension Lines */}
    <path d="M12 27L25 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 25L28 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 25L36 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M52 27L39 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    {/* Cargo Box */}
    <rect x="23" y="43" width="18" height="15" rx="2" stroke="#0B1E33" strokeWidth="2.5" fill="#f8fafc" />
    <path d="M32 43V58" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
    <path d="M23 50H41" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ScooterDeliveryIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Delivery Cargo Box on Back */}
    <rect x="10" y="20" width="18" height="16" rx="2" stroke="#0284c7" strokeWidth="2.5" fill="#f0f9ff" />
    <path d="M19 20V36" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 28H28" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    {/* Rear Wheel */}
    <circle cx="17" cy="48" r="6" stroke="#0B1E33" strokeWidth="2.5" />
    {/* Front Wheel */}
    <circle cx="47" cy="48" r="6" stroke="#0B1E33" strokeWidth="2.5" />
    {/* Scooter Body / Frame */}
    <path d="M17 42H28L34 47H41" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 37L41 22H48" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M41 22L47 48" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M44 18H51" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const WarehouseShelfIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Warehouse Upright Storage Rack */}
    <path d="M14 10V54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50 10V54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 18H54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 36H54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 54H54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    {/* Top Shelf Pallet Box */}
    <rect x="22" y="24" width="20" height="12" rx="1.5" stroke="#0B1E33" strokeWidth="2.5" fill="#f8fafc" />
    <path d="M32 24V36" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
    {/* Bottom Shelf Pallet Box */}
    <rect x="18" y="42" width="16" height="12" rx="1.5" stroke="#0B1E33" strokeWidth="2.5" fill="#f8fafc" />
    <path d="M18 42L34 54" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const LocationParcelIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Pin Path */}
    <path
      d="M30 6C20 6 12 14 12 24C12 37 30 52 30 52C30 52 48 37 48 24C48 14 40 6 30 6Z"
      stroke="#0284c7"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="30" cy="23" r="5" stroke="#0284c7" strokeWidth="2" />
    {/* Delivery Parcel overlapping in foreground */}
    <rect x="34" y="38" width="18" height="16" rx="2" stroke="#0B1E33" strokeWidth="2.5" fill="#f0f9ff" />
    <path d="M34 38L52 54" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M52 38L34 54" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// --- Custom Duotone Icons for Complementary Section (Matching media_1789022717886.png) ---
const LogisticServicesPlaneIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Modern Airplane Body */}
    <path
      d="M32 6C30 6 29 8 29 11V24L12 31V35L29 30V44L23 48V52L32 49L41 52V48L35 44V30L52 35V31L35 24V11C35 8 34 6 32 6Z"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#0B1E33"
    />
    {/* Cockpit Window */}
    <ellipse cx="32" cy="12" rx="1.5" ry="2.5" fill="#38bdf8" />
    {/* Left Engine */}
    <rect x="20" y="27" width="3" height="7" rx="1" stroke="#ffffff" strokeWidth="1.8" fill="#0B1E33" />
    {/* Right Engine */}
    <rect x="41" y="27" width="3" height="7" rx="1" stroke="#ffffff" strokeWidth="1.8" fill="#0B1E33" />
    {/* Cargo Parcel Box in lower right */}
    <rect x="40" y="38" width="18" height="18" rx="2" stroke="#38bdf8" strokeWidth="2.2" fill="#0284c7" fillOpacity="0.4" />
    <path d="M49 38V56" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M40 47H58" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CarShippingTruckIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Truck Cabin & Chassis */}
    <path
      d="M34 42H48L56 32V24H48V18H34"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Windshield */}
    <path
      d="M48 24H54L50 30H46V24"
      stroke="#38bdf8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#38bdf8"
      fillOpacity="0.3"
    />
    {/* Front Wheel */}
    <circle cx="50" cy="46" r="5.5" stroke="#ffffff" strokeWidth="2.2" fill="#0B1E33" />
    <circle cx="50" cy="46" r="2.2" fill="#38bdf8" />
    {/* Rear Wheel */}
    <circle cx="20" cy="46" r="5.5" stroke="#ffffff" strokeWidth="2.2" fill="#0B1E33" />
    <circle cx="20" cy="46" r="2.2" fill="#38bdf8" />
    {/* Chassis Lines */}
    <path d="M26 46H44" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M10 46H14" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M56 46H58" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    {/* Cargo Container Box on Truck */}
    <rect x="10" y="16" width="24" height="24" rx="2" stroke="#38bdf8" strokeWidth="2.2" fill="#0284c7" fillOpacity="0.3" />
    <path d="M22 16V40" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 28H34" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    {/* Upward Arrow on cargo box */}
    <path d="M22 24L22 32M19 27L22 24L25 27" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FurnitureShippingShipIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Deck Crane on Left */}
    <path d="M16 32V18H25L32 14" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 14V20" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M22 18L16 32" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    {/* Stacked Containers on Deck */}
    <rect x="33" y="21" width="9" height="9" rx="1" stroke="#ffffff" strokeWidth="1.8" fill="#0B1E33" />
    <rect x="44" y="21" width="9" height="9" rx="1" stroke="#ffffff" strokeWidth="1.8" fill="#0B1E33" />
    <rect x="38.5" y="12" width="9" height="9" rx="1" stroke="#ffffff" strokeWidth="1.8" fill="#0B1E33" />
    {/* Ship Hull */}
    <path
      d="M10 32H54L48 43H16L10 32Z"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#0B1E33"
    />
    {/* Ocean Waves */}
    <path
      d="M8 48C11 46 14 46 17 48C20 50 23 50 26 48C29 46 32 46 35 48C38 50 41 50 44 48C47 46 50 46 53 48C56 50 59 50 62 48"
      stroke="#38bdf8"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M8 54C11 52 14 52 17 54C20 56 23 56 26 54C29 52 32 52 35 54C38 56 41 56 44 54C47 52 50 52 53 54C56 56 59 56 62 54"
      stroke="#38bdf8"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const FastestShippingClockIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Parcel Box */}
    <rect x="12" y="12" width="30" height="30" rx="3" stroke="#ffffff" strokeWidth="2.2" fill="#0B1E33" />
    {/* Top Tape Flap */}
    <path d="M22 12V19H32V12" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Side Label Lines */}
    <path d="M16 31H24" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 36H21" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    {/* Clock Face in Bottom Right */}
    <circle cx="43" cy="43" r="13" stroke="#38bdf8" strokeWidth="2.2" fill="#0284c7" fillOpacity="0.4" />
    {/* Clock Ticks */}
    <circle cx="43" cy="33" r="0.9" fill="#ffffff" />
    <circle cx="53" cy="43" r="0.9" fill="#ffffff" />
    <circle cx="43" cy="53" r="0.9" fill="#ffffff" />
    <circle cx="33" cy="43" r="0.9" fill="#ffffff" />
    {/* Clock Hands */}
    <path d="M43 43L43 37" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M43 43L48 43" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    {/* Motion Speed Lines */}
    <path d="M28 41H30" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M26 45H29" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// --- Custom Icons for Emballage Section (Matching media_1789022915762.png) ---
const PackingUnpackingIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Box Bottom & Front */}
    <path d="M10 20L24 27L38 20V34L24 41L10 34V20Z" stroke="#0284c7" strokeWidth="2.2" strokeLinejoin="round" fill="#e0f2fe" fillOpacity="0.4" />
    <path d="M24 27V41" stroke="#0284c7" strokeWidth="2.2" />
    {/* Open Flaps */}
    <path d="M10 20L6 14L18 10L24 16" stroke="#0B1E33" strokeWidth="2" strokeLinejoin="round" />
    <path d="M38 20L42 14L30 10L24 16" stroke="#0B1E33" strokeWidth="2" strokeLinejoin="round" />
    <path d="M24 27L18 20L24 16L30 20L24 27Z" stroke="#0284c7" strokeWidth="2" fill="#bae6fd" fillOpacity="0.6" />
    {/* Packing Arrow inside */}
    <path d="M24 24V14M21 17L24 14L27 17" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StorageClipboardIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Clipboard Base */}
    <rect x="12" y="10" width="24" height="32" rx="2.5" stroke="#0284c7" strokeWidth="2.2" fill="#e0f2fe" fillOpacity="0.4" />
    {/* Top Clip */}
    <path d="M18 10V8C18 6.9 18.9 6 20 6H28C29.1 6 30 6.9 30 8V10" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="9" r="1.5" fill="#0B1E33" />
    {/* Document Lines / Inventory List */}
    <rect x="16" y="16" width="6" height="6" rx="1" stroke="#0284c7" strokeWidth="1.5" />
    <path d="M25 18H31" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M25 21H29" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 27H32" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 32H28" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 37H24" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const AssuranceUmbrellaIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Card Boundary */}
    <rect x="8" y="12" width="32" height="24" rx="3" stroke="#0284c7" strokeWidth="2.2" fill="#e0f2fe" fillOpacity="0.4" />
    <path d="M8 20H40" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="3 3" />
    {/* Umbrella / Protection Symbol */}
    <path d="M24 24C20 24 17 27 17 30H31C31 27 28 24 24 24Z" stroke="#0B1E33" strokeWidth="2" fill="#bae6fd" fillOpacity="0.6" />
    <path d="M24 22V33C24 34.1 23.1 35 22 35" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
  </svg>
);


/** Serviços além da mudança local. Só o que a Batimove confirma fazer. */
type HomeComplementaire = {
  title: string;
  text: string;
  cta: string;
  /** Caminho francês; passa por lp() na renderização. */
  to?: string;
  href?: string;
  Icon: React.FC<{ className?: string }>;
};

const HOME_COMPLEMENTAIRES: Record<Lang, HomeComplementaire[]> = {
  fr: [
  {
    title: 'Déménagement international',
    text: "Vers la France, l'Italie, l'Allemagne, l'Autriche, le reste de l'Union européenne et le Royaume-Uni. Nous vous aidons avec les documents de douane.",
    cta: "Voir le déménagement international",
    to: '/demenagement-international',
    Icon: LogisticServicesPlaneIcon,
  },
  {
    title: 'Transport de véhicules',
    text: 'Voitures et motos transportées en Suisse et en Europe.',
    cta: 'Demander un devis',
    to: '/quote?type=prive',
    Icon: CarShippingTruckIcon,
  },
  {
    title: 'Urgences 24/7',
    text: 'Un logement à libérer plus tôt que prévu, un départ avancé : une équipe répond de jour comme de nuit.',
    cta: 'Appeler le 0800 825 925',
    href: 'tel:0800825925',
    Icon: FastestShippingClockIcon,
  },
  {
    title: 'Garde-meubles',
    text: 'Stockage de quelques semaines ou de plusieurs mois, dans un dépôt ventilé sous vidéosurveillance.',
    cta: 'Voir le garde-meubles',
    to: '/garde-meubles',
    Icon: WarehouseShelfIcon,
  },
  ],
  en: [
    {
      title: 'International removals',
      text: 'To France, Italy, Germany, Austria, the rest of the European Union and the United Kingdom. We help you with the customs paperwork.',
      cta: 'See international removals',
      to: '/demenagement-international',
      Icon: LogisticServicesPlaneIcon,
    },
    {
      title: 'Vehicle transport',
      text: 'Cars and motorbikes transported within Switzerland and across Europe.',
      cta: 'Request a quote',
      to: '/quote?type=prive',
      Icon: CarShippingTruckIcon,
    },
    {
      title: 'Emergencies 24/7',
      text: 'A home to vacate sooner than planned, a departure brought forward: a team responds day and night.',
      cta: 'Call 0800 825 925',
      href: 'tel:0800825925',
      Icon: FastestShippingClockIcon,
    },
    {
      title: 'Storage',
      text: 'Storage for a few weeks or several months, in a ventilated depot under CCTV surveillance.',
      cta: 'Explore storage',
      to: '/garde-meubles',
      Icon: WarehouseShelfIcon,
    },
  ],
};

const COPY = defineCopy(
  {
    heroTitle1: 'Déménagement à Genève, Vaud, Fribourg et Valais.',
    heroTitle2: 'Prix ferme, sans surprise.',
    heroRating: (value: number) => value.toFixed(1).replace('.', ','),
    heroRatingLabel: (value: number) => `Note Google : ${value.toFixed(1).replace('.', ',')} sur 5`,
    heroLead:
      "Appartement, maison ou bureau : nous emballons, transportons et livrons à la date convenue, avec notre propre monte-meubles si l'accès l'exige.",
    heroTrust: ['Devis sous 30 min (8h-19h)', 'Prix ferme', 'RC Pro CHF 5M', 'Joignable 7j/7'],
    heroCta: 'Obtenir mon devis en 30 min',
    freeCall: 'appel gratuit',
    heroShortcuts: 'Ou choisissez directement :',
    heroPhotoBadge: 'Notre propre monte-meubles',
    heroImgAlt: 'Monte-meubles et camions Batimove garés devant des immeubles',

    engagementsTitle: 'Ce que nous réglons pour vous',

    aboutImgAlt: 'La flotte Batimove : le monte-meubles et trois camions de déménagement',
    aboutTitle: 'Batimove, en toute transparence',
    aboutLead:
      'Une entreprise genevoise au service des particuliers et des entreprises de Suisse romande. Pas de promesse floue : voici qui nous sommes, où nous intervenons et ce qui vous protège.',
    aboutServices: 'Découvrir nos prestations',
    aboutQuote: 'Demander un devis',

    proTitle: 'Recommandé par les professionnels et les régies',
    proAdviceTitle: 'Conseil gratuit',
    proAdviceText: 'Visite technique sur place ou estimation par vidéo gratuite sous 24h.',
    proGuaranteeTitle: 'Garantie totale',
    proGuaranteeText: 'Garantie 100% remise de clés conforme aux exigences des régies suisses.',
    proUrgentTitle: 'Urgences 24/7',
    proUrgentText: "Ligne d'urgence 24/7 et chef de projet joignable en direct le jour J.",
    proLead:
      'Particuliers, expatriés et entreprises nous confient leur déménagement à Genève et dans le canton de Vaud. Nous connaissons les exigences des régies lors de la remise des clés et préparons chaque état des lieux en conséquence.',
    proCardKicker: "Besoin d'un devis immédiat ?",
    proCardText: 'Nos spécialistes répondent à vos questions et planifient votre projet sans engagement :',
    proCardPhoneNote: 'Numéro gratuit en Suisse',

    readyTitle: 'Toujours prêts à répondre à vos besoins',
    learnMore: 'En savoir plus',
    readyLongTitle: 'Déménagement longue distance',
    readyLongText:
      'Intercantonal et international (Genève, Vaud, Zurich, France, UE) avec formalités de douane suisses intégrales.',
    readyLocalTitle: 'Déménagement résidentiel local',
    readyLocalText: 'Genève, Lausanne, Nyon, Montreux. Formules sur mesure du studio à la villa avec protection complète.',
    readyImgAlt: "Monte-meubles Batimove déployé jusqu'au balcon d'une résidence",
    readyBusinessTitle: "Transfert d'entreprise et de bureaux",
    readyBusinessText:
      "Déménagement de parcs informatiques, archives et open-spaces le week-end sans aucune coupure d'activité.",
    readySmallTitle: 'Petits volumes et transports express',
    readySmallText:
      "Transport de meubles spécifiques, enlèvement d'achats volumineux et interventions urgentes en Romandie.",

    complementairesTitle: 'Services complémentaires',
    complementairesLead:
      "Au-delà du déménagement en Suisse romande : l'étranger, vos véhicules, l'urgence et le stockage.",

    packImgAlt: 'Camion Batimove chargé : cartons, couvertures de protection et meubles emballés',
    packImg2Alt: 'Meuble entièrement emballé dans du papier bulle',
    packTitle: 'Nous emballons tout avec le plus grand soin',
    packLead:
      "L'emballage constitue la clé d'un déménagement sans accroc. Nos techniciens utilisent des techniques éprouvées et des fournitures professionnelles renforcées pour chaque type d'objet.",
    packPackingTitle: 'Emballage et déballage',
    packPackingText: 'Caisses alvéolées et papier bulle anti-choc pour verres, vaisselle et objets fragiles.',
    packStorageTitle: 'Garde-meubles et stockage',
    packStorageText: "Inventaire complet avec contrôle d'état et stockage sécurisé sous scellés à Genève.",
    packInsuranceTitle: 'Assurance All Risk',
    packInsuranceText: "Couverture All Risk de vos biens, en complément de notre RC Pro jusqu'à 5M CHF.",
    packCtaText: "Estimez votre matériel et commandez vos fournitures d'emballage en quelques clics.",
    packCtaButton: 'Calculer mes cartons',

    reviewsBadge: (value: number, count: number) => `${value.toFixed(1).replace('.', ',')} / 5 • ${count} avis Google vérifiés`,
    reviewsTitle: 'Ce que disent nos clients',
    googleReview: 'Avis Google',
    reviewDotLabel: (n: number, total: number) => `Avis ${n} sur ${total}`,

    bannerTitle: 'Vous avez un projet de déménagement ?',
    bannerPromise: 'Devis gratuit et ferme sous 30 min (8h-19h).',
    bannerNoCommitment: 'Sans engagement • Appel gratuit au',
    bannerCta: 'Demander un devis gratuit',
    bannerImgAlt: 'Deux camions Batimove devant une maison pendant un déménagement',

    faqTitle: 'Questions fréquentes',
    faqMore: 'Une autre question ? Appelez-nous gratuitement au',
    faqOr: 'ou',
    faqWrite: 'écrivez-nous',
  },
  {
    heroTitle1: 'Removals in Geneva, Vaud, Fribourg and Valais.',
    heroTitle2: 'Fixed price, no surprises.',
    heroRating: (value: number) => value.toFixed(1),
    heroRatingLabel: (value: number) => `Google rating: ${value.toFixed(1)} out of 5`,
    heroLead:
      'Flat, house or office: we pack, transport and deliver on the agreed date, with our own furniture lift if the access requires it.',
    heroTrust: ['Quote within 30 min (8am-7pm)', 'Fixed price', 'CHF 5M liability cover', 'Available 7 days a week'],
    heroCta: 'Get my quote in 30 min',
    freeCall: 'free call',
    heroShortcuts: 'Or go straight to:',
    heroPhotoBadge: 'Our own furniture lift',
    heroImgAlt: 'Batimove furniture lift and vans parked in front of apartment buildings',

    engagementsTitle: 'What we take care of for you',

    aboutImgAlt: 'The Batimove fleet: the furniture lift and three removal vans',
    aboutTitle: 'Batimove, in full transparency',
    aboutLead:
      'A Geneva company serving private clients and businesses across French-speaking Switzerland. No vague promises: here is who we are, where we work and what protects you.',
    aboutServices: 'Explore our services',
    aboutQuote: 'Request a quote',

    proTitle: 'Recommended by professionals and letting agencies',
    proAdviceTitle: 'Free advice',
    proAdviceText: 'On-site survey or free video estimate within 24 hours.',
    proGuaranteeTitle: 'Full guarantee',
    proGuaranteeText: '100% key handover guarantee, compliant with the requirements of Swiss letting agencies.',
    proUrgentTitle: 'Emergencies 24/7',
    proUrgentText: '24/7 emergency line and a project manager you can reach directly on moving day.',
    proLead:
      'Private clients, expats and businesses trust us with their move in Geneva and the canton of Vaud. We know what letting agencies expect at key handover and prepare every check-out inspection accordingly.',
    proCardKicker: 'Need a quote right away?',
    proCardText: 'Our specialists answer your questions and plan your project, with no obligation:',
    proCardPhoneNote: 'Freephone within Switzerland',

    readyTitle: 'Always ready to meet your needs',
    learnMore: 'Learn more',
    readyLongTitle: 'Long-distance removals',
    readyLongText:
      'Between cantons and abroad (Geneva, Vaud, Zurich, France, EU), with all Swiss customs formalities handled in full.',
    readyLocalTitle: 'Local home removals',
    readyLocalText: 'Geneva, Lausanne, Nyon, Montreux. Tailored packages from studio flat to villa, with full protection.',
    readyImgAlt: 'Batimove furniture lift extended up to the balcony of a residence',
    readyBusinessTitle: 'Business and office relocation',
    readyBusinessText:
      'IT equipment, archives and open-plan offices moved at the weekend, with no interruption to your business.',
    readySmallTitle: 'Small loads and express transport',
    readySmallText:
      'Transport of individual pieces of furniture, collection of bulky purchases and urgent jobs across French-speaking Switzerland.',

    complementairesTitle: 'Additional services',
    complementairesLead:
      'Beyond moving within French-speaking Switzerland: abroad, your vehicles, emergencies and storage.',

    packImgAlt: 'Loaded Batimove van: boxes, protective blankets and wrapped furniture',
    packImg2Alt: 'A piece of furniture fully wrapped in bubble wrap',
    packTitle: 'We pack everything with the utmost care',
    packLead:
      'Packing is the key to a smooth move. Our technicians use proven techniques and reinforced professional supplies for every type of item.',
    packPackingTitle: 'Packing and unpacking',
    packPackingText: 'Cell-divided crates and shock-absorbing bubble wrap for glasses, crockery and fragile items.',
    packStorageTitle: 'Furniture storage',
    packStorageText: 'Full inventory with condition check and secure, sealed storage in Geneva.',
    packInsuranceTitle: 'All Risk insurance',
    packInsuranceText: 'All Risk cover for your belongings, on top of our professional liability insurance up to CHF 5M.',
    packCtaText: 'Estimate what you need and order your packing supplies in a few clicks.',
    packCtaButton: 'Calculate my boxes',

    reviewsBadge: (value: number, count: number) => `${value.toFixed(1)} / 5 • ${count} verified Google reviews`,
    reviewsTitle: 'What our customers say',
    googleReview: 'Google review',
    reviewDotLabel: (n: number, total: number) => `Review ${n} of ${total}`,

    bannerTitle: 'Planning a move?',
    bannerPromise: 'Free, fixed quote within 30 min (8am-7pm).',
    bannerNoCommitment: 'No obligation • Free call on',
    bannerCta: 'Request a free quote',
    bannerImgAlt: 'Two Batimove vans outside a house during a move',

    faqTitle: 'Frequently asked questions',
    faqMore: 'Any other questions? Call us free of charge on',
    faqOr: 'or',
    faqWrite: 'write to us',
  }
);

/** Nota Google com estrelas (preenchimento parcial na última), sem texto de avaliação. */
const GoogleRating: React.FC<{ value: number; text: string; label: string }> = ({ value, text, label }) => {
  const stars = (cls: string) => (
    <span className={`flex w-max gap-0.5 ${cls}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="h-4 w-4 shrink-0 fill-current" strokeWidth={0} />
      ))}
    </span>
  );
  return (
    <p className="inline-flex w-fit items-center gap-2.5 rounded-lg border border-glacier-line bg-white px-3 py-2 shadow-rest" aria-label={label}>
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.37 7.36 24 12 24Z" />
        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
      </svg>
      <span aria-hidden="true" className="relative inline-flex">
        {stars('text-slate-300')}
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${(value / 5) * 100}%` }}>
          {stars('text-amber-400')}
        </span>
      </span>
      <span aria-hidden="true" className="text-sm font-semibold tabular-nums text-[#0B1E33]">{text}</span>
    </p>
  );
};

export const Home: React.FC = () => {
  const { lang, lp } = useLang();
  const c = COPY[lang];

  // Testimonial Carousel Active State
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  // Nota do Google em tempo real (com a nota de data/reviews.ts como reserva).
  const rating = useGoogleRating();
  // Movimento da página (DESIGN.md, The Ruled Line Rule): as linhas se desenham
  // quando o bloco entra na tela, como itens resolvidos um após o outro.
  const engagementsReveal = useRevealOnce<HTMLUListElement>();
  const ficheReveal = useRevealOnce<HTMLDListElement>(0.25);

  const testimonials = CUSTOMER_REVIEWS.map((r) => localizeReview(r, lang));

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-600 selection:text-white">
      <SEO
        title="Batimove Sàrl : Déménagement à Genève, Lausanne & Vaud"
        description="Entreprise suisse de déménagement pour particuliers et entreprises à Genève, Lausanne et dans le canton de Vaud. Devis gratuit sous 30 min et garantie 5M CHF."
        canonical="https://www.batimove.ch/"
      />

      {/* =========================================================================
          SECTION 1: HERO
          Em 3 segundos: nota Google, o que fazemos e onde, preço ferme, fatos
          verificáveis, uma ação principal e o telefone. Compacta em laptops baixos.
          ========================================================================= */}
      <section className="relative overflow-hidden bg-glacier pt-4 sm:pt-6 lg:pt-8 [@media(min-width:1024px)_and_(max-height:940px)]:pt-4 [@media(min-width:1024px)_and_(max-height:760px)]:!pt-2">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-12">

            {/* Coluna de texto: prova (estrelas Google), promessa com lugar e preço,
                fatos em uma linha, uma ação principal e atalhos por serviço. */}
            <div className="flex min-w-0 flex-col justify-center py-6 lg:col-span-7 lg:py-12 xl:col-span-6 [@media(min-width:1024px)_and_(max-height:860px)]:py-6">
              <GoogleRating value={rating.value} text={c.heroRating(rating.value)} label={c.heroRatingLabel(rating.value)} />

              <h1 className="mt-5 font-display text-3xl font-medium leading-[1.1] tracking-tight text-[#0B1E33] text-balance sm:text-4xl xl:text-5xl [@media(min-width:1024px)_and_(max-height:860px)]:mt-4 [@media(min-width:1024px)_and_(max-height:860px)]:text-4xl">
                {c.heroTitle1}{' '}
                <span className="text-[#0284c7]">{c.heroTitle2}</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 xl:text-xl [@media(min-width:1024px)_and_(max-height:860px)]:mt-4 [@media(min-width:1024px)_and_(max-height:860px)]:text-lg">
                {c.heroLead}
              </p>

              {/* Fatos verificáveis, numa linha */}
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-base font-medium text-[#0B1E33]">
                {c.heroTrust.map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 shrink-0 text-[#0369A1]" strokeWidth={2.5} aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>

              {/* Ação principal + telefone */}
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6 [@media(min-width:1024px)_and_(max-height:860px)]:mt-6">
                <Link to={lp('/quote')} className={buttonClass('primary', 'lg')}>
                  {c.heroCta}
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <a
                  href="tel:0800825925"
                  className="inline-flex items-center gap-2 py-2 text-lg font-semibold text-[#0B1E33] transition-colors duration-150 hover:text-[#0369A1]"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  <span className="tabular-nums">0800 825 925</span>
                  <span className="text-base font-normal text-slate-600">{c.freeCall}</span>
                </a>
              </div>

              {/* Atalhos: cada serviço abre o devis já direcionado */}
              <div className="mt-8 [@media(min-width:1024px)_and_(max-height:860px)]:mt-6">
                <p id="hero-projet" className="text-sm font-semibold text-slate-600">{c.heroShortcuts}</p>
                <ul aria-labelledby="hero-projet" className="mt-2.5 flex flex-wrap gap-2">
                  {QUOTE_SERVICES.map((s) => localizeQuoteService(s, lang)).map(({ id: type, label, icon: Icon }) => (
                    <li key={type}>
                      <Link
                        to={lp(`/quote?type=${type}`)}
                        className="group inline-flex h-10 items-center gap-2 rounded-lg border border-glacier-line bg-white px-3.5 text-base font-semibold text-[#0B1E33] transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#0B1E33] hover:bg-[#0B1E33] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
                      >
                        <Icon className="h-[18px] w-[18px] text-[#0369A1] transition-colors duration-150 group-hover:text-white" strokeWidth={1.75} aria-hidden="true" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Foto real: o monte-meubles próprio e a frota. Emoldurada, com folga
                embaixo para não encostar na faixa navy. */}
            <div className="relative min-w-0 pb-8 lg:col-span-5 lg:self-center lg:pb-0 xl:col-span-6">
              <img
                src="/photos/batimove-flotte-monte-meubles-1280.webp"
                srcSet="/photos/batimove-flotte-monte-meubles-720.webp 720w, /photos/batimove-flotte-monte-meubles-1280.webp 1280w"
                sizes="(min-width: 1280px) 600px, (min-width: 1024px) 42vw, 100vw"
                alt={c.heroImgAlt}
                width={1280}
                height={853}
                fetchPriority="high"
                decoding="async"
                className="block aspect-[3/2] h-auto w-full rounded-xl object-cover shadow-overlay"
              />
              <p className="absolute bottom-12 left-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0B1E33] shadow-raised lg:bottom-4">
                <Truck className="h-4 w-4 text-[#0369A1]" aria-hidden="true" />
                {c.heroPhotoBadge}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CE QUE NOUS RÉGLONS POUR VOUS (faixa navy)
          Só o que a Batimove faz de concreto e que já está afirmado no site:
          autorização de estacionamento, proteção das áreas comuns, entrega à régie.
          ========================================================================= */}
      <section aria-labelledby="engagements-title" className="relative z-20 bg-[#0B1E33] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <h2
              id="engagements-title"
              className="font-display text-2xl font-medium leading-[1.1] tracking-tight text-white lg:col-span-3 lg:text-4xl"
            >
              {c.engagementsTitle}
            </h2>
            <ul ref={engagementsReveal.ref} className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:col-span-9">
              {HOME_ENGAGEMENTS_BY_LANG[lang].map(({ title, text }, i) => (
                <li key={title} className="relative border-t border-white/20 pt-5">
                  {/* Traço azul que se desenha da esquerda: o item "réglé" */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-px h-px origin-left bg-sky-300 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                    style={{
                      transform: engagementsReveal.pending ? 'scaleX(0)' : 'scaleX(1)',
                      transitionDelay: `${i * 220}ms`,
                    }}
                  />
                  <div
                    className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      // Texto nunca some: se a animação não rodar, continua legível.
                      engagementsReveal.pending ? 'translate-y-1 opacity-60' : 'translate-y-0 opacity-100'
                    }`}
                    style={{ transitionDelay: `${i * 220 + 280}ms` }}
                  >
                    <h3 className="font-display text-xl font-medium tracking-tight text-white">{title}</h3>
                    <p className="mt-2 text-lg leading-relaxed text-slate-300">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: À PROPOS, EN TOUTE TRANSPARENCE (fiche d'identité)
          Concorrentes antigos pesam por história (Harsch 1957, Balestrafic 50 ans).
          A Batimove pesa por precisão: fatos que o cliente pode conferir.
          ========================================================================= */}
      <section id="about" aria-labelledby="about-title" className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

            {/* Foto real da frota */}
            <div className="lg:col-span-5">
              <img
                src="/photos/batimove-flotte-1200.webp"
                srcSet="/photos/batimove-flotte-640.webp 640w, /photos/batimove-flotte-1200.webp 1200w"
                sizes="(min-width: 1024px) 480px, 100vw"
                alt={c.aboutImgAlt}
                width={1200}
                height={804}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full rounded-xl object-cover shadow-raised"
              />
            </div>

            <div className="lg:col-span-7">
              <h2
                id="about-title"
                className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-[#0B1E33] sm:text-4xl lg:text-5xl"
              >
                {c.aboutTitle}
              </h2>
              <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-slate-600">
                {c.aboutLead}
              </p>

              <dl ref={ficheReveal.ref} className="mt-10 grid grid-cols-1 border-t border-slate-200 sm:grid-cols-2">
                {HOME_FICHE_BY_LANG[lang].map(({ term, desc, href }, i) => (
                  <div
                    key={term}
                    className={`relative py-4 ${i % 2 === 1 ? 'sm:border-l sm:border-slate-200 sm:pl-6' : 'sm:pr-6'}`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-left bg-slate-200 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                      style={{
                        transform: ficheReveal.pending ? 'scaleX(0)' : 'scaleX(1)',
                        transitionDelay: `${i * 70}ms`,
                      }}
                    />
                    <dt className="text-sm text-slate-500">{term}</dt>
                    <dd className="mt-1 text-lg font-semibold leading-snug text-[#0B1E33] tabular-nums">
                      {href ? (
                        <a
                          href={href}
                          className="-my-3 inline-block py-3 underline decoration-slate-300 underline-offset-4 transition-colors duration-150 hover:decoration-[#0B1E33]"
                        >
                          {desc}
                        </a>
                      ) : (
                        desc
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                {/* Leva às prestações da própria home (a antiga página /services
                    era o formulário de leads que não é mais usado). */}
                <a
                  href="#services"
                  className="btn btn-lg btn-secondary"
                >
                  {c.aboutServices}
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </a>
                <Link
                  to={lp('/quote')}
                  className="inline-block py-3 text-lg font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors duration-150 hover:decoration-[#0B1E33]"
                >
                  {c.aboutQuote}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: "RECOMMANDÉ PAR LES PROFESSIONNELS" ("WE'RE CHOSEN BY PROFESSIONALS")
          ========================================================================= */}
      <section className="relative border-y border-glacier-line bg-glacier py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Why Choose Us & 3 Icons */}
            <div className="lg:col-span-7">
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#0B1E33] tracking-tight leading-[1.12] mb-10">
                {c.proTitle}
              </h2>

              {/* 3 Columns under title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Item 1 */}
                <div className="rounded-xl border border-glacier-line bg-white p-5 shadow-rest">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-[#0B1E33] text-base mb-1.5">
                    {c.proAdviceTitle}
                  </h3>
                  <p className="text-base text-slate-500 leading-relaxed">
                    {c.proAdviceText}
                  </p>
                </div>

                {/* Item 2 */}
                <div className="rounded-xl border border-glacier-line bg-white p-5 shadow-rest">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-[#0B1E33] text-base mb-1.5">
                    {c.proGuaranteeTitle}
                  </h3>
                  <p className="text-base text-slate-500 leading-relaxed">
                    {c.proGuaranteeText}
                  </p>
                </div>

                {/* Item 3 */}
                <div className="rounded-xl border border-glacier-line bg-white p-5 shadow-rest">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-[#0B1E33] text-base mb-1.5">
                    {c.proUrgentTitle}
                  </h3>
                  <p className="text-base text-slate-500 leading-relaxed">
                    {c.proUrgentText}
                  </p>
                </div>

              </div>
            </div>

            {/* Right Column: Paragraph & Dark Blue Phone Card */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full pt-4">
              <p className="mb-8 text-lg leading-relaxed text-slate-600">
                {c.proLead}
              </p>

              {/* Dark Navy Highlight Card with Phone */}
              <div className="rounded-xl bg-[#0B1E33] p-8 text-white shadow-overlay">
                <p className="mb-2 font-display text-lg font-semibold tracking-tight text-sky-300">
                  {c.proCardKicker}
                </p>
                <p className="mb-6 text-base text-slate-300">
                  {c.proCardText}
                </p>
                <a
                  href="tel:0800825925"
                  className="group -m-2 inline-flex items-center gap-3 rounded-xl p-2 text-white transition-colors duration-150 hover:bg-navy-raise focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#0369A1] text-white transition-colors duration-150 group-hover:bg-[#0284C7]">
                    <Phone className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display text-2xl font-medium tracking-tight tabular-nums sm:text-3xl">
                      0800 825 925
                    </span>
                    <span className="block text-sm font-medium text-sky-300">{c.proCardPhoneNote}</span>
                  </span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: "TOUJOURS PRÊTS À VOUS AIDER" ("WE'RE ALWAYS READY TO HELP YOU")
          ========================================================================= */}
      <section id="services" className="relative scroll-mt-24 overflow-hidden bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Centered */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#0B1E33] tracking-tight">
              {c.readyTitle}
            </h2>
          </div>

          {/* 3-Column Layout Matching Reference: Left 2 Services, Center Freestanding Mover, Right 2 Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            
            {/* Left Column (2 Services) */}
            <div className="lg:col-span-3 space-y-12 sm:space-y-16 text-center order-2 lg:order-1">
              
              {/* Service 1: Longue Distance */}
              <Link
                to={lp('/quote?type=prive')}
                className="group flex flex-col items-center rounded-xl border border-transparent p-5 transition-[border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <ParachuteCargoIcon className="mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-3 font-display text-lg font-medium text-[#0B1E33] sm:text-xl">
                  {c.readyLongTitle}
                </h3>
                <p className="mx-auto mb-4 max-w-xs text-base leading-relaxed text-slate-500">
                  {c.readyLongText}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1E33]">
                  {c.learnMore}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B1E33] text-white transition-colors duration-150 group-hover:bg-[#0369A1]">
                    <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                  </span>
                </span>
              </Link>

              {/* Service 2: Résidentiel Local */}
              <Link
                to={lp('/quote?type=prive')}
                className="group flex flex-col items-center rounded-xl border border-transparent p-5 transition-[border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <ScooterDeliveryIcon className="mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-3 font-display text-lg font-medium text-[#0B1E33] sm:text-xl">
                  {c.readyLocalTitle}
                </h3>
                <p className="mx-auto mb-4 max-w-xs text-base leading-relaxed text-slate-500">
                  {c.readyLocalText}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1E33]">
                  {c.learnMore}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B1E33] text-white transition-colors duration-150 group-hover:bg-[#0369A1]">
                    <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                  </span>
                </span>
              </Link>

            </div>

            {/* Centro: foto real do monte-meubles em serviço */}
            <div className="md:col-span-2 lg:col-span-6 flex justify-center items-center order-1 lg:order-2 my-6 lg:my-0">
              <div className="w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px]">
                <img
                  src="/photos/batimove-monte-meubles-residence-1000.webp"
                  srcSet="/photos/batimove-monte-meubles-residence-600.webp 600w, /photos/batimove-monte-meubles-residence-1000.webp 1000w"
                  sizes="(min-width: 1024px) 440px, 90vw"
                  alt={c.readyImgAlt}
                  width={1000}
                  height={1238}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full rounded-xl object-cover shadow-raised"
                />
              </div>
            </div>

            {/* Right Column (2 Services) */}
            <div className="lg:col-span-3 space-y-12 sm:space-y-16 text-center order-3 lg:order-3">
              
              {/* Service 3: Transfert d'Entreprise */}
              <Link
                to={lp('/quote?type=entreprise')}
                className="group flex flex-col items-center rounded-xl border border-transparent p-5 transition-[border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <WarehouseShelfIcon className="mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-3 font-display text-lg font-medium text-[#0B1E33] sm:text-xl">
                  {c.readyBusinessTitle}
                </h3>
                <p className="mx-auto mb-4 max-w-xs text-base leading-relaxed text-slate-500">
                  {c.readyBusinessText}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1E33]">
                  {c.learnMore}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B1E33] text-white transition-colors duration-150 group-hover:bg-[#0369A1]">
                    <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                  </span>
                </span>
              </Link>

              {/* Service 4: Petits Volumes & Express */}
              <Link
                to={lp('/quote?type=prive')}
                className="group flex flex-col items-center rounded-xl border border-transparent p-5 transition-[border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <LocationParcelIcon className="mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-3 font-display text-lg font-medium text-[#0B1E33] sm:text-xl">
                  {c.readySmallTitle}
                </h3>
                <p className="mx-auto mb-4 max-w-xs text-base leading-relaxed text-slate-500">
                  {c.readySmallText}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1E33]">
                  {c.learnMore}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B1E33] text-white transition-colors duration-150 group-hover:bg-[#0369A1]">
                    <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                  </span>
                </span>
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: SERVICES COMPLÉMENTAIRES
          Só o que a Batimove faz de fato (confirmado: internacional, veículos,
          urgências 24/7, garde-meubles). Lista em duas colunas, sem cartões
          idênticos nem textura de fundo.
          ========================================================================= */}
      <section aria-labelledby="complementaires-title" className="bg-[#0B1E33] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <h2 id="complementaires-title" className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
                {c.complementairesTitle}
              </h2>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-slate-300">
                {c.complementairesLead}
              </p>
            </div>

            <ul className="grid gap-px overflow-hidden rounded-xl bg-white/15 sm:grid-cols-2 lg:col-span-8">
              {HOME_COMPLEMENTAIRES[lang].map(({ title, text, to, href, cta, Icon }) => {
                const inner = (
                  <>
                    <Icon className="h-14 w-14 shrink-0" />
                    <span className="mt-5 block font-display text-xl font-medium text-white">{title}</span>
                    <span className="mt-2 block text-base leading-relaxed text-slate-300">{text}</span>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-base font-semibold text-sky-300 transition-colors group-hover:text-white">
                      {cta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                    </span>
                  </>
                );
                const cls =
                  'group flex h-full flex-col bg-[#0B1E33] p-7 transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-navy-raise focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-300 sm:p-8';
                return (
                  <li key={title}>
                    {href ? (
                      <a href={href} className={cls}>{inner}</a>
                    ) : (
                      <Link to={lp(to!)} className={cls}>{inner}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: "NOUS EMBALLONS TOUT AVEC SOIN" ("WE CAN PACK EVERYTHING")
          ========================================================================= */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Esquerda: duas fotos reais. O caminhão carregado na frente, o móvel
                em plástico-bolha mais baixo, como numa página de revista. */}
            <div className="grid grid-cols-5 items-end gap-4 lg:col-span-6">
              <img
                src="/photos/batimove-camion-materiel-900.webp"
                srcSet="/photos/batimove-camion-materiel-560.webp 560w, /photos/batimove-camion-materiel-900.webp 900w"
                sizes="(min-width: 1024px) 360px, 60vw"
                alt={c.packImgAlt}
                width={900}
                height={1196}
                loading="lazy"
                decoding="async"
                className="col-span-3 block h-auto w-full rounded-xl object-cover shadow-raised"
              />
              <img
                src="/photos/batimove-papier-bulle-800.webp"
                srcSet="/photos/batimove-papier-bulle-480.webp 480w, /photos/batimove-papier-bulle-800.webp 800w"
                sizes="(min-width: 1024px) 240px, 40vw"
                alt={c.packImg2Alt}
                width={800}
                height={1063}
                loading="lazy"
                decoding="async"
                className="col-span-2 mb-10 block h-auto w-full rounded-xl object-cover shadow-raised"
              />
            </div>

            {/* Right: Content & 2x2 Services Grid Matching Reference Image 2 */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#0B1E33] tracking-tight leading-[1.12] mb-6">
                {c.packTitle}
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                {c.packLead}
              </p>

              {/* 2x2 Grid: 3 Service Cards + 1 Action / CTA Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                
                {/* 1: Packing & Unpacking */}
                <div className="flex items-start gap-4 rounded-xl border border-glacier-line bg-glacier p-6">
                  <div className="shrink-0 mt-0.5">
                    <PackingUnpackingIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[#0B1E33] text-base mb-1.5">
                      {c.packPackingTitle}
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      {c.packPackingText}
                    </p>
                  </div>
                </div>

                {/* 2: Storage Services */}
                <div className="flex items-start gap-4 rounded-xl border border-glacier-line bg-glacier p-6">
                  <div className="shrink-0 mt-0.5">
                    <StorageClipboardIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[#0B1E33] text-base mb-1.5">
                      {c.packStorageTitle}
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      {c.packStorageText}
                    </p>
                  </div>
                </div>

                {/* 3: Assurance Services */}
                <div className="flex items-start gap-4 rounded-xl border border-glacier-line bg-glacier p-6">
                  <div className="shrink-0 mt-0.5">
                    <AssuranceUmbrellaIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[#0B1E33] text-base mb-1.5">
                      {c.packInsuranceTitle}
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      {c.packInsuranceText}
                    </p>
                  </div>
                </div>

                {/* 4: Action Slot (Short text + Button as in Reference) */}
                <div className="flex flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-6">
                  <p className="text-base text-slate-600 leading-relaxed mb-4">
                    {c.packCtaText}
                  </p>
                  <Link to={lp('/calculator')} className={buttonClass('secondary', 'md', 'w-full sm:w-auto')}>
                    {c.packCtaButton}
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: "CE QUE DISENT NOS CLIENTS" ("WHAT OUR CLIENT SAYS")
          ========================================================================= */}
      <section className="relative bg-glacier py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-glacier-line text-xs font-semibold text-slate-700 mb-4 shadow-rest">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.37 7.36 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
              </svg>
              <span>{c.reviewsBadge(rating.value, rating.count)}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#0B1E33] tracking-tight">
              {c.reviewsTitle}
            </h2>
          </div>

          {/* Desktop: 3 Testimonial Cards Carousel Window */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 mb-10">
            {[0, 1, 2].map((offset) => {
              const t = testimonials[(activeTestimonial + offset) % testimonials.length];
              return (
                <div 
                  key={`${t.name}-${offset}`}
                  className="flex animate-fade-in flex-col justify-between rounded-xl border border-glacier-line bg-white p-8 shadow-rest motion-reduce:animate-none"
                >
                  <div>
                    {/* Stars + Google badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-600 shadow-sm">
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.37 7.36 24 12 24Z" />
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                        </svg>
                        <span>{c.googleReview}</span>
                      </div>
                    </div>
                    {/* Quote */}
                    <p className="mb-6 text-base italic leading-relaxed text-slate-600" lang={lang === 'en' ? 'fr' : undefined}>
                      "{t.quote}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h3 className="font-display text-sm font-semibold text-[#0B1E33]">{t.name}</h3>
                      <div className="text-xs text-slate-500 font-medium">{t.location}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: 1 Testimonial Card */}
          <div className="block md:hidden mb-10">
            {(() => {
              const t = testimonials[activeTestimonial % testimonials.length];
              return (
                <div key={t.name} className="flex animate-fade-in flex-col justify-between rounded-xl border border-glacier-line bg-white p-6 shadow-rest motion-reduce:animate-none sm:p-8">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-600 shadow-sm">
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.37 7.36 24 12 24Z" />
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                        </svg>
                        <span>{c.googleReview}</span>
                      </div>
                    </div>
                    <p className="mb-6 text-base italic leading-relaxed text-slate-600" lang={lang === 'en' ? 'fr' : undefined}>
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h3 className="font-display text-sm font-semibold text-[#0B1E33]">{t.name}</h3>
                      <div className="text-xs text-slate-500 font-medium">{t.location}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex justify-center items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className="p-2 -m-1 cursor-pointer"
                aria-label={c.reviewDotLabel(i + 1, testimonials.length)}
                aria-current={activeTestimonial === i}
              >
                <span
                  className={`block h-2.5 rounded-full transition-[width,background-color] duration-200 ${
                    activeTestimonial === i ? 'w-8 bg-[#0B1E33]' : 'w-2.5 bg-slate-300 hover:bg-slate-500'
                  }`}
                />
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 9: BANDEAU DEVIS
          ========================================================================= */}
      <section className="relative isolate overflow-hidden bg-[#0B1E33] text-white">
        <img
          src="/photos/batimove-camions-maison-1440.webp"
          srcSet="/photos/batimove-camions-maison-800.webp 800w, /photos/batimove-camions-maison-1440.webp 1440w"
          sizes="100vw"
          alt={c.bannerImgAlt}
          width={1440}
          height={699}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_60%]"
        />
        {/* Véu navy: uniforme no celular; no desktop forte do lado do texto */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[#0B1E33]/85 md:bg-transparent md:bg-gradient-to-r md:from-[#0B1E33] md:via-[#0B1E33]/85 md:to-[#0B1E33]/25"
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <h2 className="mb-2.5 font-display text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {c.bannerTitle}
            </h2>
            <p className="mb-1.5 text-lg font-medium text-sky-300 lg:text-xl">
              {c.bannerPromise}
            </p>
            <p className="mb-6 text-base font-normal text-slate-200">
              {c.bannerNoCommitment} <a href="tel:0800825925" className="font-semibold text-white underline decoration-white/40 underline-offset-2 tabular-nums transition-colors duration-150 hover:decoration-white">0800 825 925</a>
            </p>
            <Link to={lp('/quote')} className={buttonClass('primary', 'lg')}>
              {c.bannerCta}
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FAQ (identique au FAQPage JSON-LD de index.html)
          ========================================================================= */}
      <section className="bg-white py-12 sm:py-14 lg:py-16" aria-labelledby="home-faq-title">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="home-faq-title" className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-[#0B1E33] tracking-tight text-center mb-8 lg:mb-10">
            {c.faqTitle}
          </h2>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {HOME_FAQ_BY_LANG[lang].map((item) => (
              <details key={item.question} className="group py-1">
                <summary className="group/q flex items-center justify-between gap-4 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]">
                  <h3 className="font-display text-base font-semibold leading-snug text-[#0B1E33] transition-colors duration-150 group-hover/q:text-[#0369A1] sm:text-lg">
                    {item.question}
                  </h3>
                  <ChevronDown
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-slate-500 transition-[transform,color] duration-200 group-open:rotate-180 group-hover/q:text-[#0369A1]"
                  />
                </summary>
                <p className="pb-5 pr-9 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            {c.faqMore}{' '}
            <a href="tel:0800825925" className="font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-2 tabular-nums transition-colors duration-150 hover:decoration-[#0B1E33]">0800 825 925</a>{' '}
            {c.faqOr} <Link to={lp('/contact')} className="font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-2 transition-colors duration-150 hover:decoration-[#0B1E33]">{c.faqWrite}</Link>.
          </p>
        </div>
      </section>

    </div>
  );
};
export default Home;
