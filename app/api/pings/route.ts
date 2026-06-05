
// // app/api/pings/route.ts
// // Ping History API - Retrieve paginated telemetry ping logs for monitoring
// // Optimized to execute high-performance indexed queries directly on PostgreSQL
// // ✅ Includes wake-up detection, JSON responses, and SSL certificate data

// import { NextRequest, NextResponse } from 'next/server';
// import { dbManager } from '@/lib/db';
// import { pingResults } from '@/lib/db/schema';
// import { eq, desc, sql } from 'drizzle-orm';

// export const dynamic = 'force-dynamic';

// function corsResponse(data: any, status = 200) {
//   return NextResponse.json(data, {
//     status,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
//     },
//   });
// }

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
//     },
//   });
// }

// function isAuthorized(request: NextRequest): boolean {
//   const apiKey = request.headers.get('X-API-Key');
//   const validKey = process.env.EXTERNAL_API_KEY || 'my-super-secret-key-123';
//   return apiKey === validKey;
// }

// export async function GET(request: NextRequest) {
//   try {
//     if (!isAuthorized(request)) {
//       return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401);
//     }
    
//     const searchParams = request.nextUrl.searchParams;
//     const monitorIdStr = searchParams.get('monitorId');
//     const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50')));
//     const offset = Math.max(0, parseInt(searchParams.get('offset') || '0'));
    
//     if (!dbManager.isConnected()) {
//       await dbManager.connect();
//     }
    
//     const db = await dbManager.getDb();
    
//     let baseConditions = undefined;
//     if (monitorIdStr) {
//       const parsedId = parseInt(monitorIdStr);
//       if (!isNaN(parsedId)) {
//         baseConditions = eq(pingResults.monitorId, parsedId);
//       }
//     }

//     // Count query for pagination
//     let countQuery: any = db.select({ count: sql<number>`count(*)` }).from(pingResults);
//     if (baseConditions) {
//       countQuery = countQuery.where(baseConditions);
//     }
//     const [countResult] = await countQuery;
//     const totalRecords = Number(countResult?.count || 0);

//     // Data query - selecting all fields including new ones
//     let queryBuilder: any = db.select().from(pingResults);
//     if (baseConditions) {
//       queryBuilder = queryBuilder.where(baseConditions);
//     }
    
//     const rawPings = await queryBuilder
//       .orderBy(desc(pingResults.createdAt))
//       .limit(limit)
//       .offset(offset);
    
//     // ✅ Format pings to ensure all fields are properly exposed
//     const formattedPings = rawPings.map((ping: any) => ({
//       id: ping.id,
//       monitorId: ping.monitorId,
//       statusCode: ping.statusCode,
//       responseTimeMs: ping.responseTimeMs,
//       success: ping.success,
//       // 🚀 WAKE-UP DETECTION FIELD - Critical for UI display
//       isWakeUp: ping.isWakeUp || false,
//       errorMessage: ping.errorMessage,
//       errorType: ping.errorType,
//       responsePreview: ping.responsePreview,
//       // 🚀 JSON RESPONSE FIELD - For API response viewer
//       jsonResponse: ping.jsonResponse || null,
//       // 🚀 SSL CERTIFICATE FIELDS - For expiry monitoring
//       sslValid: ping.sslValid,
//       sslExpiryDays: ping.sslExpiryDays,
//       pingRegion: ping.pingRegion,
//       pingLatencyMs: ping.pingLatencyMs,
//       createdAt: ping.createdAt,
//     }));
    
//     return corsResponse({
//       success: true,
//       pings: formattedPings,
//       total: totalRecords,
//       limit,
//       offset,
//     });
    
//   } catch (error: any) {
//     console.error('Error fetching pings telemetry log metrics:', error);
//     return corsResponse({ error: 'Internal pipeline analytics transmission exception', details: error.message }, 500);
//   }
// }

























// app/api/pings/route.ts
// Ping History API - Retrieve paginated telemetry logs or execute authorized individual/batch deletions
// Optimized to execute high-performance indexed queries directly on PostgreSQL
// Secured with NextAuth Session validation and fallback X-API-Key authentication

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbManager } from '@/lib/db';
import { pingResults, monitors } from '@/lib/db/schema';
import { eq, desc, sql, inArray, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}

function isAuthorized(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key');
  const validKey = process.env.EXTERNAL_API_KEY || 'my-super-secret-key-123';
  return apiKey === validKey;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401);
    }
    
    const searchParams = request.nextUrl.searchParams;
    const monitorIdStr = searchParams.get('monitorId');
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50')));
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0'));
    
    if (!dbManager.isConnected()) {
      await dbManager.connect();
    }
    
    const db = await dbManager.getDb();
    
    let baseConditions = undefined;
    if (monitorIdStr) {
      const parsedId = parseInt(monitorIdStr);
      if (!isNaN(parsedId)) {
        baseConditions = eq(pingResults.monitorId, parsedId);
      }
    }

    let countQuery: any = db.select({ count: sql<number>`count(*)` }).from(pingResults);
    if (baseConditions) {
      countQuery = countQuery.where(baseConditions);
    }
    const [countResult] = await countQuery;
    const totalRecords = Number(countResult?.count || 0);

    let queryBuilder: any = db.select().from(pingResults);
    if (baseConditions) {
      queryBuilder = queryBuilder.where(baseConditions);
    }
    
    const rawPings = await queryBuilder
      .orderBy(desc(pingResults.createdAt))
      .limit(limit)
      .offset(offset);
    
    const formattedPings = rawPings.map((ping: any) => ({
      id: ping.id,
      monitorId: ping.monitorId,
      statusCode: ping.statusCode,
      responseTimeMs: ping.responseTimeMs,
      success: ping.success,
      isWakeUp: ping.isWakeUp || false,
      errorMessage: ping.errorMessage,
      errorType: ping.errorType,
      responsePreview: ping.responsePreview,
      jsonResponse: ping.jsonResponse || null,
      sslValid: ping.sslValid,
      sslExpiryDays: ping.sslExpiryDays,
      pingRegion: ping.pingRegion,
      pingLatencyMs: ping.pingLatencyMs,
      createdAt: ping.createdAt,
    }));
    
    return corsResponse({
      success: true,
      pings: formattedPings,
      total: totalRecords,
      limit,
      offset,
    });
    
  } catch (error: any) {
    console.error('Error fetching pings telemetry log metrics:', error);
    return corsResponse({ error: 'Internal pipeline analytics transmission exception', details: error.message }, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 🔐 Try authenticating via frontend session context first
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    // 🔑 Fallback authentication verification
    const isApiKeyValid = isAuthorized(request);

    if (!userEmail && !isApiKeyValid) {
      return corsResponse({ error: 'Unauthorized. Authenticated session or valid X-API-Key required.' }, 401);
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const monitorId = searchParams.get('monitorId');
    const idsParam = searchParams.get('ids');

    if (!dbManager.isConnected()) {
      await dbManager.connect();
    }

    const db = await dbManager.getDb();

    // 🛡️ MODE 1: CLEAR ALL LOGS FOR SPECIFIC MONITOR
    if (action === 'clear-all' && monitorId) {
      const parsedMonitorId = parseInt(monitorId);
      if (isNaN(parsedMonitorId)) {
        return corsResponse({ error: 'Invalid monitor ID configuration format' }, 400);
      }

      // Verify monitor identity and strict ownership footprints
      const monitor = await db.select().from(monitors).where(eq(monitors.id, parsedMonitorId));
      if (monitor.length === 0) {
        return corsResponse({ error: 'Targeted monitor profile not found' }, 404);
      }

      if (userEmail && monitor[0].userEmail !== userEmail) {
        return corsResponse({ error: 'Forbidden. Inbound identity does not own this monitor topology.' }, 403);
      }

      // Purge telemetry array logs belonging to this specific node
      const deleted = await db.delete(pingResults).where(eq(pingResults.monitorId, parsedMonitorId)).returning();
      
      console.log(`🗑️ [API] Purged all ${deleted.length} ping logs for monitor: "${monitor[0].name}"`);

      return corsResponse({
        success: true,
        message: `Successfully cleared all ${deleted.length} ping records`,
        deletedCount: deleted.length,
      });
    }

    // 🛡️ MODE 2: BATCH SELECTION MANIFEST DELETION
    if (idsParam) {
      const ids = idsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      
      if (ids.length === 0) {
        return corsResponse({ error: 'No valid target log IDs provided in list parameter' }, 400);
      }

      const maxBatchLimit = parseInt(process.env.MAX_BATCH_DELETE || '100');
      if (ids.length > maxBatchLimit) {
        return corsResponse({ error: `Payload restriction error. Cannot delete more than ${maxBatchLimit} items simultaneously.` }, 400);
      }

      // Pull targeted records to audit their internal monitor mapping context
      const targetedPings = await db.select().from(pingResults).where(inArray(pingResults.id, ids));
      if (targetedPings.length === 0) {
        return corsResponse({ error: 'No matching telemetry records found in storage layers' }, 404);
      }

      // Extract discrete parent monitor IDs referenced across targets
      const distinctMonitorIds = Array.from(new Set(targetedPings.map(p => p.monitorId)));

      // If running via UI user session context, check user boundaries across linked profiles
      if (userEmail) {
        const structuralMonitors = await db.select().from(monitors).where(inArray(monitors.id, distinctMonitorIds));
        const nonOwnedViolations = structuralMonitors.filter(m => m.userEmail !== userEmail);
        
        if (nonOwnedViolations.length > 0) {
          return corsResponse({ error: 'Forbidden. Attempted data modification across unauthorized service layers.' }, 403);
        }
      }

      // Execute atomic vector list cleanup
      const deleted = await db.delete(pingResults).where(inArray(pingResults.id, ids)).returning();

      console.log(`🗑️ [API] Successfully executed batch wipe of ${deleted.length} telemetry logs`);

      return corsResponse({
        success: true,
        message: `Successfully deleted ${deleted.length} selected ping logs`,
        deletedCount: deleted.length,
        deletedIds: deleted.map(p => p.id),
      });
    }

    return corsResponse({ error: 'Missing functional target parameter layout: action, monitorId, or ids' }, 400);
    
  } catch (error: any) {
    console.error('CRITICAL: Error during structural batch wipe execution:', error);
    return corsResponse({ error: 'Internal pipeline optimization exception', details: error.message }, 500);
  }
}