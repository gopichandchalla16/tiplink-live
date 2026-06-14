import { NextRequest, NextResponse } from 'next/server';
import { PublicKey, Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

// ------------------------------------------------------------------
// POST /api/tip
// Backend tip processor — validates addresses, builds unsigned Solana
// transaction, returns base64 for client-side signing.
// Called from tip pages after wallet connection.
// ------------------------------------------------------------------

const RPC_ENDPOINT = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromWallet, toWallet, amountSol, message } = body;

    // ── Validate inputs ──────────────────────────────────────────────
    if (!fromWallet || !toWallet || !amountSol) {
      return NextResponse.json({ error: 'Missing required fields: fromWallet, toWallet, amountSol' }, { status: 400 });
    }

    let fromPubkey: PublicKey;
    let toPubkey: PublicKey;
    try {
      fromPubkey = new PublicKey(fromWallet);
      toPubkey = new PublicKey(toWallet);
    } catch {
      return NextResponse.json({ error: 'Invalid wallet address (must be valid Solana base58 public key)' }, { status: 400 });
    }

    const lamports = Math.round(parseFloat(amountSol) * LAMPORTS_PER_SOL);
    if (isNaN(lamports) || lamports <= 0) {
      return NextResponse.json({ error: 'Invalid amount — must be positive SOL value' }, { status: 400 });
    }

    // ── Build unsigned transaction ────────────────────────────────────
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: fromPubkey,
    }).add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );

    // Serialize to base64 for client-side signing
    const serialized = transaction.serialize({ requireAllSignatures: false }).toString('base64');

    return NextResponse.json({
      success: true,
      transaction: serialized,
      blockhash,
      lastValidBlockHeight,
      amountLamports: lamports,
      amountSol: parseFloat(amountSol),
      from: fromWallet,
      to: toWallet,
      message: message || '',
    });

  } catch (err: any) {
    console.error('[/api/tip] Error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}

// GET /api/tip — health check & endpoint documentation
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/tip',
    method: 'POST',
    description: 'Build an unsigned Solana SOL transfer transaction for client-side wallet signing',
    fields: {
      fromWallet: 'string — sender Solana public key (base58)',
      toWallet: 'string — recipient Solana public key (base58)',
      amountSol: 'number — amount in SOL (e.g. 0.1)',
      message: 'string? — optional tip message',
    },
    returns: {
      transaction: 'base64 unsigned transaction ready for wallet.signAndSendTransaction()',
      blockhash: 'string',
      lastValidBlockHeight: 'number',
    },
    network: RPC_ENDPOINT.includes('devnet') ? 'devnet' : 'mainnet-beta',
  });
}
