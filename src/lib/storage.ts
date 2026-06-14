export interface Creator {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  category: string;
  personality: string;
  walletAddress: string;
  totalTips: number;
  tipCount: number;
  createdAt: number;
}

export interface TipRecord {
  creatorUsername: string;
  tipperWallet: string;
  amount: number;
  token: string;
  thankYouMessage: string;
  txSignature: string;
  timestamp: number;
  message?: string;
}

// In-memory fallback
const memCreators = new Map<string, Creator>();
const memTips: TipRecord[] = [];

function isMongoAvailable(): boolean {
  return !!process.env.MONGODB_URI;
}

async function getDb() {
  const mod = await import('./mongodb');
  const clientPromise = mod.default;
  if (!clientPromise) throw new Error('MongoDB client not initialised');
  const client = await clientPromise;
  return client.db('tiplink');
}

export async function getCreatorByUsername(username: string): Promise<Creator | null> {
  if (isMongoAvailable()) {
    try {
      const db = await getDb();
      const doc = await db.collection('creators').findOne({ username: username.toLowerCase() });
      if (!doc) return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...rest } = doc;
      return rest as Creator;
    } catch (e) {
      console.error('[storage] MongoDB getCreatorByUsername failed, using memory:', e);
    }
  }
  return memCreators.get(username.toLowerCase()) ?? null;
}

export async function getCreatorByWallet(wallet: string): Promise<Creator | null> {
  if (isMongoAvailable()) {
    try {
      const db = await getDb();
      const doc = await db.collection('creators').findOne({ walletAddress: wallet });
      if (!doc) return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...rest } = doc;
      return rest as Creator;
    } catch (e) {
      console.error('[storage] MongoDB getCreatorByWallet failed, using memory:', e);
    }
  }
  for (const c of memCreators.values()) {
    if (c.walletAddress === wallet) return c;
  }
  return null;
}

export async function getAllCreators(): Promise<Creator[]> {
  if (isMongoAvailable()) {
    try {
      const db = await getDb();
      const docs = await db.collection('creators').find({}).sort({ totalTips: -1 }).toArray();
      return docs.map(({ _id, ...rest }) => rest as Creator);
    } catch (e) {
      console.error('[storage] MongoDB getAllCreators failed, using memory:', e);
    }
  }
  return Array.from(memCreators.values()).sort((a, b) => b.totalTips - a.totalTips);
}

export async function createCreator(
  data: Omit<Creator, 'totalTips' | 'tipCount' | 'createdAt'>
): Promise<Creator> {
  const creator: Creator = {
    ...data,
    username: data.username.toLowerCase(),
    totalTips: 0,
    tipCount: 0,
    createdAt: Date.now(),
  };
  if (isMongoAvailable()) {
    try {
      const db = await getDb();
      // upsert to avoid duplicate key errors on retries
      await db.collection('creators').updateOne(
        { username: creator.username },
        { $setOnInsert: { ...creator } },
        { upsert: true }
      );
      return creator;
    } catch (e) {
      console.error('[storage] MongoDB createCreator failed, using memory:', e);
    }
  }
  memCreators.set(creator.username, creator);
  return creator;
}

export async function getTipsByUsername(username: string): Promise<TipRecord[]> {
  if (isMongoAvailable()) {
    try {
      const db = await getDb();
      const docs = await db
        .collection('tips')
        .find({ creatorUsername: username.toLowerCase() })
        .sort({ timestamp: -1 })
        .toArray();
      return docs.map(({ _id, ...rest }) => rest as TipRecord);
    } catch (e) {
      console.error('[storage] MongoDB getTipsByUsername failed, using memory:', e);
    }
  }
  return memTips
    .filter((t) => t.creatorUsername === username.toLowerCase())
    .sort((a, b) => b.timestamp - a.timestamp);
}

export async function recordTip(tip: Omit<TipRecord, 'timestamp'>): Promise<TipRecord> {
  const record: TipRecord = { ...tip, timestamp: Date.now() };
  if (isMongoAvailable()) {
    try {
      const db = await getDb();
      await db.collection('tips').insertOne({ ...record });
      return record;
    } catch (e) {
      console.error('[storage] MongoDB recordTip failed, using memory:', e);
    }
  }
  memTips.push(record);
  return record;
}

export async function updateCreatorStats(username: string, amount: number): Promise<void> {
  if (isMongoAvailable()) {
    try {
      const db = await getDb();
      await db.collection('creators').updateOne(
        { username: username.toLowerCase() },
        { $inc: { totalTips: amount, tipCount: 1 } }
      );
      return;
    } catch (e) {
      console.error('[storage] MongoDB updateCreatorStats failed, using memory:', e);
    }
  }
  const c = memCreators.get(username.toLowerCase());
  if (c) {
    c.totalTips += amount;
    c.tipCount += 1;
    memCreators.set(username.toLowerCase(), c);
  }
}

// ── Inline thank-you generation (avoids self HTTP call in serverless) ──
const TY_FALLBACKS: Record<string, string> = {
  grateful: 'Thank you SO much for the tip! Your support truly means everything. 🙏',
  hype: 'LFG!! That tip just MADE MY DAY!! You absolute legend!! 🔥🚀💯',
  professional: 'Thank you for your generous contribution. Your support is sincerely appreciated.',
  creative: 'Your tip is like sunlight through glass — it bends into color and fills this work with new possibility. ✨',
};

const TY_TONES: Record<string, string> = {
  grateful: 'Warm, heartfelt, personal, genuinely moved. Use first person. Max 2 sentences.',
  hype: 'HIGH ENERGY, excited, caps and emojis, LETS GOOOO energy. Max 2 short punchy sentences.',
  professional: 'Clean, polished, formal but warm. No slang. Max 2 sentences.',
  creative: 'Poetic, metaphorical, imaginative. Paint a vivid picture in max 2 sentences.',
};

export async function generateThankYouMessage(opts: {
  creatorName: string;
  personality: string;
  amount: number;
  token: string;
  tipperWallet: string;
  supporterCount: number;
}): Promise<string> {
  const { creatorName, personality, amount, token, tipperWallet, supporterCount } = opts;
  const apiKey = process.env.GEMINI_API_KEY;
  const p = personality || 'grateful';

  if (!apiKey) return TY_FALLBACKS[p] ?? TY_FALLBACKS.grateful;

  try {
    const prompt = `You are ${creatorName}, a Solana creator. Write a thank-you message for a tip.
Tone: ${TY_TONES[p] ?? TY_TONES.grateful}
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

    if (!res.ok) return TY_FALLBACKS[p];

    const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    const msg = raw.replace(/^[\'\'\"\u201c\u201d]+|[\'\'\"\u201c\u201d]+$/g, '').trim();
    return (msg || TY_FALLBACKS[p]).slice(0, 150);
  } catch {
    return TY_FALLBACKS[p] ?? TY_FALLBACKS.grateful;
  }
}
