// Conteúdo de confiança da Home (faixa navy e "fiche d'identité").
// Regra: só fatos verificáveis. Cada linha abaixo tem fonte:
// - IDE e fundação: Zefix (Batimove Sàrl, CHE-143.091.230)
// - RC Pro 5M: CGV (pages/Legal.tsx); All Risk: confirmado pela Batimove
// - Devis sob 30 min (8h-19h) e "joignable 7j/7": promessas confirmadas pela Batimove
// - Autorização de estacionamento e painéis 48h antes: páginas locais (pages/locations)

export interface HomeEngagement {
  title: string;
  text: string;
}

export const HOME_ENGAGEMENTS: HomeEngagement[] = [
  {
    title: 'Autorisation de stationnement',
    text: "Nous la demandons à la police et à la commune, puis posons les panneaux officiels 48 h avant le jour J.",
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
