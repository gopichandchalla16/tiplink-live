import { NextRequest, NextResponse } from 'next/server';
import { getAllTips, recordTip, getCreatorByUsername, updateCreatorStats, generateThankYouMessage } from '@/lib/storage';
import { isValidSolanaAddress, solToLamports } from '@/lib/solana';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    if (username) {
      const { getTipsForCreator } = await import('@/lib/storage');
      const tips = await getTipsForCreator(username);
      return NextResponse.json({ tips });
    }
    const tips = await getAllTips();
    return NextResponse.json({ tips });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ tips: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderAddress, recipientUsername, amount, message, txSignature } = body;

    if (!recipientUsername || !amount) {
      return NextResponse.json({ error: 'recipientUsername and amount required' }, { status: 400 });
    }

    const creator = await getCreatorByUsername(recipientUsername);
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    const solAmount = parseFloat(amount);
    const _lamports = solToLamports(solAmount); // kept for future real tx

    const tip = await recordTip({
      senderAddress: senderAddress ?? 'anonymous',
      recipientUsername,
      amount: solAmount,
      message: message ?? '',
      txSignature: txSignature ?? `mock_${Date.now()}`,
    });

    await updateCreatorStats(recipientUsername, solAmount);
    const thankYou = generateThankYouMessage(creator.displayName, solAmount);

    return NextResponse.json({ tip, thankYou }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
