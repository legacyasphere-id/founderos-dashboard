<script setup>
import { onMounted, computed } from 'vue'
import StatCard from './components/StatCard.vue'
import EmailFeed from './components/EmailFeed.vue'
import LeadsPipeline from './components/LeadsPipeline.vue'
import KnowledgeVault from './components/KnowledgeVault.vue'
import { useEmails } from './composables/useEmails'
import { useLeads } from './composables/useLeads'
import { useKnowledge } from './composables/useKnowledge'

const { emails, loading: emailLoading, fetchEmails } = useEmails()
const { leads, hot, loading: leadLoading, fetchLeads } = useLeads()
const { entries, loading: knowledgeLoading, fetchEntries } = useKnowledge()

const actionEmails = computed(() => emails.value.filter(e => e.action_required))
const criticalEmails = computed(() => emails.value.filter(e => e.urgency_level === 'critical' || e.urgency_level === 'high'))

onMounted(() => {
  fetchEmails()
  fetchLeads()
  fetchEntries()
})

const now = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
</script>

<template>
  <div class="min-h-screen bg-surface">
    <!-- Header -->
    <header class="border-b border-border px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-xs font-bold">F</div>
        <span class="font-semibold text-sm tracking-wide">FounderOS</span>
        <span class="text-xs text-muted border border-border rounded px-2 py-0.5">Dashboard</span>
      </div>
      <span class="text-xs text-muted">{{ now }}</span>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

      <!-- Stats Row -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          :value="leads.length"
          :sub="hot.length + ' hot'"
        />
        <StatCard
          label="Emails Processed"
          :value="emails.length"
          :sub="actionEmails.length + ' need action'"
        />
        <StatCard
          label="Urgent Emails"
          :value="criticalEmails.length"
          sub="high or critical"
        />
        <StatCard
          label="Knowledge Entries"
          :value="entries.length"
          sub="in vault"
        />
      </section>

      <!-- Main Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Email Feed - wider -->
        <div class="lg:col-span-2">
          <EmailFeed :emails="emails" :loading="emailLoading" />
        </div>

        <!-- Leads -->
        <div>
          <LeadsPipeline :leads="leads" :loading="leadLoading" />
        </div>
      </section>

      <!-- Knowledge Vault - full width -->
      <section>
        <KnowledgeVault :entries="entries" :loading="knowledgeLoading" />
      </section>

    </main>
  </div>
</template>
