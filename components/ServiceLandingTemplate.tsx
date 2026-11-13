import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, ChevronRight, MapPin, Phone } from 'lucide-react';
import { SEO } from './SEO';
import { QUOTE_SERVICES, getQuoteService, localizeQuoteService } from '../data/quoteServices';
import { SERVICE_LANDINGS_BY_LANG, type ServiceLandingId } from '../data/serviceLandings';
import {
  CANTONS,
  LOCALITIES,
  LOCAL_SERVICES,
  cantonOf,
  localPath,
  localizeLocality,
  routeMeta,
  type LocalService,
  type Locality,
} from '../data/localities';
import { QuoteWizard } from './quote/QuoteWizard';
import { defineCopy, useLang } from '../i18n';

// Página de um serviço (Débarras, Nettoyage, Garde-meubles). Duas versões com o mesmo template:
// - hub (/debarras): a página geral do serviço;
// - local (/debarras-lausanne, /demenagement-nyon): mesmo serviço com conteúdo próprio
//   da localidade (bairros e comunas, notas locais, FAQ local), para o SEO local.
//   Déménagement só tem a versão local; o fil d'Ariane leva às prestações da home (/#services).
// Em ambas, o wizard completo fica no topo e capta o lead sem trocar de página.
// FR e EN: o conteúdo vem de SERVICE_LANDINGS_BY_LANG e de localizeLocality();
// os links são escritos com o caminho francês e passam por lp().

const COPY = defineCopy(
  {
    serviceName: { demenagement: 'Déménagement', debarras: 'Débarras', nettoyage: 'Nettoyage de fin de bail' } as Record<LocalService, string>,
    breadcrumbLabel: "Fil d'Ariane",
    home: 'Accueil',
    trust: ['RC Pro CHF 5M et All Risk', 'Prix ferme, aucun surcoût', 'Joignable 7j/7'],
    freeCall: 'appel gratuit',
    includedTitle: 'Ce qui est compris',
    stepsTitle: 'Comment ça se passe',
    step: (n: number) => `Étape ${n}`,
    faqTitle: 'Questions fréquentes',
    localFaqQuestion: (l: Locality, isCanton: boolean) =>
      isCanton ? `Où intervenez-vous dans le canton de ${l.name} ?` : `Intervenez-vous aussi autour de ${l.name} ?`,
    localFaqAnswer: (areas: string, of: string) => `Oui : ${areas}, et dans tout le canton ${of}.`,
    alsoTitle: (l: Locality) => `Aussi ${l.prep}`,
    nearYou: (serviceName: string) => `${serviceName} près de chez vous`,
    cantonOf: (of: string) => `Canton ${of}`,
    /** Rótulo da localidade atual (sem link) */
    zoneCurrent: (l: Locality, isCanton: boolean) => (isCanton ? `Tout le canton` : l.name),
    /** Rótulo do link para outra localidade */
    zoneService: { demenagement: 'Déménagement', debarras: 'Débarras', nettoyage: 'Nettoyage' } as Record<LocalService, string>,
    zoneLink: (zoneService: string, l: Locality, isCanton: boolean) =>
      `${zoneService} ${isCanton ? `canton de ${l.name}` : l.name}`,
    othersTitle: 'Nos autres prestations',
    ctaTitle: 'Devis gratuit sous 30 min',
    ctaText: 'Prix ferme : aucun surcoût une fois le devis accepté.',
    ctaButton: 'Demander un devis',
  },
  {
    serviceName: { demenagement: 'Removals', debarras: 'House clearance', nettoyage: 'End of tenancy cleaning' },
    breadcrumbLabel: 'Breadcrumb',
    home: 'Home',
    trust: ['CHF 5M public liability and all-risks cover', 'Fixed price, no extra charges', 'Available 7 days a week'],
    freeCall: 'free call',
    includedTitle: 'What’s included',
    stepsTitle: 'How it works',
    step: (n: number) => `Step ${n}`,
    faqTitle: 'Frequently asked questions',
    localFaqQuestion: (l: Locality, isCanton: boolean) =>
      isCanton ? `Where do you work in the canton of ${l.name}?` : `Do you also cover the area around ${l.name}?`,
    localFaqAnswer: (areas: string, of: string) => `Yes: ${areas}, and throughout the canton ${of}.`,
    alsoTitle: (l: Locality) => `Also ${l.prep}`,
    nearYou: (serviceName: string) => `${serviceName} near you`,
    cantonOf: (of: string) => `Canton ${of}`,
    zoneCurrent: (l: Locality, isCanton: boolean) => (isCanton ? 'Whole canton' : l.name),
    // "House clearance in Nyon", "Cleaning in the canton of Vaud"
    zoneService: { demenagement: 'Removals', debarras: 'House clearance', nettoyage: 'Cleaning' },
    zoneLink: (zoneService: string, l: Locality) => `${zoneService} ${l.prep}`,
    othersTitle: 'Our other services',
    ctaTitle: 'Free quote within 30 min',
    ctaText: 'Fixed price: no extra charges once the quote is accepted.',
    ctaButton: 'Request a quote',
  },
);

export const ServiceLandingTemplate: React.FC<{ service: ServiceLandingId; locality?: Locality }> = ({
  service: serviceId,
  locality: rawLocality,
}) => {
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const config = SERVICE_LANDINGS_BY_LANG[lang][serviceId];
  const locality = rawLocality ? localizeLocality(rawLocality, lang) : undefined;
  const service = getQuoteService(config.serviceId);
  // Serviço com páginas por cidade (Déménagement, Débarras, Nettoyage); Garde-meubles não tem.
  const localKey = (LOCAL_SERVICES as string[]).includes(serviceId) ? (serviceId as LocalService) : null;
  const others = QUOTE_SERVICES.filter((s) => s.id !== config.serviceId).map((s) => localizeQuoteService(s, lang));
  const serviceName = localKey ? c.serviceName[localKey] : config.breadcrumb;

  const path = locality && localKey ? localPath(localKey, locality.slug) : config.path;
  const meta = locality ? routeMeta(path) : { title: config.seoTitle, description: config.seoDescription };
  const h1 = locality ? `${serviceName} ${locality.prep}` : config.h1;
  const lead = locality ? `${locality.intro} ${config.lead}` : config.lead;
  // `kind` francês decide a lógica (o inglês é só texto).
  const isCanton = rawLocality?.kind === 'canton';

  // Pergunta local primeiro: responde "vous venez chez moi ?" com a lista real.
  const faq = locality
    ? [
        {
          question: c.localFaqQuestion(locality, isCanton),
          answer: c.localFaqAnswer(locality.areas.slice(0, 8).join(', '), cantonOf(locality.canton, lang)),
        },
        ...config.faq,
      ]
    : config.faq;

  return (
    <div className="bg-white font-sans text-slate-900">
      <SEO title={meta.title} description={meta.description} canonical={`https://www.batimove.ch${lp(path)}`} />

      {/* Topo: foto do serviço + wizard completo. O lead é captado aqui mesmo,
          sem trocar de página; o envio termina em e-mail + WhatsApp. */}
      <section className="relative isolate overflow-hidden bg-[#0B1E33]">
        <picture>
          <source media="(max-width: 767px)" srcSet={config.hero.srcSmall} />
          <img
            src={config.hero.src}
            width={config.hero.width}
            height={config.hero.height}
            alt={config.hero.alt}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            style={{ objectPosition: config.hero.position }}
          />
        </picture>
        {/* Véu navy: uniforme no celular; no desktop mais forte do lado do texto */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[#0B1E33]/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#0B1E33]/95 lg:via-[#0B1E33]/75 lg:to-[#0B1E33]/40"
        />

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-6 lg:pt-4 xl:col-span-7">
            <nav aria-label={c.breadcrumbLabel} className="text-sm text-slate-300">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link to={lp('/')} className="underline-offset-4 hover:text-white hover:underline">{c.home}</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                {locality ? (
                  <>
                    <li>
                      <Link to={lp(config.path)} className="underline-offset-4 hover:text-white hover:underline">{config.breadcrumb}</Link>
                    </li>
                    <li aria-hidden="true">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </li>
                    <li aria-current="page" className="font-medium text-white">{locality.name}</li>
                  </>
                ) : (
                  <li aria-current="page" className="font-medium text-white">{config.breadcrumb}</li>
                )}
              </ol>
            </nav>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-white sm:text-5xl">{h1}</h1>
            <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-slate-200 sm:text-xl">{lead}</p>
            <ul className="mt-7 flex flex-col gap-2.5 text-base text-white sm:flex-row sm:flex-wrap sm:gap-x-6">
              {c.trust.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-sky-300" strokeWidth={2.5} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="tel:0800825925"
              className="mt-8 inline-flex items-center gap-2 py-2 text-lg font-semibold text-white transition-colors hover:text-sky-300"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span className="tabular-nums">0800 825 925</span>
              <span className="font-normal text-slate-300">{c.freeCall}</span>
            </a>
          </div>

          <div id="devis" className="scroll-mt-32 lg:col-span-6 xl:col-span-5">
            <QuoteWizard
              key={`${service.id}-${locality?.slug ?? 'hub'}-${lang}`}
              urlService={service.id}
              initialFrom={locality && !isCanton ? locality.name : undefined}
              elevated
            />
          </div>
        </div>
      </section>

      {/* O que está incluído */}
      <section aria-labelledby="compris-title" className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <h2 id="compris-title" className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-[#0B1E33] lg:col-span-4 lg:text-4xl">
            {c.includedTitle}
          </h2>
          <ul className="grid grid-cols-1 border-t border-slate-200 sm:grid-cols-2 lg:col-span-8">
            {config.included.map((item, i) => (
              <li
                key={item}
                className={`flex items-start gap-3 border-b border-slate-200 py-4 text-lg leading-snug text-[#0B1E33] ${i % 2 === 1 ? 'sm:border-l sm:pl-6' : 'sm:pr-6'}`}
              >
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#0B1E33]" strokeWidth={2.5} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Conteúdo próprio da localidade */}
      {locality && (
        <section aria-labelledby="local-title" className="border-t border-slate-200 py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
            <div className="lg:col-span-5">
              <h2 id="local-title" className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-[#0B1E33] lg:text-4xl">
                {serviceName} {locality.prep}
              </h2>
              <p className="mt-6 text-sm font-semibold text-slate-500">{locality.areasTitle}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {locality.areas.map((a) => (
                  <li key={a} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-base text-[#0B1E33]">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {locality.notes.map((n) => (
                  <div key={n.title} className="border-t-2 border-[#0B1E33] pb-6 pt-5">
                    <dt className="font-display text-xl font-medium tracking-tight text-[#0B1E33]">{n.title}</dt>
                    <dd className="mt-2 text-lg leading-relaxed text-slate-600">{n.text}</dd>
                  </div>
                ))}
              </dl>
              {/* Os outros serviços na mesma localidade (malha de links internos) */}
              {localKey && (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-slate-500">{c.alsoTitle(locality)}</p>
                  <ul className="mt-1 flex flex-col items-start">
                    {LOCAL_SERVICES.filter((s) => s !== localKey).map((s) => (
                      <li key={s}>
                        <Link
                          to={lp(localPath(s, locality.slug))}
                          className="inline-flex items-center gap-1.5 py-2 text-lg font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#0B1E33]"
                        >
                          {c.serviceName[s]} {locality.prep}
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Etapas: a numeração carrega a ordem real do processo */}
      <section aria-labelledby="etapes-title" className="bg-[#F8FAFC] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="etapes-title" className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-[#0B1E33] lg:text-4xl">
            {c.stepsTitle}
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {config.steps.map((step, i) => (
              <li key={step.title} className="border-t-2 border-[#0B1E33] pt-5">
                <span className="font-display text-sm font-semibold tabular-nums text-slate-500">{c.step(i + 1)}</span>
                <h3 className="mt-2 font-display text-xl font-medium tracking-tight text-[#0B1E33]">{step.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ visível */}
      <section aria-labelledby="faq-title" className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="faq-title" className="font-display text-3xl font-medium tracking-tight text-[#0B1E33]">
            {c.faqTitle}
          </h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {faq.map((item) => (
              <details key={item.question} className="group py-1">
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-[#0B1E33]">{item.question}</h3>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pb-4 pr-9 text-lg leading-relaxed text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Todas as localidades do serviço (malha de links internos do SEO local) */}
      {localKey && (
      <section aria-labelledby="zones-title" className="border-t border-slate-200 bg-[#F8FAFC] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="zones-title" className="font-display text-2xl font-medium tracking-tight text-[#0B1E33]">
            {c.nearYou(serviceName)}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            {CANTONS.map((canton) => (
              <div key={canton.id}>
                <p className="text-sm font-semibold text-slate-500">{c.cantonOf(cantonOf(canton.id, lang))}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {LOCALITIES.filter((l) => l.canton === canton.id).map((raw) => {
                    const l = localizeLocality(raw, lang);
                    const current = raw.slug === locality?.slug;
                    const lIsCanton = raw.kind === 'canton';
                    return (
                      <li key={raw.slug}>
                        {current ? (
                          <span aria-current="page" className="inline-flex h-10 items-center rounded-lg bg-[#0B1E33] px-3.5 text-base font-semibold text-white">
                            {c.zoneCurrent(l, lIsCanton)}
                          </span>
                        ) : (
                          <Link
                            to={lp(localPath(localKey, raw.slug))}
                            className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-base font-semibold text-[#0B1E33] transition-colors duration-150 hover:border-[#0B1E33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
                          >
                            {c.zoneLink(c.zoneService[localKey], l, lIsCanton)}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Outras prestações (links internos) */}
      <section aria-labelledby="autres-title" className="border-t border-slate-200 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="autres-title" className="font-display text-2xl font-medium tracking-tight text-[#0B1E33]">
            {c.othersTitle}
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {others.map(({ id, label, hint, icon: Icon, page }) => (
              <li key={id}>
                <Link
                  to={lp(page)}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors duration-150 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#0B1E33] transition-colors duration-150 group-hover:bg-[#0B1E33] group-hover:text-white">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold tracking-tight text-[#0B1E33]">{label}</span>
                    <span className="block text-sm text-slate-500">{hint}</span>
                  </span>
                  <ChevronRight className="h-[18px] w-[18px] shrink-0 text-slate-300 group-hover:text-[#0B1E33]" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Faixa final de orçamento */}
      <section className="bg-[#0B1E33]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight text-white">{c.ctaTitle}</h2>
            <p className="mt-2 text-lg text-slate-300">{c.ctaText}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#devis"
              className="btn btn-lg btn-inverse"
            >
              {c.ctaButton}
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <a href="tel:0800825925" className="inline-flex items-center gap-2 py-3 text-lg font-semibold text-white transition-colors hover:text-sky-300">
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span className="tabular-nums">0800 825 925</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceLandingTemplate;
