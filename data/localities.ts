import raw from './serviceLocalities.json';
import seo from './seoRoutes.json';
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

/** Os campos de texto no nível de cima são os franceses. */
export interface Locality extends LocalityText {
  slug: string;
  enSlug: string;
  canton: 'geneve' | 'vaud';
  movePage?: string;
  en: LocalityTextEn;
}

export type LocalService = 'debarras' | 'nettoyage';

export const CANTONS = raw.cantons as { id: Locality['canton']; name: string; nameEn: string }[];
export const LOCALITIES = raw.localities as Locality[];

/** A localidade com os textos no idioma pedido (slug, cantão e movePage não mudam). */
export const localizeLocality = (l: Locality, lang: Lang): Locality =>
  lang === 'fr' ? l : { ...l, ...l.en, areas: l.en.areas ?? l.areas };

/** Nome do cantão no idioma pedido (Genève / Geneva). */
export const cantonName = (id: Locality['canton'], lang: Lang): string => {
  const c = CANTONS.find((x) => x.id === id);
  if (!c) return id;
  return lang === 'en' ? c.nameEn : c.name;
};

export const localPath = (service: LocalService, slug: string) =>
  service === 'debarras' ? `/debarras-${slug}` : `/nettoyage-fin-de-bail-${slug}`;

export const routeMeta = (path: string): { title: string; description: string } => {
  const routes = (seo as { routes: Record<string, { title: string; description: string }> }).routes;
  const meta = routes[path];
  if (!meta) throw new Error(`Rota sem metadados em seoRoutes.json: ${path}`);
  return meta;
};
