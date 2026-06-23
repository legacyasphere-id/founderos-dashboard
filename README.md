# FounderOS Dashboard

> AI-native operating system for founders. One cockpit. Full business state in under 10 seconds.

**Live**: https://founderos-dashboard-tan.vercel.app
**Stack**: Vue 3 + Supabase + n8n + OpenRouter + Vercel
**Status**: V0 complete — stability window active until 2026-06-23

---

## What This Is

FounderOS is not a CRM. Not a project management tool.

It's a **Founder Intelligence Cockpit** — a single dashboard where a founder can see urgent emails, hot leads, and an AI-generated daily briefing without opening 5 different tools.

Data flows in automatically:

```
Gmail / Tally / Webhooks → n8n → OpenRouter (AI) → Supabase → Dashboard
```

No manual data entry. No noise. Only signals that require founder attention.

---

## What's Live (V0)

| Feature | Description |
|---|---|
| Email Intelligence | Urgent + actionable emails from Gmail, AI-triaged and scored |
| Lead Pipeline | Hot/warm leads from Tally forms, AI-qualified and scored |
| CEO Briefing | Daily AI summary generated every morning at 07:00 WIB |
| Live Clock | Real-time WIB clock in the nav |
| Gmail Deep Link | Click any email card to open the exact email in Gmail |

### Design
Dark glassmorphism — navy `#050812` base, gold `#e0c58f` accents, cream `#f5f0e9` text. Glass-panel blur layout.

---

## Data Pipelines (n8n)

| ID | Workflow | Trigger | Destination |
|---|---|---|---|
| P1 | Email Intelligence | Gmail poll (every 15 min) | `email_intelligence` table |
| P2 | Lead Intelligence | Tally form webhook | `leads` table |
| P3 | Knowledge Capture | HTTP webhook | `knowledge_entries` table |
| P4 | Daily Founder Briefing | Cron 07:00 WIB | `briefings` table + Gmail |

All 4 pipelines validated end-to-end ✅

---

## Architecture

```
External Sources → n8n → AI (OpenRouter) → Supabase ← Vue Dashboard
```

n8n and Vue **never** communicate directly. Laravel (V1) will sit between n8n writes and Vue reads for business logic, auth, and writes.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vue 3 (Composition API, script setup), TailwindCSS |
| Database | Supabase (PostgreSQL) |
| Automation | n8n cloud |
| AI | OpenRouter (multi-model) |
| Deployment | Vercel (Hobby) |
| Testing | Playwright (smoke suite in tests/dashboard.spec.js) |
| Backend (V1) | Laravel — planned |

---

## Branch Structure

| Branch | Purpose |
|---|---|
| claude/founderos-project-context-bl5api | Base branch — V0 foundation |
| claude/session-branch-a1foih | Latest — glassmorphism redesign + Gmail deeplink + bug fixes + Playwright |

---

## V1 Roadmap (after 2026-06-23)

- Projects Hub — active projects, milestones, AI health summary
- Knowledge Vault — search + browse SOPs, meeting notes, ideas
- AI Executive Assistant — ask questions, get answers from real business data
- Vue Router — multi-page navigation
- Laravel API layer — before auth, writes, or multi-user features

---

## Local Dev

```bash
cd founderos-dashboard
npm install
npm run dev
```

## Tests

```bash
npx playwright test
```

Runs against the live Vercel URL — no local env setup needed.
