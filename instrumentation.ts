// instrumentation.ts
// Next.js Global Infrastructure Hook - Executed exactly once on server runtime bootstrap initialization

export async function register() {
  // Only execute this execution loop inside Node runtime environments (protects Edge contexts)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only spin up the daemon listener while working inside a local dev environment
    if (process.env.NODE_ENV === 'development') {
      const { startLocalScheduler } = await import('@/lib/scheduler');
      
      console.log('⚙️ [Bootstrap Execution] Launching backend automation loop subsystems...');
      startLocalScheduler();
    }
  }
}