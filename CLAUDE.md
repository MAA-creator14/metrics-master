@AGENTS.md

# Metric Master — Claude Code Context

## What this is
A free web app that teaches new product managers the difference between leading and lagging KPIs.
A 4-question wizard produces a visual 3-level metric tree. See `specs/outputs/prd-metric-master-2026-04-25.md` for the full PRD.

## Stack
- **Framework**: Next.js 16 App Router (TypeScript)
- **Styling**: Tailwind CSS v4 — config is in `app/globals.css` via `@theme`, no `tailwind.config.ts`
- **Animation**: Framer Motion
- **Tree visualisation**: `@xyflow/react` v12 (React Flow)
- **AI SDK**: Vercel AI SDK v6 — use `generateText` + `Output.object()`, NOT `generateObject` (removed in v6)
- **AI model**: `anthropic("claude-haiku-4.5")` — note the dot in the version number
- **Fonts**: Syne (display/headlines), DM Sans (body), DM Mono (metric labels) — all via `next/font/google`
- **Deploy**: Vercel

## Design system (colours)
All defined in `app/globals.css` `@theme` block. Reference them as Tailwind utilities:
- `bg-coral` / `text-coral` → `#ff6b6b` (north star nodes, CTAs)
- `bg-brand-teal` / `text-brand-teal` → `#4ecdc4` (level-2 leading indicator nodes)
- `bg-brand-amber` / `text-brand-amber` → `#ffd166` (level-3 behaviour nodes)
- `bg-brand-purple` → `#7b5ea7`
- `bg-brand-lime` → `#95e06c` (unlock celebration particles)
- `bg-bg-deep` → `#1a1a2e` (page background)
- `bg-surface` → `#16213e` (card/panel backgrounds)
- `text-text-primary` → `#f5f0eb`
- `text-text-muted` → `#b8b0a8`

## Key architectural decisions
- **No auth, no database** in v1 — tree state is serialised to the URL fragment (`#state=base64JSON`)
- **AI is optional** — the app must work fully with zero Claude API calls
- **Session cap** — max 3 Claude calls per session, enforced in `lib/claudeClient.ts`
- **AI only fires on user action** — the "✨ Help me name this" button and 'Other' business type north star suggestions
- **Tailwind v4** — do NOT create a `tailwind.config.ts`; add tokens to `@theme` in `globals.css`

## Wizard flow
4 questions, depth-first, 2 branches × 2 levels:
- Q1: what predicts north star? → Level 2, Branch 1
- Q2: what predicts Q1's metric? → Level 3, Branch 1
- Q3: what else predicts north star? → Level 2, Branch 2
- Q4: what predicts Q3's metric? → Level 3, Branch 2

## Content library (edit before adding new business types)
- `content/northStarSuggestions.ts` — lookup table by business type
- `content/wizardQuestions.ts` — question templates + example answers
- `content/explanations.ts` — causal explanation pairs (~10 now, target 30)
- `content/laggingKeywords.ts` — soft-nudge keyword detection

## Environment
Copy `.env.local.example` → `.env.local` and add your `ANTHROPIC_API_KEY`.
The app runs without it — only the optional AI button requires it.
