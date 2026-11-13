import raw from './serviceLocalities.json';
import seo from './seoRoutes.json';
import routes from './i18nRoutes.json';
import type { Lang } from '../i18n';

// Camada tipada sobre data/serviceLocalities.json (conteúdo) e data/seoRoutes.json
// (título e descrição de cada rota). Ver scripts/sync-localities.mjs.

export interface LocalityNote {
  title: string;
  text: string;
}

/** Textos de uma localidade num idioma (o que aparece na página). */
export interface LocalityText {
  name: string;
  prep: string;
  kind: string;
  intro: string;
  areasTitle: string;
  areas: string[];
  notes: LocalityNote[];
}

/**
 * Textos em inglês. `areas` só existe quando alguma entrada do francês tem
 * palavras francesas (ex. "Centre et Vieille-Ville"); senão vale a lista francesa.
 * `notes` tem a mesma quantidade e ordem do francês.
 */
export type LocalityTextEn = Omit<LocalityText, 'areas'> & { areas?: string[] };

export type CantonId = 'geneve' | 'vaud' | 'fribourg' | 'valais';

/** Os campos de texto no nível de cima são os franceses. */
export interface Locality extends LocalityText {
  slug: string;
  enSlug: string;
  canton: CantonId;
  en: LocalityTextEn;
}

/** Serviços com página por localidade: /demenagement-nyon, /debarras-nyon, /nettoyage-fin-de-bail-nyon. */
export type LocalService = 'demenagement' | 'debarras' | 'nettoyage';
export const LOCAL_SERVICES: LocalService[] = ['demenagement', 'debarras', 'nettoyage'];

interface Canton {
  id: CantonId;
  name: string;
  nameEn: string;
  /** "de Genève", "du Valais": completa "canton …" */
  of: string;
  ofEn: string;
}

export const CANTONS = raw.cantons as Canton[];
export const LOCALITIES = raw.localities as Locality[];

/** A localidade com os textos no idioma pedido (slug e cantão não mudam). */
export const localizeLocality = (l: Locality, lang: Lang): Locality =>
  lang === 'fr' ? l : { ...l, ...l.en, areas: l.en.areas ?? l.areas };

/** Nome do cantão no idioma pedido (Genève / Geneva). */
export const cantonName = (id: CantonId, lang: Lang): string => {
  const c = CANTONS.find((x) => x.id === id);
  if (!c) return id;
  return lang === 'en' ? c.nameEn : c.name;
};

/** Complemento de "canton": "de Genève", "du Valais" / "of Geneva". */
export const cantonOf = (id: CantonId, lang: Lang): string => {
  const c = CANTONS.find((x) => x.id === id);
  if (!c) return id;
  return lang === 'en' ? c.ofEn : c.of;
};

const LOCAL_PREFIX = routes.local as Record<LocalService, [string, string]>;
const STATIC_FR = new Set((routes.static as [string, string][]).map(([fr]) => fr));

/** Caminho francês da página local (ex. /demenagement-nyon). */
export const localPath = (service: LocalService, slug: string) => `${LOCAL_PREFIX[service][0]}${slug}`;

/**
 * A página local é gerada pelo template? Não quando já existe uma página própria
 * com o mesmo caminho (/demenagement-geneve, -lausanne, -vaud em pages/locations).
 */
export const isGeneratedLocal = (service: LocalService, slug: string) => !STATIC_FR.has(localPath(service, slug));

export const routeMeta = (path: string): { title: string; description: string } => {
  const routes = (seo as { routes: Record<string, { title: string; description: string }> }).routes;
  const meta = routes[path];
  if (!meta) throw new Error(`Rota sem metadados em seoRoutes.json: ${path}`);
  return meta;
};
