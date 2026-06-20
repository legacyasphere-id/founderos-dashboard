# FounderOS Dashboard — Claude Code Context

## What This Is
FounderOS is an AI-native operating system for founders. Not a CRM. Not a project management tool.
It is a **Founder Intelligence Cockpit** — one place to understand business state in under 10 seconds.

This repo (`founderos-dashboard`) is **Phase 3 — Development** of the V0 cockpit.
The V0 is a single read-only dashboard page. No auth redesign. No multi-page app.

---

## Build Methodology
This project follows **Sphere Method v2.1 (System Studio Framework)** by Legacya Sphere.

**Current phase: Phase 3 — COMPLETE ✓**
Exit criteria: Features complete, no console errors, CI passing.

Apply the Product Review Checklist before calling anything done:
- [x] UX: loading states, error states, empty states all present ✓
- [x] Performance: no N+1 queries, Supabase queries use `.select()` ✓
- [ ] AI: n/a for V0 frontend
- [x] Security: no secrets in client code beyond the Supabase anon key (which is safe for public by design) ✓

---

## Stack
- **Vue 3** — Composition API, `<script setup>` only. No Options API.
- **Vite** — build tool
- **TailwindCSS** — via CDN in `index.html` (V0 only, no PostCSS)
- **@supabase/supabase-js** — direct client reads

No Vue Router. No Pinia. No backend. No Laravel (V0 reads Supabase directly).

---

## Project Structure
```
src/
  pages/
    Dashboard.vue       ← single page, fetches all data
  components/
    BriefingCard.vue    ← synthesized top priorities
    LeadList.vue        ← hot/warm leads
    EmailList.vue       ← urgent + actionable emails
  services/
    supabase.js         ← client init
```

---

## Supabase
```
URL:      https://eqktmdyvftuuniqoxsgz.supabase.co
ANON_KEY: see src/services/supabase.js
```

Tables read by this dashboard:
- `email_intelligence` — urgent/actionable emails from P1 n8n workflow
- `leads` — scored leads from P2 n8n workflow
- `briefings` — daily CEO briefing from P4 n8n workflow (fields: id, created_at, summary, urgent_emails, hot_leads, action_items)

**If Supabase queries return empty with no error**, RLS is likely blocking the anon key.
Fix: enable Row Level Security with a policy that allows anon SELECT on both tables.

---

## What's Already Built
All files are written. The first job is:
1. `npm install`
2. `npm run dev` — confirm it runs at localhost:5173
3. Fix anything that breaks

---

## V0 Strict Scope (Do NOT add)
- ❌ Auth / login page
- ❌ Vue Router / multi-page
- ❌ Knowledge Vault UI
- ❌ Projects module
- ❌ Settings page
- ❌ Any form inputs or write operations
- ❌ Laravel backend

The only job is: **read data, display signals, look premium.**

---

## Design System (must stay consistent)
```
Background:   #080808
Card:         #111111, border #1e1e1e
Text primary: #f0f0f0
Text muted:   #666666
Critical:     #ef4444
High:         #f97316
Hot lead:     #f43f5e
Warm lead:    #f59e0b
Accent:       #6366f1
```

All components use Tailwind arbitrary values (`bg-[#080808]` etc).
Font: system-ui stack. Numbers: `font-mono`.

---

## System Thinking Questions (from Sphere Method)
Before adding any feature, ask:
- Does this help the founder make a decision faster?
- Does this add noise or signal?
- Can this wait for V1?

If any answer is "no / noise / yes it can wait" — don't build it.

---

> **Phase 4 (V1) is locked until 3-day stability window ends (started 2026-06-20). No new features before 2026-06-23.**
