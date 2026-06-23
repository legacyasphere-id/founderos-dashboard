# FounderOS Dashboard

> AI-native operating system for founders. One cockpit. Full business state in under 10 seconds.

**Live**: (https://founderos-dashboard-cywjxjfrl-yoga-pratama-effendi-s-projects.vercel.app/)
**Stack**: Vue 3 + Supabase + n8n + OpenRouter + Vercel

---

## What This Is

FounderOS is not a CRM. Not a project management tool.

It's a **Founder Intelligence Cockpit** — a single dashboard where a founder can see urgent emails, hot leads, and their AI-generated daily briefing without opening 5 different tools.

Data flows in automatically:

```
Gmail / Tally / Webhooks → n8n → OpenRouter (AI) → Supabase → Dashboard
```

No manual data entry. No noise. Only signals that require founder attention.

---

## V0 — What's Live

| Module | Status |
|---|---|
| Executive Dashboard | ✅ Live |
| P1 Email Intelligence | ✅ Gmail → AI triage → Supabase |
| P2 Lead Intelligence | ✅ Tally form → AI scoring → Supabase |
| P3 Knowledge Capture | ✅ Webhook → AI extraction → Supabase |
| P4 Daily Briefing | ✅ Cron 07:00 WIB → AI briefing → Gmail + Supabase |

---

## Stack

- **Frontend**: Vue 3 (Composition API, `<script setup>`) + TailwindCSS via CDN
- **Database**: Supabase (PostgreSQL) — 4 tables: `email_intelligence`, `leads`, `knowledge_entries`, `briefings`
- **Automation**: n8n (4 workflows, cloud-hosted at n8n.cloud)
- **AI**: OpenRouter (multi-model, used inside n8n)
- **Deployment**: Vercel (auto-deploy from main branch)

---

## Architecture

```
External Sources → n8n → AI (OpenRouter) → Supabase ← Vue Dashboard
```

n8n and Vue never communicate directly. In V1, Laravel will sit between writes and reads for business logic, auth, and multi-user support.

---

## Local Setup

```bash
git clone https://github.com/legacyasphere-id/founderos-dashboard
cd founderos-dashboard
npm install
cp .env.example .env  # add your Supabase URL + anon key
npm run dev
```

---

## V1 Roadmap

- [ ] Vue Router (multi-page)
- [ ] Laravel backend API layer
- [ ] Projects Hub module
- [ ] Knowledge Vault module
- [ ] AI Executive Assistant (natural language queries over real business data)

---

Built by [Legacya Sphere](https://legacyasphere.id) — Systems for founders.
