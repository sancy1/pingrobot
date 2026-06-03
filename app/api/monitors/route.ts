// // app/api/monitors/route.ts
// // Monitor Management API - Create and List Monitors
// // POST: Create a new monitor
// // GET: List all monitors

// import { NextRequest, NextResponse } from 'next/server';
// import { dbManager } from '@/lib/db';
// import { monitors } from '@/lib/db/schema';
// import { eq, desc } from 'drizzle-orm';

// export const dynamic = 'force-dynamic';

// // ============================================
// // POST - Create a new monitor
// // ============================================
// export async function POST(request: NextRequest) {
//   try {
//     // Ensure database is connected
//     if (!dbManager.isConnected()) {
//       await dbManager.connect();
//     }
    
//     const body = await request.json();
//     // FIXED: Await the async method invocation to cleanly resolve the active Drizzle context instance
//     const db = await dbManager.getDb();
    
//     // ==========================================
//     // VALIDATION
//     // ==========================================
    
//     // 1. Name validation
//     if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
//       return NextResponse.json(
//         { error: 'Name is required and must be a non-empty string' },
//         { status: 400 }
//       );
//     }
    
//     if (body.name.length > 255) {
//       return NextResponse.json(
//         { error: 'Name must be less than 255 characters' },
//         { status: 400 }
//       );
//     }
    
//     // 2. URL validation
//     if (!body.url || typeof body.url !== 'string') {
//       return NextResponse.json(
//         { error: 'URL is required' },
//         { status: 400 }
//       );
//     }
    
//     // Normalize URL - add https:// if no protocol
//     let normalizedUrl = body.url.trim();
//     if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
//       normalizedUrl = 'https://' + normalizedUrl;
//     }
    
//     // Basic URL validation
//     try {
//       new URL(normalizedUrl);
//     } catch {
//       return NextResponse.json(
//         { error: 'Invalid URL format. Please enter a valid URL including http:// or https://' },
//         { status: 400 }
//       );
//     }
    
//     // 3. Interval validation (30 seconds to 24 hours)
//     const intervalSeconds = body.intervalSeconds ?? 300;
//     if (intervalSeconds < 30 || intervalSeconds > 86400) {
//       return NextResponse.json(
//         { error: 'Interval must be between 30 seconds and 24 hours (86400 seconds)' },
//         { status: 400 }
//       );
//     }
    
//     // 4. Timeout validation (5 seconds to 120 seconds)
//     const timeoutMs = body.timeoutMs ?? 60000;
//     if (timeoutMs < 5000 || timeoutMs > 120000) {
//       return NextResponse.json(
//         { error: 'Timeout must be between 5000ms (5 seconds) and 120000ms (120 seconds)' },
//         { status: 400 }
//       );
//     }
    
//     // 5. Monitor type validation
//     const validMonitorTypes = ['http', 'https', 'api', 'website'];
//     const monitorType = body.monitorType ?? 'http';
//     if (!validMonitorTypes.includes(monitorType)) {
//       return NextResponse.json(
//         { error: `Monitor type must be one of: ${validMonitorTypes.join(', ')}` },
//         { status: 400 }
//       );
//     }
    
//     // 6. Method validation
//     const validMethods = ['GET', 'HEAD', 'POST', 'OPTIONS'];
//     const method = body.method ?? 'GET';
//     if (!validMethods.includes(method)) {
//       return NextResponse.json(
//         { error: `Method must be one of: ${validMethods.join(', ')}` },
//         { status: 400 }
//       );
//     }
    
//     // 7. Region validation
//     const validRegions = ['auto', 'us-east-1', 'eu-central-1', 'ap-southeast-1', 'sa-east-1'];
//     const region = body.region ?? 'auto';
//     if (!validRegions.includes(region)) {
//       return NextResponse.json(
//         { error: `Region must be one of: ${validRegions.join(', ')}` },
//         { status: 400 }
//       );
//     }
    
//     // 8. Check for duplicate URL
//     const existingMonitor = await db.select().from(monitors).where(eq(monitors.url, normalizedUrl));
//     if (existingMonitor.length > 0) {
//       return NextResponse.json(
//         { error: 'A monitor with this URL already exists' },
//         { status: 409 }
//       );
//     }
    
//     // ==========================================
//     // WAKE-UP WARNING (Not an error, just info)
//     // ==========================================
//     let wakeUpWarning = null;
//     if (intervalSeconds > 900) {
//       wakeUpWarning = '⚠️ Interval exceeds 15 minutes. Your server may sleep between checks. For wake-up effectiveness, keep interval under 15 minutes.';
//     }
    
//     if (timeoutMs < 60000) {
//       wakeUpWarning = '⚠️ Timeout is less than 60 seconds. Some cloud platforms need 45-60 seconds to wake from cold start.';
//     }
    
//     // ==========================================
//     // CALCULATE NEXT PING TIME
//     // ==========================================
//     const nextPingAt = new Date(Date.now() + (intervalSeconds * 1000));
    
//     // ==========================================
//     // CREATE MONITOR
//     // ==========================================
//     // FIXED: Formatted input arrays and objects safely to prevent JSONB serialization data conflicts
//     const headersData = body.customHeaders ? JSON.stringify(body.customHeaders) : '{}';
//     const codesData = body.expectedStatusCodes ? JSON.stringify(body.expectedStatusCodes) : '[200, 201, 202, 204]';

//     const [newMonitor] = await db.insert(monitors).values({
//       name: body.name.trim(),
//       url: normalizedUrl,
//       description: body.description || null,
//       monitorType: monitorType,
//       method: method,
//       intervalSeconds: intervalSeconds,
//       region: region,
//       timeoutMs: timeoutMs,
//       customHeaders: headersData,
//       requestBody: body.requestBody || null,
//       expectedStatusCodes: codesData,
//       sslEnabled: body.sslEnabled || false,
//       isActive: true,
//       status: 'pending',
//       nextPingAt: nextPingAt,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }).returning();
    
//     console.log(`✅ Monitor created: ${newMonitor.name} (ID: ${newMonitor.id}) - ${normalizedUrl}`);
    
//     return NextResponse.json({
//       success: true,
//       monitor: newMonitor,
//       warning: wakeUpWarning,
//       message: 'Monitor created successfully',
//     }, { status: 201 });
    
//   } catch (error: any) {
//     console.error('Error creating monitor:', error);
    
//     if (error.message?.includes('duplicate key')) {
//       return NextResponse.json(
//         { error: 'A monitor with this configuration already exists' },
//         { status: 409 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: 'Internal server error', details: error.message },
//       { status: 500 }
//     );
//   }
// }

// // ============================================
// // GET - List all monitors
// // ============================================
// export async function GET() {
//   try {
//     if (!dbManager.isConnected()) {
//       await dbManager.connect();
//     }
    
//     // FIXED: Added await handler for the async database engine configuration wrapper
//     const db = await dbManager.getDb();
    
//     // FIXED: Appended desc() to guarantee list results sort by creation timestamp with newest first
//     const allMonitors = await db.select().from(monitors).orderBy(desc(monitors.createdAt));
    
//     return NextResponse.json({
//       success: true,
//       monitors: allMonitors,
//       count: allMonitors.length,
//     }, { status: 200 });
    
//   } catch (error: any) {
//     console.error('Error fetching monitors:', error);
    
//     return NextResponse.json(
//       { error: 'Failed to fetch monitors', details: error.message },
//       { status: 500 }
//     );
//   }
// }

























// // app/api/monitors/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { dbManager } from '@/lib/db';
// import { monitors } from '@/lib/db/schema';
// import { eq, desc } from 'drizzle-orm';

// export const dynamic = 'force-dynamic';

// // Helper function to attach global CORS headers to responses
// function corsResponse(data: any, status = 200) {
//   return NextResponse.json(data, {
//     status,
//     headers: {
//       'Access-Control-Allow-Origin': '*', // Allows access from any external domain
//       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
//     },
//   });
// }

// // Handle browser pre-flight OPTIONS requests gracefully
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
//     },
//   });
// }

// // Simple Security Validation Check
// function isAuthorized(request: NextRequest): boolean {
//   // Checks for an API key in the request headers
//   const apiKey = request.headers.get('X-API-Key');
//   const secureServerKey = process.env.EXTERNAL_API_KEY || 'my-super-secret-key-123';
//   return apiKey === secureServerKey;
// }

// // ============================================
// // POST - Create a new monitor from any app
// // ============================================
// export async function POST(request: NextRequest) {
//   try {
//     // 🔒 Security Guard
//     if (!isAuthorized(request)) {
//       return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401);
//     }

//     if (!dbManager.isConnected()) {
//       await dbManager.connect();
//     }
    
//     const body = await request.json();
//     const db = await dbManager.getDb();
    
//     // 1. Name validation
//     if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
//       return corsResponse({ error: 'Name is required and must be a non-empty string' }, 400);
//     }
//     if (body.name.length > 255) {
//       return corsResponse({ error: 'Name must be less than 255 characters' }, 400);
//     }
    
//     // 2. URL validation
//     if (!body.url || typeof body.url !== 'string') {
//       return corsResponse({ error: 'URL is required' }, 400);
//     }
    
//     let normalizedUrl = body.url.trim();
//     if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
//       normalizedUrl = 'https://' + normalizedUrl;
//     }
    
//     try {
//       new URL(normalizedUrl);
//     } catch {
//       return corsResponse({ error: 'Invalid URL format.' }, 400);
//     }
    
//     // 3. Interval validation
//     const intervalSeconds = body.intervalSeconds ?? 300;
//     if (intervalSeconds < 30 || intervalSeconds > 86400) {
//       return corsResponse({ error: 'Interval must be between 30 seconds and 24 hours.' }, 400);
//     }
    
//     // 4. Timeout validation
//     const timeoutMs = body.timeoutMs ?? 60000;
//     if (timeoutMs < 5000 || timeoutMs > 120000) {
//       return corsResponse({ error: 'Timeout must be between 5000ms and 120000ms.' }, 400);
//     }
    
//     // 5. Check for duplicate URL
//     const existingMonitor = await db.select().from(monitors).where(eq(monitors.url, normalizedUrl));
//     if (existingMonitor.length > 0) {
//       return corsResponse({ error: 'A monitor with this URL already exists' }, 409);
//     }
    
//     const headersData = body.customHeaders ? JSON.stringify(body.customHeaders) : '{}';
//     const codesData = body.expectedStatusCodes ? JSON.stringify(body.expectedStatusCodes) : '';

//     const [newMonitor] = await db.insert(monitors).values({
//       name: body.name.trim(),
//       url: normalizedUrl,
//       description: body.description || null,
//       monitorType: body.monitorType ?? 'http',
//       method: body.method ?? 'GET',
//       intervalSeconds: intervalSeconds,
//       region: body.region ?? 'auto',
//       timeoutMs: timeoutMs,
//       customHeaders: headersData,
//       requestBody: body.requestBody || null,
//       expectedStatusCodes: codesData,
//       sslEnabled: body.sslEnabled || false,
//       isActive: true,
//       status: 'pending',
      
//       // 🔑 FIXED ONCE AND FOR ALL: Set to null so it triggers instantly on the next loop tick!
//       nextPingAt: null, 
      
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }).returning();
    
//     return corsResponse({
//       success: true,
//       monitor: newMonitor,
//       message: 'Monitor created successfully',
//     }, 201);
    
//   } catch (error: any) {
//     console.error('Error creating monitor:', error);
//     return corsResponse({ error: 'Internal server error', details: error.message }, 500);
//   }
// }

// // ============================================
// // GET - List all monitors for any app
// // ============================================
// export async function GET(request: NextRequest) {
//   try {
//     // 🔒 Security Guard
//     if (!isAuthorized(request)) {
//       return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401);
//     }

//     if (!dbManager.isConnected()) {
//       await dbManager.connect();
//     }
    
//     const db = await dbManager.getDb();
//     const allMonitors = await db.select().from(monitors).orderBy(desc(monitors.createdAt));
    
//     return corsResponse({
//       success: true,
//       monitors: allMonitors,
//       count: allMonitors.length,
//     }, 200);
    
//   } catch (error: any) {
//     console.error('Error fetching monitors:', error);
//     return corsResponse({ error: 'Failed to fetch monitors', details: error.message }, 500);
//   }
// }































// app/api/monitors/route.ts
// API Route Handler for Monitoring Infrastructure Operations
// Handles authenticated monitor creation (POST) and tenant-isolated listings (GET)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq, desc } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { monitors } from '@/lib/db/schema';

// 🛠️ ARCHITECTURE ALIGNED IMPORT:
// Importing the precise operational connection wrapper exposed by your index file
import { getConnectedDb } from '@/lib/db';

function corsResponse(data: any, status: number) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}

function isAuthorized(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  if (process.env.CRON_SECRET && apiKey === process.env.CRON_SECRET) {
    return true;
  }
  return false;
}

export async function OPTIONS() {
  return corsResponse({}, 200);
}

// ============================================
// 1. GET HANDLER: Fetch isolated tenant monitors
// ============================================
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail && !isAuthorized(request)) {
      return corsResponse({ error: 'Unauthorized. Invalid session or missing X-API-Key header.' }, 401);
    }

    // 🔐 Dynamic Connection Retrieval matching your architecture profile
    const db = await getConnectedDb();
    let userMonitors;

    if (userEmail) {
      // User view -> Strictly isolate data by user email
      userMonitors = await db
        .select()
        .from(monitors)
        .where(eq(monitors.userEmail, userEmail))
        .orderBy(desc(monitors.createdAt));
    } else {
      // Background worker view -> Fetch active system targets via cron key
      userMonitors = await db
        .select()
        .from(monitors)
        .orderBy(desc(monitors.createdAt));
    }

    return corsResponse({
      success: true,
      monitors: userMonitors,
      count: userMonitors.length,
    }, 200);

  } catch (error: any) {
    console.error('Error fetching monitors:', error);
    return corsResponse({ error: 'Failed to fetch monitors', details: error.message }, 500);
  }
}

// ============================================
// 2. POST HANDLER: Create new tenant monitor
// ============================================
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return corsResponse({ error: 'User not authenticated' }, 401);
    }

    const body = await request.json();
    const { name, url, description, monitorType, method, intervalSeconds, region, timeoutMs } = body;

    if (!name || !url) {
      return corsResponse({ error: 'Missing required validation properties: name and url are required.' }, 400);
    }

    // 🔐 Dynamic Connection Retrieval matching your architecture profile
    const db = await getConnectedDb();

    // Storing authenticated owner identity into your schema safely
    const [newMonitor] = await db.insert(monitors).values({
      name,
      url,
      description,
      monitorType: monitorType || 'http',
      method: method || 'GET',
      intervalSeconds: intervalSeconds ? parseInt(intervalSeconds) : 300,
      region: region || 'auto',
      timeoutMs: timeoutMs ? parseInt(timeoutMs) : 60000,
      userEmail: userEmail,
    }).returning();

    return corsResponse({
      success: true,
      message: 'Monitor successfully established.',
      monitor: newMonitor
    }, 201);

  } catch (error: any) {
    console.error('Error establishing monitor target:', error);
    return corsResponse({ error: 'Failed to establish monitor profile', details: error.message }, 500);
  }
}