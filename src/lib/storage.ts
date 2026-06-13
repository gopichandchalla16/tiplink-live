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

// In-memory fallback (persists for lifetime of serverless instance)
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
      await db.collection('creators').insertOne({ ...creator });
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
