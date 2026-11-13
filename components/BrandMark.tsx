import React, { useId } from 'react';

// Símbolo Batimove redesenhado em vetor a partir da logo oficial:
// casa azul (telhado navy, chaminé, janela, porta) + caixa vermelha com a cruz suíça.
// viewBox 425 × 320. Mesma geometria em public/batimove-mark.svg (esqueleto e favicon).

export const BrandMark: React.FC<{ className?: string; title?: string }> = ({ className, title }) => {
  const uid = useId().replace(/:/g, '');
  const facade = `bm-facade-${uid}`;
  const box = `bm-box-${uid}`;
  return (
    <svg
      viewBox="0 0 425 320"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={facade} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#2F6FB7" />
          <stop offset="1" stopColor="#1E4C91" />
        </linearGradient>
        <linearGradient id={box} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#EC4527" />
          <stop offset="1" stopColor="#D42E1B" />
        </linearGradient>
      </defs>
      {/* Telhado e chaminé */}
      <path fill="#183463" d="M0 125 145 2 280 96 256 106 145 31 43 124Z" />
      <path fill="#183463" d="M62 22h26v29L62 73Z" />
      {/* Fachada */}
      <path fill={`url(#${facade})`} d="M47 131 145 45 240 108V318L47 270Z" />
      {/* Janela 2 × 2 */}
      <path fill="#fff" d="M124 100h28v28h-28zM158 100h28v28h-28zM124 134h28v28h-28zM158 134h28v28h-28z" />
      {/* Porta (batente em U) */}
      <path fill="#fff" d="M122 215 178 229V302.75L166 299.75V241L134 233V291.75L122 288.75Z" />
      {/* Caixa: abas de cima */}
      <path fill="#E2412A" d="M214 26 406 54 423 64 240 40Z" />
      <path fill="#E2412A" d="M262 66 336 79 300 93Z" />
      {/* Caixa: face lateral */}
      <path fill={`url(#${box})`} d="M256 112 423 64V262L256 318Z" />
      {/* Fenda da fita */}
      <path fill="#fff" d="M337 88.7 362 81.5V128L337 135Z" />
      {/* Cruz suíça */}
      <path fill="#fff" d="M335 150h26v30h30v26h-30v30h-26v-30h-30v-26h30z" />
    </svg>
  );
};

/** Símbolo + nome, para a navbar e o rodapé. */
export const BrandLogo: React.FC<{ className?: string; markClassName?: string; textClassName?: string }> = ({
  className = '',
  markClassName = 'h-10 w-auto',
  textClassName = 'text-2xl text-[#0B1E33]',
}) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <BrandMark className={markClassName} />
    <span className={`whitespace-nowrap font-display font-extrabold leading-none tracking-tight ${textClassName}`}>Batimove Sàrl</span>
  </span>
);

export default BrandMark;
