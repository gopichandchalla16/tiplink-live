import { connectDB } from './mongodb';
import { CreatorModel, TipModel } from './models';

export interface TipHistoryEntry {
  amount: number;
  token: string;
  timestamp: string;
  message?: string;
}

export interface Creator {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  category: string;
  walletAddress: string;
  personality: string;
  totalTips: number;
  tipCount: number;
  createdAt: number;
  tipHistory?: TipHistoryEntry[];
}

export interface TipRecord {
  creatorUsername: string;
  tipperWallet: string;
  amount: number;
  token: string;
  thankYouMessage: string;
  txSignature: string;
  timestamp: number;
}

/* ── In-memory fallback ──────────────────────────────────── */
const memCreators = new Map<string, Creator>();
const memTips: TipRecord[] = [];

const SEED_CREATORS: Creator[] = [
  {
    username: 'gopichand',
    name: 'Gopichand Challa',
    bio: 'Solana dev. 100+ days building in public. Web3 × AI. Team 0xGhostchain.',
    avatarUrl: 'https://avatars.githubusercontent.com/u/162360009',
    category: 'Developer',
    personality: 'hype',
    walletAddress: '7Qwepr3mXn65811111111111111111111111111111111',
    totalTips: 1.85,
    tipCount: 12,
    createdAt: Date.now(),
  },
  {
    username: 'aeyakovenko',
    name: 'Anatoly Yakovenko',
    bio: 'Co-founder of Solana. Built Proof of History.',
    avatarUrl:
      'https://pbs.twimg.com/profile_images/1876700519/Photo_on_2012-01-10_at_10.38_400x400.jpg',
    category: 'Developer',
    personality: 'professional',
    walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    totalTips: 42.5,
    tipCount: 180,
    createdAt: Date.now(),
  },
  {
    username: 'rajgokal',
    name: 'Raj Gokal',
    bio: 'Co-founder of Solana. Building the fastest chain on Earth.',
    avatarUrl:
      'https://pbs.twimg.com/profile_images/1635987657/raj_400x400.jpg',
    category: 'Developer',
    personality: 'hype',
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    totalTips: 38.2,
    tipCount: 156,
    createdAt: Date.now(),
  },
  {
    username: 'armaniferrante',
    name: 'Armani Ferrante',
    bio: 'Creator of Anchor framework for Solana smart contracts.',
    avatarUrl:
      'https://pbs.twimg.com/profile_images/1635030980238512128/mL1l5tAQ_400x400.jpg',
    category: 'Developer',
    personality: 'professional',
    walletAddress: 'AnchorFarmTokenkeg111111111111111111111111111',
    totalTips: 29.7,
    tipCount: 134,
    createdAt: Date.now(),
  },
];

function seedMemory() {
  if (memCreators.size === 0) {
    for (const c of SEED_CREATORS) {
      memCreators.set(c.username, { ...c });
    }
  }
}

function toPlain(doc: Record<string, unknown>): Creator {
  return {
    username: String(doc.username ?? ''),
    name: String(doc.name ?? ''),
    bio: String(doc.bio ?? ''),
    avatarUrl: String(doc.avatarUrl ?? ''),
    category: String(doc.category ?? 'Other'),
    walletAddress: String(doc.walletAddress ?? ''),
    personality: String(doc.personality ?? 'warm'),
    totalTips: Number(doc.totalTips ?? 0),
    tipCount: Number(doc.tipCount ?? 0),
    createdAt: Number(doc.createdAt ?? Date.now()),
    tipHistory: Array.isArray(doc.tipHistory)
      ? (doc.tipHistory as TipHistoryEntry[])
      : undefined,
  };
}

/* ── Public API ──────────────────────────────────────────── */

export async function getCreatorByUsername(
  username: string
): Promise<Creator | null> {
  const db = await connectDB();
  if (db) {
    const doc = await CreatorModel.findOne({ username: username.toLowerCase() }).lean();
    if (!doc) return null;
    return toPlain(doc as Record<string, unknown>);
  }
  seedMemory();
  return memCreators.get(username.toLowerCase()) ?? null;
}

export async function getCreatorByWallet(
  walletAddress: string
): Promise<Creator | null> {
  const db = await connectDB();
  if (db) {
    const doc = await CreatorModel.findOne({ walletAddress }).lean();
    if (!doc) return null;
    return toPlain(doc as Record<string, unknown>);
  }
  seedMemory();
  for (const c of memCreators.values()) {
    if (c.walletAddress === walletAddress) return c;
  }
  return null;
}

export async function getAllCreators(): Promise<Creator[]> {
  const db = await connectDB();
  if (db) {
    const docs = await CreatorModel.find({}).sort({ totalTips: -1 }).lean();
    return docs.map((d) => toPlain(d as Record<string, unknown>));
  }
  seedMemory();
  return Array.from(memCreators.values()).sort(
    (a, b) => b.totalTips - a.totalTips
  );
}

export async function saveCreator(creator: Creator): Promise<Creator> {
  const db = await connectDB();
  if (db) {
    const doc = await CreatorModel.findOneAndUpdate(
      { username: creator.username },
      { $setOnInsert: creator },
      { upsert: true, new: true }
    ).lean();
    return toPlain(doc as Record<string, unknown>);
  }
  seedMemory();
  memCreators.set(creator.username, creator);
  return creator;
}

export async function saveTip(tip: TipRecord): Promise<void> {
  const db = await connectDB();
  if (db) {
    await TipModel.create(tip);
    await CreatorModel.findOneAndUpdate(
      { username: tip.creatorUsername },
      {
        $inc: {
          totalTips: tip.token === 'SOL' ? tip.amount : tip.amount / 150,
          tipCount: 1,
        },
      }
    );
    return;
  }
  seedMemory();
  memTips.push(tip);
  const creator = memCreators.get(tip.creatorUsername);
  if (creator) {
    creator.totalTips += tip.token === 'SOL' ? tip.amount : tip.amount / 150;
    creator.tipCount += 1;
    memCreators.set(tip.creatorUsername, creator);
  }
}

export async function getTipsByUsername(username: string): Promise<TipRecord[]> {
  const db = await connectDB();
  if (db) {
    const docs = await TipModel.find({ creatorUsername: username })
      .sort({ timestamp: -1 })
      .lean();
    return docs.map((d) => ({
      creatorUsername: String((d as Record<string, unknown>).creatorUsername ?? ''),
      tipperWallet: String((d as Record<string, unknown>).tipperWallet ?? ''),
      amount: Number((d as Record<string, unknown>).amount ?? 0),
      token: String((d as Record<string, unknown>).token ?? 'SOL'),
      thankYouMessage: String((d as Record<string, unknown>).thankYouMessage ?? ''),
      txSignature: String((d as Record<string, unknown>).txSignature ?? ''),
      timestamp: Number((d as Record<string, unknown>).timestamp ?? 0),
    }));
  }
  seedMemory();
  return memTips
    .filter((t) => t.creatorUsername === username)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export async function initSeedDB(): Promise<void> {
  const db = await connectDB();
  if (!db) {
    seedMemory();
    return;
  }
  for (const c of SEED_CREATORS) {
    await CreatorModel.findOneAndUpdate(
      { username: c.username },
      { $setOnInsert: c },
      { upsert: true }
    );
  }
}
