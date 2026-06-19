import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function useEmails() {
  const emails = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchEmails() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('email_intelligence')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(20)
    if (err) error.value = err.message
    else emails.value = data
    loading.value = false
  }

  return { emails, loading, error, fetchEmails }
}
