import { NextResponse } from 'next/server';

const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID || 'srv-d6li45p5pdvs73drt380';

export async function POST() {
  const apiKey = process.env.RENDER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RENDER_API_KEY not configured on server' }, { status: 500 });
  }

  try {
    // Restart the service (no rebuild, just restart the running container)
    const res = await fetch(`https://api.render.com/v1/services/${RENDER_SERVICE_ID}/restart`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Render API error: ${res.status}`, details: text },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service restart triggered successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET endpoint to check latest deploy status
export async function GET() {
  const apiKey = process.env.RENDER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RENDER_API_KEY not configured on server' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys?limit=1`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
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
