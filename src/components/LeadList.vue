<template>
  <section class="card h-full overflow-hidden">
    <div class="flex items-center justify-between gap-3 border-b border-[--border] bg-[#2A4D88]/6 px-4 py-3">
      <div>
        <h2 class="text-sm font-semibold text-[--accent]">Lead Pipeline</h2>
        <p class="mt-0.5 text-xs text-[--text-muted]">Hot and warm uncontacted leads</p>
      </div>
      <span v-if="!loading" class="font-mono text-[11px] text-[--accent]">{{ leads.length }} active</span>
    </div>
    <div class="p-4">

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-xl border border-[--border] bg-[--bg] p-3">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-[--surface-2]"></div>
          <div class="flex-1">
            <div class="mb-2 h-3 w-2/3 rounded bg-[--surface-2]"></div>
            <div class="h-3 w-1/2 rounded bg-[--surface-2]"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="leads.length === 0" class="flex min-h-40 flex-col items-center justify-center rounded-xl border border-[--border] bg-[--bg] text-center">
      <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#2A4D88]/25 bg-[#2A4D88]/10 font-mono text-[--accent]">
        0
      </div>
      <p class="text-sm text-[--text-primary]">No active leads.</p>
      <p class="mt-1 text-xs text-[--text-muted]">Tally form submissions will appear here.</p>
    </div>

    <div v-else class="space-y-3">
      <article
        v-for="(lead, i) in leads"
        :key="i"
        class="rounded-xl border border-[--border] bg-[--bg] p-3 transition duration-200 hover:border-[#2A4D88]/30 hover:bg-[--surface]"
      >
        <div class="flex items-start gap-3">
          <div
            :class="scoreChipClass(lead.lead_score)"
            class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-semibold"
          >
            {{ lead.lead_score ?? '-' }}
          </div>

          <div class="min-w-0 flex-1">
            <div class="mb-1 flex min-w-0 items-center gap-2">
              <span class="truncate text-sm font-semibold text-[--text-primary]">{{ lead.name || 'Unnamed lead' }}</span>
              <span :class="statusClass(lead.lead_status)" class="flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]">
                {{ lead.lead_status || 'cold' }}
              </span>
            </div>

            <p v-if="lead.company" class="mb-2 truncate text-xs text-[--text-muted]">{{ lead.company }}</p>
            <p v-if="lead.recommended_action" class="truncate text-xs leading-5 text-[--text-secondary]">
              {{ lead.recommended_action }}
            </p>
          </div>

          <span class="mt-1 flex-shrink-0 font-mono text-[10px] text-[--text-muted]">{{ timeAgo(lead.created_at) }}</span>
        </div>
      </article>
    </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  leads: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

function scoreChipClass(score) {
  if (score >= 8) return 'bg-red-50 text-red-700 border-red-200'
  if (score >= 5) return 'bg-blue-50 text-[--accent] border-blue-200'
  return 'bg-gray-50 text-gray-500 border-gray-200'
}

function statusClass(status) {
  const map = {
    hot: 'bg-red-50 text-red-700 border border-red-200',
    warm: 'bg-blue-50 text-[--accent] border border-blue-200',
    cold: 'bg-gray-50 text-gray-500 border border-gray-200',
    disqualified: 'bg-gray-50 text-gray-400 border border-gray-100'
  }
  return map[status] || map.cold
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
