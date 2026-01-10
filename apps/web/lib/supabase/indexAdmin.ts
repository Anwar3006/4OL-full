import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SECRET_KEY as string;

// Fail gracefully during build, but throw during runtime
if (!supabaseUrl || !supabaseKey) {
  // If we're in production/runtime, this is a real error.
  // During build (CI), we might want to just return a dummy or null to let the build finish.
  if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
    throw new Error("Supabase environment variables are missing!");
  }
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

/**
 * Helper to verify admin client is only used server-side
 */
if (typeof window !== "undefined") {
  console.error(
    "❌ SECURITY WARNING: supabaseAdmin should NEVER be used on the client-side!"
  );
}
