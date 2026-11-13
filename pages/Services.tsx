import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
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
  Archive,
  Truck,
  Loader2,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Button } from '../components/UIComponents';
import { submitServiceQuote } from '../services/api';
import { SEO } from '../components/SEO';
import { defineCopy, useLang, type Lang } from '../i18n';

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

const SERVICES_DATA: Record<Lang, ServiceItem[]> = {
  fr: [
    {
      id: 'prive',
      number: 1,
      name: "Déménagement résidentiel",
      shortName: "Résidentiel",
      subtitle: "Prestation complète pour votre déménagement à domicile.",
      tags: ["Emballage sur-mesure", "Démontage", "Garantie RC 5M"],
      icon: Home,
      image: "/service-residential-3d.png"
    },
    {
      id: 'entreprise',
      number: 2,
      name: "Transfert d'entreprise et de bureaux",
      shortName: "Entreprise",
      subtitle: "Déménagement professionnel clé en main.",
      tags: ["Planification", "Zéro interruption"],
      icon: Building2,
      image: "/service-b2b-3d.png"
    },
    {
      id: 'debarras',
      number: 3,
      name: "Débarras professionnel et écologique",
      shortName: "Débarras",
      subtitle: "Valorisation et tri sélectif des biens.",
      tags: ["Écoresponsable", "Certifié"],
      icon: Trash2,
      image: "/service-debarras-3d.png"
    },
    {
      id: 'nettoyage',
      number: 4,
      name: "Nettoyage d'état des lieux",
      shortName: "Nettoyage",
      subtitle: "Nettoyage professionnel conforme régies.",
      tags: ["État des lieux", "Clés en main"],
      icon: Sparkles,
      image: "/service-cleaning-3d.png"
    }
  ],
  en: [
    {
      id: 'prive',
      number: 1,
      name: "Home removals",
      shortName: "Residential",
      subtitle: "A complete service for your home move.",
      tags: ["Made-to-measure packing", "Dismantling", "CHF 5M liability cover"],
      icon: Home,
      image: "/service-residential-3d.png"
    },
    {
      id: 'entreprise',
      number: 2,
      name: "Office and business relocation",
      shortName: "Business",
      subtitle: "Turnkey professional relocation.",
      tags: ["Planning", "Zero downtime"],
      icon: Building2,
      image: "/service-b2b-3d.png"
    },
    {
      id: 'debarras',
      number: 3,
      name: "Professional, eco-friendly house clearance",
      shortName: "House clearance",
      subtitle: "Your belongings sorted for reuse and recycling.",
      tags: ["Eco-responsible", "Certified"],
      icon: Trash2,
      image: "/service-debarras-3d.png"
    },
    {
      id: 'nettoyage',
      number: 4,
      name: "End of tenancy cleaning",
      shortName: "Cleaning",
      subtitle: "Professional cleaning to letting agency standards.",
      tags: ["Check-out inspection", "Turnkey"],
      icon: Sparkles,
      image: "/service-cleaning-3d.png"
    }
  ]
};

const COPY = defineCopy(
  {
    errorRequired: 'Veuillez renseigner au moins votre nom et votre numéro de téléphone.',
    errorSend: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou contacter le 0800 825 925.',
    titleLine1: 'Services de Déménagement',
    titleLine2: '& Logistique',
    intro: 'Prestations sur-mesure pour particuliers et entreprises. Choisissez un service pour obtenir votre estimation personnalisée sous 30 min (8h-19h).',
    active: 'Actif',
    trustInsurance: 'Assurance RC Pro 5M CHF',
    trustFixed: 'Devis fixe sans frais cachés',
    trustCertified: 'Entreprise certifiée suisse',
    cardTitle: 'Votre estimation express',
    cardService: 'Prestation :',
    cardReply: 'Réponse sous 30 min',
    successTitle: 'Demande transmise avec succès !',
    successBody: (service: string): React.ReactNode => (
      <>
        Votre dossier pour <strong>{service}</strong> a bien été envoyé à <strong>info@batimove.ch</strong>.
      </>
    ),
    successCallback: 'Un conseiller Batimove vous recontacte sous 30 min (8h-19h).',
    newRequest: 'Nouvelle demande',
    labelName: 'Nom & Prénom',
    placeholderName: 'Ex. Marc Dupont',
    labelPhone: 'Téléphone',
    labelEmail: 'Email',
    placeholderEmail: 'votre@email.ch',
    labelDate: 'Date souhaitée',
    placeholderDate: 'Ex. 15 novembre',
    labelFrom: 'Ville de départ',
    placeholderFrom: 'Ex. Genève',
    labelTo: "Ville d'arrivée",
    placeholderTo: 'Ex. Lausanne',
    labelDetails: 'Précisions complémentaires',
    optional: '(optionnel)',
    placeholderDetails: 'Vos besoins spécifiques, objets sensibles, étages, parking...',
    sending: 'Envoi en cours...',
    submit: 'Demander mon devis',
    privacyNote: 'Données confidentielles • Devis 100% gratuit et sans engagement',
    footerTrust: '🇨🇭 Batimove Sàrl • Assurée RC Pro 5M CHF • Genève, Vaud, Fribourg, Valais',
    hotline: 'Hotline: 0800 825 925',
    calculator: 'Calculateur de volume',
  },
  {
    errorRequired: 'Please enter at least your name and phone number.',
    errorSend: 'Something went wrong while sending your request. Please try again or call 0800 825 925.',
    titleLine1: 'Removal services',
    titleLine2: '& logistics',
    intro: 'Tailored services for private clients and businesses. Choose a service to get your personalised estimate within 30 min (8am–7pm).',
    active: 'Selected',
    trustInsurance: 'CHF 5M professional liability insurance',
    trustFixed: 'Fixed quote, no hidden costs',
    trustCertified: 'Certified Swiss company',
    cardTitle: 'Your express estimate',
    cardService: 'Service:',
    cardReply: 'Reply within 30 min',
    successTitle: 'Request sent successfully!',
    successBody: (service: string): React.ReactNode => (
      <>
        Your request for <strong>{service}</strong> has been sent to <strong>info@batimove.ch</strong>.
      </>
    ),
    successCallback: 'A Batimove adviser will get back to you within 30 min (8am–7pm).',
    newRequest: 'New request',
    labelName: 'Full name',
    placeholderName: 'e.g. Marc Dupont',
    labelPhone: 'Phone',
    labelEmail: 'Email',
    placeholderEmail: 'you@email.ch',
    labelDate: 'Preferred date',
    placeholderDate: 'e.g. 15 November',
    labelFrom: 'Moving from',
    placeholderFrom: 'e.g. Geneva',
    labelTo: 'Moving to',
    placeholderTo: 'e.g. Lausanne',
    labelDetails: 'Additional details',
    optional: '(optional)',
    placeholderDetails: 'Specific needs, fragile items, floors, parking...',
    sending: 'Sending...',
    submit: 'Request my quote',
    privacyNote: 'Confidential data • 100% free, no-obligation quote',
    footerTrust: '🇨🇭 Batimove Sàrl • CHF 5M professional liability insurance • Geneva, Vaud, Fribourg, Valais',
    hotline: 'Hotline: 0800 825 925',
    calculator: 'Volume calculator',
  }
);

export const Services: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { lang, lp } = useLang();
  const c = COPY[lang];

  const getInitialService = () => {
    const rawId = searchParams.get('type') || '';
    if (rawId === 'pro' || rawId === 'entreprise' || rawId === 'business') return 'entreprise';
    if (rawId === 'clean' || rawId === 'nettoyage') return 'nettoyage';
    if (rawId === 'debarras') return 'debarras';
    return 'prive';
  };

  const [selectedServiceId, setSelectedServiceId] = useState<string>(getInitialService);

  useEffect(() => {
    const rawId = searchParams.get('type') || '';
    if (rawId === 'pro' || rawId === 'entreprise' || rawId === 'business') setSelectedServiceId('entreprise');
    else if (rawId === 'clean' || rawId === 'nettoyage') setSelectedServiceId('nettoyage');
    else if (rawId === 'debarras') setSelectedServiceId('debarras');
    else if (rawId === 'prive' || rawId === 'residentiel') setSelectedServiceId('prive');
  }, [searchParams]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    fromCity: '',
    toCity: '',
    details: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const services = SERVICES_DATA[lang];
  const currentService = services.find(s => s.id === selectedServiceId) || services[0];
  // O e-mail que chega na Batimove fica sempre em francês
  const currentServiceFr = SERVICES_DATA.fr.find(s => s.id === currentService.id) || SERVICES_DATA.fr[0];
  const CurrentIcon = currentService.icon;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMessage(c.errorRequired);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await submitServiceQuote({
        serviceName: currentServiceFr.name,
        clientName: formData.name,
        clientEmail: formData.email || 'Non renseigné',
        clientPhone: formData.phone,
        date: formData.date,
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        details: formData.details,
        clientLang: lang,
      });

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
      setErrorMessage(c.errorSend);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100dvh-98px)] lg:h-[calc(100dvh-98px)] lg:max-h-[calc(100dvh-98px)] bg-[#FAFBFD] text-slate-900 flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden font-sans">
      <SEO
        title="Services Déménagement, Débarras & Nettoyage - Batimove"
        description="Services de déménagement complets en Suisse Romande : résidentiel, transfert d'entreprise, débarras certifié et nettoyage état des lieux avec garantie régies."
        canonical="https://www.batimove.ch/services"
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
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#0B1E33] tracking-tight leading-[1.15]">
                {c.titleLine1} <br className="hidden sm:inline" />
                <span className="text-[#0284c7]">{c.titleLine2}</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 font-normal leading-relaxed max-w-lg">
                {c.intro}
              </p>
            </div>

            {/* 4 Clean Service Cards */}
            <div className="space-y-2.5">
              {services.map((service) => {
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
                          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B1E33] truncate">
                            {service.name}
                          </h3>
                          {isSelected && (
                            <span className="text-xs font-semibold bg-sky-50 text-[#0284c7] border border-sky-200/60 px-2 py-0.5 rounded-md">
                              {c.active}
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
                <span>{c.trustInsurance}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-[#0284c7]" />
                <span>{c.trustFixed}</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>{c.trustCertified}</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: ENTERPRISE QUOTE CARD (5 COLS) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-raised flex flex-col justify-between text-slate-900 relative">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-100 mb-4">
                <div className="min-w-0">
                  <h2 className="font-display font-semibold text-[#0B1E33] text-base leading-tight">
                    {c.cardTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {c.cardService} <span className="font-semibold text-slate-800">{currentService.shortName}</span>
                  </p>
                </div>
                <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {c.cardReply}
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
                    className="py-10 text-center space-y-3"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0B1E33] text-base">
                        {c.successTitle}
                      </h4>
                      <p className="text-base text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                        {c.successBody(currentService.name)}
                      </p>
                      <p className="text-xs text-sky-700 font-semibold mt-2">
                        {c.successCallback}
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      {c.newRequest}
                    </Button>
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
                          {c.labelName} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder={c.placeholderName}
                          value={formData.name}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-4 focus:ring-[#0284c7]/20 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          {c.labelPhone} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+41 79 123 45 67"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-4 focus:ring-[#0284c7]/20 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Date souhaitée */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          {c.labelEmail}
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder={c.placeholderEmail}
                          value={formData.email}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-4 focus:ring-[#0284c7]/20 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          {c.labelDate}
                        </label>
                        <input
                          type="text"
                          name="date"
                          placeholder={c.placeholderDate}
                          value={formData.date}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-4 focus:ring-[#0284c7]/20 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>
                    </div>

                    {/* Row 3: Ville départ & Ville arrivée */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          {c.labelFrom}
                        </label>
                        <input
                          type="text"
                          name="fromCity"
                          placeholder={c.placeholderFrom}
                          value={formData.fromCity}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-4 focus:ring-[#0284c7]/20 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          {c.labelTo}
                        </label>
                        <input
                          type="text"
                          name="toCity"
                          placeholder={c.placeholderTo}
                          value={formData.toCity}
                          onChange={handleInputChange}
                          className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-4 focus:ring-[#0284c7]/20 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                        />
                      </div>
                    </div>

                    {/* Row 4: Précisions */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        {c.labelDetails} <span className="text-slate-400 font-normal">{c.optional}</span>
                      </label>
                      <input
                        type="text"
                        name="details"
                        placeholder={c.placeholderDetails}
                        value={formData.details}
                        onChange={handleInputChange}
                        className="h-10 w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0284c7] focus:ring-4 focus:ring-[#0284c7]/20 rounded-lg px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150"
                      />
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-lg btn-primary w-full"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{c.sending}</span>
                          </>
                        ) : (
                          <>
                            <span>{c.submit}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <div className="text-center text-xs text-slate-400 mt-2.5 flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.privacyNote}</span>
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
      <div className="w-full border-t border-slate-200/80 bg-white/95 backdrop-blur-md py-2.5 px-4 flex-shrink-0 text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{c.footerTrust}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <a href="tel:0800825925" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-sky-600" />
              {c.hotline}
            </a>
            <span className="text-slate-300">•</span>
            <Link to={lp('/calculator')} className="hover:text-slate-900 text-sky-700 transition-colors">{c.calculator}</Link>
          </div>
        </div>
      </div>

    </div>
  );
};
