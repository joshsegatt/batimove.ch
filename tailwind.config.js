/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'batimove-blue': '#0052A3',
        'batimove-red': '#E10600',
        'batimove-dark': '#0B1E33',
        // Faixas de seção (ver DESIGN.md, The Band Rhythm Rule): o glacier é o
        // tom claro da marca, visível ao lado do branco; navy-raise é o hover
        // de superfícies navy.
        glacier: '#E6EEF7',
        'glacier-line': '#D3E0EE',
        'navy-raise': '#17375A',
        // Batimove Rénovation (área /renovation): grafite e pedra no lugar do
        // navy e do glacier, terracota como acento. Mesma tipografia e regras.
        'reno-ink': '#171A1D',
        'reno-raise': '#262B30',
        'reno-stone': '#F4F1EB',
        'reno-line': '#E2DBCF',
        'reno-clay': '#A3472A',
        'reno-clay-hover': '#873A22',
        'reno-clay-soft': '#F3E5DD',
        // Ultra-premium grays (Vercel/Linear style)
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eaeaea',
          300: '#e5e5e5',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        // Uma família só: Google Sans Flex, variável, com eixo de tamanho óptico
        // (o navegador ajusta o desenho da letra ao tamanho). "display" é o mesmo
        // tipo, mantido como alias para os títulos.
        sans: ['"Google Sans Flex"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
        display: ['"Google Sans Flex"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        // Só o logotipo "Batimove Sàrl".
        brand: ['"Plus Jakarta Sans"', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', '"SF Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      // Tracking calibrado para a Google Sans Flex, que já é desenhada mais justa
      // nos tamanhos grandes: o "tight" padrão do Tailwind (-0.025em) aperta demais.
      letterSpacing: {
        tighter: '-0.025em',
        tight: '-0.015em',
        normal: '0',
      },
      fontSize: {
        'xxs': ['10px', '14px'],
        'xs': ['12px', '16px'],
        'sm': ['13px', '18px'],
        'base': ['14px', '20px'],
        'lg': ['16px', '24px'],
      },
      // Escala de elevação: 4 níveis, navy translúcido, duas camadas (uma curta que
      // assenta o objeto, uma difusa que dá a altura). As utilidades padrão do
      // Tailwind apontam para a escala, então shadow-sm…shadow-2xl nunca saem dela.
      boxShadow: {
        rest: '0 1px 2px rgba(11, 30, 51, 0.06), 0 1px 3px rgba(11, 30, 51, 0.04)',
        raised: '0 2px 4px -1px rgba(11, 30, 51, 0.06), 0 8px 16px -4px rgba(11, 30, 51, 0.08)',
        overlay: '0 4px 8px -2px rgba(11, 30, 51, 0.06), 0 16px 32px -8px rgba(11, 30, 51, 0.14)',
        modal: '0 8px 16px -4px rgba(11, 30, 51, 0.08), 0 32px 64px -16px rgba(11, 30, 51, 0.24)',
        sm: '0 1px 2px rgba(11, 30, 51, 0.06), 0 1px 3px rgba(11, 30, 51, 0.04)',
        DEFAULT: '0 1px 2px rgba(11, 30, 51, 0.06), 0 1px 3px rgba(11, 30, 51, 0.04)',
        md: '0 2px 4px -1px rgba(11, 30, 51, 0.06), 0 8px 16px -4px rgba(11, 30, 51, 0.08)',
        lg: '0 4px 8px -2px rgba(11, 30, 51, 0.06), 0 16px 32px -8px rgba(11, 30, 51, 0.14)',
        xl: '0 4px 8px -2px rgba(11, 30, 51, 0.06), 0 16px 32px -8px rgba(11, 30, 51, 0.14)',
        '2xl': '0 8px 16px -4px rgba(11, 30, 51, 0.08), 0 32px 64px -16px rgba(11, 30, 51, 0.24)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    }
  },
  plugins: []
};
