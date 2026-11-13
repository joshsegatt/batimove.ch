import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import routesJson from '../data/i18nRoutes.json';
import localitiesJson from '../data/serviceLocalities.json';

/**
 * Idiomas do site. O francês é o idioma de origem e mora na raiz (/debarras);
 * o inglês mora em /en com endereços em inglês (/en/house-clearance).
 *
 * Regra para componentes: escreva links sempre com o caminho FRANCÊS e passe
 * por `lp()` (de useLang); o texto vem de um objeto `defineCopy({ fr, en })`.
 */
export type Lang = 'fr' | 'en';

const STATIC = routesJson.static as [string, string][];
const LOCAL_PREFIX = routesJson.local as Record<'debarras' | 'nettoyage', string>;
const LOCALS = (localitiesJson.localities as { slug: string; enSlug: string }[]);

/** Todos os pares [fr, en] do site, inclusive as 20 páginas locais. */
export const ROUTE_PAIRS: [string, string][] = [
  ...STATIC,
  ...LOCALS.flatMap((l) => [
    [`/debarras-${l.slug}`, `${LOCAL_PREFIX.debarras}${l.enSlug}`] as [string, string],
    [`/nettoyage-fin-de-bail-${l.slug}`, `${LOCAL_PREFIX.nettoyage}${l.enSlug}`] as [string, string],
  ]),
];

const FR_TO_EN = new Map(ROUTE_PAIRS.map(([fr, en]) => [fr, en]));
const EN_TO_FR = new Map(ROUTE_PAIRS.map(([fr, en]) => [en, fr]));

export const langOf = (pathname: string): Lang =>
  pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';

const split = (path: string) => {
  const m = path.match(/^([^?#]*)(.*)$/);
  return { base: m?.[1] || '/', rest: m?.[2] || '' };
};

/** Caminho francês -> caminho no idioma pedido (preserva ?query e #hash). */
export const localizePath = (frPath: string, lang: Lang): string => {
  if (lang === 'fr' || /^(https?:|mailto:|tel:|#)/.test(frPath)) return frPath;
  const { base, rest } = split(frPath);
  const direct = FR_TO_EN.get(base);
  if (direct) return direct + rest;
  // Rotas com parâmetro: /quote/:serviceId
  const quote = base.match(/^\/quote\/(.+)$/);
  if (quote) return `/en/quote/${quote[1]}${rest}`;
  return base.startsWith('/en') ? frPath : `/en${base === '/' ? '' : base}${rest}`;
};

/** Caminho atual -> mesmo conteúdo no outro idioma (para o botão FR/EN e o hreflang). */
export const alternatePath = (path: string, target: Lang): string => {
  const { base, rest } = split(path);
  const current = langOf(base);
  if (current === target) return path;
  if (target === 'en') return localizePath(path, 'en');
  const direct = EN_TO_FR.get(base);
  if (direct) return direct + rest;
  const quote = base.match(/^\/en\/quote\/(.+)$/);
  if (quote) return `/quote/${quote[1]}${rest}`;
  return '/' + rest;
};

/** Idioma da página atual e o tradutor de links. */
export const useLang = () => {
  const { pathname } = useLocation();
  const lang = langOf(pathname);
  const lp = useCallback((frPath: string) => localizePath(frPath, lang), [lang]);
  return { lang, lp };
};

/**
 * Textos de um componente nos dois idiomas. O TypeScript obriga o inglês a ter
 * exatamente as mesmas chaves do francês.
 *   const COPY = defineCopy({ title: 'Bonjour' }, { title: 'Hello' });
 *   const c = COPY[lang];
 */
export const defineCopy = <T,>(fr: T, en: NoInfer<T>): Record<Lang, T> => ({ fr, en });

/** Formatação de número/data conforme o idioma (fr-CH / en-GB). */
export const LOCALE: Record<Lang, string> = { fr: 'fr-CH', en: 'en-GB' };
