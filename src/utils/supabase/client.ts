import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials are not configured. App will run in preview/mock mode.');
  }
  
  return createBrowserClient(
    supabaseUrl || 'https://missing-supabase-url.supabase.co',
    supabaseKey || 'missing-anon-key',
  );
};
