'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface TipRecord {
  creatorUsername: string;
  tipperWallet: string;
  amount: number;
  token: string;
  thankYouMessage: string;
  txSignature: string;
  timestamp: number;
  message?: string;
}

interface SupporterWallProps {
  username: string;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function SupporterWall({ username }: SupporterWallProps) {
  const [tips, setTips] = useState<TipRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    fetch(`/api/tips/${username}`)
      .then((r) => r.json())
      .then((data: TipRecord[]) => setTips(Array.isArray(data) ? data : []))
      .catch(() => setTips([]))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-2xl shimmer" />
        ))}
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <div className="flex flex-col items-center py-12">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-4xl mb-3"
        >
          🌟
        </motion.div>
        <p className="text-white font-bold mb-1">Be the first to tip!</p>
        <p className="text-gray-500 text-sm">Your name will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-4 h-4" style={{ color: '#FF6B6B' }} />
        <span className="text-sm font-bold text-white">{tips.length} Supporters</span>
      </div>
      {tips.map((tip, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start justify-between gap-3 p-3 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #9945FF40, #00F0FF30)' }}
            >
              {tip.tipperWallet[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold font-mono truncate">
                {tip.tipperWallet.slice(0, 6)}…{tip.tipperWallet.slice(-4)}
              </p>
              {tip.message && (
                <p className="text-gray-400 text-xs truncate">{tip.message}</p>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-bold" style={{ color: tip.token === 'SOL' ? '#9945FF' : '#22C55E' }}>
              {tip.token === 'SOL' ? '◎' : '$'}{tip.amount}
            </p>
            <p className="text-gray-600 text-xs">{timeAgo(tip.timestamp)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
