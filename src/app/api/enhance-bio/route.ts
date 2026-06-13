import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { bio: string; name: string };
    const { bio, name } = body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ enhancedBio: bio });

    const prompt = `You are a creative copywriter. Rewrite this creator bio to be compelling, authentic, and under 160 characters. Keep the person's real voice and details.
Name: ${name}
Original bio: ${bio}
Return ONLY the enhanced bio text, nothing else.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!res.ok) return NextResponse.json({ enhancedBio: bio });
    const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const enhanced = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? bio;
    return NextResponse.json({ enhancedBio: enhanced.slice(0, 160) });
  } catch (err) {
    console.error('[POST /api/enhance-bio]', err);
    return NextResponse.json({ enhancedBio: '' }, { status: 500 });
  }
}
