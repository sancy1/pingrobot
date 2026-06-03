// drizzle.config.ts
// Configuration file for Drizzle ORM migrations and schema generation

import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from local development profile
dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('❌ DATABASE_URL is not defined in .env.local');
}

// FIXED: Converted from satisfies Config type casting to modern defineConfig utility wrapper
export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  // Enable verbose logging for migration debugging
  verbose: true,
  strict: true,
});
