import { NextRequest, NextResponse } from 'next/server';
import { getTipsByUsername } from '@/lib/storage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Provide ?username= query param' },
      { status: 400 }
    );
  }

  try {
    const tips = await getTipsByUsername(username);
    return NextResponse.json(tips);
  } catch (err) {
    console.error('[GET /api/tips]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
