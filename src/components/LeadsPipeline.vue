<script setup>
import LeadBadge from './LeadBadge.vue'

defineProps({
  leads: Array,
  loading: Boolean,
})

function scoreColor(score) {
  if (score >= 8) return 'text-red-400'
  if (score >= 5) return 'text-orange-400'
  return 'text-blue-400'
}
</script>

<template>
  <div class="card flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="font-semibold text-sm uppercase tracking-widest text-muted">Lead Pipeline</h2>
      <span class="text-xs text-muted">{{ leads.length }} leads</span>
    </div>

    <div v-if="loading" class="text-muted text-sm py-6 text-center">Loading...</div>

    <div v-else-if="leads.length === 0" class="text-muted text-sm py-6 text-center">
      No leads yet. Connect your form via n8n to start scoring.
    </div>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="lead in leads"
        :key="lead.id"
        class="border border-border rounded-lg p-4 flex flex-col gap-2 hover:border-accent/40 transition-colors"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-medium">{{ lead.name || 'Unknown' }}</span>
            <span class="text-xs text-muted">{{ lead.company || lead.email }}</span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-lg font-semibold" :class="scoreColor(lead.lead_score)">
              {{ lead.lead_score }}<span class="text-xs text-muted">/10</span>
            </span>
            <LeadBadge :status="lead.lead_status" />
          </div>
        </div>

        <p v-if="lead.qualification_summary" class="text-xs text-muted line-clamp-2">
          {{ lead.qualification_summary }}
        </p>

        <div v-if="lead.recommended_action" class="flex items-start gap-2 mt-1 bg-accent/5 border border-accent/20 rounded-lg p-3">
          <span class="text-xs text-accent leading-relaxed">{{ lead.recommended_action }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
