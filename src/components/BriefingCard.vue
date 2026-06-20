<template>
  <div class="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">

    <!-- Section header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xs font-semibold tracking-[2px] uppercase text-[#555]">CEO Briefing</h2>
      <span v-if="briefing && !loading" class="text-xs text-[#333] font-mono">{{ timeAgo(briefing.created_at) }}</span>
      <span v-else class="text-xs text-[#333] font-mono">daily · 07:00 WIB</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div class="animate-pulse">
        <div class="h-3 bg-[#1e1e1e] rounded w-1/4 mb-3"></div>
        <div class="h-4 bg-[#1a1a1a] rounded w-full mb-2"></div>
        <div class="h-4 bg-[#1a1a1a] rounded w-4/5 mb-2"></div>
        <div class="h-4 bg-[#1a1a1a] rounded w-3/4"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!briefing" class="py-6 text-center">
      <p class="text-[#444] text-sm">No briefing yet.</p>
      <p class="text-[#333] text-xs mt-1">P4 runs daily at 07:00 WIB and writes here automatically.</p>
    </div>

    <!-- Briefing content -->
    <div v-else class="space-y-4">

      <!-- Summary -->
      <p class="text-sm text-[#c0c0c0] leading-relaxed">{{ briefing.summary }}</p>

      <!-- Action items -->
      <div v-if="actionItems.length > 0">
        <p class="text-[10px] font-mono font-semibold tracking-[1.5px] text-[#444] uppercase mb-2">Top Actions</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div
            v-for="(item, i) in actionItems.slice(0, 3)"
            :key="i"
            class="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3"
          >
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-xs font-mono font-bold text-[#333]">0{{ i + 1 }}</span>
              <span :class="sourceBadge(item.source)" class="text-[9px] tracking-wider font-mono font-bold px-1.5 py-0.5 rounded">
                {{ item.source ? item.source.toUpperCase() : 'ACTION' }}
              </span>
            </div>
            <p class="text-xs text-[#c0c0c0] leading-snug">{{ item.text || item }}</p>
          </div>
        </div>
      </div>

      <!-- Signal counts -->
      <div class="flex gap-4 pt-1 border-t border-[#1a1a1a]">
        <span class="text-xs text-[#444]">
          <span class="text-[#f97316] font-mono font-semibold">{{ urgentEmailCount }}</span>
          <span class="ml-1">urgent emails</span>
        </span>
        <span class="text-xs text-[#444]">
          <span class="text-[#f43f5e] font-mono font-semibold">{{ hotLeadCount }}</span>
          <span class="ml-1">hot leads</span>
        </span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  briefing: { type: Object,  default: null },
  loading:  { type: Boolean, default: false }
})

const actionItems = computed(() => {
  const items = props.briefing?.action_items
  if (!items) return []
  if (Array.isArray(items)) return items
  try { return JSON.parse(items) } catch { return [] }
})

const urgentEmailCount = computed(() => {
  const e = props.briefing?.urgent_emails
  if (!e) return 0
  const arr = Array.isArray(e) ? e : tryParse(e, [])
  return arr.length
})

const hotLeadCount = computed(() => {
  const l = props.briefing?.hot_leads
  if (!l) return 0
  const arr = Array.isArray(l) ? l : tryParse(l, [])
  return arr.length
})

function tryParse(str, fallback) {
  try { return JSON.parse(str) } catch { return fallback }
}

function sourceBadge(source) {
  const map = {
    email: 'bg-orange-500/15 text-orange-500/70 border border-orange-500/20',
    lead:  'bg-rose-500/15 text-rose-500/70 border border-rose-500/20'
  }
  return map[source] || 'bg-indigo-500/15 text-indigo-500/70 border border-indigo-500/20'
}

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'today'
}
</script>
