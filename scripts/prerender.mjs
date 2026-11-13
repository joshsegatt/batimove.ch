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
const statiquesFr = new Set(i18n.static.map(([fr]) => fr));
const paires = [
  ...i18n.static,
  ...localities.flatMap((l) =>
    Object.values(i18n.local)
      .map(([fr, en]) => [`${fr}${l.slug}`, `${en}${l.enSlug}`])
      .filter(([fr]) => !statiquesFr.has(fr))
  ),
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

/**
 * Titre visible de la page dans le HTML pré-rendu (h1 caché du squelette et
 * h1 du <noscript>) : le <title> sans le suffixe de marque. Avant, toutes les
 * pages — anglaises comprises — portaient le h1 français de l'accueil.
 */
const titrePage = (title) => title.split(' | ')[0].replace(/\s+[-–]\s+Batimove.*$/, '').trim();

/** Bloc <noscript> en anglais pour les routes /en (le gabarit est en français). */
const NOSCRIPT_EN = (h1) => `<noscript>
    <div style="max-width:800px;margin:40px auto;padding:24px;font-family:system-ui,-apple-system,sans-serif;color:#0f172a;line-height:1.6;">
      <h1 style="font-size:24px;font-weight:800;color:#0B1E33;margin-bottom:12px;">${h1}</h1>
      <p style="font-size:15px;margin-bottom:16px;">Batimove Sàrl is a Swiss removals and transport company for private clients and businesses in Geneva, Lausanne and across the canton of Vaud. We offer a complete service: home removals, business relocations, secure storage, eco-friendly house clearance and end of tenancy cleaning with a handover guarantee.</p>

      <h2 style="font-size:18px;font-weight:700;color:#0B1E33;margin-top:20px;margin-bottom:8px;">Our services</h2>
      <ul>
        <li><strong>Home removals:</strong> careful packing of your furniture and belongings, dismantling and reassembly, padded transport and liability insurance up to CHF 5,000,000.</li>
        <li><strong>Business and office relocations:</strong> tailored planning, IT and archive moves, no interruption to your business.</li>
        <li><strong>Secure storage:</strong> ventilated, sealed storage with secure access in Geneva.</li>
        <li><strong>End of tenancy cleaning:</strong> 100% guaranteed cleaning that meets Swiss letting-agency standards.</li>
        <li><strong>House clearance and eco-friendly sorting:</strong> reuse of items, removal and certified recycling.</li>
      </ul>

      <h2 style="font-size:18px;font-weight:700;color:#0B1E33;margin-top:20px;margin-bottom:8px;">Contact and head office</h2>
      <p>Address: Rue de Monthoux 64, 1201 Geneva, Switzerland.<br />Free phone: <a href="tel:0800825925">0800 825 925</a><br />Email: <a href="mailto:info@batimove.ch">info@batimove.ch</a><br />UID: CHE-143.091.230</p>
    </div>
  </noscript>`;

/** h1 du squelette, libellé de la barre de chargement et <noscript> de la route. */
function corpsDeRoute(source, h1, en) {
  let sortie = source
    .replace(/<h1 class="bs-sr">[\s\S]*?<\/h1>/, `<h1 class="bs-sr">${h1}</h1>`)
    .replace('aria-label="Chargement de la page"', `aria-label="${en ? 'Loading page' : 'Chargement de la page'}"`);
  sortie = en
    ? sortie.replace(/<noscript>[\s\S]*?<\/noscript>/, NOSCRIPT_EN(h1))
    : sortie.replace(/(<noscript>[\s\S]*?<h1[^>]*>)[\s\S]*?(<\/h1>)/, `$1${h1}$2`);
  if (!sortie.includes(`<h1 class="bs-sr">${h1}</h1>`)) manquantes.push(`h1 du squelette introuvable`);
  return sortie;
}

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

  let sortie = corpsDeRoute(
    html.replace(/<html lang="[^"]*">/, `<html lang="${en ? 'en' : 'fr-CH'}">`),
    esc(meta.h1 || titrePage(meta.title)),
    en
  );
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

// Page 404 : Vercel la sert avec le statut 404 pour toute URL sans réécriture
// (il n'y a plus de réécriture « /(.*) » vers index.html). Elle charge quand
// même l'application, qui affiche « Page introuvable » dans la bonne langue.
{
  let page = pageDeRoute('/404', {
    title: 'Page introuvable | Batimove Sàrl',
    description: "Cette page n'existe pas ou a été déplacée. Retrouvez nos services de déménagement à Genève, Lausanne et Vaud.",
    robots: 'noindex, follow',
  })
    .replace(/\s*<link rel="canonical"[^>]*>/, '')
    .replace(/\s*<meta (property="og:url"|name="twitter:url")[^>]*>/g, '');
  writeFileSync(join(dist, '404.html'), page);
}

console.log(`[prerender] ${ecrites} routes écrites avec leurs propres métadonnées, plus 404.html.`);
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
