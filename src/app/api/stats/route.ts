import { NextResponse } from 'next/server';
import { getAllCreators } from '@/lib/storage';

// Returns real aggregated stats from MongoDB (or memory fallback)
export async function GET() {
  try {
    const creators = await getAllCreators();
    const totalTipCount = creators.reduce((s, c) => s + (c.tipCount ?? 0), 0);
    const totalSOL = creators.reduce((s, c) => s + (c.totalTips ?? 0), 0);
    const creatorCount = creators.length;
    return NextResponse.json({
      totalTipCount,
      totalSOL: parseFloat(totalSOL.toFixed(4)),
      creatorCount,
      // live = real DB number, never hardcoded
    });
  } catch {
    return NextResponse.json({ totalTipCount: 0, totalSOL: 0, creatorCount: 0 });
  }
}
