import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { Button, buttonClass } from '../components/UIComponents';
import { WhatsappIcon } from '../components/WhatsAppButton';
import { trackPhoneConversionNumber } from '../utils/analytics';
import { SEO } from '../components/SEO';
import { defineCopy, useLang, type Lang } from '../i18n';

// Página de contato: três canais diretos (telefone, WhatsApp, e-mail), o bureau,
// o atalho para o devis em 4 etapas e o formulário de mensagem (EmailJS via
// submitContact). Só afirmações confirmadas: 0800 gratuito, joignable 7j/7,
// bureau lun.–sam. 8h–19h, inscrição no RC de Genève (IDE CHE-143.091.230).

const WHATSAPP_URLS: Record<Lang, string> = {
  fr: 'https://wa.me/41798896406?text=' + encodeURIComponent('Bonjour Batimove, je souhaite vous poser une question.'),
  en: 'https://wa.me/41798896406?text=' + encodeURIComponent('Hello Batimove, I have a question.'),
};

// O valor enviado no e-mail é sempre o francês; o rótulo exibido muda com o idioma.
const SUBJECTS = [
  'Déménagement résidentiel',
  "Transfert d'entreprise",
  'Garde-meubles',
  'Nettoyage de fin de bail',
  'Location monte-meubles',
  'Débarras',
  'Autre question',
];

const SUBJECT_LABELS: Record<Lang, string[]> = {
  fr: SUBJECTS,
  en: [
    'Home removal',
    'Business relocation',
    'Storage',
    'End of tenancy cleaning',
    'Furniture lift hire',
    'House clearance',
    'Other question',
  ],
};

interface FormState {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { name: '', phone: '', email: '', subject: SUBJECTS[0], message: '' };

const COPY = defineCopy(
  {
    errName: 'Indiquez votre nom.',
    errPhone: 'Indiquez un numéro de téléphone complet, par ex. 079 123 45 67.',
    errEmail: 'Indiquez une adresse e-mail valide, pour pouvoir vous répondre.',
    errMessage: 'Écrivez-nous quelques mots sur votre demande.',
    channelPhoneHint: 'Appel gratuit depuis la Suisse',
    channelWhatsappHint: '+41 79 889 64 06, réponse par message',
    channelEmailHint: 'Pour vos documents, photos et inventaires',
    title: 'Parlons de votre projet',
    titleSr: ' : contacter Batimove à Genève, Lausanne et dans le canton de Vaud',
    intro:
      'Une question, un conseil ou une demande particulière : appelez-nous, écrivez-nous sur WhatsApp ou laissez-nous un message.',
    channelsTitle: 'Nous joindre directement',
    officeTitle: 'Notre bureau',
    addressSr: 'Adresse',
    directions: 'Itinéraire',
    newTabSr: " (s'ouvre dans un nouvel onglet)",
    hoursSr: 'Horaires',
    hours: 'Bureau : lun. au sam., 8h00 à 19h00',
    reachable: 'Joignable 7j/7',
    registry: 'Batimove Sàrl, inscrite au registre du commerce de Genève. IDE',
    quoteTitle: "Besoin d'un devis ?",
    quoteText: 'Le plus rapide : notre devis en 4 étapes, gratuit et sans engagement. Réponse sous 30 min (8h-19h).',
    quoteCta: 'Demander un devis gratuit',
    sentTitle: 'Message envoyé',
    sentText: (name: string) => `Merci ${name}. Notre équipe vous recontacte sous 30 min (8h-19h), par téléphone ou par e-mail.`,
    sentWhatsapp: 'Écrire sur WhatsApp',
    sentAnother: 'Envoyer un autre message',
    formTitle: 'Écrivez-nous',
    formIntro: 'Nous vous recontactons sous 30 min (8h-19h), par téléphone ou par e-mail.',
    sendErrorStart: "Votre message n'a pas pu être envoyé. Vérifiez votre connexion et réessayez, ou",
    sendErrorWhatsapp: 'écrivez-nous sur WhatsApp',
    sendErrorCall: 'ou appelez le',
    labelName: 'Nom et prénom',
    placeholderName: 'Ex. Marc Dupont',
    labelPhone: 'Téléphone',
    labelEmail: 'E-mail',
    placeholderEmail: 'vous@exemple.ch',
    labelSubject: 'Votre demande concerne',
    labelMessage: 'Message',
    placeholderMessage: 'Trajet, dates, volume approximatif, questions particulières…',
    submit: 'Envoyer le message',
    privacyNote: 'Vos données servent uniquement à vous répondre.',
    privacyLink: 'Protection des données',
  },
  {
    errName: 'Please enter your name.',
    errPhone: 'Please enter a full phone number, e.g. 079 123 45 67.',
    errEmail: 'Please enter a valid email address so that we can reply to you.',
    errMessage: 'Please tell us a little about your request.',
    channelPhoneHint: 'Free call from within Switzerland',
    channelWhatsappHint: '+41 79 889 64 06, reply by message',
    channelEmailHint: 'For your documents, photos and inventories',
    title: "Let's talk about your project",
    titleSr: ': contact Batimove in Geneva, Lausanne and the canton of Vaud',
    intro:
      'A question, some advice or a special request: call us, message us on WhatsApp or leave us a message.',
    channelsTitle: 'Reach us directly',
    officeTitle: 'Our office',
    addressSr: 'Address',
    directions: 'Directions',
    newTabSr: ' (opens in a new tab)',
    hoursSr: 'Opening hours',
    hours: 'Office: Monday to Saturday, 8am to 7pm',
    reachable: 'Reachable 7 days a week',
    registry: 'Batimove Sàrl, registered in the Geneva commercial register. UID',
    quoteTitle: 'Need a quote?',
    quoteText: 'The quickest way: our 4-step quote, free and with no obligation. Reply within 30 min (8am–7pm).',
    quoteCta: 'Request a free quote',
    sentTitle: 'Message sent',
    sentText: (name: string) => `Thank you, ${name}. Our team will get back to you within 30 min (8am–7pm), by phone or email.`,
    sentWhatsapp: 'Message us on WhatsApp',
    sentAnother: 'Send another message',
    formTitle: 'Write to us',
    formIntro: 'We will get back to you within 30 min (8am–7pm), by phone or email.',
    sendErrorStart: 'Your message could not be sent. Please check your connection and try again, or',
    sendErrorWhatsapp: 'message us on WhatsApp',
    sendErrorCall: 'or call',
    labelName: 'Full name',
    placeholderName: 'e.g. Marc Dupont',
    labelPhone: 'Phone',
    labelEmail: 'Email',
    placeholderEmail: 'you@example.ch',
    labelSubject: 'Your enquiry is about',
    labelMessage: 'Message',
    placeholderMessage: 'Route, dates, approximate volume, specific questions…',
    submit: 'Send message',
    privacyNote: 'Your details are used solely to reply to you.',
    privacyLink: 'Privacy policy',
  }
);

type ContactCopy = (typeof COPY)['fr'];

const validate = (f: FormState, c: ContactCopy): Errors => {
  const e: Errors = {};
  if (!f.name.trim()) e.name = c.errName;
  if (f.phone.replace(/\D/g, '').length < 9) e.phone = c.errPhone;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = c.errEmail;
  if (!f.message.trim()) e.message = c.errMessage;
  return e;
};

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-4 text-lg text-[#0B1E33] placeholder:text-slate-500 outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/25 ${
    hasError ? 'border-red-600' : 'border-slate-300 hover:border-slate-400'
  }`;

const getChannels = (lang: Lang, c: ContactCopy) =>
  [
    {
      href: 'tel:0800825925',
      icon: Phone,
      title: '0800 825 925',
      hint: c.channelPhoneHint,
      external: false,
    },
    {
      href: WHATSAPP_URLS[lang],
      icon: WhatsappIcon,
      title: 'WhatsApp',
      hint: c.channelWhatsappHint,
      external: true,
    },
    {
      href: 'mailto:info@batimove.ch',
      icon: Mail,
      title: 'info@batimove.ch',
      hint: c.channelEmailHint,
      external: false,
    },
  ] as const;

export const Contact: React.FC = () => {
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const WHATSAPP_URL = WHATSAPP_URLS[lang];
  const CHANNELS = getChannels(lang, c);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [sentName, setSentName] = useState<string | null>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    trackPhoneConversionNumber('0800 825 925');
  }, []);

  useEffect(() => {
    if (sentName !== null) successRef.current?.focus();
  }, [sentName]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (sendError) setSendError(false);
  };

  const errorProps = (key: keyof FormState) =>
    errors[key] ? { 'aria-invalid': true, 'aria-describedby': `contact-${key}-error` } : {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const found = validate(form, c);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = Object.keys(found)[0];
      setTimeout(() => document.getElementById(`contact-${first}`)?.focus(), 0);
      return;
    }
    setLoading(true);
    setSendError(false);
    try {
      const { submitContact } = await import('../services/api');
      // O e-mail que chega na Batimove fica em francês; em inglês, avisa o idioma do cliente.
      const langLine = lang === 'en' ? '\nLangue du client : anglais' : '';
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        message: `Téléphone: ${form.phone.trim()}\nPrestation: ${form.subject}${langLine}\n\nMessage:\n${form.message.trim()}`,
      });
      setSentName(form.name.trim().split(/\s+/)[0]);
      setForm(EMPTY);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSendError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] font-sans text-slate-900">
      <SEO
        title="Contact Batimove | Déménageur Genève & Vaud - 0800 825 925"
        description="Contactez nos spécialistes du déménagement à Genève et Lausanne. Appel gratuit au 0800 825 925 ou écrivez-nous pour un devis personnalisé sous 30 min."
        canonical="https://www.batimove.ch/contact"
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="max-w-2xl">
          <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-[#0B1E33] sm:text-5xl">
            {c.title}
            <span className="sr-only">{c.titleSr}</span>
          </h1>
          <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-slate-600 sm:text-xl">
            {c.intro}
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          {/* Canais diretos + bureau + atalho do devis */}
          <div className="space-y-6 lg:col-span-5">
            <section aria-labelledby="canaux-title">
              <h2 id="canaux-title" className="text-sm font-semibold text-slate-500">
                {c.channelsTitle}
              </h2>
              <ul className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-rest">
                {CHANNELS.map(({ href, icon: Icon, title, hint, external }, i) => (
                  <li key={href} className="relative">
                    {i > 0 && (
                      <span aria-hidden="true" className="pointer-events-none absolute left-[76px] right-0 top-0 h-px bg-slate-200 sm:left-[80px]" />
                    )}
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex min-h-[72px] items-center gap-4 px-4 py-3.5 transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-slate-50 active:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284c7] sm:px-5"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#0B1E33] transition-colors duration-150 group-hover:bg-[#0B1E33] group-hover:text-white group-focus-visible:bg-[#0B1E33] group-focus-visible:text-white">
                        <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-lg font-semibold leading-snug tracking-tight text-[#0B1E33] tabular-nums">{title}</span>
                        <span className="mt-0.5 block text-sm leading-snug text-slate-500">{hint}</span>
                      </span>
                      <ChevronRight
                        className="h-[18px] w-[18px] shrink-0 text-slate-300 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-[#0B1E33] motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="bureau-title" className="rounded-xl border border-slate-200 bg-white p-6 shadow-rest">
              <h2 id="bureau-title" className="font-display text-xl font-medium tracking-tight text-[#0B1E33]">
                {c.officeTitle}
              </h2>
              <dl className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <dt className="mt-0.5 shrink-0">
                    <MapPin className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    <span className="sr-only">{c.addressSr}</span>
                  </dt>
                  <dd className="text-lg leading-snug text-[#0B1E33]">
                    Rue de Monthoux 64, 1201 Genève
                    <a
                      href="https://maps.google.com/?q=Rue+de+Monthoux+64,+1201+Genève"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex w-fit items-center gap-1.5 py-1 text-base font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 hover:decoration-[#0B1E33]"
                    >
                      {c.directions}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">{c.newTabSr}</span>
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="mt-0.5 shrink-0">
                    <Clock className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    <span className="sr-only">{c.hoursSr}</span>
                  </dt>
                  <dd className="text-lg leading-snug text-[#0B1E33]">
                    {c.hours}
                    <span className="mt-0.5 block text-base text-slate-600">{c.reachable}</span>
                  </dd>
                </div>
              </dl>
              <p className="mt-5 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-500">
                {c.registry} <span className="tabular-nums">CHE-143.091.230</span>.
              </p>
            </section>

            <section aria-labelledby="devis-title" className="rounded-xl bg-[#0B1E33] p-6">
              <h2 id="devis-title" className="font-display text-xl font-medium tracking-tight text-white">
                {c.quoteTitle}
              </h2>
              <p className="mt-2 text-lg leading-relaxed text-slate-300">
                {c.quoteText}
              </p>
              <Link to={lp('/quote')} className={buttonClass('primary', 'lg', 'mt-5 w-full sm:w-auto')}>
                {c.quoteCta}
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </section>
          </div>

          {/* Formulário de mensagem */}
          <div className="lg:col-span-7">
            <section
              aria-labelledby="form-title"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-rest sm:p-8"
            >
              {sentName !== null ? (
                <div className="wizard-in-up py-6 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#0B1E33] text-white">
                    <Check className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <h2
                    ref={successRef}
                    tabIndex={-1}
                    id="form-title"
                    className="mt-5 font-display text-3xl font-medium tracking-tight text-[#0B1E33] outline-none"
                  >
                    {c.sentTitle}
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-lg leading-relaxed text-slate-600">
                    {c.sentText(sentName)}
                  </p>
                  <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass('outline', 'lg')}
                    >
                      <WhatsappIcon className="h-5 w-5 text-[#075E54]" />
                      {c.sentWhatsapp}
                    </a>
                    <Button variant="ghost" size="lg" onClick={() => setSentName(null)}>
                      {c.sentAnother}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 id="form-title" className="font-display text-2xl font-medium tracking-tight text-[#0B1E33]">
                    {c.formTitle}
                  </h2>
                  <p className="mt-1.5 text-base text-slate-600">
                    {c.formIntro}
                  </p>

                  {sendError && (
                    <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-800">
                      {c.sendErrorStart}{' '}
                      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                        {c.sendErrorWhatsapp}
                      </a>{' '}
                      {c.sendErrorCall}{' '}
                      <a href="tel:0800825925" className="whitespace-nowrap font-semibold underline underline-offset-2">
                        0800 825 925
                      </a>
                      .
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="contact-name" className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
                        {c.labelName}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        placeholder={c.placeholderName}
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        className={`${inputClass(!!errors.name)} h-12`}
                        {...errorProps('name')}
                      />
                      {errors.name && <p id="contact-name-error" className="mt-1.5 text-sm text-red-700">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
                        {c.labelPhone}
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="079 123 45 67"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className={`${inputClass(!!errors.phone)} h-12 tabular-nums`}
                        {...errorProps('phone')}
                      />
                      {errors.phone && <p id="contact-phone-error" className="mt-1.5 text-sm text-red-700">{errors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
                        {c.labelEmail}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder={c.placeholderEmail}
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={`${inputClass(!!errors.email)} h-12`}
                        {...errorProps('email')}
                      />
                      {errors.email && <p id="contact-email-error" className="mt-1.5 text-sm text-red-700">{errors.email}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="contact-subject" className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
                        {c.labelSubject}
                      </label>
                      <select
                        id="contact-subject"
                        value={form.subject}
                        onChange={(e) => update('subject', e.target.value)}
                        className={`${inputClass(false)} h-12 cursor-pointer`}
                      >
                        {SUBJECTS.map((s, i) => (
                          <option key={s} value={s}>
                            {SUBJECT_LABELS[lang][i]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="contact-message" className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
                        {c.labelMessage}
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        placeholder={c.placeholderMessage}
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        className={`${inputClass(!!errors.message)} min-h-[132px] resize-y py-3 leading-relaxed`}
                        {...errorProps('message')}
                      />
                      {errors.message && <p id="contact-message-error" className="mt-1.5 text-sm text-red-700">{errors.message}</p>}
                    </div>

                    <div className="flex flex-col gap-4 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                      <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full sm:w-auto">
                        {c.submit}
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </Button>
                      <p className="text-sm text-slate-500">
                        {c.privacyNote}{' '}
                        <Link to={lp('/privacy')} className="underline underline-offset-2 hover:text-[#0B1E33]">
                          {c.privacyLink}
                        </Link>
                      </p>
                    </div>
                  </form>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
