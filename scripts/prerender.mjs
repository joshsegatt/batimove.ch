/**
 * Pré-rendu des métadonnées par route.
 *
 * Le site est une SPA : le serveur renvoyait le même index.html pour les douze
 * URLs, avec le <title>, la description et surtout le <link rel="canonical"> de
 * la page d'accueil. Le composant SEO corrigeait tout cela en JavaScript, après
 * le chargement — donc trop tard pour :
 *
 *   - les robots qui n'exécutent pas JS (Bing, crawlers d'IA) ;
 *   - les aperçus de liens (WhatsApp, LinkedIn, Facebook) ;
 *   - le premier passage d'indexation de Google, qui lisait « canonical =
 *     page d'accueil » sur les trois pages régionales, c'est-à-dire une
 *     instruction de ne pas les indexer.
 *
 * Ce script s'exécute après `vite build`. Il écrit dist/<route>/index.html à
 * partir du index.html généré, en remplaçant les balises du <head> par celles
 * de la route. Vercel sert ces fichiers avant d'appliquer la réécriture SPA,
 * donc chaque URL arrive avec ses propres métadonnées.
 *
 * Il ne pré-rend pas le corps de page : le contenu reste rendu par React.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(racine, 'dist');
const origine = 'https://www.batimove.ch';

const { _defaults: parDefaut, routes } = JSON.parse(
  readFileSync(join(racine, 'data', 'seoRoutes.json'), 'utf8')
);

const gabarit = join(dist, 'index.html');
if (!existsSync(gabarit)) {
  console.error('[prerender] dist/index.html introuvable — lancez vite build avant.');
  process.exit(1);
}
const html = readFileSync(gabarit, 'utf8')
  // Les liens hreflang du gabarit sont remplacés route par route plus bas.
  .replace(/\s*<link rel="alternate" hreflang="[^"]*"[^>]*>/g, '');

// Paires FR <-> EN (même source que l'application : data/i18nRoutes.json et
// le champ enSlug de data/serviceLocalities.json).
const i18n = JSON.parse(readFileSync(join(racine, 'data', 'i18nRoutes.json'), 'utf8'));
const { localities } = JSON.parse(readFileSync(join(racine, 'data', 'serviceLocalities.json'), 'utf8'));
const paires = [
  ...i18n.static,
  ...localities.flatMap((l) => [
    [`/debarras-${l.slug}`, `${i18n.local.debarras}${l.enSlug}`],
    [`/nettoyage-fin-de-bail-${l.slug}`, `${i18n.local.nettoyage}${l.enSlug}`],
  ]),
];
const paireDe = new Map();
for (const [fr, en] of paires) {
  paireDe.set(fr, { fr, en });
  paireDe.set(en, { fr, en });
}
const estAnglais = (route) => route === '/en' || route.startsWith('/en/');
const url = (route) => (route === '/' ? `${origine}/` : `${origine}${route}`);

/** Échappe le texte destiné à un attribut HTML. */
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Remplace la valeur d'une balise existante, ou l'ajoute avant </head> si elle
 * n'y est pas. Renvoie aussi le nombre de remplacements, pour détecter une
 * balise que le build aurait renommée.
 */
function remplacer(source, motif, remplacement) {
  if (motif.test(source)) return { html: source.replace(motif, remplacement), trouve: true };
  return { html: source.replace('</head>', `  ${remplacement}\n</head>`), trouve: false };
}

const manquantes = [];

function pageDeRoute(route, meta) {
  const canonical = route === '/' ? `${origine}/` : `${origine}${route}`;
  const titre = esc(meta.title);
  const desc = esc(meta.description);
  const robots = esc(meta.robots || parDefaut.robots);
  const image = esc(meta.ogImage || parDefaut.ogImage);

  const balises = [
    [/<title>[\s\S]*?<\/title>/, `<title>${titre}</title>`],
    [/<meta name="description"[^>]*>/, `<meta name="description" content="${desc}" />`],
    [/<meta name="robots"[^>]*>/, `<meta name="robots" content="${robots}" />`],
    [/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`],
    [/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${titre}" />`],
    [/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}" />`],
    [/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`],
    [/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${image}" />`],
    [/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${titre}" />`],
    [/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${desc}" />`],
    [/<meta name="twitter:url"[^>]*>/, `<meta name="twitter:url" content="${canonical}" />`],
    [/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${image}" />`]
  ];

  const en = estAnglais(route);
  balises.push([/<meta property="og:locale"[^>]*>/, `<meta property="og:locale" content="${en ? 'en_GB' : 'fr_CH'}" />`]);

  let sortie = html.replace(/<html lang="[^"]*">/, `<html lang="${en ? 'en' : 'fr-CH'}">`);
  const paire = paireDe.get(route);
  if (paire && paire.fr in routes && paire.en in routes) {
    const alternates = [
      `<link rel="alternate" hreflang="fr-CH" href="${url(paire.fr)}" />`,
      `<link rel="alternate" hreflang="en" href="${url(paire.en)}" />`,
      `<link rel="alternate" hreflang="x-default" href="${url(paire.fr)}" />`,
    ].join('\n  ');
    sortie = sortie.replace('</head>', `  ${alternates}\n</head>`);
  }
  for (const [motif, valeur] of balises) {
    const r = remplacer(sortie, motif, valeur);
    sortie = r.html;
    if (!r.trouve) manquantes.push(`${route} :: ${valeur.slice(0, 48)}…`);
  }
  return sortie;
}

let ecrites = 0;
for (const [route, meta] of Object.entries(routes)) {
  const page = pageDeRoute(route, meta);
  const dossier = route === '/' ? dist : join(dist, route);
  mkdirSync(dossier, { recursive: true });
  writeFileSync(join(dossier, 'index.html'), page);
  ecrites++;
}

console.log(`[prerender] ${ecrites} routes écrites avec leurs propres métadonnées.`);
if (manquantes.length) {
  console.warn(
    `[prerender] ${manquantes.length} balise(s) ajoutée(s) faute d'avoir été trouvée(s) dans index.html :`
  );
  for (const m of manquantes.slice(0, 6)) console.warn('  ' + m);
}

// Garde-fou : chaque route pré-rendue a besoin de sa réécriture dans
// vercel.json, sinon Vercel renverrait index.html — donc le canonical de la
// page d'accueil — et le fichier généré ne servirait jamais.
const vercelJson = join(racine, 'vercel.json');
if (existsSync(vercelJson)) {
  const reecritures = (JSON.parse(readFileSync(vercelJson, 'utf8')).rewrites || []).map((r) => r.source);
  const sansReecriture = Object.keys(routes).filter((r) => r !== '/' && !reecritures.includes(r));
  if (sansReecriture.length) {
    console.error(
      '[prerender] routes pré-rendues sans réécriture dans vercel.json :',
      sansReecriture.join(', ')
    );
    process.exit(1);
  }
  console.log(`[prerender] vercel.json vérifié : ${Object.keys(routes).length - 1} réécritures en place.`);
}

// Garde-fou : toute URL du sitemap doit avoir été pré-rendue, sinon elle
// repartirait avec le canonical de la page d'accueil.
const sitemap = join(racine, 'public', 'sitemap.xml');
if (existsSync(sitemap)) {
  const urls = [...readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(origine, '') || '/');
  const oubliees = urls.filter((u) => !(u in routes));
  if (oubliees.length) {
    console.error('[prerender] URLs du sitemap absentes de data/seoRoutes.json :', oubliees.join(', '));
    process.exit(1);
  }
  console.log(`[prerender] sitemap vérifié : ${urls.length} URLs toutes couvertes.`);
}
