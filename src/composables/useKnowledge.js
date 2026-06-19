import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function useKnowledge() {
  const entries = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchEntries() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('knowledge_entries')
      .select('*')
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .limit(10)
    if (err) error.value = err.message
    else entries.value = data
    loading.value = false
  }

  return { entries, loading, error, fetchEntries }
}
