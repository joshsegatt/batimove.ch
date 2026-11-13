import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// --- Button ---
// Usa o sistema de botões global (src/index.css: .btn, .btn-primary…), o mesmo
// aplicado em <a> e <Link> estilizados como botão.
//   primary   = ação de conversão (azul profundo da marca)
//   secondary = navy institucional
//   outline / ghost = ações alternativas; inverse = sobre fundo navy
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverse';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

/** Classes do sistema de botões, para <a>/<Link> que precisam parecer botão. */
export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = '') =>
  `btn btn-${size} btn-${variant} ${extra}`.trim();

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  ...props
}) => (
  <button className={buttonClass(variant, size, className)} disabled={disabled || isLoading} aria-busy={isLoading || undefined} {...props}>
    {isLoading ? (
      <>
        <svg className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Envoi en cours…
      </>
    ) : (
      children
    )}
  </button>
);

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        className={`px-4 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-batimove-blue focus:border-batimove-blue outline-none transition-all ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'
          } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

// --- Card ---
interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'blue' | 'red' | 'green' }> = ({ children, variant = 'blue' }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    red: "bg-red-50 text-red-700 border-red-100",
    green: "bg-green-50 text-green-700 border-green-100"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[variant]}`}>
      {children}
    </span>
  );
};

// --- Official Logo ---
// Utilise la version réduite : le logo s'affiche à 48px dans l'en-tête et à
// 28px dans le pied de page. Le fichier batimove-logo.png d'origine (1024px)
// reste en place car il sert d'og:image pour les aperçus de liens.
export const Logo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img
    src="/batimove-logo-sm.png"
    alt="Batimove Logo"
    width={192}
    height={129}
    decoding="async"
    {...props}
  />
);