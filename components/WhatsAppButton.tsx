import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Phone, Clock } from 'lucide-react';
import { LOCALITIES } from '../data/localities';
import { BATIMOVE_WHATSAPP } from '../data/quoteServices';
import { trackContactClick } from '../utils/analytics';
import { alternatePath, defineCopy, langOf, useLang } from '../i18n';

const COPY = defineCopy(
    {
        panelTitle: 'Batimove Sàrl sur WhatsApp',
        open: 'Bureau ouvert : devis sous 30 min',
        closed: 'Bureau fermé : réponse dès 8h00',
        close: 'Fermer',
        ready: 'Votre message, prêt à envoyer :',
        openWhatsApp: 'Ouvrir WhatsApp',
        freeCall: 'appel gratuit',
        hours: 'Lun.–sam. 8h–19h · urgences 24/7 par téléphone',
        closeWhatsApp: 'Fermer WhatsApp',
        writeOnWhatsApp: 'Écrire à Batimove sur WhatsApp',
    },
    {
        panelTitle: 'Batimove Sàrl on WhatsApp',
        open: 'Office open: quote within 30 min',
        closed: 'Office closed: we reply from 8am',
        close: 'Close',
        ready: 'Your message, ready to send:',
        openWhatsApp: 'Open WhatsApp',
        freeCall: 'free call',
        hours: 'Mon–Sat 8am–7pm · emergencies 24/7 by phone',
        closeWhatsApp: 'Close WhatsApp',
        writeOnWhatsApp: 'Message Batimove on WhatsApp',
    }
);

/** Nome e preposição em inglês: campo "en" de data/serviceLocalities.json. */
type LocalityEn = { en?: { name: string; prep: string } };

export const WhatsappIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.031 2c-5.508 0-9.985 4.477-9.985 9.985 0 1.761.459 3.477 1.332 4.992L2 22l5.16-1.354c1.465.799 3.119 1.223 4.871 1.223 5.508 0 9.985-4.477 9.985-9.985S17.539 2 12.031 2zm5.836 14.186c-.244.686-1.423 1.309-1.970 1.393-.524.08-1.207.114-1.956-.124-.48-.152-1.099-.356-1.895-.7-3.332-1.442-5.5-4.819-5.666-5.041-.166-.222-1.353-1.8-1.353-3.433s.853-2.437 1.156-2.769c.303-.332.66-.415.88-.415.22 0 .44.002.633.012.203.01.475-.077.744.569.278.666.948 2.310.948 2.310s.087.178.02.378c-.068.2-.102.324-.204.444-.102.12-.214.268-.306.36-.102.102-.208.213-.09.415.118.202.524.864 1.124 1.398.772.688 1.422.9 1.624.99.202.09.32.078.438-.058.118-.136.507-.589.642-.791.135-.202.27-.168.455-.101.185.067 1.173.553 1.375.654.202.101.337.152.388.236.051.084.051.49-.193 1.176z"/>
    </svg>
);

/**
 * Horário do escritório (seg–sáb, 8h–19h) calculado na hora de Genebra,
 * não na do visitante: quem abre o site de Londres às 7h vê o estado certo.
 */
const isWithinBusinessHours = (now: Date = new Date()): boolean => {
    try {
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Zurich',
            weekday: 'short',
            hour: 'numeric',
            hourCycle: 'h23',
        }).formatToParts(now);
        const weekday = parts.find((p) => p.type === 'weekday')?.value;
        const hour = Number(parts.find((p) => p.type === 'hour')?.value);
        return weekday !== 'Sun' && hour >= 8 && hour < 19;
    } catch {
        const day = now.getDay();
        const hour = now.getHours();
        return day >= 1 && day <= 6 && hour >= 8 && hour < 19;
    }
};

/**
 * Mensagem já escrita conforme a página: o cliente só aperta "enviar".
 * Em /en/… o caminho é convertido para o francês para achar o serviço e a
 * cidade, e a frase sai em inglês.
 */
export const whatsAppMessageFor = (pathname: string, search = ''): string => {
    const en = langOf(pathname) === 'en';
    const path = en ? alternatePath(pathname, 'fr') : pathname;
    const city = (slug: string) => LOCALITIES.find((l) => l.slug === slug);

    if (en) {
        const ask = (what: string) => `Hello Batimove, I'd like a quote for ${what}.`;
        const local = path.match(/^\/(debarras|nettoyage-fin-de-bail)-(.+)$/);
        if (local) {
            const l = city(local[2]);
            const enName = l ? (l as typeof l & LocalityEn).en : undefined;
            const where = l ? ' ' + (enName?.prep ?? 'in ' + l.name) : '';
            return local[1] === 'debarras' ? ask('a house clearance' + where) : ask('end of tenancy cleaning' + where);
        }
        if (path === '/debarras') return ask('a house clearance');
        if (path === '/nettoyage-fin-de-bail') return ask('end of tenancy cleaning');
        if (path === '/garde-meubles') return ask('storage');
        if (path === '/calculator') return "Hello Batimove, I've estimated my volume and I'd like a quote.";
        if (path === '/quote' && /type=entreprise/.test(search)) return ask('a business removal');
        if (path === '/demenagement-international') return ask('an international removal');
        if (path === '/demenagement-londres') return ask('a move between Switzerland and London');
        const move = path.match(/^\/demenagement-(geneve|lausanne|vaud)$/);
        if (move) {
            const where = { geneve: 'in Geneva', lausanne: 'in Lausanne', vaud: 'in the canton of Vaud' }[move[1] as 'geneve' | 'lausanne' | 'vaud'];
            return ask('a removal ' + where);
        }
        return ask('my move');
    }

    const local = path.match(/^\/(debarras|nettoyage-fin-de-bail)-(.+)$/);
    if (local) {
        const l = city(local[2]);
        const where = l ? ` ${l.prep}` : '';
        return local[1] === 'debarras'
            ? `Bonjour Batimove, je souhaite un devis pour un débarras${where}.`
            : `Bonjour Batimove, je souhaite un devis pour un nettoyage de fin de bail${where}.`;
    }
    if (path === '/debarras') return 'Bonjour Batimove, je souhaite un devis pour un débarras.';
    if (path === '/nettoyage-fin-de-bail') return 'Bonjour Batimove, je souhaite un devis pour un nettoyage de fin de bail.';
    if (path === '/garde-meubles') return 'Bonjour Batimove, je souhaite un devis pour un garde-meubles.';
    if (path === '/calculator') return "Bonjour Batimove, j'ai estimé mon volume et je souhaite un devis.";
    if (path === '/quote' && /type=entreprise/.test(search)) {
        return "Bonjour Batimove, je souhaite un devis pour un déménagement d'entreprise.";
    }
    if (path === '/demenagement-international') return 'Bonjour Batimove, je souhaite un devis pour un déménagement international.';
    if (path === '/demenagement-londres') return 'Bonjour Batimove, je souhaite un devis pour un déménagement entre la Suisse et Londres.';
    const move = path.match(/^\/demenagement-(geneve|lausanne|vaud)$/);
    if (move) {
        const where = { geneve: 'à Genève', lausanne: 'à Lausanne', vaud: 'dans le canton de Vaud' }[move[1] as 'geneve' | 'lausanne' | 'vaud'];
        return `Bonjour Batimove, je souhaite un devis pour un déménagement ${where}.`;
    }
    return 'Bonjour Batimove, je souhaite un devis pour mon déménagement.';
};

// Nos funis de orçamento o WhatsApp já é uma etapa do próprio formulário
// (também em /en/quote, /en/quote/* e /en/volume-calculator/checkout).
const HIDDEN_ON = (pathname: string) => {
    const fr = alternatePath(pathname, 'fr');
    return fr === '/quote' || fr.startsWith('/quote/') || fr === '/calculator/checkout';
};

export const WhatsAppButton: React.FC = () => {
    const { pathname, search } = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { lang } = useLang();
    const c = COPY[lang];
    const [isOnline, setIsOnline] = useState(isWithinBusinessHours);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Estado do horário atualizado a cada minuto enquanto a página fica aberta.
    useEffect(() => {
        const id = window.setInterval(() => setIsOnline(isWithinBusinessHours()), 60_000);
        return () => window.clearInterval(id);
    }, []);

    // Fecha ao trocar de página.
    useEffect(() => setIsOpen(false), [pathname]);

    // Esc fecha e devolve o foco ao botão; o foco entra no painel ao abrir.
    useEffect(() => {
        if (!isOpen) return;
        panelRef.current?.querySelector<HTMLElement>('a')?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen]);

    if (HIDDEN_ON(pathname)) return null;

    const message = whatsAppMessageFor(pathname, search);
    const whatsappUrl = `https://wa.me/${BATIMOVE_WHATSAPP}?text=${encodeURIComponent(message)}`;

    return (
        <div className="pointer-events-none fixed bottom-5 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
            {isOpen && (
                <div
                    ref={panelRef}
                    id="whatsapp-panel"
                    role="dialog"
                    aria-labelledby="whatsapp-panel-title"
                    className="nav-panel-in pointer-events-auto mb-3 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-overlay"
                >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                        <div>
                            <p id="whatsapp-panel-title" className="text-base font-semibold text-[#0B1E33]">
                                {c.panelTitle}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                                <span
                                    className={`inline-block h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}
                                    aria-hidden="true"
                                />
                                {isOnline ? c.open : c.closed}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                triggerRef.current?.focus();
                            }}
                            className="-mr-1.5 -mt-1 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600"
                            aria-label={c.close}
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="px-5 py-4">
                        <p className="text-sm text-slate-600">{c.ready}</p>
                        <p className="mt-2 rounded-xl rounded-tl-sm bg-[#E7F8EE] px-3.5 py-2.5 text-base leading-relaxed text-[#0B1E33]">
                            {message}
                        </p>

                        <div className="mt-4 space-y-2">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackContactClick('whatsapp', pathname)}
                                className="btn btn-md w-full bg-[#0E7A6E] text-white hover:bg-[#0B6359] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7A6E]"
                            >
                                <WhatsappIcon className="h-5 w-5" />
                                {c.openWhatsApp}
                            </a>
                            <a
                                href="tel:0800825925"
                                onClick={() => trackContactClick('phone', pathname)}
                                className="btn btn-md btn-outline w-full"
                            >
                                <Phone className="h-4 w-4" aria-hidden="true" />
                                <span className="tabular-nums">0800 825 925</span>
                                <span className="font-normal text-slate-500">{c.freeCall}</span>
                            </a>
                        </div>

                        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-500">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {c.hours}
                        </p>
                    </div>
                </div>
            )}

            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
                aria-controls="whatsapp-panel"
                aria-label={isOpen ? c.closeWhatsApp : c.writeOnWhatsApp}
                className="pointer-events-auto relative grid h-14 w-14 place-items-center rounded-full transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E] motion-reduce:transition-none sm:h-[60px] sm:w-[60px]"
            >
                {isOpen ? (
                    <span className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[#0B1E33] text-white shadow-overlay">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </span>
                ) : (
                    <>
                        <img
                            src="/whatsapp-3d-luxury-168.png"
                            alt=""
                            width={60}
                            height={60}
                            className="pointer-events-none h-full w-full select-none object-contain drop-shadow-[0_10px_20px_rgba(11,30,51,0.18)]"
                        />
                        {/* Ponto verde só com o escritório aberto. */}
                        {isOnline && (
                            <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" aria-hidden="true" />
                        )}
                    </>
                )}
            </button>
        </div>
    );
};
