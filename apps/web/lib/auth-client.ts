import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { adminClient } from "better-auth/client/plugins";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:3000";

export const authClient = createAuthClient({
  //you can pass client configuration here
  baseURL: API_URL,
  plugins: [adminClient()],
});
