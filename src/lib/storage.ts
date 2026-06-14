// ============================================================
// TipLink Live — Storage Layer
// Exports EVERY function needed by all API routes.
// Falls back to in-memory store when MONGODB_URI is absent.
// ============================================================

import clientPromise from './mongodb';

// ─── Types ───────────────────────────────────────────────────
export interface Creator {
  username: string;
  displayName: string;
  bio: string;
  walletAddress: string;
  avatarUrl?: string;
  totalTips: number;
  tipCount: number;
  createdAt: Date;
}

export interface Tip {
  id: string;
  senderAddress: string;
  senderUsername?: string;
  recipientUsername: string;
  amount: number;
  message: string;
  txSignature: string;
  createdAt: Date;
}

// ─── In-Memory Fallback ───────────────────────────────────────
const mem: { creators: Creator[]; tips: Tip[] } = { creators: [], tips: [] };

async function db() {
  try {
    const client = await clientPromise;
    if (!client) return null;
    return client.db('tiplink');
  } catch {
    return null;
  }
}

// ─── Creator Functions ────────────────────────────────────────

/** Get creator by username (used by most API routes) */
export async function getCreator(username: string): Promise<Creator | null> {
  const d = await db();
  if (d) return d.collection<Creator>('creators').findOne({ username }) as Promise<Creator | null>;
  return mem.creators.find((c) => c.username === username) ?? null;
}

/** Alias — used by /api/creator and /api/creators/[username] routes */
export async function getCreatorByUsername(username: string): Promise<Creator | null> {
  return getCreator(username);
}

/** Get creator by wallet address — used by /api/creators/by-wallet and /api/tips/by-wallet */
export async function getCreatorByWallet(walletAddress: string): Promise<Creator | null> {
  const d = await db();
  if (d) return d.collection<Creator>('creators').findOne({ walletAddress }) as Promise<Creator | null>;
  return mem.creators.find((c) => c.walletAddress === walletAddress) ?? null;
}

/** Get all creators */
export async function getAllCreators(): Promise<Creator[]> {
  const d = await db();
  if (d) return d.collection<Creator>('creators').find().toArray() as Promise<Creator[]>;
  return mem.creators;
}

/** Create a new creator */
export async function createCreator(
  data: Omit<Creator, 'totalTips' | 'tipCount' | 'createdAt'>
): Promise<Creator> {
  const creator: Creator = { ...data, totalTips: 0, tipCount: 0, createdAt: new Date() };
  const d = await db();
  if (d) await d.collection('creators').insertOne(creator);
  else mem.creators.push(creator);
  return creator;
}

/** Update creator stats after a tip */
export async function updateCreatorStats(
  username: string,
  amount: number
): Promise<void> {
  const d = await db();
  if (d) {
    await d.collection('creators').updateOne(
      { username },
      { $inc: { totalTips: amount, tipCount: 1 } }
    );
  } else {
    const c = mem.creators.find((x) => x.username === username);
    if (c) { c.totalTips += amount; c.tipCount += 1; }
  }
}

// ─── Tip Functions ────────────────────────────────────────────

/** Record a new tip and auto-update creator stats */
export async function recordTip(tip: Omit<Tip, 'id' | 'createdAt'>): Promise<Tip> {
  const newTip: Tip = { ...tip, id: Math.random().toString(36).slice(2), createdAt: new Date() };
  const d = await db();
  if (d) {
    await d.collection('tips').insertOne(newTip);
    await d.collection('creators').updateOne(
      { username: tip.recipientUsername },
      { $inc: { totalTips: tip.amount, tipCount: 1 } }
    );
  } else {
    mem.tips.push(newTip);
    const c = mem.creators.find((x) => x.username === tip.recipientUsername);
    if (c) { c.totalTips += tip.amount; c.tipCount += 1; }
  }
  return newTip;
}

/** Get all tips for a creator by username */
export async function getTipsForCreator(username: string): Promise<Tip[]> {
  const d = await db();
  if (d) return d.collection<Tip>('tips').find({ recipientUsername: username }).toArray() as Promise<Tip[]>;
  return mem.tips.filter((t) => t.recipientUsername === username);
}

/** Alias — used by /api/tips/[username] and /api/tips/by-wallet routes */
export async function getTipsByUsername(username: string): Promise<Tip[]> {
  return getTipsForCreator(username);
}

/** Get all tips sent by a wallet address */
export async function getTipsBySender(senderAddress: string): Promise<Tip[]> {
  const d = await db();
  if (d) return d.collection<Tip>('tips').find({ senderAddress }).toArray() as Promise<Tip[]>;
  return mem.tips.filter((t) => t.senderAddress === senderAddress);
}

/** Get all tips (for dashboard leaderboard) */
export async function getAllTips(): Promise<Tip[]> {
  const d = await db();
  if (d) return d.collection<Tip>('tips').find().sort({ createdAt: -1 }).toArray() as Promise<Tip[]>;
  return [...mem.tips].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// ─── Utility ─────────────────────────────────────────────────

/** Generate a thank-you message — used by /api/thankyou and /api/tips routes */
export function generateThankYouMessage(creatorName: string, amount: number): string {
  const messages = [
    `🙏 Thank you so much! Your ${amount} SOL tip means the world to ${creatorName}!`,
    `💜 ${creatorName} is grateful for your ${amount} SOL support! You rock!`,
    `🚀 ${amount} SOL received! ${creatorName} appreciates your generosity!`,
    `✨ Wow! ${creatorName} just received ${amount} SOL from an amazing supporter!`,
    `🎉 ${creatorName} says: Thank you for the ${amount} SOL tip — you made their day!`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
