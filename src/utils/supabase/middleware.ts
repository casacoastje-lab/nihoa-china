import { createServerClient } from "@supabase/ssr";

// Note: This is adapted from Next.js implementation.
// In Vite/React SPA, middleware is typically handled by the server (e.g. Express) or via client-side routing guards.

export const createClient = (request: any, response: any) => {
  const supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          // In Express or similar, you'd update the response cookies here
        },
      },
    },
  );

  return supabase;
};
