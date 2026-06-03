// // // app/api/monitors/[id]/route.ts
// // // Individual Monitor Management API - Retrieve, Update, and Delete Specific Monitors
// // // Consumable securely by both inside UI panels and authorized external microservices

// // import { NextRequest, NextResponse } from 'next/server'
// // import { dbManager } from '@/lib/db'
// // import { monitors } from '@/lib/db/schema'
// // import { eq, and, ne } from 'drizzle-orm'

// // export const dynamic = 'force-dynamic'

// // // Shared Helper: Standardized CORS Response formatting for external consumers
// // function corsResponse(data: any, status = 200) {
// //   return NextResponse.json(data, {
// //     status,
// //     headers: {
// //       'Access-Control-Allow-Origin': '*',
// //       'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
// //       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
// //     },
// //   })
// // }

// // // Global Options handler for cross-origin browser pre-flight safety checks
// // export async function OPTIONS() {
// //   return new NextResponse(null, {
// //     status: 204,
// //     headers: {
// //       'Access-Control-Allow-Origin': '*',
// //       'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
// //       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
// //     },
// //   })
// // }

// // // Global Header Authentication Guard
// // function isAuthorized(request: NextRequest): boolean {
// //   const apiKey = request.headers.get('X-API-Key')
// //   const secureServerKey = process.env.EXTERNAL_API_KEY || 'my-super-secret-key-123'
// //   return apiKey === secureServerKey
// // }

// // // ============================================
// // // 1. GET - Fetch a single monitor record by ID
// // // ============================================
// // export async function GET(
// //   request: NextRequest,
// //   { params }: { params: { id: string } }
// // ) {
// //   try {
// //     // 🔒 Security Guard
// //     if (!isAuthorized(request)) {
// //       return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401)
// //     }

// //     const id = parseInt(params.id)
// //     if (isNaN(id)) {
// //       return corsResponse({ error: 'Invalid monitor ID format provided' }, 400)
// //     }

// //     if (!dbManager.isConnected()) {
// //       await dbManager.connect()
// //     }

// //     // FIXED: Await async database instance handle instantiation
// //     const db = await dbManager.getDb()
// //     const monitor = await db.select().from(monitors).where(eq(monitors.id, id))

// //     if (monitor.length === 0) {
// //       return corsResponse({ error: 'Monitor not found' }, 404)
// //     }

// //     return corsResponse({ success: true, monitor: monitor[0] })
// //   } catch (error: any) {
// //     console.error(`Error fetching monitor ${params.id}:`, error)
// //     return corsResponse({ error: error.message }, 500)
// //   }
// // }


























// // app/api/monitors/[id]/route.ts
// // Individual Monitor Management API - Retrieve, Update, and Delete Specific Monitors
// // Consumable securely by both inside UI panels and authorized external microservices

// import { NextRequest, NextResponse } from 'next/server'
// import { dbManager } from '@/lib/db'
// import { monitors } from '@/lib/db/schema'
// import { eq } from 'drizzle-orm'

// export const dynamic = 'force-dynamic'

// // Shared Helper: Standardized CORS Response formatting for external consumers
// function corsResponse(data: any, status = 200) {
//   return NextResponse.json(data, {
//     status,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
//     },
//   })
// }

// // Global Options handler for cross-origin browser pre-flight safety checks
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
//     },
//   })
// }

// // Global Header Authentication Guard
// function isAuthorized(request: NextRequest): boolean {
//   const apiKey = request.headers.get('X-API-Key')
//   const secureServerKey = process.env.EXTERNAL_API_KEY || 'my-super-secret-key-123'
//   return apiKey === secureServerKey
// }

// // ============================================
// // 1. GET - Fetch a single monitor record by ID
// // ============================================
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> } // 🚀 Parameter typed as a Promise configuration
// ) {
//   let rawId = '' 
  
//   try {
//     // 🔒 Security Guard
//     if (!isAuthorized(request)) {
//       return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401)
//     }

//     // 🚀 Awaiting the dynamic segment promise lookup parameters structurally
//     const resolvedParams = await params
//     rawId = resolvedParams.id

//     const id = parseInt(rawId)
//     if (isNaN(id)) {
//       console.error(`❌ Route validation failure. Parsed ID: "${rawId}" resolved as NaN.`);
//       return corsResponse({ error: `Invalid monitor ID format provided. Received: ${rawId}` }, 400)
//     }

//     if (!dbManager.isConnected()) {
//       await dbManager.connect()
//     }

//     // Await async database instance handle instantiation
//     const db = await dbManager.getDb()
//     const monitor = await db.select().from(monitors).where(eq(monitors.id, id))

//     if (monitor.length === 0) {
//       return corsResponse({ error: 'Monitor not found' }, 404)
//     }

//     return corsResponse({ success: true, monitor: monitor[0] })
//   } catch (error: any) {
//     console.error(`Error fetching monitor ${rawId || 'unknown'}:`, error)
//     return corsResponse({ error: error.message }, 500)
//   }
// }

// // ============================================
// // 2. PUT - Update an existing monitor record
// // ============================================
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   let rawId = ''

//   try {
//     if (!isAuthorized(request)) {
//       return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401)
//     }

//     const resolvedParams = await params
//     rawId = resolvedParams.id

//     const id = parseInt(rawId)
//     if (isNaN(id)) {
//       return corsResponse({ error: `Invalid monitor ID format. Received: ${rawId}` }, 400)
//     }

//     const body = await request.json()

//     if (!dbManager.isConnected()) {
//       await dbManager.connect()
//     }

//     const db = await dbManager.getDb()

//     // Flatten custom headers and array structures into safe storage formats if needed by database drivers
//     const updatedFields = {
//       name: body.name,
//       url: body.url,
//       description: body.description,
//       monitorType: body.monitorType,
//       method: body.method || 'GET',
//       intervalSeconds: parseInt(body.intervalSeconds) || 300,
//       timeoutMs: parseInt(body.timeoutMs) || 60000,
//       region: body.region || 'auto',
//       sslEnabled: body.sslEnabled === true,
//       customHeaders: typeof body.customHeaders === 'object' ? JSON.stringify(body.customHeaders) : body.customHeaders,
//       requestBody: body.requestBody,
//       expectedStatusCodes: typeof body.expectedStatusCodes === 'object' ? JSON.stringify(body.expectedStatusCodes) : body.expectedStatusCodes,
//       updatedAt: new Date()
//     }

//     const [updatedMonitor] = await db
//       .update(monitors)
//       .set(updatedFields)
//       .where(eq(monitors.id, id))
//       .returning()

//     if (!updatedMonitor) {
//       return corsResponse({ error: 'Monitor not found to update' }, 404)
//     }

//     return corsResponse({
//       success: true,
//       monitor: updatedMonitor,
//       message: 'Monitor tracking specifications updated successfully.'
//     })
//   } catch (error: any) {
//     console.error(`Error updating monitor ${rawId || 'unknown'}:`, error)
//     return corsResponse({ error: 'Internal update processing error', details: error.message }, 500)
//   }
// }

// // ============================================
// // 3. DELETE - Drop a tracking monitor completely
// // ============================================
// export async function DELETE(
//   request: NextRequest, 
//   { params }: { params: Promise<{ id: string }> } // 🚀 Awaiting Promise parameter to prevent dynamic segments collapsing
// ) {
//   let rawId = '';

//   try {
//     if (!isAuthorized(request)) {
//       return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401);
//     }

//     const resolvedParams = await params;
//     rawId = resolvedParams.id;

//     const monitorId = parseInt(rawId);
//     if (isNaN(monitorId)) {
//       console.error(`❌ Backend DELETE verification failure. Raw ID "${rawId}" resolved as NaN.`);
//       return corsResponse({ error: `Invalid monitor ID format. Received: ${rawId}` }, 400);
//     }

//     if (!dbManager.isConnected()) {
//       await dbManager.connect();
//     }
    
//     const db = await dbManager.getDb();

//     // Execute query builder deletion transaction row purge via drizzle schema references
//     const [deletedMonitor] = await db
//       .delete(monitors)
//       .where(eq(monitors.id, monitorId))
//       .returning();

//     if (!deletedMonitor) {
//       console.warn(`⚠️ Deletion attempted for non-existent monitor ID: ${monitorId}`);
//       return corsResponse({ error: 'Monitor could not be found to perform deletion action' }, 404);
//     }

//     console.log(`🗑️ Monitor purged from tracking system: ${deletedMonitor.name} (ID: ${monitorId})`);

//     return corsResponse({
//       success: true,
//       deletedId: monitorId,
//       message: `Monitor "${deletedMonitor.name}" has been permanently removed from the tracking mesh cluster.`
//     });

//   } catch (error: any) {
//     console.error(`CRITICAL DELETION FAILURE for monitor ID ${rawId || 'unknown'}:`, error);
//     return corsResponse({ error: 'Internal database processing exception', details: error.message }, 500);
//   }
// }






























// app/api/monitors/[id]/route.ts
// Individual Monitor Management API - Retrieve, Update, and Delete Specific Monitors
// Consumable securely by both inside UI panels and authorized external microservices

import { NextRequest, NextResponse } from 'next/server'
import { dbManager } from '@/lib/db'
import { monitors } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

// Shared Helper: Standardized CORS Response formatting for external consumers
function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  })
}

// Global Options handler for cross-origin browser pre-flight safety checks
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  })
}

// Global Header Authentication Guard
function isAuthorized(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key')
  const secureServerKey = process.env.EXTERNAL_API_KEY || 'my-super-secret-key-123'
  return apiKey === secureServerKey
}

// ============================================
// 1. GET - Fetch a single monitor record by ID
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let rawId = '' 
  
  try {
    // 🔒 Security Guard
    if (!isAuthorized(request)) {
      return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401)
    }

    // Awaiting the dynamic segment promise lookup parameters structurally
    const resolvedParams = await params
    rawId = resolvedParams.id

    const id = parseInt(rawId)
    if (isNaN(id)) {
      console.error(`❌ Route validation failure. Parsed ID: "${rawId}" resolved as NaN.`);
      return corsResponse({ error: `Invalid monitor ID format provided. Received: ${rawId}` }, 400)
    }

    if (!dbManager.isConnected()) {
      await dbManager.connect()
    }

    // Await async database instance handle instantiation
    const db = await dbManager.getDb()
    const monitor = await db.select().from(monitors).where(eq(monitors.id, id))

    if (monitor.length === 0) {
      return corsResponse({ error: 'Monitor not found' }, 404)
    }

    return corsResponse({ success: true, monitor: monitor[0] })
  } catch (error: any) {
    console.error(`Error fetching monitor ${rawId || 'unknown'}:`, error)
    return corsResponse({ error: error.message }, 500)
  }
}

// ============================================
// 2. PUT - Update an existing monitor record
// ============================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let rawId = ''

  try {
    if (!isAuthorized(request)) {
      return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401)
    }

    const resolvedParams = await params
    rawId = resolvedParams.id

    const id = parseInt(rawId)
    if (isNaN(id)) {
      return corsResponse({ error: `Invalid monitor ID format. Received: ${rawId}` }, 400)
    }

    const body = await request.json()

    if (!dbManager.isConnected()) {
      await dbManager.connect()
    }

    const db = await dbManager.getDb()

    // Check if monitor exists before updating
    const existingMonitor = await db.select().from(monitors).where(eq(monitors.id, id))
    if (existingMonitor.length === 0) {
      return corsResponse({ error: 'Monitor not found to update' }, 404)
    }

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: new Date()
    }
    
    // Basic fields
    if (body.name !== undefined) updateData.name = body.name
    if (body.url !== undefined) updateData.url = body.url
    if (body.description !== undefined) updateData.description = body.description
    if (body.monitorType !== undefined) updateData.monitorType = body.monitorType
    if (body.method !== undefined) updateData.method = body.method
    if (body.intervalSeconds !== undefined) updateData.intervalSeconds = parseInt(body.intervalSeconds)
    if (body.timeoutMs !== undefined) updateData.timeoutMs = parseInt(body.timeoutMs)
    if (body.region !== undefined) updateData.region = body.region
    if (body.sslEnabled !== undefined) updateData.sslEnabled = body.sslEnabled === true
    // ✅ CRITICAL: Support isActive toggle (Pause/Resume)
    if (body.isActive !== undefined) updateData.isActive = body.isActive === true
    
    // JSON fields - handle both object and string inputs
    if (body.customHeaders !== undefined) {
      updateData.customHeaders = typeof body.customHeaders === 'object' 
        ? body.customHeaders 
        : JSON.parse(body.customHeaders || '{}')
    }
    if (body.requestBody !== undefined) updateData.requestBody = body.requestBody
    if (body.expectedStatusCodes !== undefined) {
      updateData.expectedStatusCodes = typeof body.expectedStatusCodes === 'object'
        ? body.expectedStatusCodes
        : JSON.parse(body.expectedStatusCodes || '[200, 201, 202, 204]')
    }

    console.log(`📊 Updating monitor ${id}:`, { isActive: updateData.isActive, ...updateData })

    // Perform update
    const [updatedMonitor] = await db
      .update(monitors)
      .set(updateData)
      .where(eq(monitors.id, id))
      .returning()

    // Determine success message based on what was updated
    const isActiveChanged = body.isActive !== undefined
    const successMessage = isActiveChanged 
      ? (updateData.isActive ? '▶️ Monitor resumed successfully' : '⏸️ Monitor paused successfully')
      : 'Monitor updated successfully'

    return corsResponse({
      success: true,
      monitor: updatedMonitor,
      message: successMessage
    })
  } catch (error: any) {
    console.error(`Error updating monitor ${rawId || 'unknown'}:`, error)
    return corsResponse({ error: 'Internal update processing error', details: error.message }, 500)
  }
}

// ============================================
// 3. DELETE - Drop a tracking monitor completely
// ============================================
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  let rawId = '';

  try {
    if (!isAuthorized(request)) {
      return corsResponse({ error: 'Unauthorized. Invalid or missing X-API-Key header.' }, 401);
    }

    const resolvedParams = await params;
    rawId = resolvedParams.id;

    const monitorId = parseInt(rawId);
    if (isNaN(monitorId)) {
      console.error(`❌ Backend DELETE verification failure. Raw ID "${rawId}" resolved as NaN.`);
      return corsResponse({ error: `Invalid monitor ID format. Received: ${rawId}` }, 400);
    }

    if (!dbManager.isConnected()) {
      await dbManager.connect();
    }
    
    const db = await dbManager.getDb();

    // Execute query builder deletion transaction row purge via drizzle schema references
    const [deletedMonitor] = await db
      .delete(monitors)
      .where(eq(monitors.id, monitorId))
      .returning();

    if (!deletedMonitor) {
      console.warn(`⚠️ Deletion attempted for non-existent monitor ID: ${monitorId}`);
      return corsResponse({ error: 'Monitor could not be found to perform deletion action' }, 404);
    }

    console.log(`🗑️ Monitor purged from tracking system: ${deletedMonitor.name} (ID: ${monitorId})`);

    return corsResponse({
      success: true,
      deletedId: monitorId,
      message: `Monitor "${deletedMonitor.name}" has been permanently removed from the tracking mesh cluster.`
    });

  } catch (error: any) {
    console.error(`CRITICAL DELETION FAILURE for monitor ID ${rawId || 'unknown'}:`, error);
    return corsResponse({ error: 'Internal database processing exception', details: error.message }, 500);
  }
}