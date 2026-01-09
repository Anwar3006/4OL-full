import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env.local" }); // Look up two levels

export default defineConfig({
  out: "./migrations",
  schema: "./models/index.model.ts",
  dialect: "postgresql",
  dbCredentials: {
    // url: process.env.SUPABASE_DATABASE_URL!,
    url: process.env.SUPABASE_DIRECT_URL!,
  },
});
