import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import seoRoutes from '../data/seoRoutes.json';
import { alternatePath, langOf } from '../i18n';

const ORIGIN = 'https://www.batimove.ch';
const ROUTES = (seoRoutes as { routes: Record<string, { title: string; description: string; robots?: string }> }).routes;

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = 'Batimove Sàrl : Déménagement à Genève, Lausanne & Vaud';
const DEFAULT_DESCRIPTION = "Entreprise de déménagement en Suisse Romande pour particuliers et entreprises à Genève, Lausanne et dans le canton de Vaud. Devis gratuit et service garanti.";
const DEFAULT_CANONICAL = 'https://www.batimove.ch/';
const DEFAULT_OG_IMAGE = 'https://www.batimove.ch/batimove-logo.png';

/**
 * Metadados da página. Se a rota atual está em data/seoRoutes.json, o título,
 * a descrição e o canonical vêm de lá (a mesma fonte do prerender), em
 * qualquer idioma; as props só valem para rotas fora da lista.
 * Também mantém <html lang> e os links hreflang FR/EN.
 */
export const SEO: React.FC<SEOProps> = (props) => {
  const { pathname } = useLocation();
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const fromRoutes = ROUTES[path];
  const title = fromRoutes?.title ?? props.title ?? DEFAULT_TITLE;
  const description = fromRoutes?.description ?? props.description ?? DEFAULT_DESCRIPTION;
  const canonical = fromRoutes ? `${ORIGIN}${path === '/' ? '/' : path}` : props.canonical ?? DEFAULT_CANONICAL;
  const robots = fromRoutes?.robots ?? props.robots ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const ogImage = props.ogImage ?? DEFAULT_OG_IMAGE;
  const ogType = props.ogType ?? 'website';
  const schema = props.schema;
  const lang = langOf(path);
  const noCanonical = !fromRoutes && /noindex/.test(robots);

  useEffect(() => {
    // Mesmos valores que o prerender (scripts/prerender.mjs) escreve no HTML:
    // se divergirem, a navegação deixa links velhos ou duplicados no <head>.
    document.documentElement.lang = lang === 'en' ? 'en' : 'fr-CH';
    const fr = alternatePath(path, 'fr');
    const en = alternatePath(path, 'en');
    const hasPair = fr in ROUTES && en in ROUTES;
    const pairs = [['fr-CH', fr], ['en', en], ['x-default', fr]] as const;
    // Remove qualquer alternate de outro idioma (versões antigas usavam "fr").
    document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]').forEach((l) => {
      if (!pairs.some(([h]) => h === l.hreflang)) l.remove();
    });
    for (const [hreflang, href] of pairs) {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement | null;
      if (!hasPair) {
        link?.remove();
        continue;
      }
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hreflang;
        document.head.appendChild(link);
      }
      link.href = `${ORIGIN}${href === '/' ? '/' : href}`;
    }
  }, [path, lang]);

  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // Helper to update or create meta tags
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', robots);

    // 3. Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:locale', lang === 'en' ? 'en_GB' : 'fr_CH');

    // 4. Twitter Tags
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:url', canonical);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. Canonical Link Tag. Página noindex fora da lista (a 404) não tem
    // canonical: apontar para a home faria o Google tratá-la como duplicata.
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (noCanonical) {
      canonicalLink?.remove();
    } else {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // 6. Dynamic Schema.org JSON-LD (if provided)
    let dynamicSchemaScript = document.getElementById('seo-dynamic-jsonld') as HTMLScriptElement | null;
    if (schema) {
      if (!dynamicSchemaScript) {
        dynamicSchemaScript = document.createElement('script');
        dynamicSchemaScript.id = 'seo-dynamic-jsonld';
        dynamicSchemaScript.type = 'application/ld+json';
        document.head.appendChild(dynamicSchemaScript);
      }
      dynamicSchemaScript.textContent = JSON.stringify(schema);
    } else if (dynamicSchemaScript) {
      dynamicSchemaScript.remove();
    }
  }, [title, description, canonical, noCanonical, robots, ogImage, ogType, schema, lang]);

  return null;
};
