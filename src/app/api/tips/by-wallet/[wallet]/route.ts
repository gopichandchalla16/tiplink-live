import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByWallet, getTipsByUsername } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    const creator = await getCreatorByWallet(params.wallet);
    if (!creator) return NextResponse.json({ tips: [] });
    const tips = await getTipsByUsername(creator.username);
    return NextResponse.json({ tips, creator });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ tips: [] });
  }
}
