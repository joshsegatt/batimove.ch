import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, ChevronRight, Loader2, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';
import { buttonClass } from '../components/UIComponents';
import { WhatsappIcon } from '../components/WhatsAppButton';
import { submitServiceQuote } from '../services/api';
import { trackGoogleAdsLeadConversion } from '../utils/analytics';
import { defineCopy, useLang } from '../i18n';

// Livraison & installation: serviço sob pedido. O que dá para fazer depende do
// objeto e do lugar, então a página não promete uma lista fechada: mostra o que
// fazemos com frequência e pede que o cliente descreva o caso antes do devis.

const COPY = defineCopy(
  {
    eyebrow: 'Sur demande',
    h1: 'Livraison et installation à Genève et dans le canton de Vaud',
    lead: "Un meuble acheté en magasin, une commande en ligne trop lourde, un appareil à monter à l'étage : décrivez-nous ce qu'il faut livrer et installer, nous confirmons ce qui est possible et vous envoyons un prix.",
    cta: 'Décrire ma livraison',
    freeCall: 'appel gratuit',
    oftenTitle: 'Ce que nous faisons souvent',
    often: [
      'Retrait en magasin, au dépôt ou au point de livraison',
      "Livraison à l'étage, même sans ascenseur",
      'Montage de meubles en kit ou livrés démontés',
      'Mise en place dans la pièce et évacuation des emballages',
      "Enlèvement de l'ancien meuble ou appareil, avec recyclage",
      'Monte-meubles si la cage d’escalier est trop étroite',
    ],
    dependsTitle: 'Pourquoi « sur demande » ?',
    dependsText:
      "Chaque installation est différente : un raccordement d'appareil, une fixation murale ou une pièce très lourde ne se traitent pas de la même façon. Nous regardons votre cas avant de nous engager, et nous vous disons clairement ce que nous faisons nous-mêmes et ce qui demande un spécialiste.",
    stepsTitle: 'Comment ça se passe',
    steps: [
      { t: 'Vous décrivez', d: "L'objet, le lieu de retrait, l'adresse de livraison et ce qu'il faut installer. Une photo aide." },
      { t: 'Nous confirmons', d: 'Ce qui est possible, le délai et un prix ferme avant toute intervention.' },
      { t: 'Nous livrons et installons', d: 'À la date convenue, avec le matériel de protection et de levage nécessaire.' },
    ],
    formTitle: 'Votre demande',
    what: 'Que faut-il livrer et installer ?',
    whatHint: "Ex. : armoire de 2 m achetée chez…, à monter au 3e sans ascenseur, reprendre l'ancienne.",
    from: 'Lieu de retrait',
    to: 'Adresse ou commune de livraison',
    date: 'Date souhaitée (facultatif)',
    name: 'Nom et prénom',
    phone: 'Téléphone',
    email: 'E-mail (facultatif)',
    submit: 'Envoyer ma demande',
    sending: 'Envoi…',
    required: 'Champ obligatoire',
    invalidPhone: 'Numéro trop court',
    error: "L'envoi n'a pas abouti. Réessayez ou appelez le 0800 825 925.",
    doneTitle: 'Merci, votre demande est envoyée.',
    doneText: 'Nous revenons vers vous avec ce qui est possible et un prix. Une photo nous aide : envoyez-la sur WhatsApp.',
    whatsapp: 'Envoyer une photo sur WhatsApp',
    faqTitle: 'Questions fréquentes',
    faq: [
      {
        q: 'Livrez-vous un seul meuble ?',
        a: 'Oui. Une livraison peut concerner un seul objet volumineux : décrivez-le et nous vous indiquons le prix.',
      },
      {
        q: 'Raccordez-vous les appareils électroménagers ?',
        a: "Cela dépend de l'appareil et du raccordement. Nous vous le confirmons avant l'intervention ; si un spécialiste est nécessaire, nous vous le disons.",
      },
      {
        q: "Pouvez-vous reprendre l'ancien meuble ?",
        a: "Oui, nous l'enlevons en même temps et l'apportons au tri ou au recyclage.",
      },
      {
        q: 'Et pour un déménagement complet ?',
        a: "Utilisez plutôt notre devis de déménagement : il tient compte du volume, de l'accès et des deux adresses.",
      },
    ],
    moveLink: 'Devis de déménagement',
  },
  {
    eyebrow: 'On request',
    h1: 'Delivery and installation in Geneva and the canton of Vaud',
    lead: 'A piece of furniture bought in a shop, an online order too heavy to carry, an appliance to take upstairs: tell us what needs delivering and installing, we confirm what is possible and send you a price.',
    cta: 'Describe my delivery',
    freeCall: 'free call',
    oftenTitle: 'What we often do',
    often: [
      'Collection from the shop, warehouse or pick-up point',
      'Delivery to any floor, even without a lift',
      'Assembly of flat-pack or dismantled furniture',
      'Placing in the room and removal of packaging',
      'Removal of the old furniture or appliance, with recycling',
      'Furniture lift if the stairwell is too narrow',
    ],
    dependsTitle: 'Why “on request”?',
    dependsText:
      'Every installation is different: connecting an appliance, wall mounting or a very heavy item are not handled the same way. We look at your case before committing, and tell you clearly what we do ourselves and what needs a specialist.',
    stepsTitle: 'How it works',
    steps: [
      { t: 'You describe it', d: 'The item, the collection point, the delivery address and what needs installing. A photo helps.' },
      { t: 'We confirm', d: 'What is possible, the timing and a fixed price before anything happens.' },
      { t: 'We deliver and install', d: 'On the agreed date, with the protection and lifting equipment needed.' },
    ],
    formTitle: 'Your request',
    what: 'What needs delivering and installing?',
    whatHint: 'E.g. a 2 m wardrobe bought at…, to take to the 3rd floor without a lift, take away the old one.',
    from: 'Collection point',
    to: 'Delivery address or town',
    date: 'Preferred date (optional)',
    name: 'Full name',
    phone: 'Phone',
    email: 'Email (optional)',
    submit: 'Send my request',
    sending: 'Sending…',
    required: 'Required field',
    invalidPhone: 'Number too short',
    error: 'Sending failed. Please try again or call 0800 825 925.',
    doneTitle: 'Thank you, your request has been sent.',
    doneText: 'We will come back to you with what is possible and a price. A photo helps: send it on WhatsApp.',
    whatsapp: 'Send a photo on WhatsApp',
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        q: 'Do you deliver a single item?',
        a: 'Yes. A delivery can be a single bulky item: describe it and we will give you the price.',
      },
      {
        q: 'Do you connect household appliances?',
        a: 'It depends on the appliance and the connection. We confirm before the job; if a specialist is needed, we tell you.',
      },
      {
        q: 'Can you take away the old furniture?',
        a: 'Yes, we remove it at the same time and take it for sorting or recycling.',
      },
      {
        q: 'What about a full move?',
        a: 'Use our removal quote instead: it takes the volume, access and both addresses into account.',
      },
    ],
    moveLink: 'Removal quote',
  }
);

type Form = { what: string; from: string; to: string; date: string; name: string; phone: string; email: string };

const field = (bad: boolean) =>
  `mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-lg text-[#0B1E33] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600/25 ${
    bad ? 'border-red-600' : 'border-slate-300 focus:border-[#0B1E33]'
  }`;

export const Livraison: React.FC = () => {
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const [form, setForm] = useState<Form>({ what: '', from: '', to: '', date: '', name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: Partial<Record<keyof Form, string>> = {};
    if (!form.what.trim()) found.what = c.required;
    if (!form.to.trim()) found.to = c.required;
    if (!form.name.trim()) found.name = c.required;
    if (!form.phone.trim()) found.phone = c.required;
    else if (form.phone.replace(/\D/g, '').length < 9) found.phone = c.invalidPhone;
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`liv-${first}`)?.focus();
      return;
    }
    setSending(true);
    setFailed(false);
    try {
      await submitServiceQuote({
        serviceName: 'Livraison & installation',
        clientName: form.name.trim(),
        clientEmail: form.email.trim() || 'Non renseigné',
        clientPhone: form.phone.trim(),
        date: form.date.trim() || 'Non spécifiée',
        fromCity: form.from.trim(),
        toCity: form.to.trim(),
        details: form.what.trim(),
        source: 'la page Livraison & installation',
        clientLang: lang,
      });
      trackGoogleAdsLeadConversion({ leadId: crypto.randomUUID() });
      setDone(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  const err = (k: keyof Form) =>
    errors[k] ? (
      <p id={`liv-${k}-err`} className="mt-1.5 text-base font-medium text-red-700">
        {errors[k]}
      </p>
    ) : null;
  const a = (k: keyof Form) => ({
    id: `liv-${k}`,
    'aria-invalid': !!errors[k] || undefined,
    'aria-describedby': errors[k] ? `liv-${k}-err` : undefined,
  });

  return (
    <div className="bg-white text-[#0B1E33]">
      <SEO />

      <section className="bg-glacier">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#0369A1]">{c.eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">{c.h1}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 xl:text-xl">{c.lead}</p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <a href="#liv-form" className={buttonClass('primary', 'lg')}>
                {c.cta}
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="tel:0800825925" className="inline-flex items-center gap-2 py-2 text-lg font-semibold transition-colors hover:text-[#0369A1]">
                <Phone className="h-5 w-5" aria-hidden="true" />
                <span className="tabular-nums">0800 825 925</span>
                <span className="text-base font-normal text-slate-600">{c.freeCall}</span>
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-glacier-line bg-white p-6 shadow-raised lg:col-span-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">{c.oftenTitle}</h2>
            <ul className="mt-4 divide-y divide-slate-100">
              {c.often.map((o) => (
                <li key={o} className="flex items-start gap-3 py-3 text-lg leading-snug">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#0369A1]" strokeWidth={2.5} aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1E33] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl font-medium tracking-tight">{c.dependsTitle}</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">{c.dependsText}</p>
          </div>
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-7">
            {c.steps.map((s, i) => (
              <li key={s.t} className="border-t border-white/20 pt-5">
                <span className="font-mono text-sm text-sky-300 tabular-nums">0{i + 1}</span>
                <h3 className="mt-2 font-display text-xl font-medium">{s.t}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-300">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="liv-form" className="scroll-mt-24 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
          <div className="lg:col-span-7">
            {done ? (
              <div role="status" className="rounded-2xl border border-glacier-line bg-glacier p-8">
                <h2 className="font-display text-3xl font-medium tracking-tight">{c.doneTitle}</h2>
                <p className="mt-3 text-lg leading-relaxed text-slate-600">{c.doneText}</p>
                <a
                  href="https://wa.me/41798896406"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-[#1F7A4D] px-6 text-lg font-semibold text-white transition-colors hover:bg-[#186440]"
                >
                  <WhatsappIcon className="h-5 w-5" />
                  {c.whatsapp}
                </a>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="space-y-6">
                <h2 className="font-display text-3xl font-medium tracking-tight">{c.formTitle}</h2>
                <div>
                  <label htmlFor="liv-what" className="text-lg font-semibold">{c.what}</label>
                  <textarea {...a('what')} rows={4} value={form.what} onChange={set('what')} placeholder={c.whatHint} className={field(!!errors.what)} />
                  {err('what')}
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="liv-from" className="text-lg font-semibold">{c.from}</label>
                    <input {...a('from')} value={form.from} onChange={set('from')} className={field(false)} />
                  </div>
                  <div>
                    <label htmlFor="liv-to" className="text-lg font-semibold">{c.to}</label>
                    <input {...a('to')} value={form.to} onChange={set('to')} autoComplete="address-level2" className={field(!!errors.to)} />
                    {err('to')}
                  </div>
                  <div>
                    <label htmlFor="liv-date" className="text-lg font-semibold">{c.date}</label>
                    <input {...a('date')} type="date" value={form.date} onChange={set('date')} className={field(false)} />
                  </div>
                  <div>
                    <label htmlFor="liv-name" className="text-lg font-semibold">{c.name}</label>
                    <input {...a('name')} value={form.name} onChange={set('name')} autoComplete="name" className={field(!!errors.name)} />
                    {err('name')}
                  </div>
                  <div>
                    <label htmlFor="liv-phone" className="text-lg font-semibold">{c.phone}</label>
                    <input {...a('phone')} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" className={field(!!errors.phone)} />
                    {err('phone')}
                  </div>
                  <div>
                    <label htmlFor="liv-email" className="text-lg font-semibold">{c.email}</label>
                    <input {...a('email')} type="email" value={form.email} onChange={set('email')} autoComplete="email" className={field(false)} />
                  </div>
                </div>
                {failed && (
                  <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-800">
                    {c.error}
                  </p>
                )}
                <button type="submit" disabled={sending} className={buttonClass('primary', 'lg', 'w-full sm:w-auto disabled:opacity-70')}>
                  {sending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      {c.sending}
                    </>
                  ) : (
                    <>
                      {c.submit}
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <aside className="lg:col-span-5">
            <h2 className="font-display text-2xl font-medium tracking-tight">{c.faqTitle}</h2>
            <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              {c.faq.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold transition-colors hover:text-[#0369A1] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="pb-5 text-lg leading-relaxed text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
            <Link to={lp('/quote')} className="mt-6 inline-flex items-center gap-1.5 text-lg font-semibold text-[#0369A1] underline decoration-sky-200 underline-offset-4 hover:decoration-[#0369A1]">
              {c.moveLink}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
};
