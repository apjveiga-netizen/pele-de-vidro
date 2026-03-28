import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Preventive check to avoid crashing the whole bundle if variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase: Missing environment variables. Using placeholder client to prevent crash.")
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { auth: { onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), getSession: async () => ({ data: { session: null } }) }, from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), order: () => ({ limit: () => ({ single: async () => ({ data: null, error: null }) }) }) }) }) }) }
