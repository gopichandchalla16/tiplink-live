import { NextResponse } from 'next/server';
import { initSeedDB } from '@/lib/storage';

export async function POST() {
  try {
    await initSeedDB();
    return NextResponse.json({ ok: true, message: 'Demo data seeded successfully' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Seed failed';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'POST to this endpoint to seed demo data' });
}
