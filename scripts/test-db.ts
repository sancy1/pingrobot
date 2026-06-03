// scripts/test-db.ts
// TEMPORARY FILE - Delete after testing database connection

import * as dotenv from 'dotenv';
import path from 'path';

// FIXED: Explicitly load the local environment configuration before importing the DB module
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now we can safely import our DB manager functions without them failing on load
import { checkDatabaseConnection, getDatabaseStatus } from '../lib/db';

async function testConnection() {
  console.log('🔍 Starting diagnostic database connection test...\n');
  
  // Tests the direct active log counter we updated
  await checkDatabaseConnection();
  
  console.log('\n----------------------------------------\n');
  
  // Extracts detailed schema structural table reports
  const status = await getDatabaseStatus();
  
  if (status.connected) {
    console.log('✅ Database connection test: SUCCESSFUL');
    console.log('📊 Active database tables found:', status.tables && status.tables.length > 0 ? status.tables.join(', ') : 'None (No tables created yet)');
  } else {
    console.log('❌ Database connection test: FAILED');
    console.log('🚨 Error Details:', status.error);
  }
}

testConnection().catch((err) => {
  console.error('💥 Fatal script execution error:', err);
});
