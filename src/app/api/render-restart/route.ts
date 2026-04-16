import { NextResponse } from 'next/server';

// Backend is now deployed on Railway, not Render
// This endpoint is kept for compatibility but returns a success message
// Railway auto-redeploys on git push, so manual restart is not needed

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Backend is deployed on Railway. Auto-redeploy on git push is enabled.',
    backend: 'https://tsunami-alert-backend-production.up.railway.app',
  });
}

export async function GET() {
  return NextResponse.json({
    success: true,
    backend_status: 'Railway',
    details: 'Backend is on Railway with auto-deployment on git push',
  });
}
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Render API error: ${res.status}`, details: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    const latest = data[0];
    return NextResponse.json({
      deployId: latest?.deploy?.id,
      status: latest?.deploy?.status,
      createdAt: latest?.deploy?.createdAt,
      finishedAt: latest?.deploy?.finishedAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
