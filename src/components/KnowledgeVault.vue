<script setup>
defineProps({
  entries: Array,
  loading: Boolean,
})

const categoryColors = {
  client: 'bg-blue-500/20 text-blue-400',
  project: 'bg-purple-500/20 text-purple-400',
  market: 'bg-green-500/20 text-green-400',
  process: 'bg-yellow-500/20 text-yellow-400',
  idea: 'bg-pink-500/20 text-pink-400',
  meeting: 'bg-orange-500/20 text-orange-400',
  other: 'bg-gray-500/20 text-gray-400',
}

function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="card flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="font-semibold text-sm uppercase tracking-widest text-muted">Knowledge Vault</h2>
      <span class="text-xs text-muted">{{ entries.length }} entries</span>
    </div>

    <div v-if="loading" class="text-muted text-sm py-6 text-center">Loading...</div>

    <div v-else-if="entries.length === 0" class="text-muted text-sm py-6 text-center">
      No knowledge entries yet. n8n will populate this automatically.
    </div>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="border border-border rounded-lg p-4 flex flex-col gap-2 hover:border-accent/40 transition-colors"
      >
        <div class="flex items-start justify-between gap-2">
          <span class="text-sm font-medium leading-snug">{{ entry.title || 'Untitled' }}</span>
          <span class="badge shrink-0" :class="categoryColors[entry.category] ?? categoryColors.other">
            {{ entry.category }}
          </span>
        </div>

        <p v-if="entry.summary" class="text-xs text-muted line-clamp-2">{{ entry.summary }}</p>

        <div v-if="entry.key_insights?.length" class="flex flex-col gap-1">
          <ul class="list-disc list-inside text-xs text-gray-400 space-y-0.5">
            <li v-for="(insight, i) in entry.key_insights.slice(0, 2)" :key="i">{{ insight }}</li>
          </ul>
        </div>

        <div class="flex items-center justify-between mt-1">
          <div class="flex gap-1 flex-wrap">
            <span
              v-for="tag in (entry.tags || []).slice(0, 3)"
              :key="tag"
              class="badge bg-surface border border-border text-muted"
            >
              {{ tag }}
            </span>
          </div>
          <span class="text-xs text-muted">{{ formatDate(entry.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
