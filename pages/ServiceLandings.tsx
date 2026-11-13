import React from 'react';
import { ServiceLandingTemplate } from '../components/ServiceLandingTemplate';
import { LOCALITIES, type LocalService } from '../data/localities';

// O template escolhe a versão FR/EN do conteúdo a partir do idioma da URL.
export const Debarras: React.FC = () => <ServiceLandingTemplate service="debarras" />;
export const Nettoyage: React.FC = () => <ServiceLandingTemplate service="nettoyage" />;
export const GardeMeubles: React.FC = () => <ServiceLandingTemplate service="garde-meubles" />;

/** Página local de um serviço (ex. /debarras-lausanne). Recebe o slug FRANCÊS nos dois idiomas. */
export const LocalServiceLanding: React.FC<{ service: LocalService; slug: string }> = ({ service, slug }) => {
  const locality = LOCALITIES.find((l) => l.slug === slug);
  if (!locality) return null;
  return <ServiceLandingTemplate service={service} locality={locality} />;
};
