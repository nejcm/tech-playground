import Database from 'better-sqlite3';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from '../env.ts';
import * as schema from './schema.ts';

config();

const sqlite = new Database(env.DATABASE_URL);
export const db = drizzle(sqlite, { schema });
