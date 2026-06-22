<template>
  <section class="card h-full p-4">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold text-[--text-primary]">Today's Focus</h2>
        <p class="mt-1 text-xs text-[--text-muted]">AI-generated daily summary</p>
      </div>
      <span v-if="briefing" class="rounded-full border border-[#2A4D88]/25 px-3 py-1 font-mono text-[11px] text-[--accent]">
        {{ timeAgo(briefing.created_at) }}
      </span>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="animate-pulse rounded-xl border border-[--border] bg-[--bg] p-4">
        <div class="mb-2 h-3 w-full rounded bg-[--surface-2]"></div>
        <div class="h-3 w-3/4 rounded bg-[--surface-2]"></div>
      </div>
    </div>

    <div v-else-if="!briefing" class="flex min-h-40 flex-col items-center justify-center rounded-xl border border-[--border] bg-[--bg] text-center">
      <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#2A4D88]/25 bg-[#2A4D88]/10 font-mono text-xs text-[--accent]">
        07:00
      </div>
      <p class="text-sm text-[--text-primary]">No briefing yet.</p>
      <p class="mt-1 text-xs text-[--text-muted]">Runs daily at 07:00 WIB.</p>
    </div>

    <div v-else class="space-y-3">
      <div v-if="briefing.summary" class="rounded-xl border border-[#2A4D88]/20 bg-[#2A4D88]/5 p-4">
        <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[--accent]">Summary</p>
        <p class="text-xs leading-5 text-[--text-secondary]">{{ cleanBriefingText(briefing.summary) }}</p>
      </div>

      <div v-if="actionItems.length > 0" class="rounded-xl border border-[--border] bg-[--bg] p-4">
        <p class="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[--text-muted]">
          Action Items
          <span class="ml-2 rounded-full bg-[#2A4D88]/10 px-2 py-0.5 text-[--accent]">{{ actionItems.length }}</span>
        </p>
        <ul class="mt-2 space-y-2">
          <li v-for="(item, i) in actionItems" :key="i" class="flex items-start gap-2 text-xs text-[--text-secondary]">
            <span class="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[--accent]"></span>
            <span>{{ cleanBriefingText(item) }}</span>
          </li>
        </ul>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="rounded-xl border border-[--border] bg-[--bg] p-3 text-center">
          <div class="font-mono text-lg font-semibold" :class="urgentCount > 0 ? 'text-[--critical]' : 'text-[--text-muted]'">
            {{ urgentCount }}
          </div>
          <p class="mt-1 text-[10px] text-[--text-muted]">urgent emails</p>
        </div>
        <div class="rounded-xl border border-[--border] bg-[--bg] p-3 text-center">
          <div class="font-mono text-lg font-semibold" :class="hotCount > 0 ? 'text-[--hot]' : 'text-[--text-muted]'">
            {{ hotCount }}
          </div>
          <p class="mt-1 text-[10px] text-[--text-muted]">hot leads</p>
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

function cleanBriefingText(text) {
  if (!text) return ''
  let clean = text
  try {
    const parsed = JSON.parse(text)
    clean = parsed.summary || parsed.content || parsed.text || JSON.stringify(parsed)
  } catch {}
  clean = clean
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[\{\[][\s\S]*[\}\]]\s*$/g, '')
    .replace(/["{}[\]]/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,3}\s+/gm, '')
    .trim()
  return clean
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
