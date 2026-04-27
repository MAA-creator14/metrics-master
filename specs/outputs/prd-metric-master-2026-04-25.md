# PRD: Metric Master — Leading & Lagging KPI Explorer

**Status:** Draft
**Owner:** Marc Abraham
**Last Updated:** 2026-04-25
**Target Release:** Q3 2026
**Availability:** Free, public web app — no login required

---

## 1. Overview

Metric Master is an interactive web app that teaches new product managers how to think about business metrics. Through a 4-question wizard, users name their north star lagging metric and progressively "unlock" the leading indicators and upstream behaviours that predict it — ending with a visual 3-level causal tree they can share with their team.

The app is designed to work completely without AI. Claude is available as an optional accelerator (capped at 3 calls per session, all user-initiated) for users who get stuck naming a metric. The educational value comes from the structure of the questions and the act of thinking through causality — not from AI-generated answers.

---

## 2. Problem

### Who has it
Junior and mid-level product managers (0–3 years experience), PMs transitioning from engineering or design, and PMs at early-stage startups who are expected to own metrics without formal training.

### What the problem is
New PMs struggle to connect their day-to-day product decisions to business outcomes. They hear terms like "north star metric" and "leading indicator" but cannot operationalise them for their own product. This leads to:

- Poor prioritisation — optimising for visible activity, not predictive signals
- Inability to demonstrate product value to stakeholders
- Reactive rather than proactive product thinking
- Cargo-culting metrics from other companies without understanding the causal logic

### Why existing resources fall short
Blog posts and courses explain the concepts abstractly. What new PMs need is a guided process for applying the concepts to *their specific product* — with immediate, structured feedback and a tangible output they can share.

---

## 3. Evidence

- ⚠️ **Assumed:** New PMs cite "understanding metrics" as a top skills gap — validate via 5 interviews before launch
- ⚠️ **Assumed:** No existing tool offers an interactive, product-specific wizard for deriving leading indicators
- ✅ **Validated concept:** The leading/lagging framework is well established in PM literature (Marty Cagan, Reforge, Gibson Biddle)
- ✅ **Validated need:** PM communities (Slack groups, Reddit r/ProductManagement) surface this exact question repeatedly

---

## 4. Goals & Non-Goals

### Goals
- A PM with no metrics background can name their north star and unlock 4 leading indicators in ~7 minutes
- The visual tree output is memorable and shareable with a manager or team
- The app works completely with zero Claude API calls
- The experience feels more like a game than a business tool
- Solo-buildable with Claude Code in days, not weeks

### Non-Goals
- NOT a metrics tracking or analytics tool — no data source connections
- NOT aimed at senior PMs or data analysts who already know this
- NOT a team collaboration tool in v1
- NOT a mobile-native app — responsive web, desktop-primary
- NO user accounts, auth, or saved trees in v1
- NO analytics instrumentation in v1
- NO post-wizard editing — the tree is final; users start fresh for a new tree

---

## 5. Target Personas

### Primary: "Junior Jamie"
- 1 year into their first PM role at a Series A SaaS startup
- No business or finance background; intimidated by metrics conversations
- Needs to present a metrics framework to their VP next quarter
- Pain: Knows the vocabulary but freezes when asked "what would tell you that's working?"

### Secondary: "Career-Switch Casey"
- Former engineer or designer, 6 months into PM
- Intellectually curious, missing a mental model others take for granted
- Pain: Everyone talks about north star metrics but no one explains how to *derive* leading indicators

---

## 6. User Journey

### Step-by-step flow

```
[1] WELCOME
    Headline: "What drives your north star?"
    15-second CSS animation: behaviour → leading → lagging causal chain
    Explains the concept in one sentence per level
    CTA: "Build my metric tree →"

[2] BUSINESS TYPE SELECTOR
    7 visual cards with icons — tap to select, auto-advances:
    SaaS · E-commerce · Marketplace · Consumer App
    Media/Content · Fintech · Other

[3] NORTH STAR METRIC
    "What's the ONE metric your company most cares about growing?"
    3 pre-built pill suggestions (from lookup table for selected business type)
    Free-text input for custom metric
    'Other' business type: one Claude call fires to generate 3 tailored suggestions
    On selection: inline callout explains why it's a lagging metric

[4] UNLOCK LOOP — 4 questions, depth-first, 2 branches × 2 levels
    ┌──────────────────────────────────────────────────────────┐
    │ Q1 (Level 2, Branch 1):                                  │
    │ "What behaviour, if it increased this week, would        │
    │  predict [north star] going up next month?"              │
    │ → User answers → metric named → Level 2 node unlocked   │
    │                                                          │
    │ Q2 (Level 3, Branch 1):                                  │
    │ "What behaviour, if it increased this week, would        │
    │  predict [Q1 metric] going up next month?"               │
    │ → User answers → metric named → Level 3 node unlocked   │
    │                                                          │
    │ Q3 (Level 2, Branch 2):                                  │
    │ "What ELSE, if it increased this week, would predict     │
    │  [north star] going up next month?"                      │
    │ → User answers → metric named → Level 2 node unlocked   │
    │                                                          │
    │ Q4 (Level 3, Branch 2):                                  │
    │ "What behaviour, if it increased this week, would        │
    │  predict [Q3 metric] going up next month?"               │
    │ → User answers → metric named → Level 3 node unlocked   │
    └──────────────────────────────────────────────────────────┘
    Progress bar visible throughout: ■■□□ "2 of 4 indicators"

[5] TREE REVEAL
    🎉 "Your metric tree is complete!"
    Full-screen React Flow tree animates in
    Hover any node for causal explanation tooltip

[6] SHARE
    [Export PNG]  [Copy shareable link]  [← Build a new tree]
```

---

## 7. Functional Requirements

### 7.1 Wizard Flow

| Step | Requirement |
|------|-------------|
| Business type | 7 preset cards with icons; "Other" triggers one Claude call for north star suggestions |
| North star | 3 pre-built lookup suggestions as pill buttons + free-text input |
| Lagging metric callout | On selection, inline tip explains in plain English why it's lagging |
| Question display | Pre-written template with `[metric]` interpolated; different phrasing for Q3 ("What ELSE...") |
| Metric naming | User types the name in a text field |
| AI naming button | "✨ Help me name this" fires one Claude call; hidden when API unavailable |
| Soft nudge | If user answer contains lagging metric keywords (revenue, churn, MRR, ARR, etc.), show non-blocking hint |
| Progress bar | Shows "X of 4 indicators unlocked" after each answer |
| Minimum depth | Wizard always runs all 4 questions — no early exit |
| Reveal | After Q4, full tree animates in with a celebration moment |

### 7.2 Ghost Node Mechanic

The tree is visible on screen throughout the wizard, building alongside the questions.

| State | What the user sees |
|---|---|
| After north star selected | Tree shows the north star node (coral) + one ghost node below it: `🔒 Answer Q1 to unlock` |
| After Q1 answered | Ghost unlocks into a named teal node; new ghost appears below it: `🔒 Answer Q2 to unlock` |
| After Q2 answered | Ghost unlocks into a named amber node; branch 1 is complete; new ghost appears at north star level: `🔒 Answer Q3 to unlock` |
| After Q3 answered | Ghost unlocks into second teal node; new ghost appears below it: `🔒 Answer Q4 to unlock` |
| After Q4 answered | Ghost unlocks; full tree celebration; no more ghosts |

Unlock animation: node fades from ghost style → coloured style with a scale "pop" + brief particle burst (lime `#95E06C`).

### 7.3 Soft Nudge for Vague / Lagging Answers

If the user's free-text answer matches a lagging metric pattern (keyword list: `revenue`, `mrr`, `arr`, `churn`, `nps`, `dau`, `mau`, `profit`, `sales`), show a non-blocking inline hint:

> ⚠️ This sounds like it might be a lagging metric — something you measure *after* the fact. Try thinking: what does a user need to *do* for [north star] to go up?

Two buttons: **[Got it, keep my answer]** / **[Let me rethink this]**. User can ignore and proceed.

Detection is purely client-side keyword matching — no AI call.

### 7.4 AI Integration (Optional, Capped)

Claude is only invoked in two scenarios:

| Trigger | When | Model | Max per session | Fallback |
|---|---|---|---|---|
| "✨ Help me name this" button | User clicks during metric naming | `claude-haiku-4-5` | 3 (shared cap) | Button hidden if API down |
| 'Other' business type north star | Auto-fires when user submits custom business type | `claude-haiku-4-5` | 1 (counts toward cap) | Show generic suggestions (Revenue, Active Users, NPS) |

**Session cap logic:** Counter stored in React state. Button is hidden (not greyed out) once cap is reached and when API is unavailable. The app renders identically whether Claude is available or not.

**API route:**
```
POST /api/name-metric
Body:    { businessType, northStar, userAnswer, level: "leading" | "behaviour" }
Returns: { metricName: string, unit: string }
Max response tokens: 60

POST /api/suggest-north-star
Body:    { customBusinessType: string }
Returns: { suggestions: [{ name: string, unit: string, whyLagging: string }] }
Max response tokens: 150
```

**Prompt design (both routes):**
```
System: You are a product management coach. Respond only in valid JSON.
        Be concise. Use plain English. No jargon.
        Business context: {businessType}
        North star metric: {northStar}

User:   [task-specific instruction]
```

### 7.5 Content Library (Authored Before Build Starts)

This is the core educational content. Must be complete before engineering sprint begins.

**a) North star suggestions by business type**

| Business Type | Suggestion 1 | Suggestion 2 | Suggestion 3 |
|---|---|---|---|
| SaaS | Monthly Recurring Revenue | Daily Active Users | Net Revenue Retention |
| E-commerce | Total Revenue | Repeat Purchase Rate | Average Order Value |
| Marketplace | Gross Merchandise Value | Buyer-to-Seller Ratio | Take Rate |
| Consumer App | DAU/MAU Ratio | D7 Retention | Sessions per User |
| Media/Content | Monthly Active Readers | Content Completion Rate | Subscriber Growth |
| Fintech | Assets Under Management | Transaction Volume | Activation Rate |
| Other | [Claude-generated] | [Claude-generated] | [Claude-generated] |

**b) Wizard question templates**

Level 2 (predicts north star):
- Q1: *"What behaviour, if it increased this week, would predict [north star] going up next month?"*
- Q3: *"What ELSE, if it increased this week, would predict [north star] going up next month?"*

Level 3 (predicts the leading indicator):
- Q2, Q4: *"Good. Now one level up — what behaviour, if it increased this week, would predict [Q1/Q3 metric] going up?"*

**c) Causal explanation pairs (~30 entries)**

Pre-generated with Claude offline, reviewed and edited by author, stored as static JSON in `content/explanations.ts`. Pattern-matched at render time (indicator name × north star name).

Example entries:

| Leading Indicator Pattern | North Star Pattern | Explanation |
|---|---|---|
| `/onboarding completion/i` | `/MRR\|revenue/i` | "Users who complete onboarding convert to paid at significantly higher rates — making this one of the strongest early signals for revenue growth." |
| `/day.?[27] retention/i` | `/DAU\|active users/i` | "Users who return on day 7 have crossed the habit threshold. This reliably predicts whether daily active usage will grow or plateau." |
| `/feature adoption/i` | `/NRR\|retention/i` | "Customers who adopt 3+ features churn at a fraction of the rate of single-feature users — making breadth of adoption a leading signal for revenue retention." |
| `/invite\|referral\|viral/i` | `/DAU\|growth/i` | "Each successful invite is a user vouching for your product. Word-of-mouth acquisition consistently produces the highest-quality, highest-retention new users." |

Generic fallback (used when no pattern matches):
> *"When [indicator] increases, it signals that users are getting more value from your product — which creates the conditions for [north star] to improve over the following weeks."*

### 7.6 Visual Metric Tree

| Property | Spec |
|---|---|
| Library | React Flow |
| Layout algorithm | Top-down (`dagre` layout) |
| Node: north star | Large, coral (`#FF6B6B`), 🎯 icon, bold metric name + unit |
| Node: level 2 leading | Medium, teal (`#4ECDC4`), metric name + unit |
| Node: level 3 behaviour | Small, amber (`#FFD166`), metric name + unit |
| Node: ghost / locked | Dark card with dashed border, lock icon, muted text |
| Edges | Animated dashed lines, directional arrows, label: "predicts ↑" |
| Hover | Shows causal explanation in a tooltip (from content library or generic fallback) |
| Unlock animation | Scale pop (1.0 → 1.15 → 1.0) + lime particle burst, 400ms |
| Zoom / pan | Enabled on desktop; disabled on mobile |
| Min indicators to show | Tree visible from step [3]; ghost node shown immediately after north star selection |

**Mobile fallback (<768px):**
```
  ┌─────────────────────┐
  │ 🎯 MRR              │  ← coral card
  │   └ Onboarding %    │  ← teal, indented
  │       └ Day-2 Out.  │  ← amber, more indented
  │   └ Feature Adopt.  │  ← teal
  │       └ Tooltip Cl. │  ← amber
  └─────────────────────┘
  "View full interactive tree on desktop →"
```

### 7.7 Export & Sharing

| Feature | Implementation |
|---|---|
| Copy shareable link | Serialise tree JSON → base64 → append as URL fragment `#state=...` |
| Export PNG | `html2canvas` client-side capture of the tree canvas |
| PDF | Not in v1 |
| Server storage | Not in v1 — no database, no backend persistence |

URL fragment approach means links work instantly with zero backend. Trade-off: URLs will be ~600–800 characters for a full 4-indicator tree. Acceptable for sharing via Slack/email; not great for Twitter.

---

## 8. Design & UX Direction

### 8.1 Colour Palette

| Role | Name | Hex |
|---|---|---|
| North star node / primary CTA | Coral | `#FF6B6B` |
| Level 2 leading indicator nodes | Teal | `#4ECDC4` |
| Level 3 behaviour nodes | Amber | `#FFD166` |
| Deep accent / highlights | Indigo-Purple | `#7B5EA7` |
| Unlock celebration particles | Lime | `#95E06C` |
| Page background | Warm near-black | `#1A1A2E` |
| Card / surface background | Dark card | `#16213E` |
| Primary text | Warm white | `#F5F0EB` |
| Secondary text / labels | Muted cream | `#B8B0A8` |
| Ghost / locked node border | Dashed muted | `#3A3A5C` |

No blue. No black. No grey corporate palette.

All text/background combinations must pass WCAG AA contrast (4.5:1 for body text, 3:1 for large text).

### 8.2 Typography

| Role | Font | Weight |
|---|---|---|
| Headlines | `Syne` (Google Fonts) | 700–800 |
| Body / UI | `DM Sans` | 400–500 |
| Metric names on tree nodes | `DM Mono` | 500 |

Load via `next/font` for performance. Subset to Latin only.

### 8.3 Interaction Principles

1. **One decision at a time** — Each screen presents a single input. No competing CTAs.
2. **The tree is always visible** — It updates live alongside the wizard. Progress is tangible, not abstract.
3. **Celebrate every unlock** — Particle burst + node pop animation + progress bar fill after every answer.
4. **Explain at the moment of relevance** — Concept callouts appear inline when the concept is first encountered, not on a theory screen upfront.
5. **Never leave the user stuck** — Every question includes a collapsed "Not sure? See an example →" accordion showing 2 example answers for that business type.
6. **Soft fail gracefully** — If Claude is unavailable, nothing breaks. The AI button simply disappears.

### 8.4 Key Screen Descriptions

**Welcome screen**
- Full-bleed dark background
- Animated three-node chain (behaviour → leading → lagging) using Framer Motion
- Each node labels itself with a short definition as it connects
- Headline: `"What drives your north star?"`
- Sub: `"Answer 4 questions. Unlock your metric tree."`
- Single coral CTA button

**Business type selector**
- 3-column card grid (2-column on mobile)
- Each card: large icon + label + 1-line description
- Selected state: coral border + subtle glow shadow
- No "Next" button — selecting auto-advances after 300ms

**North star screen**
- Question in large type at top
- 3 pill buttons (pre-built suggestions) in a row
- Free-text input below: placeholder `"e.g. Monthly Recurring Revenue"`
- On selection: grey callout appears below: `"This is a lagging metric — you only know it after the fact. Let's find what predicts it."`

**Unlock question screen (split layout on desktop)**
- Left panel: wizard question + text input + "✨ Help me name this" button + example accordion
- Right panel: live React Flow tree with ghost nodes
- Progress bar at top spanning both panels
- Submit button: `"Unlock this indicator →"` (coral)

**Tree reveal screen**
- Full-screen React Flow canvas
- Celebration animation on entry (nodes pop in sequentially)
- Floating action bar at top-right: [Export PNG] [Copy link]
- Bottom: `[← Build a new tree]` in muted text

---

## 9. Technical Architecture

### 9.1 Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | API routes for Claude; SSR for shareable tree URLs |
| Language | TypeScript | Type-safe content library and AI response schemas |
| Styling | Tailwind CSS v4 | Rapid custom design system, no runtime CSS |
| Animation | Framer Motion | Wizard transitions + unlock celebration animations |
| Tree visualisation | React Flow + `dagre` layout | Production-ready, touch-capable, top-down auto-layout |
| Fonts | `next/font` (Syne, DM Sans, DM Mono) | Zero layout shift, optimised subsetting |
| PNG export | `html2canvas` | Client-side, no server needed |
| AI (optional) | Claude API — `claude-haiku-4-5` | Cheapest, fastest model for single-field naming |
| Deployment | Vercel | Zero-config, auto-deploy from `main` |

### 9.2 Project Structure

```
/
├── app/
│   ├── page.tsx                  # Welcome screen
│   ├── wizard/
│   │   └── page.tsx              # Full wizard + live tree split layout
│   ├── tree/
│   │   └── page.tsx              # Full-screen tree reveal (reads from URL #state)
│   └── api/
│       ├── name-metric/route.ts  # Claude: name a metric from free-text answer
│       └── suggest-north-star/route.ts  # Claude: suggest north stars for 'Other'
├── components/
│   ├── wizard/
│   │   ├── BusinessTypeSelector.tsx
│   │   ├── NorthStarPicker.tsx
│   │   ├── UnlockQuestion.tsx
│   │   └── ProgressBar.tsx
│   ├── tree/
│   │   ├── MetricTree.tsx        # React Flow wrapper
│   │   ├── MetricNode.tsx        # Custom node component (coral/teal/amber/ghost)
│   │   └── TreeMobileFallback.tsx
│   └── ui/                       # Shared primitives (Button, Card, Tooltip, etc.)
├── content/
│   ├── northStarSuggestions.ts   # Lookup table: BusinessType → Metric[]
│   ├── wizardQuestions.ts        # Question templates per level/branch
│   ├── explanations.ts           # ~30 pre-written causal explanation pairs
│   └── laggingKeywords.ts        # Keyword list for soft nudge detection
├── lib/
│   ├── treeState.ts              # Serialise/deserialise tree to/from URL fragment
│   ├── explanationMatcher.ts     # Pattern-match indicator+northStar → explanation
│   └── claudeClient.ts           # Thin wrapper with session cap enforcement
└── types/
    └── index.ts                  # MetricTree, Metric, Indicator, Edge interfaces
```

### 9.3 Data Model

```typescript
type BusinessType =
  | "saas" | "ecommerce" | "marketplace"
  | "consumer" | "media" | "fintech" | "other"

interface MetricTree {
  id: string                  // nanoid, generated client-side
  businessType: BusinessType
  customBusinessType?: string // only if 'other'
  northStar: Metric
  indicators: Indicator[]     // ordered by unlock sequence
  createdAt: string           // ISO timestamp
}

interface Metric {
  id: string
  name: string                // "Onboarding Completion Rate"
  unit: string                // "% of new signups"
  type: "lagging" | "leading" | "behaviour"
}

interface Indicator extends Metric {
  userAnswer: string          // raw free-text from wizard
  causalExplanation: string   // from content library or generic fallback
  parentId: string            // north star id (level 2) or level-2 id (level 3)
  branch: 1 | 2               // which of the 2 branches
  level: 2 | 3                // depth in tree
  namedByAI: boolean          // did user click "Help me name this"?
}
```

### 9.4 URL State Encoding

```typescript
// lib/treeState.ts
export function encodeTree(tree: MetricTree): string {
  return btoa(JSON.stringify(tree))
}

export function decodeTree(fragment: string): MetricTree | null {
  try {
    return JSON.parse(atob(fragment))
  } catch {
    return null
  }
}

// Usage: window.location.hash = `#state=${encodeTree(tree)}`
// Share URL: https://metricmaster.app/tree#state=eyJpZCI6Ii4uLi4ifQ==
```

### 9.5 Claude Session Cap

```typescript
// lib/claudeClient.ts
const SESSION_CAP = 3
let callsUsed = 0

export function canCallClaude(): boolean {
  return callsUsed < SESSION_CAP
}

export async function callClaude(route: string, body: object): Promise<Response> {
  if (!canCallClaude()) throw new Error("Session cap reached")
  callsUsed++
  return fetch(route, { method: "POST", body: JSON.stringify(body) })
}
```

Cap is stored in module state (resets on page reload). No server-side enforcement needed — this is a free tool with no abuse incentive.

---

## 10. Content Authorship Plan

The content library must be completed **before** engineering begins. It is the core product.

| Asset | Volume | Method | Owner |
|---|---|---|---|
| North star suggestions | 6 business types × 3 suggestions = 18 entries | Written manually | Marc |
| Wizard question templates | 4 templates (Q1, Q2, Q3, Q4) | Written manually | Marc |
| Causal explanation pairs | ~30 entries | Claude batch generation → Marc review | Marc |
| Example answers per question | 2 per business type per question level = ~28 entries | Claude batch generation → Marc review | Marc |
| Lagging metric keyword list | ~15 keywords | Written manually | Marc |
| Generic fallback explanation | 1 template | Written manually | Marc |

**Batch generation prompt template for explanation pairs:**
```
For a [business type] business with [north star] as their north star metric,
write a 2-sentence plain-English explanation of why each of the following
leading indicators predicts the north star. Return as JSON array.
Indicators: [list]
```

---

## 11. Success Criteria

### Lagging Indicators (post-launch outcomes)

| Metric | Baseline | Target | Timeframe |
|---|---|---|---|
| Wizard completion rate | [measure at launch] | >60% of users who reach Step 3 complete all 4 questions | 60 days |
| Avg indicators unlocked per completed session | [measure at launch] | 4 (all 4, since it's fixed) — track via URL params having all nodes | 60 days |
| Trees exported or shared | [measure at launch] | >25% of completed sessions | 90 days |

> Note: No analytics instrumentation in v1. These will be measured via Vercel Analytics page-view proxies (e.g. `/tree` page views vs `/wizard` page views) or qualitative user feedback.

### Leading Indicators (pre-launch signals)

| Signal | Target | What It Predicts |
|---|---|---|
| Usability test: % reach tree reveal without facilitation | >80% in 5-user test | Completion rate at launch |
| Step 3 → Q1 drop-off in usability test | <30% | Wizard abandonment at scale |
| Claude API calls per session in beta | <1.5 avg | API cost sustainability at scale |
| Soft nudge dismissal rate | <20% of nudges dismissed as "keep my answer" | Whether the nudge is useful or annoying |

---

## 12. Dependencies & Risks

### Dependencies

| Dependency | Type | Status | Risk if delayed |
|---|---|---|---|
| Content library (30 explanation pairs, question templates) | Feature | Not started | Blocks all engineering — **Critical Path** |
| Anthropic Claude API key | External | Assumed available | "Help me name this" button unavailable — acceptable, app still works |
| React Flow (MIT licence) | External | Needs confirmation | Blocks tree component build |

### Risks & Mitigations

| Risk | Type | Impact | Mitigation |
|---|---|---|---|
| Users don't know how to answer the question | Usability | High | Collapsed example accordion per question; 2 examples per business type |
| Depth-first sequence feels confusing (Q2 asks about Q1's metric, not the north star) | Usability | High | Question phrasing explicitly references the prior metric by name; visual tree makes the chain clear |
| URL-encoded share links are too long for some platforms | Feasibility | Medium | Test at launch; if too long, add a short-link redirect layer in v2 using Vercel KV |
| Pre-written explanations don't match user's custom indicator | Value | Medium | Generic fallback explanation covers all cases; review library quarterly |
| Claude API unavailable at runtime | Feasibility | Low | AI button hidden silently; no regression in core flow |
| Dark palette reduces text legibility | Usability | Medium | Run WCAG AA contrast check on all text/background pairs before launch |
| Users build shallow trees by picking generic indicators | Value | Medium | Example accordion shows specific, non-generic answers to model good behaviour |

---

## 13. Phased Roadmap

### v1 — Core Wizard + Tree (confirmed scope)
- [ ] Welcome screen with animated explainer
- [ ] Business type selector (7 types, static)
- [ ] North star picker (lookup table + free-text + 'Other' Claude call)
- [ ] 4-question wizard (depth-first, pre-written templates)
- [ ] Ghost node mechanic (one at a time)
- [ ] Soft nudge for lagging metric answers
- [ ] "✨ Help me name this" button (Claude, ≤3/session)
- [ ] Pre-built content library (30 explanation pairs, examples)
- [ ] React Flow tree with unlock animations (desktop)
- [ ] Mobile card-list fallback
- [ ] PNG export + URL-encoded shareable link
- [ ] No auth, no database, no analytics

### v2 — Depth & Sharing
- [ ] Server-stored short links (Vercel KV) — cleaner share URLs
- [ ] Vercel Analytics + custom funnel events
- [ ] "Add another branch" post-wizard mini-wizard
- [ ] PDF export
- [ ] 3-branch option (6 questions) for users who want more depth

### v3 — Community & Templates
- [ ] Pre-built example trees by business type (public gallery)
- [ ] Account + saved trees (Clerk auth)
- [ ] Team sharing / workspaces
- [ ] Embed code for Notion/Confluence

---

## 14. Open Questions

| Question | Assumption | How to Validate | By When |
|---|---|---|---|
| Do users find depth-first sequencing intuitive? (Q2 asks about Q1's metric, not north star) | Visual tree + explicit phrasing makes it clear | Usability test with 5 junior PMs | Before engineering sprint 1 |
| Is 4 questions enough to feel "complete"? Or do users want more? | 4 is the right balance of depth and brevity | Post-session survey in beta ("Did you feel the tree captured your product?") | 30 days post-launch |
| Do example answers help or anchor users too narrowly to generic metrics? | Examples help more than they constrain | Compare tree quality (specificity of indicator names) between users who used examples vs didn't | 30 days post-launch |
| Will ~700-char share URLs cause problems on any major platform? | Acceptable for Slack/email; potentially truncated on Twitter | Manual test across Slack, email, LinkedIn, Twitter before launch | During QA |

---

## 15. Sign-off

| Role | Name | Approved |
|---|---|---|
| Product | Marc Abraham | ⬜ |
| Engineering | | ⬜ |
| Design | | ⬜ |

---

## Appendix A: Example Metric Tree (SaaS / MRR)

```
                    ┌─────────────────────┐
                    │  🎯 Monthly         │  ← NORTH STAR (coral)
                    │  Recurring Revenue  │    Lagging metric
                    └──────────┬──────────┘
                               │ predicts ↑
               ┌───────────────┴────────────────┐
               │                                │
    ┌──────────┴──────────┐          ┌──────────┴──────────┐
    │  Onboarding         │          │  Feature            │  ← LEADING (teal)
    │  Completion Rate    │          │  Adoption Rate      │    Level 2
    │  % of new signups   │          │  % using 3+ features│
    └──────────┬──────────┘          └──────────┬──────────┘
               │ predicts ↑                     │ predicts ↑
    ┌──────────┴──────────┐          ┌──────────┴──────────┐
    │  Day-2 Proactive    │          │  In-app Tooltip     │  ← BEHAVIOUR (amber)
    │  Outreach Rate      │          │  Click Rate         │    Level 3
    │  % contacted <48h   │          │  clicks/session     │
    └─────────────────────┘          └─────────────────────┘
```

---

## Appendix B: Example Wizard Session

**Business type:** SaaS
**North star:** Monthly Recurring Revenue (MRR)

---

**Q1:** *"What behaviour, if it increased this week, would predict MRR going up next month?"*

**User:** "If more new users actually finish setting up their account and connect their first integration"

**[✨ Help me name this] →** Claude returns: `"Onboarding Completion Rate"` / unit: `"% of new signups"`

**Explanation matched from library:** *"Users who complete onboarding convert to paid at significantly higher rates — making this one of the strongest early signals for revenue growth."*

---

**Q2:** *"Good. Now one level up — what behaviour, if it increased this week, would predict Onboarding Completion Rate going up?"*

**User:** "If our customer success team sends a personal check-in email in the first 48 hours"

**User types metric name:** "Day-2 Proactive Outreach Rate"

**Explanation (generic fallback):** *"When Day-2 Proactive Outreach Rate increases, it signals that users are getting timely support at a critical moment — which creates the conditions for Onboarding Completion Rate to improve over the following weeks."*

---

**Q3:** *"What ELSE, if it increased this week, would predict MRR going up next month?"*

**User:** "If users are actually exploring more than one feature in the product"

**User types metric name:** "Feature Adoption Rate"

**Explanation matched from library:** *"Customers who adopt 3+ features churn at a fraction of the rate of single-feature users — making breadth of adoption a leading signal for revenue retention."*

---

**Q4:** *"Good. Now one level up — what behaviour, if it increased this week, would predict Feature Adoption Rate going up?"*

**User:** "Clicking on the in-app tooltips that explain each feature"

**User types metric name:** "In-app Tooltip Click Rate"

**Explanation (generic fallback):** *"When In-app Tooltip Click Rate increases, it signals that users are actively exploring and learning the product — which creates the conditions for Feature Adoption Rate to improve over the following weeks."*

---

🎉 **Tree complete.** Four indicators unlocked across two causal chains.
