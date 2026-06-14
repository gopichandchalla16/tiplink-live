import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByWallet } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: { wallet: string } }
) {
  const creator = await getCreatorByWallet(params.wallet);
  if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  return NextResponse.json({ creator });
}
