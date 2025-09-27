import { Pool, QueryResult } from 'pg';
import { env } from '../config/env';

let pool: Pool | null = null;

export const getPool = (): Pool => {
  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }
  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl,
    });
  }
  return pool;
};

export const query = <T = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
  return getPool().query<T>(text, params);
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
