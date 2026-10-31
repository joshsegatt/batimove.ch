# Batimove — frontend

Site e UI de operações de [batimove.ch](https://www.batimove.ch), plataforma suíça de mudanças: orçamento em etapas, calculadora, contato e captação de leads B2B. Conversa com uma API separada.

## Stack
React 19 · Vite 6 · TypeScript · Tailwind 3 · Framer Motion · React Router 7 · EmailJS

## Comandos
- `npm run dev`: servidor local. A API é acessada via proxy do Vite em `http://localhost:8000/api`
- `npm run build`: `vite build` seguido de prerender (`scripts/prerender.mjs`), saída em `dist/`
- `npx tsc --noEmit`: checagem de tipos. Rode depois de qualquer mudança em `.ts`/`.tsx`
- Não há testes automatizados nem lint. Verifique visualmente no navegador (`.claude/launch.json`)

## Estrutura
- `pages/`: páginas (Home, Quote, Calculator, CalculatorCheckout, Pricing, Services, Contact, Legal, `locations/`)
- `components/`, `hooks/`, `utils/`, `types/`, `data/`: UI e apoio
- `services/api.ts`: cliente da API. Em produção a URL vem de `VITE_API_URL`
- `src/`: CSS global (`index.css`, `performance.css`)
- `brag-output*/`: material gerado, não é código do app

## Regras
- Design: siga `DESIGN.md` e a skill `impeccable`
- SEO importa: títulos e meta descriptions dentro do limite que o Google mostra. O prerender precisa continuar funcionando
- Nunca commitar `.env`/`.env.local`. Use `.env.example` como referência
- Commits pequenos, no formato `tipo(escopo): descrição em português`. Exemplo: `fix(a11y): ...`, `seo(titulos): ...`
- Deploy: veja `DEPLOY.md` (Railway). Também existe `vercel.json`, então confirme o alvo antes de mexer em deploy
