import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { SEO } from './components/SEO';
import { Navbar, Footer } from './components/Layout';
import './src/performance.css'; // 60fps optimizations
import { Home } from './pages/Home';
import { Quote } from './pages/Quote';
import { CookieConsent } from './components/CookieConsent';
import { LOCALITIES, LOCAL_SERVICES, isGeneratedLocal, localPath } from './data/localities';
import { COUNTRIES } from './data/countries';
import { localizePath } from './i18n';
import { WhatsAppButton } from './components/WhatsAppButton';

// Chargées à la demande. La page d'accueil et le formulaire de devis restent dans
// le bundle initial, car ce sont les deux points d'entrée du trafic publicitaire.
const Debarras = lazy(() => import('./pages/ServiceLandings').then((m) => ({ default: m.Debarras })));
const Nettoyage = lazy(() => import('./pages/ServiceLandings').then((m) => ({ default: m.Nettoyage })));
const GardeMeubles = lazy(() => import('./pages/ServiceLandings').then((m) => ({ default: m.GardeMeubles })));
const LocalServiceLanding = lazy(() => import('./pages/ServiceLandings').then((m) => ({ default: m.LocalServiceLanding })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const Legal = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Legal })));
const Calculator = lazy(() => import('./pages/Calculator'));
const CalculatorCheckout = lazy(() => import('./pages/CalculatorCheckout'));
const Geneve = lazy(() => import('./pages/locations/Geneve').then((m) => ({ default: m.Geneve })));
const International = lazy(() => import('./pages/International').then((m) => ({ default: m.International })));
const London = lazy(() => import('./pages/International').then((m) => ({ default: m.London })));
const CountryPage = lazy(() => import('./pages/International').then((m) => ({ default: m.CountryPage })));
const Lausanne = lazy(() => import('./pages/locations/Lausanne').then((m) => ({ default: m.Lausanne })));
const Vaud = lazy(() => import('./pages/locations/Vaud').then((m) => ({ default: m.Vaud })));

/** Écran d'attente discret pendant le chargement d'une route. */
const RouteFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
    <span className="sr-only">Chargement de la page…</span>
    <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-[#0284c7] animate-spin" aria-hidden="true" />
  </div>
);

import { trackPageView } from './utils/analytics';

// Seamless backwards compatibility: rewrite any legacy #/ URL into clean canonical paths
if (typeof window !== 'undefined') {
  const h = window.location.hash;
  if (h && h.startsWith('#/')) {
    const cleanPath = h.slice(1);
    window.history.replaceState(null, '', cleanPath);
  }
}

// ScrollToTop, hash anchor support, and Google Tag (gtag.js) SPA Route Tracker helper
const RouteTracker = () => {
  const { pathname, search, hash } = useLocation();
  React.useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        trackPageView(pathname + search + hash);
        return;
      }
    }
    window.scrollTo(0, 0);
    trackPageView(pathname + search);
  }, [pathname, search, hash]);
  return null;
};

/** Páginas públicas pelo caminho francês; a versão /en é registrada junto. */
const PAGES: [string, React.ReactElement][] = [
  ['/', <Home />],
  ['/debarras', <Debarras />],
  ['/nettoyage-fin-de-bail', <Nettoyage />],
  ['/garde-meubles', <GardeMeubles />],
  ['/demenagement-international', <International />],
  ['/demenagement-londres', <London />],
  ...COUNTRIES.map((p): [string, React.ReactElement] => [p.path, <CountryPage slug={p.slug} />]),
  ['/demenagement-geneve', <Geneve />],
  ['/demenagement-lausanne', <Lausanne />],
  ['/demenagement-vaud', <Vaud />],
  ['/contact', <Contact />],
  ['/calculator', <Calculator />],
  ['/calculator/checkout', <CalculatorCheckout />],
  ['/privacy', <Legal type="privacy" />],
  ['/terms', <Legal type="terms" />],
  ['/legal', <Legal type="impressum" />],
  ['/quote', <Quote />],
  ['/quote/:serviceId', <Quote />],
];

/** /services?type=x -> /quote?type=x (no idioma da página). */
const ToQuote: React.FC = () => {
  const { pathname, search } = useLocation();
  return <Navigate to={`${pathname.startsWith('/en') ? '/en' : ''}/quote${search}`} replace />;
};

const NotFound: React.FC = () => {
  const { pathname } = useLocation();
  const en = pathname.startsWith('/en');
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      {/* noindex e sem canonical: um endereço errado não pode virar cópia da home no Google */}
      <SEO
        title={en ? 'Page not found | Batimove Sàrl' : 'Page introuvable | Batimove Sàrl'}
        robots="noindex, follow"
      />
      <h1 className="font-display text-3xl font-medium text-[#0B1E33]">{en ? 'Page not found' : 'Page introuvable'}</h1>
      <Link to={en ? '/en' : '/'} className="btn btn-md btn-primary">{en ? 'Back to home' : "Retour à l'accueil"}</Link>
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-slate-50 antialiased selection:bg-batimove-blue/20 selection:text-batimove-blue">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Cada página existe em francês (raiz) e em inglês (/en/...), com o
              mesmo componente: o idioma vem do endereço. Pares em data/i18nRoutes.json. */}
          {PAGES.flatMap(([path, element]) => {
            const en = localizePath(path, 'en');
            return [
              <Route key={path} path={path} element={element} />,
              <Route key={en} path={en} element={element} />,
            ];
          })}
          {/* Páginas locais (SEO): /demenagement-<cidade>, /debarras-<cidade> e
              /nettoyage-fin-de-bail-<cidade>. Genève, Lausanne e Vaud têm página de mudança própria. */}
          {LOCALITIES.flatMap((l) =>
            LOCAL_SERVICES.filter((service) => isGeneratedLocal(service, l.slug)).flatMap((service) => {
              const path = localPath(service, l.slug);
              const element = <LocalServiceLanding service={service} slug={l.slug} />;
              return [
                <Route key={path} path={path} element={element} />,
                <Route key={localizePath(path, 'en')} path={localizePath(path, 'en')} element={element} />,
              ];
            })
          )}

          {/* Antiga página de serviços (formulário de leads aposentado): vai ao orçamento. */}
          <Route path="/services" element={<ToQuote />} />
          <Route path="/en/services" element={<ToQuote />} />
          <Route path="/business" element={<Navigate to="/quote?type=entreprise" replace />} />
          {/* Página de tarifas retirada: preço só no devis. Links antigos vão ao orçamento. */}
          <Route path="/pricing" element={<Navigate to="/quote" replace />} />

          {/* Le portail d'administration était un prototype inachevé, sans backend.
              Ses anciennes adresses renvoient vers l'accueil au lieu de 404, pour
              les liens et favoris qui pourraient encore exister. */}
          <Route path="/portal" element={<Navigate to="/" replace />} />
          <Route path="/portal/*" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />

          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
      <CookieConsent />
      <WhatsAppButton />
    </div>
  );
};

interface RootErrorBoundaryProps {
  children: React.ReactNode;
}

interface RootErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends React.Component<RootErrorBoundaryProps, RootErrorBoundaryState> {
  override state: RootErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Batimove] Root application error caught:', error, errorInfo);
  }

  handleHardReset = () => {
    try {
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((k) => caches.delete(k));
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => r.unregister());
        });
      }
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1E33] text-white flex flex-col items-center justify-center p-6 text-center font-sans select-none">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center mb-5 text-2xl font-semibold">
            !
          </div>
          <h1 className="text-2xl font-medium mb-2 font-display">Batimove Déménagement Sàrl</h1>
          <p className="text-slate-300 text-sm max-w-md mb-6 leading-relaxed">
            Une mise à jour ou un incident temporaire d'affichage s'est produit. Cliquez sur le bouton ci-dessous pour actualiser les données.
          </p>
          {this.state.error && (
            <p className="text-slate-400 text-xs max-w-lg mb-6 font-mono bg-black/40 p-3 rounded-xl border border-white/10 overflow-auto">
              {this.state.error.message}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleHardReset}
              className="px-6 py-3 rounded-xl bg-[#0052A3] hover:bg-sky-600 text-white font-semibold text-sm shadow-lg transition-all cursor-pointer"
            >
              Vider le cache & Actualiser
            </button>
            <a
              href="tel:0800825925"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
            >
              Appel gratuit : 0800 825 925
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <RootErrorBoundary>
        <RouteTracker />
        <AppContent />
      </RootErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
