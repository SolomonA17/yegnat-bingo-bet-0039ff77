
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uysuevvowchxziscyldd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5c3VldnZvd2NoeHppc2N5bGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTExODcsImV4cCI6MjA2NTQ2NzE4N30.sijP31phPe7cG0BRIIAskU65LaQoXawrAsFurzb5E80'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
