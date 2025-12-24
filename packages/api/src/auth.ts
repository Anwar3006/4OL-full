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
    // requireEmailVerification: process.env.NODE_ENV === "production",
  },
  // ...(isProd && {
  //   emailVerification: {
  //     sendVerificationEmail: async ({ user, url, token }) => {
  //       // Send verification email to user
  //     },
  //     sendOnSignUp: true,
  //     autoSignInAfterVerification: true,
  //     expiresIn: 3600, // 1 hour
  //   },
  // }), //no need for email verification because we send invitation to register to their email. they click on the link and navigate to register
  // user: {
  //   modelName: "user_profiles",
  //   additionalFields: {
  //     sex: {
  //       type: ["male", "female", "other"],
  //       required: true,
  //       input: true,
  //     },
  //     dob: {
  //       type: "date",
  //       required: true,
  //       input: true,
  //     },
  //     user_type: {
  //       type: ["customer", "business_provider", "both"],
  //       required: true,
  //       input: true,
  //       defaultValue: "customer",
  //     },
  //     role: {
  //       type: ["user", "admin", "super_admin"],
  //       required: true,
  //       input: true,
  //       defaultValue: "user",
  //     },
  //     permissions: {
  //       type: "json",
  //       required: true,
  //       input: true,
  //     },
  //     phone_number: {
  //       type: "string",
  //       required: true,
  //       input: true,
  //     },
  //     deletedAt: {
  //       type: "date",
  //       required: false,
  //       input: false,
  //     },
  //   },
  // },
  trustedOrigins: [
    "http://localhost:3000", // Local Web
    "https://your-domain.com", // Production Web
    // "exp://",                     // Expo Go
    // "myapp://"                    // Your actual Mobile App Scheme
  ],
  plugins: [
    nextCookies(),
    // expo() //uncomment when you setup expo and install @better-auth/expo
  ],
});

export type Session = typeof auth.$Infer.Session;
