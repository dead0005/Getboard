import { z } from "zod";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../../../.env") });
config({ path: path.resolve(__dirname, "../../../.env") });

const envSchema = z.object({
  PORT: z.string().default("3001"),
  DATABASE_URL: z.string().default("sqlite.db"),
  LEETCODE_SESSION: z.string().optional(),
  LEETCODE_CSRF_TOKEN: z.string().optional()
});

const env = envSchema.parse(process.env);
export { env };
