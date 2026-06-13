import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByWallet, getTipsByUsername } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;
    const creator = await getCreatorByWallet(wallet);
    if (!creator)
      return NextResponse.json({ error: 'Creator not found for this wallet' }, { status: 404 });
    const tips = await getTipsByUsername(creator.username);
    return NextResponse.json({ creator, tips });
  } catch (err) {
    console.error('[GET /api/tips/by-wallet/[wallet]]', err);
    return NextResponse.json({ error: 'Failed to fetch by wallet' }, { status: 500 });
  }
}
