import { NextResponse } from 'next/server';
import { getAllCreators } from '@/lib/storage';

export async function GET() {
  try {
    const creators = await getAllCreators();
    return NextResponse.json(creators);
  } catch {
    return NextResponse.json([]);
  }
}
