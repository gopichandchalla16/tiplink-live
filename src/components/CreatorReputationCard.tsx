'use client';
import { motion } from 'framer-motion';

interface CreatorReputationCardProps {
  name: string;
  username: string;
  bio: string;
  avatar?: string;
  totalSOL: number;
  supporterCount: number;
  walletAge?: string;
  category?: string;
  personality?: string;
}

const categoryEmoji: Record<string, string> = {
  developer: '💻',
  artist: '🎨',
  musician: '🎵',
  writer: '✍️',
  gamer: '🎮',
  streamer: '🎥',
  default: '⚡',
};

export default function CreatorReputationCard({
  name,
  username,
  bio,
  avatar,
  totalSOL,
  supporterCount,
  walletAge = 'Verified',
  category = 'default',
  personality = 'energetic',
}: CreatorReputationCardProps) {
  const emoji = categoryEmoji[category.toLowerCase()] || categoryEmoji.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden"
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-orange-500/20 p-px">
        <div className="absolute inset-0 rounded-2xl bg-[#0a0a0f]" />
      </div>

      <div className="relative p-6">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-purple-500/25">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  name[0]?.toUpperCase()
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0a0a0f] flex items-center justify-center">
                <span className="text-[8px]">✓</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white leading-none">{name}</h2>
              <p className="text-sm text-purple-400 mt-0.5">@{username}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  {emoji} {category}
                </span>
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                  ✓ Wallet Verified
                </span>
              </div>
            </div>
          </div>

          {/* SOL badge */}
          <div className="text-right">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl px-3 py-2">
              <p className="text-lg font-black text-white">◎ {totalSOL.toFixed(1)}</p>
              <p className="text-xs text-white/40">total earned</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-white/60 leading-relaxed mb-5">{bio}</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'Supporters', value: supporterCount.toString(), icon: '🫶' },
            { label: 'Wallet Age', value: walletAge, icon: '🔗' },
            { label: 'Vibe', value: personality, icon: '✨' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-2.5 text-center border border-white/8">
              <p className="text-base mb-0.5">{stat.icon}</p>
              <p className="text-sm font-bold text-white leading-none">{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tip CTA */}
        <div className="grid grid-cols-3 gap-2">
          {[0.1, 0.5, 1].map(amount => (
            <motion.button
              key={amount}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="py-3 rounded-xl text-sm font-bold transition-all bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10"
            >
              ◎ {amount}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
