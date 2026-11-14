import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, ChevronRight, Loader2, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useRevealOnce } from '../hooks/useRevealOnce';
import { dropClass, dropStyle, lineStyle } from '../utils/reveal';
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
import { trackGoogleAdsLeadConversion } from '../utils/analytics';
import { defineCopy, localizePath, useLang, type Lang } from '../i18n';

// Batimove Rénovation: página principal (/renovation), uma página por serviço
// (/renovation/<serviço>) e o pedido de devis (/renovation/devis).
// Sem fotos por enquanto (chegam depois): a força visual vem da tipografia,
// do índice numerado e das linhas finas, no estilo de uma planta de obra.

const ORIGIN = 'https://www.batimove.ch';

const COPY = defineCopy(
  {
    h1: 'Rénovation et étanchéité à Genève.',
    h1Accent: 'Un seul interlocuteur.',
    lead: "Appartements, maisons et immeubles : nous coordonnons vos travaux avec des artisans qualifiés et assurés, et nous pouvons vider, stocker et réinstaller vos meubles le temps du chantier.",
    cta: 'Décrire mon projet',
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
    stepsTitle: 'Comment se passe un chantier',
    synergyTitle: 'Rénover sans rien porter vous-même.',
    synergyText: "Batimove est d'abord une entreprise de déménagement. Pour un chantier, tout est sous le même toit :",
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
    stepsTitle: 'How a renovation works',
    synergyTitle: 'Renovate without lifting a box.',
    synergyText: 'Batimove is first a removals company. For a renovation, everything is under one roof:',
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

/** Fundo de planta de obra: quadriculado fino que some nas bordas. */
const BLUEPRINT: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, rgba(23,26,29,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,26,29,0.06) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
  maskImage: 'radial-gradient(ellipse at 70% 30%, black 20%, transparent 75%)',
  WebkitMaskImage: 'radial-gradient(ellipse at 70% 30%, black 20%, transparent 75%)',
};

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

/** Movimento do ícone no hover (classes em src/index.css): o pincel e o piso inclinam, o resto sobe. */
const ICON_MOTION: Partial<Record<RenovationId, string>> = { peinture: 'icon-tilt', sols: 'icon-tilt' };

/**
 * Cartão de prestação. No hover: sobe 4px, a sombra passa a raised, um filete
 * terracota se desenha no topo e o ícone fica grafite e se mexe.
 */
const ServiceCard: React.FC<{ id: RenovationId; featured?: boolean }> = ({ id, featured }) => {
  const { lang, lp } = useLang();
  const s = renovationById(id);
  const c = s[lang];
  const Icon = s.icon;
  return (
    <Link
      to={lp(s.path)}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-reno-line bg-white p-5 shadow-rest transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-reno-ink/30 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reno-clay motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-reno-clay transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-reno-stone text-reno-ink transition-colors duration-300 group-hover:bg-reno-ink group-hover:text-white motion-reduce:transition-none">
        <Icon className={`h-[22px] w-[22px] ${ICON_MOTION[id] ?? 'icon-lift'}`} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <h3 className={`mt-5 font-display font-medium tracking-tight text-reno-ink ${featured ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>{c.name}</h3>
      <p className="mt-1.5 text-base leading-relaxed text-slate-600">{c.summary}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-base font-semibold text-reno-clay">
        {c.hint}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
      </span>
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
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold text-reno-ink transition-colors duration-150 hover:text-reno-clay [&::-webkit-details-marker]:hidden">
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
    <section className="bg-reno-ink text-white">
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
  // Entradas ao rolar: os cartões de prestação descem para o lugar; as linhas da
  // étanchéité se desenham (o mesmo traço das etapas).
  const servicesReveal = useRevealOnce<HTMLDivElement>(0.1);
  const waterReveal = useRevealOnce<HTMLUListElement>(0.3);
  const schema = useMemo(
    () => [
      { '@context': 'https://schema.org', ...PROVIDER, description: c.lead },
      faqSchema(RENOVATION_FAQ[lang]),
    ],
    [lang, c.lead]
  );
  let n = 0;

  return (
    <div className="bg-white text-reno-ink selection:bg-reno-clay selection:text-white">
      <SEO schema={schema} />

      {/* HERO: promessa, prova e ação; à direita, o índice numerado das prestações */}
      <section className="relative overflow-hidden bg-reno-stone">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={BLUEPRINT} />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center lg:col-span-7">
            <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-balance sm:text-5xl xl:text-6xl">
              {c.h1} <span className="text-reno-clay">{c.h1Accent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 xl:text-xl">{c.lead}</p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-base font-medium">
              {common.trust.slice(0, 3).map((t) => (
                <li key={t.title} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-reno-clay" strokeWidth={2.5} aria-hidden="true" />
                  {t.title}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link to={lp('/renovation/devis')} className={`${RENO_BTN} h-12 px-6 text-lg`}>
                {c.cta}
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <PhoneLink label={c.freeCall} />
            </div>
          </div>

          <nav aria-labelledby="reno-index" className="rounded-xl border border-reno-line bg-white p-5 shadow-raised sm:p-6 lg:col-span-5">
            <h2 id="reno-index" className="font-display text-xl font-medium tracking-tight text-reno-ink">
              {c.indexTitle}
            </h2>
            {groups.map((g) => (
              <div key={g} className="mt-4">
                <p className="text-sm font-semibold text-reno-clay">{common.groups[g]}</p>
                <ul className="mt-1 divide-y divide-reno-line">
                  {RENOVATION_SERVICES.filter((s) => s.group === g).map((s) => {
                    n += 1;
                    return (
                      <li key={s.id}>
                        <Link
                          to={lp(s.path)}
                          className="group flex items-center gap-4 py-2.5 transition-colors duration-150 hover:text-reno-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-reno-clay"
                        >
                          <span className="w-6 font-mono text-sm text-slate-400 tabular-nums">{pad(n)}</span>
                          <span className="flex-1 text-lg font-semibold leading-snug">{s[lang].name}</span>
                          <ArrowRight
                            className="h-4 w-4 text-slate-300 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-reno-clay"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </section>

      {/* Garantias, em faixa grafite */}
      <section aria-label={common.trust.map((t) => t.title).join(', ')} className="bg-reno-ink text-white">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8 lg:py-14">
          {common.trust.map((t) => (
            <li key={t.title} className="border-t border-white/15 pt-5">
              <h3 className="font-display text-lg font-medium">{t.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-stone-300">{t.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Prestações por grupo */}
      <section aria-labelledby="reno-services" className="bg-white">
        <div ref={servicesReveal.ref} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 id="reno-services" className="font-display text-3xl font-medium tracking-tight lg:text-4xl">
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
                    <li key={s.id} className={`${featured ? 'sm:col-span-2 ' : ''}${dropClass(servicesReveal.pending)}`} style={dropStyle(i)}>
                      <ServiceCard id={s.id} featured={featured} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Étanchéité: causa antes da finição */}
      <section aria-labelledby="reno-water" className="bg-reno-stone">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-5">
            <h2 id="reno-water" className="font-display text-3xl font-medium tracking-tight lg:text-4xl">
              {c.waterTitle}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{c.waterText}</p>
          </div>
          <div className="lg:col-span-7">
            <ul ref={waterReveal.ref} className="border-t border-reno-line">
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
                    className="group flex items-center justify-between gap-3 rounded-xl border border-reno-line bg-white px-4 py-3.5 shadow-rest transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-reno-ink/30 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reno-clay motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <span>
                      <span className="block text-sm text-slate-500">{c.waterLinks}</span>
                      <span className="block font-semibold">{s[lang].name}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-reno-clay transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Steps title={c.stepsTitle} />

      {/* Diferença: a Batimove também muda, guarda, debarrassa e limpa */}
      <section aria-labelledby="reno-synergy" className="bg-reno-ink text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-5">
            <h2 id="reno-synergy" className="font-display text-3xl font-medium tracking-tight lg:text-4xl">
              {c.synergyTitle}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-stone-300">{c.synergyText}</p>
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

      {/* Régies e PPE */}
      <section aria-labelledby="reno-pro" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-end gap-8 rounded-xl border border-reno-line bg-reno-stone p-8 sm:p-10 lg:grid-cols-12 lg:p-12">
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

      <Faq title={c.faqTitle} items={RENOVATION_FAQ[lang]} tone="stone" />
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
  const Icon = s.icon;
  const quoteTo = `/renovation/devis?type=${id}`;
  const signsReveal = useRevealOnce<HTMLUListElement>(0.25);
  const others = RENOVATION_SERVICES.filter((o) => o.id !== id && o.group === s.group).concat(
    RENOVATION_SERVICES.filter((o) => o.group !== s.group).slice(0, 1)
  );
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

      <section className="relative overflow-hidden bg-reno-stone">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={BLUEPRINT} />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pb-20">
          <nav aria-label={c.breadcrumb}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
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
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-reno-ink text-white">
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h1 className="mt-6 font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">{sc.h1}</h1>
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

            <div className="rounded-xl border border-reno-line bg-white p-6 shadow-raised lg:col-span-5">
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
      </section>

      {/* Quando chamar */}
      <section aria-labelledby="reno-signs" className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <h2 id="reno-signs" className="font-display text-3xl font-medium tracking-tight lg:col-span-4 lg:text-4xl">
            {c.signsTitle}
          </h2>
          <ul ref={signsReveal.ref} className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-8">
            {sc.signs.map((sign, i) => (
              <li key={sign} className="relative flex items-start gap-3 border-t border-reno-line pt-4">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -top-px h-px origin-left bg-reno-clay transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                  style={lineStyle(signsReveal.pending, i * 160)}
                />
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-reno-clay" />
                <p className="text-lg font-medium leading-snug">{sign}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Steps title={c.stepsTitle} tone="stone" />
      <Faq title={c.faqTitle} items={sc.faq} />

      <section aria-labelledby="reno-others" className="border-t border-reno-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 id="reno-others" className="font-display text-2xl font-medium tracking-tight lg:text-3xl">
            {c.othersTitle}
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.slice(0, 4).map((o) => (
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
    project: 'Type de travaux',
    projectOther: 'Plusieurs travaux ou autre projet',
    property: 'Type de bien',
    properties: ['Appartement', 'Maison', 'Immeuble ou PPE', 'Local commercial'],
    place: 'Commune ou NPA du chantier',
    placeHint: 'Genève en priorité ; canton de Vaud selon la prestation.',
    timing: 'Quand souhaitez-vous commencer ?',
    timings: ['Dès que possible', 'Dans les 3 mois', 'Dans 3 à 6 mois', 'Pas encore défini'],
    details: 'Décrivez le projet',
    detailsHint: 'Pièces concernées, surface approximative, ce qui vous gêne aujourd’hui…',
    contactTitle: 'Vos coordonnées',
    name: 'Nom et prénom',
    phone: 'Téléphone',
    email: 'E-mail (facultatif)',
    photos: 'Des photos aident beaucoup : vous pourrez nous les envoyer par WhatsApp après la demande.',
    submit: 'Envoyer ma demande',
    sending: 'Envoi…',
    required: 'Champ obligatoire',
    invalidPhone: 'Numéro trop court',
    invalidEmail: 'Adresse e-mail invalide',
    error: "L'envoi n'a pas abouti. Réessayez ou appelez le 0800 825 925.",
    doneTitle: 'Merci, votre demande est envoyée.',
    doneText: 'Nous vous rappelons pour fixer la visite sur place. Vous pouvez déjà nous envoyer des photos :',
    whatsapp: 'Envoyer des photos sur WhatsApp',
    back: 'Retour à la rénovation',
    select: 'Choisir…',
  },
  {
    title: 'Your project in 2 minutes.',
    lead: 'Describe the work: we call you back to arrange a site visit, then you receive a detailed quote.',
    project: 'Type of work',
    projectOther: 'Several jobs or another project',
    property: 'Type of property',
    properties: ['Flat', 'House', 'Apartment building or co-ownership', 'Commercial premises'],
    place: 'Town or postcode of the site',
    placeHint: 'Geneva first; canton of Vaud depending on the service.',
    timing: 'When would you like to start?',
    timings: ['As soon as possible', 'Within 3 months', 'In 3 to 6 months', 'Not decided yet'],
    details: 'Describe the project',
    detailsHint: 'Rooms involved, approximate area, what bothers you today…',
    contactTitle: 'Your details',
    name: 'Full name',
    phone: 'Phone',
    email: 'Email (optional)',
    photos: 'Photos help a lot: you can send them to us on WhatsApp after your request.',
    submit: 'Send my request',
    sending: 'Sending…',
    required: 'Required field',
    invalidPhone: 'Number too short',
    invalidEmail: 'Invalid email address',
    error: 'Sending failed. Please try again or call 0800 825 925.',
    doneTitle: 'Thank you, your request has been sent.',
    doneText: 'We will call you back to arrange the site visit. You can already send us photos:',
    whatsapp: 'Send photos on WhatsApp',
    back: 'Back to renovation',
    select: 'Choose…',
  }
);

type FormState = {
  project: string;
  property: string;
  place: string;
  timing: string;
  details: string;
  name: string;
  phone: string;
  email: string;
};

const fieldClass = (invalid: boolean) =>
  `mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-lg text-reno-ink placeholder:text-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-reno-clay/30 ${
    invalid ? 'border-red-600 focus:border-red-600' : 'border-reno-line focus:border-reno-ink'
  }`;

export const RenovationQuote: React.FC = () => {
  const { lang, lp } = useLang();
  const f = FORM_COPY[lang];
  const [params] = useSearchParams();
  const preset = RENOVATION_SERVICES.find((s) => s.id === params.get('type'));
  const [form, setForm] = useState<FormState>({
    project: preset ? preset.id : '',
    property: '',
    place: '',
    timing: '',
    details: '',
    name: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.project) e.project = f.required;
    if (!form.property) e.property = f.required;
    if (!form.place.trim()) e.place = f.required;
    if (!form.name.trim()) e.name = f.required;
    if (!form.phone.trim()) e.phone = f.required;
    else if (form.phone.replace(/\D/g, '').length < 9) e.phone = f.invalidPhone;
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
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`reno-${first}`)?.focus();
      return;
    }
    setSending(true);
    setFailed(false);
    const projectFr = form.project === 'autre' ? FORM_COPY.fr.projectOther : renovationById(form.project as RenovationId).fr.name;
    try {
      await submitServiceQuote({
        serviceName: `Rénovation : ${projectFr}`,
        clientName: form.name.trim(),
        clientEmail: form.email.trim() || 'Non renseigné',
        clientPhone: form.phone.trim(),
        date: form.timing ? frLabel('timings', form.timing) : 'Non précisé',
        fromCity: form.place.trim(),
        details: [`Bien : ${frLabel('properties', form.property)}`, form.details.trim() && `Projet : ${form.details.trim()}`]
          .filter(Boolean)
          .join(' · '),
        source: 'le formulaire Rénovation',
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
  const aria = (k: keyof FormState) => ({
    id: `reno-${k}`,
    'aria-invalid': !!errors[k] || undefined,
    'aria-describedby': errors[k] ? `reno-${k}-err` : undefined,
  });

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
                href="https://wa.me/41798896406"
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
              <div>
                <label htmlFor="reno-project" className="text-lg font-semibold">
                  {f.project}
                </label>
                <select {...aria('project')} value={form.project} onChange={set('project')} className={fieldClass(!!errors.project)}>
                  <option value="">{f.select}</option>
                  {(['interieur', 'batiment'] as RenovationGroup[]).map((g) => (
                    <optgroup key={g} label={RENOVATION_COMMON[lang].groups[g]}>
                      {RENOVATION_SERVICES.filter((s) => s.group === g).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s[lang].name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="autre">{f.projectOther}</option>
                </select>
                {err('project')}
              </div>

              <fieldset>
                <legend className="text-lg font-semibold">{f.property}</legend>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {f.properties.map((p, i) => (
                    <label
                      key={p}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-lg transition-colors duration-150 has-[:checked]:border-reno-ink has-[:checked]:bg-reno-stone has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-reno-clay/40 ${
                        errors.property ? 'border-red-600' : 'border-reno-line hover:border-slate-400'
                      }`}
                    >
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
                  <input {...aria('place')} value={form.place} onChange={set('place')} autoComplete="address-level2" className={fieldClass(!!errors.place)} />
                  {err('place') ?? <p className="mt-1.5 text-base text-slate-500">{f.placeHint}</p>}
                </div>
                <div>
                  <label htmlFor="reno-timing" className="text-lg font-semibold">
                    {f.timing}
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
                </label>
                <textarea
                  {...aria('details')}
                  rows={4}
                  value={form.details}
                  onChange={set('details')}
                  placeholder={f.detailsHint}
                  className={fieldClass(false)}
                />
              </div>

              <fieldset className="border-t border-reno-line pt-8">
                <legend className="sr-only">{f.contactTitle}</legend>
                <p aria-hidden="true" className="text-xl font-semibold">
                  {f.contactTitle}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            </form>
          </>
        )}
      </div>
    </div>
  );
};

