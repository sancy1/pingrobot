// app/api/health/db/route.ts
import { NextResponse } from 'next/server';
import { dbManager } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!dbManager.isConnected() && dbManager.getState().status === 'disconnected') {
      console.log('🔌 Health endpoint triggered database bootstrap initialization...');
      await dbManager.connect();
    }

    const state = dbManager.getState();
    const isConnected = dbManager.isConnected();

    let verified = false;
    let tables: string[] = [];
    let monitorCount = 0;
    let postgresVersion = '';
    let currentTime = '';

    if (isConnected) {
      try {
        const sql = dbManager.getSql();

        // Cast to array — fixes "length does not exist on FullQueryResults"
        const testResult = await sql`SELECT 1 as verified` as Record<string, any>[];
        verified = testResult != null && testResult.length > 0;

        if (verified) {
          const versionResult = await sql`SELECT version() as version` as Record<string, any>[];
          postgresVersion = versionResult[0]?.version || 'Unknown';

          const timeResult = await sql`SELECT NOW() as current_time` as Record<string, any>[];
          currentTime = timeResult[0]?.current_time || '';

          const tableResult = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
          ` as Record<string, any>[];

          tables = tableResult.map((t: any) => t.table_name as string);

          if (tables.includes('monitors')) {
            const countResult = await sql`SELECT COUNT(*) as count FROM monitors` as Record<string, any>[];
            const rawCount = countResult?.[0]?.count || '0';
            monitorCount = parseInt(rawCount as string, 10);
          }
        }
      } catch (error) {
        verified = false;
        console.error('Verification query failed:', error);
      }
    }

    const response = {
      success: isConnected && verified,
      status: state.status,
      message: isConnected && verified
        ? '✅ Database connection is healthy and verified'
        : isConnected
          ? '⚠️ Connection exists but verification failed'
          : '❌ Database connection is not established',
      details: {
        isConnected,
        verified,
        status: state.status,
        lastConnectedAt: state.lastConnectedAt?.toISOString() || null,
        lastError: state.lastError?.message || null,
        retryCount: state.retryCount,
        failureCount: state.failureCount,
      },
      database: {
        postgresVersion: postgresVersion || 'Not available',
        currentTime: currentTime || 'Not available',
        tables: tables,
        monitorCount: monitorCount,
        hasMonitorsTable: tables.includes('monitors'),
        hasPingResultsTable: tables.includes('ping_results'),
        hasHealthMetricsTable: tables.includes('health_metrics'),
        hasAlertsTable: tables.includes('alerts'),
      },
      config: {
        maxRetryAttempts: 6,
        baseRetryDelayMs: 1000,
        maxRetryDelayMs: 32000,
        healthCheckIntervalSeconds: 30,
        circuitBreakerThreshold: 6,
        circuitBreakerResetSeconds: 60,
      },
      timestamp: new Date().toISOString(),
    };

    const statusCode = isConnected && verified ? 200 : 503;
    return NextResponse.json(response, { status: statusCode });

  } catch (error: any) {
    console.error('Health check endpoint error:', error);

    return NextResponse.json(
      {
        success: false,
        status: 'error',
        message: 'Health check endpoint encountered an error',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}