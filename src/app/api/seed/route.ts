import { NextResponse } from 'next/server';

// Seed endpoint disabled — no fake data
export async function POST() {
  return NextResponse.json({ message: 'Seed disabled.' }, { status: 403 });
}
