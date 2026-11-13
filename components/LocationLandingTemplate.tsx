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
import { Button, buttonClass } from './UIComponents';
import { Link, useLocation } from 'react-router-dom';
import { SEO } from './SEO';
import { GOOGLE_RATING } from '../data/reviews';
import { alternatePath, defineCopy, useLang } from '../i18n';
import { CANTONS, LOCALITIES, cantonOf, localPath, localizeLocality } from '../data/localities';

/** Links para todas as páginas de mudança por cidade (mesma malha das páginas geradas). */
const NEAR_COPY = defineCopy(
  {
    title: 'Déménagement près de chez vous',
    canton: (of: string) => `Canton ${of}`,
    link: (name: string, isCanton: boolean) => (isCanton ? `Tout le canton ${name}` : name),
  },
  {
    title: 'Removals near you',
    canton: (of: string) => `Canton ${of}`,
    link: (name: string, isCanton: boolean) => (isCanton ? `The whole canton ${name}` : name),
  }
);

const MovesNearYou: React.FC = () => {
  const { lang, lp } = useLang();
  const { pathname } = useLocation();
  const current = alternatePath(pathname, 'fr');
  const k = NEAR_COPY[lang];
  return (
    <section aria-labelledby="near-title" className="border-b border-slate-200 bg-[#F8FAFC] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="near-title" className="font-display text-2xl font-medium tracking-tight text-[#0B1E33]">
          {k.title}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          {CANTONS.map((canton) => (
            <div key={canton.id}>
              <p className="text-sm font-semibold text-slate-500">{k.canton(cantonOf(canton.id, lang))}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {LOCALITIES.filter((l) => l.canton === canton.id).map((raw) => {
                  const l = localizeLocality(raw, lang);
                  const to = localPath('demenagement', raw.slug);
                  const label = k.link(raw.kind === 'canton' ? cantonOf(canton.id, lang) : l.name, raw.kind === 'canton');
                  return (
                    <li key={raw.slug}>
                      {to === current ? (
                        <span aria-current="page" className="inline-flex h-10 items-center rounded-lg bg-[#0B1E33] px-3.5 text-base font-semibold text-white">
                          {label}
                        </span>
                      ) : (
                        <Link
                          to={lp(to)}
                          className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-base font-semibold text-[#0B1E33] transition-colors duration-150 hover:border-[#0B1E33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
  /** Avis reais (data/reviews.ts). `id` permite traduzir os rótulos; a citação fica sempre em francês. */
  testimonials: Array<{ id?: string; name: string; role: string; quote: string; rating: number; location: string; avatar?: string }>;
}

// Rótulos em inglês em volta dos avis reais (prestação e localização do cliente).
// O texto do avis (`quote`) nunca é traduzido: é a citação literal publicada.
const REVIEW_LABELS_EN: Record<string, { role: string; location: string }> = {
  andressa: { role: 'International removal', location: 'London to Switzerland' },
  julien: { role: 'MOVU certified partner', location: 'Lausanne & canton of Vaud' },
  wagner: { role: 'Turnkey home removal', location: 'Geneva' },
  pedro: { role: 'Transport and home removal', location: 'Geneva & surrounding area' },
};

const COPY = defineCopy(
  {
    schemaName: (city: string) => `Batimove Sàrl - Déménagement ${city}`,
    srOnlyHeadline: (city: string) => ` : Service professionnel de déménagement certifié à ${city}`,
    ctaQuote: 'Demander un devis gratuit',
    ctaCalculator: 'Calculer mon volume',
    trustFixedPrice: 'Prix fixe garanti',
    trustInsurance: 'Assurance RC incluse',
    trustReviews: 'Avis clients vérifiés',
    heroAlt: (city: string) => `Déménageur professionnel Batimove Sàrl à ${city}`,
    teamAlt: (city: string) => `Équipe Batimove en intervention à ${city}`,
    regiesBadgeTitle: 'Régies Suisses',
    regiesBadgeText: "Garantie intégrale de remise des clés lors de l'état des lieux.",
    expertiseTitle: (city: string) => `Maîtrise Parfaite des Spécificités de ${city}`,
    expertiseText: (city: string) =>
      `Chaque région suisse présente ses propres défis logistiques. À ${city}, nos équipes interviennent avec du matériel adapté aux contraintes urbaines, ruelles historiques, autorisations d'accès et règlements de copropriété.`,
    regiesLabel: 'Habitués des états des lieux auprès des régies :',
    districtsTitle: (city: string) => `Présents Partout à ${city} & Environs`,
    districtsText:
      'Nos camions capitonnés circulent quotidiennement dans tous les secteurs. Aucune majoration kilométrique injustifiée au sein de notre zone de service.',
    servicesTitle: 'Toutes les solutions pour votre déménagement',
    residentialTitle: 'Déménagement résidentiel',
    residentialText: (city: string) =>
      `Appartements et villas à ${city}. Protection intégrale sous couvertures capitonnées et assurance RC 5M CHF.`,
    residentialLink: 'Découvrir la formule',
    businessTitle: "Transfert d'Entreprise",
    businessText: 'Bureaux, archives, commerces et informatique. Planification précise pour zéro interruption de vos activités.',
    businessLink: 'Services aux entreprises',
    storageTitle: 'Garde-meubles sécurisé',
    storageText: (city: string) =>
      `Entreposage propre, tempéré et sous alarme 24h/24. Stockage courte ou longue durée pour vos biens à ${city}.`,
    storageLink: 'Solutions de stockage',
    cleaningTitle: "Nettoyage d'état des lieux",
    cleaningText:
      'Nettoyage fin de bail 100% garanti avec présence physique de nos agents lors de la remise des clés à la régie.',
    cleaningLink: 'Garantie remise de clés',
    reviewsBadge: (value: number, count: number) => `${value} / 5 • ${count} avis Google vérifiés`,
    reviewsTitle: 'Ce que disent vos voisins',
    googleReview: 'Avis Google',
    faqTitle: (city: string) => `Tout Savoir sur Votre Déménagement à ${city}`,
    finalTitle: (city: string) => `Prêt pour un Déménagement Serein à ${city} ?`,
    finalText:
      'Obtenez votre estimation en 2 minutes grâce à notre calculateur de volume 3D ou échangez avec un expert au téléphone.',
    finalCalculator: 'Estimer mon volume en ligne',
    finalPhone: '0800 825 925 (Appel Gratuit)',
  },
  {
    schemaName: (city: string) => `Batimove Sàrl - Removals ${city}`,
    srOnlyHeadline: (city: string) => `: certified professional removal service in ${city}`,
    ctaQuote: 'Request a free quote',
    ctaCalculator: 'Calculate my volume',
    trustFixedPrice: 'Guaranteed fixed price',
    trustInsurance: 'Liability insurance included',
    trustReviews: 'Verified customer reviews',
    heroAlt: (city: string) => `Professional Batimove Sàrl mover in ${city}`,
    teamAlt: (city: string) => `Batimove team on a job in ${city}`,
    regiesBadgeTitle: 'Swiss letting agencies',
    regiesBadgeText: 'Full key handover guarantee at the check-out inspection.',
    expertiseTitle: (city: string) => `Complete mastery of the particularities of ${city}`,
    expertiseText: (city: string) =>
      `Every Swiss region has its own logistical challenges. In ${city}, our teams work with equipment suited to urban constraints, historic lanes, access permits and co-ownership regulations.`,
    regiesLabel: 'Experienced with check-out inspections for these letting agencies:',
    districtsTitle: (city: string) => `Everywhere in ${city} and the surrounding area`,
    districtsText:
      'Our padded lorries are on the road in every district, every day. No unjustified mileage surcharges within our service area.',
    servicesTitle: 'Every solution for your move',
    residentialTitle: 'Home removals',
    residentialText: (city: string) =>
      `Flats and villas in ${city}. Full protection under padded blankets and CHF 5M liability insurance.`,
    residentialLink: 'Discover the service',
    businessTitle: 'Office relocation',
    businessText: 'Offices, archives, shops and IT. Precise planning for zero disruption to your business.',
    businessLink: 'Business services',
    storageTitle: 'Secure furniture storage',
    storageText: (city: string) =>
      `Clean, temperature-controlled storage with a 24/7 alarm. Short or long-term storage for your belongings in ${city}.`,
    storageLink: 'Storage solutions',
    cleaningTitle: 'End of tenancy cleaning',
    cleaningText:
      '100% guaranteed end of tenancy cleaning, with our staff present in person at the key handover to the letting agency.',
    cleaningLink: 'Key handover guarantee',
    reviewsBadge: (value: number, count: number) => `${value} / 5 • ${count} verified Google reviews`,
    reviewsTitle: 'What your neighbours say',
    googleReview: 'Google review',
    faqTitle: (city: string) => `Everything you need to know about moving in ${city}`,
    finalTitle: (city: string) => `Ready for a stress-free move in ${city}?`,
    finalText: 'Get your estimate in 2 minutes with our 3D volume calculator, or talk to an expert on the phone.',
    finalCalculator: 'Estimate my volume online',
    finalPhone: '0800 825 925 (free call)',
  },
);

/** Recebe a config já no idioma da página (as páginas escolhem com defineCopy + useLang). */
export const LocationLandingTemplate: React.FC<{ config: LocationConfig }> = ({ config }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const testimonials =
    lang === 'en'
      ? config.testimonials.map((t) => ({ ...t, ...(t.id ? REVIEW_LABELS_EN[t.id] : undefined) }))
      : config.testimonials;

  // Schema.org tailored specifically for this local landing page
  const localSchema = {
    "@context": "https://schema.org",
    "@type": ["MovingCompany", "LocalBusiness"],
    "name": c.schemaName(config.cityName),
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
    }
    // Pas d'aggregateRating ici : il s'agit d'un seul et même établissement.
    // Répéter la même note sur quatre pages est un signal de manipulation pour
    // Google. L'agrégat n'est déclaré qu'une fois, sur la page d'accueil.
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
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[48px] xl:text-[58px] 2xl:text-[66px] font-medium tracking-tight leading-[1.08] text-[#0B1E33] mb-6">
                {config.heroHeadlineMain} <br />
                <span className="text-[#0284c7] whitespace-nowrap">{config.heroHeadlineHighlight}</span>
                <span className="sr-only">{c.srOnlyHeadline(config.cityName)}</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg lg:text-[17px] xl:text-xl font-normal leading-relaxed max-w-xl lg:max-w-[460px] xl:max-w-xl mb-8">
                {config.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link to={lp('/quote')} className={buttonClass('primary', 'lg')}>
                  {c.ctaQuote}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link to={lp('/calculator')} className={buttonClass('outline', 'lg')}>
                  {c.ctaCalculator}
                </Link>
              </div>

              {/* Micro Trust Indicators (Matching Home.tsx) */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-200/80 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-medium text-[#0B1E33] font-display tabular-nums">100%</div>
                  <div className="text-xs text-slate-500 font-medium">{c.trustFixedPrice}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-medium text-[#0B1E33] font-display tabular-nums">CHF 5M</div>
                  <div className="text-xs text-slate-500 font-medium">{c.trustInsurance}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-medium text-[#0284c7] font-display tabular-nums">{GOOGLE_RATING.value} / 5</div>
                  <div className="text-xs text-slate-500 font-medium">{c.trustReviews}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Real Assets */}
            <div className="lg:col-span-5 xl:col-span-6 flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-[460px] lg:max-w-none flex justify-center items-end">
                <img
                  src="/hero-mover-tight.png"
                  alt={c.heroAlt(config.cityName)}
                  className="w-full max-w-[480px] lg:max-w-[540px] xl:max-w-[580px] h-auto object-contain object-bottom drop-shadow-2xl relative z-10"
                />
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
                  alt={c.teamAlt(config.cityName)}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#0B1E33] text-white p-6 rounded-2xl shadow-2xl hidden sm:block max-w-[240px]">
                <div className="text-2xl font-medium font-display text-sky-400 mb-1">{c.regiesBadgeTitle}</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {c.regiesBadgeText}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#0B1E33] tracking-tight leading-[1.15] mb-6">
                {c.expertiseTitle(config.cityName)}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                {c.expertiseText(config.cityName)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {config.localFeatures.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-[#0B1E33] text-sm mb-1">{item.title}</h3>
                      <p className="text-base text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Régies Partners Badges */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {c.regiesLabel}
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
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#0B1E33] tracking-tight">
              {c.districtsTitle(config.cityName)}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
              {c.districtsText}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.districts.map((district, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-sky-300 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-semibold">
                    <MapPin className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="font-display font-semibold text-[#0B1E33] text-base">
                    {district.name}
                  </h3>
                </div>
                <p className="text-base text-slate-500 leading-relaxed">
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
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#0B1E33] tracking-tight">
              {c.servicesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Service 1 */}
            <div className="bg-slate-50/80 hover:bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-rest hover:shadow-raised transition-all flex flex-col justify-between">
              <div>
                <ParachuteCargoIcon className="w-14 h-14 mb-6" />
                <h3 className="font-display text-xl font-medium text-[#0B1E33] mb-3">
                  {c.residentialTitle}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  {c.residentialText(config.cityName)}
                </p>
              </div>
              <Link to={lp('/services?type=prive')} className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1.5">
                <span>{c.residentialLink}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-slate-50/80 hover:bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-rest hover:shadow-raised transition-all flex flex-col justify-between">
              <div>
                <ScooterDeliveryIcon className="w-14 h-14 mb-6" />
                <h3 className="font-display text-xl font-medium text-[#0B1E33] mb-3">
                  {c.businessTitle}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  {c.businessText}
                </p>
              </div>
              <Link to={lp('/services?type=entreprise')} className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1.5">
                <span>{c.businessLink}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-slate-50/80 hover:bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-rest hover:shadow-raised transition-all flex flex-col justify-between">
              <div>
                <WarehouseShelfIcon className="w-14 h-14 mb-6" />
                <h3 className="font-display text-xl font-medium text-[#0B1E33] mb-3">
                  {c.storageTitle}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  {c.storageText(config.cityName)}
                </p>
              </div>
              <Link to={lp('/services')} className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1.5">
                <span>{c.storageLink}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service 4 */}
            <div className="bg-slate-50/80 hover:bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-rest hover:shadow-raised transition-all flex flex-col justify-between">
              <div>
                <LocationParcelIcon className="w-14 h-14 mb-6" />
                <h3 className="font-display text-xl font-medium text-[#0B1E33] mb-3">
                  {c.cleaningTitle}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  {c.cleaningText}
                </p>
              </div>
              <Link to={lp('/nettoyage-fin-de-bail')} className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1.5">
                <span>{c.cleaningLink}</span>
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 mb-3 backdrop-blur-sm">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.37 7.36 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
              </svg>
              <span>{c.reviewsBadge(GOOGLE_RATING.value, GOOGLE_RATING.count)}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight">
              {c.reviewsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className="bg-[#0b1e33] p-8 rounded-3xl border border-white/10 hover:border-sky-400/50 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.37 7.36 24 12 24Z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                      </svg>
                      <span>{c.googleReview}</span>
                    </div>
                  </div>
                  {/* Citação literal do avis, sempre em francês */}
                  <p lang={lang === 'en' ? 'fr' : undefined} className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {t.avatar && (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-sm shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="font-display font-semibold text-sm text-white">{t.name}</h3>
                      <p className="text-xs text-sky-400">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full shrink-0">
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
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#0B1E33] tracking-tight">
              {c.faqTitle(config.cityName)}
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
                    <h3 className="font-display font-semibold text-base sm:text-lg text-[#0B1E33]">
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

      <MovesNearYou />

      {/* =========================================================================
          SECTION 7: FINAL HIGH-IMPACT LUXURY CTA
          ========================================================================= */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-[#0B1E33] to-[#07182b] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight mb-6">
            {c.finalTitle(config.cityName)}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            {c.finalText}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to={lp('/calculator')} className={buttonClass('inverse', 'lg')}>
              {c.finalCalculator}
            </Link>
            <a 
              href="tel:0800825925" 
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base transition-all border border-white/20"
            >
              <Phone className="w-5 h-5 text-sky-400" />
              <span>{c.finalPhone}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
