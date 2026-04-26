import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api-endpoints';

// Backend is now deployed on Railway, not Render
// This endpoint is kept for compatibility but returns a success message
// Railway auto-redeploys on git push, so manual restart is not needed

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Backend is deployed on Railway. Auto-redeploy on git push is enabled.',
    backend: getApiBaseUrl(),
  });
}

export async function GET() {
  return NextResponse.json({
    success: true,
    backend_status: 'Railway',
    details: 'Backend is on Railway with auto-deployment on git push',
  });
}
