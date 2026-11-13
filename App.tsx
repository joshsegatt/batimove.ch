import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import './src/performance.css'; // 60fps optimizations
import { Home } from './pages/Home';
import { Quote } from './pages/Quote';
import { CookieConsent } from './components/CookieConsent';
import { LOCALITIES, localPath } from './data/localities';
import { WhatsAppButton } from './components/WhatsAppButton';

// Chargées à la demande. La page d'accueil et le formulaire de devis restent dans
// le bundle initial, car ce sont les deux points d'entrée du trafic publicitaire.
const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })));
const Debarras = lazy(() => import('./pages/ServiceLandings').then((m) => ({ default: m.Debarras })));
const Nettoyage = lazy(() => import('./pages/ServiceLandings').then((m) => ({ default: m.Nettoyage })));
const GardeMeubles = lazy(() => import('./pages/ServiceLandings').then((m) => ({ default: m.GardeMeubles })));
const LocalServiceLanding = lazy(() => import('./pages/ServiceLandings').then((m) => ({ default: m.LocalServiceLanding })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const Legal = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Legal })));
const Calculator = lazy(() => import('./pages/Calculator'));
const CalculatorCheckout = lazy(() => import('./pages/CalculatorCheckout'));
const Geneve = lazy(() => import('./pages/locations/Geneve').then((m) => ({ default: m.Geneve })));
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

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-slate-50 antialiased selection:bg-batimove-blue/20 selection:text-batimove-blue">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/business" element={<Navigate to="/services?type=entreprise" replace />} />
          {/* Página de tarifas retirada: preço só no devis. Links antigos vão ao orçamento. */}
          <Route path="/pricing" element={<Navigate to="/quote" replace />} />
          <Route path="/debarras" element={<Debarras />} />
          <Route path="/nettoyage-fin-de-bail" element={<Nettoyage />} />
          <Route path="/garde-meubles" element={<GardeMeubles />} />
          {/* Páginas locais (SEO): /debarras-<cidade> e /nettoyage-fin-de-bail-<cidade> */}
          {LOCALITIES.flatMap((l) =>
            (['debarras', 'nettoyage'] as const).map((service) => (
              <Route
                key={localPath(service, l.slug)}
                path={localPath(service, l.slug)}
                element={<LocalServiceLanding service={service} slug={l.slug} />}
              />
            ))
          )}
          <Route path="/contact" element={<Contact />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/calculator/checkout" element={<CalculatorCheckout />} />

          {/* Strategic Regional SEO Pages */}
          <Route path="/demenagement-geneve" element={<Geneve />} />
          <Route path="/demenagement-lausanne" element={<Lausanne />} />
          <Route path="/demenagement-vaud" element={<Vaud />} />

          {/* Legal Routes */}
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="/legal" element={<Legal type="impressum" />} />

          {/* General Quote Funnel */}
          <Route path="/quote" element={<Quote />} />
          <Route path="/quote/:serviceId" element={<Quote />} />

          {/* Le portail d'administration était un prototype inachevé, sans backend.
              Ses anciennes adresses renvoient vers l'accueil au lieu de 404, pour
              les liens et favoris qui pourraient encore exister. */}
          <Route path="/portal" element={<Navigate to="/" replace />} />
          <Route path="/portal/*" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />

          {/* Fallback 404 */}
          <Route path="*" element={<div className="h-screen flex items-center justify-center">404 - Page not found</div>} />
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
