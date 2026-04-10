import { createServerClient } from "@supabase/ssr";

// Note: This is adapted from Next.js implementation. 
// In a non-Next.js environment, you would pass a cookie manager that matches your server framework (e.g. Express).

export const createClient = (cookieStore: any) => {
  return createServerClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Handle cookie setting error
          }
        },
      },
    },
  );
};
