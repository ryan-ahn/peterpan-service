import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export * from "./schema";

type Sql = ReturnType<typeof postgres>;

let sqlClient: Sql | null = null;

const getSql = (): Sql => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL이 없습니다.");
  }
  if (!sqlClient) {
    sqlClient = postgres(databaseUrl, {
      prepare: false,
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: "require",
    });
  }
  return sqlClient;
};

export const getDb = () => drizzle(getSql(), { schema });
