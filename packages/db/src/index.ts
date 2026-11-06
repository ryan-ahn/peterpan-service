import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export * from "./schema";

type Sql = ReturnType<typeof postgres>;

const CONNECTION_OPTIONS = {
  prepare: false,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: "require" as const,
};

let sqlClient: Sql | null = null;

let transactionSqlClient: Sql | null = null;

const readDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL이 없습니다.");
  }
  return databaseUrl;
};

const getSql = (): Sql => {
  if (!sqlClient) {
    /**
     * Supabase 트랜잭션 풀러는 한 연결에 겹쳐 보낸 쿼리를 처리하지 못해 멈춘다.
     * postgres.js는 매개변수 없는 쿼리가 연결 수보다 많으면 겹쳐 보내므로 `max_pipeline: 0`으로 막는다(타입 정의에는 없는 옵션)
     */
    const options = { ...CONNECTION_OPTIONS, max: 10, max_pipeline: 0 };
    sqlClient = postgres(readDatabaseUrl(), options);
  }
  return sqlClient;
};

/**
 * 트랜잭션 전용 연결. `max_pipeline: 0`이면 postgres.js `begin`이 연결을 잡아 두지 못해
 * `UNSAFE_TRANSACTION`으로 막힌다. 여기서는 `begin`만 보내고 연결마다 한 트랜잭션이 차례로 돌아 겹쳐 보낼 일이 없다
 */
const getTransactionSql = (): Sql => {
  transactionSqlClient ??= postgres(readDatabaseUrl(), {
    ...CONNECTION_OPTIONS,
    max: 3,
  });
  return transactionSqlClient;
};

let db: ReturnType<typeof createDb> | null = null;

let transactionDb: ReturnType<typeof createDb> | null = null;

const createDb = (sql: Sql) => drizzle(sql, { schema });

export const getDb = () => {
  db ??= createDb(getSql());
  return db;
};

type Transaction = Parameters<
  Parameters<ReturnType<typeof createDb>["transaction"]>[0]
>[0];

export const runTransaction = <T>(work: (tx: Transaction) => Promise<T>) => {
  transactionDb ??= createDb(getTransactionSql());
  return transactionDb.transaction(work);
};
