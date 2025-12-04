<<<<<<< HEAD
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";
=======
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';
>>>>>>> develop

config();

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
