<template>
  <div class="min-h-screen bg-[#080808] px-6 py-8 max-w-7xl mx-auto">

    <!-- Header -->
    <header class="flex items-center justify-between mb-8">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
          <span class="text-xs text-[#555] tracking-[3px] uppercase font-mono">FounderOS</span>
        </div>
        <h1 class="text-2xl font-semibold text-[#f0f0f0] mt-1">Founder Cockpit</h1>
      </div>
      <div class="text-right">
        <div class="text-sm text-[#888]">{{ currentDate }}</div>
        <div class="text-xs text-[#444] mt-0.5 font-mono">{{ currentTime }} WIB</div>
      </div>
    </header>

    <!-- Error banner -->
    <div v-if="error" class="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
      {{ error }}
    </div>

    <!-- Stats bar -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
        <div class="text-3xl font-mono font-bold" :class="urgentEmailCount > 0 ? 'text-orange-400' : 'text-[#333]'">
          {{ loading ? '—' : urgentEmailCount }}
        </div>
        <div class="text-xs text-[#555] mt-1 uppercase tracking-wider">Urgent Emails</div>
      </div>
      <div class="bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
        <div class="text-3xl font-mono font-bold" :class="hotLeadCount > 0 ? 'text-rose-400' : 'text-[#333]'">
          {{ loading ? '—' : hotLeadCount }}
        </div>
        <div class="text-xs text-[#555] mt-1 uppercase tracking-wider">Hot Leads</div>
      </div>
      <div class="bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
        <div class="text-3xl font-mono font-bold" :class="actionsNeeded > 0 ? 'text-indigo-400' : 'text-[#333]'">
          {{ loading ? '—' : actionsNeeded }}
        </div>
        <div class="text-xs text-[#555] mt-1 uppercase tracking-wider">Actions Needed</div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-5 gap-4 mb-4">
      <!-- Email Intelligence — primary panel (3/5 width) -->
      <div class="col-span-3">
        <EmailList :emails="emails" :loading="loading" />
      </div>
      <!-- Hot Leads (2/5 width) -->
      <div class="col-span-2">
        <LeadList :leads="leads" :loading="loading" />
      </div>
    </div>

    <!-- CEO Briefing — full width bottom (source: Supabase briefings table, written by P4) -->
    <BriefingCard :briefing="briefing" :loading="loading" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase.js'
import EmailList from '../components/EmailList.vue'
import LeadList from '../components/LeadList.vue'
import BriefingCard from '../components/BriefingCard.vue'

const emails   = ref([])
const leads    = ref([])
const briefing = ref(null)
const loading  = ref(true)
const error    = ref(null)

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

function tryParse(str, fallback) {
  try { return JSON.parse(str) } catch { return fallback }
}

const now = new Date()
const currentDate = now.toLocaleDateString('id-ID', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  timeZone: 'Asia/Jakarta'
})
const currentTime = now.toLocaleTimeString('id-ID', {
  hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
})

async function fetchData() {
  loading.value = true
  error.value   = null

  const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  const [emailRes, leadRes, briefingRes] = await Promise.all([
    supabase
      .from('email_intelligence')
      .select('subject, sender_name, urgency_level, urgency_score, action_required, action_items, recommended_response, received_at, email_category')
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

  if (emailRes.error)    { error.value = `Emails: ${emailRes.error.message}`;      loading.value = false; return }
  if (leadRes.error)     { error.value = `Leads: ${leadRes.error.message}`;        loading.value = false; return }
  if (briefingRes.error) { error.value = `Briefing: ${briefingRes.error.message}`; loading.value = false; return }

  emails.value   = emailRes.data    || []
  leads.value    = leadRes.data     || []
  briefing.value = briefingRes.data || null
  loading.value  = false
}

onMounted(fetchData)
</script>
