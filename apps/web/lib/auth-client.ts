import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

function getBaseUrl() {
  // In browser, use relative path
  if (typeof window !== "undefined") return "";
  
  // In production SSR, use the public app URL
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_APP_URL || "";
  }
  
  // Development fallback
  return "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [adminClient()],
});
