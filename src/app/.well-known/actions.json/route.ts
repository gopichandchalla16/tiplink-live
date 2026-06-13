import { NextResponse } from 'next/server';
import { ACTIONS_CORS_HEADERS } from '@solana/actions';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: ACTIONS_CORS_HEADERS });
}

export async function GET() {
  const rules = {
    rules: [
      {
        pathPattern: '/tip/**',
        apiPath: '/api/actions/tip/**',
      },
      {
        pathPattern: '/api/actions/**',
        apiPath: '/api/actions/**',
      },
    ],
  };
  return NextResponse.json(rules, { headers: ACTIONS_CORS_HEADERS });
}
