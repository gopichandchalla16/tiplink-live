import { NextRequest, NextResponse } from 'next/server';
import { recordTip, updateCreatorStats, getCreatorByUsername, generateThankYouMessage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorUsername, tipperWallet, amount, token, txSignature, message } = body;

    if (!creatorUsername)
      return NextResponse.json({ error: 'creatorUsername required' }, { status: 400 });
    if (!tipperWallet)
      return NextResponse.json({ error: 'tipperWallet required' }, { status: 400 });
    if (!amount || Number(amount) <= 0)
      return NextResponse.json({ error: 'amount must be > 0' }, { status: 400 });
    if (!['SOL', 'USDC'].includes(token))
      return NextResponse.json({ error: 'token must be SOL or USDC' }, { status: 400 });

    const creator = await getCreatorByUsername(creatorUsername);
    if (!creator)
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    // Generate thank-you message directly (no self HTTP call)
    const thankYouMessage = await generateThankYouMessage({
      creatorName: creator.name,
      personality: creator.personality,
      amount: Number(amount),
      token,
      tipperWallet,
      supporterCount: (creator.tipCount ?? 0) + 1,
    });

    const tip = await recordTip({
      creatorUsername: creatorUsername.toLowerCase(),
      tipperWallet,
      amount: Number(amount),
      token,
      thankYouMessage,
      txSignature: txSignature || `mock_${Date.now()}`,
      message,
    });

    await updateCreatorStats(creatorUsername, Number(amount));

    return NextResponse.json({ tip, thankYouMessage }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/tips]', err);
    return NextResponse.json({ error: 'Failed to record tip' }, { status: 500 });
  }
}
