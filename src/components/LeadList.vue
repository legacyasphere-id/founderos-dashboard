<template>
  <section class="glass-card h-full rounded-[1.5rem] p-5">
    <div class="mb-5 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold text-[#f5f0e9]">Lead Pipeline</h2>
        <p class="mt-1 text-xs text-[#d9c6c2]/45">Hot and warm uncontacted leads</p>
      </div>
      <span v-if="!loading" class="font-mono text-[11px] text-[#e0c58f]">{{ leads.length }} active</span>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/30 p-3">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-[#3c5070]/35"></div>
          <div class="flex-1">
            <div class="mb-2 h-3 w-2/3 rounded bg-[#3c5070]/25"></div>
            <div class="h-3 w-1/2 rounded bg-[#3c5070]/20"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="leads.length === 0" class="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/28 text-center">
      <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#e0c58f]/25 bg-[#e0c58f]/10 font-mono text-[#e0c58f]">
        0
      </div>
      <p class="text-sm text-[#f5f0e9]">No active leads.</p>
      <p class="mt-1 text-xs text-[#d9c6c2]/45">Tally form submissions will appear here.</p>
    </div>

    <div v-else class="space-y-3">
      <article
        v-for="(lead, i) in leads"
        :key="i"
        class="rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/32 p-3 transition duration-200 hover:border-[#e0c58f]/24 hover:bg-[#112250]/24"
      >
        <div class="flex items-start gap-3">
          <div
            :class="scoreChipClass(lead.lead_score)"
            class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border font-mono text-sm font-semibold"
          >
            {{ lead.lead_score ?? '-' }}
          </div>

          <div class="min-w-0 flex-1">
            <div class="mb-1 flex min-w-0 items-center gap-2">
              <span class="truncate text-sm font-semibold text-[#f5f0e9]">{{ lead.name || 'Unnamed lead' }}</span>
              <span :class="statusClass(lead.lead_status)" class="flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]">
                {{ lead.lead_status || 'cold' }}
              </span>
            </div>

            <p v-if="lead.company" class="mb-2 truncate text-xs text-[#d9c6c2]/45">{{ lead.company }}</p>
            <p v-if="lead.recommended_action" class="truncate text-xs leading-5 text-[#d9c6c2]/62">
              {{ lead.recommended_action }}
            </p>
          </div>

          <span class="mt-1 flex-shrink-0 font-mono text-[10px] text-[#d9c6c2]/35">{{ timeAgo(lead.created_at) }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  leads: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

function scoreChipClass(score) {
  if (score >= 8) return 'bg-[#f43f5e]/14 text-rose-100 border-[#f43f5e]/25'
  if (score >= 5) return 'bg-[#e0c58f]/14 text-[#e0c58f] border-[#e0c58f]/25'
  return 'bg-[#3c5070]/16 text-[#d9c6c2]/60 border-[#f5f0e9]/10'
}

function statusClass(status) {
  const map = {
    hot: 'bg-[#f43f5e]/14 text-rose-100 border border-[#f43f5e]/25',
    warm: 'bg-[#e0c58f]/14 text-[#e0c58f] border border-[#e0c58f]/25',
    cold: 'bg-[#3c5070]/16 text-[#d9c6c2]/55 border border-[#f5f0e9]/10',
    disqualified: 'bg-[#02040b]/35 text-[#d9c6c2]/35 border border-[#f5f0e9]/8'
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
