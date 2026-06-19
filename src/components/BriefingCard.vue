<template>
  <div class="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">

    <!-- Section header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xs font-semibold tracking-[2px] uppercase text-[#555]">Today's Priorities</h2>
      <span class="text-xs text-[#333] font-mono">synthesized</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex gap-4">
      <div v-for="i in 3" :key="i" class="flex-1 animate-pulse">
        <div class="h-3 bg-[#1e1e1e] rounded w-1/4 mb-2"></div>
        <div class="h-4 bg-[#1a1a1a] rounded w-full mb-1"></div>
        <div class="h-3 bg-[#161616] rounded w-3/4"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="topActions.length === 0" class="py-6 text-center">
      <p class="text-[#444] text-sm">Briefing will appear after data flows in.</p>
      <p class="text-[#333] text-xs mt-1">P1 polls Gmail every 5 min · P2 fires on Tally submissions</p>
    </div>

    <!-- Actions grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div
        v-for="(action, i) in topActions"
        :key="i"
        class="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-mono font-bold text-[#333]">0{{ i + 1 }}</span>
          <span :class="priorityBadge(action.source)" class="text-[9px] tracking-wider font-mono font-bold px-1.5 py-0.5 rounded">
            {{ action.source === 'email' ? 'EMAIL' : 'LEAD' }}
          </span>
        </div>
        <p class="text-sm text-[#d0d0d0] leading-snug">{{ action.text }}</p>
        <p v-if="action.context" class="text-xs text-[#444] mt-1 truncate">{{ action.context }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  emails:  { type: Array,   default: () => [] },
  leads:   { type: Boolean, default: () => [] },
  loading: { type: Boolean, default: false }
})

const topActions = computed(() => {
  const actions = []

  // Pull from urgent emails first
  const urgentEmails = [...props.emails]
    .sort((a, b) => (b.urgency_score || 0) - (a.urgency_score || 0))

  for (const e of urgentEmails) {
    if (e.recommended_response) {
      actions.push({
        source:  'email',
        text:    e.recommended_response,
        context: `Re: ${e.subject} — from ${e.sender_name}`,
        score:   e.urgency_score || 5
      })
    }
    if (actions.length >= 2) break
  }

  // Pull from hot leads
  const hotLeads = [...(Array.isArray(props.leads) ? props.leads : [])]
    .sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0))

  for (const l of hotLeads) {
    if (l.recommended_action) {
      actions.push({
        source:  'lead',
        text:    l.recommended_action,
        context: `${l.name}${l.company ? ` @ ${l.company}` : ''} · score ${l.lead_score}/10`,
        score:   l.lead_score || 5
      })
    }
    if (actions.length >= 5) break
  }

  return actions.slice(0, 5)
})

function priorityBadge(source) {
  return source === 'email'
    ? 'bg-orange-500/15 text-orange-500/70 border border-orange-500/20'
    : 'bg-rose-500/15 text-rose-500/70 border border-rose-500/20'
}
</script>
