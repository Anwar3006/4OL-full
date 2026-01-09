import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
// import { expo } from "@better-auth/expo"; install this later when you setup expo

import { db, dbTransact } from "@4ol/db/index";
import { admin } from "better-auth/plugins";

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: drizzleAdapter(dbTransact, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    // autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user", // Match your DB default
        input: false, // Prevents users from setting their own role during sign-up
      },
      banned: {
        type: "boolean",
        defaultValue: false,
      },
    },
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
    admin(),
  ],
});

export type Session = typeof auth.$Infer.Session;
