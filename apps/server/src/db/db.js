import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import { env } from "../config/env.js";
import * as schema from "./schema.js";
const dbPath = path.resolve(process.cwd(), env.DATABASE_URL);
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const url = `file:${dbPath}`;
const sqlite = createClient({ url });
const db = drizzle(sqlite, { schema });
export {
  db,
  sqlite
};
