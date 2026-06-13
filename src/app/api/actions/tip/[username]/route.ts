import { NextRequest, NextResponse } from 'next/server';
import {
  ACTIONS_CORS_HEADERS,
  type ActionGetResponse,
} from '@solana/actions';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { getCreatorByUsername } from '@/lib/storage';

const USDC_DEVNET_MINT = new PublicKey(
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: ACTIONS_CORS_HEADERS });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const creator = await getCreatorByUsername(username);
  if (!creator) {
    return NextResponse.json(
      { error: 'Creator not found' },
      { status: 404, headers: ACTIONS_CORS_HEADERS }
    );
  }

  const base = `${appUrl}/api/actions/tip/${username}`;

  const payload: ActionGetResponse = {
    title: `Tip ${creator.name} ⚡`,
    icon: creator.avatarUrl || `${appUrl}/icon.png`,
    description: creator.bio || `Support ${creator.name} on Solana`,
    label: 'Send Tip',
    links: {
      actions: [
        {
          label: '0.05 SOL',
          href: `${base}?amount=0.05&token=SOL`,
          type: 'transaction',
        },
        {
          label: '0.1 SOL',
          href: `${base}?amount=0.1&token=SOL`,
          type: 'transaction',
        },
        {
          label: '0.5 SOL',
          href: `${base}?amount=0.5&token=SOL`,
          type: 'transaction',
        },
        {
          label: '1 USDC',
          href: `${base}?amount=1&token=USDC`,
          type: 'transaction',
        },
        {
          label: 'Custom Amount',
          href: `${base}?amount={amount}&token=SOL`,
          type: 'transaction',
          parameters: [
            {
              name: 'amount',
              label: 'SOL amount',
              required: true,
            },
          ],
        },
      ],
    },
  };

  return NextResponse.json(payload, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(request.url);
    const amountStr = searchParams.get('amount') ?? '0.1';
    const token = (searchParams.get('token') ?? 'SOL').toUpperCase();
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const body = (await request.json()) as { account: string };
    const { account } = body;

    if (!account) {
      return NextResponse.json(
        { error: 'Missing account in request body' },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const creator = await getCreatorByUsername(username);
    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const senderPubkey = new PublicKey(account);
    const recipientPubkey = new PublicKey(creator.walletAddress);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const tx = new Transaction({
      feePayer: senderPubkey,
      blockhash,
      lastValidBlockHeight,
    });

    if (token === 'SOL') {
      tx.add(
        SystemProgram.transfer({
          fromPubkey: senderPubkey,
          toPubkey: recipientPubkey,
          lamports: Math.round(amount * LAMPORTS_PER_SOL),
        })
      );
    } else {
      const senderATA = await getAssociatedTokenAddress(
        USDC_DEVNET_MINT,
        senderPubkey
      );
      const recipientATA = await getAssociatedTokenAddress(
        USDC_DEVNET_MINT,
        recipientPubkey
      );

      const recipientATAInfo = await connection.getAccountInfo(recipientATA);
      if (!recipientATAInfo) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            senderPubkey,
            recipientATA,
            recipientPubkey,
            USDC_DEVNET_MINT
          )
        );
      }

      tx.add(
        createTransferInstruction(
          senderATA,
          recipientATA,
          senderPubkey,
          Math.round(amount * 1_000_000),
          [],
          TOKEN_PROGRAM_ID
        )
      );
    }

    const serialized = tx
      .serialize({ requireAllSignatures: false })
      .toString('base64');

    // Inline object — no ActionPostResponse annotation needed.
    // @solana/actions v1.6+ requires `type: 'transaction'` on the response.
    return NextResponse.json(
      {
        type: 'transaction' as const,
        transaction: serialized,
        message: `Tip ${amount} ${token} to ${creator.name}`,
      },
      { headers: ACTIONS_CORS_HEADERS }
    );
  } catch (err) {
    console.error('[POST /api/actions/tip]', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { error: msg },
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
}
