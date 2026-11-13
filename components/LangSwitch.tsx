import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { alternatePath, langOf, type Lang } from '../i18n';

const OPTIONS: { lang: Lang; label: string; name: string }[] = [
  { lang: 'fr', label: 'FR', name: 'Français' },
  { lang: 'en', label: 'EN', name: 'English' },
];

/**
 * Botão FR | EN. Leva à mesma página no outro idioma (não à home), mantendo
 * ?query e #hash, então quem está no wizard de Lausanne continua lá.
 */
export const LangSwitch: React.FC<{ className?: string; tone?: 'light' | 'dark'; compactOnMobile?: boolean }> = ({
  className = '',
  tone = 'light',
  compactOnMobile = false,
}) => {
  const { pathname, search, hash } = useLocation();
  const current = langOf(pathname);
  const here = pathname + search + hash;

  // No celular a barra não comporta o par FR | EN ao lado do logo, do telefone
  // e do menu: mostra só o idioma para o qual se pode ir.
  if (compactOnMobile) {
    const other = OPTIONS.find((o) => o.lang !== current)!;
    return (
      <>
        <Link
          to={alternatePath(here, other.lang)}
          hrefLang={other.lang}
          lang={other.lang}
          aria-label={other.name}
          className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-semibold text-[#0B1E33] transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7] sm:hidden ${className}`}
        >
          {other.label}
        </Link>
        <LangSwitch className={`hidden sm:block ${className}`} tone={tone} />
      </>
    );
  }

  const track = tone === 'dark' ? 'bg-white/10' : 'bg-slate-100';
  const idle =
    tone === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#0B1E33]';
  const active = tone === 'dark' ? 'bg-white text-[#0B1E33] shadow-rest' : 'bg-white text-[#0B1E33] shadow-rest';

  return (
    <nav aria-label="Langue / Language" className={className}>
      <ul className={`flex items-center rounded-lg p-0.5 ${track}`}>
        {OPTIONS.map((o) => {
          const isCurrent = o.lang === current;
          return (
            <li key={o.lang}>
              <Link
                to={isCurrent ? here : alternatePath(here, o.lang)}
                hrefLang={o.lang}
                lang={o.lang}
                aria-current={isCurrent ? 'true' : undefined}
                aria-label={o.name}
                className={`grid h-8 min-w-[2.5rem] place-items-center rounded-md px-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0284c7] ${
                  isCurrent ? active : idle
                }`}
              >
                {o.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
