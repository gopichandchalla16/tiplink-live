import { NextResponse } from 'next/server';

// ----------------------------------------------------------------
// GET /api/health
// Vercel health check endpoint.
// Returns build info + network config for monitoring.
// ----------------------------------------------------------------
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'TipLink Live',
    network: process.env.SOLANA_RPC_URL?.includes('mainnet') ? 'mainnet-beta' : 'devnet',
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
    region: process.env.VERCEL_REGION || 'local',
  });
}
