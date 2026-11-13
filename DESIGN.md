---
name: Batimove Sàrl
description: Déménagement haut de gamme suisse, confiance institutionnelle, clarté absolue.
colors:
  navy-institutionnel: "#0B1E33"
  navy-hover: "#132C48"
  navy-raise: "#17375A"
  bleu-suisse: "#0284C7"
  bleu-suisse-hover: "#0EA5E9"
  bleu-action: "#0369A1"
  bleu-action-hover: "#075985"
  rouge-suisse: "#E10600"
  fond-ardoise: "#F8FAFC"
  fond-glacier: "#E6EEF7"
  bordure-glacier: "#D3E0EE"
  surface: "#FFFFFF"
  surface-hover: "#F1F5F9"
  bordure: "#E2E8F0"
  texte-secondaire: "#475569"
  texte-discret: "#64748B"
typography:
  display:
    fontFamily: ""Google Sans Flex", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "3rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: ""Google Sans Flex", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: ""Google Sans Flex", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.012em"
  body:
    fontFamily: ""Google Sans Flex", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0.006em"
  label:
    fontFamily: ""Google Sans Flex", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
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
    backgroundColor: "{colors.bleu-action}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.bleu-action-hover}"
  button-secondary:
    backgroundColor: "{colors.navy-institutionnel}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "0 24px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.navy-hover}"
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
- **Navy Raise** (#17375A, classe `navy-raise`): hover de cartões e links grandes sobre fundo navy. 1,4:1 contra o navy, o bastante para o hover se ver; texto branco fica em 12:1.

### Secondary
- **Bleu Suisse** (#0284C7): destaques, links e foco. Em texto pequeno sobre branco fica em 4,1:1, abaixo do AA: use só em texto ≥18px bold.
- **Bleu Action** (#0369A1, hover #075985): fundo do botão de conversão (`btn-primary`). Com texto branco fica em 5,9:1, dentro do AA.
- **Bleu Suisse Hover** (#0EA5E9): hover do botão secundário.

### Tertiary
- **Rouge Suisse** (#E10600): vermelho de ação e bandeira suíça. Reservado; nunca decorativo.

### Neutral
- **Fond Ardoise** (#F8FAFC): fundo da aplicação. Ao lado do branco não se vê (1,05:1), então não serve para separar seções.
- **Fond Glacier** (#E6EEF7, classe `glacier`; borda `glacier-line` #D3E0EE): o tom claro da marca, um azul-gelo para as faixas claras que precisam se distinguir do branco. Cartões brancos sobre ele ganham relevo sem sombra extra. Navy fica em 14:1 e o texto secundário (#475569) em 6,5:1; o Texte Discret (#64748B) cai para 4,2:1, então texto pequeno sobre glacier usa #475569.
- **Surface** (#FFFFFF): cartões, caixas e painéis.
- **Surface Hover** (#F1F5F9): hover e estados táteis sutis.
- **Bordure** (#E2E8F0): divisórias e bordas estruturais de 1px.
- **Texte Secondaire** (#475569): parágrafos e texto de apoio.
- **Texte Discret** (#64748B): subtítulos e metadados secundários. Sobre o navy fica em 3,5:1; em fundo escuro use #CBD5E1 ou mais claro.

### Named Rules
**The One Accent Rule.** O Bleu Suisse é o único destaque. Se dois elementos vizinhos competem em azul, um deles volta ao navy.

**The Red Flag Rule.** O Rouge Suisse aparece só em ação crítica ou na bandeira. Nunca como fundo de seção, nunca em texto corrido.

**The Band Rhythm Rule.** Uma página longa alterna três faixas: branco, glacier e navy. Duas seções vizinhas nunca têm o mesmo fundo, e nenhum trecho claro passa de duas seções sem uma faixa glacier ou navy. Na home: glacier (topo), navy, branco, glacier, branco, navy, branco, glacier, navy, branco, rodapé navy. Navy é sempre #0B1E33; nada de navies parecidos (#07182B, #0F2742).

**The Honest Hover Rule.** Só o que é clicável reage ao mouse, e a reação se vê: cartão-link sobe 2px, ganha borda e passa de `shadow-rest`/sem sombra para `shadow-raised` em 150ms; linha de lista muda para glacier; cartão navy muda para navy-raise. Cartão informativo (que não é link) não tem hover.

## Typography

**Família única:** Google Sans Flex, variável (peso 400–700 e eixo de tamanho óptico), carregada do Google Fonts. `font-sans` e `font-display` apontam para ela.
**Logotipo:** Plus Jakarta Sans 800, só na palavra "Batimove Sàrl" (`font-brand`). Não usar em mais nada.
**Label/Mono Font:** Geist Mono (com SF Mono, Menlo), para dados e medidas

**Character:** uma voz só, calma e precisa. A hierarquia vem do tamanho, não do negrito: títulos grandes em peso 500, como um documento bem composto, não um cartaz. O tamanho óptico afina a letra nos títulos e a abre no texto pequeno sozinho (`font-optical-sizing: auto`).

Atenção: o `tailwind.config.js` redefine a escala. `text-base` vale 14px, `text-sm` 13px, `text-lg` 16px e `text-xxs` 10px.

### Hierarchy
- **Display** (500, 3rem, 1.1, -0.025em): headline do topo de página.
- **Headline** (500, 2.25rem, 1.15, `tracking-tight` = -0.015em): títulos de seção (h2).
- **Title** (500 a partir de 20px; 600 em 16px ou menos): títulos de card e de pergunta (h3).
- **Body** (400, 1rem, 1.625, +0.006em): parágrafos. Medida máxima de 65–75ch. Nunca abaixo de 14px (`text-base`) em texto que se lê.
- **Label** (600, 14px): rótulos, metadados e botões. 12px (`text-xs`) só em selos curtos.
- **Data** (Geist Mono 500, tabular-nums): telefone, preços em CHF, volumes em m³.

### Named Rules
**The Tabular Truth Rule.** Métricas e preços usam `tabular-nums`. Números alinhados são parte da promessa de precisão.

**The Quiet Weight Rule.** Peso máximo 600 (`font-semibold`); `font-bold`, `font-extrabold` e `font-black` não existem no site, exceto no logotipo. Título grande (20px+) usa 500 (`font-medium`).

**The French Case Rule.** Títulos, botões e rótulos em caixa de frase, como o francês escreve: "Toujours prêts à répondre à vos besoins", nunca "Toujours Prêts À Répondre". Maiúscula só na primeira palavra e nos nomes próprios.

**The Light Tracking Rule.** Título usa `tracking-tight` (-0.015em) ou, no display, `tracking-tighter` (-0.025em). Nada além de -0.03em.

## Layout

Container central de 1280px (`max-w-7xl`) com gutters de 16 / 24 / 32px (`px-4 sm:px-6 lg:px-8`). Conteúdo de leitura (FAQ, textos longos) fica em 768px (`max-w-3xl`). Grid de 12 colunas nas seções em duas partes.

Ritmo de 4px: 4, 8, 12, 16, 24, 32, 48, 64px (`gap-1` a `gap-16`). Seções verticais de 48–64px (`py-12` a `py-16`). Breakpoints do Tailwind: 640, 768, 1024, 1280px.

O cabeçalho é fixo no topo (`sticky top-0`) com fundo branco a 95%.

## Elevation & Depth

Elevação controlada, sem brilhos artificiais neon. Quatro níveis, todos em navy translúcido (rgba(11, 30, 51, …)) e com duas camadas: uma curta que assenta o objeto e uma difusa que dá a altura. As utilidades padrão do Tailwind (`shadow-sm` a `shadow-2xl`) apontam para esses níveis no `tailwind.config.js`, então nenhuma sombra sai da escala.

### Shadow Vocabulary
- **Rest** (`shadow-rest`; também `shadow-sm`/`shadow`): `0 1px 2px rgba(11,30,51,.06), 0 1px 3px rgba(11,30,51,.04)`. Cartões e formulários em repouso, junto com a borda de 1px.
- **Raised** (`shadow-raised`; também `shadow-md`): `0 2px 4px -1px rgba(11,30,51,.06), 0 8px 16px -4px rgba(11,30,51,.08)`. Hover de cartão clicável, selos flutuantes.
- **Overlay** (`shadow-overlay`; também `shadow-lg`/`shadow-xl`): `0 4px 8px -2px rgba(11,30,51,.06), 0 16px 32px -8px rgba(11,30,51,.14)`. Menu "Déménagement", popover do WhatsApp.
- **Modal** (`shadow-modal`; também `shadow-2xl`): `0 8px 16px -4px rgba(11,30,51,.08), 0 32px 64px -16px rgba(11,30,51,.24)`. Drawer mobile, banner de cookies, wizard sobre foto.

### Named Rules
**The No Neon Rule.** Nada de sombra colorida (`shadow-sky-500/30`, verde do WhatsApp) nem glow radial em fundo escuro. Sombra é navy, tem offset e sai da escala.

**The Four Levels Rule.** Nenhuma sombra arbitrária (`shadow-[…]`) em componente. Se nenhum dos quatro níveis serve, o problema é a hierarquia, não a sombra. Exceções: o anel interno de seleção (`shadow-[inset_0_0_0_1px_…]`) e o `drop-shadow` das fotos recortadas.

**The One Step Rule.** Hover sobe um nível (rest → raised), nunca dois.

## Shapes

Bordas de 1px sutis (`border-slate-200`). Raio de 12px (`rounded-xl`) para botões e cartões interativos, 8px para campos, e pílula (`rounded-full`) só para controles pequenos como badges.

**The Twelve Rule.** Cartões e botões ficam em 12px. Raios de 16–24px (`rounded-2xl`, `rounded-3xl`) não fazem parte do sistema.

## Components

Precisos e contidos: cada componente tem uma função clara e um único estado de destaque.

### Buttons
Um só sistema, em `src/index.css` (`.btn` + tamanho + variante) e no componente `Button` / `buttonClass()` de `components/UIComponents.tsx`. Vale para `<button>`, `<a>` e `<Link>`.
- **Shape:** cantos de 12px (`rounded-xl`), semibold, alturas 36 / 44 / 48px (`btn-sm`, `btn-md`, `btn-lg`).
- **Primary (`btn-primary`):** a ação de conversão (devis, envoyer, continuer). Bleu Action em degradê sutil de #0377B8 a #0369A1 com texto branco (4,8 a 5,9:1, AA), brilho interno de 1px e sombra neutra com offset. Uma por bloco.
- **Secondary (`btn-secondary`):** navy institucional, ação forte que não é conversão ("Découvrir nos prestations").
- **Outline / Ghost (`btn-outline`, `btn-ghost`):** ações alternativas ("Calculer mon volume", "Retour").
- **Inverse (`btn-inverse`):** branco com texto navy, sobre faixas navy.
- **Hover / Active / Focus:** troca de cor em 150ms; no clique, `scale(0.98)` tátil; foco com anel de 2px azul e offset de 2px. Sem `scale` no hover, sem sombra colorida.
- **Regra de HTML:** um link de navegação estilizado como botão é um `<a>`/`<Link>` com `buttonClass()`; não aninhar `<button>` dentro de `<Link>`.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** branco sobre o fundo ardósia.
- **Shadow Strategy:** Rest em repouso, Raised no hover se o cartão é clicável; ver Elevation & Depth.
- **Border:** 1px `#E2E8F0`.
- **Internal Padding:** 24px.

### Inputs / Fields
- **Style:** fundo branco, borda de 1px `slate-300`, raio de 8px, padding 8 × 16px.
- **Focus:** anel de 2px no azul da marca.
- **Error:** borda vermelha e mensagem de 12px logo abaixo do campo.

### Navigation
- Cabeçalho branco fixo com logo, links em Google Sans Flex 14px navy, hover em Bleu Suisse e o botão primário "Devis Gratuit" à direita. No mobile, menu em painel lateral à direita.

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
