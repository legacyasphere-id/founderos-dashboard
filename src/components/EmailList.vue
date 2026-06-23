<template>
  <section class="card h-full overflow-hidden">
    <div class="flex items-center justify-between gap-3 border-b border-[--border] bg-[#2A4D88]/6 px-4 py-3">
      <div>
        <h2 class="text-sm font-semibold text-[--accent]">Email Intelligence</h2>
        <p class="mt-0.5 text-xs text-[--text-muted]">Urgent and actionable inbox signals</p>
      </div>
      <span v-if="!loading" class="rounded-full border border-[#2A4D88]/25 bg-[#2A4D88]/8 px-3 py-1 font-mono text-[11px] text-[--accent]">
        {{ emails.length }} signal{{ emails.length !== 1 ? 's' : '' }}
      </span>
    </div>
    <div class="p-4">

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-xl border border-[--border] bg-[--bg] p-4">
        <div class="mb-3 h-3 w-24 rounded bg-[--surface-2]"></div>
        <div class="mb-2 h-4 w-3/4 rounded bg-[--surface-2]"></div>
        <div class="h-3 w-1/2 rounded bg-[--surface-2]"></div>
      </div>
    </div>

    <div v-else-if="emails.length === 0" class="flex min-h-40 flex-col items-center justify-center rounded-xl border border-[--border] bg-[--bg] text-center">
      <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#2A4D88]/25 bg-[#2A4D88]/10 font-mono text-[--accent]">
        OK
      </div>
      <p class="text-sm text-[--text-primary]">No urgent emails.</p>
      <p class="mt-1 text-xs text-[--text-muted]">Inbox is clear.</p>
    </div>

    <div v-else class="space-y-3">
      <article
        v-for="(email, i) in emails"
        :key="i"
        class="rounded-xl border border-[--border] bg-[--bg] p-4 transition duration-200 hover:border-[#2A4D88]/30 hover:bg-[--surface]"
        :class="email.thread_id ? 'cursor-pointer' : ''"
        @click="openEmail(email)"
      >
        <div class="mb-3 flex items-center justify-between gap-3">
          <span :class="urgencyClass(email.urgency_level)" class="rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]">
            {{ email.urgency_level || 'low' }}
          </span>
          <div class="flex items-center gap-2">
            <span class="font-mono text-[11px] text-[--text-muted]">{{ timeAgo(email.received_at) }}</span>
            <svg v-if="email.thread_id" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-[--text-muted]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </div>
        </div>

        <p class="mb-1 truncate text-sm font-semibold leading-tight text-[--text-primary]">
          {{ email.subject || '(no subject)' }}
        </p>

        <p class="mb-3 truncate text-xs text-[--text-muted]">
          from <span class="text-[--text-secondary]">{{ email.sender_name || 'Unknown sender' }}</span>
          <span v-if="email.email_category" class="ml-2 text-[--accent-2]">— {{ email.email_category }}</span>
        </p>

        <p v-if="email.recommended_response" class="border-l-2 border-[#2A4D88]/30 pl-3 text-xs leading-5 text-[--text-muted]">
          {{ email.recommended_response }}
        </p>

        <div v-if="parseActionItems(email.action_items).length > 0" class="mt-3">
          <span class="rounded-full bg-[#2A4D88]/10 px-2.5 py-1 font-mono text-[10px] text-[--accent]">
            {{ parseActionItems(email.action_items).length }} action{{ parseActionItems(email.action_items).length > 1 ? 's' : '' }}
          </span>
        </div>
      </article>
    </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  emails: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

function parseActionItems(items) {
  if (!items) return []
  if (Array.isArray(items)) return items
  try { return JSON.parse(items) } catch { return [] }
}

function openEmail(email) {
  const id = email.thread_id || email.message_id || email.gmail_thread_id
  if (id) {
    window.open(`https://mail.google.com/mail/u/0/#inbox/${id}`, '_blank')
  } else if (email.gmail_link) {
    window.open(email.gmail_link, '_blank')
  }
}

function urgencyClass(level) {
  const map = {
    critical: 'bg-red-50 text-red-700 border border-red-200',
    high: 'bg-orange-50 text-orange-700 border border-orange-200',
    medium: 'bg-blue-50 text-[--accent] border border-blue-200',
    low: 'bg-gray-50 text-gray-500 border border-gray-200'
  }
  return map[level] || map.low
}

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'just now'
}
</script>
