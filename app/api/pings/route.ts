// // app/api/pings/route.ts
// // Ping History API - Retrieve paginated telemetry ping logs for monitoring
// // Optimized to execute high-performance indexed queries directly on PostgreSQL

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

//     // 🚀 FIXED: Type-casted the statement configurations to 'any' to break Drizzle's strict method-chain tracking loops
//     let countQuery: any = db.select({ count: sql<number>`count(*)` }).from(pingResults);
//     if (baseConditions) {
//       countQuery = countQuery.where(baseConditions);
//     }
//     const [countResult] = await countQuery;
//     const totalRecords = Number(countResult?.count || 0);

//     // 🚀 FIXED: Applied the same 'any' statement pattern to the data query builder
//     let queryBuilder: any = db.select().from(pingResults);
//     if (baseConditions) {
//       queryBuilder = queryBuilder.where(baseConditions);
//     }
    
//     const pings = await queryBuilder
//       .orderBy(desc(pingResults.createdAt))
//       .limit(limit)
//       .offset(offset);
    
//     return corsResponse({
//       success: true,
//       pings,
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
// Ping History API - Retrieve paginated telemetry ping logs for monitoring
// Optimized to execute high-performance indexed queries directly on PostgreSQL
// ✅ Includes wake-up detection, JSON responses, and SSL certificate data

import { NextRequest, NextResponse } from 'next/server';
import { dbManager } from '@/lib/db';
import { pingResults } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    // Count query for pagination
    let countQuery: any = db.select({ count: sql<number>`count(*)` }).from(pingResults);
    if (baseConditions) {
      countQuery = countQuery.where(baseConditions);
    }
    const [countResult] = await countQuery;
    const totalRecords = Number(countResult?.count || 0);

    // Data query - selecting all fields including new ones
    let queryBuilder: any = db.select().from(pingResults);
    if (baseConditions) {
      queryBuilder = queryBuilder.where(baseConditions);
    }
    
    const rawPings = await queryBuilder
      .orderBy(desc(pingResults.createdAt))
      .limit(limit)
      .offset(offset);
    
    // ✅ Format pings to ensure all fields are properly exposed
    const formattedPings = rawPings.map((ping: any) => ({
      id: ping.id,
      monitorId: ping.monitorId,
      statusCode: ping.statusCode,
      responseTimeMs: ping.responseTimeMs,
      success: ping.success,
      // 🚀 WAKE-UP DETECTION FIELD - Critical for UI display
      isWakeUp: ping.isWakeUp || false,
      errorMessage: ping.errorMessage,
      errorType: ping.errorType,
      responsePreview: ping.responsePreview,
      // 🚀 JSON RESPONSE FIELD - For API response viewer
      jsonResponse: ping.jsonResponse || null,
      // 🚀 SSL CERTIFICATE FIELDS - For expiry monitoring
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