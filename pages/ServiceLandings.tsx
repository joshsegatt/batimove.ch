import React from 'react';
import { ServiceLandingTemplate } from '../components/ServiceLandingTemplate';
import { LOCALITIES, type LocalService } from '../data/localities';
import { localityHome } from '../data/localHome';
import { useLang } from '../i18n';
import { Home } from './Home';

// O template escolhe a versão FR/EN do conteúdo a partir do idioma da URL.
export const Debarras: React.FC = () => <ServiceLandingTemplate service="debarras" />;
export const Nettoyage: React.FC = () => <ServiceLandingTemplate service="nettoyage" />;
export const GardeMeubles: React.FC = () => <ServiceLandingTemplate service="garde-meubles" />;

/**
 * Página local de um serviço (ex. /debarras-lausanne). Recebe o slug FRANCÊS nos dois idiomas.
 * Déménagement por lugar (/demenagement-nyon) é a própria home com os dados do lugar,
 * como as páginas de Genève, Lausanne e Vaud.
 */
export const LocalServiceLanding: React.FC<{ service: LocalService; slug: string }> = ({ service, slug }) => {
  const { lang } = useLang();
  const locality = LOCALITIES.find((l) => l.slug === slug);
  if (!locality) return null;
  if (service === 'demenagement') return <Home local={localityHome(slug, lang)} />;
  return <ServiceLandingTemplate service={service} locality={locality} />;
};
