import React, { useEffect } from 'react';

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

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical = DEFAULT_CANONICAL,
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  schema,
}) => {
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

    // 4. Twitter Tags
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:url', canonical);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

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
  }, [title, description, canonical, robots, ogImage, ogType, schema]);

  return null;
};
