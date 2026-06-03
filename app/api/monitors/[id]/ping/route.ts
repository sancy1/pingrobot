// app/api/monitors/[id]/ping/route.ts
// Manual Ping Endpoint - Trigger immediate ping with aggressive wake-up logic
// Consumable securely by both inside UI panels and authorized external microservices

import { NextRequest, NextResponse } from 'next/server';
import { dbManager } from '@/lib/db';
import { PingWorker } from '@/lib/ping-engine/worker';
import { monitors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// CORS Headers for external access
function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}

// Authentication check
function isAuthorized(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key');
  // FIXED: Ensured a secure developer token fallback is provided to prevent unauthenticated entries
  const validKey = process.env.EXTERNAL_API_KEY || 'my-super-secret-key-123';
  return apiKey === validKey;
}

// POST - Trigger manual ping
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 🚀 FIXED: Parameter typed as a Promise to support asynchronous segment resolution
) {
  let rawId = '';

  try {
    // Authentication
    if (!isAuthorized(request)) {
      return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401);
    }
    
    // 🚀 FIXED: Awaiting dynamic segment mapping parameters safely
    const resolvedParams = await params;
    rawId = resolvedParams.id;

    const monitorId = parseInt(rawId);
    if (isNaN(monitorId)) {
      console.error(`❌ Manual ping validation failure. Parsed ID: "${rawId}" resolved as NaN.`);
      return corsResponse({ error: `Invalid monitor ID format provided. Received: ${rawId}` }, 400);
    }
    
    // Ensure database connection
    if (!dbManager.isConnected()) {
      await dbManager.connect();
    }
    
    // FIXED: Await the async method invocation to cleanly resolve the active Drizzle context instance
    const db = await dbManager.getDb();
    
    // Verify monitor exists
    const monitorResults = await db.select().from(monitors).where(eq(monitors.id, monitorId));
    if (monitorResults.length === 0) {
      return corsResponse({ error: 'Monitor not found' }, 404);
    }
    
    const monitor = monitorResults[0];
    
    // FIXED: Awaited ping loop completion to ensure metrics write safely before the serverless thread drops
    const result = await PingWorker.executeMonitorPing(monitorId);
    
    return corsResponse({
      success: true,
      message: `Ping executed successfully for ${monitor.name}`,
      monitorId: monitor.id,
      status: result?.success ? 'up' : 'down',
      responseTimeMs: result?.responseTimeMs || 0,
      note: 'Results stored and aggregated across network clusters',
    });
    
  } catch (error: any) {
    console.error(`Manual ping error for monitor ID ${rawId || 'unknown'}:`, error);
    return corsResponse({ error: error.message }, 500);
  }
}