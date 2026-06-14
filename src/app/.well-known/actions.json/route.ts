import { NextResponse } from 'next/server';

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

export async function GET() {
  const rules = {
    rules: [
      { pathPattern: '/tip/**', apiPath: '/api/actions/tip/**' },
      { pathPattern: '/api/actions/**', apiPath: '/api/actions/**' },
    ],
  };
  return NextResponse.json(rules, { headers: ACTIONS_CORS_HEADERS });
}
