import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Package2 } from 'lucide-react';
import { buttonClass } from '../components/UIComponents';
import { WhatsappIcon } from '../components/WhatsAppButton';
import { sendQuoteEmail } from '../services/api';
import { trackGoogleAdsLeadConversion } from '../utils/analytics';
import { BATIMOVE_WHATSAPP } from '../data/quoteServices';
import { CALCULATOR_DRAFT_KEY, formatVolume } from '../hooks/useVolumeCalculator';
import { SEO } from '../components/SEO';

// Demande de prix ferme à partir de l'inventaire du calculateur.
// Même logique que le wizard de devis : validation par champ, e-mail à Batimove
// et WhatsApp ouvert dans le même clic, état d'erreur avec repli WhatsApp / 0800.
// Aucun prix affiché : l'estimation interne part seulement dans l'e-mail.

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

const validate = (f: Form): Errors => {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Indiquez votre nom.';
  if (f.phone.replace(/\D/g, '').length < 9) e.phone = 'Indiquez un numéro de téléphone complet, par ex. 079 123 45 67.';
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    e.email = 'Cette adresse e-mail semble incomplète. Vérifiez-la ou laissez le champ vide.';
  if (!f.fromCity.trim()) e.fromCity = 'Indiquez la ville ou le NPA de départ.';
  if (!f.toCity.trim()) e.toCity = "Indiquez la ville ou le NPA d'arrivée.";
  return e;
};

const inventoryLines = (d: CalculatorData) =>
  d.items
    .filter((i) => i.quantity > 0)
    .map((i) => `${i.quantity}× ${i.name}${i.needsDisassembly ? ' (à démonter)' : ''}`);

const buildWhatsAppUrl = (d: CalculatorData, f: Form) => {
  const lines = inventoryLines(d);
  const shown = lines.slice(0, 15);
  const text = [
    "Bonjour Batimove, je viens d'envoyer mon inventaire sur batimove.ch :",
    `• Volume : ${formatVolume(d.totalVolume)} m³ (${d.totalItems} articles${d.disassembleCount ? `, ${d.disassembleCount} à démonter` : ''})`,
    `• Trajet : ${f.fromCity.trim()} → ${f.toCity.trim()}`,
    `• Nom : ${f.name.trim()}`,
    `• Téléphone : ${f.phone.trim()}`,
    f.email.trim() ? `• E-mail : ${f.email.trim()}` : '',
    f.message.trim() ? `• Précisions : ${f.message.trim()}` : '',
    '• Inventaire :',
    ...shown.map((l) => `  - ${l}`),
    lines.length > shown.length ? `  - et ${lines.length - shown.length} autre(s)` : '',
  ]
    .filter(Boolean)
    .join('\n');
  return `https://wa.me/${BATIMOVE_WHATSAPP}?text=${encodeURIComponent(text)}`;
};

const inputClass = (error: boolean) =>
  `h-12 w-full rounded-lg border bg-white px-4 text-lg text-[#0B1E33] placeholder:text-slate-500 outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/25 ${
    error ? 'border-red-600' : 'border-slate-300 hover:border-slate-400'
  }`;

const Field: React.FC<{ id: string; label: string; optional?: boolean; error?: string; children: React.ReactNode }> = ({
  id,
  label,
  optional,
  error,
  children,
}) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
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

const SummaryCard: React.FC<{ data: CalculatorData }> = ({ data }) => {
  const selected = data.items.filter((i) => i.quantity > 0);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-base font-semibold text-slate-600">Votre inventaire</h2>
      <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-[#0B1E33] tabular-nums">
        {formatVolume(data.totalVolume)}
        <span className="ml-1.5 text-xl font-bold text-slate-500">m³</span>
      </p>
      <p className="mt-1 text-base text-slate-600 tabular-nums">
        {data.totalItems} article{data.totalItems > 1 ? 's' : ''}
        {data.disassembleCount > 0 && ` · ${data.disassembleCount} à démonter`}
      </p>
      <ul className="mt-5 max-h-80 divide-y divide-slate-200 overflow-y-auto border-y border-slate-200">
        {selected.map((i) => (
          <li key={i.id} className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="min-w-0 text-base text-[#0B1E33]">
              <span className="font-semibold tabular-nums">{i.quantity}×</span> {i.name}
              {i.needsDisassembly && <span className="block text-sm text-slate-500">À démonter</span>}
            </span>
            <span className="shrink-0 text-base tabular-nums text-slate-500">{formatVolume(i.quantity * i.volume)} m³</span>
          </li>
        ))}
      </ul>
      <Link
        to="/calculator"
        className="mt-4 inline-flex items-center gap-1 py-2 text-base font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#0B1E33]"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Modifier l'inventaire
      </Link>
    </div>
  );
};

export default function CalculatorCheckout() {
  const location = useLocation();
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
      const lines = inventoryLines(d);
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
    const found = validate(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = Object.keys(found)[0];
      window.setTimeout(() => document.getElementById(`co-${first}`)?.focus(), 0);
      return;
    }
    // E-mail d'abord ; WhatsApp dans le même geste (sinon le navigateur bloque).
    void submit(data, form);
    if (alsoWhatsApp && !whatsAppOpened) {
      window.open(buildWhatsAppUrl(data, form), '_blank', 'noopener,noreferrer');
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
          <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-[#0B1E33]">Votre inventaire est vide</h1>
          <p className="mt-2 text-lg leading-relaxed text-slate-600">
            Indiquez vos meubles dans le calculateur, ou décrivez directement votre projet : la réponse arrive sous 30&nbsp;min
            (8h-19h).
          </p>
          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Link to="/calculator" className={buttonClass('primary', 'lg')}>
              Calculer mon volume
            </Link>
            <Link to="/quote" className={buttonClass('outline', 'lg')}>
              Décrire mon projet
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
          <h1 ref={successRef} tabIndex={-1} className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#0B1E33] outline-none">
            Demande envoyée
          </h1>
          <p className="mx-auto mt-2 max-w-md text-lg leading-relaxed text-slate-600">
            Merci {firstName}. Votre prix ferme arrive sous 30&nbsp;min (8h-19h) au{' '}
            <span className="whitespace-nowrap font-semibold tabular-nums text-[#0B1E33]">{sent.phone.trim()}</span>.
          </p>

          <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
            <li className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0B1E33] text-white">
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="text-base text-[#0B1E33]">
                <span className="font-semibold">E-mail</span> : inventaire transmis à Batimove
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
            {[
              ['Volume', `${formatVolume(data.totalVolume)} m³`],
              ['Articles', `${data.totalItems}${data.disassembleCount ? ` (${data.disassembleCount} à démonter)` : ''}`],
              ['Trajet', `${sent.fromCity.trim()} → ${sent.toCity.trim()}`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="shrink-0 text-base text-slate-500">{k}</dt>
                <dd className="text-right text-base font-semibold tabular-nums text-[#0B1E33]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mx-auto mt-8 max-w-md">
            <a
              href={buildWhatsAppUrl(data, sent)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#075E54] px-6 text-lg font-bold text-white transition-colors duration-150 hover:bg-[#064A42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
            >
              <WhatsappIcon className="h-5 w-5" />
              {whatsAppOpened ? 'Rouvrir WhatsApp' : 'Envoyer aussi sur WhatsApp'}
            </a>
            <p className="mt-2.5 text-sm text-slate-500">Le résumé est déjà rédigé&nbsp;: il ne reste qu'à appuyer sur Envoyer.</p>
            <Link
              to="/"
              className="mt-6 inline-block py-2 text-base font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#0B1E33]"
            >
              Retour à l'accueil
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
          to="/calculator"
          className="-ml-1 inline-flex items-center gap-1 py-2 text-base font-semibold text-slate-600 transition-colors hover:text-[#0B1E33]"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Calculateur
        </Link>
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-[#0B1E33] sm:text-4xl">
          Recevoir mon prix ferme
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Sous 30&nbsp;min (8h-19h), gratuit et sans engagement. Aucun surcoût une fois le devis accepté.
        </p>
        <p className="mt-3 text-base font-semibold text-[#0B1E33] tabular-nums lg:hidden">
          Votre inventaire : {formatVolume(data.totalVolume)} m³ · {data.totalItems} article{data.totalItems > 1 ? 's' : ''}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">

          <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-slate-200 bg-white lg:order-1 lg:col-span-7">
            <div className="px-5 pb-6 pt-6 sm:px-8">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-[#0B1E33]">Vos coordonnées</h2>

              {submitError && (
                <div ref={alertRef} role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-800">
                  L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez, ou{' '}
                  <a href={buildWhatsAppUrl(data, form)} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                    envoyez votre inventaire sur WhatsApp
                  </a>{' '}
                  ou appelez le{' '}
                  <a href="tel:0800825925" className="whitespace-nowrap font-semibold underline underline-offset-2">
                    0800 825 925
                  </a>
                  .
                </div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field id="co-name" label="Nom et prénom" error={errors.name}>
                    <input
                      id="co-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Ex. Marc Dupont"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={inputClass(!!errors.name)}
                      {...errorProps('name')}
                    />
                  </Field>
                </div>
                <Field id="co-phone" label="Téléphone" error={errors.phone}>
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
                <Field id="co-email" label="E-mail" optional error={errors.email}>
                  <input
                    id="co-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="vous@exemple.ch"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={inputClass(!!errors.email)}
                    {...errorProps('email')}
                  />
                </Field>
                <Field id="co-fromCity" label="Départ" error={errors.fromCity}>
                  <input
                    id="co-fromCity"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Ville ou NPA"
                    value={form.fromCity}
                    onChange={(e) => update('fromCity', e.target.value)}
                    className={inputClass(!!errors.fromCity)}
                    {...errorProps('fromCity')}
                  />
                </Field>
                <Field id="co-toCity" label="Arrivée" error={errors.toCity}>
                  <input
                    id="co-toCity"
                    type="text"
                    placeholder="Ville ou NPA"
                    value={form.toCity}
                    onChange={(e) => update('toCity', e.target.value)}
                    className={inputClass(!!errors.toCity)}
                    {...errorProps('toCity')}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="co-message" label="Précisions" optional>
                    <textarea
                      id="co-message"
                      rows={3}
                      placeholder="Date souhaitée, étages, ascenseur, objets fragiles…"
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
                  <span className="font-semibold">Envoyer aussi sur WhatsApp</span>
                  <span className="block text-sm text-slate-500">Votre inventaire s'ouvre prêt à envoyer, pour une réponse encore plus rapide.</span>
                </span>
              </label>
              <p className="mt-4 text-sm text-slate-500">
                Vos données servent uniquement à établir votre devis.{' '}
                <Link to="/privacy" className="underline underline-offset-2 hover:text-[#0B1E33]">
                  Protection des données
                </Link>
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-8">
              <button type="submit" disabled={submitting} className={buttonClass('primary', 'lg', 'w-full disabled:cursor-wait sm:w-auto')}>
                {submitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
                {!submitting && <ChevronRight className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </form>

          {/* No celular o formulário vem primeiro (captação); o resumo segue abaixo. */}
          <div className="lg:order-2 lg:col-span-5">
            <SummaryCard data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
