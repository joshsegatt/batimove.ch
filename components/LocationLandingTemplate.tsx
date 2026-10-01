import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  ChevronRight, 
  Phone, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Mail, 
  Truck, 
  Package, 
  Building2, 
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
  ChevronDown
} from 'lucide-react';
import { Button } from './UIComponents';
import { Link } from 'react-router-dom';
import { SEO } from './SEO';

// Duotone Icons matching Home.tsx
const ParachuteCargoIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M32 7C16 7 10 20 10 27C16 27 20 23 24 23C28 23 30 27 32 27C34 27 36 23 40 23C44 23 48 27 54 27C54 20 48 7 32 7Z"
      stroke="#0284c7"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M22 11C26 15 28 20 28 25" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 11C38 15 36 20 36 25" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 27L25 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 25L28 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 25L36 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M52 27L39 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <rect x="23" y="43" width="18" height="15" rx="2" stroke="#0B1E33" strokeWidth="2.5" fill="#f8fafc" />
    <path d="M32 43V58" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
    <path d="M23 50H41" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ScooterDeliveryIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="20" width="18" height="16" rx="2" stroke="#0284c7" strokeWidth="2.5" fill="#f0f9ff" />
    <path d="M19 20V36" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 28H28" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <circle cx="17" cy="48" r="6" stroke="#0B1E33" strokeWidth="2.5" />
    <circle cx="47" cy="48" r="6" stroke="#0B1E33" strokeWidth="2.5" />
    <path d="M17 42H28L34 47H41" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 37L41 22H48" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M41 22L47 48" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M44 18H51" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const WarehouseShelfIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 10V54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50 10V54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 18H54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 36H54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 54H54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="22" y="24" width="20" height="12" rx="1.5" stroke="#0B1E33" strokeWidth="2.5" fill="#f8fafc" />
    <path d="M32 24V36" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
    <rect x="18" y="42" width="16" height="12" rx="1.5" stroke="#0B1E33" strokeWidth="2.5" fill="#f8fafc" />
    <path d="M18 42L34 54" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const LocationParcelIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M30 6C20 6 12 14 12 24C12 37 30 52 30 52C30 52 48 37 48 24C48 14 40 6 30 6Z"
      stroke="#0284c7"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="30" cy="23" r="5" stroke="#0284c7" strokeWidth="2" />
    <rect x="34" y="38" width="18" height="16" rx="2" stroke="#0B1E33" strokeWidth="2.5" fill="#f0f9ff" />
    <path d="M34 38L52 54" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M52 38L34 54" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export interface LocationConfig {
  cityName: string;
  regionBadge: string;
  heroHeadlineMain: string;
  heroHeadlineHighlight: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  geoPosition: {
    lat: number;
    lng: number;
    postalCode: string;
    street: string;
  };
  districts: Array<{ name: string; desc: string }>;
  localFeatures: Array<{ title: string; desc: string }>;
  regiesList: string[];
  faqList: Array<{ question: string; answer: string }>;
  testimonials: Array<{ name: string; role: string; quote: string; rating: number; location: string }>;
}

export const LocationLandingTemplate: React.FC<{ config: LocationConfig }> = ({ config }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Schema.org tailored specifically for this local landing page
  const localSchema = {
    "@context": "https://schema.org",
    "@type": ["MovingCompany", "LocalBusiness"],
    "name": `Batimove Sàrl - Déménagement ${config.cityName}`,
    "image": "https://www.batimove.ch/batimove-logo-3d.png",
    "url": config.canonicalUrl,
    "telephone": "+41-800-825-925",
    "email": "info@batimove.ch",
    "priceRange": "CHF",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config.geoPosition.street,
      "addressLocality": config.cityName,
      "postalCode": config.geoPosition.postalCode,
      "addressCountry": "CH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": config.geoPosition.lat,
      "longitude": config.geoPosition.lng
    },
    "openingHours": "Mo-Sa 08:00-19:00",
    "areaServed": {
      "@type": "City",
      "name": config.cityName
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128",
      "bestRating": "5"
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-600 selection:text-white">
      <SEO
        title={config.metaTitle}
        description={config.metaDescription}
        canonical={config.canonicalUrl}
        schema={localSchema}
      />

      {/* =========================================================================
          SECTION 1: HERO SECTION (Exact Style & Proportions of Home.tsx)
          ========================================================================= */}
      <section className="relative bg-[#f8fafc] overflow-hidden pt-8 lg:pt-12 pb-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(2,132,199,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(2,132,199,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-200/25 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 xl:gap-8 items-end">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center py-6 sm:py-8 lg:py-12 relative z-10">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-bold tracking-wide uppercase mb-6 w-fit shadow-xs">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                {config.regionBadge}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[48px] xl:text-[58px] 2xl:text-[66px] font-extrabold tracking-tight leading-[1.08] text-[#0B1E33] mb-6">
                {config.heroHeadlineMain} <br />
                <span className="text-[#0284c7] whitespace-nowrap">{config.heroHeadlineHighlight}</span>
                <span className="sr-only"> : Service professionnel de déménagement certifié à {config.cityName}</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg lg:text-[17px] xl:text-xl font-normal leading-relaxed max-w-xl lg:max-w-[460px] xl:max-w-xl mb-8">
                {config.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link to="/calculator">
                  <Button className="bg-[#0B1E33] hover:bg-[#132c48] text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group">
                    <span>Calculer Mon Volume</span>
                    <ChevronRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <a 
                  href="tel:0800825925" 
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border-2 border-slate-200 hover:border-sky-500 bg-white hover:bg-slate-50 text-[#0B1E33] font-bold text-sm sm:text-base transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>0800 825 925</span>
                </a>
              </div>

              {/* Trust Micro-Badges */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-5 sm:gap-8 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Assurance RC 5M CHF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>Devis Gratuit sous 2h</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Conforme Régies</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Real Assets */}
            <div className="lg:col-span-5 xl:col-span-6 flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-[460px] lg:max-w-none flex justify-center items-end">
                <img
                  src="/hero-mover-tight.png"
                  alt={`Déménageur professionnel Batimove Sàrl à ${config.cityName}`}
                  className="w-full max-w-[480px] lg:max-w-[540px] xl:max-w-[580px] h-auto object-contain object-bottom drop-shadow-2xl relative z-10"
                />

                {/* Floating Metric Card matching Home */}
                <div className="absolute top-12 left-0 sm:left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200/80 z-20 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg">
                    ★
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B1E33]">4.9 / 5.0 Étoiles</div>
                    <div className="text-[11px] text-slate-500">+1'200 déménagements réussis</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: LOCAL EXPERTISE & SPECIFIC CHALLENGES
          ========================================================================= */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src="/votre-partenaire-mover.jpg"
                  alt={`Équipe Batimove en intervention à ${config.cityName}`}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#0B1E33] text-white p-6 rounded-2xl shadow-2xl hidden sm:block max-w-[240px]">
                <div className="text-2xl font-extrabold font-display text-sky-400 mb-1">Régies Suisses</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Garantie intégrale de remise des clés lors de l'état des lieux.
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-3 block">
                EXPERTISE LOCALE À {config.cityName.toUpperCase()}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight leading-[1.15] mb-6">
                Maîtrise Parfaite des Spécificités de {config.cityName}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                Chaque région suisse présente ses propres défis logistiques. À {config.cityName}, nos équipes interviennent avec du matériel adapté aux contraintes urbaines, ruelles historiques, autorisations d'accès et règlements de copropriété.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {config.localFeatures.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[#0B1E33] text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Régies Partners Badges */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Habitués des états des lieux auprès des régies :
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.regiesList.map((regie, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      {regie}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: DISTRICTS & QUARTIERS COVERAGE
          ========================================================================= */}
      <section className="py-20 lg:py-24 bg-[#f8fafc] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-3 block">
              ZONES & COMMUNES COUVERTES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight">
              Présents Partout à {config.cityName} & Environs
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
              Nos camions capitonnés circulent quotidiennement dans tous les secteurs. Aucune majoration kilométrique injustifiée au sein de notre zone de service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.districts.map((district, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="font-display font-bold text-[#0B1E33] text-base">
                    {district.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {district.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: 4 CORE SERVICES (Identical Visuals to Home.tsx)
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-3 block">
              PRESTATIONS COMPLÈTES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight">
              Toutes les Solutions pour Votre Déménagement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Service 1 */}
            <div className="bg-slate-50/80 hover:bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <ParachuteCargoIcon className="w-14 h-14 mb-6" />
                <h3 className="font-display text-xl font-bold text-[#0B1E33] mb-3">
                  Déménagement Résidentiel
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Appartements et villas à {config.cityName}. Protection intégrale sous couvertures capitonnées et assurance RC 5M CHF.
                </p>
              </div>
              <Link to="/services?type=prive" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5">
                <span>Découvrir la formule</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-slate-50/80 hover:bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <ScooterDeliveryIcon className="w-14 h-14 mb-6" />
                <h3 className="font-display text-xl font-bold text-[#0B1E33] mb-3">
                  Transfert d'Entreprise
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Bureaux, archives, commerces et informatique. Planification précise pour zéro interruption de vos activités.
                </p>
              </div>
              <Link to="/services?type=entreprise" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5">
                <span>Services aux entreprises</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-slate-50/80 hover:bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <WarehouseShelfIcon className="w-14 h-14 mb-6" />
                <h3 className="font-display text-xl font-bold text-[#0B1E33] mb-3">
                  Garde-Meubles Sécurisé
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Entreposage propre, tempéré et sous alarme 24h/24. Stockage courte ou longue durée pour vos biens à {config.cityName}.
                </p>
              </div>
              <Link to="/services" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5">
                <span>Solutions de stockage</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service 4 */}
            <div className="bg-slate-50/80 hover:bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <LocationParcelIcon className="w-14 h-14 mb-6" />
                <h3 className="font-display text-xl font-bold text-[#0B1E33] mb-3">
                  Nettoyage État des Lieux
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Nettoyage fin de bail 100% garanti avec présence physique de nos agents lors de la remise des clés à la régie.
                </p>
              </div>
              <Link to="/services?type=nettoyage" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5">
                <span>Garantie remise de clés</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: LOCAL TESTIMONIALS (Real 5-Star Feedback)
          ========================================================================= */}
      <section className="py-20 lg:py-24 bg-[#07182b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sky-400 font-bold tracking-widest text-xs uppercase font-display mb-2 block">
              TÉMOIGNAGES CLIENTS À {config.cityName.toUpperCase()}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Ce Que Disent Vos Voisins
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.testimonials.map((t, idx) => (
              <div 
                key={idx}
                className="bg-[#0b1e33] p-8 rounded-3xl border border-white/10 hover:border-sky-400/50 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">{t.name}</h3>
                    <p className="text-xs text-sky-400">{t.role}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                    {t.location}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: LOCAL FAQ ACCORDION (Google Rich Snippets & AI Citations)
          ========================================================================= */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-2 block">
              QUESTIONS FRÉQUENTES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B1E33] tracking-tight">
              Tout Savoir sur Votre Déménagement à {config.cityName}
            </h2>
          </div>

          <div className="space-y-4">
            {config.faqList.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50 hover:bg-white"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 cursor-pointer"
                  >
                    <h3 className="font-display font-bold text-base sm:text-lg text-[#0B1E33]">
                      {faq.question}
                    </h3>
                    <ChevronDown className={`w-5 h-5 text-sky-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7: FINAL HIGH-IMPACT LUXURY CTA
          ========================================================================= */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-[#0B1E33] to-[#07182b] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-sky-400 font-bold tracking-widest text-xs uppercase font-display mb-3 block">
            DEVIS GRATUIT & SANS ENGAGEMENT
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
            Prêt pour un Déménagement Serein à {config.cityName} ?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Obtenez votre estimation en 2 minutes grâce à notre calculateur de volume 3D ou échangez avec un expert au téléphone.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/calculator">
              <Button className="bg-sky-500 hover:bg-sky-400 text-white px-8 sm:px-10 py-4 rounded-full font-bold text-base shadow-xl hover:shadow-2xl transition-all">
                Estimer Mon Volume en Ligne
              </Button>
            </Link>
            <a 
              href="tel:0800825925" 
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-base transition-all border border-white/20"
            >
              <Phone className="w-5 h-5 text-sky-400" />
              <span>0800 825 925 (Appel Gratuit)</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
