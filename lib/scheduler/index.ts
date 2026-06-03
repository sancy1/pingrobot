// lib/scheduler/index.ts
// UNIFIED SCHEDULER - Auto-detects environment and runs cron accordingly
// - Local development: Uses node-cron (runs in-process anchored to clock)
// - Vercel production: Uses Vercel Cron Jobs (external secure HTTP calls)
// No code changes needed between environments!

import { PingWorker } from '@/lib/ping-engine/worker';

// Check environment configurations
const IS_VERCEL = process.env.VERCEL === '1';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Store reference to the cron task for clean structural lifecycle controls
let localCronTask: { stop: () => void } | null = null;

/**
 * Execute the cron job - processes all due monitors
 * This function is called by both local node-cron and the public Vercel cloud /api/cron endpoint
 */
export async function executeCronJob(): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  timestamp: string;
}> {
  console.log(`\n🕐 Cron job triggered at ${new Date().toISOString()}`);
  console.log(`📡 Execution Context: ${IS_VERCEL ? 'Vercel Infrastructure' : IS_DEVELOPMENT ? 'Local Dev Workspace' : 'Standalone Production Container'}`);
    
  const startTime = Date.now();
  const results = await PingWorker.processDueMonitors();
  const duration = Date.now() - startTime;
    
  console.log(`⏱️ Cron loop complete. Duration: ${duration}ms`);
    
  return {
    ...results,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Start the local cron scheduler (for development and standalone servers)
 * Anchors strictly on the 60-second clock boundary to replicate Vercel's behavior
 */
export function startLocalScheduler(): void {
  if (IS_VERCEL) {
    console.log('📡 System Runtime: Vercel detected. Relying on native infrastructure clocks.');
    return;
  }
    
  if (localCronTask) {
    console.log('⚠️ Local cron daemon loop is already active.');
    return;
  }
    
  console.log('🚀 Initializing local node-cron daemon thread...');

  // Fire an immediate startup pulse so you don't have to wait 60 seconds to test your code
  executeCronJob().catch(err => console.error('❌ Initial baseline engine pulse failed:', err));

  try {
    const cron = require('node-cron');

    // Anchor securely to structural minute marks ('* * * * *') instead of loose intervals
    localCronTask = cron.schedule('* * * * *', async () => {
      console.log('⏰ [Local Clock] Minute boundary cross detected. Launching scheduled check...');
      await executeCronJob().catch(err => console.error('❌ Scheduled cron worker error:', err));
    });

    console.log('✅ Local scheduler registered and listening successfully.');
  } catch (error) {
    console.error('⚠️ Failed to initialize local scheduler stream. Ensure "node-cron" package is installed.', error);
  }
}

/**
 * Stop the local cron scheduler loop gracefully
 */
export function stopLocalScheduler(): void {
  if (localCronTask) {
    localCronTask.stop();
    localCronTask = null;
    console.log('🛑 Local scheduler loop suspended gracefully.');
  }
}

/**
 * Get unified system runtime scheduler metrics
 */
export function getSchedulerStatus(): {
  isRunning: boolean;
  environment: string;
  cronType: string;
} {
  return {
    isRunning: IS_VERCEL ? true : localCronTask !== null,
    environment: IS_VERCEL ? 'vercel' : IS_DEVELOPMENT ? 'development' : 'production',
    cronType: IS_VERCEL ? 'Vercel Cloud Hooks' : 'node-cron (Local Daemon Loop)',
  };
}