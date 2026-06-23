<template>
  <section class="card h-full overflow-hidden">
    <div class="flex items-center justify-between gap-3 border-b border-[--border] bg-[#2A4D88]/6 px-4 py-3">
      <div>
        <h2 class="text-sm font-semibold text-[--accent]">CRM Intelligence</h2>
        <p class="mt-0.5 text-xs text-[--text-muted]">Hot leads & client email signals</p>
      </div>
      <span v-if="!loading" class="font-mono text-[11px] text-[--accent]">{{ hotLeads.length + clientEmails.length }} signals</span>
    </div>
    <div class="p-4">

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="animate-pulse rounded-xl border border-[--border] bg-[--bg] p-3">
          <div class="flex items-center gap-3">
            <div class="h-10 w-1 rounded bg-[--surface-2]"></div>
            <div class="flex-1">
              <div class="mb-2 h-3 w-2/3 rounded bg-[--surface-2]"></div>
              <div class="h-3 w-1/2 rounded bg-[--surface-2]"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="hotLeads.length === 0 && clientEmails.length === 0" class="flex min-h-36 flex-col items-center justify-center rounded-xl border border-[--border] bg-[--bg] text-center">
        <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#2A4D88]/25 bg-[#2A4D88]/10 font-mono text-[--accent]">
          CRM
        </div>
        <p class="text-sm text-[--text-primary]">No active CRM signals.</p>
        <p class="mt-1 text-xs text-[--text-muted]">Hot leads and client emails appear here.</p>
      </div>

      <div v-else class="space-y-2">
        <div v-if="hotLeads.length > 0">
          <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[--text-muted]">Hot Leads</p>
          <article
            v-for="(lead, i) in hotLeads"
            :key="'lead-' + i"
            class="mb-2 flex items-start gap-3 overflow-hidden rounded-xl border bg-[--bg] p-3 transition duration-200 hover:bg-[--surface]"
            :class="getClientColor(lead.company).border"
          >
            <div
              class="mt-1 h-full w-1 flex-shrink-0 self-stretch rounded-full"
              :style="{ backgroundColor: getClientColor(lead.company).strip }"
            ></div>
            <div class="min-w-0 flex-1">
              <div class="mb-0.5 flex items-center gap-2">
                <span class="truncate text-sm font-semibold text-[--text-primary]">{{ lead.name || 'Unnamed' }}</span>
                <span class="flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
                  :class="getClientColor(lead.company).badge">
                  {{ lead.lead_score ?? '?' }}
                </span>
              </div>
              <p v-if="lead.company" class="truncate text-xs text-[--text-muted]">{{ lead.company }}</p>
              <p v-if="lead.recommended_action" class="mt-1 truncate text-xs text-[--text-secondary]">{{ lead.recommended_action }}</p>
            </div>
            <span class="mt-1 flex-shrink-0 font-mono text-[10px] text-[--text-muted]">{{ timeAgo(lead.created_at) }}</span>
          </article>
        </div>

        <div v-if="clientEmails.length > 0">
          <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[--text-muted]">Client Emails</p>
          <article
            v-for="(email, i) in clientEmails"
            :key="'email-' + i"
            class="mb-2 flex items-start gap-3 overflow-hidden rounded-xl border bg-[--bg] p-3 transition duration-200 hover:bg-[--surface]"
            :class="[getClientColor(email.sender_name).border, email.thread_id ? 'cursor-pointer' : '']"
            @click="openEmail(email)"
          >
            <div
              class="mt-1 h-full w-1 flex-shrink-0 self-stretch rounded-full"
              :style="{ backgroundColor: getClientColor(email.sender_name).strip }"
            ></div>
            <div class="min-w-0 flex-1">
              <div class="mb-0.5 flex items-center gap-2">
                <span class="truncate text-sm font-semibold text-[--text-primary]">{{ email.subject || '(no subject)' }}</span>
                <span class="flex-shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
                  :class="urgencyBadge(email.urgency_level)">
                  {{ email.urgency_level || 'low' }}
                </span>
              </div>
              <p class="truncate text-xs text-[--text-muted]">from <span class="text-[--text-secondary]">{{ email.sender_name }}</span></p>
              <p v-if="email.recommended_response" class="mt-1 truncate text-xs text-[--text-secondary]">{{ email.recommended_response }}</p>
            </div>
            <span class="mt-1 flex-shrink-0 font-mono text-[10px] text-[--text-muted]">{{ timeAgo(email.received_at) }}</span>
          </article>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { getClientColor } from '../config/clients.js'

const props = defineProps({
  leads: { type: Array, default: () => [] },
  emails: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const hotLeads = computed(() => props.leads.filter(l => l.lead_status === 'hot'))

const clientEmails = computed(() =>
  props.emails.filter(e => ['high', 'critical'].includes(e.urgency_level)).slice(0, 4)
)

function urgencyBadge(level) {
  const map = {
    critical: 'bg-red-50 text-red-700 border-red-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    medium: 'bg-blue-50 text-[--accent] border-blue-200',
    low: 'bg-gray-50 text-gray-500 border-gray-200'
  }
  return map[level] || map.low
}

function openEmail(email) {
  const id = email.thread_id || email.message_id || email.gmail_thread_id
  if (id) {
    window.open(`https://mail.google.com/mail/u/0/#inbox/${id}`, '_blank')
  } else if (email.gmail_link) {
    window.open(email.gmail_link, '_blank')
  }
}

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  const h = Math.floor(diff / 3600000)
  if (d > 0) return `${d}d`
  if (h > 0) return `${h}h`
  return 'now'
}
</script>
