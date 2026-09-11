import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev rather than silently hitting undefined endpoints.
  console.error(
    'Missing Supabase env vars. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const CATEGORIES = ['Food', 'Rent', 'Entertainment', 'Salary', 'Utilities', 'Other']

// Consistent color mapping used across the pie chart, badges, and table dots.
export const CATEGORY_COLORS = {
  Food: '#B8542F', // rust
  Rent: '#14181F', // ink
  Entertainment: '#C9A227', // gold
  Salary: '#1F6F5C', // teal
  Utilities: '#6B7280', // slate
  Other: '#9C8F7A', // warm taupe
}
