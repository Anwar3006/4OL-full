import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
// import { expo } from "@better-auth/expo"; install this later when you setup expo

import { db } from "@4ol/db/index";
import { user_profiles } from "@4ol/db/models/auth.model";

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    "http://localhost:3000", // Local Web
    "https://4-ol-full-web-myzx.vercel.app", // Production Web
    // "exp://",                     // Expo Go
    // "myapp://"                    // Your actual Mobile App Scheme
  ],
  plugins: [
    nextCookies(),
    // expo() //uncomment when you setup expo and install @better-auth/expo
  ],
});

export type Session = typeof auth.$Infer.Session;
