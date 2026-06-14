/**
 * GET /api/tips/count
 * Returns the REAL total tip count from MongoDB (or memory fallback).
 * This is the source of truth for the live counter displayed on the homepage.
 * Every number shown is real — we never hardcode or inflate it.
 */
import { NextResponse } from 'next/server';
import { getAllCreators } from '@/lib/storage';

export async function GET() {
  const creators = await getAllCreators();
  const total = creators.reduce((s, c) => s + (c.tipCount ?? 0), 0);
  return NextResponse.json({ count: total });
}
