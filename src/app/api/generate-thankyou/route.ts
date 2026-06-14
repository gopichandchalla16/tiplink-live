import { NextRequest, NextResponse } from 'next/server';

const fallbacks: Record<string, string> = {
  grateful: 'Thank you SO much for the tip! Your support truly means everything. 🙏',
  hype: 'LFG!! That tip just MADE MY DAY!! You absolute legend!! 🔥🚀💯',
  professional: 'Thank you for your generous contribution. Your support is sincerely appreciated.',
  creative: 'Your tip is like sunlight through glass — it bends into color and fills this work with new possibility. ✨',
};

const tones: Record<string, string> = {
  grateful: 'Warm, heartfelt, personal, genuinely moved. Use first person. Max 2 sentences.',
  hype: 'HIGH ENERGY, excited, use caps and emojis, LETS GOOOO energy. Max 2 short punchy sentences.',
  professional: 'Clean, polished, formal but warm. No slang. Elegant. Max 2 sentences.',
  creative: 'Poetic, metaphorical, imaginative. Paint a vivid picture in max 2 sentences.',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      creatorName: string;
      personality: string;
      amount: number;
      token: string;
      tipperWallet: string;
      supporterCount: number;
    };
    const { creatorName, personality, amount, token, tipperWallet, supporterCount } = body;
    const apiKey = process.env.GEMINI_API_KEY;
    const p = personality || 'grateful';

    if (!apiKey)
      return NextResponse.json({ thankYouMessage: fallbacks[p] ?? fallbacks.grateful });

    const prompt = `You are ${creatorName}, a Solana creator. Write a thank-you message for a tip.
Tone: ${tones[p] ?? tones.grateful}
Tip received: ${amount} ${token} from wallet ${String(tipperWallet).slice(0, 8)}...
You now have ${supporterCount} total supporters.
Rules: max 2 sentences, max 100 characters total. No quotes. Return ONLY the message text.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok)
      return NextResponse.json({ thankYouMessage: fallbacks[p] });

    const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    // Remove any surrounding quotes the model may add
    const msg = raw.replace(/^[\'\"\u201c\u201d]+|[\'\"\u201c\u201d]+$/g, '').trim();
    return NextResponse.json({ thankYouMessage: (msg || fallbacks[p]).slice(0, 150) });
  } catch (err) {
    console.error('[POST /api/generate-thankyou]', err);
    return NextResponse.json({ thankYouMessage: fallbacks['grateful'] });
  }
}
