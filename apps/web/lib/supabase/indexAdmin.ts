import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * Helper to verify admin client is only used server-side
 */
if (typeof window !== "undefined") {
  console.error(
    "❌ SECURITY WARNING: supabaseAdmin should NEVER be used on the client-side!"
  );
}
