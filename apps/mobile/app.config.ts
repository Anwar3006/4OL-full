import "dotenv/config";

export default {
  expo: {
    extra: {
      API_URL: process.env.API_URL,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
    },
  },
};
