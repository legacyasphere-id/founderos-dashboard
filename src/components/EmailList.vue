<template>
  <div class="bg-[#111] border border-[#1e1e1e] rounded-xl p-5 h-full">

    <!-- Section header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xs font-semibold tracking-[2px] uppercase text-[#555]">Email Intelligence</h2>
      <span v-if="!loading" class="text-xs font-mono text-[#444]">{{ emails.length }} signal{{ emails.length !== 1 ? 's' : '' }}</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="animate-pulse">
        <div class="h-3 bg-[#1e1e1e] rounded w-1/4 mb-2"></div>
        <div class="h-4 bg-[#1a1a1a] rounded w-3/4 mb-1"></div>
        <div class="h-3 bg-[#161616] rounded w-1/2"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="emails.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
      <div class="text-2xl mb-2">✓</div>
      <p class="text-[#555] text-sm">No urgent emails.</p>
      <p class="text-[#333] text-xs mt-1">Inbox is clear.</p>
    </div>

    <!-- Email list -->
    <div v-else class="space-y-3">
      <div
        v-for="(email, i) in emails"
        :key="i"
        class="border border-[#1e1e1e] rounded-lg p-4 bg-[#0d0d0d] hover:border-[#2a2a2a] transition-colors"
      >
        <!-- Top row: badge + time -->
        <div class="flex items-center justify-between mb-2">
          <span :class="urgencyClass(email.urgency_level)" class="text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded-full">
            {{ email.urgency_level?.toUpperCase() }}
          </span>
          <span class="text-[11px] text-[#444] font-mono">{{ timeAgo(email.received_at) }}</span>
        </div>

        <!-- Subject -->
        <p class="text-sm font-semibold text-[#e0e0e0] leading-tight mb-1 truncate">
          {{ email.subject || '(no subject)' }}
        </p>

        <!-- From -->
        <p class="text-xs text-[#555] mb-2">
          from <span class="text-[#888]">{{ email.sender_name }}</span>
          <span v-if="email.email_category" class="ml-2 text-[#333]">· {{ email.email_category }}</span>
        </p>

        <!-- Recommended response -->
        <p v-if="email.recommended_response" class="text-xs text-[#666] leading-relaxed border-l-2 border-[#2a2a2a] pl-2">
          {{ email.recommended_response }}
        </p>

        <!-- Action items count -->
        <div v-if="email.action_items?.length > 0" class="mt-2">
          <span class="text-[10px] font-mono text-indigo-400/70 bg-indigo-500/10 px-2 py-0.5 rounded">
            {{ email.action_items.length }} action{{ email.action_items.length > 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
defineProps({
  emails:  { type: Array,   default: () => [] },
  loading: { type: Boolean, default: false }
})

function urgencyClass(level) {
  const map = {
    critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
    high:     'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    medium:   'bg-yellow-500/20 text-yellow-500/80 border border-yellow-500/20',
    low:      'bg-[#1e1e1e] text-[#555] border border-[#2a2a2a]'
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
