import { NextRequest, NextResponse } from 'next/server';
import { Connection, clusterApiUrl } from '@solana/web3.js';

// ------------------------------------------------------------------
// POST /api/confirm
// After client signs and sends the transaction, call this endpoint
// with the txSignature. We verify confirmation on-chain and return
// transaction details for display.
// ------------------------------------------------------------------

const RPC_ENDPOINT = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');

export async function POST(req: NextRequest) {
  try {
    const { signature } = await req.json();
    if (!signature || typeof signature !== 'string') {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const connection = new Connection(RPC_ENDPOINT, 'confirmed');

    // Fetch transaction details from chain
    const tx = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      return NextResponse.json({ confirmed: false, message: 'Transaction not yet confirmed or not found' });
    }

    const fee = tx.meta?.fee ?? 0;
    const err = tx.meta?.err;
    const blockTime = tx.blockTime ?? null;
    const slot = tx.slot;

    if (err) {
      return NextResponse.json({
        confirmed: false,
        error: 'Transaction failed on-chain',
        details: err,
        explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      });
    }

    return NextResponse.json({
      confirmed: true,
      signature,
      slot,
      blockTime,
      fee,
      feeSol: fee / 1e9,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      message: 'Transaction confirmed on Solana',
    });

  } catch (err: any) {
    console.error('[/api/confirm] Error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}
