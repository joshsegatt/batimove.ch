// Países com página própria de mudança (/demenagement-france…). Lista leve, usada
// pelo roteador e pelos menus; o conteúdo das páginas fica em data/countryPages.ts
// (carregado só com a página). Os pares FR/EN estão em data/i18nRoutes.json.
// Destinos confirmados pela Batimove. A alfândega é tratada pelo escritório depois
// do pedido de devis, por isso as páginas não detalham regras de cada país.

export type CountrySlug =
  | 'france'
  | 'italie'
  | 'portugal'
  | 'espagne'
  | 'allemagne'
  | 'belgique'
  | 'pays-bas'
  | 'luxembourg'
  | 'autriche'
  | 'monaco'
  | 'royaume-uni';

export interface CountryLink {
  slug: CountrySlug;
  /** Caminho francês */
  path: string;
  name: string;
  nameEn: string;
  /** Inglês depois de "to": "the Netherlands" (padrão: nameEn) */
  enTo: string;
}

const c = (slug: CountrySlug, name: string, nameEn: string, enTo = nameEn): CountryLink => ({
  slug,
  path: `/demenagement-${slug}`,
  name,
  nameEn,
  enTo,
});

export const COUNTRIES: CountryLink[] = [
  c('france', 'France', 'France'),
  c('italie', 'Italie', 'Italy'),
  c('portugal', 'Portugal', 'Portugal'),
  c('espagne', 'Espagne', 'Spain'),
  c('allemagne', 'Allemagne', 'Germany'),
  c('belgique', 'Belgique', 'Belgium'),
  c('pays-bas', 'Pays-Bas', 'Netherlands', 'the Netherlands'),
  c('luxembourg', 'Luxembourg', 'Luxembourg'),
  c('autriche', 'Autriche', 'Austria'),
  c('monaco', 'Monaco', 'Monaco'),
  c('royaume-uni', 'Royaume-Uni', 'United Kingdom', 'the UK'),
];
