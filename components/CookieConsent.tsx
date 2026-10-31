import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';
import { updateGoogleConsent } from '../utils/analytics';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('batimove_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth entrance after page loads
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('batimove_cookie_consent', 'true');
    updateGoogleConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('batimove_cookie_consent', 'declined');
    updateGoogleConsent(false);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[60] pointer-events-auto"
        >
          <div
            role="dialog"
            aria-labelledby="cookie-consent-title"
            className="bg-[#0B1E33]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/40 text-white"
          >
            <div className="flex items-start gap-3">
              {/* Elegant Compact Cookie Icon */}
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                <Cookie className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p id="cookie-consent-title" className="text-xs text-slate-200 leading-relaxed">
                  <span className="font-semibold text-white">Cookies</span> : nous utilisons des cookies
                  de mesure d'audience et de publicité (Google Ads) pour comprendre l'origine de nos
                  demandes de devis. Refuser n'a aucune conséquence sur votre navigation.{' '}
                  <Link to="/privacy" className="underline underline-offset-2 hover:text-white">
                    Protection des données
                  </Link>
                </p>
              </div>
            </div>

            {/* Deux choix de poids visuel équivalent (RGPD : refuser aussi simple qu'accepter) */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-[#0284c7] hover:bg-sky-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-md shadow-sky-600/25 active:scale-95 cursor-pointer"
              >
                Accepter
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors active:scale-95 cursor-pointer"
              >
                Refuser
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};