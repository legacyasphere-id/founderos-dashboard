import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export function useLeads() {
  const leads = ref([])
  const loading = ref(false)
  const error = ref(null)

  const hot = computed(() => leads.value.filter(l => l.lead_status === 'hot'))
  const warm = computed(() => leads.value.filter(l => l.lead_status === 'warm'))
  const cold = computed(() => leads.value.filter(l => l.lead_status === 'cold'))

  async function fetchLeads() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('leads')
      .select('*')
      .order('lead_score', { ascending: false })
    if (err) error.value = err.message
    else leads.value = data
    loading.value = false
  }

  return { leads, hot, warm, cold, loading, error, fetchLeads }
}
