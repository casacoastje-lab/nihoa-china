import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && 
                   supabaseUrl !== 'https://missing-supabase-url.supabase.co' && 
                   supabaseAnonKey && 
                   supabaseAnonKey !== 'missing-anon-key';

if (!isConfigured) {
  console.error('Supabase credentials are missing or invalid! \n' +
    '1. If using local dev, check your .env file. \n' +
    '2. If using Cloudflare/Vercel, check your Environment Variables (ensure they have the VITE_ prefix). \n' +
    '3. Current URL:', supabaseUrl);
} else {
  console.log('Supabase successfully initialized.');
}

// Use a fallback that won't crash the build, but will fail gracefully at runtime
export const supabase = createClient(
  supabaseUrl || 'https://missing-supabase-url.supabase.co',
  supabaseAnonKey || 'missing-anon-key'
);
