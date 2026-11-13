// Conteúdo de confiança da Home (faixa navy e "fiche d'identité").
// Regra: só fatos verificáveis. Cada linha abaixo tem fonte:
// - IDE e fundação: Zefix (Batimove Sàrl, CHE-143.091.230)
// - RC Pro 5M: CGV (pages/Legal.tsx); All Risk: confirmado pela Batimove
// - Devis sob 30 min (8h-19h) e "joignable 7j/7": promessas confirmadas pela Batimove
// - Autorização de estacionamento e painéis 48h antes: páginas locais (pages/locations)

import type { Lang } from '../i18n';

export interface HomeEngagement {
  title: string;
  text: string;
}

export const HOME_ENGAGEMENTS: HomeEngagement[] = [
  {
    title: 'Autorisation de stationnement',
    text: "Sur demande, nous la demandons à la police et à la commune, puis posons les panneaux officiels 48 h avant le jour J.",
  },
  {
    title: 'Parties communes protégées',
    text: 'Sols, murs et ascenseurs couverts avant le premier carton, dégagés après le dernier.',
  },
  {
    title: 'Remise des clés à la régie',
    text: "Logement rendu prêt pour l'état des lieux, avec le nettoyage de fin de bail si vous le souhaitez.",
  },
];

export interface HomeFicheItem {
  term: string;
  desc: string;
  href?: string;
}

export const HOME_FICHE: HomeFicheItem[] = [
  { term: 'Raison sociale', desc: 'Batimove Sàrl · IDE CHE-143.091.230' },
  { term: 'Siège', desc: 'Rue de Monthoux 64, 1201 Genève' },
  { term: "Zone d'intervention", desc: 'Genève, Vaud, Fribourg, Valais' },
  { term: 'Assurance', desc: "RC Pro jusqu'à CHF 5M et All Risk" },
  { term: 'Devis', desc: 'Gratuit et ferme, sous 30 min (8h-19h)' },
  { term: 'Contact', desc: '0800 825 925 · joignable 7j/7', href: 'tel:0800825925' },
];

// Versão em inglês (páginas /en). Mesmos fatos, sem acrescentar nada.
export const HOME_ENGAGEMENTS_EN: HomeEngagement[] = [
  {
    title: 'Parking permit',
    text: 'On request, we apply for it with the police and the municipality, then put up the official signs 48 hours before moving day.',
  },
  {
    title: 'Shared areas protected',
    text: 'Floors, walls and lifts covered before the first box goes out, uncovered after the last.',
  },
  {
    title: 'Key handover to the letting agency',
    text: 'Your home left ready for the check-out inspection, with end of tenancy cleaning if you wish.',
  },
];

export const HOME_FICHE_EN: HomeFicheItem[] = [
  { term: 'Company name', desc: 'Batimove Sàrl · UID CHE-143.091.230' },
  { term: 'Registered office', desc: 'Rue de Monthoux 64, 1201 Genève' },
  { term: 'Service area', desc: 'Geneva, Vaud, Fribourg, Valais' },
  { term: 'Insurance', desc: 'Professional liability up to CHF 5M and All Risk' },
  { term: 'Quote', desc: 'Free and fixed, within 30 min (8am-7pm)' },
  { term: 'Contact', desc: '0800 825 925 · available 7 days a week', href: 'tel:0800825925' },
];

export const HOME_ENGAGEMENTS_BY_LANG: Record<Lang, HomeEngagement[]> = {
  fr: HOME_ENGAGEMENTS,
  en: HOME_ENGAGEMENTS_EN,
};

export const HOME_FICHE_BY_LANG: Record<Lang, HomeFicheItem[]> = {
  fr: HOME_FICHE,
  en: HOME_FICHE_EN,
};
