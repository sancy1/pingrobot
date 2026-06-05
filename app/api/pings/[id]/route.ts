// // // app/api/pings/[id]/route.ts
// // // DELETE single ping result by ID
// // // Secured with NextAuth User Session validation and fallback X-API-Key authentication

// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth'; // Ensure this matches your NextAuth config import path
// import { dbManager } from '@/lib/db';
// import { pingResults, monitors } from '@/lib/db/schema';
// import { eq } from 'drizzle-orm';

// export const dynamic = 'force-dynamic';

// function corsResponse(data: any, status = 200) {
//   return NextResponse.json(data, {
//     status,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
//     },
//   });
// }

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
//     },
//   });
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     // 🔐 Try authenticating via user session first (Frontend app requests)
//     const session = await getServerSession(authOptions);
//     const userEmail = session?.user?.email;

//     // 🔑 Fallback authentication via external API key
//     const apiKey = request.headers.get('X-API-Key');
//     const validKey = process.env.EXTERNAL_API_KEY || 'my-super-secret-key-123';
//     const isApiKeyValid = apiKey === validKey;

//     if (!userEmail && !isApiKeyValid) {
//       return corsResponse({ error: 'Unauthorized. Authenticated session or valid X-API-Key required.' }, 401);
//     }

//     const resolvedParams = await params;
//     const pingId = parseInt(resolvedParams.id);
    
//     if (isNaN(pingId)) {
//       return corsResponse({ error: 'Invalid ping ID format' }, 400);
//     }

//     if (!dbManager.isConnected()) {
//       await dbManager.connect();
//     }

//     const db = await dbManager.getDb();

//     // Fetch the target ping log to trace its parent monitor identity
//     const ping = await db.select().from(pingResults).where(eq(pingResults.id, pingId));
    
//     if (ping.length === 0) {
//       return corsResponse({ error: 'Ping record not found' }, 404);
//     }

//     // Fetch the parent monitor to strictly enforce multitenancy isolation properties
//     const monitor = await db.select().from(monitors).where(eq(monitors.id, ping[0].monitorId));
    
//     if (monitor.length === 0) {
//       return corsResponse({ error: 'Associated monitor footprint missing' }, 404);
//     }

//     // If request is authenticated via user session, make sure they own this monitor
//     if (userEmail && monitor[0].userEmail !== userEmail) {
//       return corsResponse({ error: 'Forbidden. You do not own the parent monitor running this telemetry log.' }, 403);
//     }

//     // Execute isolation block atomic deletion operation
//     const deleted = await db.delete(pingResults).where(eq(pingResults.id, pingId)).returning();

//     if (deleted.length === 0) {
//       return corsResponse({ error: 'Failed to purge ping record from storage matrix' }, 500);
//     }

//     console.log(`🗑️ [API] Purged ping record ${pingId} belonging to monitor: "${monitor[0].name}"`);

//     return corsResponse({
//       success: true,
//       message: 'Ping record cleared successfully',
//       deletedId: pingId,
//     });
    
//   } catch (error: any) {
//     console.error('CRITICAL: Error clearing targeted ping record trace:', error);
//     return corsResponse({ error: 'Internal server deployment exception', details: error.message }, 500);
//   }
// }










































// // // app/api/pings/[id]/route.ts
// // // DELETE single ping result by ID
// // // Secured with NextAuth User Session validation and fallback X-API-Key authentication

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 
import { dbManager } from '@/lib/db';
import { pingResults, monitors } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}

export async function DELETE(request: NextRequest) {
  try {
    // 🔐 Authenticate Request
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const apiKey = request.headers.get('X-API-Key');
    const isApiKeyValid = apiKey === (process.env.EXTERNAL_API_KEY || 'my-super-secret-key-123');

    if (!userEmail && !isApiKeyValid) {
      return corsResponse({ error: 'Unauthorized.' }, 401);
    }

    if (!dbManager.isConnected()) await dbManager.connect();
    const db = await dbManager.getDb();

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const monitorIdParam = searchParams.get('monitorId');
    const idsParam = searchParams.get('ids'); // Comma-separated string list "1,2,3"

    // ---------------------------------------------------------
    // SCENARIO A: CLEAR ALL LOGS FOR A SPECIFIC MONITOR
    // ---------------------------------------------------------
    if (action === 'clear-all' && monitorIdParam) {
      const targetMonitorId = parseInt(monitorIdParam, 10);
      if (isNaN(targetMonitorId)) {
        return corsResponse({ error: 'Invalid monitorId parameter.' }, 400);
      }

      if (userEmail) {
        const monitorCheck = await db.select().from(monitors).where(eq(monitors.id, targetMonitorId));
        if (monitorCheck.length === 0 || monitorCheck[0].userEmail !== userEmail) {
          return corsResponse({ error: 'Forbidden.' }, 403);
        }
      }

      const cleared = await db.delete(pingResults)
        .where(eq(pingResults.monitorId, targetMonitorId))
        .returning();
      
      return corsResponse({ success: true, count: cleared.length });
    }

    // ---------------------------------------------------------
    // SCENARIO B: BATCH DELETION OF SELECTED LOGS
    // ---------------------------------------------------------
    if (idsParam) {
      const targetIds = idsParam.split(',')
        .map(id => parseInt(id.trim(), 10))
        .filter(id => !isNaN(id));

      if (targetIds.length === 0) {
        return corsResponse({ error: 'No valid IDs provided.' }, 400);
      }

      if (userEmail) {
        const parentPings = await db.select().from(pingResults).where(inArray(pingResults.id, targetIds));
        const distinctMonitorIds = Array.from(new Set(parentPings.map(p => p.monitorId)));
        if (distinctMonitorIds.length > 0) {
          const structuralMonitors = await db.select().from(monitors).where(inArray(monitors.id, distinctMonitorIds));
          if (structuralMonitors.some(m => m.userEmail !== userEmail)) {
            return corsResponse({ error: 'Forbidden.' }, 403);
          }
        }
      }

      const batchDeleted = await db.delete(pingResults)
        .where(inArray(pingResults.id, targetIds))
        .returning();

      return corsResponse({ success: true, count: batchDeleted.length });
    }

    return corsResponse({ error: 'Bad Request. Specify ids string or clear-all action.' }, 400);

  } catch (error: any) {
    console.error('DELETE Error:', error);
    return corsResponse({ error: 'Server exception', details: error.message }, 500);
  }
}