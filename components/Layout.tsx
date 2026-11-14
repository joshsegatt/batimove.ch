import { LangSwitch } from './LangSwitch';
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, Shield, ExternalLink, Linkedin, Instagram, Facebook, MapPin, Mail, Clock, Search, ChevronRight, ChevronDown, Lock, ArrowUpFromLine, ArrowUpRight } from 'lucide-react';
import { Button, Logo } from './UIComponents';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from './BrandMark';
import { WhatsappIcon } from './WhatsAppButton';
import { QUOTE_SERVICES, localizeQuoteService } from '../data/quoteServices';
import { alternatePath, defineCopy, useLang, type Lang } from '../i18n';
import { LOCALITIES, localPath, localizeLocality } from '../data/localities';
import { COUNTRIES } from '../data/countries';
import { MONTE_CHARGE_URL } from '../data/sites';

// Navegação principal. Estrutura inspirada na Helvetia (menu por serviço, com um
// painel dedicado "Déménagement" que lista todas as páginas de mudança por cidade
// e por país), no estilo Batimove e só com páginas que existem.
// Os caminhos (`to`) são sempre franceses e passam por lp() na hora de renderizar.
type MenuLink = { label: string; to: string; xlOnly?: boolean };
/** Link de mudança: rótulo curto no menu ("Nyon") e completo no rodapé ("Déménagement Nyon"). */
type MoveLink = MenuLink & { full: string };

const MOVE_LINKS_COPY = defineCopy(
  {
    canton: (name: string) => `Canton de ${name}`,
    move: (name: string) => `Déménagement ${name}`,
    moveTo: (p: { name: string; enTo: string }) => `Déménagement ${p.name}`,
    international: 'Tous les pays',
    internationalFull: 'Déménagement international',
    london: 'Genève – Londres',
  },
  {
    canton: (name: string) => `Canton of ${name}`,
    move: (name: string) => `Removals ${name}`,
    moveTo: (p: { name: string; enTo: string }) => `Removals to ${p.enTo}`,
    international: 'All countries',
    internationalFull: 'International removals',
    london: 'Geneva – London',
  }
);

/** Páginas de mudança na Suíça, uma por localidade (Genève, Nyon, Sion…). */
const swissMoveLinks = (lang: Lang): MoveLink[] =>
  LOCALITIES.map((raw) => {
    const l = localizeLocality(raw, lang);
    const k = MOVE_LINKS_COPY[lang];
    return {
      label: raw.kind === 'canton' ? k.canton(l.name) : l.name,
      full: k.move(l.name),
      to: localPath('demenagement', raw.slug),
    };
  });

/** Páginas de mudança para o exterior: um link por país, mais Londres e a página geral. */
const abroadMoveLinks = (lang: Lang): MoveLink[] => {
  const k = MOVE_LINKS_COPY[lang];
  return [
    ...COUNTRIES.map((p) => {
      const name = lang === 'en' ? p.nameEn : p.name;
      return { label: name, full: k.moveTo(p), to: p.path };
    }),
    { label: k.london, full: k.london, to: '/demenagement-londres' },
    { label: k.international, full: k.internationalFull, to: '/demenagement-international' },
  ];
};

const NAV_COPY = defineCopy(
  {
    address: 'Rue de Monthoux 64, 1201 Genève',
    freeInSwitzerland: '(gratuit en Suisse)',
    officeHours: 'Bureau : lun. au sam., 8h00 à 19h00',
    reachable: 'Joignable 7j/7',
    homeLabel: "Batimove, retour à l'accueil",
    mainNav: 'Navigation principale',
    moving: 'Déménagement',
    freeQuote: 'Devis gratuit',
    callFree: 'Appeler le 0800 825 925 (gratuit)',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    menu: 'Menu',
    ourServices: 'Nos prestations',
    inSwitzerland: 'Déménagement en Suisse',
    abroad: "Déménagement à l'étranger",
    panelTitle: 'Devis gratuit sous 30\u00a0min',
    panelText: 'Prix ferme\u00a0: aucun surcoût une fois le devis accepté. Réponse de 8h à 19h.',
    requestQuote: 'Demander un devis',
    estimateVolume: 'Estimer mon volume',
    mobileNav: 'Navigation mobile',
    requestFreeQuote: 'Demander un devis gratuit',
    liftLabel: 'Location monte-meubles',
    liftHint: 'Avec opérateur, sur locationmontecharge.ch',
    newTab: '(nouvel onglet)',
    divisions: 'Activités Batimove',
    divisionMoving: 'Déménagement',
    divisionReno: 'Rénovation & étanchéité',
    guides: 'Guides & conseils',
    renoTeaserTitle: 'Rénovation & étanchéité',
    renoTeaserText: 'Appartements, maisons et immeubles à Genève.',
    links: [
      { label: 'Débarras', to: '/debarras' },
      { label: 'Nettoyage', to: '/nettoyage-fin-de-bail' },
      { label: 'Garde-meubles', to: '/garde-meubles' },
      // Some entre 1024 e 1279 px para a barra caber; continua no footer e no menu mobile.
      { label: 'Calculateur', to: '/calculator', xlOnly: true },
      { label: 'Contact', to: '/contact' },
    ] as MenuLink[],
    mobileLinks: [
      { label: 'Livraison & installation', to: '/livraison-installation' },
      { label: 'Guides & conseils', to: '/guides' },
      { label: 'Calculateur de volume', to: '/calculator' },
      { label: 'Contact', to: '/contact' },
    ] as MenuLink[],
  },
  {
    address: 'Rue de Monthoux 64, 1201 Genève',
    freeInSwitzerland: '(free in Switzerland)',
    officeHours: 'Office: Mon–Sat, 8am to 7pm',
    reachable: 'Available 7 days a week',
    homeLabel: 'Batimove, back to the home page',
    mainNav: 'Main navigation',
    moving: 'Removals',
    freeQuote: 'Free quote',
    callFree: 'Call 0800 825 925 (free)',
    openMenu: 'Open the menu',
    closeMenu: 'Close the menu',
    menu: 'Menu',
    ourServices: 'Our services',
    inSwitzerland: 'Removals in Switzerland',
    abroad: 'Removals abroad',
    panelTitle: 'Free quote within 30\u00a0min',
    panelText: 'Fixed price: no extra charges once the quote is accepted. We reply from 8am to 7pm.',
    requestQuote: 'Request a quote',
    estimateVolume: 'Estimate my volume',
    mobileNav: 'Mobile navigation',
    requestFreeQuote: 'Request a free quote',
    liftLabel: 'Furniture lift hire',
    liftHint: 'With operator, on locationmontecharge.ch',
    newTab: '(new tab)',
    divisions: 'Batimove divisions',
    divisionMoving: 'Removals',
    divisionReno: 'Renovation & waterproofing',
    guides: 'Guides & advice',
    renoTeaserTitle: 'Renovation & waterproofing',
    renoTeaserText: 'Flats, houses and buildings in Geneva.',
    links: [
      { label: 'House clearance', to: '/debarras' },
      { label: 'Cleaning', to: '/nettoyage-fin-de-bail' },
      { label: 'Storage', to: '/garde-meubles' },
      { label: 'Calculator', to: '/calculator', xlOnly: true },
      { label: 'Contact', to: '/contact' },
    ],
    mobileLinks: [
      { label: 'Delivery & installation', to: '/livraison-installation' },
      { label: 'Guides & advice', to: '/guides' },
      { label: 'Volume calculator', to: '/calculator' },
      { label: 'Contact', to: '/contact' },
    ],
  }
);

/** Lista compacta de páginas de mudança no painel do menu (texto, sem ícones). */
const MoveLinkList: React.FC<{ title: string; links: MenuLink[]; columns: 2 | 3; className?: string }> = ({
  title,
  links,
  columns,
  className = '',
}) => {
  const { lp } = useLang();
  return (
    <div className={`border-l border-slate-200 pl-8 ${className}`}>
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      {/* Colunas de cima para baixo: a ordem segue os cantões (Genève, Vaud, Fribourg, Valais) */}
      <ul className={`mt-3 gap-x-6 ${columns === 3 ? 'columns-3' : 'columns-2'}`}>
        {links.map((l) => (
          <li key={l.to} className="break-inside-avoid">
            <Link
              to={lp(l.to)}
              className="-mx-2 block rounded-lg px-2 py-1.5 text-base text-[#0B1E33] transition-colors duration-150 hover:bg-slate-50 hover:underline hover:decoration-slate-300 hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Seletor entre as duas atividades da Batimove, na faixa de informações.
 * Cada atividade tem o seu próprio menu; este é o único ponto de passagem.
 */
export const DivisionSwitch: React.FC<{
  current: 'moving' | 'reno';
  labels: { group: string; moving: string; reno: string };
}> = ({ current, labels }) => {
  const { lp } = useLang();
  const items = [
    { id: 'moving' as const, label: labels.moving, to: '/' },
    { id: 'reno' as const, label: labels.reno, to: '/renovation' },
  ];
  return (
    <nav aria-label={labels.group} className="flex shrink-0 items-center whitespace-nowrap rounded-md bg-white/5 p-0.5">
      {items.map((it) =>
        it.id === current ? (
          <span
            key={it.id}
            aria-current="true"
            className="rounded bg-white/15 px-2.5 py-1 font-semibold text-white"
          >
            {it.label}
          </span>
        ) : (
          <Link
            key={it.id}
            to={lp(it.to)}
            className="rounded px-2.5 py-1 text-slate-300 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
          >
            {it.label}
          </Link>
        )
      )}
    </nav>
  );
};

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
  const { lang, lp } = useLang();
  const c = NAV_COPY[lang];
  const services = QUOTE_SERVICES.map((s) => localizeQuoteService(s, lang));
  const swissMoves = swissMoveLinks(lang);
  const abroadMoves = abroadMoveLinks(lang);
  // Caminho atual em francês: a mesma regra de "ativo" vale em /… e em /en/….
  const frPathname = alternatePath(location.pathname, 'fr');

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
    if (frPathname !== path) return false;
    return query ? location.search.includes(query) : !location.search.includes('type=') || path !== '/quote';
  };
  const isDemenagementActive =
    frPathname.startsWith('/demenagement-') ||
    (frPathname === '/quote' && /type=(prive|entreprise)/.test(location.search));

  const navLinkClass = (active: boolean) =>
    `group relative inline-flex h-[68px] items-center whitespace-nowrap text-base font-semibold xl:text-lg transition-colors duration-150 focus-visible:outline-none ${
      active ? 'text-[#0B1E33]' : 'text-slate-600 hover:text-[#0B1E33]'
    }`;
  const activeBar = <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#0B1E33]" />;

  return (
    <header className="sticky top-0 z-[70] w-full border-b border-slate-200 bg-white/95 font-sans backdrop-blur-md">
      {/* Faixa de informações */}
      <div className="hidden border-b border-white/10 bg-[#07182b] py-2 text-xs text-slate-300 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <DivisionSwitch current="moving" labels={{ group: c.divisions, moving: c.divisionMoving, reno: c.divisionReno }} />
            <span className="hidden items-center gap-2 whitespace-nowrap 2xl:flex">
              <MapPin className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              {c.address}
            </span>
            <a href="tel:0800825925" className="flex items-center gap-2 whitespace-nowrap transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              <span className="font-semibold text-white tabular-nums">0800 825 925</span> {c.freeInSwitzerland}
            </a>
            <a href="mailto:info@batimove.ch" className="hidden items-center gap-2 whitespace-nowrap transition-colors hover:text-white lg:flex">
              <Mail className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              info@batimove.ch
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-1.5 whitespace-nowrap 2xl:flex">
              <Clock className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              {c.officeHours}
            </span>
            <span className="whitespace-nowrap">{c.reachable}</span>
          </div>
        </div>
      </div>

      {/* Barra principal + painel Déménagement */}
      <div ref={megaWrapRef} onPointerLeave={closeSoon} className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] items-center justify-between gap-3 sm:gap-6 lg:gap-4 xl:gap-6">
            <Link
              to={lp('/')}
              aria-label={c.homeLabel}
              className="shrink-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0284c7]"
            >
              <BrandLogo markClassName="h-8 w-auto sm:h-9" textClassName="text-lg text-[#0B1E33] sm:text-xl" />
            </Link>

            <nav aria-label={c.mainNav} className="hidden lg:block">
              <ul className="flex items-center gap-4 xl:gap-8">
                <li onPointerEnter={openSoon}>
                  <button
                    ref={megaTriggerRef}
                    type="button"
                    aria-expanded={isMegaOpen}
                    aria-controls={megaId}
                    onClick={() => setIsMegaOpen((o) => !o)}
                    className={`${navLinkClass(isDemenagementActive || isMegaOpen)} gap-1.5`}
                  >
                    <span className="rounded-md group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[#0284c7]">{c.moving}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMegaOpen ? 'rotate-180' : ''}`}
                    />
                    {isDemenagementActive && activeBar}
                  </button>
                </li>
                {c.links.map((l) => {
                  const active = isActive(l.to);
                  return (
                    <li key={l.to} onPointerEnter={closeSoon} className={l.xlOnly ? 'hidden xl:block' : undefined}>
                      <Link to={lp(l.to)} aria-current={active ? 'page' : undefined} className={navLinkClass(active)}>
                        <span className="rounded-md group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[#0284c7]">{l.label}</span>
                        {active && activeBar}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-3 lg:ml-0">
              <LangSwitch compactOnMobile />
              <Link
                to={lp('/quote')}
                className="btn btn-md btn-primary hidden h-10 px-4 text-base sm:inline-flex"
              >
                {c.freeQuote}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex items-center gap-1 lg:hidden">
            <a
              href="tel:0800825925"
              aria-label={c.callFree}
              className="grid h-11 w-11 place-items-center rounded-xl text-[#0B1E33] transition-colors hover:bg-slate-100 md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
            </a>
            <button
              ref={mobileToggleRef}
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl text-[#0B1E33] transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label={c.openMenu}
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
          <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 pb-6 pt-8">
            <div className="col-span-4">
              <p className="text-sm font-semibold text-slate-500">{c.ourServices}</p>
              <ul className="mt-3 grid grid-cols-1 gap-0.5">
                {services.map(({ id, label, hint, icon: Icon, page }) => (
                  <li key={id}>
                    <Link
                      to={lp(page)}
                      className="group -mx-3 flex items-center gap-3.5 rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
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
                <li>
                  <a
                    href={MONTE_CHARGE_URL}
                    target="_blank"
                    rel="noopener"
                    className="group -mx-3 flex items-center gap-3.5 rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#0B1E33] transition-colors duration-150 group-hover:bg-[#0B1E33] group-hover:text-white group-focus-visible:bg-[#0B1E33] group-focus-visible:text-white">
                      <ArrowUpFromLine className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 font-display text-lg font-semibold leading-snug tracking-tight text-[#0B1E33]">
                        {c.liftLabel}
                        <ArrowUpRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      </span>
                      <span className="block text-sm text-slate-500">{c.liftHint}</span>
                      <span className="sr-only">{c.newTab}</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <MoveLinkList title={c.inSwitzerland} links={swissMoves} columns={3} className="col-span-5" />
            <MoveLinkList title={c.abroad} links={abroadMoves} columns={2} className="col-span-3" />
          </div>

          {/* Faixa de devis */}
          <div className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-8 py-4">
              <p className="text-base text-slate-600">
                <span className="font-display text-lg font-medium tracking-tight text-[#0B1E33]">{c.panelTitle}</span>
                <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                {c.panelText}
              </p>
              <div className="flex shrink-0 items-center gap-6">
                <Link
                  to={lp('/guides')}
                  className="text-base font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#0B1E33]"
                >
                  {c.guides}
                </Link>
                <Link
                  to={lp('/calculator')}
                  className="text-base font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#0B1E33]"
                >
                  {c.estimateVolume}
                </Link>
                <Link to={lp('/quote')} className="btn btn-md btn-primary">
                  {c.requestQuote}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
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
            aria-label={c.menu}
            className="nav-drawer-in fixed right-0 top-0 z-[80] flex h-[100dvh] w-[min(400px,88vw)] flex-col bg-white shadow-modal"
          >
            <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-slate-200 px-5">
              <BrandLogo markClassName="h-8 w-auto" textClassName="text-lg text-[#0B1E33]" />
              <div className="flex items-center gap-2">
              <LangSwitch tone="light" />
              <button
                ref={mobileCloseRef}
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  mobileToggleRef.current?.focus();
                }}
                className="grid h-11 w-11 place-items-center rounded-xl text-[#0B1E33] transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
                aria-label={c.closeMenu}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
              </div>
            </div>

            <nav aria-label={c.mobileNav} className="flex-1 overflow-y-auto px-5 py-6">
              <p className="text-sm font-semibold text-slate-500">{c.ourServices}</p>
              <ul className="mt-2 overflow-hidden rounded-xl border border-slate-200">
                {services.map(({ id, label, hint, icon: Icon, page }, i) => (
                  <li key={id} className="relative">
                    {i > 0 && <span aria-hidden="true" className="absolute left-[72px] right-0 top-0 h-px bg-slate-200" />}
                    <Link to={lp(page)} className="flex min-h-[64px] items-center gap-3.5 px-4 py-3 active:bg-slate-100">
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
                <li className="relative">
                  <span aria-hidden="true" className="absolute left-[72px] right-0 top-0 h-px bg-slate-200" />
                  <a href={MONTE_CHARGE_URL} target="_blank" rel="noopener" className="flex min-h-[64px] items-center gap-3.5 px-4 py-3 active:bg-slate-100">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#0B1E33]">
                      <ArrowUpFromLine className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold leading-snug text-[#0B1E33]">{c.liftLabel}</span>
                      <span className="block text-sm text-slate-500">{c.liftHint}</span>
                      <span className="sr-only">{c.newTab}</span>
                    </span>
                    <ArrowUpRight className="h-[18px] w-[18px] shrink-0 text-slate-300" aria-hidden="true" />
                  </a>
                </li>
              </ul>

              <div className="mt-7 overflow-hidden rounded-xl border border-slate-200">
                {[
                  { title: c.inSwitzerland, links: swissMoves },
                  { title: c.abroad, links: abroadMoves },
                ].map((group, i) => (
                  <details key={group.title} className={`group ${i > 0 ? 'border-t border-slate-200' : ''}`}>
                    <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between px-4 text-lg font-semibold text-[#0B1E33] active:bg-slate-100 [&::-webkit-details-marker]:hidden">
                      {group.title}
                      <ChevronDown className="h-[18px] w-[18px] text-slate-400 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <ul className="grid grid-cols-2 gap-x-3 px-4 pb-3">
                      {group.links.map((l) => (
                        <li key={l.to}>
                          <Link to={lp(l.to)} className="flex min-h-[44px] items-center text-base text-[#0B1E33] active:text-[#0284c7]">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>

              <ul className="mt-7 space-y-1">
                {c.mobileLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={lp(l.to)} className="-mx-2 flex min-h-[48px] items-center rounded-lg px-2 text-lg font-semibold text-[#0B1E33] active:bg-slate-100">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* A outra atividade da Batimove, separada da mudança */}
              <Link
                to={lp('/renovation')}
                className="mt-7 flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-4 active:bg-slate-100"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-500">{c.divisions}</span>
                  <span className="mt-0.5 block text-lg font-semibold leading-snug text-[#0B1E33]">{c.renoTeaserTitle}</span>
                  <span className="block text-sm text-slate-500">{c.renoTeaserText}</span>
                </span>
                <ChevronRight className="h-[18px] w-[18px] shrink-0 text-slate-300" aria-hidden="true" />
              </Link>
            </nav>

            <div className="shrink-0 space-y-3 border-t border-slate-200 p-5">
              <Link
                to={lp('/quote')}
                className="btn btn-lg btn-primary w-full"
              >
                {c.requestFreeQuote}
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
type FooterColumn = { title: string; links: { label: string; to: string; external?: boolean }[] };

const FOOTER_COPY = defineCopy(
  {
    homeLabel: "Batimove, retour à l'accueil",
    tagline: 'Déménagement, débarras, nettoyage de fin de bail et garde-meubles à Genève et dans le canton de Vaud.',
    freeCall: 'appel gratuit',
    address: 'Rue de Monthoux 64, 1201 Genève',
    requestFreeQuote: 'Demander un devis gratuit',
    footerNav: 'Pied de page',
    movesNav: 'Pages déménagement',
    inSwitzerland: 'Déménagement en Suisse',
    abroad: "Déménagement à l'étranger",
    legalLine: 'Batimove Sàrl · IDE CHE-143.091.230 · Genève, Vaud, Fribourg, Valais',
    siteBy: 'Site par joshsegatt',
    columns: [
      {
        title: 'Prestations',
        links: [
          { label: 'Déménagement privé', to: '/quote?type=prive' },
          { label: "Déménagement d'entreprise", to: '/quote?type=entreprise' },
          { label: 'Déménagement international', to: '/demenagement-international' },
          { label: 'Débarras', to: '/debarras' },
          { label: 'Nettoyage de fin de bail', to: '/nettoyage-fin-de-bail' },
          { label: 'Garde-meubles', to: '/garde-meubles' },
          { label: 'Livraison & installation', to: '/livraison-installation' },
          { label: 'Location monte-meubles', to: MONTE_CHARGE_URL, external: true },
          { label: 'Rénovation & étanchéité', to: '/renovation' },
        ],
      },
      {
        title: 'Régions',
        links: [
          { label: 'Déménagement Genève', to: '/demenagement-geneve' },
          { label: 'Déménagement Lausanne', to: '/demenagement-lausanne' },
          { label: 'Déménagement Vaud', to: '/demenagement-vaud' },
          { label: 'Genève – Londres', to: '/demenagement-londres' },
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
          { label: 'Guides & conseils', to: '/guides' },
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
    ] as FooterColumn[],
  },
  {
    homeLabel: 'Batimove, back to the home page',
    tagline: 'Removals, house clearance, end of tenancy cleaning and storage in Geneva and the canton of Vaud.',
    freeCall: 'free call',
    address: 'Rue de Monthoux 64, 1201 Genève',
    requestFreeQuote: 'Request a free quote',
    footerNav: 'Footer',
    movesNav: 'Removals pages',
    inSwitzerland: 'Removals in Switzerland',
    abroad: 'Removals abroad',
    legalLine: 'Batimove Sàrl · UID CHE-143.091.230 · Geneva, Vaud, Fribourg, Valais',
    siteBy: 'Website by joshsegatt',
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'Home removals', to: '/quote?type=prive' },
          { label: 'Business removals', to: '/quote?type=entreprise' },
          { label: 'International removals', to: '/demenagement-international' },
          { label: 'House clearance', to: '/debarras' },
          { label: 'End of tenancy cleaning', to: '/nettoyage-fin-de-bail' },
          { label: 'Storage', to: '/garde-meubles' },
          { label: 'Delivery & installation', to: '/livraison-installation' },
          { label: 'Furniture lift hire', to: MONTE_CHARGE_URL, external: true },
          { label: 'Renovation & waterproofing', to: '/renovation' },
        ],
      },
      {
        title: 'Regions',
        links: [
          { label: 'Removals in Geneva', to: '/demenagement-geneve' },
          { label: 'Removals in Lausanne', to: '/demenagement-lausanne' },
          { label: 'Removals in Vaud', to: '/demenagement-vaud' },
          { label: 'Geneva – London', to: '/demenagement-londres' },
          { label: 'House clearance in Geneva', to: '/debarras-geneve' },
          { label: 'House clearance in Lausanne', to: '/debarras-lausanne' },
          { label: 'Cleaning in Geneva', to: '/nettoyage-fin-de-bail-geneve' },
          { label: 'Cleaning in Lausanne', to: '/nettoyage-fin-de-bail-lausanne' },
        ],
      },
      {
        title: 'Tools',
        links: [
          { label: 'Free quote in 4 steps', to: '/quote' },
          { label: 'Volume calculator', to: '/calculator' },
          { label: 'Guides & advice', to: '/guides' },
          { label: 'Contact', to: '/contact' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Legal notice', to: '/legal' },
          { label: 'Terms and conditions', to: '/terms' },
          { label: 'Privacy policy', to: '/privacy' },
        ],
      },
    ],
  }
);

export const Footer: React.FC = () => {
  const location = useLocation();
  const { lang, lp } = useLang();
  const c = FOOTER_COPY[lang];
  // Mesmas rotas nos dois idiomas: /en/quote, /en/quote/*, /en/volume-calculator/checkout.
  const frPathname = alternatePath(location.pathname, 'fr');
  const isHidden =
    frPathname === '/quote' || frPathname.startsWith('/quote/') || frPathname === '/calculator/checkout';
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
              to={lp('/')}
              aria-label={c.homeLabel}
              className="inline-flex rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
            >
              <BrandLogo markClassName="h-8 w-auto" textClassName="text-xl text-white" />
            </Link>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-300">
              {c.tagline}
            </p>
            <ul className="mt-6 space-y-3 text-base">
              <li>
                <a href="tel:0800825925" className={`${linkClass} inline-flex items-center gap-2.5 font-semibold text-white`}>
                  <Phone className="h-4 w-4 text-sky-300" aria-hidden="true" />
                  <span className="tabular-nums">0800 825 925</span>
                  <span className="font-normal text-slate-400">{c.freeCall}</span>
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
                {c.address}
              </li>
            </ul>
            <div className="mt-7">
              <Link to={lp('/quote')} className="btn btn-md btn-inverse">
                {c.requestFreeQuote}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Colunas de páginas */}
          <nav aria-label={c.footerNav} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8">
            {c.columns.map((col) => (
              <div key={col.title}>
                <h2 className="font-display text-base font-semibold text-white">{col.title}</h2>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      {l.external ? (
                        <a href={l.to} target="_blank" rel="noopener" className={`${linkClass} inline-flex items-center gap-1`}>
                          {l.label}
                          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                        </a>
                      ) : (
                        <Link to={lp(l.to)} className={linkClass}>
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Todas as páginas de mudança (cidade e país): malha de links internos */}
        <nav aria-label={c.movesNav} className="mt-12 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 lg:grid-cols-12">
          {[
            { title: c.inSwitzerland, links: swissMoveLinks(lang), span: 'lg:col-span-7' },
            { title: c.abroad, links: abroadMoveLinks(lang), span: 'lg:col-span-5' },
          ].map((group) => (
            <div key={group.title} className={group.span}>
              <h2 className="font-display text-base font-semibold text-white">{group.title}</h2>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link to={lp(l.to)} className={`${linkClass} text-sm`}>
                      {l.full}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Base: dados legais */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {c.legalLine}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <LangSwitch tone="dark" />
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
              {c.siteBy}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
