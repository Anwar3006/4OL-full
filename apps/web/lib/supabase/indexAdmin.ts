import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseAdminInstance: SupabaseClient | null = null;

/**
 * Lazy-loaded Supabase Admin client
 * Only initializes when actually needed (at runtime on the server)
 */
export function getSupabaseAdmin(): SupabaseClient {
  // Security check - prevent client-side usage
  if (typeof window !== "undefined") {
    throw new Error(
      "❌ SECURITY ERROR: supabaseAdmin should NEVER be used on the client-side!"
    );
  }

  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing required Supabase admin environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY"
      );
    }

    supabaseAdminInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return supabaseAdminInstance;
}

// Export for backward compatibility (use getSupabaseAdmin() instead for better lazy loading)
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient];
  }
});
