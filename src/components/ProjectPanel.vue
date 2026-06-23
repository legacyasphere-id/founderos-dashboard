<template>
  <section class="card h-full overflow-hidden">
    <div class="flex items-center justify-between gap-3 border-b border-[--border] bg-[#2A4D88]/6 px-4 py-3">
      <div>
        <h2 class="text-sm font-semibold text-[--accent]">Project Intelligence</h2>
        <p class="mt-0.5 text-xs text-[--text-muted]">Active, at-risk & blocked work</p>
      </div>
      <span v-if="!loading" class="font-mono text-[11px] text-[--accent]">{{ activeProjects.length }} active</span>
    </div>
    <div class="p-4">

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="animate-pulse rounded-xl border border-[--border] bg-[--bg] p-3">
          <div class="mb-3 h-3 w-1/2 rounded bg-[--surface-2]"></div>
          <div class="h-2 w-full rounded-full bg-[--surface-2]"></div>
        </div>
      </div>

      <div v-else-if="activeProjects.length === 0" class="flex min-h-36 flex-col items-center justify-center rounded-xl border border-[--border] bg-[--bg] text-center">
        <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#2A4D88]/25 bg-[#2A4D88]/10 font-mono text-[--accent]">
          PRJ
        </div>
        <p class="text-sm text-[--text-primary]">No active projects.</p>
        <p class="mt-1 text-xs text-[--text-muted]">Projects tracked in Supabase appear here.</p>
      </div>

      <div v-else class="space-y-3">
        <article
          v-for="(project, i) in activeProjects"
          :key="i"
          class="overflow-hidden rounded-xl border bg-[--bg] p-3 transition duration-200 hover:bg-[--surface]"
          :class="getClientColor(project.client).border"
        >
          <div class="mb-2 flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <div
                  class="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  :style="{ backgroundColor: getClientColor(project.client).strip }"
                ></div>
                <span class="truncate text-sm font-semibold text-[--text-primary]">{{ project.name }}</span>
              </div>
              <p v-if="project.client" class="mt-0.5 truncate pl-4 text-xs text-[--text-muted]">{{ project.client }}</p>
            </div>
            <span
              class="flex-shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
              :class="statusBadge(project.status)"
            >{{ project.status }}</span>
          </div>

          <div class="mb-2 pl-4">
            <div class="mb-1 flex items-center justify-between">
              <span class="font-mono text-[10px] text-[--text-muted]">Progress</span>
              <span class="font-mono text-[10px] text-[--text-primary]">{{ project.progress ?? 0 }}%</span>
            </div>
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-[--surface-2]">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: `${project.progress ?? 0}%`, backgroundColor: getClientColor(project.client).strip }"
              ></div>
            </div>
          </div>

          <p v-if="project.blocker" class="mt-2 flex items-start gap-1.5 rounded-lg bg-red-50 px-2.5 py-2 text-xs text-red-700">
            <span class="mt-0.5 flex-shrink-0 font-mono font-bold">!</span>
            <span class="line-clamp-2">{{ project.blocker }}</span>
          </p>

          <p v-if="project.next_action && !project.blocker" class="mt-2 truncate pl-4 text-xs text-[--text-secondary]">
            Next: {{ project.next_action }}
          </p>

          <div v-if="project.due_date" class="mt-2 pl-4">
            <span class="font-mono text-[10px]" :class="dueDateClass(project.due_date)">Due {{ formatDate(project.due_date) }}</span>
          </div>
        </article>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { getClientColor } from '../config/clients.js'

const props = defineProps({
  projects: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const activeProjects = computed(() =>
  props.projects.filter(p => ['active', 'at_risk', 'blocked'].includes(p.status))
)

function statusBadge(status) {
  const map = {
    active: 'bg-blue-50 text-[#2A4D88] border-blue-200',
    at_risk: 'bg-orange-50 text-orange-700 border-orange-200',
    blocked: 'bg-red-50 text-red-700 border-red-200',
    completed: 'bg-gray-50 text-gray-500 border-gray-200',
    paused: 'bg-gray-50 text-gray-400 border-gray-100'
  }
  return map[status] || map.active
}

function dueDateClass(date) {
  if (!date) return 'text-[--text-muted]'
  const diff = new Date(date).getTime() - Date.now()
  const days = Math.ceil(diff / 86400000)
  if (days < 0) return 'text-red-600'
  if (days <= 3) return 'text-orange-600'
  return 'text-[--text-muted]'
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
</script>
