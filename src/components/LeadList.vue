<template>
  <div class="bg-[#111] border border-[#1e1e1e] rounded-xl p-5 h-full">

    <!-- Section header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xs font-semibold tracking-[2px] uppercase text-[#555]">Lead Pipeline</h2>
      <span v-if="!loading" class="text-xs font-mono text-[#444]">{{ leads.length }} active</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="animate-pulse flex items-center gap-3">
        <div class="w-10 h-10 bg-[#1e1e1e] rounded-lg flex-shrink-0"></div>
        <div class="flex-1">
          <div class="h-3 bg-[#1a1a1a] rounded w-2/3 mb-2"></div>
          <div class="h-3 bg-[#161616] rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="leads.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
      <div class="text-2xl mb-2">○</div>
      <p class="text-[#555] text-sm">No active leads.</p>
      <p class="text-[#333] text-xs mt-1">Tally form submissions will appear here.</p>
    </div>

    <!-- Lead list -->
    <div v-else class="space-y-2">
      <div
        v-for="(lead, i) in leads"
        :key="i"
        class="border border-[#1e1e1e] rounded-lg p-3 bg-[#0d0d0d] hover:border-[#2a2a2a] transition-colors"
      >
        <div class="flex items-start gap-3">

          <!-- Score chip -->
          <div
            :class="scoreChipClass(lead.lead_score)"
            class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <span class="text-sm font-mono font-bold">{{ lead.lead_score }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <!-- Name + status -->
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-sm font-semibold text-[#e0e0e0] truncate">{{ lead.name }}</span>
              <span :class="statusClass(lead.lead_status)" class="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded flex-shrink-0">
                {{ lead.lead_status?.toUpperCase() }}
              </span>
            </div>

            <!-- Company -->
            <p v-if="lead.company" class="text-xs text-[#555] mb-1 truncate">{{ lead.company }}</p>

            <!-- Next action -->
            <p v-if="lead.recommended_action" class="text-xs text-[#666] leading-relaxed truncate">
              → {{ lead.recommended_action }}
            </p>
          </div>

          <!-- Time -->
          <span class="text-[10px] text-[#333] font-mono flex-shrink-0 mt-0.5">{{ timeAgo(lead.created_at) }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
defineProps({
  leads:   { type: Array,   default: () => [] },
  loading: { type: Boolean, default: false }
})

function scoreChipClass(score) {
  if (score >= 8) return 'bg-rose-500/20 text-rose-400'
  if (score >= 5) return 'bg-amber-500/20 text-amber-400'
  return 'bg-[#1e1e1e] text-[#555]'
}

function statusClass(status) {
  const map = {
    hot:          'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    warm:         'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    cold:         'bg-[#1e1e1e] text-[#444] border border-[#2a2a2a]',
    disqualified: 'bg-[#1a1a1a] text-[#333] border border-[#222]'
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
