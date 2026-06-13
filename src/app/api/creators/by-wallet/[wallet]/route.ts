import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByWallet } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;
    const creator = await getCreatorByWallet(wallet);
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }
    return NextResponse.json(creator);
  } catch (err) {
    console.error('GET /api/creators/by-wallet/[wallet]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
