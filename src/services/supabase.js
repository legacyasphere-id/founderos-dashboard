import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://eqktmdyvftuuniqoxsgz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3RtZHl2ZnR1dW5pcW94c2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NzUzMDcsImV4cCI6MjA5NzQ1MTMwN30.KecxrBRZKCJt9zMSvYI4Gr5tKUKb_tYLofsuPNc7X64'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
