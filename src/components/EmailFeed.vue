<script setup>
import UrgencyBadge from './UrgencyBadge.vue'

defineProps({
  emails: Array,
  loading: Boolean,
})

function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="card flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="font-semibold text-sm uppercase tracking-widest text-muted">Email Intelligence</h2>
      <span class="text-xs text-muted">{{ emails.length }} emails</span>
    </div>

    <div v-if="loading" class="text-muted text-sm py-6 text-center">Loading...</div>

    <div v-else-if="emails.length === 0" class="text-muted text-sm py-6 text-center">
      No emails yet. Connect Gmail via n8n to start.
    </div>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="email in emails"
        :key="email.id"
        class="border border-border rounded-lg p-4 flex flex-col gap-2 hover:border-accent/40 transition-colors"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-col gap-0.5 min-w-0">
            <span class="text-sm font-medium truncate">{{ email.subject || '(No subject)' }}</span>
            <span class="text-xs text-muted truncate">{{ email.sender_name || email.sender_email }}</span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <UrgencyBadge :level="email.urgency_level" />
            <span v-if="email.action_required" class="badge bg-accent/20 text-accent">action needed</span>
          </div>
        </div>

        <p v-if="email.summary" class="text-xs text-muted leading-relaxed line-clamp-2">{{ email.summary }}</p>

        <div class="flex items-center justify-between mt-1">
          <span class="text-xs text-muted">{{ formatDate(email.received_at) }}</span>
          <span class="badge bg-surface text-muted border border-border">{{ email.email_category }}</span>
        </div>

        <div v-if="email.action_items?.length" class="mt-1 flex flex-col gap-1">
          <span class="text-xs text-muted uppercase tracking-wider">Actions</span>
          <ul class="list-disc list-inside text-xs text-gray-300 space-y-0.5">
            <li v-for="(item, i) in email.action_items.slice(0, 3)" :key="i">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
