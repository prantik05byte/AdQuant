import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase environment variables not set. Auth and history features will be disabled.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// SQL to run in Supabase SQL Editor:
/*
create table simulations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  niche text,
  cost_price numeric,
  selling_price numeric,
  risk_score numeric,
  failure_probability text,
  break_even_roas numeric,
  net_profit_margin numeric,
  recommended_budget_min numeric,
  recommended_budget_max numeric,
  risk_category text,
  ai_explanation text,
  inputs jsonb,
  created_at timestamptz default now()
);

alter table simulations enable row level security;

create policy "Users see own simulations" on simulations
  for all using (auth.uid() = user_id);
*/
