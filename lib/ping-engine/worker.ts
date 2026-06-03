// // lib/ping-engine/worker.ts
// // CORE PING ENGINE - Aggressive wake-up detection with 60-second timeout + retries
// // Replicates Python's wake-up logic: 60s timeout, 3 retries, 5s threshold detection

// import { dbManager } from '@/lib/db';
// import { monitors, pingResults } from '@/lib/db/schema';
// import { eq, desc } from 'drizzle-orm';

// // ============================================
// // CONFIGURATION - Matches Python's aggressive settings
// // ============================================
// const PING_CONFIG = {
//   MAX_RETRIES: 3,                    // Same as Python's total=3
//   RETRY_BACKOFF_MS: 3000,            // Same as Python's backoff_factor=3 (3s, 9s, 27s)
//   WAKEUP_THRESHOLD_MS: 5000,         // Response > 5 seconds = cold start detection
//   DEFAULT_TIMEOUT_MS: 60000,         // 60 seconds - CRITICAL for waking sleeping servers
// };

// // ============================================
// // PING RESULT INTERFACE
// // ============================================
// export interface PingResult {
//   success: boolean;
//   statusCode?: number;
//   responseTimeMs: number;
//   isWakeUp: boolean;
//   error?: string;
//   errorType?: string;
//   jsonResponse?: any;
//   responsePreview?: string;
// }

// // ============================================
// // SSL RESULT INTERFACE
// // ============================================
// export interface SSLResult {
//   valid: boolean;
//   expiryDays: number;
//   error?: string;
// }

// // ============================================
// // CORE PING FUNCTION - Aggressive wake-up logic
// // ============================================
// export class PingWorker {
  
//   /**
//    * Execute a single ping with aggressive timeout and retry logic
//    * This replicates Python's: session.get(url, timeout=60) with retry session
//    */
//   static async pingUrl(
//     url: string,
//     timeoutMs: number = PING_CONFIG.DEFAULT_TIMEOUT_MS,
//     retryCount: number = 0
//   ): Promise<PingResult> {
//     const startTime = Date.now();
    
//     // Create AbortController for timeout (like Python's timeout parameter)
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
//     try {
//       console.log(`  ⏳ Pinging: ${url} (attempt ${retryCount + 1}/${PING_CONFIG.MAX_RETRIES + 1})`);
      
//       // Execute fetch with abort signal
//       const response = await fetch(url, {
//         signal: controller.signal,
//         headers: {
//           'User-Agent': 'PingForge-Monitor/2.0',
//           'X-Ping-ID': crypto.randomUUID(),
//           'Accept': 'application/json, */*',
//         },
//         // Don't follow redirects automatically to capture status accurately
//         redirect: 'manual',
//       });
      
//       clearTimeout(timeoutId);
//       const responseTime = Date.now() - startTime;
      
//       // DETECT WAKE-UP: Response time > 5 seconds indicates cold start
//       const isWakeUp = responseTime > PING_CONFIG.WAKEUP_THRESHOLD_MS;
      
//       // Check if status code indicates success (2xx or 3xx)
//       const success = response.status >= 200 && response.status < 400;
      
//       // Try to capture JSON response (like Python's response.json())
//       let jsonResponse = null;
//       let responsePreview = null;
      
//       const contentType = response.headers.get('content-type');
//       if (contentType?.includes('application/json')) {
//         try {
//           const text = await response.text();
//           jsonResponse = JSON.parse(text);
//           responsePreview = text.substring(0, 500);
//         } catch {
//           // Not valid JSON
//         }
//       } else {
//         // Capture preview for non-JSON responses
//         try {
//           const text = await response.text();
//           responsePreview = text.substring(0, 500);
//         } catch {
//           // Unable to read body
//         }
//       }
      
//       // Log result with emoji (like Python version)
//       const wakeEmoji = isWakeUp ? '🌙💤➡️✅' : '✅';
//       console.log(`  ${wakeEmoji} Response: ${response.status} | ${responseTime}ms | Wake-up: ${isWakeUp}`);
      
//       return {
//         success,
//         statusCode: response.status,
//         responseTimeMs: responseTime,
//         isWakeUp,
//         jsonResponse: jsonResponse || undefined,
//         responsePreview: responsePreview || undefined,
//       };
      
//     } catch (error: any) {
//       clearTimeout(timeoutId);
      
//       // Handle timeout (server sleeping)
//       if (error.name === 'AbortError') {
//         console.log(`  ⏰ Timeout after ${timeoutMs}ms - Server may be sleeping`);
        
//         // 🚀 FIXED: Point context explicitly to class wrapper instead of "this" to survive isolated async scope errors
//         if (retryCount < PING_CONFIG.MAX_RETRIES) {
//           const backoffDelay = PING_CONFIG.RETRY_BACKOFF_MS * (retryCount + 1);
//           console.log(`  🔄 Retry ${retryCount + 1}/${PING_CONFIG.MAX_RETRIES} after ${backoffDelay}ms...`);
//           await new Promise(resolve => setTimeout(resolve, backoffDelay));
//           return PingWorker.pingUrl(url, timeoutMs, retryCount + 1);
//         }
        
//         return {
//           success: false,
//           responseTimeMs: timeoutMs,
//           isWakeUp: false,
//           error: `Timeout after ${timeoutMs}ms - Server may be sleeping or down`,
//           errorType: 'timeout',
//         };
//       }
      
//       // Network errors
//       let errorType = 'network_error';
//       if (error.message?.includes('ENOTFOUND')) errorType = 'dns_error';
//       if (error.message?.includes('ECONNREFUSED')) errorType = 'connection_refused';
//       if (error.message?.includes('CERT')) errorType = 'ssl_error';
//       if (error.message?.includes('fetch')) errorType = 'fetch_error';
      
//       console.log(`  ❌ Error: ${error.message}`);
      
//       return {
//         success: false,
//         responseTimeMs: Date.now() - startTime,
//         isWakeUp: false,
//         error: error.message,
//         errorType,
//       };
//     }
//   }

//   /**
//    * Execute complete monitor ping cycle with database storage
//    */
//   static async executeMonitorPing(monitorId: number): Promise<PingResult | null> {
//     try {
//       // Ensure database connection
//       if (!dbManager.isConnected()) {
//         await dbManager.connect();
//       }
      
//       // FIXED: Await the async method invocation to cleanly resolve the active Drizzle context instance
//       const db = await dbManager.getDb();
      
//       // Get monitor configuration
//       const monitorResults = await db.select().from(monitors).where(eq(monitors.id, monitorId));
      
//       if (monitorResults.length === 0) {
//         console.log(`❌ Monitor ${monitorId} not found`);
//         return null;
//       }
      
//       const monitor = monitorResults[0];
      
//       if (!monitor.isActive) {
//         console.log(`⏸️ Monitor ${monitor.name} is inactive, skipping`);
//         return null;
//       }
      
//       console.log(`\n🔍 Pinging monitor: ${monitor.name}`);
//       console.log(`   URL: ${monitor.url}`);
//       console.log(`   Timeout: ${monitor.timeoutMs}ms | Interval: ${monitor.intervalSeconds}s`);
      
//       // Execute the ping with aggressive retry logic
//       const pingResult = await PingWorker.pingUrl(monitor.url, monitor.timeoutMs);

//       // FIXED: Safely stringify JSONB objects before database insertion to prevent payload mapping conflicts
//       const jsonResponseString = pingResult.jsonResponse ? JSON.stringify(pingResult.jsonResponse) : null;
      
//       // Store result in database
//       const [savedResult] = await db.insert(pingResults).values({
//         monitorId: monitor.id,
//         statusCode: pingResult.statusCode,
//         responseTimeMs: pingResult.responseTimeMs,
//         success: pingResult.success,
//         isWakeUp: pingResult.isWakeUp,
//         errorMessage: pingResult.error || null,
//         errorType: pingResult.errorType || null,
//         responsePreview: pingResult.responsePreview || null,
//         jsonResponse: jsonResponseString,
//         pingRegion: monitor.region || 'auto',
//         createdAt: new Date(),
//       }).returning();
      
//       console.log(`   📊 Result stored (ID: ${savedResult.id})`);
      
//       // Update monitor statistics
//       const totalPings = (monitor.totalPings || 0) + 1;
//       const successfulPings = (monitor.successfulPings || 0) + (pingResult.success ? 1 : 0);
//       const uptimePercentage = (successfulPings / totalPings) * 100;
      
//       // Calculate new average response time
//       const currentAvg = monitor.averageResponseMs || 0;
//       const newAvg = Math.round(((currentAvg * (totalPings - 1)) + pingResult.responseTimeMs) / totalPings);
      
//       // Determine new status based on recent results
//       let newStatus = monitor.status;
//       if (pingResult.success) {
//         newStatus = pingResult.isWakeUp ? 'waking' : 'up';
//       } else {
//         // Check last 5 pings for status
//         const recentPings = await db.select()
//           .from(pingResults)
//           .where(eq(pingResults.monitorId, monitor.id))
//           .orderBy(desc(pingResults.createdAt))
//           .limit(5);
        
//         const recentSuccesses = recentPings.filter(p => p.success).length;
//         if (recentSuccesses === 0) {
//           newStatus = 'down';
//         } else if (recentSuccesses < 3) {
//           newStatus = 'degraded';
//         }
//       }
      
//       // Calculate next ping time
//       const nextPingAt = new Date(Date.now() + (monitor.intervalSeconds * 1000));
      
//       // Update monitor record
//       await db.update(monitors)
//         .set({
//           totalPings,
//           successfulPings,
//           uptimePercentage: uptimePercentage.toFixed(2),
//           averageResponseMs: newAvg,
//           status: newStatus as any,
//           lastPingAt: new Date(),
//           nextPingAt,
//           updatedAt: new Date(),
//         })
//         .where(eq(monitors.id, monitor.id));
      
//       // Log summary with emoji (like Python version)
//       const statusEmoji = pingResult.success 
//         ? (pingResult.isWakeUp ? '🌙✅' : '✅') 
//         : '❌';
//       const wakeText = pingResult.isWakeUp ? ' [WAKE-UP DETECTED]' : '';
      
//       console.log(`   ${statusEmoji} ${pingResult.success ? 'SUCCESS' : 'FAILED'} | ${pingResult.responseTimeMs}ms${wakeText}`);
      
//       return pingResult;
      
//     } catch (error) {
//       console.error(`❌ Failed to execute ping for monitor ${monitorId}:`, error);
//       return null;
//     }
//   }
// }































// lib/ping-engine/worker.ts
// CORE PING ENGINE - Aggressive wake-up detection with 60-second timeout + retries
// Replicates Python's wake-up logic: 60s timeout, 3 retries, 5s threshold detection

import { dbManager } from '@/lib/db';
import { monitors, pingResults } from '@/lib/db/schema';
import { eq, desc, and, or, lte, isNull } from 'drizzle-orm';

// ============================================
// CONFIGURATION - Matches Python's aggressive settings
// ============================================
const PING_CONFIG = {
  MAX_RETRIES: 3,                    // Same as Python's total=3
  RETRY_BACKOFF_MS: 3000,            // Same as Python's backoff_factor=3 (3s, 9s, 27s)
  WAKEUP_THRESHOLD_MS: 5000,         // Response > 5 seconds = cold start detection
  DEFAULT_TIMEOUT_MS: 60000,         // 60 seconds - CRITICAL for waking sleeping servers
};

// ============================================
// PING RESULT INTERFACE
// ============================================
export interface PingResult {
  success: boolean;
  statusCode?: number;
  responseTimeMs: number;
  isWakeUp: boolean;
  error?: string;
  errorType?: string;
  jsonResponse?: any;
  responsePreview?: string;
}

// ============================================
// SSL RESULT INTERFACE
// ============================================
export interface SSLResult {
  valid: boolean;
  expiryDays: number;
  error?: string;
}

// ============================================
// CORE PING FUNCTIONALITIES
// ============================================
export class PingWorker {
  
  /**
   * Execute a single ping with aggressive timeout and retry logic
   * This replicates Python's: session.get(url, timeout=60) with retry session
   */
  static async pingUrl(
    url: string,
    timeoutMs: number = PING_CONFIG.DEFAULT_TIMEOUT_MS,
    retryCount: number = 0
  ): Promise<PingResult> {
    const startTime = Date.now();
    
    // Create AbortController for timeout (like Python's timeout parameter)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      console.log(`  ⏳ Pinging: ${url} (attempt ${retryCount + 1}/${PING_CONFIG.MAX_RETRIES + 1})`);
      
      // Execute fetch with abort signal
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'PingForge-Monitor/2.0',
          'X-Ping-ID': crypto.randomUUID(),
          'Accept': 'application/json, */*',
        },
        // Don't follow redirects automatically to capture status accurately
        redirect: 'manual',
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      // DETECT WAKE-UP: Response time > 5 seconds indicates cold start
      const isWakeUp = responseTime > PING_CONFIG.WAKEUP_THRESHOLD_MS;
      
      // Check if status code indicates success (2xx or 3xx)
      const success = response.status >= 200 && response.status < 400;
      
      // Try to capture JSON response (like Python's response.json())
      let jsonResponse = null;
      let responsePreview = null;
      
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        try {
          const text = await response.text();
          jsonResponse = JSON.parse(text);
          responsePreview = text.substring(0, 500);
        } catch {
          // Not valid JSON
        }
      } else {
        // Capture preview for non-JSON responses
        try {
          const text = await response.text();
          responsePreview = text.substring(0, 500);
        } catch {
          // Unable to read body
        }
      }
      
      // Log result with emoji (like Python version)
      const wakeEmoji = isWakeUp ? '🌙💤➡️✅' : '✅';
      console.log(`  ${wakeEmoji} Response: ${response.status} | ${responseTime}ms | Wake-up: ${isWakeUp}`);
      
      return {
        success,
        statusCode: response.status,
        responseTimeMs: responseTime,
        isWakeUp,
        jsonResponse: jsonResponse || undefined,
        responsePreview: responsePreview || undefined,
      };
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle timeout (server sleeping)
      if (error.name === 'AbortError') {
        console.log(`  ⏰ Timeout after ${timeoutMs}ms - Server may be sleeping`);
        
        if (retryCount < PING_CONFIG.MAX_RETRIES) {
          const backoffDelay = PING_CONFIG.RETRY_BACKOFF_MS * (retryCount + 1);
          console.log(`  🔄 Retry ${retryCount + 1}/${PING_CONFIG.MAX_RETRIES} after ${backoffDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          return PingWorker.pingUrl(url, timeoutMs, retryCount + 1);
        }
        
        return {
          success: false,
          responseTimeMs: timeoutMs,
          isWakeUp: false,
          error: `Timeout after ${timeoutMs}ms - Server may be sleeping or down`,
          errorType: 'timeout',
        };
      }
      
      // Network errors
      let errorType = 'network_error';
      if (error.message?.includes('ENOTFOUND')) errorType = 'dns_error';
      if (error.message?.includes('ECONNREFUSED')) errorType = 'connection_refused';
      if (error.message?.includes('CERT')) errorType = 'ssl_error';
      if (error.message?.includes('fetch')) errorType = 'fetch_error';
      
      console.log(`  ❌ Error: ${error.message}`);
      
      return {
        success: false,
        responseTimeMs: Date.now() - startTime,
        isWakeUp: false,
        error: error.message,
        errorType,
      };
    }
  }

  /**
   * Execute complete monitor ping cycle with database storage
   */
  static async executeMonitorPing(monitorId: number): Promise<PingResult | null> {
    try {
      // Ensure database connection
      if (!dbManager.isConnected()) {
        await dbManager.connect();
      }
      
      const db = await dbManager.getDb();
      
      // Get monitor configuration
      const monitorResults = await db.select().from(monitors).where(eq(monitors.id, monitorId));
      
      if (monitorResults.length === 0) {
        console.log(`❌ Monitor ${monitorId} not found`);
        return null;
      }
      
      const monitor = monitorResults[0];
      
      if (!monitor.isActive) {
        console.log(`⏸️ Monitor ${monitor.name} is inactive, skipping`);
        return null;
      }
      
      console.log(`\n🔍 Pinging monitor: ${monitor.name}`);
      console.log(`   URL: ${monitor.url}`);
      console.log(`   Timeout: ${monitor.timeoutMs}ms | Interval: ${monitor.intervalSeconds}s`);
      
      // Execute the ping with aggressive retry logic
      const pingResult = await PingWorker.pingUrl(monitor.url, monitor.timeoutMs);

      // Safely stringify JSONB objects before database insertion to prevent payload mapping conflicts
      const jsonResponseString = pingResult.jsonResponse ? JSON.stringify(pingResult.jsonResponse) : null;
      
      // Store result in database
      const [savedResult] = await db.insert(pingResults).values({
        monitorId: monitor.id,
        statusCode: pingResult.statusCode,
        responseTimeMs: pingResult.responseTimeMs,
        success: pingResult.success,
        isWakeUp: pingResult.isWakeUp,
        errorMessage: pingResult.error || null,
        errorType: pingResult.errorType || null,
        responsePreview: pingResult.responsePreview || null,
        jsonResponse: jsonResponseString,
        pingRegion: monitor.region || 'auto',
        createdAt: new Date(),
      }).returning();
      
      console.log(`    📊 Result stored (ID: ${savedResult.id})`);
      
      // Update monitor statistics
      const totalPings = (monitor.totalPings || 0) + 1;
      const successfulPings = (monitor.successfulPings || 0) + (pingResult.success ? 1 : 0);
      const uptimePercentage = (successfulPings / totalPings) * 100;
      
      // Calculate new average response time
      const currentAvg = monitor.averageResponseMs || 0;
      const newAvg = Math.round(((currentAvg * (totalPings - 1)) + pingResult.responseTimeMs) / totalPings);
      
      // Determine new status based on recent results
      let newStatus = monitor.status;
      if (pingResult.success) {
        newStatus = pingResult.isWakeUp ? 'waking' : 'up';
      } else {
        // Check last 5 pings for status
        const recentPings = await db.select()
          .from(pingResults)
          .where(eq(pingResults.monitorId, monitor.id))
          .orderBy(desc(pingResults.createdAt))
          .limit(5);
        
        const recentSuccesses = recentPings.filter(p => p.success).length;
        if (recentSuccesses === 0) {
          newStatus = 'down';
        } else if (recentSuccesses < 3) {
          newStatus = 'degraded';
        }
      }
      
      // Calculate next ping time
      const nextPingAt = new Date(Date.now() + (monitor.intervalSeconds * 1000));
      
      // Update monitor record
      await db.update(monitors)
        .set({
          totalPings,
          successfulPings,
          uptimePercentage: uptimePercentage.toFixed(2),
          averageResponseMs: newAvg,
          status: newStatus as any,
          lastPingAt: new Date(),
          nextPingAt,
          updatedAt: new Date(),
        })
        .where(eq(monitors.id, monitor.id));
      
      // Log summary with emoji (like Python version)
      const statusEmoji = pingResult.success 
        ? (pingResult.isWakeUp ? '🌙✅' : '✅') 
        : '❌';
      const wakeText = pingResult.isWakeUp ? ' [WAKE-UP DETECTED]' : '';
      
      console.log(`   ${statusEmoji} ${pingResult.success ? 'SUCCESS' : 'FAILED'} | ${pingResult.responseTimeMs}ms${wakeText}`);
      
      return pingResult;
      
    } catch (error) {
      console.error(`❌ Failed to execute ping for monitor ${monitorId}:`, error);
      return null;
    }
  }

  /**
   * Process all due monitors and execute their pings.
   * Efficiently targets DB filtering to avoid in-memory filtering blocks.
   * Used by both local node-cron loop routines and Vercel cloud architecture triggers.
   */
  static async processDueMonitors(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
  }> {
    try {
      if (!dbManager.isConnected()) {
        await dbManager.connect();
      }
      
      const db = await dbManager.getDb();
      const now = new Date();
      
      // Optimized DB filter: Fetch only monitors where isActive is true AND (nextPingAt <= now OR nextPingAt IS NULL)
      const dueMonitors = await db
        .select()
        .from(monitors)
        .where(
          and(
            eq(monitors.isActive, true),
            or(
              lte(monitors.nextPingAt, now),
              isNull(monitors.nextPingAt)
            )
          )
        );
      
      if (dueMonitors.length === 0) {
        console.log('📭 No monitors due for ping at this time');
        return { processed: 0, succeeded: 0, failed: 0, skipped: 0 };
      }
      
      console.log(`📊 Found ${dueMonitors.length} monitors due for ping at ${now.toISOString()}`);
      
      // Process in batches of 10 to protect external network sockets and system resources
      const batchSize = 10;
      const results = {
        processed: 0,
        succeeded: 0,
        failed: 0,
        skipped: 0,
      };
      
      for (let i = 0; i < dueMonitors.length; i += batchSize) {
        const batch = dueMonitors.slice(i, i + batchSize);
        console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(dueMonitors.length / batchSize)}`);
        
        // Execute pings concurrently within the specific batch window
        const batchResults = await Promise.allSettled(
          batch.map(monitor => PingWorker.executeMonitorPing(monitor.id))
        );
        
        for (const result of batchResults) {
          results.processed++;
          if (result.status === 'fulfilled' && result.value !== null) {
            results.succeeded++;
          } else if (result.status === 'fulfilled' && result.value === null) {
            results.skipped++;
          } else {
            results.failed++;
          }
        }
        
        // Small cooldown delay between batches to protect external network rates
        if (i + batchSize < dueMonitors.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log(`✅ Cron cycle complete: ${results.succeeded} succeeded, ${results.failed} failed, ${results.skipped} skipped`);
      return results;
      
    } catch (error) {
      console.error('❌ Failed to process due monitors:', error);
      return { processed: 0, succeeded: 0, failed: 0, skipped: 0 };
    }
  }
}

