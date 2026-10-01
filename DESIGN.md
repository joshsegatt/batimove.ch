# DESIGN.md: Sistema de Design Batimove

> Verdade única de design da Batimove Sàrl. Todas as páginas, componentes e estilos visuais obedecem estritamente a estas especificações.

---

## 1. Identidade & Conceito
- **Nome do Projeto**: Batimove Sàrl
- **Tom & Atmosfera**: Déménagement haut de gamme suisse, confiance institutionnelle, clarté absolue, précision chirurgicale.
- **Referência Visual Principal**: Apple HIG + Stripe + Swiss Design (grid rigoroso, números tabulares, sem slop visual).
- **Modo**: Light Mode primário na landing page pública / Dark Mode no BatimoveOS portal.

---

## 2. Paleta de Cores (8 Tokens Funcionais)

| Token Semântico | Variável Tailwind | Hex | Finalidade de Uso |
| :--- | :--- | :--- | :--- |
| `background` | `bg-white` / `bg-[#f8fafc]` | `#F8FAFC` | Fundo principal da aplicação |
| `surface` | `bg-white` | `#FFFFFF` | Cartões, caixas e painéis |
| `surface-hover` | `hover:bg-slate-50` / `hover:bg-slate-100` | `#F1F5F9` | Hover e estados táteis sutis |
| `border` | `border-slate-200` | `#E2E8F0` | Divisórias e bordas estruturais de 1px |
| `text-primary` | `text-[#0B1E33]` / `text-slate-900` | `#0B1E33` | Títulos e leitura principal (Navy institucional) |
| `text-muted` | `text-slate-600` / `text-slate-500` | `#64748B` | Subtítulos e metadados secundários |
| `accent` | `bg-[#0284c7]` / `text-[#0284c7]` | `#0284C7` | Azul Batimove Suíço para destaques e foco |
| `feedback` | `bg-[#E10600]` / `text-[#E10600]` | `#E10600` | Vermelho de ação e bandeira suíça |

---

## 3. Tipografia
- **Família de Títulos**: `"Plus Jakarta Sans", -apple-system, sans-serif`
- **Família de UI / Leitura**: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Família Mono (Dados / Código)**: `"Geist Mono", monospace`
- **Regras**:
  - Métricas e preços com `font-display` e `tabular-nums`.
  - Títulos com `tracking-tight`.

---

## 4. Escala Espacial (Rhythm de 4px)
`4px` (`gap-1`), `8px` (`gap-2`), `12px` (`gap-3`), `16px` (`gap-4`), `24px` (`gap-6`), `32px` (`gap-8`), `48px` (`gap-12`), `64px` (`gap-16`).

---

## 5. Bordas & Sombras
- **Bordas**: 1px sutil (`border border-slate-200`).
- **Raios**: `rounded-xl` (12px) para botões e cartões interativos.
- **Sombras**: Elevação controlada, sem brilhos artificiais neon.

---

## 6. Motion
- 150ms a 200ms `cubic-bezier(0.16, 1, 0.3, 1)`.
- Apenas microinterações causais sob clique/hover.
