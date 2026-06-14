import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByUsername, updateCreatorStats, generateThankYouMessage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientUsername, amount } = body;
    if (!recipientUsername || !amount) {
      return NextResponse.json({ error: 'recipientUsername and amount required' }, { status: 400 });
    }
    const creator = await getCreatorByUsername(recipientUsername);
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    await updateCreatorStats(recipientUsername, parseFloat(amount));
    const message = generateThankYouMessage(creator.displayName, parseFloat(amount));
    return NextResponse.json({ message });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
