import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
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
          <div className="bg-[#0B1E33]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-2xl shadow-black/40 text-white flex items-center gap-3">
            {/* Elegant Compact Cookie Icon */}
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <Cookie className="w-4 h-4" />
            </div>

            {/* Compact Informative Text */}
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs text-slate-200 leading-snug">
                <span className="font-semibold text-white">Confidentialité</span> : stockage local utilisé pour sauvegarder votre devis en temps réel.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleAccept}
                className="bg-batimove-red hover:bg-[#c00500] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Accepter
              </button>
              <button
                onClick={handleDecline}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};