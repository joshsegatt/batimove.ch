import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, Shield, ExternalLink, Linkedin, Instagram, Facebook, MapPin, Mail, Clock, Search, ChevronRight, ChevronDown, Lock } from 'lucide-react';
import { Button, Logo } from './UIComponents';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from './BrandMark';
import { WhatsappIcon } from './WhatsAppButton';
import { QUOTE_SERVICES } from '../data/quoteServices';

// Navegação principal. Estrutura inspirada na Helvetia (menu por serviço, com um
// painel dedicado "Déménagement"), no estilo Batimove e só com páginas que existem.
const MENU_REGIONS = [
  { label: 'Genève', hint: 'Ville et communes du canton', to: '/demenagement-geneve' },
  { label: 'Lausanne', hint: 'Ville et région lausannoise', to: '/demenagement-lausanne' },
  { label: 'Canton de Vaud', hint: 'Nyon, Morges, Vevey, Montreux…', to: '/demenagement-vaud' },
];

const MENU_LINKS: { label: string; to: string; xlOnly?: boolean }[] = [
  { label: 'Débarras', to: '/debarras' },
  { label: 'Nettoyage', to: '/nettoyage-fin-de-bail' },
  { label: 'Garde-meubles', to: '/garde-meubles' },
  // Some entre 1024 e 1279 px para a barra caber; continua no footer e no menu mobile.
  { label: 'Calculateur', to: '/calculator', xlOnly: true },
  { label: 'Contact', to: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const location = useLocation();
  const hoverTimer = useRef<number | undefined>(undefined);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const megaWrapRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const megaId = 'menu-demenagement';

  // Rolagem travada com o menu mobile aberto; foco vai para o botão de fechar.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    if (isMobileMenuOpen) mobileCloseRef.current?.focus();
  }, [isMobileMenuOpen]);

  // Trocar de página fecha tudo.
  useEffect(() => {
    setIsMegaOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Esc fecha e devolve o foco a quem abriu; clique fora fecha o painel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isMegaOpen) {
        setIsMegaOpen(false);
        megaTriggerRef.current?.focus();
      }
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileToggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (isMegaOpen && megaWrapRef.current && !megaWrapRef.current.contains(e.target as Node)) setIsMegaOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [isMegaOpen, isMobileMenuOpen]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // Abre com um pequeno atraso no hover (evita abrir ao só passar o mouse) e fecha
  // com folga ao sair, para dar tempo de descer do botão ao painel.
  const openSoon = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setIsMegaOpen(true), 90);
  };
  const closeSoon = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setIsMegaOpen(false), 160);
  };

  const isActive = (to: string) => {
    const [path, query] = to.split('?');
    if (location.pathname !== path) return false;
    return query ? location.search.includes(query) : !location.search.includes('type=') || path !== '/services';
  };
  const isDemenagementActive =
    location.pathname.startsWith('/demenagement-') ||
    (location.pathname === '/services' && !/type=(debarras|nettoyage)/.test(location.search));

  const navLinkClass = (active: boolean) =>
    `group relative inline-flex h-[68px] items-center whitespace-nowrap text-base font-semibold xl:text-lg transition-colors duration-150 focus-visible:outline-none ${
      active ? 'text-[#0B1E33]' : 'text-slate-600 hover:text-[#0B1E33]'
    }`;
  const activeBar = <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#0B1E33]" />;

  return (
    <header className="sticky top-0 z-[70] w-full border-b border-slate-200 bg-white/95 font-sans backdrop-blur-md">
      {/* Faixa de informações */}
      <div className="hidden border-b border-white/10 bg-[#07182b] py-2 text-xs text-slate-300 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              Rue de Monthoux 64, 1201 Genève
            </span>
            <a href="tel:0800825925" className="flex items-center gap-2 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              <span className="font-semibold text-white tabular-nums">0800 825 925</span> (gratuit en Suisse)
            </a>
            <a href="mailto:info@batimove.ch" className="flex items-center gap-2 transition-colors hover:text-white">
              <Mail className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              info@batimove.ch
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              Bureau : lun. au sam., 8h00 à 19h00
            </span>
            <span>Joignable 7j/7</span>
          </div>
        </div>
      </div>

      {/* Barra principal + painel Déménagement */}
      <div ref={megaWrapRef} onPointerLeave={closeSoon} className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] items-center justify-between gap-6">
            <Link
              to="/"
              aria-label="Batimove, retour à l'accueil"
              className="shrink-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0284c7]"
            >
              <BrandLogo markClassName="h-8 w-auto sm:h-9" textClassName="text-lg text-[#0B1E33] sm:text-xl" />
            </Link>

            <nav aria-label="Navigation principale" className="hidden lg:block">
              <ul className="flex items-center gap-5 xl:gap-8">
                <li onPointerEnter={openSoon}>
                  <button
                    ref={megaTriggerRef}
                    type="button"
                    aria-expanded={isMegaOpen}
                    aria-controls={megaId}
                    onClick={() => setIsMegaOpen((o) => !o)}
                    className={`${navLinkClass(isDemenagementActive || isMegaOpen)} gap-1.5`}
                  >
                    <span className="rounded-md group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[#0284c7]">Déménagement</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMegaOpen ? 'rotate-180' : ''}`}
                    />
                    {isDemenagementActive && activeBar}
                  </button>
                </li>
                {MENU_LINKS.map((l) => {
                  const active = isActive(l.to);
                  return (
                    <li key={l.to} onPointerEnter={closeSoon} className={l.xlOnly ? 'hidden xl:block' : undefined}>
                      <Link to={l.to} aria-current={active ? 'page' : undefined} className={navLinkClass(active)}>
                        <span className="rounded-md group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[#0284c7]">{l.label}</span>
                        {active && activeBar}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              <Link
                to="/quote"
                className="btn btn-md btn-primary h-10 px-4 text-base"
              >
                Devis gratuit
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex items-center gap-1 lg:hidden">
            <a
              href="tel:0800825925"
              aria-label="Appeler le 0800 825 925 (gratuit)"
              className="grid h-11 w-11 place-items-center rounded-xl text-[#0B1E33] transition-colors hover:bg-slate-100 md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
            </a>
            <button
              ref={mobileToggleRef}
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl text-[#0B1E33] transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="menu-mobile"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            </div>
          </div>
        </div>

        {/* Painel dedicado "Déménagement" (desktop) */}
        {isMegaOpen && (
        <div
          id={megaId}
          className="nav-panel-in absolute inset-x-0 top-full hidden border-t border-slate-200 bg-white shadow-overlay lg:block"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">
            <div className="col-span-6">
              <p className="text-sm font-semibold text-slate-500">Nos prestations</p>
              <ul className="mt-3 grid grid-cols-2 gap-1">
                {QUOTE_SERVICES.map(({ id, label, hint, icon: Icon, page }) => (
                  <li key={id}>
                    <Link
                      to={page}
                      className="group flex items-center gap-3.5 rounded-xl p-3 transition-colors duration-150 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#0B1E33] transition-colors duration-150 group-hover:bg-[#0B1E33] group-hover:text-white group-focus-visible:bg-[#0B1E33] group-focus-visible:text-white">
                        <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-lg font-semibold leading-snug tracking-tight text-[#0B1E33]">{label}</span>
                        <span className="block text-sm text-slate-500">{hint}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-3 border-l border-slate-200 pl-8">
              <p className="text-sm font-semibold text-slate-500">Par région</p>
              <ul className="mt-3 space-y-1">
                {MENU_REGIONS.map((r) => (
                  <li key={r.to}>
                    <Link
                      to={r.to}
                      className="group -mx-3 flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
                    >
                      <span>
                        <span className="block text-lg font-semibold text-[#0B1E33]">{r.label}</span>
                        <span className="block text-sm text-slate-500">{r.hint}</span>
                      </span>
                      <ChevronRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-slate-300 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-[#0B1E33]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-3">
              <div className="flex h-full flex-col rounded-xl bg-slate-50 p-6">
                <p className="font-display text-xl font-medium tracking-tight text-[#0B1E33]">Devis gratuit sous 30&nbsp;min</p>
                <p className="mt-2 text-base leading-relaxed text-slate-600">
                  Prix ferme&nbsp;: aucun surcoût une fois le devis accepté. Réponse de 8h à 19h.
                </p>
                <div className="mt-auto space-y-3 pt-6">
                  <Link
                    to="/quote"
                    className="btn btn-md btn-primary w-full"
                  >
                    Demander un devis
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/calculator"
                    className="block text-center text-lg font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#0B1E33]"
                  >
                    Estimer mon volume
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <>
          <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 z-[70] bg-[#0B1E33]/50" aria-hidden="true" />
          <div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="nav-drawer-in fixed right-0 top-0 z-[80] flex h-[100dvh] w-[min(400px,88vw)] flex-col bg-white shadow-modal"
          >
            <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-slate-200 px-5">
              <BrandLogo markClassName="h-8 w-auto" textClassName="text-lg text-[#0B1E33]" />
              <button
                ref={mobileCloseRef}
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  mobileToggleRef.current?.focus();
                }}
                className="grid h-11 w-11 place-items-center rounded-xl text-[#0B1E33] transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
                aria-label="Fermer le menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto px-5 py-6">
              <p className="text-sm font-semibold text-slate-500">Nos prestations</p>
              <ul className="mt-2 overflow-hidden rounded-xl border border-slate-200">
                {QUOTE_SERVICES.map(({ id, label, hint, icon: Icon, page }, i) => (
                  <li key={id} className="relative">
                    {i > 0 && <span aria-hidden="true" className="absolute left-[72px] right-0 top-0 h-px bg-slate-200" />}
                    <Link to={page} className="flex min-h-[64px] items-center gap-3.5 px-4 py-3 active:bg-slate-100">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#0B1E33]">
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-semibold leading-snug text-[#0B1E33]">{label}</span>
                        <span className="block text-sm text-slate-500">{hint}</span>
                      </span>
                      <ChevronRight className="h-[18px] w-[18px] shrink-0 text-slate-300" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-7 text-sm font-semibold text-slate-500">Par région</p>
              <ul className="mt-2 overflow-hidden rounded-xl border border-slate-200">
                {MENU_REGIONS.map((r, i) => (
                  <li key={r.to} className={i > 0 ? 'border-t border-slate-200' : ''}>
                    <Link to={r.to} className="flex min-h-[52px] items-center justify-between px-4 text-lg font-semibold text-[#0B1E33] active:bg-slate-100">
                      {r.label}
                      <ChevronRight className="h-[18px] w-[18px] text-slate-300" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="mt-7 space-y-1">
                {[{ label: 'Calculateur de volume', to: '/calculator' }, { label: 'Contact', to: '/contact' }].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="-mx-2 flex min-h-[48px] items-center rounded-lg px-2 text-lg font-semibold text-[#0B1E33] active:bg-slate-100">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="shrink-0 space-y-3 border-t border-slate-200 p-5">
              <Link
                to="/quote"
                className="btn btn-lg btn-primary w-full"
              >
                Demander un devis gratuit
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <a href="tel:0800825925" className="btn btn-lg btn-outline w-full">
                <Phone className="h-5 w-5" aria-hidden="true" />
                <span className="tabular-nums">0800 825 925</span>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

// Rodapé dedicado: todas as páginas reais do site, contato direto e dados legais.
// Oculto só nos funis de conversão (orçamento e checkout da calculadora).
const FOOTER_COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Prestations',
    links: [
      { label: 'Déménagement privé', to: '/services?type=prive' },
      { label: "Déménagement d'entreprise", to: '/services?type=entreprise' },
      { label: 'Débarras', to: '/debarras' },
      { label: 'Nettoyage de fin de bail', to: '/nettoyage-fin-de-bail' },
      { label: 'Garde-meubles', to: '/garde-meubles' },
    ],
  },
  {
    title: 'Régions',
    links: [
      { label: 'Déménagement Genève', to: '/demenagement-geneve' },
      { label: 'Déménagement Lausanne', to: '/demenagement-lausanne' },
      { label: 'Déménagement Vaud', to: '/demenagement-vaud' },
      { label: 'Débarras Genève', to: '/debarras-geneve' },
      { label: 'Débarras Lausanne', to: '/debarras-lausanne' },
      { label: 'Nettoyage Genève', to: '/nettoyage-fin-de-bail-geneve' },
      { label: 'Nettoyage Lausanne', to: '/nettoyage-fin-de-bail-lausanne' },
    ],
  },
  {
    title: 'Outils',
    links: [
      { label: 'Devis gratuit en 4 étapes', to: '/quote' },
      { label: 'Calculateur de volume', to: '/calculator' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Mentions légales', to: '/legal' },
      { label: 'Conditions générales (CGV)', to: '/terms' },
      { label: 'Protection des données', to: '/privacy' },
    ],
  },
];

export const Footer: React.FC = () => {
  const location = useLocation();
  const isHidden =
    location.pathname === '/quote' || location.pathname.startsWith('/quote/') || location.pathname === '/calculator/checkout';
  if (isHidden) return null;

  const linkClass =
    'rounded text-base text-slate-300 transition-colors duration-150 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300';

  return (
    <footer className="bg-[#0B1E33] font-sans text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Marca e contato direto */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              aria-label="Batimove, retour à l'accueil"
              className="inline-flex rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
            >
              <BrandLogo markClassName="h-8 w-auto" textClassName="text-xl text-white" />
            </Link>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-300">
              Déménagement, débarras, nettoyage de fin de bail et garde-meubles à Genève et dans le canton de Vaud.
            </p>
            <ul className="mt-6 space-y-3 text-base">
              <li>
                <a href="tel:0800825925" className={`${linkClass} inline-flex items-center gap-2.5 font-semibold text-white`}>
                  <Phone className="h-4 w-4 text-sky-300" aria-hidden="true" />
                  <span className="tabular-nums">0800 825 925</span>
                  <span className="font-normal text-slate-400">appel gratuit</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/41798896406" target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-2.5`}>
                  <WhatsappIcon className="h-4 w-4 text-sky-300" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:info@batimove.ch" className={`${linkClass} inline-flex items-center gap-2.5`}>
                  <Mail className="h-4 w-4 text-sky-300" aria-hidden="true" />
                  info@batimove.ch
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5 text-slate-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                Rue de Monthoux 64, 1201 Genève
              </li>
            </ul>
            <div className="mt-7">
              <Link to="/quote" className="btn btn-md btn-inverse">
                Demander un devis gratuit
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Colunas de páginas */}
          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="font-display text-base font-semibold text-white">{col.title}</h2>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className={linkClass}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Base: dados legais */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Batimove Sàrl · IDE CHE-143.091.230 · Genève, Vaud, Fribourg, Valais</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="https://www.instagram.com/batimove.sarl/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
              @batimove.sarl
            </a>
            <a
              href="https://joshsegatt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
            >
              Site par joshsegatt
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
