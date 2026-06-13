import mongoose, { Schema, Document, Model } from 'mongoose';

/* ── Creator ─────────────────────────────────────────────── */
export interface ICreator extends Document {
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
}

const CreatorSchema = new Schema<ICreator>({
  username: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  category: { type: String, default: 'Other' },
  walletAddress: { type: String, required: true },
  personality: { type: String, default: 'warm' },
  totalTips: { type: Number, default: 0 },
  tipCount: { type: Number, default: 0 },
  createdAt: { type: Number, default: () => Date.now() },
});

export const CreatorModel: Model<ICreator> =
  mongoose.models.Creator ??
  mongoose.model<ICreator>('Creator', CreatorSchema);

/* ── TipRecord ───────────────────────────────────────────── */
export interface ITipRecord extends Document {
  creatorUsername: string;
  tipperWallet: string;
  amount: number;
  token: string;
  thankYouMessage: string;
  txSignature: string;
  timestamp: number;
}

const TipRecordSchema = new Schema<ITipRecord>({
  creatorUsername: { type: String, required: true },
  tipperWallet: { type: String, required: true },
  amount: { type: Number, required: true },
  token: { type: String, required: true },
  thankYouMessage: { type: String, default: '' },
  txSignature: { type: String, required: true },
  timestamp: { type: Number, default: () => Date.now() },
});

export const TipModel: Model<ITipRecord> =
  mongoose.models.TipRecord ??
  mongoose.model<ITipRecord>('TipRecord', TipRecordSchema);
