import { NextResponse } from 'next/server';
import { getAllCreators } from '@/lib/storage';

export async function GET() {
  try {
    const creators = await getAllCreators();
    return NextResponse.json(creators);
  } catch (err) {
    console.error('[GET /api/creators]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
