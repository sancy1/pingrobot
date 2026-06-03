// app/api/cron/route.ts
// CRON JOB ENDPOINT - Called by Vercel Cron Jobs (or manually for testing)
// This endpoint triggers the ping engine to process all due monitors

import { NextRequest, NextResponse } from 'next/server';
import { executeCronJob } from '@/lib/scheduler';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max execution time for long-running pings

// Authentication check for cron endpoint
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || '9GyRFL7aiigpjJ6X78p/atfMlyfLyG9g9u+8Xo=';

  // Check bearer token
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  // Also check query parameter for testing
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  if (token === cronSecret) {
    return true;
  }

  return false;
}

// CORS headers for external access (if needed)
function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET endpoint (Vercel Cron uses GET by default)
export async function GET(request: NextRequest) {
  return handleCronRequest(request);
}

// POST endpoint (alternative for some cron services)
export async function POST(request: NextRequest) {
  return handleCronRequest(request);
}

async function handleCronRequest(request: NextRequest) {
  try {
    // Verify authorization
    if (!isAuthorized(request)) {
      console.warn('⚠️ Unauthorized cron access attempt');
      return corsResponse({ error: 'Unauthorized', message: 'Invalid or missing cron secret' }, 401);
    }

    console.log('🔐 Cron request authorized, starting job...');

    // Execute the cron job
    const results = await executeCronJob();

    // Return results
    return corsResponse({
      success: true,
      message: 'Cron job executed successfully',
      ...results,
    });

  } catch (error: any) {
    console.error('❌ Cron job failed:', error);
    return corsResponse({
      success: false,
      error: 'Cron job execution failed',
      message: error.message,
    }, 500);
  }
}