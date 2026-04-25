import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use mock values if none are provided to prevent crash on startup
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

  return createBrowserClient(supabaseUrl, supabaseKey)
}
