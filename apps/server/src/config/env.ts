import { z } from 'zod';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '../../.env') });
config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string().default('apps/server/sqlite.db'),
  LEETCODE_SESSION: z.string().optional(),
  LEETCODE_CSRF_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
