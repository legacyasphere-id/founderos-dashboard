<template>
  <main class="relative min-h-screen overflow-hidden px-4 py-6 text-[#f5f0e9] sm:px-6 lg:px-8">
    <div class="pointer-events-none absolute left-1/2 top-[-160px] h-[320px] w-[620px] -translate-x-1/2 rounded-full bg-[#e0c58f]/20 blur-[90px]"></div>
    <div class="pointer-events-none absolute right-[-120px] top-36 h-[360px] w-[360px] rounded-full bg-[#3c5070]/30 blur-[110px]"></div>

    <section class="relative mx-auto max-w-7xl">
      <header class="mb-6 pt-4 text-center sm:mb-8 sm:pt-8">
        <p class="mb-3 font-mono text-[11px] uppercase tracking-[0.42em] text-[#d9c6c2]/55">
          FounderOS Command Center
        </p>
        <h1 class="mx-auto max-w-3xl text-4xl font-semibold leading-[0.98] text-[#f5f0e9] sm:text-5xl lg:text-6xl">
          Business state in <span class="text-[#e0c58f]">10 seconds</span>
        </h1>
        <p class="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#d9c6c2]/62">
          Urgent signals, active leads, and the daily CEO briefing in one automated founder cockpit.
        </p>
      </header>

      <nav class="mx-auto mb-5 flex max-w-6xl items-center justify-between gap-3 rounded-[2rem] border border-[#f5f0e9]/10 bg-[#050812]/45 p-2 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <div class="flex min-w-0 items-center gap-2">
          <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#e0c58f]/30 bg-[#112250]/70 font-mono text-sm font-semibold text-[#e0c58f]">
            FO
          </div>
          <div class="hidden items-center gap-1 sm:flex">
            <span class="rounded-full bg-[#e0c58f]/12 px-4 py-2 text-xs font-medium text-[#f5f0e9] gold-glow">Cockpit</span>
            <span class="rounded-full px-4 py-2 text-xs text-[#d9c6c2]/58">Emails</span>
            <span class="rounded-full px-4 py-2 text-xs text-[#d9c6c2]/58">Leads</span>
            <span class="rounded-full px-4 py-2 text-xs text-[#d9c6c2]/58">Briefing</span>
          </div>
        </div>

        <div class="hidden min-w-0 flex-1 justify-center px-2 md:flex">
          <div class="w-full max-w-sm rounded-full border border-[#f5f0e9]/10 bg-[#02040b]/45 px-4 py-2 text-left text-xs text-[#d9c6c2]/46">
            Current signals only
          </div>
        </div>

        <div class="flex items-center gap-2 text-right">
          <div class="hidden sm:block">
            <div class="text-xs text-[#d9c6c2]/70">{{ currentDate }}</div>
            <div class="font-mono text-[11px] text-[#e0c58f]/72">{{ currentTime }} WIB</div>
          </div>
          <div class="h-10 w-10 rounded-full border border-[#f5f0e9]/10 bg-[#3c5070]/20"></div>
        </div>
      </nav>

      <div v-if="error" class="mb-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-xl">
        {{ error }}
      </div>

      <section class="glass-panel rounded-[2rem] p-3 sm:p-4 lg:p-5">
        <div class="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
          <div class="glass-card rounded-[1.5rem] p-5 lg:col-span-6 lg:row-span-2">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-[#d9c6c2]/50">Total signal load</p>
                <div class="mt-2 flex items-end gap-3">
                  <span class="font-mono text-4xl font-semibold text-[#f5f0e9]">{{ loading ? '--' : totalSignalCount }}</span>
                  <span class="pb-1 text-sm text-[#e0c58f]">active signals</span>
                </div>
              </div>
              <span class="rounded-full border border-[#e0c58f]/20 bg-[#e0c58f]/10 px-3 py-1 font-mono text-[11px] text-[#e0c58f]">Live</span>
            </div>

            <div class="relative h-64 overflow-hidden rounded-[1.25rem] border border-[#f5f0e9]/10 bg-[#02040b]/42 p-4">
              <div class="absolute inset-x-4 bottom-10 flex h-40 items-end justify-between gap-3">
                <div
                  v-for="bar in signalBars"
                  :key="bar.label"
                  class="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    class="w-full rounded-t-2xl border border-[#f5f0e9]/10 bg-[#3c5070]/22"
                    :class="bar.active ? 'bg-[#e0c58f]/80 shadow-[0_0_40px_rgba(224,197,143,0.28)]' : ''"
                    :style="{ height: bar.height }"
                  ></div>
                  <span class="font-mono text-[10px] text-[#d9c6c2]/42">{{ bar.label }}</span>
                </div>
              </div>
              <div class="absolute bottom-5 left-5">
                <div class="font-mono text-3xl text-[#e0c58f]">{{ loading ? '--' : totalSignalCount }}</div>
                <p class="mt-1 max-w-[13rem] text-xs leading-5 text-[#d9c6c2]/55">Current signals from emails, leads, and briefing actions.</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 lg:col-span-6">
            <div class="glass-card rounded-[1.25rem] p-4">
              <p class="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d9c6c2]/46">Urgent</p>
              <div class="mt-3 font-mono text-3xl font-semibold" :class="urgentEmailCount > 0 ? 'text-[#f97316]' : 'text-[#d9c6c2]/30'">
                {{ loading ? '--' : urgentEmailCount }}
              </div>
              <p class="mt-1 text-xs text-[#d9c6c2]/48">emails</p>
            </div>
            <div class="glass-card rounded-[1.25rem] p-4">
              <p class="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d9c6c2]/46">Hot</p>
              <div class="mt-3 font-mono text-3xl font-semibold" :class="hotLeadCount > 0 ? 'text-[#f43f5e]' : 'text-[#d9c6c2]/30'">
                {{ loading ? '--' : hotLeadCount }}
              </div>
              <p class="mt-1 text-xs text-[#d9c6c2]/48">leads</p>
            </div>
            <div class="glass-card rounded-[1.25rem] p-4">
              <p class="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d9c6c2]/46">Action</p>
              <div class="mt-3 font-mono text-3xl font-semibold" :class="actionsNeeded > 0 ? 'text-[#e0c58f]' : 'text-[#d9c6c2]/30'">
                {{ loading ? '--' : actionsNeeded }}
              </div>
              <p class="mt-1 text-xs text-[#d9c6c2]/48">items</p>
            </div>
          </div>

          <div class="lg:col-span-3">
            <LeadList :leads="leads" :loading="loading" />
          </div>

          <div class="lg:col-span-3">
            <BriefingCard :briefing="briefing" :loading="loading" />
          </div>

          <div class="lg:col-span-6">
            <EmailList :emails="emails" :loading="loading" />
          </div>

          <div class="glass-card rounded-[1.5rem] p-5 lg:col-span-3">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-sm font-semibold text-[#f5f0e9]">Operating rhythm</h2>
              <span class="font-mono text-[11px] text-[#e0c58f]/75">07:00</span>
            </div>
            <div class="grid grid-cols-7 gap-2">
              <div
                v-for="day in rhythmDays"
                :key="day.label"
                class="flex flex-col items-center gap-2"
              >
                <span class="font-mono text-[10px] text-[#d9c6c2]/40">{{ day.label }}</span>
                <span
                  class="h-8 w-8 rounded-full border border-[#f5f0e9]/10"
                  :class="day.active ? 'bg-[#e0c58f] shadow-[0_0_34px_rgba(224,197,143,0.32)]' : 'bg-[#3c5070]/14'"
                ></span>
              </div>
            </div>
            <p class="mt-5 text-xs leading-5 text-[#d9c6c2]/55">Daily briefing runs every morning and turns business noise into priorities.</p>
          </div>

          <div class="glass-card rounded-[1.5rem] p-5 lg:col-span-3">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="text-sm font-semibold text-[#f5f0e9]">Signal sources</h2>
              <span class="rounded-full border border-[#e0c58f]/20 px-2 py-1 font-mono text-[10px] text-[#e0c58f]">n8n</span>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between rounded-2xl bg-[#02040b]/34 p-3">
                <span class="text-xs text-[#d9c6c2]/62">Gmail intelligence</span>
                <span class="font-mono text-xs text-[#f5f0e9]">{{ loading ? '--' : emails.length }}</span>
              </div>
              <div class="flex items-center justify-between rounded-2xl bg-[#02040b]/34 p-3">
                <span class="text-xs text-[#d9c6c2]/62">Lead pipeline</span>
                <span class="font-mono text-xs text-[#f5f0e9]">{{ loading ? '--' : leads.length }}</span>
              </div>
              <div class="flex items-center justify-between rounded-2xl bg-[#02040b]/34 p-3">
                <span class="text-xs text-[#d9c6c2]/62">CEO briefing</span>
                <span class="font-mono text-xs text-[#f5f0e9]">{{ briefing ? 'ready' : 'empty' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../services/supabase.js'
import EmailList from '../components/EmailList.vue'
import LeadList from '../components/LeadList.vue'
import BriefingCard from '../components/BriefingCard.vue'

const emails = ref([])
const leads = ref([])
const briefing = ref(null)
const loading = ref(true)
const error = ref(null)
const now = ref(new Date())
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

const signalBars = computed(() => {
  const values = [
    urgentEmailCount.value,
    hotLeadCount.value,
    actionsNeeded.value,
    totalSignalCount.value,
    Math.max(hotLeadCount.value, urgentEmailCount.value),
    actionsNeeded.value,
    totalSignalCount.value
  ]

  return values.map((value, index) => ({
    label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index],
    height: `${Math.min(92, 24 + value * 13)}%`,
    active: index === 3
  }))
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
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

async function fetchData() {
  loading.value = true
  error.value = null

  const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  const [emailRes, leadRes, briefingRes] = await Promise.all([
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
      .maybeSingle()
  ])

  const errors = []
  if (emailRes.error) errors.push(`Emails: ${emailRes.error.message}`)
  if (leadRes.error) errors.push(`Leads: ${leadRes.error.message}`)
  if (briefingRes.error) errors.push(`Briefing: ${briefingRes.error.message}`)

  error.value = errors.length ? errors.join(' | ') : null
  emails.value = emailRes.data || []
  leads.value = leadRes.data || []
  briefing.value = briefingRes.data || null
  loading.value = false
}

onMounted(() => {
  fetchData()
  clockTimer = setInterval(() => {
    now.value = new Date()
  }, 30000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>
