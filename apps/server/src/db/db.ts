import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';
import * as schema from './schema.js';

// Resolve database path
const dbPath = path.resolve(process.cwd(), env.DATABASE_URL);
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Ensure the local database file URL format
const url = `file:${dbPath}`;

export const sqlite = createClient({ url });

export const db = drizzle(sqlite, { schema });
export type DBType = typeof db;
