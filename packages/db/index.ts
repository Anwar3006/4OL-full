import { neon, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzlePool } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./models/index.model";

import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env.local" });

const connectionString = process.env.DATABASE_URL!;

// 1. HTTP Client: The "Speed Demon" (Use for Queries/Reads)
const sql = neon(connectionString);
export const db = drizzleHttp(sql, { schema });

// 2. TCP Client: The "Transaction Master" (Use for Writes/Auth)
// Note: Use the Neon connection string with '-pooler' for this
// const pool = new Pool({ connectionString: process.env.DATABASE_POOLER_URL! });
// export const dbTransact = drizzlePool(pool, { schema });

// 3. Transaction Pooler for Supabase connection
const client = postgres(process.env.SUPABASE_DATABASE_URL!, { prepare: false });
export const dbTransact = drizzlePg(client, { schema });
