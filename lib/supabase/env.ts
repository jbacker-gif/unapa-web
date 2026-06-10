const FALLBACK_SUPABASE_URL = 'https://wmtopxzshgfegeqleojt.supabase.co'
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_vQo0IloHXC7KJvbW8yYSuA_EdxyO96b'

export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL,
    publishableKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      FALLBACK_SUPABASE_PUBLISHABLE_KEY,
  }
}

export function hasSupabaseEnv() {
  const env = getSupabaseEnv()
  return Boolean(env.url && env.publishableKey)
}
