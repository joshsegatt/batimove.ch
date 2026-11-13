import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Minus, Phone, Plus, RotateCcw, Search, X } from 'lucide-react';
import { useVolumeCalculator, HOUSING_PRESETS, formatVolume, presetVolume, type CalculatorRow } from '../hooks/useVolumeCalculator';
import { CALCULATOR_CATEGORIES } from '../data/calculatorItems';
import { buttonClass } from '../components/UIComponents';
import { SEO } from '../components/SEO';
import { defineCopy, useLang, type Lang } from '../i18n';

// Calculateur de volume : inventaire pièce par pièce, volume en m³.
// Aucun prix affiché : le prix ferme arrive avec le devis (sous 30 min, 8h-19h).
// L'estimation interne voyage seulement dans l'e-mail adressé à Batimove.

export const CALCULATOR_CHECKOUT_KEY = 'calculatorData';

type CategoryId = (typeof CALCULATOR_CATEGORIES)[number]['id'];

const COPY = defineCopy(
  {
    toDisassemble: 'À démonter',
    remove: (name: string) => `Retirer ${name}`,
    add: (name: string) => `Ajouter ${name}`,
    announceItem: (name: string, qty: number, volume: string) => `${name} : ${qty}. Volume total ${volume} mètres cubes.`,
    announcePreset: (name: string, volume: string) => `Logement type ${name} appliqué. Volume total ${volume} mètres cubes.`,
    announceReset: 'Inventaire effacé.',
    cta: 'Recevoir mon prix ferme',
    ctaShort: 'Mon prix ferme',
    title: 'Calculez votre volume',
    titleSr: ' : calculateur de volume en m³ et devis gratuit sous 30 min',
    intro:
      "Partez d'un logement type, puis ajustez pièce par pièce. Votre prix ferme, établi sur ce volume, vous est envoyé sous 30 min (8h-19h).",
    presetsTitle: 'Point de départ',
    inventoryTitle: 'Votre inventaire',
    clearAll: 'Tout effacer',
    search: 'Rechercher un meuble',
    clearSearch: 'Effacer la recherche',
    roomsTabs: 'Pièces',
    noMatch: (q: string) => `Aucun meuble ne correspond à « ${q} ».`,
    noMatchHint: "Essayez un autre mot, ou décrivez l'objet dans les précisions de votre demande.",
    summaryTitle: 'Volume estimé',
    itemCount: (n: number) => `${n} article${n > 1 ? 's' : ''}`,
    disassembleCount: (n: number) => ` · ${n} à démonter`,
    summaryNote:
      'Votre prix ferme, établi sur ce volume, vous est envoyé sous 30 min (8h-19h). Aucun surcoût une fois le devis accepté.',
    emptyHint: 'Ajoutez au moins un meuble ou choisissez un logement type.',
    talk: "Préférez parler à quelqu'un ?",
    mobileVolume: 'Volume',
  },
  {
    toDisassemble: 'Needs dismantling',
    remove: (name: string) => `Remove ${name}`,
    add: (name: string) => `Add ${name}`,
    announceItem: (name: string, qty: number, volume: string) => `${name}: ${qty}. Total volume ${volume} cubic metres.`,
    announcePreset: (name: string, volume: string) => `Typical home applied: ${name}. Total volume ${volume} cubic metres.`,
    announceReset: 'Inventory cleared.',
    cta: 'Get my fixed price',
    ctaShort: 'My fixed price',
    title: 'Calculate your volume',
    titleSr: ': m³ volume calculator and free quote within 30 min',
    intro:
      'Start from a typical home, then adjust room by room. Your fixed price, based on this volume, is sent to you within 30 min (8am–7pm).',
    presetsTitle: 'Starting point',
    inventoryTitle: 'Your inventory',
    clearAll: 'Clear all',
    search: 'Search for furniture',
    clearSearch: 'Clear search',
    roomsTabs: 'Rooms',
    noMatch: (q: string) => `No furniture matches ‘${q}’.`,
    noMatchHint: 'Try another word, or describe the item in the details of your request.',
    summaryTitle: 'Estimated volume',
    itemCount: (n: number) => `${n} item${n === 1 ? '' : 's'}`,
    disassembleCount: (n: number) => ` · ${n} to dismantle`,
    summaryNote:
      'Your fixed price, based on this volume, is sent to you within 30 min (8am–7pm). No extra charges once the quote is accepted.',
    emptyHint: 'Add at least one item or choose a typical home.',
    talk: 'Prefer to talk to someone?',
    mobileVolume: 'Volume',
  }
);

type Copy = (typeof COPY)['fr'];

const rowName = (item: CalculatorRow, lang: Lang) => (lang === 'en' ? item.nameEn : item.name);

/** Ligne d'inventaire : nom, volume unitaire, démontage et stepper − / +. */
const ItemRow: React.FC<{
  item: CalculatorRow;
  lang: Lang;
  c: Copy;
  onChange: (id: string, delta: number) => void;
  onToggleDisassemble: (id: string) => void;
}> = ({ item, lang, c, onChange, onToggleDisassemble }) => {
  const active = item.quantity > 0;
  const name = rowName(item, lang);
  return (
    <li className={`flex items-center gap-3 px-4 py-3 transition-colors duration-150 sm:px-5 ${active ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-medium leading-snug text-[#0B1E33]">{name}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm tabular-nums text-slate-500">{formatVolume(item.volume, lang)} m³</span>
          {active && (
            <label className="-my-2 inline-flex cursor-pointer items-center gap-2 py-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={item.disassemble}
                onChange={() => onToggleDisassemble(item.id)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#0B1E33]"
              />
              {c.toDisassemble}
            </label>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center rounded-xl border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => onChange(item.id, -1)}
          disabled={!active}
          aria-label={c.remove(name)}
          className="grid h-11 w-11 place-items-center rounded-l-xl text-[#0B1E33] transition-colors duration-150 hover:bg-slate-100 active:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7]"
        >
          <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </button>
        <span className={`w-8 text-center text-lg font-semibold tabular-nums ${active ? 'text-[#0B1E33]' : 'text-slate-400'}`} aria-hidden="true">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => onChange(item.id, 1)}
          disabled={item.quantity >= 99}
          aria-label={c.add(name)}
          className="grid h-11 w-11 place-items-center rounded-r-xl text-[#0B1E33] transition-colors duration-150 hover:bg-slate-100 active:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

const normalized = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Calculator() {
  const navigate = useNavigate();
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const { items, summary, activePreset, applyPreset, updateQuantity, toggleDisassemble, resetCalculator, getAllItems } =
    useVolumeCalculator();

  const [activeCategory, setActiveCategory] = useState<CategoryId>('salon');
  const [query, setQuery] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [showHint, setShowHint] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const empty = summary.totalVolume === 0;

  // La recherche trouve un meuble par son nom français ou anglais, quelle que soit la langue.
  const visibleItems = useMemo(() => {
    const q = normalized(query.trim());
    if (q) return items.filter((i) => normalized(i.name).includes(q) || normalized(i.nameEn).includes(q));
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory, query]);

  const countByCategory = useMemo(() => {
    const out: Record<string, { count: number; volume: number }> = {};
    for (const cat of CALCULATOR_CATEGORIES) out[cat.id] = { count: 0, volume: 0 };
    for (const i of items) {
      out[i.category].count += i.quantity;
      out[i.category].volume += i.quantity * i.volume;
    }
    return out;
  }, [items]);

  // Annonce vocale : le lecteur d'écran entend la nouvelle quantité et le total.
  const handleChange = (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = Math.max(0, Math.min(99, item.quantity + delta));
    const total = Math.max(0, Math.round((summary.totalVolume + (next - item.quantity) * item.volume) * 10) / 10);
    updateQuantity(id, delta);
    setShowHint(false);
    setAnnouncement(c.announceItem(rowName(item, lang), next, formatVolume(total, lang)));
  };

  const handlePreset = (presetId: string, name: string, volume: number) => {
    applyPreset(presetId);
    setShowHint(false);
    setAnnouncement(c.announcePreset(name, formatVolume(volume, lang)));
  };

  const handleReset = () => {
    resetCalculator();
    setAnnouncement(c.announceReset);
  };

  const handleProceed = () => {
    if (empty) {
      setShowHint(true);
      return;
    }
    // `name` reste en français (e-mail à Batimove) ; le checkout retrouve le nom
    // dans la langue de la page à partir de `id`.
    const payload = {
      items: getAllItems().map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        volume: item.volume,
        needsDisassembly: item.disassemble,
      })),
      totalVolume: summary.totalVolume,
      estimatedPrice: summary.estimatedPrice,
      totalItems: summary.totalItems,
      disassembleCount: summary.disassembleCount,
      timestamp: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(CALCULATOR_CHECKOUT_KEY, JSON.stringify(payload));
    } catch {
      /* stockage bloqué : la page suivante affichera son état vide */
    }
    navigate(lp('/calculator/checkout'), { state: payload });
  };

  // Navigation clavier entre les onglets (flèches gauche/droite).
  const onTabKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + CALCULATOR_CATEGORIES.length) % CALCULATOR_CATEGORIES.length;
    setActiveCategory(CALCULATOR_CATEGORIES[next].id);
    tabRefs.current[next]?.focus();
  };

  const ctaLabel = c.cta;

  return (
    <div className="bg-[#F8FAFC] font-sans text-slate-900">
      <SEO
        title="Calculateur de Volume Déménagement Gratuit - Batimove"
        description="Calculez le volume en m³ de vos meubles et recevez votre prix ferme sous 30 min pour votre déménagement à Genève, Lausanne et en Suisse romande."
        canonical="https://www.batimove.ch/calculator"
      />
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      <div className="mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-20">
        <header className="max-w-3xl">
          <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-[#0B1E33] sm:text-4xl">
            {c.title}
            <span className="sr-only">{c.titleSr}</span>
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">{c.intro}</p>
        </header>

        {/* Logements types */}
        <section aria-labelledby="presets-title" className="mt-8">
          <h2 id="presets-title" className="text-lg font-semibold text-[#0B1E33]">
            {c.presetsTitle}
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {HOUSING_PRESETS.map((preset) => {
              const selected = activePreset === preset.id;
              const volume = presetVolume(preset.defaultItems);
              const name = lang === 'en' ? preset.nameEn : preset.name;
              return (
                <li key={preset.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handlePreset(preset.id, name, volume)}
                    className={`flex h-full min-h-[72px] w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-[border-color,background-color,box-shadow] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] ${
                      selected
                        ? 'border-[#0B1E33] shadow-[inset_0_0_0_1px_#0B1E33]'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block font-display text-lg font-semibold tracking-tight text-[#0B1E33]">{name}</span>
                      <span className="block text-sm text-slate-500">{lang === 'en' ? preset.roomsEn : preset.rooms}</span>
                      <span className="block text-sm font-semibold tabular-nums text-[#0B1E33]">≈ {formatVolume(volume, lang)} m³</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${selected ? 'bg-[#0B1E33] text-white' : 'border border-slate-300'}`}
                    >
                      {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* Inventaire */}
          <section aria-labelledby="inventory-title" className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-8">
            <div className="border-b border-slate-200 px-4 pb-4 pt-5 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="inventory-title" className="font-display text-xl font-medium tracking-tight text-[#0B1E33]">
                  {c.inventoryTitle}
                </h2>
                <button type="button" onClick={handleReset} disabled={empty} className={buttonClass('ghost', 'sm', '-mr-2 text-slate-600')}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  {c.clearAll}
                </button>
              </div>

              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <label htmlFor="calc-search" className="sr-only">
                  {c.search}
                </label>
                <input
                  id="calc-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={c.search}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-10 text-lg text-[#0B1E33] placeholder:text-slate-500 outline-none transition-[border-color,box-shadow] duration-150 hover:border-slate-400 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/25 [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={c.clearSearch}
                    className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#0B1E33]"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {!query && (
                <div role="tablist" aria-label={c.roomsTabs} className="-mx-1 mt-4 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {CALCULATOR_CATEGORIES.map((cat, index) => {
                    const selected = activeCategory === cat.id;
                    const count = countByCategory[cat.id].count;
                    return (
                      <button
                        key={cat.id}
                        ref={(el) => {
                          tabRefs.current[index] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`tab-${cat.id}`}
                        aria-selected={selected}
                        aria-controls="calc-items"
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setActiveCategory(cat.id)}
                        onKeyDown={(e) => onTabKey(e, index)}
                        className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-base font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] ${
                          selected ? 'bg-[#0B1E33] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1E33]'
                        }`}
                      >
                        <span title={lang === 'en' ? cat.labelEn : cat.label}>{lang === 'en' ? cat.shortEn : cat.short}</span>
                        {count > 0 && (
                          <span
                            className={`min-w-[22px] rounded-full px-1.5 text-center text-sm tabular-nums ${
                              selected ? 'bg-white/20 text-white' : 'bg-slate-200 text-[#0B1E33]'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <ul
              id="calc-items"
              role={query ? undefined : 'tabpanel'}
              aria-labelledby={query ? undefined : `tab-${activeCategory}`}
              className="divide-y divide-slate-200"
            >
              {visibleItems.map((item) => (
                <ItemRow key={item.id} item={item} lang={lang} c={c} onChange={handleChange} onToggleDisassemble={toggleDisassemble} />
              ))}
            </ul>
            {visibleItems.length === 0 && (
              <div className="px-5 py-10 text-center">
                <p className="text-lg font-semibold text-[#0B1E33]">{c.noMatch(query)}</p>
                <p className="mt-1 text-base text-slate-600">{c.noMatchHint}</p>
              </div>
            )}
          </section>

          {/* Récapitulatif (collant sur desktop) */}
          <aside aria-labelledby="summary-title" className="lg:sticky lg:top-36 lg:col-span-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-rest sm:p-6">
              <h2 id="summary-title" className="text-base font-semibold text-slate-600">
                {c.summaryTitle}
              </h2>
              <p className="mt-1 font-display text-5xl font-medium tracking-tight text-[#0B1E33] tabular-nums">
                {formatVolume(summary.totalVolume, lang)}
                <span className="ml-1.5 text-2xl font-semibold text-slate-500">m³</span>
              </p>
              <p className="mt-1 text-base text-slate-600 tabular-nums">
                {c.itemCount(summary.totalItems)}
                {summary.disassembleCount > 0 && c.disassembleCount(summary.disassembleCount)}
              </p>

              <dl className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                {CALCULATOR_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="flex items-baseline justify-between gap-3 py-2.5">
                    <dt className="text-base text-slate-600">{lang === 'en' ? cat.labelEn : cat.label}</dt>
                    <dd className="text-base font-semibold tabular-nums text-[#0B1E33]">
                      {formatVolume(Math.round(countByCategory[cat.id].volume * 10) / 10, lang)} m³
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-base leading-relaxed text-slate-600">{c.summaryNote}</p>
              <button type="button" onClick={handleProceed} aria-disabled={empty} className={buttonClass('primary', 'lg', `mt-5 w-full ${empty ? 'opacity-50' : ''}`)}>
                {ctaLabel}
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              {/* No celular, o alerta aparece na barra fixa; aqui só no desktop. */}
              {(empty || showHint) && (
                <p
                  className={`mt-2.5 text-sm ${showHint ? 'hidden text-red-700 lg:block' : 'text-slate-500'}`}
                  role={showHint ? 'alert' : undefined}
                >
                  {c.emptyHint}
                </p>
              )}
              <a
                href="tel:0800825925"
                className="mt-4 flex items-center justify-center gap-2 py-2 text-base font-semibold text-[#0B1E33] transition-colors hover:text-[#0369A1]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {c.talk} <span className="tabular-nums">0800 825 925</span>
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* Barre récapitulative mobile (l'espace à droite reste libre pour le bouton WhatsApp) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        {showHint && (
          <p role="alert" className="px-4 pt-2.5 text-sm text-red-700">
            {c.emptyHint}
          </p>
        )}
        <div className="flex items-center gap-3 py-3 pl-4 pr-[92px]">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">{c.mobileVolume}</p>
            <p className="font-display text-xl font-medium leading-tight tracking-tight text-[#0B1E33] tabular-nums">
              {formatVolume(summary.totalVolume, lang)} m³
            </p>
          </div>
          <button
            type="button"
            onClick={handleProceed}
            aria-disabled={empty}
            aria-label={ctaLabel}
            className={buttonClass('primary', 'md', `ml-auto min-w-0 ${empty ? 'opacity-50' : ''}`)}
          >
            {c.ctaShort}
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
