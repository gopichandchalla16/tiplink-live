import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByUsername, recordTip } from '@/lib/storage';
import { isValidSolanaAddress, solToLamports } from '@/lib/solana';

export async function GET(
  _req: NextRequest,
  { params }: { params: { username: string } }
) {
  const creator = await getCreatorByUsername(params.username);
  if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

  return NextResponse.json({
    icon: creator.avatarUrl ?? `https://api.dicebear.com/8.x/identicon/svg?seed=${creator.username}`,
    title: `Tip ${creator.displayName}`,
    description: creator.bio || `Send SOL to support ${creator.displayName} on TipLink Live`,
    label: 'Send Tip',
    links: {
      actions: [
        { label: '0.1 SOL', href: `/api/actions/tip/${params.username}?amount=0.1` },
        { label: '0.5 SOL', href: `/api/actions/tip/${params.username}?amount=0.5` },
        { label: '1 SOL', href: `/api/actions/tip/${params.username}?amount=1` },
        {
          label: 'Custom Amount',
          href: `/api/actions/tip/${params.username}?amount={amount}`,
          parameters: [{ name: 'amount', label: 'SOL amount', required: true }],
        },
      ],
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = parseFloat(searchParams.get('amount') ?? '0.1');
    const body = await req.json();
    const senderAddress: string = body?.account ?? 'anonymous';

    if (senderAddress !== 'anonymous' && !isValidSolanaAddress(senderAddress)) {
      return NextResponse.json({ error: 'Invalid sender wallet address' }, { status: 400 });
    }

    const creator = await getCreatorByUsername(params.username);
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    const mockTxBase64 = Buffer.from(
      JSON.stringify({ to: creator.walletAddress, amount: solToLamports(amount) })
    ).toString('base64');

    await recordTip({
      senderAddress,
      recipientUsername: params.username,
      amount,
      message: body?.message ?? '',
      txSignature: `mock_${Date.now()}`,
    });

    return NextResponse.json({
      transaction: mockTxBase64,
      message: `Tipped ${amount} SOL to ${creator.displayName}!`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
