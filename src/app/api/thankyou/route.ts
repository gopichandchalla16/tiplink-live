import { NextRequest, NextResponse } from 'next/server';
import { generateThankYou } from '@/lib/gemini';
import { recordTip, updateCreatorStats } from '@/lib/storage';
import type { TipRecord } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      creatorName: string;
      bio: string;
      amount: number;
      token: string;
      personality: string;
      creatorUsername: string;
      tipperWallet: string;
      txSignature: string;
    };

    const {
      creatorName,
      bio,
      amount,
      token,
      personality,
      creatorUsername,
      tipperWallet,
      txSignature,
    } = body;

    if (!creatorName || !amount || !token || !creatorUsername || !txSignature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // bio is used contextually but generateThankYou takes name, amount, token, personality
    void bio;

    const thankYouMessage = await generateThankYou(
      creatorName,
      amount,
      token,
      personality ?? 'warm'
    );

    const tipData: Omit<TipRecord, 'timestamp'> = {
      creatorUsername,
      tipperWallet: tipperWallet ?? 'anonymous',
      amount,
      token,
      thankYouMessage,
      txSignature,
    };

    await recordTip(tipData);
    await updateCreatorStats(creatorUsername, amount);

    return NextResponse.json({ message: thankYouMessage });
  } catch (err) {
    console.error('[POST /api/thankyou]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
