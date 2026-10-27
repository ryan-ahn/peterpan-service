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
    /**
     * Supabase 트랜잭션 풀러는 한 연결에 겹쳐 보낸 쿼리를 처리하지 못해 멈춘다.
     * postgres.js는 매개변수 없는 쿼리가 연결 수보다 많으면 겹쳐 보내므로 `max_pipeline: 0`으로 막는다(타입 정의에는 없는 옵션)
     */
    const options = {
      prepare: false,
      max: 10,
      max_pipeline: 0,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: "require" as const,
    };
    sqlClient = postgres(databaseUrl, options);
  }
  return sqlClient;
};

let db: ReturnType<typeof createDb> | null = null;

const createDb = () => drizzle(getSql(), { schema });

export const getDb = () => {
  db ??= createDb();
  return db;
};
