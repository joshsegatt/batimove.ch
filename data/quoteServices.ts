import type { LucideIcon } from 'lucide-react';
import { House, Building2, Trash2, SprayCan, Warehouse } from 'lucide-react';

// Fonte única dos serviços do orçamento: o seletor da Home e o wizard do /quote
// leem daqui. O `id` é o valor do parâmetro `?type=` na URL.

export type QuoteServiceId = 'prive' | 'entreprise' | 'debarras' | 'nettoyage' | 'garde-meubles';

export interface QuoteDetailQuestion {
  /** Pergunta mostrada na etapa "Détails" */
  label: string;
  /** Rótulo curto para o resumo, o e-mail e o WhatsApp */
  short: string;
  options: string[];
}

export interface QuoteService {
  id: QuoteServiceId;
  /** Título curto (seletor e resumo) */
  label: string;
  /** Linha de apoio no seletor */
  hint: string;
  /** Nome completo usado no e-mail e na mensagem de WhatsApp */
  emailName: string;
  icon: LucideIcon;
  /** Página pública do serviço (menu, links internos) */
  page: string;
  /** true: pede partida e chegada; false: um só endereço */
  hasRoute: boolean;
  /** Pergunta principal da etapa "Détails" (obrigatória, um toque) */
  size: QuoteDetailQuestion;
  /** Pergunta de acesso, só para quem carrega móveis num prédio */
  access?: QuoteDetailQuestion;
}

const LOGEMENT_SIZES = ['Studio', '2 à 3 pièces', '4 à 5 pièces', 'Maison ou villa'];
const ACCESS: QuoteDetailQuestion = {
  label: 'Accès au logement',
  short: 'Accès',
  options: ['Ascenseur', 'Escaliers', 'Plain-pied'],
};

export const QUOTE_SERVICES: QuoteService[] = [
  {
    id: 'prive',
    label: 'Déménagement privé',
    hint: 'Appartement, maison, villa',
    emailName: 'Déménagement Résidentiel',
    icon: House,
    page: '/quote?type=prive',
    hasRoute: true,
    size: { label: 'Quelle est la taille du logement ?', short: 'Logement', options: LOGEMENT_SIZES },
    access: ACCESS,
  },
  {
    id: 'entreprise',
    label: 'Entreprise',
    hint: 'Bureaux et commerces',
    emailName: "Transfert d'Entreprise & Bureaux",
    icon: Building2,
    page: '/quote?type=entreprise',
    hasRoute: true,
    size: {
      label: 'Combien de postes de travail ?',
      short: 'Postes de travail',
      options: ["Jusqu'à 10", '10 à 30', '30 à 80', 'Plus de 80'],
    },
    access: ACCESS,
  },
  {
    id: 'debarras',
    label: 'Débarras',
    hint: 'Logement, cave ou grenier',
    emailName: 'Débarras',
    icon: Trash2,
    page: '/debarras',
    hasRoute: false,
    size: {
      label: 'Que faut-il débarrasser ?',
      short: 'À débarrasser',
      options: ['Une pièce', 'Cave ou grenier', 'Appartement', 'Maison'],
    },
    access: ACCESS,
  },
  {
    id: 'nettoyage',
    label: 'Nettoyage',
    hint: 'Fin de bail, remise des clés',
    emailName: 'Nettoyage de fin de bail',
    icon: SprayCan,
    page: '/nettoyage-fin-de-bail',
    hasRoute: false,
    size: { label: 'Quelle est la taille du logement ?', short: 'Logement', options: LOGEMENT_SIZES },
  },
  {
    id: 'garde-meubles',
    label: 'Garde-meubles',
    hint: 'Stockage court ou long terme',
    emailName: 'Garde-Meubles',
    icon: Warehouse,
    page: '/garde-meubles',
    hasRoute: false,
    size: {
      label: 'Que faut-il stocker ?',
      short: 'Volume',
      options: ['Quelques cartons', 'Un studio', 'Un appartement', 'Une maison'],
    },
    // Segmentado curto (cabe em 375 px); a duração orienta o devis.
    access: { label: 'Pour combien de temps ?', short: 'Durée', options: ['≤ 1 mois', '1 à 6 mois', '6 mois +'] },
  },
];

/** Aceita os ids atuais e os apelidos antigos que ainda circulam em links. */
export const resolveQuoteServiceId = (raw: string | null | undefined): QuoteServiceId | null => {
  switch ((raw || '').toLowerCase()) {
    case 'prive':
    case 'priv':
      return 'prive';
    case 'entreprise':
    case 'pro':
    case 'business':
      return 'entreprise';
    case 'debarras':
      return 'debarras';
    case 'nettoyage':
    case 'clean':
      return 'nettoyage';
    case 'garde-meubles':
    case 'stockage':
    case 'storage':
      return 'garde-meubles';
    default:
      return null;
  }
};

export const getQuoteService = (id: QuoteServiceId): QuoteService =>
  QUOTE_SERVICES.find((s) => s.id === id) ?? QUOTE_SERVICES[0];

/** Número de WhatsApp da Batimove (formato wa.me, sem + nem espaços). */
export const BATIMOVE_WHATSAPP = '41798896406';

// --- Inglês ---------------------------------------------------------------
// Mesma ordem de opções do francês: o índice escolhido é o mesmo nos dois
// idiomas, então o e-mail interno pode sempre usar o rótulo francês.

const LOGEMENT_SIZES_EN = ['Studio', '1 to 2 bedrooms', '3 to 4 bedrooms', 'House or villa'];
const ACCESS_EN: QuoteDetailQuestion = {
  label: 'Access to the property',
  short: 'Access',
  options: ['Lift', 'Stairs', 'Ground floor'],
};

const EN: Record<QuoteServiceId, Pick<QuoteService, 'label' | 'hint' | 'size' | 'access'>> = {
  prive: {
    label: 'Home removal',
    hint: 'Flat, house, villa',
    size: { label: 'How big is the property?', short: 'Property', options: LOGEMENT_SIZES_EN },
    access: ACCESS_EN,
  },
  entreprise: {
    label: 'Business',
    hint: 'Offices and shops',
    size: { label: 'How many workstations?', short: 'Workstations', options: ['Up to 10', '10 to 30', '30 to 80', 'More than 80'] },
    access: ACCESS_EN,
  },
  debarras: {
    label: 'House clearance',
    hint: 'Home, cellar or attic',
    size: { label: 'What needs clearing?', short: 'To clear', options: ['One room', 'Cellar or attic', 'Flat', 'House'] },
    access: ACCESS_EN,
  },
  nettoyage: {
    label: 'Cleaning',
    hint: 'End of tenancy, key handover',
    size: { label: 'How big is the property?', short: 'Property', options: LOGEMENT_SIZES_EN },
  },
  'garde-meubles': {
    label: 'Storage',
    hint: 'Short or long term',
    size: { label: 'What needs storing?', short: 'Volume', options: ['A few boxes', 'A studio', 'A flat', 'A house'] },
    access: { label: 'For how long?', short: 'Duration', options: ['≤ 1 month', '1 to 6 months', '6 months +'] },
  },
};

/** O serviço com textos no idioma pedido (ícone, id, página e e-mail não mudam). */
export const localizeQuoteService = (s: QuoteService, lang: 'fr' | 'en'): QuoteService =>
  lang === 'fr' ? s : { ...s, ...EN[s.id] };
