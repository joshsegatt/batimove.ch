import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
  BATIMOVE_WHATSAPP,
  QUOTE_SERVICES,
  QuoteDetailQuestion,
  QuoteServiceId,
  getQuoteService,
  localizeQuoteService,
} from '../../data/quoteServices';
import { submitServiceQuote } from '../../services/api';
import { trackGoogleAdsLeadConversion } from '../../utils/analytics';
import { LOCALE, defineCopy, useLang, type Lang } from '../../i18n';
import { WhatsappIcon } from '../WhatsAppButton';

// Wizard do orçamento: Service → Lieu et date → Détails → Coordonnées → concluído.
// O pedido vai por e-mail (EmailJS) para info@batimove.ch no envio; a tela final
// oferece o mesmo resumo pronto no WhatsApp da Batimove, em um toque do cliente.
//
// Idiomas: a tela segue o idioma da página (/en/quote em inglês), mas o e-mail
// para a Batimove sai SEMPRE em francês. Por isso o rascunho guarda as opções
// (tamanho, acesso) com o rótulo francês; o inglês é só exibição, achado pelo
// índice (as listas FR e EN têm a mesma ordem, ver data/quoteServices.ts).

const COPY = defineCopy(
  {
    steps: ['Service', 'Lieu et date', 'Détails', 'Coordonnées'],
    optional: ' (facultatif)',
    dateFlexible: 'Flexible',
    dateTbd: 'À définir',
    flexibleSuffix: ' (flexible)',
    errors: {
      fromCityRoute: 'Indiquez la ville ou le NPA de départ.',
      fromCityPlace: 'Indiquez la ville ou le NPA du logement.',
      toCity: "Indiquez la ville ou le NPA d'arrivée.",
      size: 'Choisissez une option pour continuer.',
      name: 'Indiquez votre nom.',
      phone: 'Indiquez un numéro de téléphone complet, par ex. 079 123 45 67.',
      email: 'Cette adresse e-mail semble incomplète. Vérifiez-la ou laissez le champ vide.',
    },
    summary: {
      service: 'Prestation',
      route: 'Trajet',
      address: 'Adresse',
      date: 'Date',
      details: 'Précisions',
    },
    whatsapp: {
      intro: "Bonjour Batimove, je viens d'envoyer une demande de devis sur batimove.ch :",
      sep: ' : ',
      name: 'Nom',
      phone: 'Téléphone',
      email: 'E-mail',
    },
    done: {
      title: 'Demande envoyée',
      thanks: (firstName: string) => `Merci ${firstName}. Nous vous rappelons au`,
      within: 'sous 30\u00a0min (8h-19h).',
      emailLabel: 'E-mail',
      emailSent: ' : demande transmise à Batimove',
      colon: ' :',
      waOpened: 'résumé ouvert, appuyez sur Envoyer dans WhatsApp',
      waOptional: 'facultatif, en un clic ci-dessous',
      reopen: 'Rouvrir WhatsApp',
      alsoSend: 'Envoyer aussi sur WhatsApp',
      ready: "Le résumé est déjà rédigé\u00a0: il ne reste qu'à appuyer sur Envoyer.",
      home: "Retour à l'accueil",
    },
    progress: {
      step: 'Étape',
      of: 'sur',
      label: 'Progression de la demande',
      doneEdit: ' (terminé, modifier)',
    },
    step0: { title: 'Quel est votre projet\u00a0?' },
    step1: {
      titleRoute: "D'où partez-vous, et vers où\u00a0?",
      titlePlace: 'Où se trouve le logement\u00a0?',
      change: 'Modifier',
      from: 'Départ',
      cityOrNpa: 'Ville ou NPA',
      placeholderPlace: 'Ex. 1205 Genève',
      to: 'Arrivée',
      date: 'Date souhaitée',
      flexible: 'Mes dates sont flexibles',
    },
    step2: {
      title: 'Quelques détails',
      lead: 'Pour un devis juste du premier coup.',
      details: 'Précisions',
      detailsPlaceholder: 'Étage, objets lourds ou fragiles, piano, accès difficile…',
    },
    step3: {
      title: 'Où vous envoyer le devis\u00a0?',
      lead: 'Réponse sous 30\u00a0min (8h-19h), gratuite et sans engagement.',
      failA: "L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez, ou",
      failLink: 'envoyez votre demande sur WhatsApp',
      failB: 'ou appelez le',
      name: 'Nom et prénom',
      namePlaceholder: 'Ex. Marc Dupont',
      phone: 'Téléphone',
      email: 'E-mail',
      emailPlaceholder: 'vous@exemple.ch',
      alsoWhatsApp: 'Envoyer aussi sur WhatsApp',
      alsoWhatsAppHint: "Votre résumé s'ouvre prêt à envoyer, pour une réponse encore plus rapide.",
      privacy: 'Vos données servent uniquement à établir votre devis.',
      privacyLink: 'Protection des données',
    },
    nav: {
      back: 'Retour',
      next: 'Continuer',
      sending: 'Envoi en cours…',
      submit: 'Envoyer ma demande',
    },
  },
  {
    steps: ['Service', 'Location and date', 'Details', 'Contact details'],
    optional: ' (optional)',
    dateFlexible: 'Flexible',
    dateTbd: 'To be confirmed',
    flexibleSuffix: ' (flexible)',
    errors: {
      fromCityRoute: 'Enter the town or postcode you are moving from.',
      fromCityPlace: 'Enter the town or postcode of the property.',
      toCity: 'Enter the town or postcode you are moving to.',
      size: 'Choose an option to continue.',
      name: 'Enter your name.',
      phone: 'Enter a full phone number, e.g. 079 123 45 67.',
      email: 'This email address looks incomplete. Check it or leave the field blank.',
    },
    summary: {
      service: 'Service',
      route: 'Route',
      address: 'Address',
      date: 'Date',
      details: 'Additional details',
    },
    whatsapp: {
      intro: "Hello Batimove, I've just sent a quote request on batimove.ch:",
      sep: ': ',
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
    },
    done: {
      title: 'Request sent',
      thanks: (firstName: string) => `Thank you, ${firstName}. We'll call you back on`,
      within: 'within 30\u00a0min (8am–7pm).',
      emailLabel: 'Email',
      emailSent: ': request sent to Batimove',
      colon: ':',
      waOpened: 'summary open, tap Send in WhatsApp',
      waOptional: 'optional, one click below',
      reopen: 'Reopen WhatsApp',
      alsoSend: 'Also send on WhatsApp',
      ready: 'The summary is already written: all you need to do is tap Send.',
      home: 'Back to the home page',
    },
    progress: {
      step: 'Step',
      of: 'of',
      label: 'Request progress',
      doneEdit: ' (done, edit)',
    },
    step0: { title: 'What is your project?' },
    step1: {
      titleRoute: 'Where are you moving from, and to?',
      titlePlace: 'Where is the property?',
      change: 'Change',
      from: 'From',
      cityOrNpa: 'Town or postcode',
      placeholderPlace: 'E.g. 1205 Genève',
      to: 'To',
      date: 'Preferred date',
      flexible: 'My dates are flexible',
    },
    step2: {
      title: 'A few details',
      lead: 'So we can get your quote right first time.',
      details: 'Additional details',
      detailsPlaceholder: 'Floor, heavy or fragile items, piano, difficult access…',
    },
    step3: {
      title: 'Where should we send your quote?',
      lead: 'Reply within 30\u00a0min (8am–7pm), free and with no obligation.',
      failA: "Your request couldn't be sent. Check your connection and try again, or",
      failLink: 'send your request on WhatsApp',
      failB: 'or call',
      name: 'Full name',
      namePlaceholder: 'E.g. John Smith',
      phone: 'Phone',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      alsoWhatsApp: 'Also send on WhatsApp',
      alsoWhatsAppHint: 'Your summary opens ready to send, for an even faster reply.',
      privacy: 'Your details are used only to prepare your quote.',
      privacyLink: 'Privacy policy',
    },
    nav: {
      back: 'Back',
      next: 'Continue',
      sending: 'Sending…',
      submit: 'Send my request',
    },
  }
);

type ErrorCode = keyof (typeof COPY)['fr']['errors'];

/** Nome do serviço no resumo em inglês (o e-mail usa sempre `emailName`, em francês). */
const SERVICE_NAME_EN: Record<QuoteServiceId, string> = {
  prive: 'Home removal',
  entreprise: 'Business and office relocation',
  debarras: 'House clearance',
  nettoyage: 'End of tenancy cleaning',
  'garde-meubles': 'Storage',
};

const STORAGE_KEY = 'batimove.quote.v1';

interface Draft {
  serviceId: QuoteServiceId | null;
  fromCity: string;
  toCity: string;
  date: string;
  flexible: boolean;
  /** Sempre o rótulo francês da opção (vai assim para o e-mail) */
  size: string;
  /** Idem */
  access: string;
  details: string;
  name: string;
  phone: string;
  email: string;
}

const EMPTY_DRAFT: Draft = {
  serviceId: null,
  fromCity: '',
  toCity: '',
  date: '',
  flexible: false,
  size: '',
  access: '',
  details: '',
  name: '',
  phone: '',
  email: '',
};

/** Erros guardam o código, não o texto: trocar de idioma no meio não deixa mensagem no idioma antigo. */
type Errors = Partial<Record<keyof Draft, ErrorCode>>;

// --- Opções FR <-> EN pelo índice (mesma ordem nas duas listas) ---
type OptionKind = 'size' | 'access';

const optionLists = (id: QuoteServiceId, kind: OptionKind): Record<Lang, string[]> => {
  const fr = getQuoteService(id);
  const en = localizeQuoteService(fr, 'en');
  return { fr: fr[kind]?.options ?? [], en: en[kind]?.options ?? [] };
};

/**
 * Rótulo da opção no idioma pedido. Aceita o valor em francês ou em inglês;
 * um valor que não existe na lista volta como está (nunca quebra).
 */
const optionIn = (id: QuoteServiceId | null, kind: OptionKind, value: string, lang: Lang): string => {
  if (!id || !value) return value;
  const lists = optionLists(id, kind);
  let i = lists.fr.indexOf(value);
  if (i < 0) i = lists.en.indexOf(value);
  return i >= 0 ? (lists[lang][i] ?? value) : value;
};

/** Rascunho com as opções no rótulo francês, o formato guardado. */
const withFrenchOptions = (draft: Draft): Draft => ({
  ...draft,
  size: optionIn(draft.serviceId, 'size', draft.size, 'fr'),
  access: optionIn(draft.serviceId, 'access', draft.access, 'fr'),
});

// --- Rascunho na sessão: quem volta da Home ou recarrega não perde o que digitou ---
const readStored = (): { draft: Draft; step: number } | null => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { draft: withFrenchOptions({ ...EMPTY_DRAFT, ...parsed.draft }), step: Number(parsed.step) || 0 };
  } catch {
    return null;
  }
};

const writeStored = (draft: Draft, step: number) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ draft, step }));
  } catch {
    /* navegação privada ou armazenamento bloqueado: o wizard funciona sem */
  }
};

const clearStored = () => {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* idem */
  }
};

const initialState = (urlService: QuoteServiceId | null): { draft: Draft; step: number } => {
  const stored = typeof window !== 'undefined' ? readStored() : null;
  if (urlService) {
    // Veio do seletor da Home: o serviço já está escolhido, começa no "Lieu et date".
    if (stored && stored.draft.serviceId === urlService) {
      return { draft: stored.draft, step: Math.max(1, Math.min(stored.step, 3)) };
    }
    return { draft: { ...EMPTY_DRAFT, ...(stored?.draft ?? {}), serviceId: urlService, size: '', access: '' }, step: 1 };
  }
  if (stored?.draft.serviceId) return { draft: stored.draft, step: Math.min(stored.step, 3) };
  return { draft: EMPTY_DRAFT, step: 0 };
};

// --- Formatação ---
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDate = (iso: string, flexible: boolean, lang: Lang) => {
  const c = COPY[lang];
  if (!iso) return flexible ? c.dateFlexible : c.dateTbd;
  const [y, m, d] = iso.split('-').map(Number);
  const label = new Date(y, m - 1, d).toLocaleDateString(LOCALE[lang], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return flexible ? `${label}${c.flexibleSuffix}` : label;
};

const digitsOf = (value: string) => value.replace(/\D/g, '');

// --- Validação por etapa ---
const validate = (step: number, draft: Draft): Errors => {
  const errors: Errors = {};
  const service = draft.serviceId ? getQuoteService(draft.serviceId) : null;
  if (step === 1 && service) {
    if (!draft.fromCity.trim()) {
      errors.fromCity = service.hasRoute ? 'fromCityRoute' : 'fromCityPlace';
    }
    if (service.hasRoute && !draft.toCity.trim()) errors.toCity = 'toCity';
  }
  if (step === 2 && !draft.size) errors.size = 'size';
  if (step === 3) {
    if (!draft.name.trim()) errors.name = 'name';
    if (digitsOf(draft.phone).length < 9) errors.phone = 'phone';
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      errors.email = 'email';
    }
  }
  return errors;
};

// --- Resumo compartilhado por e-mail, WhatsApp e tela final ---
// O e-mail chama com 'fr' (sempre francês); tela final e WhatsApp, com o idioma do cliente.
type SummaryKey = 'service' | 'route' | 'address' | 'date' | 'size' | 'access' | 'details';

const buildSummary = (draft: Draft, lang: Lang) => {
  const base = getQuoteService(draft.serviceId ?? 'prive');
  const service = localizeQuoteService(base, lang);
  const t = COPY[lang].summary;
  const rows: { key: SummaryKey; label: string; value: string }[] = [
    { key: 'service', label: t.service, value: lang === 'fr' ? base.emailName : SERVICE_NAME_EN[base.id] },
    service.hasRoute
      ? { key: 'route', label: t.route, value: `${draft.fromCity.trim()} → ${draft.toCity.trim()}` }
      : { key: 'address', label: t.address, value: draft.fromCity.trim() },
    { key: 'date', label: t.date, value: formatDate(draft.date, draft.flexible, lang) },
    { key: 'size', label: service.size.short, value: optionIn(base.id, 'size', draft.size, lang) },
  ];
  if (service.access && draft.access) {
    rows.push({ key: 'access', label: service.access.short, value: optionIn(base.id, 'access', draft.access, lang) });
  }
  if (draft.details.trim()) rows.push({ key: 'details', label: t.details, value: draft.details.trim() });
  return { service, rows };
};

/** Mensagem que o CLIENTE manda à Batimove: no idioma dele. */
const buildWhatsAppUrl = (draft: Draft, lang: Lang) => {
  const { rows } = buildSummary(draft, lang);
  const t = COPY[lang].whatsapp;
  const text = [
    t.intro,
    ...rows.map((r) => `• ${r.label}${t.sep}${r.value}`),
    `• ${t.name}${t.sep}${draft.name.trim()}`,
    `• ${t.phone}${t.sep}${draft.phone.trim()}`,
    draft.email.trim() ? `• ${t.email}${t.sep}${draft.email.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  return `https://wa.me/${BATIMOVE_WHATSAPP}?text=${encodeURIComponent(text)}`;
};

// --- Peças de UI ---
const inputClass = (hasError: boolean) =>
  `h-12 w-full rounded-lg border bg-white px-4 text-lg text-[#0B1E33] placeholder:text-slate-500 outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/25 ${
    hasError ? 'border-red-600' : 'border-slate-300 hover:border-slate-400'
  }`;

const Field: React.FC<{
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ id, label, optional, error, children }) => {
  const { lang } = useLang();
  return (
    <div>
      <label htmlFor={id} className="block text-base font-semibold text-[#0B1E33] mb-1.5">
        {label}
        {optional && <span className="font-normal text-slate-500">{COPY[lang].optional}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
};

/** " (facultatif)" / " (optional)" no idioma da página. */
const OptionalMark: React.FC<{ className: string }> = ({ className }) => {
  const { lang } = useLang();
  return <span className={className}>{COPY[lang].optional}</span>;
};

// Controle segmentado (estilo iOS) para escolhas curtas e opcionais, como o acesso.
const SegmentedGroup: React.FC<{
  name: string;
  question: QuoteDetailQuestion;
  value: string;
  onChange: (value: string) => void;
}> = ({ name, question, value, onChange }) => (
  <fieldset>
    <legend className="text-lg font-semibold tracking-tight text-[#0B1E33]">
      {question.label}
      <OptionalMark className="text-base font-normal text-slate-500" />
    </legend>
    <div
      className="mt-3 grid gap-1 rounded-xl bg-slate-100 p-1"
      style={{ gridTemplateColumns: `repeat(${question.options.length}, minmax(0, 1fr))` }}
    >
      {question.options.map((option) => {
        const checked = value === option;
        return (
          <label key={option} className="relative">
            <input
              type="radio"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span
              className={`flex h-11 cursor-pointer items-center justify-center rounded-lg px-2 text-center text-base font-semibold transition-[background-color,color,box-shadow] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-[#0284c7] ${
                checked
                  ? 'bg-white text-[#0B1E33] shadow-rest'
                  : 'text-slate-600 hover:text-[#0B1E33]'
              }`}
            >
              {option}
            </span>
          </label>
        );
      })}
    </div>
  </fieldset>
);

const OptionGroup: React.FC<{
  name: string;
  question: QuoteDetailQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
}> = ({ name, question, value, onChange, error, optional }) => (
  <fieldset aria-describedby={error ? `${name}-error` : undefined}>
    <legend className="text-lg font-semibold tracking-tight text-[#0B1E33]">
      {question.label}
      {optional && <OptionalMark className="text-base font-normal text-slate-500" />}
    </legend>
    <div className="mt-3 grid grid-cols-2 gap-2.5">
      {question.options.map((option) => {
        const checked = value === option;
        return (
          <label key={option} className="relative">
            <input
              type="radio"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span
              className={`flex min-h-[56px] cursor-pointer items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3 text-base font-semibold text-[#0B1E33] transition-[border-color,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0284c7] ${
                checked
                  ? 'border-[#0B1E33] bg-slate-50 shadow-[inset_0_0_0_1px_#0B1E33]'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{option}</span>
              <span
                aria-hidden="true"
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors duration-150 ${
                  checked ? 'bg-[#0B1E33] text-white' : 'border border-slate-300'
                }`}
              >
                {checked && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </span>
          </label>
        );
      })}
    </div>
    {error && (
      <p id={`${name}-error`} className="mt-2 text-sm text-red-700">
        {error}
      </p>
    )}
  </fieldset>
);

// --- Wizard ---
export const QuoteWizard: React.FC<{
  urlService: QuoteServiceId | null;
  initialFrom?: string;
  initialTo?: string;
  /** Opção de tamanho vinda das páginas de serviço (/quote?type=…&size=…) */
  initialSize?: string;
  /** Sombra mais forte, para o wizard pousado sobre uma foto (páginas de serviço) */
  elevated?: boolean;
}> = ({ urlService, initialFrom, initialTo, initialSize, elevated }) => {
  const reduceMotion = useReducedMotion();
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const [{ draft, step }, setState] = useState(() => {
    const init = initialState(urlService);
    // A cidade da página (local ou ?from=) vence o rascunho salvo: quem passa de
    // /debarras-lausanne para /debarras-geneve não pode ver "Lausanne" no campo.
    if (initialFrom) init.draft = { ...init.draft, fromCity: initialFrom };
    if (initialTo && !init.draft.toCity) init.draft = { ...init.draft, toCity: initialTo };
    // Só aceita um tamanho que exista para o serviço escolhido (rótulo FR ou EN; guarda o FR).
    if (initialSize && urlService) {
      const size = optionIn(urlService, 'size', initialSize, 'fr');
      if (getQuoteService(urlService).size.options.includes(size)) init.draft = { ...init.draft, size };
    }
    return init;
  });
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [sent, setSent] = useState<Draft | null>(null);
  // WhatsApp junto com o envio: abre no mesmo clique (fora do clique o navegador bloqueia).
  const [alsoWhatsApp, setAlsoWhatsApp] = useState(true);
  const [whatsAppOpened, setWhatsAppOpened] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasNavigated = useRef(false);

  const service = draft.serviceId ? localizeQuoteService(getQuoteService(draft.serviceId), lang) : null;

  useEffect(() => {
    if (!sent) writeStored(draft, step);
  }, [draft, step, sent]);

  // Depois de cada troca de etapa, o foco vai para o título da etapa (leitor de tela
  // e teclado sabem onde estão) e o cartão volta ao topo da tela no celular.
  useEffect(() => {
    if (!hasNavigated.current) return;
    headingRef.current?.focus({ preventScroll: true });
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80) cardRef.current?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [step, sent, reduceMotion]);

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setState((s) => ({ ...s, draft: { ...s.draft, [key]: value } }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (submitError) setSubmitError(false);
  };

  const goTo = (next: number) => {
    hasNavigated.current = true;
    setDirection(next > step ? 1 : -1);
    setErrors({});
    setState((s) => ({ ...s, step: next }));
  };

  const chooseService = (id: QuoteServiceId) => {
    hasNavigated.current = true;
    setDirection(1);
    setErrors({});
    setState((s) => ({
      step: 1,
      draft: s.draft.serviceId === id ? s.draft : { ...s.draft, serviceId: id, size: '', access: '' },
    }));
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError(false);
    // E-mail para a Batimove: sempre em francês, seja qual for o idioma da página.
    const { service: s, rows } = buildSummary(draft, 'fr');
    try {
      await submitServiceQuote({
        serviceName: s.emailName,
        clientName: draft.name.trim(),
        clientEmail: draft.email.trim() || 'Non renseigné',
        clientPhone: draft.phone.trim(),
        date: formatDate(draft.date, draft.flexible, 'fr'),
        fromCity: draft.fromCity.trim(),
        toCity: s.hasRoute ? draft.toCity.trim() : '',
        details: rows
          .filter((r) => !['service', 'route', 'address', 'date'].includes(r.key))
          .map((r) => `${r.label}: ${r.value}`)
          .join(' · '),
        source: 'le formulaire de devis en 4 étapes',
        // Acrescenta "Langue du client : anglais" ao e-mail quando vem de /en.
        clientLang: lang,
      });
      trackGoogleAdsLeadConversion({ leadId: crypto.randomUUID() });
      clearStored();
      hasNavigated.current = true;
      setSent(draft);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const found = validate(step, draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Leva o foco ao primeiro campo com problema.
      const first = Object.keys(found)[0];
      requestAnimationFrame(() => {
        const el = document.getElementById(`quote-${first}`) || document.querySelector<HTMLInputElement>(`input[name="quote-${first}"]`);
        el?.focus();
      });
      return;
    }
    if (step < 3) {
      goTo(step + 1);
      return;
    }
    // O e-mail parte primeiro; o WhatsApp abre no mesmo gesto com o resumo pronto.
    // Numa nova tentativa (e-mail falhou), o WhatsApp não abre de novo.
    void submit();
    if (alsoWhatsApp && !whatsAppOpened) {
      window.open(buildWhatsAppUrl(draft, lang), '_blank', 'noopener,noreferrer');
      setWhatsAppOpened(true);
    }
  };

  const shadowClass = elevated
    ? 'shadow-modal'
    : 'shadow-rest';

  // Animação de entrada só depois de uma navegação (no primeiro carregamento a etapa já aparece pronta).
  const enterClass = hasNavigated.current ? (direction > 0 ? 'wizard-in-next' : 'wizard-in-prev') : '';

  const errorProps = (key: keyof Draft) =>
    errors[key] ? { 'aria-invalid': true, 'aria-describedby': `quote-${key}-error` } : {};

  // ---------- Tela final ----------
  if (sent) {
    const { rows } = buildSummary(sent, lang);
    const firstName = sent.name.trim().split(/\s+/)[0];
    return (
      <div ref={cardRef} className={`scroll-mt-28 rounded-xl border border-slate-200 bg-white ${shadowClass}`}>
        <div className="wizard-in-up px-5 py-10 sm:px-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#0B1E33] text-white">
            <Check className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-5 font-display text-3xl font-medium tracking-tight text-[#0B1E33] outline-none"
          >
            {c.done.title}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-lg leading-relaxed text-slate-600">
            {c.done.thanks(firstName)}{' '}
            <span className="font-semibold text-[#0B1E33] tabular-nums whitespace-nowrap">{sent.phone.trim()}</span>{' '}
            {c.done.within}
          </p>

          <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
            <li className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0B1E33] text-white">
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="text-base text-[#0B1E33]">
                <span className="font-semibold">{c.done.emailLabel}</span>{c.done.emailSent}
              </span>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                  whatsAppOpened ? 'bg-[#075E54] text-white' : 'border border-slate-300 text-slate-400'
                }`}
              >
                <WhatsappIcon className="h-4 w-4" />
              </span>
              <span className="text-base text-[#0B1E33]">
                <span className="font-semibold">WhatsApp</span>{c.done.colon}{' '}
                {whatsAppOpened ? c.done.waOpened : c.done.waOptional}
              </span>
            </li>
          </ul>

          <dl className="mx-auto mt-6 max-w-md divide-y divide-slate-200 rounded-xl border border-slate-200 text-left">
            {rows.map((r) => (
              <div key={r.key} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="text-base text-slate-500 shrink-0">{r.label}</dt>
                <dd className="text-base font-semibold text-[#0B1E33] text-right">{r.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mx-auto mt-8 max-w-md">
            <a
              href={buildWhatsAppUrl(sent, lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#075E54] px-6 text-lg font-semibold text-white transition-colors duration-150 hover:bg-[#064A42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
            >
              <WhatsappIcon className="h-5 w-5" />
              {whatsAppOpened ? c.done.reopen : c.done.alsoSend}
            </a>
            <p className="mt-2.5 text-sm text-slate-500">
              {c.done.ready}
            </p>
            <Link
              to={lp('/')}
              className="mt-6 inline-block text-base font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors duration-150 hover:decoration-[#0B1E33]"
            >
              {c.done.home}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Etapas ----------
  return (
    <div
      ref={cardRef}
      className={`scroll-mt-28 overflow-hidden rounded-xl border border-slate-200 bg-white ${shadowClass}`}
    >
      {/* Progresso */}
      <div className="px-5 pt-5 sm:px-8 sm:pt-7">
        <p className="text-sm font-semibold text-slate-600">
          {c.progress.step} <span className="tabular-nums">{step + 1}</span> {c.progress.of} <span className="tabular-nums">{c.steps.length}</span>
        </p>
        <ol className="mt-3 grid grid-cols-4 gap-1.5" aria-label={c.progress.label}>
          {c.steps.map((label, i) => {
            const isDone = i < step;
            const isCurrent = i === step;
            return (
              <li key={label} aria-current={isCurrent ? 'step' : undefined}>
                <span className="block h-1 overflow-hidden rounded-full bg-slate-200">
                  <span
                    className={`block h-full rounded-full bg-[#0B1E33] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isDone || isCurrent ? 'w-full' : 'w-0'
                    }`}
                  />
                </span>
                {isDone ? (
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className="mt-2 hidden text-left text-sm font-medium text-slate-600 underline-offset-4 hover:text-[#0B1E33] hover:underline sm:block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] rounded"
                  >
                    {label}
                    <span className="sr-only">{c.progress.doneEdit}</span>
                  </button>
                ) : (
                  <span className={`mt-2 hidden text-sm sm:block ${isCurrent ? 'font-semibold text-[#0B1E33]' : 'text-slate-500'}`}>
                    {label}
                  </span>
                )}
                {!isDone && <span className="sr-only sm:hidden">{label}</span>}
              </li>
            );
          })}
        </ol>
      </div>

      <form onSubmit={handleNext} noValidate>
        <div className="relative px-5 pb-6 pt-6 sm:px-8 sm:pb-8">
          <div key={step} className={enterClass}>
              {/* Etapa 1: serviço */}
              {step === 0 && (
                <>
                  <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-medium tracking-tight text-[#0B1E33] outline-none">
                    {c.step0.title}
                  </h2>
                  <ul className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                    {QUOTE_SERVICES.map((s) => localizeQuoteService(s, lang)).map(({ id, label, hint, icon: Icon }, i) => {
                      const selected = draft.serviceId === id;
                      return (
                        <li key={id} className="relative">
                          {i > 0 && (
                            <span aria-hidden="true" className="pointer-events-none absolute left-[76px] right-0 top-0 h-px bg-slate-200 sm:left-[80px]" />
                          )}
                          <button
                            type="button"
                            onClick={() => chooseService(id)}
                            aria-current={selected ? 'true' : undefined}
                            className="group flex min-h-[72px] w-full items-center gap-4 bg-white px-4 py-3.5 text-left transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-slate-50 active:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284c7] sm:px-5"
                          >
                            <span
                              className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-colors duration-150 group-hover:bg-[#0B1E33] group-hover:text-white group-focus-visible:bg-[#0B1E33] group-focus-visible:text-white ${
                                selected ? 'bg-[#0B1E33] text-white' : 'bg-slate-100 text-[#0B1E33]'
                              }`}
                            >
                              <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-display text-lg font-semibold leading-snug tracking-tight text-[#0B1E33]">{label}</span>
                              <span className="mt-0.5 block text-sm leading-snug text-slate-500">{hint}</span>
                            </span>
                            {selected ? (
                              <Check className="h-5 w-5 shrink-0 text-[#0B1E33]" strokeWidth={2.5} aria-hidden="true" />
                            ) : (
                              <ChevronRight
                                className="h-[18px] w-[18px] shrink-0 text-slate-300 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-[#0B1E33] motion-reduce:transition-none"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {/* Etapa 2: lugar e data */}
              {step === 1 && service && (
                <>
                  <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-medium tracking-tight text-[#0B1E33] outline-none">
                    {service.hasRoute ? c.step1.titleRoute : c.step1.titlePlace}
                  </h2>
                  <p className="mt-1.5 text-base text-slate-600">
                    {service.label} · <button type="button" onClick={() => goTo(0)} className="font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 hover:decoration-[#0B1E33]">{c.step1.change}</button>
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field
                      id="quote-fromCity"
                      label={service.hasRoute ? c.step1.from : c.step1.cityOrNpa}
                      error={errors.fromCity && c.errors[errors.fromCity]}
                    >
                      <input
                        id="quote-fromCity"
                        type="text"
                        autoComplete="address-level2"
                        placeholder={service.hasRoute ? c.step1.cityOrNpa : c.step1.placeholderPlace}
                        value={draft.fromCity}
                        onChange={(e) => update('fromCity', e.target.value)}
                        className={inputClass(!!errors.fromCity)}
                        {...errorProps('fromCity')}
                      />
                    </Field>
                    {service.hasRoute && (
                      <Field id="quote-toCity" label={c.step1.to} error={errors.toCity && c.errors[errors.toCity]}>
                        <input
                          id="quote-toCity"
                          type="text"
                          placeholder={c.step1.cityOrNpa}
                          value={draft.toCity}
                          onChange={(e) => update('toCity', e.target.value)}
                          className={inputClass(!!errors.toCity)}
                          {...errorProps('toCity')}
                        />
                      </Field>
                    )}
                    <Field id="quote-date" label={c.step1.date} optional>
                      <input
                        id="quote-date"
                        type="date"
                        min={todayIso()}
                        value={draft.date}
                        onChange={(e) => update('date', e.target.value)}
                        className={`${inputClass(false)} tabular-nums`}
                      />
                    </Field>
                    <label className="flex min-h-[48px] cursor-pointer items-center gap-3 self-end text-base text-[#0B1E33] sm:pb-0.5">
                      <input
                        type="checkbox"
                        checked={draft.flexible}
                        onChange={(e) => update('flexible', e.target.checked)}
                        className="h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 accent-[#0B1E33]"
                      />
                      {c.step1.flexible}
                    </label>
                  </div>
                </>
              )}

              {/* Etapa 3: detalhes */}
              {step === 2 && service && (
                <>
                  <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-medium tracking-tight text-[#0B1E33] outline-none">
                    {c.step2.title}
                  </h2>
                  <p className="mt-1.5 text-base text-slate-600">{c.step2.lead}</p>
                  <div className="mt-6 space-y-7">
                    <OptionGroup
                      name="quote-size"
                      question={service.size}
                      value={optionIn(service.id, 'size', draft.size, lang)}
                      onChange={(v) => update('size', optionIn(service.id, 'size', v, 'fr'))}
                      error={errors.size && c.errors[errors.size]}
                    />
                    {service.access && (
                      <SegmentedGroup
                        name="quote-access"
                        question={service.access}
                        value={optionIn(service.id, 'access', draft.access, lang)}
                        onChange={(v) => update('access', optionIn(service.id, 'access', v, 'fr'))}
                      />
                    )}
                    <Field id="quote-details" label={c.step2.details} optional>
                      <textarea
                        id="quote-details"
                        rows={3}
                        placeholder={c.step2.detailsPlaceholder}
                        value={draft.details}
                        onChange={(e) => update('details', e.target.value)}
                        className={`${inputClass(false)} h-auto min-h-[96px] resize-y py-3 leading-relaxed`}
                      />
                    </Field>
                  </div>
                </>
              )}

              {/* Etapa 4: contato */}
              {step === 3 && service && (
                <>
                  <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-medium tracking-tight text-[#0B1E33] outline-none">
                    {c.step3.title}
                  </h2>
                  <p className="mt-1.5 text-base text-slate-600">{c.step3.lead}</p>

                  {submitError && (
                    <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-800">
                      {c.step3.failA}{' '}
                      <a href={buildWhatsAppUrl(draft, lang)} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                        {c.step3.failLink}
                      </a>{' '}
                      {c.step3.failB}{' '}
                      <a href="tel:0800825925" className="font-semibold underline underline-offset-2 whitespace-nowrap">
                        0800 825 925
                      </a>
                      .
                    </div>
                  )}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field id="quote-name" label={c.step3.name} error={errors.name && c.errors[errors.name]}>
                        <input
                          id="quote-name"
                          type="text"
                          autoComplete="name"
                          placeholder={c.step3.namePlaceholder}
                          value={draft.name}
                          onChange={(e) => update('name', e.target.value)}
                          className={inputClass(!!errors.name)}
                          {...errorProps('name')}
                        />
                      </Field>
                    </div>
                    <Field id="quote-phone" label={c.step3.phone} error={errors.phone && c.errors[errors.phone]}>
                      <input
                        id="quote-phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="079 123 45 67"
                        value={draft.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className={`${inputClass(!!errors.phone)} tabular-nums`}
                        {...errorProps('phone')}
                      />
                    </Field>
                    <Field id="quote-email" label={c.step3.email} optional error={errors.email && c.errors[errors.email]}>
                      <input
                        id="quote-email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder={c.step3.emailPlaceholder}
                        value={draft.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={inputClass(!!errors.email)}
                        {...errorProps('email')}
                      />
                    </Field>
                  </div>
                  <label className="mt-5 flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-base text-[#0B1E33] transition-colors hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={alsoWhatsApp}
                      onChange={(e) => setAlsoWhatsApp(e.target.checked)}
                      className="h-5 w-5 shrink-0 cursor-pointer accent-[#075E54]"
                    />
                    <WhatsappIcon className="h-5 w-5 shrink-0 text-[#075E54]" />
                    <span>
                      <span className="font-semibold">{c.step3.alsoWhatsApp}</span>
                      <span className="block text-sm text-slate-500">{c.step3.alsoWhatsAppHint}</span>
                    </span>
                  </label>
                  <p className="mt-4 text-sm text-slate-500">
                    {c.step3.privacy}{' '}
                    <Link to={lp('/privacy')} className="underline underline-offset-2 hover:text-[#0B1E33]">
                      {c.step3.privacyLink}
                    </Link>
                  </p>
                </>
              )}
          </div>
        </div>

        {/* Navegação */}
        {step > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              disabled={submitting}
              className="btn btn-lg btn-ghost -ml-3 gap-1 px-3 text-slate-600"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              {c.nav.back}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-lg btn-primary disabled:cursor-wait"
            >
              {step < 3 ? (
                <>
                  {c.nav.next}
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  {c.nav.sending}
                </>
              ) : (
                c.nav.submit
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuoteWizard;
