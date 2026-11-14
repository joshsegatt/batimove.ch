import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, ExternalLink, Info, TriangleAlert } from 'lucide-react';
import { SEO } from '../components/SEO';
import { buttonClass } from '../components/UIComponents';
import { GUIDES, GUIDES_COPY, type Guide, type GuideBlock } from '../data/guides';
import { LOCALE, localizePath, useLang, type Lang } from '../i18n';

// Guides & conseils (/guides) e cada guia (/guides/<slug>). Leitura longa:
// coluna de texto confortável (~68 caracteres), índice fixo no desktop,
// pontos-chave no topo, fontes oficiais no fim. Schema Article + FAQPage.

const ORIGIN = 'https://www.batimove.ch';

const formatDate = (iso: string, lang: Lang) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' });

/* ===================================================================== */
/* Hub: /guides                                                          */
/* ===================================================================== */

export const GuidesHub: React.FC = () => {
  const { lang, lp } = useLang();
  const c = GUIDES_COPY[lang];
  const [first, ...rest] = GUIDES;

  const schema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: c.hubTitle,
      url: `${ORIGIN}${localizePath('/guides', lang)}`,
      hasPart: GUIDES.map((g) => ({ '@type': 'Article', headline: g[lang].h1, url: `${ORIGIN}${localizePath(g.path, lang)}` })),
    }),
    [lang, c.hubTitle]
  );

  return (
    <div className="bg-white text-[#0B1E33]">
      <SEO schema={schema} />
      <section className="bg-glacier">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#0369A1]">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {c.crumb}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">{c.hubTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 xl:text-xl">{c.hubLead}</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {/* Guia em destaque + os demais em grade */}
          <Link
            to={lp(first.path)}
            className="group grid grid-cols-1 gap-6 rounded-3xl border border-glacier-line bg-white p-6 transition-[border-color,box-shadow] duration-200 hover:border-[#0B1E33] hover:shadow-raised sm:p-8 lg:grid-cols-12 lg:p-10"
          >
            <div className="lg:col-span-8">
              <GuideMeta guide={first} />
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance lg:text-4xl">{first[lang].h1}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{first[lang].lead}</p>
            </div>
            <ul className="space-y-3 self-end border-t border-glacier-line pt-5 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {first[lang].takeaways.slice(0, 3).map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-base leading-relaxed text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#0369A1]" strokeWidth={2.5} aria-hidden="true" />
                  {t}
                </li>
              ))}
              <li className="inline-flex items-center gap-1.5 pt-2 text-lg font-semibold text-[#0369A1]">
                {c.read}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </li>
            </ul>
          </Link>

          <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {rest.map((g) => (
              <li key={g.slug}>
                <GuideCard guide={g} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

const GuideMeta: React.FC<{ guide: Guide }> = ({ guide }) => {
  const { lang } = useLang();
  const c = GUIDES_COPY[lang];
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
      <span className="rounded-md bg-glacier px-2 py-0.5 font-semibold text-[#0369A1]">{guide.category[lang]}</span>
      <span>{c.minutes(guide.minutes)}</span>
      <span aria-hidden="true">·</span>
      <span>
        {c.updated} <time dateTime={guide.updated}>{formatDate(guide.updated, lang)}</time>
      </span>
    </p>
  );
};

const GuideCard: React.FC<{ guide: Guide }> = ({ guide }) => {
  const { lang, lp } = useLang();
  const c = GUIDES_COPY[lang];
  return (
    <Link
      to={lp(guide.path)}
      className="group flex h-full flex-col rounded-2xl border border-glacier-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#0B1E33] hover:shadow-raised motion-reduce:hover:translate-y-0"
    >
      <GuideMeta guide={guide} />
      <h2 className="mt-4 font-display text-2xl font-medium tracking-tight text-balance">{guide[lang].h1}</h2>
      <p className="mt-3 text-base leading-relaxed text-slate-600">{guide[lang].lead}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-lg font-semibold text-[#0369A1]">
        {c.read}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
};

/* ===================================================================== */
/* Artigo: /guides/<slug>                                                 */
/* ===================================================================== */

const Block: React.FC<{ b: GuideBlock }> = ({ b }) => {
  switch (b.t) {
    case 'h2':
      return (
        <h2 id={b.id} className="mt-12 scroll-mt-28 font-display text-2xl font-medium tracking-tight text-[#0B1E33] sm:text-3xl">
          {b.text}
        </h2>
      );
    case 'p':
      return <p className="mt-4 text-lg leading-[1.7] text-slate-700">{b.text}</p>;
    case 'ul':
      return (
        <ul className="mt-4 space-y-3">
          {b.items.map((i) => (
            <li key={i} className="flex items-start gap-3 text-lg leading-[1.6] text-slate-700">
              <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0369A1]" />
              {i}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mt-5 space-y-4">
          {b.items.map((i, n) => (
            <li key={i} className="flex items-start gap-4 text-lg leading-[1.6] text-slate-700">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0B1E33] text-sm font-semibold text-white tabular-nums">{n + 1}</span>
              {i}
            </li>
          ))}
        </ol>
      );
    case 'check':
      return (
        <ul className="mt-5 divide-y divide-glacier-line rounded-2xl border border-glacier-line bg-glacier/40">
          {b.items.map((i) => (
            <li key={i} className="flex items-start gap-3 px-5 py-3.5 text-lg leading-snug text-[#0B1E33]">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-[#0369A1] bg-white text-[#0369A1]">
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
              </span>
              {i}
            </li>
          ))}
        </ul>
      );
    case 'note': {
      const warn = b.tone === 'warn';
      const Icon = warn ? TriangleAlert : Info;
      return (
        <aside className={`mt-6 flex gap-4 rounded-2xl border p-5 ${warn ? 'border-amber-200 bg-amber-50' : 'border-sky-200 bg-sky-50'}`}>
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${warn ? 'text-amber-700' : 'text-[#0369A1]'}`} aria-hidden="true" />
          <div>
            <p className="text-lg font-semibold text-[#0B1E33]">{b.title}</p>
            <p className="mt-1 text-lg leading-relaxed text-slate-700">{b.text}</p>
          </div>
        </aside>
      );
    }
    case 'table':
      return (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-glacier-line">
          <table className="w-full min-w-[520px] border-collapse text-left text-base">
            <thead className="bg-glacier">
              <tr>
                {b.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-semibold text-[#0B1E33]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r) => (
                <tr key={r[0]} className="border-t border-glacier-line align-top">
                  {r.map((cell, i) => (
                    <td key={i} className={`px-4 py-3 leading-relaxed ${i === 0 ? 'font-semibold text-[#0B1E33]' : 'text-slate-700'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
};

export const GuidePage: React.FC<{ slug: string }> = ({ slug }) => {
  const { lang, lp } = useLang();
  const c = GUIDES_COPY[lang];
  const guide = GUIDES.find((g) => g.slug === slug)!;
  const g = guide[lang];
  const toc = g.blocks.filter((b): b is Extract<GuideBlock, { t: 'h2' }> => b.t === 'h2');
  const url = `${ORIGIN}${localizePath(guide.path, lang)}`;
  const others = GUIDES.filter((o) => o.slug !== slug).slice(0, 3);

  const schema = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: g.h1,
        description: g.lead,
        inLanguage: lang === 'en' ? 'en' : 'fr-CH',
        datePublished: guide.updated,
        dateModified: guide.updated,
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'Batimove Sàrl', url: ORIGIN },
        publisher: { '@type': 'Organization', name: 'Batimove Sàrl', logo: { '@type': 'ImageObject', url: `${ORIGIN}/batimove-logo.png` } },
        citation: guide.sources.map((s) => s.url),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: c.crumb, item: `${ORIGIN}${localizePath('/guides', lang)}` },
          { '@type': 'ListItem', position: 2, name: g.h1, item: url },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: g.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
    [g, guide, lang, url, c.crumb]
  );

  return (
    <div className="bg-white text-[#0B1E33]">
      <SEO schema={schema} ogType="article" />

      <header className="bg-glacier">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
              <li>
                <Link to={lp('/')} className="hover:text-[#0B1E33]">{c.home}</Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li>
                <Link to={lp('/guides')} className="hover:text-[#0B1E33]">{c.crumb}</Link>
              </li>
            </ol>
          </nav>
          <div className="mt-8 max-w-3xl">
            <GuideMeta guide={guide} />
            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">{g.h1}</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 xl:text-xl">{g.lead}</p>
            <p className="mt-5 text-base text-slate-500">{c.author}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
        {/* Índice: fixo no desktop, recolhível no celular */}
        <aside className="lg:col-span-4 lg:order-2">
          <div className="lg:sticky lg:top-28">
            <details className="group rounded-2xl border border-glacier-line lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {c.toc}
                <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <TocList toc={toc} />
            </details>
            <nav aria-label={c.toc} className="hidden lg:block">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">{c.toc}</p>
              <TocList toc={toc} />
            </nav>
            <div className="mt-8 hidden rounded-2xl bg-[#0B1E33] p-6 text-white lg:block">
              <p className="font-display text-xl font-medium">{g.cta.title}</p>
              <p className="mt-2 text-base leading-relaxed text-slate-300">{g.cta.text}</p>
              <Link to={lp(g.cta.to)} className={buttonClass('inverse', 'md', 'mt-5')}>
                {g.cta.label}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </aside>

        <article className="min-w-0 lg:col-span-8 lg:order-1">
          <section aria-labelledby="takeaways" className="rounded-2xl border-l-4 border-[#0369A1] bg-glacier/50 p-6">
            <h2 id="takeaways" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#0369A1]">{c.takeaways}</h2>
            <ul className="mt-4 space-y-3">
              {g.takeaways.map((t) => (
                <li key={t} className="flex items-start gap-3 text-lg leading-snug">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#0369A1]" strokeWidth={2.5} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <div className="max-w-[68ch]">
            {g.blocks.map((b, i) => (
              <Block key={i} b={b} />
            ))}
          </div>

          <section aria-labelledby="guide-faq" className="mt-14">
            <h2 id="guide-faq" className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{c.faq}</h2>
            <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              {g.faq.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold transition-colors hover:text-[#0369A1] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="pb-5 text-lg leading-relaxed text-slate-700">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA no fim (no celular é o único) */}
          <section className="mt-12 rounded-2xl bg-[#0B1E33] p-6 text-white sm:p-8 lg:hidden">
            <p className="font-display text-2xl font-medium">{g.cta.title}</p>
            <p className="mt-2 text-lg leading-relaxed text-slate-300">{g.cta.text}</p>
            <Link to={lp(g.cta.to)} className={buttonClass('inverse', 'lg', 'mt-5')}>
              {g.cta.label}
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </section>

          <section aria-labelledby="guide-sources" className="mt-12 border-t border-slate-200 pt-8">
            <h2 id="guide-sources" className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">{c.sources}</h2>
            <ul className="mt-4 space-y-2.5">
              {guide.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 text-base text-[#0369A1] underline decoration-sky-200 underline-offset-4 hover:decoration-[#0369A1]"
                  >
                    {s.label}
                    <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-500">{c.sourcesNote}</p>
          </section>
        </article>
      </div>

      <section aria-labelledby="guide-others" className="border-t border-glacier-line bg-glacier">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 id="guide-others" className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{c.others}</h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <GuideCard guide={o} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

const TocList: React.FC<{ toc: { id: string; text: string }[] }> = ({ toc }) => (
  <ol className="space-y-1 px-5 pb-4 lg:mt-3 lg:border-l lg:border-glacier-line lg:px-0 lg:pb-0">
    {toc.map((t) => (
      <li key={t.id}>
        <a
          href={`#${t.id}`}
          className="block py-1.5 text-base leading-snug text-slate-600 transition-colors hover:text-[#0B1E33] lg:-ml-px lg:border-l-2 lg:border-transparent lg:pl-4 lg:hover:border-[#0B1E33]"
        >
          {t.text}
        </a>
      </li>
    ))}
  </ol>
);
