import raw from './serviceLocalities.json';
import seo from './seoRoutes.json';

// Camada tipada sobre data/serviceLocalities.json (conteúdo) e data/seoRoutes.json
// (título e descrição de cada rota). Ver scripts/sync-localities.mjs.

export interface LocalityNote {
  title: string;
  text: string;
}

export interface Locality {
  slug: string;
  name: string;
  prep: string;
  canton: 'geneve' | 'vaud';
  kind: string;
  intro: string;
  areasTitle: string;
  areas: string[];
  notes: LocalityNote[];
  movePage?: string;
}

export type LocalService = 'debarras' | 'nettoyage';

export const CANTONS = raw.cantons as { id: Locality['canton']; name: string }[];
export const LOCALITIES = raw.localities as Locality[];

export const localPath = (service: LocalService, slug: string) =>
  service === 'debarras' ? `/debarras-${slug}` : `/nettoyage-fin-de-bail-${slug}`;

export const routeMeta = (path: string): { title: string; description: string } => {
  const routes = (seo as { routes: Record<string, { title: string; description: string }> }).routes;
  const meta = routes[path];
  if (!meta) throw new Error(`Rota sem metadados em seoRoutes.json: ${path}`);
  return meta;
};
