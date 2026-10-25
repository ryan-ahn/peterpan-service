import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

/**
 * 마이그레이션 SQL을 순서대로 실행한다. 루트 `.env`의 DATABASE_URL을 쓴다.
 */

/**
 * constants
 */
const ROOT_PATH = resolve(import.meta.dirname, "../../..");

const MIGRATION_PATH = resolve(
  import.meta.dirname,
  "../migrations/0001_init.sql",
);

/**
 * pre-root runtime
 */
const readDatabaseUrl = (): string => {
  config({ path: resolve(ROOT_PATH, ".env"), quiet: true });
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL이 없습니다.");
  }
  return databaseUrl;
};

/**
 * utils
 */
const splitStatements = (file: string): string[] =>
  file
    .split(/;\s*\n/)
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);

const run = async () => {
  const sql = postgres(readDatabaseUrl(), {
    prepare: false,
    ssl: "require",
    max: 1,
  });
  const statements = splitStatements(readFileSync(MIGRATION_PATH, "utf8"));
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
