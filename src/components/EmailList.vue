<template>
  <section class="glass-card h-full rounded-[1.5rem] p-5">
    <div class="mb-5 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold text-[#f5f0e9]">Email Intelligence</h2>
        <p class="mt-1 text-xs text-[#d9c6c2]/45">Urgent and actionable inbox signals</p>
      </div>
      <span v-if="!loading" class="rounded-full border border-[#e0c58f]/20 px-3 py-1 font-mono text-[11px] text-[#e0c58f]">
        {{ emails.length }} signal{{ emails.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/30 p-4">
        <div class="mb-3 h-3 w-24 rounded bg-[#3c5070]/35"></div>
        <div class="mb-2 h-4 w-3/4 rounded bg-[#3c5070]/25"></div>
        <div class="h-3 w-1/2 rounded bg-[#3c5070]/20"></div>
      </div>
    </div>

    <div v-else-if="emails.length === 0" class="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/28 text-center">
      <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#e0c58f]/25 bg-[#e0c58f]/10 font-mono text-[#e0c58f]">
        OK
      </div>
      <p class="text-sm text-[#f5f0e9]">No urgent emails.</p>
      <p class="mt-1 text-xs text-[#d9c6c2]/45">Inbox is clear.</p>
    </div>

    <div v-else class="space-y-3">
      <article
        v-for="(email, i) in emails"
        :key="i"
        class="rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/32 p-4 transition duration-200 hover:border-[#e0c58f]/24 hover:bg-[#112250]/24"
      >
        <div class="mb-3 flex items-center justify-between gap-3">
          <span :class="urgencyClass(email.urgency_level)" class="rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]">
            {{ email.urgency_level || 'low' }}
          </span>
          <span class="font-mono text-[11px] text-[#d9c6c2]/42">{{ timeAgo(email.received_at) }}</span>
        </div>

        <p class="mb-1 truncate text-sm font-semibold leading-tight text-[#f5f0e9]">
          {{ email.subject || '(no subject)' }}
        </p>

        <p class="mb-3 truncate text-xs text-[#d9c6c2]/48">
          from <span class="text-[#d9c6c2]/78">{{ email.sender_name || 'Unknown sender' }}</span>
          <span v-if="email.email_category" class="ml-2 text-[#e0c58f]/55">- {{ email.email_category }}</span>
        </p>

        <p v-if="email.recommended_response" class="border-l border-[#e0c58f]/24 pl-3 text-xs leading-5 text-[#d9c6c2]/62">
          {{ email.recommended_response }}
        </p>

        <div v-if="email.action_items?.length > 0" class="mt-3">
          <span class="rounded-full bg-[#e0c58f]/10 px-2.5 py-1 font-mono text-[10px] text-[#e0c58f]">
            {{ email.action_items.length }} action{{ email.action_items.length > 1 ? 's' : '' }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  emails: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

function urgencyClass(level) {
  const map = {
    critical: 'bg-red-500/15 text-red-200 border border-red-400/25',
    high: 'bg-orange-500/15 text-orange-200 border border-orange-400/25',
    medium: 'bg-[#e0c58f]/12 text-[#e0c58f] border border-[#e0c58f]/20',
    low: 'bg-[#3c5070]/18 text-[#d9c6c2]/62 border border-[#f5f0e9]/10'
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
