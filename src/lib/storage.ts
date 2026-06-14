import { MongoClient, Db, ObjectId } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

async function getDb(): Promise<Db> {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');
  client = new MongoClient(uri);
  await client.connect();
  db = client.db('tiplink');
  return db;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Creator {
  _id?: ObjectId;
  username: string;
  displayName: string;
  bio?: string;
  walletAddress: string;
  avatarUrl?: string;
  tipCount: number;
  totalTips: number;
  createdAt: Date;
}

export interface Tip {
  _id?: ObjectId;
  senderAddress: string;
  recipientUsername: string;
  amount: number;
  message?: string;
  transactionSignature?: string;
  createdAt: Date;
}

// ─── Creator Functions ─────────────────────────────────────────────────────────

export async function createCreator(data: {
  username: string;
  displayName: string;
  bio?: string;
  walletAddress: string;
  avatarUrl?: string;
}): Promise<Creator> {
  const database = await getDb();
  const existing = await database.collection('creators').findOne({ username: data.username });
  if (existing) throw new Error('Username already taken');

  const creator: Creator = {
    ...data,
    tipCount: 0,
    totalTips: 0,
    createdAt: new Date(),
  };
  await database.collection('creators').insertOne(creator);
  return creator;
}

export async function getCreatorByUsername(username: string): Promise<Creator | null> {
  const database = await getDb();
  return database.collection<Creator>('creators').findOne({ username });
}

export async function getCreatorByWallet(walletAddress: string): Promise<Creator | null> {
  const database = await getDb();
  return database.collection<Creator>('creators').findOne({ walletAddress });
}

export async function getAllCreators(): Promise<Creator[]> {
  const database = await getDb();
  return database.collection<Creator>('creators').find({}).sort({ totalTips: -1 }).toArray();
}

export async function updateCreatorStats(username: string, amount: number): Promise<void> {
  const database = await getDb();
  await database.collection('creators').updateOne(
    { username },
    { $inc: { tipCount: 1, totalTips: amount } }
  );
}

// ─── Tip Functions ─────────────────────────────────────────────────────────────

export async function createTip(data: {
  senderAddress: string;
  recipientUsername: string;
  amount: number;
  message?: string;
  transactionSignature?: string;
}): Promise<Tip> {
  const database = await getDb();
  const tip: Tip = { ...data, createdAt: new Date() };
  await database.collection('tips').insertOne(tip);
  await updateCreatorStats(data.recipientUsername, data.amount);
  return tip;
}

export async function getTipsByUsername(username: string): Promise<Tip[]> {
  const database = await getDb();
  return database
    .collection<Tip>('tips')
    .find({ recipientUsername: username })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getTipsBySender(senderAddress: string): Promise<Tip[]> {
  const database = await getDb();
  return database
    .collection<Tip>('tips')
    .find({ senderAddress })
    .sort({ createdAt: -1 })
    .toArray();
}

// ─── Utility ───────────────────────────────────────────────────────────────────

export function generateThankYouMessage(creatorName: string, amount: number): string {
  const messages = [
    `🙏 ${creatorName} is blown away by your ${amount} SOL tip! You're a legend!`,
    `⚡ Wow! ${creatorName} just received ${amount} SOL from you — thank you so much!`,
    `🎉 ${creatorName} says: "${amount} SOL?! You just made my day!"`,
    `🚀 Your ${amount} SOL tip is fueling ${creatorName}'s next creation. Thank you!`,
    `💜 ${creatorName} is grateful for your generous ${amount} SOL tip!`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
