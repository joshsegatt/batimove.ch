---
name: Batimove Sàrl
description: Déménagement haut de gamme suisse, confiance institutionnelle, clarté absolue.
colors:
  navy-institutionnel: "#0B1E33"
  navy-hover: "#132C48"
  bleu-suisse: "#0284C7"
  bleu-suisse-hover: "#0EA5E9"
  rouge-suisse: "#E10600"
  fond-ardoise: "#F8FAFC"
  surface: "#FFFFFF"
  surface-hover: "#F1F5F9"
  bordure: "#E2E8F0"
  texte-secondaire: "#475569"
  texte-discret: "#64748B"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
  data:
    fontFamily: "Geist Mono, SF Mono, Menlo, monospace"
    fontSize: "1rem"
    fontWeight: 500
    fontFeature: "tnum"
rounded:
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.navy-institutionnel}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.navy-hover}"
  button-secondary:
    backgroundColor: "{colors.bleu-suisse}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "14px 32px"
  button-secondary-hover:
    backgroundColor: "{colors.bleu-suisse-hover}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.navy-institutionnel}"
    rounded: "{rounded.lg}"
    padding: "14px 24px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.navy-institutionnel}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  badge:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.texte-secondaire}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
---

# Design System: Batimove Sàrl

> Verdade única de design da Batimove Sàrl. Todas as páginas, componentes e estilos visuais obedecem estritamente a estas especificações. Os tokens do frontmatter são normativos; o texto explica onde e por que aplicá-los.

## Overview

**Creative North Star: "La Précision Helvétique"**

Déménagement haut de gamme suisse: confiance institutionnelle, clarté absolue, précision chirurgicale. A referência visual é Apple HIG + Stripe + Swiss Design: grid rigoroso, números tabulares e nenhum "slop" visual. Cada elemento precisa provar o seu lugar; a confiança vem de fatos verificáveis (seguro, prazo de resposta, avaliações reais), não de decoração.

O site público é Light Mode. O portal BatimoveOS é Dark Mode.

**Key Characteristics:**
- Navy institucional como voz principal, azul suíço só para destaque e foco.
- Hierarquia por peso e tamanho, nunca por efeito.
- Métricas e preços em números tabulares.
- Superfícies claras, bordas de 1px, elevação contida.

## Colors

Paleta institucional de navy e ardósia, com um único azul de destaque e o vermelho da bandeira reservado à ação.

### Primary
- **Navy Institutionnel** (#0B1E33): títulos, texto principal, botão primário e faixas escuras (rodapé, faixa de orçamento). É a cor que carrega a marca.
- **Navy Hover** (#132C48): estado hover do botão primário.

### Secondary
- **Bleu Suisse** (#0284C7): destaques, links, foco e botão secundário. Em texto pequeno sobre branco fica em 4,1:1, abaixo do AA: use só em texto ≥18px bold ou como fundo de botão com texto bold.
- **Bleu Suisse Hover** (#0EA5E9): hover do botão secundário.

### Tertiary
- **Rouge Suisse** (#E10600): vermelho de ação e bandeira suíça. Reservado; nunca decorativo.

### Neutral
- **Fond Ardoise** (#F8FAFC): fundo principal da aplicação e das seções alternadas.
- **Surface** (#FFFFFF): cartões, caixas e painéis.
- **Surface Hover** (#F1F5F9): hover e estados táteis sutis.
- **Bordure** (#E2E8F0): divisórias e bordas estruturais de 1px.
- **Texte Secondaire** (#475569): parágrafos e texto de apoio.
- **Texte Discret** (#64748B): subtítulos e metadados secundários. Sobre o navy fica em 3,5:1; em fundo escuro use #CBD5E1 ou mais claro.

### Named Rules
**The One Accent Rule.** O Bleu Suisse é o único destaque. Se dois elementos vizinhos competem em azul, um deles volta ao navy.

**The Red Flag Rule.** O Rouge Suisse aparece só em ação crítica ou na bandeira. Nunca como fundo de seção, nunca em texto corrido.

## Typography

**Display Font:** Plus Jakarta Sans (com -apple-system, sans-serif)
**Body Font:** Inter (com -apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
**Label/Mono Font:** Geist Mono (com SF Mono, Menlo), para dados e medidas

**Character:** Plus Jakarta Sans dá autoridade geométrica aos títulos; Inter mantém a leitura neutra e precisa.

Atenção: o `tailwind.config.js` redefine a escala. `text-base` vale 14px, `text-sm` 13px, `text-lg` 16px e `text-xxs` 10px.

### Hierarchy
- **Display** (800, 3rem, 1.12): headline do topo de página e títulos de seção principais.
- **Headline** (800, 2.25rem, 1.15): títulos de seção (h2).
- **Title** (700, 1.125rem, 1.35): títulos de card e de pergunta (h3).
- **Body** (400, 1rem, 1.625): parágrafos. Medida máxima de 65–75ch.
- **Label** (500, 0.75rem, 1.33): rótulos de métricas e metadados.
- **Data** (Geist Mono 500, tabular-nums): telefone, preços em CHF, volumes em m³.

### Named Rules
**The Tabular Truth Rule.** Métricas e preços usam `font-display` com `tabular-nums`. Números alinhados são parte da promessa de precisão.

**The Tight Title Rule.** Todo título usa `tracking-tight`.

## Layout

Container central de 1280px (`max-w-7xl`) com gutters de 16 / 24 / 32px (`px-4 sm:px-6 lg:px-8`). Conteúdo de leitura (FAQ, textos longos) fica em 768px (`max-w-3xl`). Grid de 12 colunas nas seções em duas partes.

Ritmo de 4px: 4, 8, 12, 16, 24, 32, 48, 64px (`gap-1` a `gap-16`). Seções verticais de 48–64px (`py-12` a `py-16`). Breakpoints do Tailwind: 640, 768, 1024, 1280px.

O cabeçalho é fixo no topo (`sticky top-0`) com fundo branco a 95%.

## Elevation & Depth

Elevação controlada, sem brilhos artificiais neon. A profundidade vem de borda de 1px e de sombras neutras de offset suave; nunca de halos coloridos.

### Shadow Vocabulary
- **Subtle** (`box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03)`): cartões em repouso.
- **Premium** (`box-shadow: 0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.04)`): painéis destacados e formulários.
- **Glass** (`box-shadow: 0 4px 30px rgba(0,0,0,0.05)`): cabeçalho e sobreposições.

### Named Rules
**The No Neon Rule.** Nada de sombra colorida (`shadow-sky-500/30`) nem glow radial em fundo escuro. Sombra é neutra e tem offset.

## Shapes

Bordas de 1px sutis (`border-slate-200`). Raio de 12px (`rounded-xl`) para botões e cartões interativos, 8px para campos, e pílula (`rounded-full`) só para controles pequenos como badges.

**The Twelve Rule.** Cartões e botões ficam em 12px. Raios de 16–24px (`rounded-2xl`, `rounded-3xl`) não fazem parte do sistema.

## Components

Precisos e contidos: cada componente tem uma função clara e um único estado de destaque.

### Buttons
- **Shape:** cantos de 12px (`rounded-xl`).
- **Primary:** navy institucional com texto branco, 14 × 32px, bold. É a ação principal da página ("Demander un Devis Gratuit").
- **Secondary:** Bleu Suisse com texto branco bold, para a segunda ação em fundo escuro.
- **Outline:** fundo branco, borda de 1px, texto navy, para a ação alternativa ("Calculer mon volume").
- **Hover / Focus:** troca de cor em 150–200ms; foco com anel de 2px azul e offset de 2px. Sem `scale` acima de 1.02.
- **Regra de HTML:** um link de navegação estilizado como botão é um `<a>`; não aninhar `<button>` dentro de `<Link>`.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** branco sobre o fundo ardósia.
- **Shadow Strategy:** Subtle em repouso; ver Elevation & Depth.
- **Border:** 1px `#E2E8F0`.
- **Internal Padding:** 24px.

### Inputs / Fields
- **Style:** fundo branco, borda de 1px `slate-300`, raio de 8px, padding 8 × 16px.
- **Focus:** anel de 2px no azul da marca.
- **Error:** borda vermelha e mensagem de 12px logo abaixo do campo.

### Navigation
- Cabeçalho branco fixo com logo, links em Inter 14px navy, hover em Bleu Suisse e o botão primário "Devis Gratuit" à direita. No mobile, menu em painel lateral à direita.

### FAQ (accordion)
- `<details>` nativo com divisórias de 1px entre itens, pergunta em Title (h3) e seta que gira 180° em 200ms. Área de toque mínima de 44px. O texto tem que ser idêntico ao FAQPage JSON-LD do `index.html`.

## Do's and Don'ts

### Do:
- **Do** usar números tabulares em todas as métricas e preços.
- **Do** manter bordas de 1px `#E2E8F0` e raio de 12px em cartões e botões.
- **Do** animar só em resposta a clique ou hover, em 150–200ms com `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Do** basear toda afirmação de confiança em fato verificável (RC Pro 5M CHF, resposta sob 30 min, avaliações Google reais).

### Don't:
- **Don't** usar glows coloridos, sombras neon ou halos radiais.
- **Don't** usar o Rouge Suisse como decoração.
