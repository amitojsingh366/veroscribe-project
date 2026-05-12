import { config } from "dotenv";
import postgres from "postgres";

config({ path: new URL("../../../.env", import.meta.url).pathname });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL not set");
}

const databaseUrl: string = connectionString;

async function main() {
  const sql = postgres(databaseUrl, { max: 1, prepare: false });

  try {
    console.log("Resetting database schema");
    await sql.unsafe("drop schema if exists public cascade");
    await sql.unsafe("create schema public");
    console.log("Database schema reset complete");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
