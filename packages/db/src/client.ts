import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

config({ path: new URL("../../../.env", import.meta.url).pathname });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL not set");
}

const queryClient = postgres(connectionString, { max: 10, prepare: false });

export const db = drizzle(queryClient, { schema });
export type DB = typeof db;
