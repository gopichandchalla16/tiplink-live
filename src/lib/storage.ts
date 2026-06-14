// In-memory + MongoDB storage abstraction
// Falls back gracefully when MONGODB_URI is not set

import clientPromise from './mongodb';

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
  recipientUsername: string;
  amount: number; // in SOL
  message: string;
  txSignature: string;
  createdAt: Date;
}

// In-memory fallback store
const memoryStore: { creators: Creator[]; tips: Tip[] } = {
  creators: [],
  tips: [],
};

async function getDb() {
  try {
    const client = await clientPromise;
    if (!client) return null;
    return client.db('tiplink');
  } catch {
    return null;
  }
}

export async function getCreator(username: string): Promise<Creator | null> {
  const db = await getDb();
  if (db) {
    return db.collection<Creator>('creators').findOne({ username }) as Promise<Creator | null>;
  }
  return memoryStore.creators.find((c) => c.username === username) ?? null;
}

export async function createCreator(data: Omit<Creator, 'totalTips' | 'tipCount' | 'createdAt'>): Promise<Creator> {
  const creator: Creator = {
    ...data,
    totalTips: 0,
    tipCount: 0,
    createdAt: new Date(),
  };
  const db = await getDb();
  if (db) {
    await db.collection('creators').insertOne(creator);
  } else {
    memoryStore.creators.push(creator);
  }
  return creator;
}

export async function getAllCreators(): Promise<Creator[]> {
  const db = await getDb();
  if (db) {
    return db.collection<Creator>('creators').find().toArray() as Promise<Creator[]>;
  }
  return memoryStore.creators;
}

export async function recordTip(tip: Omit<Tip, 'id' | 'createdAt'>): Promise<Tip> {
  const newTip: Tip = {
    ...tip,
    id: Math.random().toString(36).slice(2),
    createdAt: new Date(),
  };
  const db = await getDb();
  if (db) {
    await db.collection('tips').insertOne(newTip);
    await db.collection('creators').updateOne(
      { username: tip.recipientUsername },
      { $inc: { totalTips: tip.amount, tipCount: 1 } }
    );
  } else {
    memoryStore.tips.push(newTip);
    const creator = memoryStore.creators.find((c) => c.username === tip.recipientUsername);
    if (creator) {
      creator.totalTips += tip.amount;
      creator.tipCount += 1;
    }
  }
  return newTip;
}

export async function getTipsForCreator(username: string): Promise<Tip[]> {
  const db = await getDb();
  if (db) {
    return db.collection<Tip>('tips').find({ recipientUsername: username }).toArray() as Promise<Tip[]>;
  }
  return memoryStore.tips.filter((t) => t.recipientUsername === username);
}
