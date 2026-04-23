import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseUrl !== 'https://missing-supabase-url.supabase.co' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'missing-anon-key'
);

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials are not configured. App will run in preview/mock mode.');
} else {
  console.log('Supabase successfully initialized.');
}

// Use a fallback that won't crash the build, but will fail gracefully at runtime
export const supabase = createClient(
  supabaseUrl || 'https://missing-supabase-url.supabase.co',
  supabaseAnonKey || 'missing-anon-key'
);
