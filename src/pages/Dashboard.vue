<template>
  <main class="min-h-screen bg-[--bg] px-4 py-4 text-[--text-primary] sm:px-6 lg:px-8">
    <section class="relative mx-auto max-w-7xl">

      <header class="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#162d5a] via-[#2A4D88] to-[#3a6099] px-6 pb-8 pt-6 text-center shadow-md">
        <div class="logo-container mx-auto mb-5 h-16 w-16">
          <img src="/logo.svg" alt="Legacya Sphere" class="logo-rotate h-full w-full" />
        </div>
        <h1 class="text-3xl font-semibold text-white sm:text-4xl">{{ greeting }}</h1>
        <p class="mx-auto mt-3 max-w-xl text-sm text-blue-100/75">{{ greetingSubtitle }}</p>
      </header>

      <nav class="mx-auto mb-4 flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-[--border] bg-[--surface] px-3 py-2 shadow-sm">
        <div class="flex min-w-0 items-center gap-2">
          <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#2A4D88] font-mono text-sm font-semibold text-white shadow-sm">
            FO
          </div>
          <div class="hidden items-center gap-1 sm:flex">
            <button
              @click="setTab('cockpit')"
              :class="activeTab === 'cockpit' ? 'bg-[#2A4D88] text-white shadow-sm' : 'text-[--text-muted] hover:text-[--text-primary]'"
              class="rounded-full px-4 py-1.5 text-xs transition"
            >Cockpit</button>
            <button
              @click="setTab('intelligence')"
              :class="activeTab === 'intelligence' ? 'bg-[#2A4D88] text-white shadow-sm' : 'text-[--text-muted] hover:text-[--text-primary]'"
              class="rounded-full px-4 py-1.5 text-xs transition"
            >Intelligence</button>
            <button
              @click="setTab('crm')"
              :class="activeTab === 'crm' ? 'bg-[#2A4D88] text-white shadow-sm' : 'text-[--text-muted] hover:text-[--text-primary]'"
              class="rounded-full px-4 py-1.5 text-xs transition"
            >CRM</button>
            <button
              @click="setTab('emails')"
              :class="activeTab === 'emails' ? 'bg-[#2A4D88] text-white shadow-sm' : 'text-[--text-muted] hover:text-[--text-primary]'"
              class="rounded-full px-4 py-1.5 text-xs transition"
            >Emails</button>
            <button
              @click="setTab('leads')"
              :class="activeTab === 'leads' ? 'bg-[#2A4D88] text-white shadow-sm' : 'text-[--text-muted] hover:text-[--text-primary]'"
              class="rounded-full px-4 py-1.5 text-xs transition"
            >Leads</button>
            <button
              @click="setTab('projects')"
              :class="activeTab === 'projects' ? 'bg-[#2A4D88] text-white shadow-sm' : 'text-[--text-muted] hover:text-[--text-primary]'"
              class="rounded-full px-4 py-1.5 text-xs transition"
            >Projects</button>
          </div>
        </div>

        <div class="hidden min-w-0 flex-1 items-center justify-center gap-2 px-2 md:flex">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search emails, leads, briefing..."
            class="w-full max-w-sm rounded-full border border-[--border] bg-[--bg] px-4 py-1.5 text-xs text-[--text-primary] outline-none transition focus:border-[#2A4D88]/50 placeholder:text-[--text-muted]"
          />
          <span v-if="searchQuery.trim()" class="flex-shrink-0 rounded-full bg-[#2A4D88]/10 px-2.5 py-1 font-mono text-[10px] text-[--accent]">
            {{ filteredEmails.length + filteredLeads.length }} results
          </span>
        </div>

        <div class="flex items-center gap-2 text-right">
          <div class="hidden sm:block">
            <div class="text-xs text-[--text-muted]">{{ currentDate }}</div>
            <div class="font-mono text-[11px] text-[--accent]">{{ currentTime }} WIB</div>
          </div>
          <div class="h-9 w-9 rounded-full border border-[--border] bg-[--surface-2]"></div>
        </div>
      </nav>

      <div v-if="error" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ error }}
      </div>

      <div v-if="lastUpdatedLabel" class="mb-3 text-right font-mono text-[10px] text-[--text-muted]">
        Last sync: {{ lastUpdatedLabel }}
      </div>

      <div class="grid grid-cols-1 gap-3 lg:grid-cols-12">

        <!-- Row 1: Intelligence strip (12) -->
        <div ref="briefingRef" class="lg:col-span-12">
          <BriefingCard :briefing="briefing" :loading="loading" compact />
        </div>

        <!-- Row 2: CRM Intelligence (6) + Project Intelligence (6) -->
        <div ref="crmRef" class="lg:col-span-6">
          <CRMPanel :leads="leads" :emails="emails" :loading="loading" />
        </div>
        <div ref="projectsRef" class="lg:col-span-6">
          <ProjectPanel :projects="projects" :loading="loading" />
        </div>

        <!-- Row 3: Stats (4+4+4) -->
        <div class="card overflow-hidden border-l-4 border-l-[#C0392B] p-4 lg:col-span-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.22em] text-[--text-muted]">Urgent</p>
          <div class="mt-2 font-mono text-3xl font-semibold" :class="urgentEmailCount > 0 ? 'text-[--critical]' : 'text-[--text-muted]'">
            {{ loading ? '--' : urgentEmailCount }}
          </div>
          <p class="mt-1 text-xs text-[--text-muted]">emails</p>
        </div>
        <div class="card overflow-hidden border-l-4 border-l-[#A93226] p-4 lg:col-span-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.22em] text-[--text-muted]">Hot</p>
          <div class="mt-2 font-mono text-3xl font-semibold" :class="hotLeadCount > 0 ? 'text-[--hot]' : 'text-[--text-muted]'">
            {{ loading ? '--' : hotLeadCount }}
          </div>
          <p class="mt-1 text-xs text-[--text-muted]">leads</p>
        </div>
        <div class="card overflow-hidden border-l-4 border-l-[#2A4D88] p-4 lg:col-span-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.22em] text-[--text-muted]">Action</p>
          <div class="mt-2 font-mono text-3xl font-semibold" :class="actionsNeeded > 0 ? 'text-[--accent]' : 'text-[--text-muted]'">
            {{ loading ? '--' : actionsNeeded }}
          </div>
          <p class="mt-1 text-xs text-[--text-muted]">items</p>
        </div>

        <!-- Row 4: Emails (7) + Leads (5) -->
        <div ref="emailsRef" class="lg:col-span-7">
          <EmailList :emails="filteredEmails" :loading="loading" />
        </div>
        <div ref="leadsRef" class="lg:col-span-5">
          <LeadList :leads="filteredLeads" :loading="loading" />
        </div>

        <!-- Row 5: Operating Rhythm (6) + Signal Sources (6) -->
        <div class="card p-4 lg:col-span-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-[--text-primary]">Operating Rhythm</h2>
            <span class="font-mono text-[11px] text-[--text-muted]">07:00</span>
          </div>
          <div class="grid grid-cols-7 gap-2">
            <div v-for="day in rhythmDays" :key="day.label" class="flex flex-col items-center gap-2">
              <span class="font-mono text-[10px] text-[--text-muted]">{{ day.label }}</span>
              <span
                class="h-8 w-8 rounded-full border border-[--border]"
                :class="day.active ? 'bg-[#2A4D88]' : 'bg-[--surface-2]'"
              ></span>
            </div>
          </div>
          <p class="mt-4 text-xs leading-5 text-[--text-muted]">Daily briefing runs every morning and turns business noise into priorities.</p>
        </div>

        <div class="card p-4 lg:col-span-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-[--text-primary]">Signal Sources</h2>
            <span class="rounded-full border border-[#2A4D88]/25 px-2 py-1 font-mono text-[10px] text-[--accent]">n8n</span>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between rounded-xl bg-[--bg] p-3">
              <span class="text-xs text-[--text-secondary]">Gmail intelligence</span>
              <span class="font-mono text-xs text-[--text-primary]">{{ loading ? '--' : emails.length }}</span>
            </div>
            <div class="flex items-center justify-between rounded-xl bg-[--bg] p-3">
              <span class="text-xs text-[--text-secondary]">Lead pipeline</span>
              <span class="font-mono text-xs text-[--text-primary]">{{ loading ? '--' : leads.length }}</span>
            </div>
            <div class="flex items-center justify-between rounded-xl bg-[--bg] p-3">
              <span class="text-xs text-[--text-secondary]">CEO briefing</span>
              <span class="font-mono text-xs text-[--text-primary]">{{ briefing ? 'ready' : 'empty' }}</span>
            </div>
            <div class="flex items-center justify-between rounded-xl bg-[--bg] p-3">
              <span class="text-xs text-[--text-secondary]">Active projects</span>
              <span class="font-mono text-xs text-[--text-primary]">{{ loading ? '--' : projects.length }}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../services/supabase.js'
import EmailList from '../components/EmailList.vue'
import LeadList from '../components/LeadList.vue'
import BriefingCard from '../components/BriefingCard.vue'
import CRMPanel from '../components/CRMPanel.vue'
import ProjectPanel from '../components/ProjectPanel.vue'

const emails = ref([])
const leads = ref([])
const briefing = ref(null)
const projects = ref([])
const loading = ref(true)
const error = ref(null)
const now = ref(new Date())
const activeTab = ref('cockpit')
const searchQuery = ref('')
const lastUpdated = ref(null)
const briefingRef = ref(null)
const emailsRef = ref(null)
const leadsRef = ref(null)
const crmRef = ref(null)
const projectsRef = ref(null)
let clockTimer = null

const urgentEmailCount = computed(() =>
  emails.value.filter(e => ['high', 'critical'].includes(e.urgency_level)).length
)

const hotLeadCount = computed(() =>
  leads.value.filter(l => l.lead_status === 'hot').length
)

const actionsNeeded = computed(() => {
  const items = briefing.value?.action_items
  if (!items) return 0
  const arr = Array.isArray(items) ? items : tryParse(items, [])
  return arr.length
})

const totalSignalCount = computed(() =>
  urgentEmailCount.value + hotLeadCount.value + actionsNeeded.value
)

const greeting = computed(() => {
  const h = parseInt(now.value.toLocaleString('en-US', {
    hour: 'numeric', hour12: false, timeZone: 'Asia/Jakarta'
  }))
  if (h >= 5 && h < 12) return 'Good Morning, Yoga.'
  if (h >= 12 && h < 17) return 'Good Afternoon, Yoga.'
  if (h >= 17 && h < 21) return 'Good Evening, Yoga.'
  return 'Good Night, Yoga.'
})

const greetingSubtitle = computed(() => {
  if (loading.value) return 'Loading your business briefing...'
  if (urgentEmailCount.value > 0 || hotLeadCount.value > 0) {
    return `You have ${urgentEmailCount.value} urgent email${urgentEmailCount.value !== 1 ? 's' : ''}, ${hotLeadCount.value} hot lead${hotLeadCount.value !== 1 ? 's' : ''}, and ${actionsNeeded.value} recommended action${actionsNeeded.value !== 1 ? 's' : ''} today.`
  }
  return "Here's your latest business summary."
})

const filteredEmails = computed(() => {
  if (!searchQuery.value.trim()) return emails.value
  const q = searchQuery.value.toLowerCase()
  return emails.value.filter(e =>
    e.subject?.toLowerCase().includes(q) ||
    e.sender_name?.toLowerCase().includes(q) ||
    e.recommended_response?.toLowerCase().includes(q)
  )
})

const filteredLeads = computed(() => {
  if (!searchQuery.value.trim()) return leads.value
  const q = searchQuery.value.toLowerCase()
  return leads.value.filter(l =>
    l.name?.toLowerCase().includes(q) ||
    l.company?.toLowerCase().includes(q) ||
    l.qualification_summary?.toLowerCase().includes(q)
  )
})

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return null
  return lastUpdated.value.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
  }) + ' WIB'
})

const rhythmDays = computed(() => {
  const day = now.value.getDay()
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => ({
    label,
    active: index === day - 1 || (day === 0 && index === 6)
  }))
})

const currentDate = computed(() =>
  now.value.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  })
)

const currentTime = computed(() =>
  now.value.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  })
)

function tryParse(str, fallback) {
  try { return JSON.parse(str) } catch { return fallback }
}

function scrollToSection(sectionRef) {
  sectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function setTab(tab) {
  activeTab.value = tab
  if (tab === 'intelligence') scrollToSection(briefingRef)
  else if (tab === 'crm') scrollToSection(crmRef)
  else if (tab === 'emails') scrollToSection(emailsRef)
  else if (tab === 'leads') scrollToSection(leadsRef)
  else if (tab === 'projects') scrollToSection(projectsRef)
}

async function fetchData() {
  loading.value = true
  error.value = null

  const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  const [emailRes, leadRes, briefingRes, projectRes] = await Promise.all([
    supabase
      .from('email_intelligence')
      .select('subject, sender_name, urgency_level, urgency_score, action_required, action_items, recommended_response, received_at, email_category, thread_id')
      .or('urgency_level.in.(high,critical),action_required.eq.true')
      .gte('received_at', since48h)
      .order('urgency_score', { ascending: false })
      .limit(10),

    supabase
      .from('leads')
      .select('name, company, lead_score, lead_status, qualification_summary, recommended_action, urgency_level, created_at')
      .in('lead_status', ['hot', 'warm'])
      .eq('is_contacted', false)
      .order('lead_score', { ascending: false })
      .limit(10),

    supabase
      .from('briefings')
      .select('id, created_at, summary, urgent_emails, hot_leads, action_items')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from('projects')
      .select('id, name, client, status, progress, next_action, blocker, due_date, updated_at')
      .in('status', ['active', 'at_risk', 'blocked'])
      .order('updated_at', { ascending: false })
      .limit(10)
  ])

  const errors = []
  if (emailRes.error) errors.push(`Emails: ${emailRes.error.message}`)
  if (leadRes.error) errors.push(`Leads: ${leadRes.error.message}`)
  if (briefingRes.error) errors.push(`Briefing: ${briefingRes.error.message}`)
  if (projectRes.error) errors.push(`Projects: ${projectRes.error.message}`)

  error.value = errors.length ? errors.join(' | ') : null
  emails.value = emailRes.data || []
  leads.value = leadRes.data || []
  briefing.value = briefingRes.data || null
  projects.value = projectRes.data || []
  lastUpdated.value = new Date()
  loading.value = false
}

onMounted(() => {
  fetchData()
  clockTimer = setInterval(() => { now.value = new Date() }, 30000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>
