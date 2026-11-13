import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Package2 } from 'lucide-react';
import { buttonClass } from '../components/UIComponents';
import { WhatsappIcon } from '../components/WhatsAppButton';
import { sendQuoteEmail } from '../services/api';
import { trackGoogleAdsLeadConversion } from '../utils/analytics';
import { BATIMOVE_WHATSAPP } from '../data/quoteServices';
import { itemName } from '../data/calculatorItems';
import { CALCULATOR_DRAFT_KEY, formatVolume } from '../hooks/useVolumeCalculator';
import { SEO } from '../components/SEO';
import { defineCopy, useLang, type Lang } from '../i18n';

// Demande de prix ferme à partir de l'inventaire du calculateur.
// Même logique que le wizard de devis : validation par champ, e-mail à Batimove
// et WhatsApp ouvert dans le même clic, état d'erreur avec repli WhatsApp / 0800.
// Aucun prix affiché : l'estimation interne part seulement dans l'e-mail.
// L'e-mail à Batimove reste toujours en français ; l'écran et le message WhatsApp
// suivent la langue du client.

const STORAGE_KEY = 'calculatorData';

interface CalculatorData {
  items: Array<{ id: string; name: string; quantity: number; volume: number; needsDisassembly: boolean }>;
  totalVolume: number;
  estimatedPrice: number;
  totalItems: number;
  disassembleCount: number;
  timestamp: string;
}

interface Form {
  name: string;
  phone: string;
  email: string;
  fromCity: string;
  toCity: string;
  message: string;
}

type Errors = Partial<Record<keyof Form, string>>;

const EMPTY_FORM: Form = { name: '', phone: '', email: '', fromCity: '', toCity: '', message: '' };

const COPY = defineCopy(
  {
    errors: {
      name: 'Indiquez votre nom.',
      phone: 'Indiquez un numéro de téléphone complet, par ex. 079 123 45 67.',
      email: 'Cette adresse e-mail semble incomplète. Vérifiez-la ou laissez le champ vide.',
      fromCity: 'Indiquez la ville ou le NPA de départ.',
      toCity: "Indiquez la ville ou le NPA d'arrivée.",
    },
    disassembleSuffix: ' (à démonter)',
    whatsapp: {
      hello: "Bonjour Batimove, je viens d'envoyer mon inventaire sur batimove.ch :",
      volume: (vol: string, n: number, dis: number) =>
        `• Volume : ${vol} m³ (${n} articles${dis ? `, ${dis} à démonter` : ''})`,
      route: (from: string, to: string) => `• Trajet : ${from} → ${to}`,
      name: (v: string) => `• Nom : ${v}`,
      phone: (v: string) => `• Téléphone : ${v}`,
      email: (v: string) => `• E-mail : ${v}`,
      details: (v: string) => `• Précisions : ${v}`,
      inventory: '• Inventaire :',
      more: (n: number) => `  - et ${n} autre(s)`,
    },
    optional: ' (facultatif)',
    inventoryTitle: 'Votre inventaire',
    itemCount: (n: number) => `${n} article${n > 1 ? 's' : ''}`,
    disassembleCount: (n: number) => ` · ${n} à démonter`,
    toDisassemble: 'À démonter',
    editInventory: "Modifier l'inventaire",
    emptyTitle: 'Votre inventaire est vide',
    emptyText:
      'Indiquez vos meubles dans le calculateur, ou décrivez directement votre projet : la réponse arrive sous 30 min (8h-19h).',
    emptyCalc: 'Calculer mon volume',
    emptyQuote: 'Décrire mon projet',
    sentTitle: 'Demande envoyée',
    sentBefore: (firstName: string) => `Merci ${firstName}. Votre prix ferme arrive sous 30 min (8h-19h) au`,
    sep: ' : ',
    sentEmailLabel: 'E-mail',
    sentEmail: 'inventaire transmis à Batimove',
    sentWhatsAppOpened: 'résumé ouvert, appuyez sur Envoyer dans WhatsApp',
    sentWhatsAppOptional: 'facultatif, en un clic ci-dessous',
    dlVolume: 'Volume',
    dlItems: 'Articles',
    dlItemsValue: (n: number, dis: number) => `${n}${dis ? ` (${dis} à démonter)` : ''}`,
    dlRoute: 'Trajet',
    reopenWhatsApp: 'Rouvrir WhatsApp',
    alsoWhatsApp: 'Envoyer aussi sur WhatsApp',
    whatsAppReady: "Le résumé est déjà rédigé : il ne reste qu'à appuyer sur Envoyer.",
    backHome: "Retour à l'accueil",
    backCalc: 'Calculateur',
    title: 'Recevoir mon prix ferme',
    subtitle: 'Sous 30 min (8h-19h), gratuit et sans engagement. Aucun surcoût une fois le devis accepté.',
    mobileSummary: (vol: string, n: number) => `Votre inventaire : ${vol} m³ · ${n} article${n > 1 ? 's' : ''}`,
    contactTitle: 'Vos coordonnées',
    errorBefore: "L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez, ou",
    errorWhatsApp: 'envoyez votre inventaire sur WhatsApp',
    errorCall: 'ou appelez le',
    labelName: 'Nom et prénom',
    phName: 'Ex. Marc Dupont',
    labelPhone: 'Téléphone',
    labelEmail: 'E-mail',
    phEmail: 'vous@exemple.ch',
    labelFrom: 'Départ',
    labelTo: 'Arrivée',
    phCity: 'Ville ou NPA',
    labelMessage: 'Précisions',
    phMessage: 'Date souhaitée, étages, ascenseur, objets fragiles…',
    whatsAppHint: "Votre inventaire s'ouvre prêt à envoyer, pour une réponse encore plus rapide.",
    privacy: 'Vos données servent uniquement à établir votre devis.',
    privacyLink: 'Protection des données',
    sending: 'Envoi en cours…',
    submit: 'Envoyer ma demande',
  },
  {
    errors: {
      name: 'Please enter your name.',
      phone: 'Please enter a full phone number, e.g. 079 123 45 67.',
      email: 'This email address looks incomplete. Check it or leave the field empty.',
      fromCity: 'Please enter the town or postcode you are moving from.',
      toCity: 'Please enter the town or postcode you are moving to.',
    },
    disassembleSuffix: ' (to dismantle)',
    whatsapp: {
      hello: "Hello Batimove, I've just sent my inventory on batimove.ch:",
      volume: (vol: string, n: number, dis: number) =>
        `• Volume: ${vol} m³ (${n} item${n === 1 ? '' : 's'}${dis ? `, ${dis} to dismantle` : ''})`,
      route: (from: string, to: string) => `• Route: ${from} → ${to}`,
      name: (v: string) => `• Name: ${v}`,
      phone: (v: string) => `• Phone: ${v}`,
      email: (v: string) => `• Email: ${v}`,
      details: (v: string) => `• Details: ${v}`,
      inventory: '• Inventory:',
      more: (n: number) => `  - and ${n} more`,
    },
    optional: ' (optional)',
    inventoryTitle: 'Your inventory',
    itemCount: (n: number) => `${n} item${n === 1 ? '' : 's'}`,
    disassembleCount: (n: number) => ` · ${n} to dismantle`,
    toDisassemble: 'To dismantle',
    editInventory: 'Edit inventory',
    emptyTitle: 'Your inventory is empty',
    emptyText:
      'Add your furniture in the calculator, or describe your move directly: the reply arrives within 30 min (8am–7pm).',
    emptyCalc: 'Calculate my volume',
    emptyQuote: 'Describe my move',
    sentTitle: 'Request sent',
    sentBefore: (firstName: string) => `Thank you, ${firstName}. Your fixed price will reach you within 30 min (8am–7pm) on`,
    sep: ': ',
    sentEmailLabel: 'Email',
    sentEmail: 'inventory sent to Batimove',
    sentWhatsAppOpened: 'summary opened, tap Send in WhatsApp',
    sentWhatsAppOptional: 'optional, in one click below',
    dlVolume: 'Volume',
    dlItems: 'Items',
    dlItemsValue: (n: number, dis: number) => `${n}${dis ? ` (${dis} to dismantle)` : ''}`,
    dlRoute: 'Route',
    reopenWhatsApp: 'Reopen WhatsApp',
    alsoWhatsApp: 'Also send on WhatsApp',
    whatsAppReady: "The summary is already written: all that's left is to tap Send.",
    backHome: 'Back to home',
    backCalc: 'Calculator',
    title: 'Get my fixed price',
    subtitle: 'Within 30 min (8am–7pm), free and with no obligation. No extra charges once the quote is accepted.',
    mobileSummary: (vol: string, n: number) => `Your inventory: ${vol} m³ · ${n} item${n === 1 ? '' : 's'}`,
    contactTitle: 'Your contact details',
    errorBefore: "Your request didn't go through. Check your connection and try again,",
    errorWhatsApp: 'send your inventory on WhatsApp',
    errorCall: 'or call',
    labelName: 'Full name',
    phName: 'e.g. Marc Dupont',
    labelPhone: 'Phone',
    labelEmail: 'Email',
    phEmail: 'you@example.ch',
    labelFrom: 'Moving from',
    labelTo: 'Moving to',
    phCity: 'Town or postcode',
    labelMessage: 'Details',
    phMessage: 'Preferred date, floors, lift, fragile items…',
    whatsAppHint: 'Your inventory opens ready to send, for an even faster reply.',
    privacy: 'Your data is used only to prepare your quote.',
    privacyLink: 'Data protection',
    sending: 'Sending…',
    submit: 'Send my request',
  }
);

type Copy = (typeof COPY)['fr'];

const isValidData = (d: unknown): d is CalculatorData =>
  !!d &&
  typeof d === 'object' &&
  Array.isArray((d as CalculatorData).items) &&
  typeof (d as CalculatorData).totalVolume === 'number' &&
  (d as CalculatorData).totalVolume > 0;

const loadData = (state: unknown): CalculatorData | null => {
  if (isValidData(state)) return state;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return isValidData(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const validate = (f: Form, c: Copy): Errors => {
  const e: Errors = {};
  if (!f.name.trim()) e.name = c.errors.name;
  if (f.phone.replace(/\D/g, '').length < 9) e.phone = c.errors.phone;
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = c.errors.email;
  if (!f.fromCity.trim()) e.fromCity = c.errors.fromCity;
  if (!f.toCity.trim()) e.toCity = c.errors.toCity;
  return e;
};

/** Nom d'un article dans la langue voulue ; repli sur le nom stocké (français) si l'id est inconnu. */
const lineName = (i: CalculatorData['items'][number], lang: Lang) => itemName(i.id, lang, i.name);

const inventoryLines = (d: CalculatorData, lang: Lang) =>
  d.items
    .filter((i) => i.quantity > 0)
    .map((i) => `${i.quantity}× ${lineName(i, lang)}${i.needsDisassembly ? COPY[lang].disassembleSuffix : ''}`);

// Le client envoie ce message lui-même : il est rédigé dans sa langue.
const buildWhatsAppUrl = (d: CalculatorData, f: Form, lang: Lang) => {
  const w = COPY[lang].whatsapp;
  const lines = inventoryLines(d, lang);
  const shown = lines.slice(0, 15);
  const text = [
    w.hello,
    w.volume(formatVolume(d.totalVolume, lang), d.totalItems, d.disassembleCount),
    w.route(f.fromCity.trim(), f.toCity.trim()),
    w.name(f.name.trim()),
    w.phone(f.phone.trim()),
    f.email.trim() ? w.email(f.email.trim()) : '',
    f.message.trim() ? w.details(f.message.trim()) : '',
    w.inventory,
    ...shown.map((l) => `  - ${l}`),
    lines.length > shown.length ? w.more(lines.length - shown.length) : '',
  ]
    .filter(Boolean)
    .join('\n');
  return `https://wa.me/${BATIMOVE_WHATSAPP}?text=${encodeURIComponent(text)}`;
};

const inputClass = (error: boolean) =>
  `h-12 w-full rounded-lg border bg-white px-4 text-lg text-[#0B1E33] placeholder:text-slate-500 outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/25 ${
    error ? 'border-red-600' : 'border-slate-300 hover:border-slate-400'
  }`;

const Field: React.FC<{ id: string; label: string; optional?: string; error?: string; children: React.ReactNode }> = ({
  id,
  label,
  optional,
  error,
  children,
}) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
      {label}
      {optional && <span className="font-normal text-slate-500">{optional}</span>}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
        {error}
      </p>
    )}
  </div>
);

const SummaryCard: React.FC<{ data: CalculatorData; lang: Lang; c: Copy; calculatorPath: string }> = ({
  data,
  lang,
  c,
  calculatorPath,
}) => {
  const selected = data.items.filter((i) => i.quantity > 0);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-base font-semibold text-slate-600">{c.inventoryTitle}</h2>
      <p className="mt-1 font-display text-4xl font-medium tracking-tight text-[#0B1E33] tabular-nums">
        {formatVolume(data.totalVolume, lang)}
        <span className="ml-1.5 text-xl font-semibold text-slate-500">m³</span>
      </p>
      <p className="mt-1 text-base text-slate-600 tabular-nums">
        {c.itemCount(data.totalItems)}
        {data.disassembleCount > 0 && c.disassembleCount(data.disassembleCount)}
      </p>
      <ul className="mt-5 max-h-80 divide-y divide-slate-200 overflow-y-auto border-y border-slate-200">
        {selected.map((i) => (
          <li key={i.id} className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="min-w-0 text-base text-[#0B1E33]">
              <span className="font-semibold tabular-nums">{i.quantity}×</span> {lineName(i, lang)}
              {i.needsDisassembly && <span className="block text-sm text-slate-500">{c.toDisassemble}</span>}
            </span>
            <span className="shrink-0 text-base tabular-nums text-slate-500">{formatVolume(i.quantity * i.volume, lang)} m³</span>
          </li>
        ))}
      </ul>
      <Link
        to={calculatorPath}
        className="mt-4 inline-flex items-center gap-1 py-2 text-base font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#0B1E33]"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {c.editInventory}
      </Link>
    </div>
  );
};

export default function CalculatorCheckout() {
  const location = useLocation();
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const [data] = useState<CalculatorData | null>(() => (typeof window !== 'undefined' ? loadData(location.state) : null));
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [alsoWhatsApp, setAlsoWhatsApp] = useState(true);
  const [whatsAppOpened, setWhatsAppOpened] = useState(false);
  const [sent, setSent] = useState<Form | null>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  // Confirmation et erreur hors écran sur mobile : on les ramène à la vue.
  useEffect(() => {
    if (sent) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      successRef.current?.focus({ preventScroll: true });
    }
  }, [sent]);
  useEffect(() => {
    if (submitError) alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [submitError]);

  const update = (key: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (submitError) setSubmitError(false);
  };

  const errorProps = (key: keyof Form) =>
    errors[key] ? { 'aria-invalid': true as const, 'aria-describedby': `co-${key}-error` } : {};

  const submit = async (d: CalculatorData, f: Form) => {
    setSubmitting(true);
    setSubmitError(false);
    try {
      // E-mail interne : toujours en français (noms et libellés), quelle que soit la langue du client.
      const lines = inventoryLines(d, 'fr');
      await sendQuoteEmail({
        name: f.name.trim(),
        // Vide plutôt qu'un texte : ce champ sert aussi de Reply-To dans EmailJS.
        email: f.email.trim(),
        phone: f.phone.trim(),
        fromZip: f.fromCity.trim(),
        toZip: f.toCity.trim(),
        message: [
          f.message.trim() || 'Demande de prix ferme via le calculateur de volume.',
          f.email.trim() ? '' : 'E-mail : non renseigné (répondre par téléphone ou WhatsApp).',
          ...(lang === 'en' ? ['Langue du client : anglais'] : []),
          '',
          `Inventaire (${formatVolume(d.totalVolume)} m³) :`,
          ...lines.map((l) => `- ${l}`),
        ].join('\n'),
        volume: d.totalVolume.toString(),
        estimatedPrice: d.estimatedPrice.toString(),
        itemCount: d.totalItems.toString(),
        disassembleCount: d.disassembleCount.toString(),
      });
      trackGoogleAdsLeadConversion({ leadId: crypto.randomUUID(), value: d.estimatedPrice, currency: 'CHF' });
      try {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(CALCULATOR_DRAFT_KEY);
      } catch {
        /* stockage bloqué */
      }
      setSent(f);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !data) return;
    const found = validate(form, c);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = Object.keys(found)[0];
      window.setTimeout(() => document.getElementById(`co-${first}`)?.focus(), 0);
      return;
    }
    // E-mail d'abord ; WhatsApp dans le même geste (sinon le navigateur bloque).
    void submit(data, form);
    if (alsoWhatsApp && !whatsAppOpened) {
      window.open(buildWhatsAppUrl(data, form, lang), '_blank', 'noopener,noreferrer');
      setWhatsAppOpened(true);
    }
  };

  const seo = (
    <SEO
      title="Recevoir mon prix ferme | Batimove Sàrl"
      description="Envoyez votre inventaire et recevez votre prix ferme de déménagement sous 30 min."
      canonical="https://www.batimove.ch/calculator/checkout"
      robots="noindex, nofollow"
    />
  );

  // ---------- Sans inventaire (accès direct, données effacées) ----------
  if (!data) {
    return (
      <div className="bg-[#F8FAFC] px-4 py-16 font-sans sm:py-24">
        {seo}
        <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-[#0B1E33]">
            <Package2 className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-medium tracking-tight text-[#0B1E33]">{c.emptyTitle}</h1>
          <p className="mt-2 text-lg leading-relaxed text-slate-600">{c.emptyText}</p>
          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Link to={lp('/calculator')} className={buttonClass('primary', 'lg')}>
              {c.emptyCalc}
            </Link>
            <Link to={lp('/quote')} className={buttonClass('outline', 'lg')}>
              {c.emptyQuote}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Confirmation ----------
  if (sent) {
    const firstName = sent.name.trim().split(/\s+/)[0];
    return (
      <div className="bg-[#F8FAFC] px-4 py-12 font-sans sm:py-16">
        {seo}
        <div className="wizard-in-up mx-auto max-w-xl rounded-xl border border-slate-200 bg-white px-5 py-10 text-center sm:px-10">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#0B1E33] text-white">
            <Check className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <h1 ref={successRef} tabIndex={-1} className="mt-5 font-display text-3xl font-medium tracking-tight text-[#0B1E33] outline-none">
            {c.sentTitle}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-lg leading-relaxed text-slate-600">
            {c.sentBefore(firstName)}{' '}
            <span className="whitespace-nowrap font-semibold tabular-nums text-[#0B1E33]">{sent.phone.trim()}</span>.
          </p>

          <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
            <li className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0B1E33] text-white">
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="text-base text-[#0B1E33]">
                <span className="font-semibold">{c.sentEmailLabel}</span>
                {c.sep}
                {c.sentEmail}
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
                <span className="font-semibold">WhatsApp</span>
                {c.sep}
                {whatsAppOpened ? c.sentWhatsAppOpened : c.sentWhatsAppOptional}
              </span>
            </li>
          </ul>

          <dl className="mx-auto mt-6 max-w-md divide-y divide-slate-200 rounded-xl border border-slate-200 text-left">
            {[
              [c.dlVolume, `${formatVolume(data.totalVolume, lang)} m³`],
              [c.dlItems, c.dlItemsValue(data.totalItems, data.disassembleCount)],
              [c.dlRoute, `${sent.fromCity.trim()} → ${sent.toCity.trim()}`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="shrink-0 text-base text-slate-500">{k}</dt>
                <dd className="text-right text-base font-semibold tabular-nums text-[#0B1E33]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mx-auto mt-8 max-w-md">
            <a
              href={buildWhatsAppUrl(data, sent, lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#075E54] px-6 text-lg font-semibold text-white transition-colors duration-150 hover:bg-[#064A42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
            >
              <WhatsappIcon className="h-5 w-5" />
              {whatsAppOpened ? c.reopenWhatsApp : c.alsoWhatsApp}
            </a>
            <p className="mt-2.5 text-sm text-slate-500">{c.whatsAppReady}</p>
            <Link
              to={lp('/')}
              className="mt-6 inline-block py-2 text-base font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#0B1E33]"
            >
              {c.backHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Formulaire ----------
  return (
    <div className="bg-[#F8FAFC] font-sans">
      {seo}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          to={lp('/calculator')}
          className="-ml-1 inline-flex items-center gap-1 py-2 text-base font-semibold text-slate-600 transition-colors hover:text-[#0B1E33]"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {c.backCalc}
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium leading-tight tracking-tight text-[#0B1E33] sm:text-4xl">
          {c.title}
        </h1>
        <p className="mt-2 text-lg text-slate-600">{c.subtitle}</p>
        <p className="mt-3 text-base font-semibold text-[#0B1E33] tabular-nums lg:hidden">
          {c.mobileSummary(formatVolume(data.totalVolume, lang), data.totalItems)}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">

          <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-slate-200 bg-white lg:order-1 lg:col-span-7">
            <div className="px-5 pb-6 pt-6 sm:px-8">
              <h2 className="font-display text-2xl font-medium tracking-tight text-[#0B1E33]">{c.contactTitle}</h2>

              {submitError && (
                <div ref={alertRef} role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-800">
                  {c.errorBefore}{' '}
                  <a href={buildWhatsAppUrl(data, form, lang)} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                    {c.errorWhatsApp}
                  </a>{' '}
                  {c.errorCall}{' '}
                  <a href="tel:0800825925" className="whitespace-nowrap font-semibold underline underline-offset-2">
                    0800 825 925
                  </a>
                  .
                </div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field id="co-name" label={c.labelName} error={errors.name}>
                    <input
                      id="co-name"
                      type="text"
                      autoComplete="name"
                      placeholder={c.phName}
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={inputClass(!!errors.name)}
                      {...errorProps('name')}
                    />
                  </Field>
                </div>
                <Field id="co-phone" label={c.labelPhone} error={errors.phone}>
                  <input
                    id="co-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="079 123 45 67"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={`${inputClass(!!errors.phone)} tabular-nums`}
                    {...errorProps('phone')}
                  />
                </Field>
                <Field id="co-email" label={c.labelEmail} optional={c.optional} error={errors.email}>
                  <input
                    id="co-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder={c.phEmail}
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={inputClass(!!errors.email)}
                    {...errorProps('email')}
                  />
                </Field>
                <Field id="co-fromCity" label={c.labelFrom} error={errors.fromCity}>
                  <input
                    id="co-fromCity"
                    type="text"
                    autoComplete="address-level2"
                    placeholder={c.phCity}
                    value={form.fromCity}
                    onChange={(e) => update('fromCity', e.target.value)}
                    className={inputClass(!!errors.fromCity)}
                    {...errorProps('fromCity')}
                  />
                </Field>
                <Field id="co-toCity" label={c.labelTo} error={errors.toCity}>
                  <input
                    id="co-toCity"
                    type="text"
                    placeholder={c.phCity}
                    value={form.toCity}
                    onChange={(e) => update('toCity', e.target.value)}
                    className={inputClass(!!errors.toCity)}
                    {...errorProps('toCity')}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="co-message" label={c.labelMessage} optional={c.optional}>
                    <textarea
                      id="co-message"
                      rows={3}
                      placeholder={c.phMessage}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      className={`${inputClass(false)} h-auto min-h-[96px] resize-y py-3 leading-relaxed`}
                    />
                  </Field>
                </div>
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
                  <span className="font-semibold">{c.alsoWhatsApp}</span>
                  <span className="block text-sm text-slate-500">{c.whatsAppHint}</span>
                </span>
              </label>
              <p className="mt-4 text-sm text-slate-500">
                {c.privacy}{' '}
                <Link to={lp('/privacy')} className="underline underline-offset-2 hover:text-[#0B1E33]">
                  {c.privacyLink}
                </Link>
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-8">
              <button type="submit" disabled={submitting} className={buttonClass('primary', 'lg', 'w-full disabled:cursor-wait sm:w-auto')}>
                {submitting ? c.sending : c.submit}
                {!submitting && <ChevronRight className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </form>

          {/* No celular o formulário vem primeiro (captação); o resumo segue abaixo. */}
          <div className="lg:order-2 lg:col-span-5">
            <SummaryCard data={data} lang={lang} c={c} calculatorPath={lp('/calculator')} />
          </div>
        </div>
      </div>
    </div>
  );
}
