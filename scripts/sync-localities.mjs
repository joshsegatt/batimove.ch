/**
 * Gera as rotas locais de Débarras e Nettoyage a partir de data/serviceLocalities.json:
 * metadados em data/seoRoutes.json, URLs em public/sitemap.xml e rewrites em vercel.json.
 * Rodar depois de editar a lista de localidades:  node scripts/sync-localities.mjs
 * O prerender (npm run build) falha se algum dos três ficar fora de sincronia.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const { localities } = JSON.parse(read('data/serviceLocalities.json'));

const pick = (areas, n) => areas.filter((a) => !/\(|centre|Centre/.test(a)).slice(0, n).join(', ');

const SERVICES = {
  debarras: {
    path: (s) => `/debarras-${s}`,
    title: (l) => `Débarras ${l.name} - Devis en 30 min | Batimove`,
    description: (l) =>
      `Débarras ${l.prep} : appartement, maison, cave ou grenier. Tri, évacuation et recyclage, prix ferme. Également : ${pick(l.areas.filter((a) => a !== l.name), 3)}.`,
  },
  nettoyage: {
    path: (s) => `/nettoyage-fin-de-bail-${s}`,
    title: (l) => `Nettoyage Fin de Bail ${l.name} | Batimove`,
    description: (l) =>
      `Nettoyage de fin de bail ${l.prep}, conforme aux exigences des régies. Retouche gratuite en cas de remarque. Également : ${pick(l.areas.filter((a) => a !== l.name), 3)}.`,
  },
};

const i18n = JSON.parse(read('data/i18nRoutes.json'));
const SERVICES_EN = {
  debarras: {
    path: (l) => `${i18n.local.debarras}${l.enSlug}`,
    title: (l) => `House Clearance ${l.en.name}: Free Quote | Batimove`,
    description: (l, areas) =>
      `House clearance ${l.en.prep}: flats, houses, cellars and attics. Sorting, removal and recycling at a fixed price. Also: ${areas}.`,
  },
  nettoyage: {
    path: (l) => `${i18n.local.nettoyage}${l.enSlug}`,
    title: (l) => `End of Tenancy Cleaning ${l.en.name} | Batimove`,
    description: (l, areas) =>
      `End of tenancy cleaning ${l.en.prep}, to letting-agency standards. Free touch-up if anything is flagged. Also: ${areas}.`,
  },
};

// 1) seoRoutes.json
const seo = JSON.parse(read('data/seoRoutes.json'));
const problems = [];
for (const l of localities) {
  for (const s of Object.values(SERVICES)) {
    const route = s.path(l.slug);
    let description = s.description(l);
    // corta a lista de comunas até caber em 155 caracteres
    let n = 3;
    while (description.length > 155 && n > 0) {
      n--;
      description = s.description({ ...l, areas: l.areas.slice(0, n + 1) }).replace(/ Aussi \.$/, '');
    }
    const title = s.title(l);
    if (title.length > 60) problems.push(`${route} title ${title.length}`);
    if (description.length > 155) problems.push(`${route} description ${description.length}`);
    seo.routes[route] = { title, description };
  }
}
// Mesmas páginas locais em inglês.
for (const l of localities) {
  for (const s of Object.values(SERVICES_EN)) {
    const route = s.path(l);
    const others = (l.en.areas || l.areas).filter((a) => a !== l.en.name && a !== l.name);
    let n = 3;
    let description = s.description(l, pick(others, n));
    while (description.length > 155 && n > 1) {
      n--;
      description = s.description(l, pick(others, n));
    }
    const title = s.title(l);
    if (title.length > 60) problems.push(`${route} title ${title.length}`);
    if (description.length > 155) problems.push(`${route} description ${description.length}`);
    seo.routes[route] = { title, description };
  }
}
writeFileSync(join(root, 'data/seoRoutes.json'), JSON.stringify(seo, null, 2) + '\n');

// 2) sitemap.xml: substitui o bloco gerado (entre os marcadores) pela lista atual
const routes = localities.flatMap((l) => Object.values(SERVICES).map((s) => s.path(l.slug)));
const today = new Date().toISOString().slice(0, 10);
const block =
  '  <!-- LOCALITES:DEBUT (généré par scripts/sync-localities.mjs) -->\n' +
  routes
    .map(
      (r) =>
        `  <url>\n    <loc>https://www.batimove.ch${r}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    )
    .join('\n') +
  '\n  <!-- LOCALITES:FIN -->';
let sitemap = read('public/sitemap.xml').replace(/\r\n/g, '\n');
if (sitemap.includes('<!-- LOCALITES:DEBUT')) {
  sitemap = sitemap.replace(/  <!-- LOCALITES:DEBUT[\s\S]*?<!-- LOCALITES:FIN -->/, block);
} else {
  sitemap = sitemap.replace('</urlset>', block + '\n</urlset>');
}
// 2b) Bloco I18N: versões em inglês de toda URL francesa do sitemap, mais as
// páginas francesas de i18nRoutes.json que ainda não estavam no sitemap.
const enOf = new Map([
  ...i18n.static,
  ...localities.flatMap((l) => [
    [`/debarras-${l.slug}`, SERVICES_EN.debarras.path(l)],
    [`/nettoyage-fin-de-bail-${l.slug}`, SERVICES_EN.nettoyage.path(l)],
  ]),
]);
const urlOf = (r) => `https://www.batimove.ch${r === '/' ? '/' : r}`;
const semBloco = sitemap.replace(/  <!-- I18N:DEBUT[\s\S]*?<!-- I18N:FIN -->\n?/, '');
const listed = new Set([...semBloco.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const indexable = (r) => !/noindex/.test(seo.routes[r]?.robots || '');
const extraFr = i18n.static.map(([fr]) => fr).filter((fr) => !listed.has(urlOf(fr)) && fr in seo.routes && indexable(fr));
const frAll = [...[...listed].map((u) => u.replace('https://www.batimove.ch', '') || '/'), ...extraFr];
const enRoutes = frAll.map((fr) => enOf.get(fr)).filter((r) => r && r in seo.routes && indexable(r));
const entry = (r, prio) =>
  `  <url>
    <loc>${urlOf(r)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${prio}</priority>
  </url>`;
const i18nBlock =
  '  <!-- I18N:DEBUT (généré par scripts/sync-localities.mjs) -->\n' +
  [...extraFr.map((r) => entry(r, '0.8')), ...enRoutes.map((r) => entry(r, '0.6'))].join('\n') +
  '\n  <!-- I18N:FIN -->\n';
sitemap = semBloco.replace('</urlset>', i18nBlock + '</urlset>');
writeFileSync(join(root, 'public/sitemap.xml'), sitemap);

// 3) vercel.json: um rewrite por rota exata, antes dos rewrites com parâmetro
// (/quote/:serviceId). Não há catch-all: endereço desconhecido recebe o
// dist/404.html com status 404 (escrito por scripts/prerender.mjs).
const vercel = JSON.parse(read('vercel.json'));
const isLocal = (src) => /^\/(debarras|nettoyage-fin-de-bail)-/.test(src);
vercel.rewrites = vercel.rewrites.filter((r) => !isLocal(r.source) && r.source !== '/(.*)');
const beforeParams = () => {
  const i = vercel.rewrites.findIndex((r) => r.source.includes(':'));
  return i < 0 ? vercel.rewrites.length : i;
};
vercel.rewrites.splice(beforeParams(), 0, ...routes.map((r) => ({ source: r, destination: `${r}/index.html` })));
// Toda rota com metadados (francês e inglês) precisa do seu rewrite.
const existing = new Set(vercel.rewrites.map((r) => r.source));
const missing = Object.keys(seo.routes).filter((r) => r !== '/' && !existing.has(r));
vercel.rewrites.splice(beforeParams(), 0, ...missing.map((r) => ({ source: r, destination: `${r}/index.html` })));
writeFileSync(join(root, 'vercel.json'), JSON.stringify(vercel, null, 4) + '\n');

console.log(`[sync-localities] ${routes.length} rotas locais sincronizadas.`);
if (problems.length) {
  console.error('[sync-localities] fora do limite do Google:', problems.join('; '));
  process.exit(1);
}
