import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Building2, Check, ChevronDown, ChevronRight, Droplets, House, Loader2, PaintRoller, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';
import { FadeImg } from '../components/FadeImg';
import { useRevealOnce } from '../hooks/useRevealOnce';
import { lineStyle } from '../utils/reveal';
import { RENO_BTN } from '../components/renovation/RenovationLayout';
import { WhatsappIcon } from '../components/WhatsAppButton';
import {
  RENOVATION_COMMON,
  RENOVATION_FAQ,
  RENOVATION_SERVICES,
  renovationById,
  type FaqItem,
  type RenovationGroup,
  type RenovationId,
} from '../data/renovation';
import { submitServiceQuote } from '../services/api';
import { BATIMOVE_WHATSAPP } from '../data/quoteServices';
import { trackGoogleAdsLeadConversion } from '../utils/analytics';
import { defineCopy, localizePath, useLang, type Lang } from '../i18n';

// Batimove Rénovation: página principal (/renovation), uma página por serviço
// (/renovation/<serviço>) e o pedido de devis (/renovation/devis).
// Fotos de matéria (RENO_IMG) até chegarem as fotos reais de obras; o resto do
// peso visual vem da tipografia e das linhas finas.

const ORIGIN = 'https://www.batimove.ch';

const COPY = defineCopy(
  {
    h1: 'Rénovation et étanchéité à Genève.',
    h1Accent: 'Un seul interlocuteur.',
    lead: "Appartements, maisons et immeubles : nous coordonnons vos travaux avec des artisans qualifiés et assurés, et nous pouvons vider, stocker et réinstaller vos meubles le temps du chantier.",
    cta: 'Décrire mon projet',
    heroAlt: 'Mur enduit à la chaux et sol en terre cuite dans la lumière du soir',
    pickerTitle: 'Par où commencer ?',
    pickerLead: 'Choisissez votre situation.',
    intents: [
      { title: 'Une pièce à refaire', text: 'Salle de bain, cuisine, peinture, sols', to: '#reno-services' },
      { title: 'Tout le logement', text: 'Appartement ou maison, de A à Z', to: '/renovation/appartement-maison' },
      { title: 'Humidité ou infiltration', text: 'Toit plat, terrasse, balcon, cave', to: '#reno-water' },
      { title: 'Un immeuble', text: 'Régies, PPE et propriétaires', to: '/renovation/immeubles' },
    ],
    freeCall: 'appel gratuit',
    indexTitle: 'Nos prestations',
    servicesTitle: 'Ce que nous rénovons',
    servicesLead: "De la pièce d'eau à la toiture, chaque prestation a sa page : ce qui est compris, quand nous appeler et les questions fréquentes.",
    waterTitle: 'Une infiltration ne se repeint pas.',
    waterText:
      "Une tache qui revient, une peinture qui cloque, du salpêtre au bas d'un mur : ce sont des symptômes. Avant toute finition, nous cherchons d'où vient l'eau, puis nous traitons la cause.",
    waterSigns: [
      'Auréoles au plafond sous une terrasse ou un toit plat',
      'Joints de balcon qui s’effritent, carrelage qui se soulève',
      'Odeur de moisi, salpêtre, enduit qui s’écaille en cave',
      'Eau au sol après de fortes pluies',
    ],
    waterLinks: 'Voir la prestation',
    waterAlt: 'Terrasse carrelée et écoulement de sol après la pluie',
    stepsTitle: 'Comment se passe un chantier',
    synergyTitle: 'Rénover sans rien porter vous-même.',
    synergyText: "Batimove est d'abord une entreprise de déménagement. Pour un chantier, tout est sous le même toit :",
    synergyNote: 'Chaque lien ouvre la prestation sur notre site déménagement.',
    synergyItems: [
      { text: 'Meubles déménagés et gardés en garde-meubles pendant les travaux', to: '/garde-meubles' },
      { text: 'Débarras et évacuation de ce qui ne revient pas', to: '/debarras' },
      { text: 'Nettoyage de fin de chantier', to: '/nettoyage-fin-de-bail' },
      { text: 'Réinstallation une fois le logement prêt', to: '/' },
    ],
    proTitle: 'Un interlocuteur pour tout un immeuble.',
    proText:
      "Remise en état entre deux locataires, parties communes, toitures, façades et sous-sols. Devis clairs, avec variantes si besoin, pour le propriétaire ou l'assemblée de PPE.",
    proCta: 'Rénovation d’immeubles',
    faqTitle: 'Questions fréquentes',
    finalTitle: 'Parlez-nous de votre projet.',
    finalText: 'Décrivez les travaux en 2 minutes. Nous vous rappelons pour fixer la visite sur place.',
    // Página de serviço
    crumbRoot: 'Rénovation',
    breadcrumb: "Fil d'Ariane",
    includesTitle: 'Ce que nous prenons en charge',
    signsTitle: 'Quand nous appeler',
    zoneNote: 'Genève en priorité · canton de Vaud selon la prestation',
    othersTitle: 'Autres prestations',
    serviceCta: 'Demander un devis',
  },
  {
    h1: 'Renovation and waterproofing in Geneva.',
    h1Accent: 'One point of contact.',
    lead: 'Flats, houses and apartment buildings: we coordinate your works with qualified, insured tradespeople, and we can empty, store and bring back your furniture for the duration of the job.',
    cta: 'Describe my project',
    heroAlt: 'Lime plaster wall and terracotta floor in the evening light',
    pickerTitle: 'Where to start?',
    pickerLead: 'Pick your situation.',
    intents: [
      { title: 'A room to redo', text: 'Bathroom, kitchen, painting, floors', to: '#reno-services' },
      { title: 'The whole home', text: 'Flat or house, from A to Z', to: '/renovation/appartement-maison' },
      { title: 'Damp or a leak', text: 'Flat roof, terrace, balcony, cellar', to: '#reno-water' },
      { title: 'A building', text: 'Letting agencies, co-owners and landlords', to: '/renovation/immeubles' },
    ],
    freeCall: 'free call',
    indexTitle: 'Our services',
    servicesTitle: 'What we renovate',
    servicesLead: 'From bathrooms to roofs, each service has its own page: what is included, when to call us and frequently asked questions.',
    waterTitle: 'You cannot paint over a leak.',
    waterText:
      'A stain that comes back, blistering paint, saltpetre at the base of a wall: these are symptoms. Before any finishing work, we find where the water comes from, then we treat the cause.',
    waterSigns: [
      'Rings on the ceiling below a terrace or flat roof',
      'Crumbling balcony joints, tiles lifting',
      'Musty smell, saltpetre, flaking render in the cellar',
      'Water on the floor after heavy rain',
    ],
    waterLinks: 'See the service',
    waterAlt: 'Tiled terrace and floor drain after rain',
    stepsTitle: 'How a renovation works',
    synergyTitle: 'Renovate without lifting a box.',
    synergyText: 'Batimove is first a removals company. For a renovation, everything is under one roof:',
    synergyNote: 'Each link opens the service on our removals site.',
    synergyItems: [
      { text: 'Furniture moved out and kept in storage during the work', to: '/garde-meubles' },
      { text: 'Clearance and disposal of what is not coming back', to: '/debarras' },
      { text: 'Post-construction cleaning', to: '/nettoyage-fin-de-bail' },
      { text: 'Everything moved back once the home is ready', to: '/' },
    ],
    proTitle: 'One contact for a whole building.',
    proText:
      'Making good between tenants, common parts, roofs, façades and basements. Clear quotes, with options where useful, for the owner or the co-owners’ meeting.',
    proCta: 'Building renovation',
    faqTitle: 'Frequently asked questions',
    finalTitle: 'Tell us about your project.',
    finalText: 'Describe the work in 2 minutes. We call you back to arrange the site visit.',
    crumbRoot: 'Renovation',
    breadcrumb: 'Breadcrumb',
    includesTitle: 'What we take care of',
    signsTitle: 'When to call us',
    zoneNote: 'Geneva first · canton of Vaud depending on the service',
    othersTitle: 'Other services',
    serviceCta: 'Request a quote',
  }
);

const PROVIDER = {
  '@type': 'HomeAndConstructionBusiness',
  name: 'Batimove Sàrl',
  url: `${ORIGIN}/renovation`,
  telephone: '+41800825925',
  email: 'info@batimove.ch',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rue de Monthoux 64',
    postalCode: '1201',
    addressLocality: 'Genève',
    addressCountry: 'CH',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Canton de Genève' },
    { '@type': 'AdministrativeArea', name: 'Canton de Vaud' },
  ],
};

const faqSchema = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

const pad = (n: number) => String(n).padStart(2, '0');

const PhoneLink: React.FC<{ label: string; tone?: 'light' | 'dark' }> = ({ label, tone = 'light' }) => (
  <a
    href="tel:0800825925"
    className={`inline-flex items-center gap-2 py-2 text-lg font-semibold transition-colors duration-150 ${
      tone === 'light' ? 'text-reno-ink hover:text-reno-clay' : 'text-white hover:text-[#E4A58C]'
    }`}
  >
    <Phone className="h-5 w-5" aria-hidden="true" />
    <span className="tabular-nums">0800 825 925</span>
    <span className={`text-base font-normal ${tone === 'light' ? 'text-slate-600' : 'text-stone-400'}`}>{label}</span>
  </a>
);

/**
 * Fotos de matéria (geradas por IA): close-ups de materiais e detalhes, sem
 * pessoas e sem obra "pronta", para não se passarem por chantiers da Batimove.
 * Quando chegarem fotos reais de obras, elas substituem estas.
 */
const RENO_IMG = {
  hero: '/photos/reno-matiere',
  zellige: '/photos/reno-zellige',
  cuisine: '/photos/reno-cuisine',
  chaux: '/photos/reno-chaux',
  parquet: '/photos/reno-parquet',
  toit: '/photos/reno-toit',
  facade: '/photos/reno-facade',
  plans: '/photos/reno-plans',
  cave: '/photos/reno-cave',
  escalier: '/photos/reno-escalier',
  balcon: '/photos/reno-balcon',
};
const SERVICE_IMG: Record<RenovationId, string> = {
  'appartement-maison': RENO_IMG.plans,
  'salle-de-bain': RENO_IMG.zellige,
  cuisine: RENO_IMG.cuisine,
  peinture: RENO_IMG.chaux,
  sols: RENO_IMG.parquet,
  'etancheite-toiture-terrasse': RENO_IMG.toit,
  'etancheite-sous-sol': RENO_IMG.cave,
  facades: RENO_IMG.facade,
  immeubles: RENO_IMG.escalier,
};
/** Foto 4:3 responsiva (640 / 1200); a do hero também existe em 1280. */
const imgSet = (base: string) => ({
  src: `${base}-640.webp`,
  srcSet: `${base}-640.webp 640w, ${base}-1200.webp 1200w`,
});

/** Célula do seletor do hero: superfície branca que fica pierre no hover. */
const PICK_CELL =
  'group flex h-full items-start gap-4 bg-white px-4 py-4 transition-colors duration-150 hover:bg-reno-stone focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-reno-clay motion-reduce:transition-none lg:px-5 lg:py-5';
const PICK_ICON = 'grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-reno-stone text-reno-ink';
const INTENT_ICONS = [PaintRoller, House, Droplets, Building2];

/**
 * Cartão de prestação. Hover honesto (DESIGN.md): sobe 2px e passa de rest a
 * raised; a foto aproxima devagar como único sinal extra. O cartão em destaque
 * (Rénovation complète) fica horizontal e mostra o que está incluído.
 */
const ServiceCard: React.FC<{ id: RenovationId; featured?: boolean }> = ({ id, featured }) => {
  const { lang, lp } = useLang();
  const s = renovationById(id);
  const c = s[lang];
  return (
    <Link
      to={lp(s.path)}
      className={`group flex h-full overflow-hidden rounded-xl border border-reno-line bg-white shadow-rest transition-[border-color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:border-reno-ink/30 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reno-clay motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        featured ? 'flex-col sm:flex-row' : 'flex-row sm:flex-col'
      }`}
    >
      <div className={`shrink-0 overflow-hidden bg-reno-stone ${featured ? 'h-48 sm:h-auto sm:w-1/2' : 'w-28 sm:h-44 sm:w-auto'}`}>
        <FadeImg
          {...imgSet(SERVICE_IMG[id])}
          sizes={featured ? '(min-width: 1024px) 420px, 100vw' : '(min-width: 1024px) 400px, 100vw'}
          alt=""
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className={`flex min-w-0 flex-1 flex-col ${featured ? 'p-5 sm:p-7' : 'p-4 sm:p-5'}`}>
        <h3 className={`font-display font-medium tracking-tight text-reno-ink ${featured ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>{c.name}</h3>
        <p className={`mt-1.5 text-base leading-relaxed text-slate-600 ${featured ? '' : 'hidden sm:block'}`}>{c.summary}</p>
        {featured && (
          <ul className="mt-4 hidden space-y-2 sm:block">
            {c.includes.slice(0, 3).map((it) => (
              <li key={it} className="flex items-start gap-2.5 text-base leading-relaxed text-reno-ink">
                <Check className="mt-1 h-4 w-4 shrink-0 text-reno-clay" strokeWidth={2.5} aria-hidden="true" />
                {it}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-base font-semibold text-reno-clay sm:pt-5">
          {c.hint}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

const Steps: React.FC<{ title: string; tone?: 'stone' | 'white' }> = ({ title, tone = 'white' }) => {
  const { lang } = useLang();
  const steps = RENOVATION_COMMON[lang].steps;
  const reveal = useRevealOnce<HTMLOListElement>(0.25);
  return (
    <section aria-labelledby="reno-steps" className={tone === 'stone' ? 'bg-reno-stone' : 'bg-white'}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="reno-steps" className="font-display text-3xl font-medium tracking-tight text-reno-ink lg:text-4xl">
          {title}
        </h2>
        <ol ref={reveal.ref} className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((st, i) => (
            <li key={st.title} className="relative border-t-2 border-reno-line pt-5">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -top-0.5 h-0.5 origin-left bg-reno-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={lineStyle(reveal.pending, i * 220)}
              />
              <span className="font-mono text-sm text-reno-clay tabular-nums">{pad(i + 1)}</span>
              <h3 className="mt-2 font-display text-xl font-medium tracking-tight text-reno-ink">{st.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-slate-600">{st.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

const Faq: React.FC<{ title: string; items: FaqItem[]; tone?: 'stone' | 'white' }> = ({ title, items, tone = 'white' }) => (
  <section aria-labelledby="reno-faq" className={tone === 'stone' ? 'bg-reno-stone' : 'bg-white'}>
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
      <h2 id="reno-faq" className="font-display text-3xl font-medium tracking-tight text-reno-ink lg:col-span-4 lg:text-4xl">
        {title}
      </h2>
      <div className="divide-y divide-reno-line border-y border-reno-line lg:col-span-8">
        {items.map((f) => (
          <details key={f.q} className="faq-item group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-sm py-5 text-lg font-semibold text-reno-ink transition-colors duration-150 hover:text-reno-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reno-clay [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="max-w-3xl pb-6 text-lg leading-relaxed text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const FinalCta: React.FC<{ to: string }> = ({ to }) => {
  const { lang, lp } = useLang();
  const c = COPY[lang];
  return (
    <section className="border-b border-white/10 bg-reno-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-medium tracking-tight lg:text-4xl">{c.finalTitle}</h2>
          <p className="mt-3 text-lg leading-relaxed text-stone-300">{c.finalText}</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link to={lp(to)} className={`${RENO_BTN} h-12 px-6 text-lg`}>
            {c.cta}
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <PhoneLink label={c.freeCall} tone="dark" />
        </div>
      </div>
    </section>
  );
};

/* ===================================================================== */
/* Página principal: /renovation                                          */
/* ===================================================================== */

export const RenovationHome: React.FC = () => {
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const common = RENOVATION_COMMON[lang];
  const groups: RenovationGroup[] = ['interieur', 'batiment'];
  // Um só gesto de movimento: o filete que se desenha, nas etapas e nos sinais de infiltração.
  const waterReveal = useRevealOnce<HTMLUListElement>(0.3);
  const schema = useMemo(
    () => [
      { '@context': 'https://schema.org', ...PROVIDER, description: c.lead },
      faqSchema(RENOVATION_FAQ[lang]),
    ],
    [lang, c.lead]
  );

  return (
    <div className="bg-white text-reno-ink selection:bg-reno-clay selection:text-white">
      <SEO schema={schema} />

      {/* HERO grafite: matéria em foto à direita (dissolvida no grafite do lado do
          texto), promessa à esquerda e, na base, o seletor por situação que desce
          sobre a faixa pierre (o mesmo gesto do hero da mudança). */}
      <section className="relative">
        <div className="relative isolate bg-reno-ink text-white">
          <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[58%]">
            <img
              src={`${RENO_IMG.hero}-1280.webp`}
              srcSet={`${RENO_IMG.hero}-800.webp 800w, ${RENO_IMG.hero}-1280.webp 1280w, ${RENO_IMG.hero}-1920.webp 1920w`}
              sizes="(min-width: 1024px) 58vw, 100vw"
              alt={c.heroAlt}
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
              className="block aspect-[16/10] w-full object-cover sm:aspect-[2/1] lg:aspect-auto lg:h-full"
            />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-reno-ink via-reno-ink/60 to-transparent lg:hidden" />
            <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[35%] bg-gradient-to-r from-reno-ink via-reno-ink/80 to-transparent lg:block" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 max-w-xl pb-12 sm:-mt-20 lg:mt-0 lg:max-w-[33rem] lg:pb-48 lg:pt-14 xl:pt-16">
              <h1 className="font-display text-4xl font-medium leading-[1.04] tracking-tight text-balance sm:text-5xl">
                {c.h1} <span className="text-[#E4A58C]">{c.h1Accent}</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone-300 xl:text-xl">{c.lead}</p>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link to={lp('/renovation/devis')} className={`${RENO_BTN} h-12 px-6 text-lg`}>
                  {c.cta}
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <PhoneLink label={c.freeCall} tone="dark" />
              </div>
            </div>

            {/* Seletor por situação: quatro portas de entrada com palavras do cliente,
                que levam à seção ou à página certa (o devis fica no botão acima). */}
            <nav
              aria-labelledby="reno-index"
              className="relative z-10 -mb-24 overflow-hidden rounded-xl bg-white text-reno-ink shadow-modal lg:-mb-16 lg:-mt-28"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-4 lg:px-5">
                <h2 id="reno-index" className="font-display text-xl font-medium tracking-tight">{c.pickerTitle}</h2>
                <p className="hidden text-base text-slate-600 sm:block">{c.pickerLead}</p>
              </div>
              <ul className="grid grid-cols-1 gap-px border-t border-reno-line bg-reno-line sm:grid-cols-2 lg:grid-cols-4">
                {c.intents.map((it, i) => {
                  const Icon = INTENT_ICONS[i];
                  const inner = (
                    <>
                      <span className={PICK_ICON}>
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-semibold leading-snug transition-colors duration-150 group-hover:text-reno-clay">{it.title}</span>
                        <span className="block text-base leading-snug text-slate-600">{it.text}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={it.title} className="min-w-0">
                      {it.to.startsWith('#') ? (
                        <a href={it.to} className={PICK_CELL}>
                          {inner}
                        </a>
                      ) : (
                        <Link to={lp(it.to)} className={PICK_CELL}>
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Faixa pierre: as quatro garantias. */}
        <div className="bg-reno-stone">
          <ul
            aria-label={common.trust.map((t) => t.title).join(', ')}
            className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-14 pt-32 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8 lg:pb-16 lg:pt-28"
          >
            {common.trust.map((t) => (
              <li key={t.title} className="border-t border-reno-line pt-5">
                <h3 className="font-display text-lg font-medium tracking-tight">{t.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Prestações por grupo */}
      <section aria-labelledby="reno-services" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 id="reno-services" className="scroll-mt-28 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              {c.servicesTitle}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-slate-600">{c.servicesLead}</p>
          </div>
          {groups.map((g) => (
            <div key={g} className="mt-12">
              <h3 className="border-b border-reno-line pb-3 font-display text-xl font-medium tracking-tight text-reno-ink">
                {common.groups[g]}
              </h3>
              {/* Intérieur: 5 cartões, o primeiro em destaque (2 colunas); Bâtiment: 4 numa linha */}
              <ul className={`mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 ${g === 'interieur' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
                {RENOVATION_SERVICES.filter((s) => s.group === g).map((s, i) => {
                  const featured = g === 'interieur' && i === 0;
                  return (
                    <li key={s.id} className={featured ? 'sm:col-span-2' : undefined}>
                      <ServiceCard id={s.id} featured={featured} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Diferença (o que nenhum renovador tem): a Batimove também muda, guarda, debarrassa e limpa */}
      <section aria-labelledby="reno-synergy" className="bg-reno-ink text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-5">
            <h2 id="reno-synergy" className="font-display text-3xl font-medium tracking-tight lg:text-4xl">
              {c.synergyTitle}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-stone-300">{c.synergyText}</p>
            <p className="mt-4 text-base text-stone-400">{c.synergyNote}</p>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {c.synergyItems.map((it, i) => (
              <li key={it.text}>
                <Link
                  to={lp(it.to)}
                  className="group flex h-full flex-col justify-between gap-6 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-white/25 hover:bg-reno-raise focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4A58C] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className="font-mono text-sm text-[#E4A58C] tabular-nums">{pad(i + 1)}</span>
                  <span className="flex items-end justify-between gap-3 text-lg font-medium leading-snug">
                    {it.text}
                    <ArrowRight className="h-4 w-4 shrink-0 text-stone-400 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Étanchéité: causa antes da finição */}
      <section aria-labelledby="reno-water" className="bg-reno-stone">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-7">
            <h2 id="reno-water" className="scroll-mt-28 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              {c.waterTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{c.waterText}</p>
            <ul ref={waterReveal.ref} className="mt-8 border-t border-reno-line">
              {c.waterSigns.map((sign, i) => (
                <li key={sign} className="relative flex items-start gap-3 border-b border-reno-line py-4 text-lg">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-px origin-left bg-reno-clay transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                    style={lineStyle(waterReveal.pending, i * 160)}
                  />
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-reno-clay" />
                  {sign}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(['etancheite-toiture-terrasse', 'etancheite-sous-sol'] as RenovationId[]).map((id) => {
                const s = renovationById(id);
                return (
                  <Link
                    key={id}
                    to={lp(s.path)}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-reno-line bg-white px-4 py-3.5 shadow-rest transition-[border-color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:border-reno-ink/30 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reno-clay motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <span>
                      <span className="block text-sm text-slate-600">{c.waterLinks}</span>
                      <span className="block font-semibold">{s[lang].name}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-reno-clay" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-5">
            <FadeImg
              {...imgSet(RENO_IMG.balcon)}
              sizes="(min-width: 1024px) 480px, 100vw"
              alt={c.waterAlt}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-xl object-cover shadow-raised lg:aspect-auto lg:h-full"
            />
          </div>
        </div>
      </section>

      <Steps title={c.stepsTitle} />

      {/* Régies e PPE */}
      <section aria-labelledby="reno-pro" className="bg-reno-stone">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-end gap-8 rounded-xl border border-reno-line bg-white p-8 shadow-rest sm:p-10 lg:grid-cols-12 lg:p-12">
            <div className="lg:col-span-8">
              <h2 id="reno-pro" className="font-display text-3xl font-medium tracking-tight lg:text-4xl">
                {c.proTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{c.proText}</p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <Link
                to={lp('/renovation/immeubles')}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-reno-ink px-6 text-lg font-semibold transition-colors duration-150 hover:bg-reno-ink hover:text-white"
              >
                {c.proCta}
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Faq title={c.faqTitle} items={RENOVATION_FAQ[lang]} />
      <FinalCta to="/renovation/devis" />
    </div>
  );
};

/* ===================================================================== */
/* Página de serviço: /renovation/<serviço>                               */
/* ===================================================================== */

export const RenovationServicePage: React.FC<{ id: RenovationId }> = ({ id }) => {
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const s = renovationById(id);
  const sc = s[lang];
  const quoteTo = `/renovation/devis?type=${id}`;
  // Três do mesmo grupo e uma ponte para o outro: do interior para a umidade, do bâtiment para a reforma completa.
  const bridge: RenovationId = s.group === 'interieur' ? 'etancheite-sous-sol' : 'appartement-maison';
  const others = RENOVATION_SERVICES.filter((o) => o.id !== id && o.group === s.group)
    .slice(0, 3)
    .concat(id === bridge ? [] : [renovationById(bridge)]);
  const schema = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: sc.h1,
        serviceType: sc.name,
        description: sc.lead,
        provider: PROVIDER,
        areaServed: PROVIDER.areaServed,
        url: `${ORIGIN}${localizePath(s.path, lang)}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: c.crumbRoot, item: `${ORIGIN}${localizePath('/renovation', lang)}` },
          { '@type': 'ListItem', position: 2, name: sc.name, item: `${ORIGIN}${localizePath(s.path, lang)}` },
        ],
      },
      faqSchema(sc.faq),
    ],
    [lang, s.path, sc, c.crumbRoot]
  );

  return (
    <div className="bg-white text-reno-ink selection:bg-reno-clay selection:text-white">
      <SEO schema={schema} />

      <section className="bg-reno-stone">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pb-20">
          <nav aria-label={c.breadcrumb}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-600">
              <li>
                <Link to={lp('/renovation')} className="transition-colors hover:text-reno-ink">
                  {c.crumbRoot}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li aria-current="page" className="font-semibold text-reno-ink">
                {sc.name}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">{sc.h1}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 xl:text-xl">{sc.lead}</p>
              <p className="mt-4 text-base font-medium text-slate-600">{c.zoneNote}</p>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link to={lp(quoteTo)} className={`${RENO_BTN} h-12 px-6 text-lg`}>
                  {c.serviceCta}
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <PhoneLink label={c.freeCall} />
              </div>
            </div>

            <div className="lg:col-span-5">
              <img
                {...imgSet(SERVICE_IMG[id])}
                sizes="(min-width: 1024px) 480px, 100vw"
                alt=""
                width={1200}
                height={900}
                decoding="async"
                className="aspect-[16/10] w-full rounded-xl object-cover shadow-raised"
              />
            <div className="relative mx-4 -mt-16 rounded-xl border border-reno-line bg-white p-6 shadow-raised sm:mx-6">
              <h2 className="font-display text-xl font-medium tracking-tight text-reno-ink">{c.includesTitle}</h2>
              <ul className="mt-4 divide-y divide-reno-line">
                {sc.includes.map((it) => (
                  <li key={it} className="flex items-start gap-3 py-3 text-base leading-relaxed">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-reno-clay" strokeWidth={2.5} aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quando chamar */}
      <section aria-labelledby="reno-signs" className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <h2 id="reno-signs" className="font-display text-3xl font-medium tracking-tight lg:col-span-4 lg:text-4xl">
            {c.signsTitle}
          </h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-8">
            {sc.signs.map((sign) => (
              <li key={sign} className="flex items-start gap-3 border-t border-reno-line pt-4">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-reno-clay" />
                <p className="text-lg font-medium leading-snug">{sign}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Steps title={c.stepsTitle} tone="stone" />
      <Faq title={c.faqTitle} items={sc.faq} />

      <section aria-labelledby="reno-others" className="bg-reno-stone">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 id="reno-others" className="font-display text-2xl font-medium tracking-tight lg:text-3xl">
            {c.othersTitle}
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.id}>
                <ServiceCard id={o.id} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta to={quoteTo} />
    </div>
  );
};

/* ===================================================================== */
/* Pedido de devis: /renovation/devis                                    */
/* ===================================================================== */

const FORM_COPY = defineCopy(
  {
    title: 'Votre projet en 2 minutes.',
    lead: 'Décrivez les travaux : nous vous rappelons pour fixer une visite sur place, puis vous recevez un devis détaillé.',
    requiredNote: 'Tous les champs sont obligatoires, sauf ceux marqués « facultatif ».',
    optional: 'facultatif',
    project: 'Type de travaux',
    projectHint: 'Plusieurs choix possibles.',
    projectOther: 'Autre projet',
    projectRequired: 'Choisissez au moins un type de travaux',
    property: 'Type de bien',
    properties: ['Appartement', 'Maison', 'Immeuble ou PPE', 'Local commercial'],
    place: 'Commune ou NPA du chantier',
    placeHint: 'Genève en priorité ; canton de Vaud selon la prestation.',
    timing: 'Début souhaité',
    timings: ['Dès que possible', 'Dans les 3 mois', 'Dans 3 à 6 mois', 'Pas encore défini'],
    details: 'Décrivez le projet',
    detailsHint: 'Pièces concernées, surface approximative, ce qui vous gêne aujourd’hui.',
    contactTitle: 'Vos coordonnées',
    who: 'Vous êtes',
    whoOptions: ['Un particulier', 'Une régie, une PPE ou une entreprise'],
    company: 'Régie, PPE ou entreprise',
    units: 'Logements ou lots',
    name: 'Nom et prénom',
    phone: 'Téléphone',
    email: 'E-mail',
    photos: 'Des photos aident beaucoup : vous pourrez nous les envoyer par WhatsApp après la demande.',
    submit: 'Envoyer ma demande',
    sending: 'Envoi…',
    orCall: 'ou appelez le',
    freeCall: 'appel gratuit',
    after: 'Nous vous rappelons pour fixer la visite sur place. Vos données servent uniquement à établir votre devis.',
    privacyLink: 'Protection des données',
    required: 'Champ obligatoire',
    invalidPhone: 'Numéro incomplet, par exemple 079 123 45 67',
    invalidEmail: 'Adresse e-mail invalide',
    error: "L'envoi n'a pas abouti. Réessayez ou appelez le 0800 825 925.",
    doneTitle: 'Merci, votre demande est envoyée.',
    doneText: 'Nous vous rappelons pour fixer la visite sur place. Vous pouvez déjà nous envoyer des photos :',
    whatsapp: 'Envoyer des photos sur WhatsApp',
    photosMsg: (what: string, name: string) =>
      `Bonjour Batimove Rénovation, je viens d'envoyer une demande de devis (${what}) au nom de ${name}. Voici des photos :`,
    back: 'Retour à la rénovation',
    select: 'Choisir…',
  },
  {
    title: 'Your project in 2 minutes.',
    lead: 'Describe the work: we call you back to arrange a site visit, then you receive a detailed quote.',
    requiredNote: 'All fields are required unless marked “optional”.',
    optional: 'optional',
    project: 'Type of work',
    projectHint: 'You can pick several.',
    projectOther: 'Another project',
    projectRequired: 'Pick at least one type of work',
    property: 'Type of property',
    properties: ['Flat', 'House', 'Apartment building or co-ownership', 'Commercial premises'],
    place: 'Town or postcode of the site',
    placeHint: 'Geneva first; canton of Vaud depending on the service.',
    timing: 'Preferred start',
    timings: ['As soon as possible', 'Within 3 months', 'In 3 to 6 months', 'Not decided yet'],
    details: 'Describe the project',
    detailsHint: 'Rooms involved, approximate area, what bothers you today.',
    contactTitle: 'Your details',
    who: 'You are',
    whoOptions: ['A private individual', 'A letting agency, co-ownership or company'],
    company: 'Agency, co-ownership or company',
    units: 'Flats or units',
    name: 'Full name',
    phone: 'Phone',
    email: 'Email',
    photos: 'Photos help a lot: you can send them to us on WhatsApp after your request.',
    submit: 'Send my request',
    sending: 'Sending…',
    orCall: 'or call',
    freeCall: 'free call',
    after: 'We call you back to arrange the site visit. Your details are used only to prepare your quote.',
    privacyLink: 'Privacy policy',
    required: 'Required field',
    invalidPhone: 'Incomplete number, for example 079 123 45 67',
    invalidEmail: 'Invalid email address',
    error: 'Sending failed. Please try again or call 0800 825 925.',
    doneTitle: 'Thank you, your request has been sent.',
    doneText: 'We will call you back to arrange the site visit. You can already send us photos:',
    whatsapp: 'Send photos on WhatsApp',
    photosMsg: (what: string, name: string) =>
      `Hello Batimove Renovation, I have just sent a quote request (${what}) under the name ${name}. Here are some photos:`,
    back: 'Back to renovation',
    select: 'Choose…',
  }
);

type FormState = {
  projects: string[];
  property: string;
  place: string;
  timing: string;
  details: string;
  client: 'particulier' | 'pro';
  company: string;
  units: string;
  name: string;
  phone: string;
  email: string;
};
type TextField = Exclude<keyof FormState, 'projects' | 'client'>;

/** Campo de texto: raio de 8px (DESIGN.md: 12px é de botões e cartões). */
const fieldClass = (invalid: boolean) =>
  `mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-lg text-reno-ink transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-reno-clay/40 ${
    invalid ? 'border-red-600 focus:border-red-600' : 'border-reno-line focus:border-reno-ink'
  }`;

/** Opção marcável (tipo de obra): fica grafite quando escolhida, com o visto à esquerda. */
const CHIP =
  'inline-flex cursor-pointer select-none items-center gap-2 rounded-lg border bg-white px-3.5 py-2.5 text-base font-medium text-reno-ink transition-colors duration-150 hover:border-slate-400 has-[:checked]:border-reno-ink has-[:checked]:bg-reno-ink has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-reno-clay/50 has-[:focus-visible]:ring-offset-2 motion-reduce:transition-none';

/** Cartão de escolha única (tipo de bien, particulier ou régie). */
const choiceClass = (invalid: boolean) =>
  `flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-lg transition-colors duration-150 has-[:checked]:border-reno-ink has-[:checked]:bg-reno-stone has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-reno-clay/40 ${
    invalid ? 'border-red-600' : 'border-reno-line hover:border-slate-400'
  }`;

/** Telefone suíço (0XX XXX XX XX) ou internacional (+ / 00 e 8 a 15 dígitos). */
const phoneOk = (raw: string) => {
  const v = raw.trim();
  const digits = v.replace(/\D/g, '');
  if (v.startsWith('+')) return digits.length >= 8 && digits.length <= 15;
  if (digits.startsWith('00')) return digits.length >= 10 && digits.length <= 17;
  return /^0\d{9}$/.test(digits);
};

const DRAFT_KEY = 'batimove-reno-devis';

export const RenovationQuote: React.FC = () => {
  const { lang, lp } = useLang();
  const f = FORM_COPY[lang];
  const [params] = useSearchParams();
  const preset = RENOVATION_SERVICES.find((s) => s.id === params.get('type'));
  const [form, setForm] = useState<FormState>({
    projects: preset ? [preset.id] : [],
    property: '',
    place: '',
    timing: '',
    details: '',
    client: 'particulier',
    company: '',
    units: '',
    name: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);
  const pro = form.client === 'pro';
  const [draftReady, setDraftReady] = useState(false);

  // Rascunho na sessão: quem sai para ler uma prestação e volta encontra o que já preencheu.
  // Lido depois da montagem para não divergir do HTML pré-renderizado.
  useEffect(() => {
    setDraftReady(true);
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Partial<FormState>;
      setForm((s) => ({
        ...s,
        ...d,
        client: d.client === 'pro' ? 'pro' : 'particulier',
        projects: Array.from(new Set([...(Array.isArray(d.projects) ? d.projects : []), ...s.projects])),
      }));
    } catch {
      /* sem storage (modo privado, bloqueado): segue sem rascunho */
    }
  }, []);
  // Só grava depois de ler o rascunho, para não apagá-lo com o formulário vazio.
  useEffect(() => {
    if (!draftReady) return;
    try {
      if (done) sessionStorage.removeItem(DRAFT_KEY);
      else sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* idem */
    }
  }, [form, done, draftReady]);

  const clearError = (k: keyof FormState) => {
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const set = (k: TextField) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((s) => ({ ...s, [k]: e.target.value }));
    clearError(k);
  };
  const toggleProject = (id: string) => {
    setForm((s) => ({ ...s, projects: s.projects.includes(id) ? s.projects.filter((p) => p !== id) : [...s.projects, id] }));
    clearError('projects');
  };
  const setClient = (client: FormState['client']) => {
    setForm((s) => ({ ...s, client }));
    clearError('company');
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.projects.length === 0) e.projects = f.projectRequired;
    if (!form.property) e.property = f.required;
    if (!form.place.trim()) e.place = f.required;
    if (pro && !form.company.trim()) e.company = f.required;
    if (!form.name.trim()) e.name = f.required;
    if (!form.phone.trim()) e.phone = f.required;
    else if (!phoneOk(form.phone)) e.phone = f.invalidPhone;
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = f.invalidEmail;
    return e;
  };

  // E-mail para a equipe: sempre em francês, seja qual for o idioma da página.
  const frLabel = (list: 'properties' | 'timings', value: string) => {
    const i = FORM_COPY[lang][list].indexOf(value);
    return i >= 0 ? FORM_COPY.fr[list][i] : value;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    const first = (Object.keys(found) as (keyof FormState)[]).find((k) => found[k]);
    if (first) {
      document.getElementById(`reno-${first}`)?.focus();
      return;
    }
    setSending(true);
    setFailed(false);
    // Na ordem do catálogo, não na ordem dos cliques.
    const projectsFr = [
      ...RENOVATION_SERVICES.filter((s) => form.projects.includes(s.id)).map((s) => s.fr.name),
      ...(form.projects.includes('autre') ? [FORM_COPY.fr.projectOther] : []),
    ].join(', ');
    try {
      await submitServiceQuote({
        serviceName: `Rénovation : ${projectsFr}`,
        clientName: form.name.trim(),
        clientEmail: form.email.trim() || 'Non renseigné',
        clientPhone: form.phone.trim(),
        date: form.timing ? frLabel('timings', form.timing) : 'Non précisé',
        fromCity: form.place.trim(),
        details: [
          pro ? `Client professionnel : ${form.company.trim()}` : 'Client particulier',
          pro && form.units.trim() && `Logements ou lots : ${form.units.trim()}`,
          `Bien : ${frLabel('properties', form.property)}`,
          form.details.trim() && `Projet : ${form.details.trim()}`,
        ]
          .filter(Boolean)
          .join(' · '),
        source: pro ? 'le formulaire Rénovation (régie / PPE / entreprise)' : 'le formulaire Rénovation',
        clientLang: lang,
      });
      trackGoogleAdsLeadConversion({ leadId: crypto.randomUUID() });
      setDone(true);
      window.scrollTo({ top: 0 });
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  const err = (k: keyof FormState) =>
    errors[k] ? (
      <p id={`reno-${k}-err`} className="mt-1.5 text-base font-medium text-red-700">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: TextField, hint?: boolean) => ({
    id: `reno-${k}`,
    'aria-invalid': !!errors[k] || undefined,
    'aria-describedby': [errors[k] && `reno-${k}-err`, hint && `reno-${k}-hint`].filter(Boolean).join(' ') || undefined,
  });
  // Link de fotos da confirmação: a mensagem já diz que vem da Rénovation e de qual pedido.
  const photosUrl = `https://wa.me/${BATIMOVE_WHATSAPP}?text=${encodeURIComponent(
    f.photosMsg(
      [
        ...RENOVATION_SERVICES.filter((s) => form.projects.includes(s.id)).map((s) => s[lang].name),
        ...(form.projects.includes('autre') ? [f.projectOther] : []),
      ].join(', '),
      form.name.trim()
    )
  )}`;
  const Optional = () => <span className="font-normal text-slate-600"> ({f.optional})</span>;

  return (
    <div className="min-h-[70vh] bg-reno-stone text-reno-ink">
      <SEO />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        {done ? (
          <div className="rounded-xl border border-reno-line bg-white p-8 shadow-raised sm:p-10" role="status">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-reno-clay-soft text-reno-clay">
              <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-medium tracking-tight">{f.doneTitle}</h1>
            <p className="mt-3 text-lg leading-relaxed text-slate-600">{f.doneText}</p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                href={photosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#1F7A4D] px-6 text-lg font-semibold text-white transition-colors hover:bg-[#186440]"
              >
                <WhatsappIcon className="h-5 w-5" />
                {f.whatsapp}
              </a>
              <Link to={lp('/renovation')} className="py-2 text-lg font-semibold text-reno-ink underline decoration-reno-line underline-offset-4 hover:decoration-reno-ink">
                {f.back}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">{f.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{f.lead}</p>

            <form noValidate onSubmit={onSubmit} className="mt-10 space-y-8 rounded-xl border border-reno-line bg-white p-6 shadow-raised sm:p-8">
              <p className="text-base text-slate-600">{f.requiredNote}</p>

              {/* Tipo de obra: várias escolhas, nos dois grupos do catálogo. */}
              <fieldset aria-describedby={errors.projects ? 'reno-projects-err' : 'reno-projects-hint'}>
                <legend className="text-lg font-semibold">{f.project}</legend>
                <p id="reno-projects-hint" className="mt-1 text-base text-slate-600">
                  {f.projectHint}
                </p>
                <div className="mt-4 space-y-4">
                  {(['interieur', 'batiment'] as RenovationGroup[]).map((g, gi) => (
                    <div key={g}>
                      <p className="text-base font-medium text-slate-600">{RENOVATION_COMMON[lang].groups[g]}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {RENOVATION_SERVICES.filter((s) => s.group === g).map((s, si) => (
                          <label key={s.id} className={`${CHIP} ${errors.projects ? 'border-red-600' : 'border-reno-line'}`}>
                            <input
                              type="checkbox"
                              id={gi === 0 && si === 0 ? 'reno-projects' : undefined}
                              checked={form.projects.includes(s.id)}
                              onChange={() => toggleProject(s.id)}
                              className="peer sr-only"
                            />
                            <Check className="hidden h-4 w-4 peer-checked:block" strokeWidth={2.5} aria-hidden="true" />
                            {s[lang].name}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <label className={`${CHIP} ${errors.projects ? 'border-red-600' : 'border-reno-line'}`}>
                    <input type="checkbox" checked={form.projects.includes('autre')} onChange={() => toggleProject('autre')} className="peer sr-only" />
                    <Check className="hidden h-4 w-4 peer-checked:block" strokeWidth={2.5} aria-hidden="true" />
                    {f.projectOther}
                  </label>
                </div>
                {err('projects')}
              </fieldset>

              <fieldset aria-describedby={errors.property ? 'reno-property-err' : undefined}>
                <legend className="text-lg font-semibold">{f.property}</legend>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {f.properties.map((p, i) => (
                    <label key={p} className={choiceClass(!!errors.property)}>
                      <input
                        type="radio"
                        name="property"
                        id={i === 0 ? 'reno-property' : undefined}
                        value={p}
                        checked={form.property === p}
                        onChange={set('property')}
                        className="h-4 w-4 accent-reno-clay"
                      />
                      {p}
                    </label>
                  ))}
                </div>
                {err('property')}
              </fieldset>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="reno-place" className="text-lg font-semibold">
                    {f.place}
                  </label>
                  <input {...aria('place', true)} value={form.place} onChange={set('place')} autoComplete="address-level2" className={fieldClass(!!errors.place)} />
                  {err('place') ?? (
                    <p id="reno-place-hint" className="mt-1.5 text-base text-slate-600">
                      {f.placeHint}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="reno-timing" className="text-lg font-semibold">
                    {f.timing}
                    <Optional />
                  </label>
                  <select {...aria('timing')} value={form.timing} onChange={set('timing')} className={fieldClass(false)}>
                    <option value="">{f.select}</option>
                    {f.timings.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reno-details" className="text-lg font-semibold">
                  {f.details}
                  <Optional />
                </label>
                <p id="reno-details-hint" className="mt-1 text-base text-slate-600">
                  {f.detailsHint}
                </p>
                <textarea {...aria('details', true)} rows={4} value={form.details} onChange={set('details')} className={fieldClass(false)} />
              </div>

              <fieldset className="border-t border-reno-line pt-8">
                <legend className="sr-only">{f.contactTitle}</legend>
                <p aria-hidden="true" className="text-xl font-semibold">
                  {f.contactTitle}
                </p>

                {/* Particulier ou régie: a régie ganha os campos de empresa e de lotes. */}
                <div role="radiogroup" aria-labelledby="reno-who" className="mt-4">
                  <p id="reno-who" className="text-lg font-semibold">
                    {f.who}
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {(['particulier', 'pro'] as const).map((v, i) => (
                      <label key={v} className={choiceClass(false)}>
                        <input
                          type="radio"
                          name="client"
                          value={v}
                          checked={form.client === v}
                          onChange={() => setClient(v)}
                          className="h-4 w-4 accent-reno-clay"
                        />
                        {f.whoOptions[i]}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {pro && (
                    <>
                      <div>
                        <label htmlFor="reno-company" className="text-lg font-semibold">
                          {f.company}
                        </label>
                        <input {...aria('company')} value={form.company} onChange={set('company')} autoComplete="organization" className={fieldClass(!!errors.company)} />
                        {err('company')}
                      </div>
                      <div>
                        <label htmlFor="reno-units" className="text-lg font-semibold">
                          {f.units}
                          <Optional />
                        </label>
                        <input {...aria('units')} inputMode="numeric" value={form.units} onChange={set('units')} className={fieldClass(false)} />
                      </div>
                    </>
                  )}
                  <div className="sm:col-span-2">
                    <label htmlFor="reno-name" className="text-lg font-semibold">
                      {f.name}
                    </label>
                    <input {...aria('name')} value={form.name} onChange={set('name')} autoComplete="name" className={fieldClass(!!errors.name)} />
                    {err('name')}
                  </div>
                  <div>
                    <label htmlFor="reno-phone" className="text-lg font-semibold">
                      {f.phone}
                    </label>
                    <input {...aria('phone')} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" className={fieldClass(!!errors.phone)} />
                    {err('phone')}
                  </div>
                  <div>
                    <label htmlFor="reno-email" className="text-lg font-semibold">
                      {f.email}
                      <Optional />
                    </label>
                    <input {...aria('email')} type="email" value={form.email} onChange={set('email')} autoComplete="email" className={fieldClass(!!errors.email)} />
                    {err('email')}
                  </div>
                </div>
                <p className="mt-5 text-base text-slate-600">{f.photos}</p>
              </fieldset>

              {failed && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-800">
                  {f.error}
                </p>
              )}

              {/* Envio: o botão, o telefone ao lado e o que acontece depois, no mesmo lugar. */}
              <div className="border-t border-reno-line pt-8">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <button type="submit" disabled={sending} className={`${RENO_BTN} h-12 w-full px-6 text-lg disabled:opacity-70 sm:w-auto`}>
                    {sending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                        {f.sending}
                      </>
                    ) : (
                      <>
                        {f.submit}
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </>
                    )}
                  </button>
                  <p className="flex flex-wrap items-center gap-x-2 text-base text-slate-600">
                    {f.orCall}
                    <PhoneLink label={f.freeCall} />
                  </p>
                </div>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {f.after}{' '}
                  <Link to={lp('/privacy')} className="font-medium text-reno-ink underline decoration-reno-line underline-offset-4 hover:decoration-reno-ink">
                    {f.privacyLink}
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
