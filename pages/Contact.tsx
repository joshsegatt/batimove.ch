import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { Button, buttonClass } from '../components/UIComponents';
import { WhatsappIcon } from '../components/WhatsAppButton';
import { trackPhoneConversionNumber } from '../utils/analytics';
import { SEO } from '../components/SEO';

// Página de contato: três canais diretos (telefone, WhatsApp, e-mail), o bureau,
// o atalho para o devis em 4 etapas e o formulário de mensagem (EmailJS via
// submitContact). Só afirmações confirmadas: 0800 gratuito, joignable 7j/7,
// bureau lun.–sam. 8h–19h, inscrição no RC de Genève (IDE CHE-143.091.230).

const WHATSAPP_URL =
  'https://wa.me/41798896406?text=' + encodeURIComponent('Bonjour Batimove, je souhaite vous poser une question.');

const SUBJECTS = [
  'Déménagement résidentiel',
  "Transfert d'entreprise",
  'Garde-meubles',
  'Nettoyage de fin de bail',
  'Location monte-meubles',
  'Débarras',
  'Autre question',
];

interface FormState {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { name: '', phone: '', email: '', subject: SUBJECTS[0], message: '' };

const validate = (f: FormState): Errors => {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Indiquez votre nom.';
  if (f.phone.replace(/\D/g, '').length < 9) e.phone = 'Indiquez un numéro de téléphone complet, par ex. 079 123 45 67.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Indiquez une adresse e-mail valide, pour pouvoir vous répondre.';
  if (!f.message.trim()) e.message = 'Écrivez-nous quelques mots sur votre demande.';
  return e;
};

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-4 text-lg text-[#0B1E33] placeholder:text-slate-500 outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/25 ${
    hasError ? 'border-red-600' : 'border-slate-300 hover:border-slate-400'
  }`;

const CHANNELS = [
  {
    href: 'tel:0800825925',
    icon: Phone,
    title: '0800 825 925',
    hint: 'Appel gratuit depuis la Suisse',
    external: false,
  },
  {
    href: WHATSAPP_URL,
    icon: WhatsappIcon,
    title: 'WhatsApp',
    hint: '+41 79 889 64 06, réponse par message',
    external: true,
  },
  {
    href: 'mailto:info@batimove.ch',
    icon: Mail,
    title: 'info@batimove.ch',
    hint: 'Pour vos documents, photos et inventaires',
    external: false,
  },
] as const;

export const Contact: React.FC = () => {
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
    const found = validate(form);
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
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        message: `Téléphone: ${form.phone.trim()}\nPrestation: ${form.subject}\n\nMessage:\n${form.message.trim()}`,
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
            Parlons de votre projet
            <span className="sr-only"> : contacter Batimove à Genève, Lausanne et dans le canton de Vaud</span>
          </h1>
          <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-slate-600 sm:text-xl">
            Une question, un conseil ou une demande particulière : appelez-nous, écrivez-nous sur WhatsApp ou laissez-nous un
            message.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          {/* Canais diretos + bureau + atalho do devis */}
          <div className="space-y-6 lg:col-span-5">
            <section aria-labelledby="canaux-title">
              <h2 id="canaux-title" className="text-sm font-semibold text-slate-500">
                Nous joindre directement
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
                Notre bureau
              </h2>
              <dl className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <dt className="mt-0.5 shrink-0">
                    <MapPin className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    <span className="sr-only">Adresse</span>
                  </dt>
                  <dd className="text-lg leading-snug text-[#0B1E33]">
                    Rue de Monthoux 64, 1201 Genève
                    <a
                      href="https://maps.google.com/?q=Rue+de+Monthoux+64,+1201+Genève"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex w-fit items-center gap-1.5 py-1 text-base font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 hover:decoration-[#0B1E33]"
                    >
                      Itinéraire
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only"> (s'ouvre dans un nouvel onglet)</span>
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="mt-0.5 shrink-0">
                    <Clock className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    <span className="sr-only">Horaires</span>
                  </dt>
                  <dd className="text-lg leading-snug text-[#0B1E33]">
                    Bureau : lun. au sam., 8h00 à 19h00
                    <span className="mt-0.5 block text-base text-slate-600">Joignable 7j/7</span>
                  </dd>
                </div>
              </dl>
              <p className="mt-5 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-500">
                Batimove Sàrl, inscrite au registre du commerce de Genève. IDE <span className="tabular-nums">CHE-143.091.230</span>.
              </p>
            </section>

            <section aria-labelledby="devis-title" className="rounded-xl bg-[#0B1E33] p-6">
              <h2 id="devis-title" className="font-display text-xl font-medium tracking-tight text-white">
                Besoin d'un devis ?
              </h2>
              <p className="mt-2 text-lg leading-relaxed text-slate-300">
                Le plus rapide : notre devis en 4 étapes, gratuit et sans engagement. Réponse sous 30&nbsp;min (8h-19h).
              </p>
              <Link to="/quote" className={buttonClass('primary', 'lg', 'mt-5 w-full sm:w-auto')}>
                Demander un devis gratuit
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
                    Message envoyé
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-lg leading-relaxed text-slate-600">
                    Merci {sentName}. Notre équipe vous recontacte sous 30&nbsp;min (8h-19h), par téléphone ou par e-mail.
                  </p>
                  <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass('outline', 'lg')}
                    >
                      <WhatsappIcon className="h-5 w-5 text-[#075E54]" />
                      Écrire sur WhatsApp
                    </a>
                    <Button variant="ghost" size="lg" onClick={() => setSentName(null)}>
                      Envoyer un autre message
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 id="form-title" className="font-display text-2xl font-medium tracking-tight text-[#0B1E33]">
                    Écrivez-nous
                  </h2>
                  <p className="mt-1.5 text-base text-slate-600">
                    Nous vous recontactons sous 30&nbsp;min (8h-19h), par téléphone ou par e-mail.
                  </p>

                  {sendError && (
                    <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-800">
                      Votre message n'a pas pu être envoyé. Vérifiez votre connexion et réessayez, ou{' '}
                      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                        écrivez-nous sur WhatsApp
                      </a>{' '}
                      ou appelez le{' '}
                      <a href="tel:0800825925" className="whitespace-nowrap font-semibold underline underline-offset-2">
                        0800 825 925
                      </a>
                      .
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="contact-name" className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
                        Nom et prénom
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Ex. Marc Dupont"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        className={`${inputClass(!!errors.name)} h-12`}
                        {...errorProps('name')}
                      />
                      {errors.name && <p id="contact-name-error" className="mt-1.5 text-sm text-red-700">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
                        Téléphone
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
                        E-mail
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="vous@exemple.ch"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={`${inputClass(!!errors.email)} h-12`}
                        {...errorProps('email')}
                      />
                      {errors.email && <p id="contact-email-error" className="mt-1.5 text-sm text-red-700">{errors.email}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="contact-subject" className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
                        Votre demande concerne
                      </label>
                      <select
                        id="contact-subject"
                        value={form.subject}
                        onChange={(e) => update('subject', e.target.value)}
                        className={`${inputClass(false)} h-12 cursor-pointer`}
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="contact-message" className="mb-1.5 block text-base font-semibold text-[#0B1E33]">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        placeholder="Trajet, dates, volume approximatif, questions particulières…"
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        className={`${inputClass(!!errors.message)} min-h-[132px] resize-y py-3 leading-relaxed`}
                        {...errorProps('message')}
                      />
                      {errors.message && <p id="contact-message-error" className="mt-1.5 text-sm text-red-700">{errors.message}</p>}
                    </div>

                    <div className="flex flex-col gap-4 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                      <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full sm:w-auto">
                        Envoyer le message
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </Button>
                      <p className="text-sm text-slate-500">
                        Vos données servent uniquement à vous répondre.{' '}
                        <Link to="/privacy" className="underline underline-offset-2 hover:text-[#0B1E33]">
                          Protection des données
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
