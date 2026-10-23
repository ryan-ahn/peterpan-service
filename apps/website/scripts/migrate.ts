import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

config({ path: resolve(process.cwd(), ".env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL이 없습니다.");
}

const sql = postgres(databaseUrl, { prepare: false, ssl: "require", max: 1 });
const file = readFileSync(
  resolve(process.cwd(), "../../packages/db/migrations/0001_init.sql"),
  "utf8",
);
const statements = file
  .split(/;\s*\n/)
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

const run = async () => {
  for (const statement of statements) {
    await sql.unsafe(statement);
  }
  await sql.end();
  console.log(`migration applied: ${statements.length} statements`);
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
