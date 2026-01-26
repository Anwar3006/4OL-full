import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { expo } from "@better-auth/expo";

import { db, dbTransact } from "@4ol/db/index";
import { admin } from "better-auth/plugins";

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: drizzleAdapter(dbTransact, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
      banned: {
        type: "boolean",
        defaultValue: false,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
        // Email verification will be handled by your email service
        console.log(
          `Email change verification for ${user.email} to ${newEmail}`,
        );
        console.log(`Verification URL: ${url}`);
      },
    },
  },

  // CRITICAL: Add baseURL for proper callback validation
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  trustedOrigins: [
    "http://localhost:3000",
    "https://4-ol-full-web-myzx.vercel.app", //personal
    "https://office.4ourlife.com", //production
    "https://4-our-life-gh-web.vercel.app", //preview

    // Mobile app schemes - FIXED
    "4ol://*", // Wildcard for all paths under 4ol://
    "4ol://(app)/(auth)/(tabs)/Home",

    // Development mobile
    ...(process.env.NODE_ENV === "development"
      ? ["exp://*", "http://localhost:8081", "http://localhost:19006"]
      : []),
  ],

  plugins: [
    nextCookies(),

    // Expo plugin with explicit scheme configuration
    expo(),

    admin(),
  ],
});

export type Session = typeof auth.$Infer.Session;
