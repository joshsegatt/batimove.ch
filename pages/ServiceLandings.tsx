import React from 'react';
import { ServiceLandingTemplate } from '../components/ServiceLandingTemplate';
import { SERVICE_LANDINGS } from '../data/serviceLandings';
import { LOCALITIES, localPath, type LocalService } from '../data/localities';

export const Debarras: React.FC = () => <ServiceLandingTemplate config={SERVICE_LANDINGS.debarras} />;
export const Nettoyage: React.FC = () => <ServiceLandingTemplate config={SERVICE_LANDINGS.nettoyage} />;
export const GardeMeubles: React.FC = () => <ServiceLandingTemplate config={SERVICE_LANDINGS['garde-meubles']} />;

/** Página local de um serviço (ex. /debarras-lausanne). */
export const LocalServiceLanding: React.FC<{ service: LocalService; slug: string }> = ({ service, slug }) => {
  const locality = LOCALITIES.find((l) => l.slug === slug);
  if (!locality) return null;
  return <ServiceLandingTemplate config={SERVICE_LANDINGS[service]} locality={locality} />;
};

