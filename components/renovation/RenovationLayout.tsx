import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { BrandLogo } from '../BrandMark';
import { LangSwitch } from '../LangSwitch';
import { DivisionSwitch } from '../Layout';
import { WhatsappIcon } from '../WhatsAppButton';
import { RENOVATION_COMMON, RENOVATION_SERVICES, type RenovationGroup } from '../../data/renovation';
import { alternatePath, defineCopy, useLang } from '../../i18n';

// Menu e rodapé da área Batimove Rénovation (/renovation). Quem chega por uma
// busca de rénovation navega só entre páginas de rénovation; a mudança fica a
// um clique, no seletor da faixa de cima e no rodapé.

const COPY = defineCopy(
  {
    divisions: 'Activités Batimove',
    moving: 'Déménagement',
    reno: 'Rénovation & étanchéité',
    address: 'Rue de Monthoux 64, 1201 Genève',
    zone: 'Genève · Vaud selon la prestation',
    homeLabel: 'Batimove Rénovation, accueil',
    tag: 'Rénovation',
    mainNav: 'Navigation Rénovation',
    services: 'Prestations',
    buildings: 'Régies & PPE',
    contact: 'Contact',
    quote: 'Devis rénovation',
    callFree: 'Appeler le 0800 825 925 (gratuit)',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    menu: 'Menu',
    panelTitle: 'Un projet ? Décrivez-le en 2 minutes.',
    panelText: 'Nous vous rappelons pour fixer la visite sur place.',
    alsoMoving: 'Déménagement, débarras et garde-meubles',
    freeCall: 'appel gratuit',
    tagline:
      'Rénovation intérieure et étanchéité pour appartements, maisons et immeubles, à Genève et selon la prestation dans le canton de Vaud.',
    footerNav: 'Pied de page Rénovation',
    company: 'Batimove',
    movingSite: 'Déménagement',
    legal: 'Mentions légales',
    privacy: 'Protection des données',
    legalLine: 'Batimove Sàrl · IDE CHE-143.091.230 · Genève',
  },
  {
    divisions: 'Batimove divisions',
    moving: 'Removals',
    reno: 'Renovation & waterproofing',
    address: 'Rue de Monthoux 64, 1201 Geneva',
    zone: 'Geneva · Vaud depending on the service',
    homeLabel: 'Batimove Renovation, home',
    tag: 'Renovation',
    mainNav: 'Renovation navigation',
    services: 'Services',
    buildings: 'Letting agencies',
    contact: 'Contact',
    quote: 'Renovation quote',
    callFree: 'Call 0800 825 925 (free)',
    openMenu: 'Open the menu',
    closeMenu: 'Close the menu',
    menu: 'Menu',
    panelTitle: 'A project? Describe it in 2 minutes.',
    panelText: 'We call you back to arrange the site visit.',
    alsoMoving: 'Removals, house clearance and storage',
    freeCall: 'free call',
    tagline:
      'Interior renovation and waterproofing for flats, houses and apartment buildings, in Geneva and, depending on the service, the canton of Vaud.',
    footerNav: 'Renovation footer',
    company: 'Batimove',
    movingSite: 'Removals',
    legal: 'Legal notice',
    privacy: 'Privacy policy',
    legalLine: 'Batimove Sàrl · UID CHE-143.091.230 · Geneva',
  }
);

const GROUPS: RenovationGroup[] = ['interieur', 'batiment'];

/** Lista de serviços de um grupo (painel do menu, menu mobile e rodapé). */
const useGroups = () => {
  const { lang } = useLang();
  const common = RENOVATION_COMMON[lang];
  return GROUPS.map((g) => ({
    id: g,
    title: common.groups[g],
    items: RENOVATION_SERVICES.filter((s) => s.group === g).map((s) => ({ ...s, c: s[lang] })),
  }));
};

export const RenovationNavbar: React.FC = () => {
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const groups = useGroups();
  const location = useLocation();
  const frPath = alternatePath(location.pathname, 'fr');
  const [panel, setPanel] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setPanel(false);
    setDrawer(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : 'unset';
    if (drawer) closeRef.current?.focus();
  }, [drawer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (panel) {
        setPanel(false);
        triggerRef.current?.focus();
      }
      if (drawer) {
        setDrawer(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (panel && wrapRef.current && !wrapRef.current.contains(e.target as Node)) setPanel(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [panel, drawer]);

  const servicesActive = frPath.startsWith('/renovation/') && !['/renovation/devis', '/renovation/immeubles'].includes(frPath);
  const navClass = (active: boolean) =>
    `group relative inline-flex h-[68px] items-center gap-1.5 whitespace-nowrap text-base font-semibold xl:text-lg transition-colors duration-150 focus-visible:outline-none ${
      active ? 'text-reno-ink' : 'text-slate-600 hover:text-reno-ink'
    }`;
  const bar = <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-reno-clay" />;
  const focusRing =
    'rounded-md group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-reno-clay';

  return (
    <header className="sticky top-0 z-[70] w-full border-b border-reno-line bg-white/95 font-sans backdrop-blur-md">
      {/* Faixa de cima: troca de atividade e contato */}
      <div className="hidden bg-reno-ink py-2 text-xs text-stone-300 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <DivisionSwitch current="reno" labels={{ group: c.divisions, moving: c.moving, reno: c.reno }} />
          <div className="flex items-center gap-6">
            <span className="hidden items-center gap-2 lg:flex">
              <MapPin className="h-3.5 w-3.5 text-[#E4A58C]" aria-hidden="true" />
              {c.zone}
            </span>
            <a href="tel:0800825925" className="flex items-center gap-2 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5 text-[#E4A58C]" aria-hidden="true" />
              <span className="font-semibold text-white tabular-nums">0800 825 925</span>
            </a>
            <a href="mailto:info@batimove.ch" className="flex items-center gap-2 transition-colors hover:text-white">
              <Mail className="h-3.5 w-3.5 text-[#E4A58C]" aria-hidden="true" />
              info@batimove.ch
            </a>
          </div>
        </div>
      </div>

      <div ref={wrapRef} className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] items-center justify-between gap-3 sm:gap-6">
            <Link
              to={lp('/renovation')}
              aria-label={c.homeLabel}
              className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reno-clay"
            >
              <BrandLogo markClassName="h-8 w-auto sm:h-9" textClassName="text-lg text-reno-ink sm:text-xl" />
              <span className="hidden rounded-md bg-reno-clay-soft px-2 py-0.5 text-sm font-semibold text-reno-clay min-[420px]:inline">{c.tag}</span>
            </Link>

            <nav aria-label={c.mainNav} className="hidden lg:block">
              <ul className="flex items-center gap-6 xl:gap-8">
                <li>
                  <button
                    ref={triggerRef}
                    type="button"
                    aria-expanded={panel}
                    aria-controls="reno-panel"
                    onClick={() => setPanel((o) => !o)}
                    className={navClass(servicesActive || panel)}
                  >
                    <span className={focusRing}>{c.services}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${panel ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                    {servicesActive && bar}
                  </button>
                </li>
                {[
                  { to: '/renovation/immeubles', label: c.buildings },
                  { to: '/contact', label: c.contact },
                ].map((l) => {
                  const active = frPath === l.to;
                  return (
                    <li key={l.to}>
                      <Link to={lp(l.to)} aria-current={active ? 'page' : undefined} className={navClass(active)}>
                        <span className={focusRing}>{l.label}</span>
                        {active && bar}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-3 lg:ml-0">
              <LangSwitch compactOnMobile />
              <Link to={lp('/renovation/devis')} className={`${RENO_BTN} hidden h-10 px-4 text-base sm:inline-flex`}>
                {c.quote}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex items-center gap-1 lg:hidden">
              <a
                href="tel:0800825925"
                aria-label={c.callFree}
                className="grid h-11 w-11 place-items-center rounded-xl text-reno-ink transition-colors hover:bg-reno-stone md:hidden"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
              </a>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setDrawer(true)}
                aria-label={c.openMenu}
                aria-expanded={drawer}
                aria-controls="reno-menu-mobile"
                className="grid h-11 w-11 place-items-center rounded-xl text-reno-ink transition-colors hover:bg-reno-stone focus-visible:outline focus-visible:outline-2 focus-visible:outline-reno-clay"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Painel "Prestations" (desktop) */}
        {panel && (
          <div id="reno-panel" className="nav-panel-in absolute inset-x-0 top-full hidden border-t border-reno-line bg-white shadow-overlay lg:block">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-8 pb-6 pt-8">
              {groups.map((g) => (
                <div key={g.id}>
                  <p className="text-sm font-semibold text-slate-500">{g.title}</p>
                  <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-0.5">
                    {g.items.map(({ id, icon: Icon, path, c: sc }) => (
                      <li key={id}>
                        <Link
                          to={lp(path)}
                          className="group -mx-3 flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-reno-stone focus-visible:outline focus-visible:outline-2 focus-visible:outline-reno-clay"
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-reno-stone text-reno-ink transition-colors duration-150 group-hover:bg-reno-ink group-hover:text-white">
                            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-display text-base font-semibold leading-snug text-reno-ink xl:text-lg">{sc.name}</span>
                            <span className="block text-sm text-slate-500">{sc.hint}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-reno-line bg-reno-stone">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-8 py-4">
                <p className="text-base text-slate-600">
                  <span className="font-display text-lg font-medium tracking-tight text-reno-ink">{c.panelTitle}</span>
                  <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                  {c.panelText}
                </p>
                <Link to={lp('/renovation/devis')} className={`${RENO_BTN} h-10 px-4 text-base`}>
                  {c.quote}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu mobile */}
      {drawer && (
        <>
          <div onClick={() => setDrawer(false)} className="fixed inset-0 z-[70] bg-reno-ink/50" aria-hidden="true" />
          <div
            id="reno-menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label={c.menu}
            className="nav-drawer-in fixed right-0 top-0 z-[80] flex h-[100dvh] w-[min(400px,88vw)] flex-col bg-white shadow-modal"
          >
            <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-reno-line px-5">
              <BrandLogo markClassName="h-8 w-auto" textClassName="text-lg text-reno-ink" />
              <div className="flex items-center gap-2">
                <LangSwitch tone="light" />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => {
                    setDrawer(false);
                    toggleRef.current?.focus();
                  }}
                  aria-label={c.closeMenu}
                  className="grid h-11 w-11 place-items-center rounded-xl text-reno-ink transition-colors hover:bg-reno-stone"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
            <nav aria-label={c.mainNav} className="flex-1 overflow-y-auto px-5 py-6">
              {groups.map((g, gi) => (
                <div key={g.id} className={gi > 0 ? 'mt-7' : ''}>
                  <p className="text-sm font-semibold text-slate-500">{g.title}</p>
                  <ul className="mt-2 overflow-hidden rounded-xl border border-reno-line">
                    {g.items.map(({ id, icon: Icon, path, c: sc }, i) => (
                      <li key={id} className="relative">
                        {i > 0 && <span aria-hidden="true" className="absolute left-[68px] right-0 top-0 h-px bg-reno-line" />}
                        <Link to={lp(path)} className="flex min-h-[60px] items-center gap-3.5 px-4 py-2.5 active:bg-reno-stone">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-reno-stone text-reno-ink">
                            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-lg font-semibold leading-snug text-reno-ink">{sc.name}</span>
                            <span className="block text-sm text-slate-500">{sc.hint}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link to={lp('/contact')} className="-mx-2 mt-6 flex min-h-[48px] items-center rounded-lg px-2 text-lg font-semibold text-reno-ink active:bg-reno-stone">
                {c.contact}
              </Link>
              <Link
                to={lp('/')}
                className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-4 active:bg-slate-100"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-500">{c.divisions}</span>
                  <span className="mt-0.5 block text-lg font-semibold leading-snug text-[#0B1E33]">{c.moving}</span>
                  <span className="block text-sm text-slate-500">{c.alsoMoving}</span>
                </span>
                <ChevronRight className="h-[18px] w-[18px] shrink-0 text-slate-300" aria-hidden="true" />
              </Link>
            </nav>
            <div className="shrink-0 space-y-3 border-t border-reno-line p-5">
              <Link to={lp('/renovation/devis')} className={`${RENO_BTN} h-12 w-full text-lg`}>
                {c.quote}
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <a
                href="tel:0800825925"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-reno-line text-lg font-semibold text-reno-ink active:bg-reno-stone"
              >
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

/** Botão principal da área Rénovation (terracota). */
export const RENO_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-reno-clay font-semibold text-white transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-reno-clay-hover active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reno-clay';

export const RenovationFooter: React.FC = () => {
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const groups = useGroups();
  const frPath = alternatePath(useLocation().pathname, 'fr');
  if (frPath === '/renovation/devis') return null;
  const link =
    'rounded text-base text-stone-300 transition-colors duration-150 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4A58C]';

  return (
    <footer className="bg-reno-ink font-sans text-stone-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to={lp('/renovation')} aria-label={c.homeLabel} className="inline-flex items-center gap-2.5 rounded-lg">
              <BrandLogo markClassName="h-8 w-auto" textClassName="text-xl text-white" />
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-sm font-semibold text-[#E4A58C]">{c.tag}</span>
            </Link>
            <p className="mt-4 max-w-sm text-base leading-relaxed">{c.tagline}</p>
            <ul className="mt-6 space-y-3 text-base">
              <li>
                <a href="tel:0800825925" className={`${link} inline-flex items-center gap-2.5 font-semibold text-white`}>
                  <Phone className="h-4 w-4 text-[#E4A58C]" aria-hidden="true" />
                  <span className="tabular-nums">0800 825 925</span>
                  <span className="font-normal text-stone-400">{c.freeCall}</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/41798896406" target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-2.5`}>
                  <WhatsappIcon className="h-4 w-4 text-[#E4A58C]" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:info@batimove.ch" className={`${link} inline-flex items-center gap-2.5`}>
                  <Mail className="h-4 w-4 text-[#E4A58C]" aria-hidden="true" />
                  info@batimove.ch
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E4A58C]" aria-hidden="true" />
                {c.address}
              </li>
            </ul>
          </div>

          <nav aria-label={c.footerNav} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-8">
            {groups.map((g) => (
              <div key={g.id}>
                <h2 className="font-display text-base font-semibold text-white">{g.title}</h2>
                <ul className="mt-4 space-y-3">
                  {g.items.map((s) => (
                    <li key={s.id}>
                      <Link to={lp(s.path)} className={link}>
                        {s.c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="font-display text-base font-semibold text-white">{c.company}</h2>
              <ul className="mt-4 space-y-3">
                {[
                  { to: '/renovation/devis', label: c.quote },
                  { to: '/', label: c.movingSite },
                  { to: '/contact', label: c.contact },
                  { to: '/legal', label: c.legal },
                  { to: '/privacy', label: c.privacy },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={lp(l.to)} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {c.legalLine}
          </p>
          <LangSwitch tone="dark" />
        </div>
      </div>
    </footer>
  );
};
