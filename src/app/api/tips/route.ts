import { NextRequest, NextResponse } from 'next/server';
import { recordTip, updateCreatorStats, getCreatorByUsername } from '@/lib/storage';

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

    // Generate thank-you message
    let thankYouMessage = 'Thank you for the tip! 🙏';
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tiplink-live.vercel.app';
      const res = await fetch(`${appUrl}/api/generate-thankyou`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorName: creator.name,
          personality: creator.personality,
          amount: Number(amount),
          token,
          tipperWallet,
          supporterCount: creator.tipCount + 1,
        }),
      });
      if (res.ok) {
        const data = await res.json() as { thankYouMessage?: string };
        if (data.thankYouMessage) thankYouMessage = data.thankYouMessage;
      }
    } catch { /* use fallback */ }

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
