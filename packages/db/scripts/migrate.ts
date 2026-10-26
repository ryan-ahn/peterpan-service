import { config } from "dotenv";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

/**
 * `migrations/`의 SQL 파일을 이름 순서대로 실행한다. 루트 `.env`의 DATABASE_URL을 쓴다.
 * 파일마다 다시 실행해도 같은 결과가 되도록 쓴다.
 */

/**
 * constants
 */
const ROOT_PATH = resolve(import.meta.dirname, "../../..");

const MIGRATIONS_PATH = resolve(import.meta.dirname, "../migrations");

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
const readMigrationFiles = (): string[] =>
  readdirSync(MIGRATIONS_PATH)
    .filter(name => name.endsWith(".sql"))
    .sort();

const run = async () => {
  const sql = postgres(readDatabaseUrl(), {
    prepare: false,
    ssl: "require",
    max: 1,
  });
  for (const name of readMigrationFiles()) {
    await sql.unsafe(readFileSync(resolve(MIGRATIONS_PATH, name), "utf8"));
    console.log(`migration applied: ${name}`);
  }
  await sql.end();
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
