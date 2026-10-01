import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ChevronRight,
  MessageSquare,
  Lock,
  Phone,
  Home,
  Building2,
  Trash2,
  Sparkles,
  Loader2,
  ShieldCheck,
  Clock,
  Star,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/UIComponents';
import { submitServiceQuote } from '../services/api';
import { trackGoogleAdsLeadConversion } from '../utils/analytics';
import { SEO } from '../components/SEO';

const WhatsappIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 2c-5.508 0-9.985 4.477-9.985 9.985 0 1.761.459 3.477 1.332 4.992L2 22l5.16-1.354c1.465.799 3.119 1.223 4.871 1.223 5.508 0 9.985-4.477 9.985-9.985S17.539 2 12.031 2zm5.836 14.186c-.244.686-1.423 1.309-1.97 1.393-.524.08-1.207.114-1.956-.124-.48-.152-1.099-.356-1.895-.7-3.332-1.442-5.5-4.819-5.666-5.041-.166-.222-1.353-1.8-1.353-3.433s.853-2.437 1.156-2.769c.303-.332.66-.415.88-.415.22 0 .44.002.633.012.203.01.475-.077.744.569.278.666.948 2.31.948 2.31s.087.178.02.378c-.068.2-.102.324-.204.444-.102.12-.214.268-.306.36-.102.102-.208.213-.09.415.118.202.524.864 1.124 1.398.772.688 1.422.9 1.624.99.202.09.32.078.438-.058.118-.136.507-.589.642-.791.135-.202.27-.168.455-.101.185.067 1.173.553 1.375.654.202.101.337.152.388.236.051.084.051.49-.193 1.176z"/>
  </svg>
);

interface ServiceItem {
  id: string;
  number: number;
  name: string;
  shortName: string;
  subtitle: string;
  tags: string[];
  icon: React.FC<{ className?: string }>;
  image: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'prive',
    number: 1,
    name: "Déménagement Résidentiel",
    shortName: "Résidentiel",
    subtitle: "Prestation complète pour votre déménagement à domicile.",
    tags: ["Emballage sur-mesure", "Démontage", "Garantie RC 5M"],
    icon: Home,
    image: "/service-residential-3d.png"
  },
  {
    id: 'entreprise',
    number: 2,
    name: "Transfert d'Entreprise & Bureaux",
    shortName: "Entreprise",
    subtitle: "Déménagement professionnel clé en main.",
    tags: ["Planification", "Zéro interruption"],
    icon: Building2,
    image: "/service-b2b-3d.png"
  },
  {
    id: 'debarras',
    number: 3,
    name: "Débarras Professionnel & Écologique",
    shortName: "Débarras",
    subtitle: "Valorisation et tri sélectif des biens.",
    tags: ["Écoresponsable", "Certifié"],
    icon: Trash2,
    image: "/service-debarras-3d.png"
  },
  {
    id: 'nettoyage',
    number: 4,
    name: "Nettoyage État des Lieux",
    shortName: "Nettoyage",
    subtitle: "Nettoyage professionnel conforme régies.",
    tags: ["État des lieux", "Clés en main"],
    icon: Sparkles,
    image: "/service-cleaning-3d.png"
  }
];

export const Quote: React.FC = () => {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();

  // Determine initial service based on URL params
  const getInitialService = () => {
    const rawId = serviceId || searchParams.get('type') || '';
    if (rawId === 'pro' || rawId === 'entreprise' || rawId === 'business') return 'entreprise';
    if (rawId === 'clean' || rawId === 'nettoyage') return 'nettoyage';
    if (rawId === 'debarras') return 'debarras';
    return 'prive';
  };

  const [selectedServiceId, setSelectedServiceId] = useState<string>(getInitialService);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    fromCity: searchParams.get('from') || '',
    toCity: searchParams.get('to') || '',
    details: ''
  });

  const [sendWhatsAppCopy, setSendWhatsAppCopy] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmittedWhatsAppUrl, setLastSubmittedWhatsAppUrl] = useState('');

  const currentService = SERVICES_DATA.find(s => s.id === selectedServiceId) || SERVICES_DATA[0];
  const CurrentIcon = currentService.icon;

  useEffect(() => {
    const matched = getInitialService();
    if (matched) setSelectedServiceId(matched);
  }, [serviceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const buildWhatsAppUrl = (data: typeof formData, serviceName: string) => {
    const text = [
      `Bonjour Batimove Sàrl, je souhaite recevoir un devis rapide :`,
      `• Prestation : ${serviceName}`,
      `• Nom : ${data.name}`,
      `• Téléphone : ${data.phone}`,
      data.email ? `• Email : ${data.email}` : '',
      data.date ? `• Date souhaitée : ${data.date}` : '',
      (data.fromCity || data.toCity) ? `• Trajet : ${data.fromCity || 'Genève'} ➔ ${data.toCity || 'Genève'}` : '',
      data.details ? `• Précisions : ${data.details}` : ''
    ].filter(Boolean).join('\n');

    return `https://wa.me/41798896406?text=${encodeURIComponent(text)}`;
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMessage('Veuillez renseigner au moins votre nom et votre numéro de téléphone.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const waUrl = buildWhatsAppUrl(formData, currentService.name);
    setLastSubmittedWhatsAppUrl(waUrl);

    try {
      // 1. Send via EmailJS to info@batimove.ch
      await submitServiceQuote({
        serviceName: currentService.name,
        clientName: formData.name,
        clientEmail: formData.email || 'Non renseigné',
        clientPhone: formData.phone,
        date: formData.date,
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        details: formData.details
      });

      // Track conversion
      trackGoogleAdsLeadConversion();

      // 2. If WhatsApp copy requested, open in new tab
      if (sendWhatsAppCopy) {
        window.open(waUrl, '_blank');
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        fromCity: '',
        toCity: '',
        details: ''
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou contacter notre hotline au 0800 825 925.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100dvh-98px)] lg:h-[calc(100dvh-98px)] lg:max-h-[calc(100dvh-98px)] bg-[#FAFBFD] text-slate-900 flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden font-sans">
      <SEO
        title="Devis Déménagement Gratuit & Sans Engagement | Batimove Suisse"
        description="Demandez votre devis de déménagement en ligne gratuit sous 24h. Remplissez le formulaire en 2 minutes ou contactez-nous au 0800 825 925."
        canonical="https://www.batimove.ch/quote"
      />
      
      {/* Subtle Ambient Studio Lights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-sky-100/35 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-slate-100/60 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Centered Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col justify-center relative z-10 my-auto">

        {/* 2-COLUMN LUXURY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full flex-1 min-h-0">

          {/* LEFT COLUMN: EDITORIAL HEADER + SERVICE CARDS (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Header */}
            <div className="mb-5 flex-shrink-0">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0B1E33] tracking-tight leading-[1.15]">
                Demandez votre devis gratuit <br className="hidden sm:inline" />
                <span className="text-[#0284c7]">sans engagement</span>
                <span className="sr-only"> : Devis de déménagement à Genève, Vaud et en Suisse Romande</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 font-normal leading-relaxed max-w-lg">
                Complétez votre demande en moins de 2 minutes. Notre équipe analyse votre projet et vous transmet une estimation ferme sous 2 heures ouvrées.
              </p>
            </div>

            {/* 4 Clean Service Cards */}
            <div className="space-y-2.5">
              {SERVICES_DATA.map((service) => {
                const isSelected = selectedServiceId === service.id;
                const ServiceIcon = service.icon;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setIsSuccess(false);
                    }}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-2 border-[#0284c7] shadow-sm ring-4 ring-sky-500/10'
                        : 'bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Icon + Content */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-sky-50 text-[#0284c7]' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <ServiceIcon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-[15px] font-bold text-[#0B1E33] truncate">
                            {service.name}
                          </h3>
                          {isSelected && (
                            <span className="text-[10px] font-semibold bg-sky-50 text-[#0284c7] border border-sky-200/60 px-2 py-0.5 rounded-md">
                              Actif
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Radio Indicator */}
                    <div className="shrink-0 flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#0284c7] bg-[#0284c7]' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Swiss Trust Pillars */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Assurance RC Pro 5M CHF</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-[#0284c7]" />
                <span>Devis fixe sans frais cachés</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5 font-medium">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>4.9 / 5 satisfaction clients</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: ENTERPRISE QUOTE CARD (5 COLS) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_12px_32px_-8px_rgba(11,30,51,0.06),0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between text-slate-900 relative">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                <div>
                  <h2 className="font-display font-bold text-[#0B1E33] text-base leading-tight">
                    Votre Devis Express
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Prestation : <span className="font-semibold text-slate-800">{currentService.shortName}</span>
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Réponse sous 2h
                </span>
              </div>

              {/* Form or Success State */}
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center space-y-3"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0B1E33] text-base">
                        Devis transmis avec succès !
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                        Votre dossier concernant la prestation <strong>{currentService.name}</strong> a été envoyé directement à <strong>info@batimove.ch</strong>.
                      </p>
                    </div>

                    {/* Dual Action on Success: Direct WhatsApp Button */}
                    <div className="pt-2 space-y-2 max-w-xs mx-auto">
                      <a
                        href={lastSubmittedWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#128C7E] hover:bg-[#0e7467] text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-[0_4px_14px_rgba(18,140,126,0.25)] flex items-center justify-center gap-2"
                      >
                        <img src="/whatsapp-3d-luxury.png" alt="" className="w-4 h-4 object-contain" />
                        <span>Ouvrir sur WhatsApp (Réponse &lt; 5 min)</span>
                      </a>
                      
                      <Button
                        onClick={() => setIsSuccess(false)}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-[#0B1E33] text-xs py-2.5 rounded-xl border border-slate-300 cursor-pointer font-semibold transition-all"
                      >
                        Nouvelle demande
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmitQuote}
                    className="space-y-3"
                  >
                    {/* Error Message */}
                    {errorMessage && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
                        {errorMessage}
                      </div>
                    )}

                    {/* Row 1: Nom & Téléphone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Nom & Prénom <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Ex. Marc Dupont"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-3 focus:ring-[#0284c7]/10 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Téléphone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+41 79 123 45 67"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-3 focus:ring-[#0284c7]/10 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Date souhaitée */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="votre@email.ch"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-3 focus:ring-[#0284c7]/10 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Date souhaitée
                        </label>
                        <input
                          type="text"
                          name="date"
                          placeholder="Ex. 15 novembre"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-3 focus:ring-[#0284c7]/10 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>
                    </div>

                    {/* Row 3: Ville départ & Ville arrivée */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Ville de départ
                        </label>
                        <input
                          type="text"
                          name="fromCity"
                          placeholder="Ex. Genève"
                          value={formData.fromCity}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-3 focus:ring-[#0284c7]/10 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Ville d'arrivée
                        </label>
                        <input
                          type="text"
                          name="toCity"
                          placeholder="Ex. Lausanne"
                          value={formData.toCity}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-3 focus:ring-[#0284c7]/10 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>
                    </div>

                    {/* Row 4: Précisions */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Précisions complémentaires <span className="text-slate-400 font-normal">(optionnel)</span>
                      </label>
                      <input
                        type="text"
                        name="details"
                        placeholder="Volume estimé, étages, ascenseur, objets fragiles..."
                        value={formData.details}
                        onChange={handleInputChange}
                        className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-3 focus:ring-[#0284c7]/10 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                      />
                    </div>

                    {/* WhatsApp Sync Option */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 hover:text-slate-900 transition-colors">
                        <input
                          type="checkbox"
                          checked={sendWhatsAppCopy}
                          onChange={(e) => setSendWhatsAppCopy(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="flex items-center gap-1.5">
                          <WhatsappIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Recevoir également une copie sur WhatsApp (réponse &lt; 5 min)</span>
                        </span>
                      </label>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-batimove-red hover:bg-[#c00500] active:scale-[0.99] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md shadow-red-600/20 hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Transmission à Batimove...</span>
                          </>
                        ) : (
                          <>
                            <span>Demander mon devis gratuit</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <div className="text-center text-xs text-slate-400 mt-2.5 flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Données confidentielles • Devis 100% gratuit et sans engagement</span>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>

      {/* Pristine Light Bottom Bar */}
      <div className="w-full border-t border-slate-200/80 bg-white/95 backdrop-blur-md py-2.5 px-4 flex-shrink-0 text-[11px] text-slate-500 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>🇨🇭 Batimove Sàrl • Entreprise agréée RC Pro 5M CHF • Genève, Vaud, Fribourg, Valais</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <a href="tel:0800825925" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-sky-600" />
              Hotline: 0800 825 925
            </a>
            <span className="text-slate-300">•</span>
            <Link to="/calculator" className="hover:text-slate-900 text-sky-700 transition-colors">Calculateur de volume</Link>
          </div>
        </div>
      </div>

    </div>
  );
};