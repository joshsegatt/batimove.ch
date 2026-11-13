import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CUSTOMER_REVIEWS, GOOGLE_RATING } from '../data/reviews';
import { HOME_FAQ } from '../data/homeFaq';
import { QUOTE_SERVICES } from '../data/quoteServices';
import { HOME_ENGAGEMENTS, HOME_FICHE } from '../data/homeTrust';
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

export const Home: React.FC = () => {
  // Testimonial Carousel Active State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = CUSTOMER_REVIEWS;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-600 selection:text-white">
      <SEO
        title="Batimove Sàrl : Déménagement à Genève, Lausanne & Vaud"
        description="Entreprise suisse de déménagement pour particuliers et entreprises à Genève, Lausanne et dans le canton de Vaud. Devis gratuit sous 30 min et garantie 5M CHF."
        canonical="https://www.batimove.ch/"
      />

      {/* =========================================================================
          SECTION 1: HERO SECTION ("L'Art du Déménagement !")
          Cabe em qualquer tela: tipografia fluida por largura, compactação por
          altura em laptops baixos (lg + max-height 820px) e imagem limitada pela
          coluna e pela altura útil da janela, sempre colada na faixa navy.
          ========================================================================= */}
      <section className="relative overflow-hidden bg-[#F8FAFC] pt-4 sm:pt-6 lg:pt-8 [@media(min-width:1024px)_and_(max-height:940px)]:pt-4 [@media(min-width:1024px)_and_(max-height:760px)]:!pt-2">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-end gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-10">

            {/* Coluna de texto */}
            <div className="flex min-w-0 flex-col justify-center py-4 sm:py-6 lg:col-span-7 lg:py-10 xl:col-span-6 [@media(min-width:1024px)_and_(max-height:940px)]:py-5 [@media(min-width:1024px)_and_(max-height:760px)]:!py-4">
              <h1 className="mb-4 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-[#0B1E33] min-[400px]:text-4xl sm:mb-5 sm:text-5xl xl:text-6xl [@media(max-height:500px)]:!text-4xl [@media(min-width:1024px)_and_(max-height:940px)]:mb-3 [@media(min-width:1024px)_and_(max-height:940px)]:text-5xl [@media(min-width:1024px)_and_(max-height:760px)]:!mb-2">
                L'Art du <br />
                <span className="whitespace-nowrap text-[#0284c7]">Déménagement&nbsp;!</span>
                <span className="sr-only"> : Entreprise de déménagement professionnel à Genève, Lausanne et Vaud</span>
              </h1>

              <p className="mb-6 max-w-xl text-lg font-normal leading-relaxed text-slate-600 xl:text-xl [@media(min-width:1024px)_and_(max-height:940px)]:mb-4 [@media(min-width:1024px)_and_(max-height:940px)]:text-lg [@media(min-width:1024px)_and_(max-height:760px)]:!mb-3 [@media(min-width:1024px)_and_(max-height:940px)]:leading-normal">
                Services professionnels de déménagement, emballage de haute précision et garde-meubles sécurisé à Genève, Lausanne et dans toute la Suisse. Assurance RC Pro jusqu'à 5M CHF incluse.
              </p>

              {/* Seletor de serviço: cada opção é um devis gratuito já direcionado */}
              <div className="max-w-xl">
                <h2 id="hero-projet" className="font-display text-lg font-bold tracking-tight text-[#0B1E33]">
                  Quel est votre projet&nbsp;?
                </h2>
                <p className="mb-4 mt-1 text-sm text-slate-600 [@media(min-width:1024px)_and_(max-height:940px)]:mb-3">
                  Devis gratuit, réponse sous 30&nbsp;min (8h-19h).
                </p>
                <ul
                  aria-labelledby="hero-projet"
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
                >
                  {QUOTE_SERVICES.map(({ id: type, label, hint, icon: Icon }, i) => (
                    <li key={type} className="relative">
                      {/* Separador recuado até o texto, como nas listas agrupadas do iOS */}
                      {i > 0 && (
                        <span aria-hidden="true" className="pointer-events-none absolute left-[76px] right-0 top-0 h-px bg-slate-200 sm:left-[80px]" />
                      )}
                      <Link
                        to={`/quote?type=${type}`}
                        className="group flex min-h-[72px] items-center gap-4 bg-white px-4 py-3.5 transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284c7] active:bg-slate-100 sm:px-5 [@media(min-width:1024px)_and_(max-height:940px)]:min-h-[60px] [@media(min-width:1024px)_and_(max-height:940px)]:py-2.5 [@media(min-width:1024px)_and_(max-height:760px)]:!min-h-[56px] [@media(min-width:1024px)_and_(max-height:760px)]:!py-2"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#0B1E33] transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[#0B1E33] group-hover:text-white group-focus-visible:bg-[#0B1E33] group-focus-visible:text-white [@media(min-width:1024px)_and_(max-height:940px)]:h-10 [@media(min-width:1024px)_and_(max-height:940px)]:w-10 [@media(min-width:1024px)_and_(max-height:760px)]:!h-9 [@media(min-width:1024px)_and_(max-height:760px)]:!w-9">
                          <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg font-semibold leading-snug tracking-tight text-[#0B1E33]">{label}</span>
                          <span className="mt-0.5 block text-sm leading-snug text-slate-500">{hint}</span>
                        </span>
                        <ChevronRight
                          className="h-[18px] w-[18px] shrink-0 text-slate-300 transition-[transform,color] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:text-[#0B1E33] group-focus-visible:text-[#0B1E33] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Promessas confirmadas pela Batimove + caminhos alternativos */}
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 shrink-0 text-[#0284c7]" aria-hidden="true" />
                    Prix ferme&nbsp;: aucun surcoût une fois le devis accepté
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 shrink-0 text-[#0284c7]" aria-hidden="true" />
                    Joignable 7j/7
                  </li>
                </ul>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-base [@media(min-width:1024px)_and_(max-height:940px)]:mt-4">
                  <a
                    href="tel:0800825925"
                    className="inline-flex items-center gap-2 py-1 font-bold text-[#0B1E33] transition-colors duration-150 hover:text-[#0284c7]"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span className="tabular-nums">0800 825 925</span>
                    <span className="font-normal text-slate-500">appel gratuit</span>
                  </a>
                  <Link
                    to="/calculator"
                    className="py-1 font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors duration-150 hover:decoration-[#0B1E33]"
                  >
                    Calculer mon volume
                  </Link>
                </div>
              </div>

              {/* Indicadores de confiança */}
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-200/80 pt-6 [@media(min-width:1024px)_and_(max-height:940px)]:mt-6 [@media(min-width:1024px)_and_(max-height:940px)]:pt-5">
                <div>
                  <div className="font-display text-xl font-bold tabular-nums text-[#0B1E33] sm:text-2xl">100%</div>
                  <div className="text-xs font-medium text-slate-500">Prix Fixe Garanti</div>
                </div>
                <div>
                  <div className="font-display text-xl font-bold tabular-nums text-[#0B1E33] sm:text-2xl">CHF 5M</div>
                  <div className="text-xs font-medium text-slate-500">Assurance RC Incluse</div>
                </div>
                <div>
                  <div className="font-display text-xl font-bold tabular-nums text-[#0284c7] sm:text-2xl">{GOOGLE_RATING.value} / 5</div>
                  <div className="text-xs font-medium text-slate-500">Avis Clients Vérifiés</div>
                </div>
              </div>
            </div>

            {/* Imagem: limitada pela largura da coluna e pela altura útil da janela,
                alinhada embaixo para encostar na faixa navy. Nunca invade o texto. */}
            <div className="flex min-w-0 items-end justify-center self-end lg:col-span-5 lg:justify-end xl:col-span-6">
              <img
                src="/hero-mover-tight.png"
                alt="Déménageur professionnel Batimove Sarl avec carton officiel"
                width={675}
                height={763}
                fetchPriority="high"
                decoding="async"
                className="pointer-events-none block h-auto max-h-[min(380px,52vh)] w-auto max-w-full select-none object-contain object-bottom -mb-px drop-shadow-[0_20px_35px_rgba(0,0,0,0.14)] sm:max-h-[min(460px,55vh)] lg:max-h-[min(720px,calc(100dvh-140px))]"
              />
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
              className="font-display text-2xl font-extrabold leading-[1.1] tracking-tight text-white lg:col-span-3 lg:text-4xl"
            >
              Ce que nous réglons pour vous
            </h2>
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:col-span-9">
              {HOME_ENGAGEMENTS.map(({ title, text }) => (
                <li key={title} className="border-t border-white/20 pt-5">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-white">{title}</h3>
                  <p className="mt-2 text-lg leading-relaxed text-slate-300">{text}</p>
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

            {/* Imagem provisória: trocar pela foto real da equipe quando chegar */}
            <div className="lg:col-span-5">
              <div className="mx-auto max-w-[460px] overflow-hidden rounded-xl border border-slate-200 bg-white">
                <img
                  src="/votre-partenaire-mover-v2.jpg"
                  alt="Déménageur Batimove avec des cartons à l'effigie de l'entreprise"
                  width={871}
                  height={1024}
                  className="block h-auto w-full select-none object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <h2
                id="about-title"
                className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-[#0B1E33] sm:text-4xl lg:text-5xl"
              >
                Batimove, en toute transparence
              </h2>
              <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-slate-600">
                Une entreprise genevoise au service des particuliers et des entreprises de Suisse romande.
                Pas de promesse floue&nbsp;: voici qui nous sommes, où nous intervenons et ce qui vous protège.
              </p>

              <dl className="mt-10 grid grid-cols-1 border-t border-slate-200 sm:grid-cols-2">
                {HOME_FICHE.map(({ term, desc, href }, i) => (
                  <div
                    key={term}
                    className={`border-b border-slate-200 py-4 ${i % 2 === 1 ? 'sm:border-l sm:pl-6' : 'sm:pr-6'}`}
                  >
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
                <Link
                  to="/services"
                  className="btn btn-lg btn-secondary"
                >
                  Découvrir nos prestations
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  to="/quote"
                  className="inline-block py-3 text-lg font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors duration-150 hover:decoration-[#0B1E33]"
                >
                  Demander un devis
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: "RECOMMANDÉ PAR LES PROFESSIONNELS" ("WE'RE CHOSEN BY PROFESSIONALS")
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#f8fafc] border-y border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Why Choose Us & 3 Icons */}
            <div className="lg:col-span-7">
              <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-3 block">
                POURQUOI NOUS CHOISIR
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight leading-[1.12] mb-10">
                Recommandé par les Professionnels & Régies
              </h2>

              {/* 3 Columns under title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Item 1 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                    Conseil Gratuit
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Visite technique sur place ou estimation par vidéo gratuite sous 24h.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                    Garantie Totale
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Garantie 100% remise de clés conforme aux exigences des régies suisses.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                    Urgences 24/7
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ligne d'urgence 24/7 et chef de projet joignable en direct le jour J.
                  </p>
                </div>

              </div>
            </div>

            {/* Right Column: Paragraph & Dark Blue Phone Card */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full pt-4">
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Particuliers, expatriés et entreprises nous confient leur déménagement à Genève et dans le canton de Vaud. Nous connaissons les exigences des régies lors de la remise des clés et préparons chaque état des lieux en conséquence.
              </p>

              {/* Dark Navy Highlight Card with Phone */}
              <div className="bg-[#0B1E33] text-white p-8 rounded-3xl shadow-xl border border-sky-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                <h4 className="text-sky-400 font-bold text-sm tracking-wider uppercase font-display mb-2">
                  Besoin d'un devis immédiat ?
                </h4>
                <p className="text-slate-300 text-xs mb-6">
                  Nos spécialistes répondent à vos questions et planifient votre projet sans engagement :
                </p>
                <a 
                  href="tel:0800825925" 
                  className="inline-flex items-center gap-3 text-white hover:text-sky-300 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/40 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
                      0800 825 925
                    </div>
                    <div className="text-xs text-sky-400 font-medium">Numéro Gratuit en Suisse</div>
                  </div>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: "TOUJOURS PRÊTS À VOUS AIDER" ("WE'RE ALWAYS READY TO HELP YOU")
          ========================================================================= */}
      <section id="services" className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Centered */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-3 block">
              NOS SERVICES COMPLETS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight">
              Toujours Prêts à Répondre à Vos Besoins
            </h2>
          </div>

          {/* 3-Column Layout Matching Reference: Left 2 Services, Center Freestanding Mover, Right 2 Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            
            {/* Left Column (2 Services) */}
            <div className="lg:col-span-3 space-y-12 sm:space-y-16 text-center order-2 lg:order-1">
              
              {/* Service 1: Longue Distance */}
              <div className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50/70">
                <Link to="/services?type=prive" className="transform group-hover:scale-110 transition-transform duration-300 block">
                  <ParachuteCargoIcon className="w-16 h-16 mx-auto mb-4" />
                </Link>
                <Link to="/services?type=prive">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#0B1E33] mb-3 group-hover:text-sky-600 transition-colors">
                    Déménagement Longue Distance
                  </h3>
                </Link>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-4">
                  Intercantonal et international (Genève, Vaud, Zurich, France, UE) avec formalités de douane suisses intégrales.
                </p>
                <Link
                  to="/services?type=prive"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B1E33] hover:text-sky-600 transition-colors group/link"
                >
                  <span>En Savoir Plus</span>
                  <span className="w-5 h-5 rounded-full bg-[#0B1E33] group-hover/link:bg-sky-600 text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>

              {/* Service 2: Résidentiel Local */}
              <div className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50/70">
                <Link to="/services?type=prive" className="transform group-hover:scale-110 transition-transform duration-300 block">
                  <ScooterDeliveryIcon className="w-16 h-16 mx-auto mb-4" />
                </Link>
                <Link to="/services?type=prive">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#0B1E33] mb-3 group-hover:text-sky-600 transition-colors">
                    Déménagement Résidentiel Local
                  </h3>
                </Link>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-4">
                  Genève, Lausanne, Nyon, Montreux. Formules sur mesure du studio à la villa avec protection complète.
                </p>
                <Link
                  to="/services?type=prive"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B1E33] hover:text-sky-600 transition-colors group/link"
                >
                  <span>En Savoir Plus</span>
                  <span className="w-5 h-5 rounded-full bg-[#0B1E33] group-hover/link:bg-sky-600 text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>

            </div>

            {/* Center Column: Freestanding High-Res Batimove Mover with Official Cartons */}
            <div className="md:col-span-2 lg:col-span-6 flex justify-center items-center order-1 lg:order-2 my-6 lg:my-0">
              <div className="relative w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px]">
                {/* Subtle soft ambient backglow */}
                <div className="absolute inset-0 bg-sky-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

                <img
                  src="/toujours-prets-mover.png"
                  alt="Déménageur Batimove officiel avec cartons de déménagement"
                  width={530}
                  height={925}
                  className="w-full h-auto object-contain block select-none mx-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.07)]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Right Column (2 Services) */}
            <div className="lg:col-span-3 space-y-12 sm:space-y-16 text-center order-3 lg:order-3">
              
              {/* Service 3: Transfert d'Entreprise */}
              <div className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50/70">
                <Link to="/services?type=entreprise" className="transform group-hover:scale-110 transition-transform duration-300 block">
                  <WarehouseShelfIcon className="w-16 h-16 mx-auto mb-4" />
                </Link>
                <Link to="/services?type=entreprise">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#0B1E33] mb-3 group-hover:text-sky-600 transition-colors">
                    Transfert d'Entreprise & Bureaux
                  </h3>
                </Link>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-4">
                  Déménagement de parcs informatiques, archives et open-spaces le week-end sans aucune coupure d'activité.
                </p>
                <Link
                  to="/services?type=entreprise"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B1E33] hover:text-sky-600 transition-colors group/link"
                >
                  <span>En Savoir Plus</span>
                  <span className="w-5 h-5 rounded-full bg-[#0B1E33] group-hover/link:bg-sky-600 text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>

              {/* Service 4: Petits Volumes & Express */}
              <div className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50/70">
                <Link to="/services?type=prive" className="transform group-hover:scale-110 transition-transform duration-300 block">
                  <LocationParcelIcon className="w-16 h-16 mx-auto mb-4" />
                </Link>
                <Link to="/services?type=prive">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#0B1E33] mb-3 group-hover:text-sky-600 transition-colors">
                    Petits Volumes & Transports Express
                  </h3>
                </Link>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-4">
                  Transport de meubles spécifiques, enlèvement d'achats volumineux et interventions urgentes en Romandie.
                </p>
                <Link
                  to="/services?type=prive"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B1E33] hover:text-sky-600 transition-colors group/link"
                >
                  <span>En Savoir Plus</span>
                  <span className="w-5 h-5 rounded-full bg-[#0B1E33] group-hover/link:bg-sky-600 text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: "SERVICES COMPLÉMENTAIRES" ("ADDITIONAL SERVICES")
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#0B1E33] text-white relative overflow-hidden">
        {/* Dark Background Overlay with subtle texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sky-400 font-bold tracking-widest text-xs uppercase font-display mb-2 block">
              PRESTATIONS SUR MESURE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Services Complémentaires
            </h2>
          </div>

          {/* 4 Cards Matching Reference with Identical Duotone Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Logistic Services */}
            <div className="bg-[#071727] hover:bg-[#0a1e34] border border-sky-500/20 hover:border-sky-400/50 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between group hover:-translate-y-1.5 shadow-xl">
              <div>
                <div className="w-20 h-20 flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                  <LogisticServicesPlaneIcon className="w-18 h-18" />
                </div>
                <h3 className="font-display text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors mb-3">
                  Services Logistiques
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Fret aérien, formalités de douane suisses et garde-meubles sous haute sécurité pour particuliers et entreprises.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky-400 transition-colors group/link"
              >
                <span>En Savoir Plus</span>
                <span className="w-5 h-5 rounded-full bg-white group-hover/link:bg-sky-400 text-[#0B1E33] flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Card 2: Car Shipping */}
            <div className="bg-[#071727] hover:bg-[#0a1e34] border border-sky-500/20 hover:border-sky-400/50 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between group hover:-translate-y-1.5 shadow-xl">
              <div>
                <div className="w-20 h-20 flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                  <CarShippingTruckIcon className="w-18 h-18" />
                </div>
                <h3 className="font-display text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors mb-3">
                  Transport de Véhicules
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Acheminement sécurisé de voitures, motos et flottes d'entreprise dans toute la Suisse et l'Europe.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky-400 transition-colors group/link"
              >
                <span>En Savoir Plus</span>
                <span className="w-5 h-5 rounded-full bg-white group-hover/link:bg-sky-400 text-[#0B1E33] flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Card 3: Furniture Shipping */}
            <div className="bg-[#071727] hover:bg-[#0a1e34] border border-sky-500/20 hover:border-sky-400/50 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between group hover:-translate-y-1.5 shadow-xl">
              <div>
                <div className="w-20 h-20 flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                  <FurnitureShippingShipIcon className="w-18 h-18" />
                </div>
                <h3 className="font-display text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors mb-3">
                  Transport de Mobilier
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Manutention experte de mobilier volumineux, monte-meubles extérieur et fret maritime pour vos relocalisations.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky-400 transition-colors group/link"
              >
                <span>En Savoir Plus</span>
                <span className="w-5 h-5 rounded-full bg-white group-hover/link:bg-sky-400 text-[#0B1E33] flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Card 4: Fastest Shipping */}
            <div className="bg-[#071727] hover:bg-[#0a1e34] border border-sky-500/20 hover:border-sky-400/50 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between group hover:-translate-y-1.5 shadow-xl">
              <div>
                <div className="w-20 h-20 flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                  <FastestShippingClockIcon className="w-18 h-18" />
                </div>
                <h3 className="font-display text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors mb-3">
                  Livraisons Express
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Interventions d'urgence 24/7, transport de petits volumes et livraisons express sous délais stricts garantis.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky-400 transition-colors group/link"
              >
                <span>En Savoir Plus</span>
                <span className="w-5 h-5 rounded-full bg-white group-hover/link:bg-sky-400 text-[#0B1E33] flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7: "NOUS EMBALLONS TOUT AVEC SOIN" ("WE CAN PACK EVERYTHING")
          ========================================================================= */}
      {/* =========================================================================
          SECTION 7: "NOUS EMBALLONS TOUT AVEC SOIN" ("WE CAN PACK EVERYTHING")
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Freestanding High-Res Mover with Clipboard & Batimove Boxes (Image 2) */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[560px]">
                {/* Subtle soft ambient backglow */}
                <div className="absolute inset-0 bg-sky-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

                <img
                  src="/emballage-mover.png"
                  alt="Déménageur Batimove avec liste d'inventaire et cartons de déménagement officiels"
                  width={995}
                  height={945}
                  className="w-full h-auto object-contain block select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.07)]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Right: Content & 2x2 Services Grid Matching Reference Image 2 */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-3 block">
                EMBALLAGE PROFESSIONNEL
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight leading-[1.12] mb-6">
                Nous Emballons Tout avec le Plus Grand Soin
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                L'emballage constitue la clé d'un déménagement sans accroc. Nos techniciens utilisent des techniques éprouvées et des fournitures professionnelles renforcées pour chaque type d'objet.
              </p>

              {/* 2x2 Grid: 3 Service Cards + 1 Action / CTA Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                
                {/* 1: Packing & Unpacking */}
                <div className="bg-[#f0f9ff] border border-sky-100/80 p-6 rounded-2xl flex items-start gap-4 transition-all duration-300 hover:shadow-md hover:border-sky-300">
                  <div className="shrink-0 mt-0.5">
                    <PackingUnpackingIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                      Emballage & Déballage
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Caisses alvéolées et papier bulle anti-choc pour verres, vaisselle et objets fragiles.
                    </p>
                  </div>
                </div>

                {/* 2: Storage Services */}
                <div className="bg-[#f0f9ff] border border-sky-100/80 p-6 rounded-2xl flex items-start gap-4 transition-all duration-300 hover:shadow-md hover:border-sky-300">
                  <div className="shrink-0 mt-0.5">
                    <StorageClipboardIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                      Garde-Meubles & Stockage
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Inventaire complet avec contrôle d'état et stockage sécurisé sous scellés à Genève.
                    </p>
                  </div>
                </div>

                {/* 3: Assurance Services */}
                <div className="bg-[#f0f9ff] border border-sky-100/80 p-6 rounded-2xl flex items-start gap-4 transition-all duration-300 hover:shadow-md hover:border-sky-300">
                  <div className="shrink-0 mt-0.5">
                    <AssuranceUmbrellaIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                      Assurance All Risk
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Couverture All Risk de vos biens, en complément de notre RC Pro jusqu'à 5M CHF.
                    </p>
                  </div>
                </div>

                {/* 4: Action Slot (Short text + Button as in Reference) */}
                <div className="p-6 rounded-2xl flex flex-col justify-between items-start bg-slate-50/50 border border-slate-100">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    Estimez votre matériel et commandez vos fournitures d'emballage en quelques clics.
                  </p>
                  <Link to="/calculator" className={buttonClass('secondary', 'md', 'w-full sm:w-auto')}>
                    Calculer mes cartons
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
      <section className="py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 mb-4 shadow-sm">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.37 7.36 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
              </svg>
              <span>{GOOGLE_RATING.value} / 5 • {GOOGLE_RATING.count} avis Google vérifiés</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight">
              Ce Que Disent Nos Clients
            </h2>
          </div>

          {/* Desktop: 3 Testimonial Cards Carousel Window */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 mb-10">
            {[0, 1, 2].map((offset) => {
              const t = testimonials[(activeTestimonial + offset) % testimonials.length];
              return (
                <div 
                  key={`${t.name}-${offset}`}
                  className="bg-slate-50/80 hover:bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Stars + Google badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200/90 text-[10px] font-semibold text-slate-600 shadow-sm">
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.37 7.36 24 12 24Z" />
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                        </svg>
                        <span>Avis Google</span>
                      </div>
                    </div>
                    {/* Quote */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
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
                      <h4 className="font-display font-bold text-sm text-[#0B1E33]">{t.name}</h4>
                      <div className="text-[11px] text-slate-500 font-medium">{t.location}</div>
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
                <div className="bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200/90 text-[10px] font-semibold text-slate-600 shadow-sm">
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.37 7.36 24 12 24Z" />
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                        </svg>
                        <span>Avis Google</span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
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
                      <h4 className="font-display font-bold text-sm text-[#0B1E33]">{t.name}</h4>
                      <div className="text-[11px] text-slate-500 font-medium">{t.location}</div>
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
                aria-label={`Avis ${i + 1} sur ${testimonials.length}`}
                aria-current={activeTestimonial === i}
              >
                <span
                  className={`block h-2.5 rounded-full transition-[width,background-color] duration-200 ${
                    activeTestimonial === i ? 'w-8 bg-[#0B1E33]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
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
      <section className="bg-[#07182b] text-white relative z-20 overflow-visible shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-7 sm:py-8 lg:py-9">
            
            {/* Left: Text & CTA with site's red button */}
            <div className="md:col-span-7 lg:col-span-7 z-10">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2.5">
                Vous Avez un Projet de Déménagement ?
              </h2>
              <p className="text-sky-300 text-base sm:text-lg lg:text-xl font-medium mb-1.5">
                Devis gratuit et ferme sous 30 min (8h-19h).
              </p>
              <p className="text-slate-300 text-xs sm:text-sm font-normal mb-6">
                Sans engagement • Appel gratuit au <a href="tel:0800825925" className="font-semibold text-white underline underline-offset-2 tabular-nums">0800 825 925</a>
              </p>
              <Link to="/quote" className={buttonClass('primary', 'lg')}>
                Demander un devis gratuit
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            {/* Spacer for MD/LG desktop grid */}
            <div className="hidden md:block md:col-span-5 lg:col-span-5" />

            {/* Mobile Mover */}
            <div className="md:hidden flex justify-center items-end mt-6 -mb-7">
              <img
                src="/plan-to-move-boxes-mover.png"
                alt="Déménageur professionnel Batimove avec cartons et devis"
                width={995}
                height={945}
                loading="lazy"
                decoding="async"
                className="h-[250px] sm:h-[280px] w-auto object-contain object-bottom select-none drop-shadow-xl"
              />
            </div>

          </div>

          {/* Desktop/Tablet Mover with Head Pop-out into White Section */}
          <div className="hidden md:flex absolute bottom-0 right-2 sm:right-6 lg:right-10 xl:right-16 items-end pointer-events-none z-30">
            <img
              src="/plan-to-move-boxes-mover.png"
              alt="Déménageur professionnel Batimove avec cartons et devis"
              width={995}
              height={945}
              loading="lazy"
              decoding="async"
              className="h-[330px] md:h-[360px] lg:h-[400px] xl:h-[430px] w-auto object-contain object-bottom select-none drop-shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FAQ (identique au FAQPage JSON-LD de index.html)
          ========================================================================= */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#f8fafc] border-b border-slate-200/60" aria-labelledby="home-faq-title">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="home-faq-title" className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1E33] tracking-tight text-center mb-8 lg:mb-10">
            Questions fréquentes
          </h2>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {HOME_FAQ.map((item) => (
              <details key={item.question} className="group py-1">
                <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]">
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#0B1E33] leading-snug">
                    {item.question}
                  </h3>
                  <ChevronDown
                    aria-hidden="true"
                    className="w-5 h-5 shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="pb-5 pr-9 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Une autre question ? Appelez-nous gratuitement au{' '}
            <a href="tel:0800825925" className="font-semibold text-[#0B1E33] underline underline-offset-2 tabular-nums">0800 825 925</a>{' '}
            ou <Link to="/contact" className="font-semibold text-[#0B1E33] underline underline-offset-2">écrivez-nous</Link>.
          </p>
        </div>
      </section>

    </div>
  );
};
export default Home;
