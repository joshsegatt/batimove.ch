import type { Lang } from '../i18n';
import {
  LOCALITIES,
  cantonOf,
  localPath,
  localizeLocality,
  type Locality,
} from './localities';
import { SERVICE_LANDINGS_BY_LANG } from './serviceLandings';

// Páginas de mudança por lugar (/demenagement-geneve, /demenagement-nyon…).
// Todas usam a própria home (pages/Home.tsx) com estes dados por cima: o título
// com o lugar, o lead, uma seção local (texto, bairros, comunas vizinhas) e a FAQ
// local. O resto da página é a mesma landing principal, no mesmo estilo.

export interface LocalNote {
  title: string;
  text: string;
}

export interface LocalArea {
  name: string;
  desc?: string;
}

export interface HomeLocal {
  /** "Déménagement à Nyon" (o ponto final e o "Prix ferme" vêm da home). */
  h1: string;
  lead: string;
  /** Seção local, logo após a faixa navy "Ce que nous réglons". */
  sectionTitle: string;
  intro: string;
  notes: LocalNote[];
  areasTitle: string;
  areas: LocalArea[];
  /** Outras páginas de mudança do mesmo cantão (malha de links internos). */
  nearby: { label: string; path: string }[];
  nearbyTitle: string;
  faq: { question: string; answer: string }[];
  schema?: Record<string, unknown>;
}

/** Configuração das três páginas de cidade (pages/locations). */
export interface LocationConfig {
  cityName: string;
  regionBadge: string;
  heroHeadlineMain: string;
  heroHeadlineHighlight: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  geoPosition: { lat: number; lng: number; postalCode: string; street: string };
  districts: Array<{ name: string; desc: string }>;
  localFeatures: Array<{ title: string; desc: string }>;
  regiesList: string[];
  faqList: Array<{ question: string; answer: string }>;
  testimonials: Array<{ id?: string; name: string; role: string; quote: string; rating: number; location: string; avatar?: string }>;
}

const TEXT = {
  fr: {
    h1: (prep: string) => `Déménagement ${prep}`,
    leadTail: 'Nous emballons, transportons et livrons à la date convenue.',
    sectionTitle: (prep: string) => `Votre déménagement ${prep}`,
    nearbyTitle: 'Nous déménageons aussi',
    localFaqQuestion: (l: Locality, isCanton: boolean) =>
      isCanton ? `Où intervenez-vous dans le canton de ${l.name} ?` : `Intervenez-vous aussi autour de ${l.name} ?`,
    localFaqAnswer: (areas: string, of: string) => `Oui : ${areas}, et dans tout le canton ${of}.`,
    schemaName: (city: string) => `Batimove Sàrl - Déménagement ${city}`,
  },
  en: {
    h1: (prep: string) => `Removals ${prep}`,
    leadTail: 'We pack, transport and deliver on the agreed date.',
    sectionTitle: (prep: string) => `Your move ${prep}`,
    nearbyTitle: 'We also move you',
    localFaqQuestion: (l: Locality, isCanton: boolean) =>
      isCanton ? `Where do you work in the canton of ${l.name}?` : `Do you also cover the area around ${l.name}?`,
    localFaqAnswer: (areas: string, of: string) => `Yes: ${areas}, and throughout the canton ${of}.`,
    schemaName: (city: string) => `Batimove Sàrl - Removals ${city}`,
  },
};

const findLocality = (slug: string) => {
  const l = LOCALITIES.find((x) => x.slug === slug);
  if (!l) throw new Error(`Localidade desconhecida: ${slug}`);
  return l;
};

/** Outras páginas de mudança do mesmo cantão, com o rótulo no idioma da página. */
const nearbyOf = (raw: Locality, lang: Lang) =>
  LOCALITIES.filter((x) => x.canton === raw.canton && x.slug !== raw.slug).map((x) => ({
    label: x.kind === 'canton' ? `Canton ${cantonOf(x.canton, lang)}` : localizeLocality(x, lang).name,
    path: localPath('demenagement', x.slug),
  }));

/** Página gerada de uma localidade (/demenagement-nyon). */
export const localityHome = (slug: string, lang: Lang): HomeLocal => {
  const raw = findLocality(slug);
  const l = localizeLocality(raw, lang);
  const t = TEXT[lang];
  const isCanton = raw.kind === 'canton';
  return {
    h1: t.h1(l.prep),
    lead: `${l.intro} ${t.leadTail}`,
    sectionTitle: t.sectionTitle(l.prep),
    intro: l.intro,
    notes: l.notes,
    areasTitle: l.areasTitle,
    areas: l.areas.map((name) => ({ name })),
    nearby: nearbyOf(raw, lang),
    nearbyTitle: t.nearbyTitle,
    faq: [
      {
        question: t.localFaqQuestion(l, isCanton),
        answer: t.localFaqAnswer(l.areas.slice(0, 8).join(', '), cantonOf(l.canton, lang)),
      },
      ...SERVICE_LANDINGS_BY_LANG[lang].demenagement.faq,
    ],
  };
};

/** Página própria de cidade (Genève, Lausanne, Vaud): mais conteúdo local e schema. */
export const cityHome = (slug: string, config: LocationConfig, lang: Lang): HomeLocal => {
  const raw = findLocality(slug);
  const l = localizeLocality(raw, lang);
  const t = TEXT[lang];
  return {
    h1: t.h1(l.prep),
    lead: config.heroSubtitle,
    sectionTitle: t.sectionTitle(l.prep),
    intro: l.intro,
    notes: config.localFeatures.map((f) => ({ title: f.title, text: f.desc })),
    areasTitle: l.areasTitle,
    areas: config.districts.map((d) => ({ name: d.name, desc: d.desc })),
    nearby: nearbyOf(raw, lang),
    nearbyTitle: t.nearbyTitle,
    faq: config.faqList,
    // Sem aggregateRating: a nota é declarada uma vez só, na home.
    schema: {
      '@context': 'https://schema.org',
      '@type': ['MovingCompany', 'LocalBusiness'],
      name: t.schemaName(config.cityName),
      image: 'https://www.batimove.ch/batimove-logo-3d.png',
      url: config.canonicalUrl,
      telephone: '+41-800-825-925',
      email: 'info@batimove.ch',
      priceRange: 'CHF',
      address: {
        '@type': 'PostalAddress',
        streetAddress: config.geoPosition.street,
        addressLocality: config.cityName,
        postalCode: config.geoPosition.postalCode,
        addressCountry: 'CH',
      },
      geo: { '@type': 'GeoCoordinates', latitude: config.geoPosition.lat, longitude: config.geoPosition.lng },
      openingHours: 'Mo-Sa 08:00-19:00',
      areaServed: { '@type': 'City', name: config.cityName },
    },
  };
};
