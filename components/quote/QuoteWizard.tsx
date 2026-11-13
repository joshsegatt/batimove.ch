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
} from '../../data/quoteServices';
import { submitServiceQuote } from '../../services/api';
import { trackGoogleAdsLeadConversion } from '../../utils/analytics';
import { WhatsappIcon } from '../WhatsAppButton';

// Wizard do orçamento: Service → Lieu et date → Détails → Coordonnées → concluído.
// O pedido vai por e-mail (EmailJS) para info@batimove.ch no envio; a tela final
// oferece o mesmo resumo pronto no WhatsApp da Batimove, em um toque do cliente.

const STEPS = ['Service', 'Lieu et date', 'Détails', 'Coordonnées'] as const;
const STORAGE_KEY = 'batimove.quote.v1';

interface Draft {
  serviceId: QuoteServiceId | null;
  fromCity: string;
  toCity: string;
  date: string;
  flexible: boolean;
  size: string;
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

type Errors = Partial<Record<keyof Draft, string>>;

// --- Rascunho na sessão: quem volta da Home ou recarrega não perde o que digitou ---
const readStored = (): { draft: Draft; step: number } | null => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { draft: { ...EMPTY_DRAFT, ...parsed.draft }, step: Number(parsed.step) || 0 };
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

const formatDate = (iso: string, flexible: boolean) => {
  if (!iso) return flexible ? 'Flexible' : 'À définir';
  const [y, m, d] = iso.split('-').map(Number);
  const label = new Date(y, m - 1, d).toLocaleDateString('fr-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return flexible ? `${label} (flexible)` : label;
};

const digitsOf = (value: string) => value.replace(/\D/g, '');

// --- Validação por etapa ---
const validate = (step: number, draft: Draft): Errors => {
  const errors: Errors = {};
  const service = draft.serviceId ? getQuoteService(draft.serviceId) : null;
  if (step === 1 && service) {
    if (!draft.fromCity.trim()) {
      errors.fromCity = service.hasRoute
        ? 'Indiquez la ville ou le NPA de départ.'
        : 'Indiquez la ville ou le NPA du logement.';
    }
    if (service.hasRoute && !draft.toCity.trim()) errors.toCity = "Indiquez la ville ou le NPA d'arrivée.";
  }
  if (step === 2 && !draft.size) errors.size = 'Choisissez une option pour continuer.';
  if (step === 3) {
    if (!draft.name.trim()) errors.name = 'Indiquez votre nom.';
    if (digitsOf(draft.phone).length < 9) errors.phone = 'Indiquez un numéro de téléphone complet, par ex. 079 123 45 67.';
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      errors.email = "Cette adresse e-mail semble incomplète. Vérifiez-la ou laissez le champ vide.";
    }
  }
  return errors;
};

// --- Resumo compartilhado por e-mail, WhatsApp e tela final ---
const buildSummary = (draft: Draft) => {
  const service = getQuoteService(draft.serviceId ?? 'prive');
  const rows: { label: string; value: string }[] = [
    { label: 'Prestation', value: service.emailName },
    service.hasRoute
      ? { label: 'Trajet', value: `${draft.fromCity.trim()} → ${draft.toCity.trim()}` }
      : { label: 'Adresse', value: draft.fromCity.trim() },
    { label: 'Date', value: formatDate(draft.date, draft.flexible) },
    { label: service.size.short, value: draft.size },
  ];
  if (service.access && draft.access) rows.push({ label: service.access.short, value: draft.access });
  if (draft.details.trim()) rows.push({ label: 'Précisions', value: draft.details.trim() });
  return { service, rows };
};

const buildWhatsAppUrl = (draft: Draft) => {
  const { rows } = buildSummary(draft);
  const text = [
    "Bonjour Batimove, je viens d'envoyer une demande de devis sur batimove.ch :",
    ...rows.map((r) => `• ${r.label} : ${r.value}`),
    `• Nom : ${draft.name.trim()}`,
    `• Téléphone : ${draft.phone.trim()}`,
    draft.email.trim() ? `• E-mail : ${draft.email.trim()}` : '',
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
}> = ({ id, label, optional, error, children }) => (
  <div>
    <label htmlFor={id} className="block text-base font-semibold text-[#0B1E33] mb-1.5">
      {label}
      {optional && <span className="font-normal text-slate-500"> (facultatif)</span>}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
        {error}
      </p>
    )}
  </div>
);

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
      <span className="text-base font-normal text-slate-500"> (facultatif)</span>
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
                  ? 'bg-white text-[#0B1E33] shadow-[0_1px_2px_rgba(11,30,51,0.08),0_1px_1px_rgba(11,30,51,0.04)]'
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
      {optional && <span className="text-base font-normal text-slate-500"> (facultatif)</span>}
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
  const [{ draft, step }, setState] = useState(() => {
    const init = initialState(urlService);
    // A cidade da página (local ou ?from=) vence o rascunho salvo: quem passa de
    // /debarras-lausanne para /debarras-geneve não pode ver "Lausanne" no campo.
    if (initialFrom) init.draft = { ...init.draft, fromCity: initialFrom };
    if (initialTo && !init.draft.toCity) init.draft = { ...init.draft, toCity: initialTo };
    // Só aceita um tamanho que exista para o serviço escolhido.
    if (initialSize && urlService && getQuoteService(urlService).size.options.includes(initialSize)) {
      init.draft = { ...init.draft, size: initialSize };
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

  const service = draft.serviceId ? getQuoteService(draft.serviceId) : null;

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
    const { service: s, rows } = buildSummary(draft);
    try {
      await submitServiceQuote({
        serviceName: s.emailName,
        clientName: draft.name.trim(),
        clientEmail: draft.email.trim() || 'Non renseigné',
        clientPhone: draft.phone.trim(),
        date: formatDate(draft.date, draft.flexible),
        fromCity: draft.fromCity.trim(),
        toCity: s.hasRoute ? draft.toCity.trim() : '',
        details: rows
          .filter((r) => !['Prestation', 'Trajet', 'Adresse', 'Date'].includes(r.label))
          .map((r) => `${r.label}: ${r.value}`)
          .join(' · '),
        source: 'le formulaire de devis en 4 étapes',
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
      window.open(buildWhatsAppUrl(draft), '_blank', 'noopener,noreferrer');
      setWhatsAppOpened(true);
    }
  };

  const shadowClass = elevated
    ? 'shadow-[0_24px_48px_-20px_rgba(0,0,0,0.45)]'
    : 'shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]';

  // Animação de entrada só depois de uma navegação (no primeiro carregamento a etapa já aparece pronta).
  const enterClass = hasNavigated.current ? (direction > 0 ? 'wizard-in-next' : 'wizard-in-prev') : '';

  const errorProps = (key: keyof Draft) =>
    errors[key] ? { 'aria-invalid': true, 'aria-describedby': `quote-${key}-error` } : {};

  // ---------- Tela final ----------
  if (sent) {
    const { rows } = buildSummary(sent);
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
            className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#0B1E33] outline-none"
          >
            Demande envoyée
          </h2>
          <p className="mx-auto mt-2 max-w-md text-lg leading-relaxed text-slate-600">
            Merci {firstName}. Nous vous rappelons au{' '}
            <span className="font-semibold text-[#0B1E33] tabular-nums whitespace-nowrap">{sent.phone.trim()}</span>{' '}
            sous 30&nbsp;min (8h-19h).
          </p>

          <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
            <li className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0B1E33] text-white">
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="text-base text-[#0B1E33]">
                <span className="font-semibold">E-mail</span> : demande transmise à Batimove
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
                <span className="font-semibold">WhatsApp</span> :{' '}
                {whatsAppOpened ? 'résumé ouvert, appuyez sur Envoyer dans WhatsApp' : 'facultatif, en un clic ci-dessous'}
              </span>
            </li>
          </ul>

          <dl className="mx-auto mt-6 max-w-md divide-y divide-slate-200 rounded-xl border border-slate-200 text-left">
            {rows.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="text-base text-slate-500 shrink-0">{r.label}</dt>
                <dd className="text-base font-semibold text-[#0B1E33] text-right">{r.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mx-auto mt-8 max-w-md">
            <a
              href={buildWhatsAppUrl(sent)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#075E54] px-6 text-lg font-bold text-white transition-colors duration-150 hover:bg-[#064A42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
            >
              <WhatsappIcon className="h-5 w-5" />
              {whatsAppOpened ? 'Rouvrir WhatsApp' : 'Envoyer aussi sur WhatsApp'}
            </a>
            <p className="mt-2.5 text-sm text-slate-500">
              Le résumé est déjà rédigé&nbsp;: il ne reste qu'à appuyer sur Envoyer.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block text-base font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors duration-150 hover:decoration-[#0B1E33]"
            >
              Retour à l'accueil
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
          Étape <span className="tabular-nums">{step + 1}</span> sur <span className="tabular-nums">{STEPS.length}</span>
        </p>
        <ol className="mt-3 grid grid-cols-4 gap-1.5" aria-label="Progression de la demande">
          {STEPS.map((label, i) => {
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
                    <span className="sr-only"> (terminé, modifier)</span>
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
                  <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-extrabold tracking-tight text-[#0B1E33] outline-none">
                    Quel est votre projet&nbsp;?
                  </h2>
                  <ul className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                    {QUOTE_SERVICES.map(({ id, label, hint, icon: Icon }, i) => {
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
                  <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-extrabold tracking-tight text-[#0B1E33] outline-none">
                    {service.hasRoute ? "D'où partez-vous, et vers où ?" : 'Où se trouve le logement ?'}
                  </h2>
                  <p className="mt-1.5 text-base text-slate-600">
                    {service.label} · <button type="button" onClick={() => goTo(0)} className="font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 hover:decoration-[#0B1E33]">Modifier</button>
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field
                      id="quote-fromCity"
                      label={service.hasRoute ? 'Départ' : 'Ville ou NPA'}
                      error={errors.fromCity}
                    >
                      <input
                        id="quote-fromCity"
                        type="text"
                        autoComplete="address-level2"
                        placeholder={service.hasRoute ? 'Ville ou NPA' : 'Ex. 1205 Genève'}
                        value={draft.fromCity}
                        onChange={(e) => update('fromCity', e.target.value)}
                        className={inputClass(!!errors.fromCity)}
                        {...errorProps('fromCity')}
                      />
                    </Field>
                    {service.hasRoute && (
                      <Field id="quote-toCity" label="Arrivée" error={errors.toCity}>
                        <input
                          id="quote-toCity"
                          type="text"
                          placeholder="Ville ou NPA"
                          value={draft.toCity}
                          onChange={(e) => update('toCity', e.target.value)}
                          className={inputClass(!!errors.toCity)}
                          {...errorProps('toCity')}
                        />
                      </Field>
                    )}
                    <Field id="quote-date" label="Date souhaitée" optional>
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
                      Mes dates sont flexibles
                    </label>
                  </div>
                </>
              )}

              {/* Etapa 3: detalhes */}
              {step === 2 && service && (
                <>
                  <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-extrabold tracking-tight text-[#0B1E33] outline-none">
                    Quelques détails
                  </h2>
                  <p className="mt-1.5 text-base text-slate-600">Pour un devis juste du premier coup.</p>
                  <div className="mt-6 space-y-7">
                    <OptionGroup
                      name="quote-size"
                      question={service.size}
                      value={draft.size}
                      onChange={(v) => update('size', v)}
                      error={errors.size}
                    />
                    {service.access && (
                      <SegmentedGroup
                        name="quote-access"
                        question={service.access}
                        value={draft.access}
                        onChange={(v) => update('access', v)}
                      />
                    )}
                    <Field id="quote-details" label="Précisions" optional>
                      <textarea
                        id="quote-details"
                        rows={3}
                        placeholder="Étage, objets lourds ou fragiles, piano, accès difficile…"
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
                  <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-extrabold tracking-tight text-[#0B1E33] outline-none">
                    Où vous envoyer le devis&nbsp;?
                  </h2>
                  <p className="mt-1.5 text-base text-slate-600">Réponse sous 30&nbsp;min (8h-19h), gratuite et sans engagement.</p>

                  {submitError && (
                    <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-800">
                      L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez, ou{' '}
                      <a href={buildWhatsAppUrl(draft)} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                        envoyez votre demande sur WhatsApp
                      </a>{' '}
                      ou appelez le{' '}
                      <a href="tel:0800825925" className="font-semibold underline underline-offset-2 whitespace-nowrap">
                        0800 825 925
                      </a>
                      .
                    </div>
                  )}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field id="quote-name" label="Nom et prénom" error={errors.name}>
                        <input
                          id="quote-name"
                          type="text"
                          autoComplete="name"
                          placeholder="Ex. Marc Dupont"
                          value={draft.name}
                          onChange={(e) => update('name', e.target.value)}
                          className={inputClass(!!errors.name)}
                          {...errorProps('name')}
                        />
                      </Field>
                    </div>
                    <Field id="quote-phone" label="Téléphone" error={errors.phone}>
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
                    <Field id="quote-email" label="E-mail" optional error={errors.email}>
                      <input
                        id="quote-email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="vous@exemple.ch"
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
                      <span className="font-semibold">Envoyer aussi sur WhatsApp</span>
                      <span className="block text-sm text-slate-500">Votre résumé s'ouvre prêt à envoyer, pour une réponse encore plus rapide.</span>
                    </span>
                  </label>
                  <p className="mt-4 text-sm text-slate-500">
                    Vos données servent uniquement à établir votre devis.{' '}
                    <Link to="/privacy" className="underline underline-offset-2 hover:text-[#0B1E33]">
                      Protection des données
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
              Retour
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-lg btn-primary disabled:cursor-wait"
            >
              {step < 3 ? (
                <>
                  Continuer
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  Envoi en cours…
                </>
              ) : (
                'Envoyer ma demande'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuoteWizard;
