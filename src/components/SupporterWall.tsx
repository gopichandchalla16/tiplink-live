'use client';
import { motion } from 'framer-motion';

interface Supporter {
  name: string;
  amount: number;
  message?: string;
  timestamp: string;
}

interface SupporterWallProps {
  supporters: Supporter[];
  creatorName: string;
}

export default function SupporterWall({ supporters, creatorName }: SupporterWallProps) {
  if (!supporters || supporters.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">🌟</div>
        <p className="text-white/40 text-sm">Be the first to support {creatorName}!</p>
      </div>
    );
  }

  const totalSOL = supporters.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="w-full">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Supporters', value: supporters.length.toString() },
          { label: 'Total SOL', value: `◎ ${totalSOL.toFixed(2)}` },
          { label: 'Latest', value: supporters[0]?.name || '-' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Supporter list */}
      <div className="space-y-2.5">
        {supporters.slice(0, 10).map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            {/* Rank badge */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              i === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
              i === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/40' :
              i === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
              'bg-white/10 text-white/40 border border-white/20'
            }`}>
              {i === 0 ? '👑' : i + 1}
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {s.name[0]?.toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{s.name}</p>
              {s.message && (
                <p className="text-xs text-white/40 truncate italic">&ldquo;{s.message}&rdquo;</p>
              )}
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-purple-300">◎ {s.amount}</p>
              <p className="text-xs text-white/30">{s.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
