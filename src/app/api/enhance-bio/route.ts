import { NextRequest, NextResponse } from 'next/server';
import { generateEnhancedBio } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { bio, name } = await req.json();
    if (!bio || !name) {
      return NextResponse.json({ error: 'bio and name are required' }, { status: 400 });
    }
    const enhancedBio = await generateEnhancedBio(name, bio);
    return NextResponse.json({ enhancedBio });
  } catch (err) {
    console.error('POST /api/enhance-bio', err);
    return NextResponse.json({ error: 'Failed to enhance bio' }, { status: 500 });
  }
}
