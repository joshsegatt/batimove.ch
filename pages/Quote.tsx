import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Phone, ShieldCheck, Star } from 'lucide-react';
import { GOOGLE_RATING } from '../data/reviews';
import { resolveQuoteServiceId } from '../data/quoteServices';
import { QuoteWizard } from '../components/quote/QuoteWizard';
import { SEO } from '../components/SEO';

export const Quote: React.FC = () => {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();

  // /quote/:serviceId e /quote?type=… levam ao mesmo wizard, já no serviço certo.
  const urlService = resolveQuoteServiceId(serviceId || searchParams.get('type'));

  return (
    <div className="flex min-h-[calc(100dvh-98px)] flex-1 flex-col bg-[#F8FAFC] font-sans text-slate-900">
      <SEO
        title="Devis Déménagement Gratuit & Sans Engagement - Batimove"
        description="Demandez votre devis de déménagement en ligne gratuit sous 30 min. Remplissez le formulaire en 2 minutes ou contactez-nous au 0800 825 925."
        canonical="https://www.batimove.ch/quote"
      />

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-[#0B1E33] sm:text-4xl">
          Votre devis gratuit
          <span className="sr-only"> : devis de déménagement à Genève, Vaud et en Suisse romande</span>
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Quatre étapes, moins de deux minutes. Réponse sous 30&nbsp;min (8h-19h).
        </p>

        <div className="mt-6 sm:mt-8">
          {/* key: trocar de serviço pela URL (ex. voltar à Home e escolher outro) reinicia o wizard */}
          <QuoteWizard
            key={urlService ?? 'none'}
            urlService={urlService}
            initialFrom={searchParams.get('from') || undefined}
            initialTo={searchParams.get('to') || undefined}
            initialSize={searchParams.get('size') || undefined}
          />
        </div>

        <ul className="mt-6 flex flex-col gap-2.5 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:gap-x-6">
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#0B1E33]" aria-hidden="true" />
            Assurance RC Pro 5M CHF
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#0B1E33]" aria-hidden="true" />
            Prix ferme&nbsp;: aucun surcoût une fois le devis accepté
          </li>
          <li className="flex items-center gap-2">
            <Star className="h-4 w-4 shrink-0 fill-amber-500 text-amber-500" aria-hidden="true" />
            <span className="tabular-nums">
              {GOOGLE_RATING.value} / 5 sur {GOOGLE_RATING.count} avis Google
            </span>
          </li>
        </ul>
      </div>

      <div className="w-full border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-2 sm:flex-row">
          <span>Batimove Sàrl · Genève, Vaud, Fribourg, Valais</span>
          <div className="flex items-center gap-5 font-medium">
            <a href="tel:0800825925" className="flex items-center gap-1.5 transition-colors duration-150 hover:text-[#0B1E33]">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="tabular-nums">0800 825 925</span>
            </a>
            <Link to="/calculator" className="transition-colors duration-150 hover:text-[#0B1E33]">
              Calculateur de volume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
