import { NextRequest, NextResponse } from 'next/server';
import {
  Connection, PublicKey, SystemProgram,
  Transaction, clusterApiUrl, LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { getCreatorByUsername } from '@/lib/storage';

// Inline CORS headers — replaces the missing @solana/actions package
const ACTIONS_CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept-Encoding',
  'X-Action-Version': '2.1.3',
  'X-Blockchain-Ids': 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: ACTIONS_CORS_HEADERS });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const creator = await getCreatorByUsername(username);
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404, headers: ACTIONS_CORS_HEADERS });
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tiplink-live.vercel.app';
    return NextResponse.json({
      title: `Tip ${creator.name}`,
      icon: creator.avatarUrl || `${appUrl}/icon.png`,
      description: creator.bio || `Support ${creator.name} on TipLink Live`,
      label: 'Send Tip',
      links: {
        actions: [
          { label: '0.05 SOL', href: `${appUrl}/api/actions/tip/${username}?amount=0.05&token=SOL` },
          { label: '0.1 SOL',  href: `${appUrl}/api/actions/tip/${username}?amount=0.1&token=SOL`  },
          { label: '0.5 SOL',  href: `${appUrl}/api/actions/tip/${username}?amount=0.5&token=SOL`  },
          { label: '1 USDC',   href: `${appUrl}/api/actions/tip/${username}?amount=1&token=USDC`   },
          {
            label: 'Custom Amount',
            href: `${appUrl}/api/actions/tip/${username}?amount={amount}&token=SOL`,
            parameters: [{ name: 'amount', label: 'Enter SOL amount', required: true }],
          },
        ],
      },
    }, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    console.error('[GET /api/actions/tip/[username]]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(req.url);
    const amountStr = searchParams.get('amount') || '0.1';
    const token = searchParams.get('token') || 'SOL';
    const amount = parseFloat(amountStr);
    if (!amount || amount <= 0 || isNaN(amount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }
    const creator = await getCreatorByUsername(username);
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404, headers: ACTIONS_CORS_HEADERS });
    }
    const body = await req.json() as { account: string };
    const senderPubkey = new PublicKey(body.account);
    const recipientPubkey = new PublicKey(creator.walletAddress);
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const { blockhash } = await connection.getLatestBlockhash();
    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.feePayer = senderPubkey;
    tx.add(SystemProgram.transfer({
      fromPubkey: senderPubkey,
      toPubkey: recipientPubkey,
      lamports: token === 'SOL' ? Math.floor(amount * LAMPORTS_PER_SOL) : 1000,
    }));
    const serialized = tx.serialize({ requireAllSignatures: false });
    const base64 = Buffer.from(serialized).toString('base64');
    return NextResponse.json({ type: 'transaction', transaction: base64, message: `Tipping ${amount} ${token} to ${creator.name} 🚀` }, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    console.error('[POST /api/actions/tip/[username]]', err);
    return NextResponse.json({ error: 'Transaction build failed' }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
}
