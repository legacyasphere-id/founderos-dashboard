<template>
  <section class="glass-card h-full rounded-[1.5rem] p-5">
    <div class="mb-5 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold text-[#f5f0e9]">CEO Briefing</h2>
        <p class="mt-1 text-xs text-[#d9c6c2]/45">AI-generated daily summary</p>
      </div>
      <span v-if="briefing" class="rounded-full border border-[#e0c58f]/20 px-3 py-1 font-mono text-[11px] text-[#e0c58f]">
        {{ timeAgo(briefing.created_at) }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="animate-pulse rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/30 p-4">
        <div class="mb-2 h-3 w-full rounded bg-[#3c5070]/25"></div>
        <div class="h-3 w-3/4 rounded bg-[#3c5070]/20"></div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!briefing" class="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/28 text-center">
      <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#e0c58f]/25 bg-[#e0c58f]/10 font-mono text-xs text-[#e0c58f]">
        07:00
      </div>
      <p class="text-sm text-[#f5f0e9]">No briefing yet.</p>
      <p class="mt-1 text-xs text-[#d9c6c2]/45">Runs daily at 07:00 WIB.</p>
    </div>

    <!-- Briefing content -->
    <div v-else class="space-y-3">
      <!-- Summary -->
      <div v-if="briefing.summary" class="rounded-2xl border border-[#e0c58f]/15 bg-[#e0c58f]/6 p-4">
        <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#e0c58f]/70">Summary</p>
        <p class="text-xs leading-5 text-[#d9c6c2]/78">{{ briefing.summary }}</p>
      </div>

      <!-- Action items -->
      <div v-if="actionItems.length > 0" class="rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/32 p-4">
        <p class="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#d9c6c2]/46">
          Action Items
          <span class="ml-2 rounded-full bg-[#e0c58f]/12 px-2 py-0.5 text-[#e0c58f]">{{ actionItems.length }}</span>
        </p>
        <ul class="space-y-2">
          <li
            v-for="(item, i) in actionItems"
            :key="i"
            class="flex items-start gap-2 text-xs text-[#d9c6c2]/65"
          >
            <span class="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#e0c58f]/60"></span>
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- Signals summary -->
      <div class="grid grid-cols-2 gap-2">
        <div class="rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/28 p-3 text-center">
          <div class="font-mono text-lg font-semibold" :class="urgentCount > 0 ? 'text-[#f97316]' : 'text-[#d9c6c2]/30'">
            {{ urgentCount }}
          </div>
          <p class="mt-1 text-[10px] text-[#d9c6c2]/40">urgent emails</p>
        </div>
        <div class="rounded-2xl border border-[#f5f0e9]/8 bg-[#02040b]/28 p-3 text-center">
          <div class="font-mono text-lg font-semibold" :class="hotCount > 0 ? 'text-[#f43f5e]' : 'text-[#d9c6c2]/30'">
            {{ hotCount }}
          </div>
          <p class="mt-1 text-[10px] text-[#d9c6c2]/40">hot leads</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  briefing: { type: Object, default: null },
  loading: { type: Boolean, default: false }
})

const actionItems = computed(() => {
  const items = props.briefing?.action_items
  if (!items) return []
  if (Array.isArray(items)) return items
  try { return JSON.parse(items) } catch { return [] }
})

const urgentCount = computed(() => {
  const val = props.briefing?.urgent_emails
  if (Array.isArray(val)) return val.length
  if (typeof val === 'number') return val
  return 0
})

const hotCount = computed(() => {
  const val = props.briefing?.hot_leads
  if (Array.isArray(val)) return val.length
  if (typeof val === 'number') return val
  return 0
})

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
