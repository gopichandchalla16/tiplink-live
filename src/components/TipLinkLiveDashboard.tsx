'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Radio,
  Link2,
  Map,
  Gift,
  TrendingUp,
  Users,
  DollarSign,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Twitter,
  ExternalLink,
  Star,
  Flame,
  Target,
  Wallet,
  RefreshCw,
  Eye,
  Globe,
  Sparkles,
} from 'lucide-react';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type TabId = 'dashboard' | 'obs' | 'blink' | 'spatial' | 'lootbox';

interface TipAlert {
  id: string;
  username: string;
  amount: number;
  token: 'SOL' | 'USDC';
  message: string;
  timestamp: number;
  rarity: 'common' | 'rare' | 'legendary';
  avatar: string;
}

interface SpatialDrop {
  id: string;
  x: number;
  y: number;
  amount: number;
  claimed: boolean;
  velocity: { x: number; y: number };
  opacity: number;
}

interface ActivityFeedItem {
  id: string;
  text: string;
  type: 'tip' | 'claim' | 'blink' | 'drop' | 'lootbox';
  timestamp: number;
}

interface LootboxResult {
  tier: 'common' | 'rare' | 'legendary';
  amount: number;
  probability: number;
  color: string;
  label: string;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const AVATARS = [
  '🦊','🐉','🦋','🌙','⚡','🔥','💎','🚀','🌈','🎭',
  '🦁','🐺','🦅','💫','🎮','🎯','🌊','🎸','🏆','👾',
];

const USERNAMES = [
  '0xGopi','SolanaWhale','CryptoNinja','Web3Wizard','DeFiKing',
  'BlockchainBro','NFTHunter','TokenMaster','ChainBreaker','MintMachine',
  'AnonTrader','SolSurfer','CyberPunk42','MetaVerse99','TipLordX',
];

const MESSAGES = [
  'Keep building! 🚀','Solana to the moon! 🌙','Best stream ever!',
  'LFG! 💎','This is the way','WAGMI fren!','Incredible work 🔥',
  'You inspire me!','Future is Web3!','Let\'s goooo! ⚡',
  '','','',
];

const LOOTBOX_TIERS: LootboxResult[] = [
  { tier: 'common',    amount: 0.05, probability: 0.60, color: '#94A3B8', label: 'Common'    },
  { tier: 'rare',      amount: 0.25, probability: 0.30, color: '#9945FF', label: 'Rare'      },
  { tier: 'legendary', amount: 1.00, probability: 0.10, color: '#14F195', label: 'Legendary' },
];

// ─────────────────────────────────────────────
// AUDIO SYNTH
// ─────────────────────────────────────────────
class AudioSynth {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.ctx;
  }

  playTip(rarity: 'common' | 'rare' | 'legendary') {
    try {
      const ctx = this.getCtx();
      const freqs =
        rarity === 'legendary'
          ? [523, 659, 784, 1047]
          : rarity === 'rare'
          ? [440, 554, 659]
          : [330, 415];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = rarity === 'legendary' ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        osc.frequency.exponentialRampToValueAtTime(
          freq * 1.5,
          ctx.currentTime + i * 0.12 + 0.15
        );
        gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + i * 0.12 + 0.4
        );
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.45);
      });
    } catch (_) {}
  }

  playClaim() {
    try {
      const ctx = this.getCtx();
      [600, 900, 1200].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + i * 0.08 + 0.3
        );
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.35);
      });
    } catch (_) {}
  }

  playLootbox(tier: 'common' | 'rare' | 'legendary') {
    try {
      const ctx = this.getCtx();
      const duration = tier === 'legendary' ? 1.2 : tier === 'rare' ? 0.8 : 0.5;
      const baseFreq = tier === 'legendary' ? 220 : tier === 'rare' ? 180 : 150;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        baseFreq * 4,
        ctx.currentTime + duration
      );
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }
}

const synth = new AudioSynth();

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTip(): TipAlert {
  const rand = Math.random();
  const rarity: TipAlert['rarity'] =
    rand < 0.1 ? 'legendary' : rand < 0.35 ? 'rare' : 'common';
  const amounts =
    rarity === 'legendary'
      ? [1.0, 2.5, 5.0]
      : rarity === 'rare'
      ? [0.25, 0.5, 0.75]
      : [0.05, 0.1, 0.15];
  return {
    id: Math.random().toString(36).slice(2),
    username: randomFrom(USERNAMES),
    amount: randomFrom(amounts),
    token: Math.random() > 0.3 ? 'SOL' : 'USDC',
    message: randomFrom(MESSAGES),
    timestamp: Date.now(),
    rarity,
    avatar: randomFrom(AVATARS),
  };
}

function generateActivity(
  type: ActivityFeedItem['type']
): ActivityFeedItem {
  const texts: Record<ActivityFeedItem['type'], string[]> = {
    tip: [
      `${randomFrom(USERNAMES)} tipped ${(Math.random() * 0.5 + 0.05).toFixed(2)} SOL`,
      `${randomFrom(USERNAMES)} sent ${(Math.random() * 10 + 1).toFixed(1)} USDC`,
    ],
    claim: [
      `${randomFrom(USERNAMES)} claimed a ${(Math.random() * 0.3 + 0.05).toFixed(2)} SOL TipLink`,
      `anon snagged a spatial drop worth ${(Math.random() * 0.2).toFixed(3)} SOL`,
    ],
    blink: [
      `${randomFrom(USERNAMES)} generated a Blink link`,
      `New Blink deployed to X/Twitter feed`,
    ],
    drop: [
      `Spatial Rain activated — ${Math.floor(Math.random() * 20 + 5)} envelopes live!`,
      `Creator dropped ${(Math.random() * 2 + 0.5).toFixed(1)} SOL across the grid`,
    ],
    lootbox: [
      `${randomFrom(USERNAMES)} opened a Lootbox — got ${randomFrom(['0.05', '0.25', '1.0'])} SOL!`,
      `Legendary Lootbox claimed by ${randomFrom(USERNAMES)} 🎉`,
    ],
  };
  return {
    id: Math.random().toString(36).slice(2),
    text: randomFrom(texts[type]),
    type,
    timestamp: Date.now(),
  };
}

// ─────────────────────────────────────────────
// GLOW BUTTON
// ─────────────────────────────────────────────
const GlowButton: React.FC<{
  onClick: () => void;
  variant?: 'green' | 'purple' | 'orange';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}> = ({ onClick, variant = 'green', children, className = '', disabled = false }) => {
  const colors = {
    green: {
      bg: 'bg-[#14F195]/10 hover:bg-[#14F195]/20 border-[#14F195]/40 hover:border-[#14F195]/80',
      glow: 'rgba(20,241,149,0.35)',
      text: 'text-[#14F195]',
    },
    purple: {
      bg: 'bg-[#9945FF]/10 hover:bg-[#9945FF]/20 border-[#9945FF]/40 hover:border-[#9945FF]/80',
      glow: 'rgba(153,69,255,0.35)',
      text: 'text-[#9945FF]',
    },
    orange: {
      bg: 'bg-[#FF9F43]/10 hover:bg-[#FF9F43]/20 border-[#FF9F43]/40 hover:border-[#FF9F43]/80',
      glow: 'rgba(255,159,67,0.35)',
      text: 'text-[#FF9F43]',
    },
  };
  const c = colors[variant];
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`relative px-4 py-2 rounded-lg border font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${c.bg} ${c.text} ${className} ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        boxShadow: disabled ? 'none' : `0 0 18px ${c.glow}`,
      }}
    >
      {children}
    </motion.button>
  );
};

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
const StatCard: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  delta?: string;
  color?: string;
}> = ({ label, value, icon, delta, color = '#14F195' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative p-4 rounded-xl border border-white/[0.04] bg-[#090911] overflow-hidden group"
    whileHover={{ borderColor: `${color}33` }}
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${color}08 0%, transparent 70%)`,
      }}
    />
    <div className="flex items-start justify-between mb-3">
      <div
        className="p-2 rounded-lg"
        style={{ background: `${color}15` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      {delta && (
        <span className="text-xs font-medium text-[#14F195] bg-[#14F195]/10 px-2 py-0.5 rounded-full">
          {delta}
        </span>
      )}
    </div>
    <div
      className="text-2xl font-bold text-[#F8FAFC]"
      style={{ fontFamily: 'var(--font-space-grotesk, Space Grotesk, sans-serif)' }}
    >
      {value}
    </div>
    <div className="text-xs text-[#94A3B8] mt-0.5">{label}</div>
  </motion.div>
);

// ─────────────────────────────────────────────
// TIP ALERT CARD
// ─────────────────────────────────────────────
const TipAlertCard: React.FC<{ tip: TipAlert }> = ({ tip }) => {
  const rarityConfig = {
    common: {
      border: 'border-white/10',
      glow: 'transparent',
      badge: 'text-[#94A3B8] bg-white/5',
      label: 'Common',
    },
    rare: {
      border: 'border-[#9945FF]/30',
      glow: 'rgba(153,69,255,0.15)',
      badge: 'text-[#9945FF] bg-[#9945FF]/10',
      label: 'Rare',
    },
    legendary: {
      border: 'border-[#14F195]/40',
      glow: 'rgba(20,241,149,0.2)',
      badge: 'text-[#14F195] bg-[#14F195]/10',
      label: 'Legendary',
    },
  };
  const cfg = rarityConfig[tip.rarity];
  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0, scale: 0.95 }}
      className={`p-3 rounded-xl border ${cfg.border} bg-[#090911] flex items-center gap-3`}
      style={{
        boxShadow:
          cfg.glow !== 'transparent' ? `0 0 20px ${cfg.glow}` : 'none',
      }}
    >
      <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg flex-shrink-0">
        {tip.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-semibold text-sm text-[#F8FAFC]"
            style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
          >
            {tip.username}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${cfg.badge}`}
          >
            {cfg.label}
          </span>
        </div>
        {tip.message && (
          <div className="text-xs text-[#94A3B8] mt-0.5 truncate">
            &ldquo;{tip.message}&rdquo;
          </div>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <div
          className="font-bold text-sm"
          style={{
            fontFamily: 'var(--font-space-grotesk, sans-serif)',
            color:
              tip.rarity === 'legendary'
                ? '#14F195'
                : tip.rarity === 'rare'
                ? '#9945FF'
                : '#F8FAFC',
          }}
        >
          +{tip.amount} {tip.token}
        </div>
        <div className="text-xs text-[#94A3B8]">
          {new Date(tip.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// ACTIVITY FEED
// ─────────────────────────────────────────────
const ActivityFeed: React.FC<{ items: ActivityFeedItem[] }> = ({ items }) => {
  const typeConfig: Record<
    ActivityFeedItem['type'],
    { color: string; icon: React.ReactNode }
  > = {
    tip:     { color: '#14F195', icon: <Zap size={10} /> },
    claim:   { color: '#9945FF', icon: <Gift size={10} /> },
    blink:   { color: '#38BDF8', icon: <Link2 size={10} /> },
    drop:    { color: '#FF9F43', icon: <Map size={10} /> },
    lootbox: { color: '#F472B6', icon: <Star size={10} /> },
  };
  return (
    <div className="flex flex-col gap-1.5 h-full overflow-hidden">
      <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
        Live Activity
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5" style={{ scrollbarWidth: 'none' }}>
        <AnimatePresence mode="popLayout">
          {items.slice(0, 14).map((item) => {
            const cfg = typeConfig[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.03] flex-shrink-0"
              >
                <div
                  className="mt-0.5 p-1 rounded flex-shrink-0"
                  style={{ background: `${cfg.color}20`, color: cfg.color }}
                >
                  {cfg.icon}
                </div>
                <span className="text-xs text-[#94A3B8] leading-relaxed">
                  {item.text}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {items.length === 0 && (
          <div className="text-xs text-[#94A3B8]/40 text-center py-4">
            Activity will appear here
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: CREATOR DASHBOARD
// ─────────────────────────────────────────────
const CreatorDashboard: React.FC<{ tips: TipAlert[] }> = ({ tips }) => {
  const totalSOL = tips.reduce(
    (a, t) => a + (t.token === 'SOL' ? t.amount : 0),
    0
  );
  const totalUSDC = tips.reduce(
    (a, t) => a + (t.token === 'USDC' ? t.amount : 0),
    0
  );
  const uniqueTippers = new Set(tips.map((t) => t.username)).size;
  const streamGoal = 10;
  const progress = Math.min((totalSOL / streamGoal) * 100, 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total SOL Raised"
          value={`◎ ${totalSOL.toFixed(3)}`}
          icon={<DollarSign size={16} />}
          delta="+12.4%"
          color="#14F195"
        />
        <StatCard
          label="USDC Volume"
          value={`$${totalUSDC.toFixed(2)}`}
          icon={<TrendingUp size={16} />}
          delta="+8.1%"
          color="#9945FF"
        />
        <StatCard
          label="Unique Tippers"
          value={uniqueTippers.toString()}
          icon={<Users size={16} />}
          delta={`+${Math.max(0, uniqueTippers - 1)}`}
          color="#FF9F43"
        />
        <StatCard
          label="Active TipLinks"
          value="24"
          icon={<Link2 size={16} />}
          delta="Live"
          color="#38BDF8"
        />
      </div>

      {/* Stream Goal */}
      <div className="p-5 rounded-xl border border-white/[0.04] bg-[#090911]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-[#14F195]" />
            <span
              className="font-semibold text-sm text-[#F8FAFC]"
              style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
            >
              Stream Goal
            </span>
          </div>
          <span
            className="text-sm font-bold text-[#14F195]"
            style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
          >
            ◎ {totalSOL.toFixed(3)} / {streamGoal} SOL
          </span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #9945FF, #14F195)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-[#94A3B8]">{progress.toFixed(1)}% reached</span>
          <span className="text-xs text-[#94A3B8]">
            ◎ {Math.max(0, streamGoal - totalSOL).toFixed(3)} remaining
          </span>
        </div>
      </div>

      {/* Recent Tips */}
      <div>
        <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
          Recent Tips
        </h3>
        <div
          className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1"
          style={{ scrollbarWidth: 'none' }}
        >
          <AnimatePresence mode="popLayout">
            {tips.slice(0, 15).map((tip) => (
              <TipAlertCard key={tip.id} tip={tip} />
            ))}
          </AnimatePresence>
          {tips.length === 0 && (
            <div className="text-center py-12 text-[#94A3B8] text-sm">
              Press &ldquo;Go Live&rdquo; to start receiving tips
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: OBS OVERLAY
// ─────────────────────────────────────────────
const OBSOverlay: React.FC<{ tips: TipAlert[]; audioEnabled: boolean }> = ({
  tips,
  audioEnabled,
}) => {
  const [activeAlert, setActiveAlert] = useState<TipAlert | null>(null);
  const [particles, setParticles] = useState<
    { id: string; x: number; y: number; color: string }[]
  >([]);
  const alertQueueRef = useRef<TipAlert[]>([]);
  const processingRef = useRef(false);
  const tipsLengthRef = useRef(0);

  const totalSOL = tips.reduce(
    (a, t) => a + (t.token === 'SOL' ? t.amount : 0),
    0
  );
  const streamGoal = 10;
  const progress = Math.min((totalSOL / streamGoal) * 100, 100);

  const processQueue = useCallback(() => {
    if (processingRef.current || alertQueueRef.current.length === 0) return;
    processingRef.current = true;
    const next = alertQueueRef.current.shift()!;
    setActiveAlert(next);
    if (audioEnabled) synth.playTip(next.rarity);
    const newParticles = Array.from({ length: 18 }, (_, i) => ({
      id: `${next.id}-${i}`,
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 60,
      color:
        next.rarity === 'legendary'
          ? '#14F195'
          : next.rarity === 'rare'
          ? '#9945FF'
          : '#94A3B8',
    }));
    setParticles(newParticles);
    setTimeout(() => {
      setActiveAlert(null);
      setParticles([]);
      processingRef.current = false;
      processQueue();
    }, 3500);
  }, [audioEnabled]);

  useEffect(() => {
    if (tips.length > tipsLengthRef.current && tips.length > 0) {
      alertQueueRef.current.push(tips[0]);
      processQueue();
    }
    tipsLengthRef.current = tips.length;
  }, [tips.length, processQueue]);

  const rarityGradient = {
    common: 'linear-gradient(135deg, #1a1a2e, #090911)',
    rare: 'linear-gradient(135deg, #1a0a2e, #090911)',
    legendary: 'linear-gradient(135deg, #0a2e1a, #090911)',
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="p-3 rounded-xl border border-[#FF9F43]/20 bg-[#FF9F43]/5 text-[#FF9F43] text-xs flex items-center gap-2">
        <Radio size={12} className="animate-pulse" />
        <span className="font-medium">
          OBS Browser Source — Add this page URL in OBS as a Browser Source (1920×200px)
        </span>
      </div>

      {/* Preview */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/[0.06]"
        style={{
          background: 'linear-gradient(135deg, #020204, #090911)',
          minHeight: 300,
        }}
      >
        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)',
          }}
        />

        {/* Particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                background: p.color,
                boxShadow: `0 0 8px ${p.color}`,
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                scale: 0,
                y: -60 + Math.random() * 30,
                x: -20 + Math.random() * 40,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 + Math.random() }}
            />
          ))}
        </AnimatePresence>

        {/* Alert */}
        <div className="absolute bottom-6 left-6 right-6">
          <AnimatePresence mode="wait">
            {activeAlert ? (
              <motion.div
                key={activeAlert.id}
                initial={{ y: 60, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -30, opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="relative p-4 rounded-2xl border flex items-center gap-4 overflow-hidden"
                style={{
                  background: rarityGradient[activeAlert.rarity],
                  borderColor:
                    activeAlert.rarity === 'legendary'
                      ? '#14F195'
                      : activeAlert.rarity === 'rare'
                      ? '#9945FF'
                      : 'rgba(255,255,255,0.1)',
                  boxShadow:
                    activeAlert.rarity === 'legendary'
                      ? '0 0 40px rgba(20,241,149,0.3)'
                      : activeAlert.rarity === 'rare'
                      ? '0 0 30px rgba(153,69,255,0.25)'
                      : 'none',
                }}
              >
                <motion.div
                  className="text-4xl"
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {activeAlert.avatar}
                </motion.div>
                <div className="flex-1">
                  <div
                    className="font-bold text-[#F8FAFC] text-lg leading-tight"
                    style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
                  >
                    {activeAlert.username} tipped{' '}
                    <span
                      style={{
                        color:
                          activeAlert.rarity === 'legendary'
                            ? '#14F195'
                            : activeAlert.rarity === 'rare'
                            ? '#9945FF'
                            : '#F8FAFC',
                      }}
                    >
                      {activeAlert.amount} {activeAlert.token}
                    </span>
                  </div>
                  {activeAlert.message && (
                    <div className="text-sm text-[#94A3B8] mt-0.5">
                      &ldquo;{activeAlert.message}&rdquo;
                    </div>
                  )}
                </div>
                {activeAlert.rarity !== 'common' && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl"
                  >
                    {activeAlert.rarity === 'legendary' ? '👑' : '💎'}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-[#94A3B8]/40 text-sm"
              >
                Alert overlay idle — tips will animate here
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Goal bar */}
      <div className="p-4 rounded-xl border border-white/[0.04] bg-[#090911]">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-sm font-semibold text-[#F8FAFC]"
            style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
          >
            🎯 Stream Goal: 10 SOL
          </span>
          <span className="text-sm font-bold text-[#14F195]">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="h-4 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full rounded-full relative overflow-hidden shimmer-bar"
            style={{
              background: 'linear-gradient(90deg, #9945FF, #14F195)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: BLINK BUILDER
// ─────────────────────────────────────────────
const BlinkBuilder: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('tiplink.io/0xGopi');
  const [tipTitle, setTipTitle] = useState('Support My Stream 🚀');
  const [amounts, setAmounts] = useState(['0.1', '0.5', '1.0']);
  const [copied, setCopied] = useState(false);

  const blinkUrl = `https://solana.to/actions/tiplink?to=${walletAddress}&amounts=${amounts.join(',')}&label=${encodeURIComponent(tipTitle)}`;

  const copyBlink = () => {
    navigator.clipboard.writeText(blinkUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const updateAmount = (index: number, value: string) => {
    const next = [...amounts];
    next[index] = value;
    setAmounts(next);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest">
          Configure Your Blink
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#94A3B8] font-medium">
            Wallet / TipLink Address
          </label>
          <div className="flex items-center gap-2 p-3 rounded-lg border border-white/[0.06] bg-[#090911] focus-within:border-[#9945FF]/50 transition-colors">
            <Wallet size={14} className="text-[#94A3B8] flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm text-[#F8FAFC] outline-none placeholder:text-[#94A3B8]/40"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="tiplink.io/your-link or Solana address"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#94A3B8] font-medium">Tip Title / CTA</label>
          <input
            className="p-3 rounded-lg border border-white/[0.06] bg-[#090911] text-sm text-[#F8FAFC] outline-none focus:border-[#14F195]/50 transition-colors"
            value={tipTitle}
            onChange={(e) => setTipTitle(e.target.value)}
            placeholder="Support my stream..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#94A3B8] font-medium">
            Quick-Tip Amounts (SOL)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {amounts.map((amt, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 p-2 rounded-lg border border-white/[0.06] bg-[#090911] focus-within:border-[#14F195]/50 transition-colors"
              >
                <span className="text-xs text-[#94A3B8]">◎</span>
                <input
                  className="flex-1 bg-transparent text-sm text-[#F8FAFC] outline-none w-full"
                  value={amt}
                  onChange={(e) => updateAmount(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.04] bg-[#090911] break-all">
          <div className="text-xs text-[#94A3B8] mb-1.5 font-medium">
            Generated Blink URL
          </div>
          <div className="text-xs text-[#9945FF] font-mono leading-relaxed">
            {blinkUrl}
          </div>
        </div>

        <div className="flex gap-3">
          <GlowButton onClick={copyBlink} variant="green" className="flex-1">
            {copied ? (
              <><Check size={14} /> Copied!</>
            ) : (
              <><Copy size={14} /> Copy Blink URL</>
            )}
          </GlowButton>
          <GlowButton onClick={() => {}} variant="purple">
            <ExternalLink size={14} /> Deploy
          </GlowButton>
        </div>
      </div>

      {/* Twitter Preview */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest">
          X / Twitter Preview
        </h3>
        <motion.div
          className="rounded-2xl border border-white/[0.06] bg-[#090911] overflow-hidden"
          whileHover={{ borderColor: 'rgba(153,69,255,0.25)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-lg">
                🚀
              </div>
              <div>
                <div className="font-bold text-sm text-[#F8FAFC]">
                  TipLink Live Creator
                </div>
                <div className="text-xs text-[#94A3B8]">@tiplinkcreator · Just now</div>
              </div>
              <Twitter size={16} className="ml-auto text-[#38BDF8]" />
            </div>
            <p className="mt-3 text-sm text-[#F8FAFC] leading-relaxed">
              Support my stream with a quick tip! 🎮 Click below to tip instantly
              with Solana — no wallet setup needed!
              <br />
              <span className="text-[#38BDF8] text-xs break-all">
                {blinkUrl.slice(0, 60)}...
              </span>
            </p>
          </div>

          {/* Blink Card */}
          <div className="p-4 m-3 rounded-xl border border-[#9945FF]/20 bg-[#9945FF]/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
                <Zap size={14} className="text-black" />
              </div>
              <div>
                <div
                  className="text-sm font-bold text-[#F8FAFC]"
                  style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
                >
                  {tipTitle || 'Tip This Creator'}
                </div>
                <div className="text-xs text-[#94A3B8]">
                  Powered by TipLink × Solana Actions
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {amounts.map((amt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg text-xs font-semibold text-center"
                  style={{
                    background:
                      'linear-gradient(135deg, #9945FF20, #14F19520)',
                    border: '1px solid rgba(153,69,255,0.3)',
                    color: '#F8FAFC',
                    boxShadow: '0 0 12px rgba(153,69,255,0.15)',
                  }}
                >
                  ◎ {amt} SOL
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 w-full py-2.5 rounded-lg text-sm font-bold text-black"
              style={{
                background: 'linear-gradient(90deg, #9945FF, #14F195)',
                boxShadow: '0 0 20px rgba(20,241,149,0.25)',
              }}
            >
              ⚡ Tip Custom Amount
            </motion.button>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 p-3 rounded-lg border border-[#14F195]/15 bg-[#14F195]/5 text-xs text-[#14F195]">
          <Globe size={12} />
          <span>
            When shared on X, this card renders natively — viewers tip directly
            from their feed via Solana Actions.
          </span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: SPATIAL DROP MAP
// ─────────────────────────────────────────────
const SpatialDropMap: React.FC<{
  audioEnabled: boolean;
  onActivity: (item: ActivityFeedItem) => void;
}> = ({ audioEnabled, onActivity }) => {
  const [drops, setDrops] = useState<SpatialDrop[]>([]);
  const [isRaining, setIsRaining] = useState(false);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [claimAnims, setClaimAnims] = useState<
    { id: string; x: number; y: number; amount: number }[]
  >([]);
  const animFrameRef = useRef<number>(0);
  const isRainingRef = useRef(false);
  isRainingRef.current = isRaining;

  const spawnDrop = useCallback((): SpatialDrop => ({
    id: Math.random().toString(36).slice(2),
    x: 5 + Math.random() * 90,
    y: -10,
    amount: parseFloat((Math.random() * 0.15 + 0.02).toFixed(3)),
    claimed: false,
    velocity: { x: (Math.random() - 0.5) * 0.15, y: 0.12 + Math.random() * 0.1 },
    opacity: 1,
  }), []);

  useEffect(() => {
    if (!isRaining) {
      cancelAnimationFrame(animFrameRef.current);
      return;
    }
    const tick = () => {
      setDrops((prev) =>
        prev
          .map((d) => ({
            ...d,
            x: Math.max(2, Math.min(98, d.x + d.velocity.x)),
            y: d.y + d.velocity.y,
            opacity: d.y > 85 ? Math.max(0, d.opacity - 0.05) : d.opacity,
          }))
          .filter((d) => d.y < 105 && d.opacity > 0.02)
      );
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    const spawnInterval = setInterval(() => {
      setDrops((prev) => [...prev, spawnDrop()].slice(-35));
    }, 600);
    return () => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRaining, spawnDrop]);

  const claimDrop = useCallback(
    (drop: SpatialDrop) => {
      if (drop.claimed || claimedIds.includes(drop.id)) return;
      setClaimedIds((prev) => [...prev, drop.id]);
      setDrops((prev) =>
        prev.map((d) => (d.id === drop.id ? { ...d, claimed: true, opacity: 0 } : d))
      );
      if (audioEnabled) synth.playClaim();
      const anim = { id: drop.id, x: drop.x, y: drop.y, amount: drop.amount };
      setClaimAnims((prev) => [...prev, anim]);
      setTimeout(
        () => setClaimAnims((prev) => prev.filter((a) => a.id !== drop.id)),
        1500
      );
      onActivity(generateActivity('claim'));
    },
    [claimedIds, audioEnabled, onActivity]
  );

  const resetAll = () => {
    cancelAnimationFrame(animFrameRef.current);
    setDrops([]);
    setClaimedIds([]);
    setClaimAnims([]);
    setIsRaining(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="font-semibold text-[#F8FAFC]"
            style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
          >
            Spatial TipLink Rain
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Click floating envelopes to claim SOL instantly
          </p>
        </div>
        <div className="flex gap-3">
          <GlowButton onClick={resetAll} variant="orange">
            <RefreshCw size={14} /> Reset
          </GlowButton>
          <GlowButton
            onClick={() => setIsRaining((v) => !v)}
            variant={isRaining ? 'orange' : 'green'}
          >
            {isRaining ? (
              <><Pause size={14} /> Stop Rain</>
            ) : (
              <><Play size={14} /> Start Rain</>
            )}
          </GlowButton>
        </div>
      </div>

      {/* Arena */}
      <div
        className="relative rounded-2xl border border-white/[0.06] overflow-hidden select-none"
        style={{
          height: 420,
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(153,69,255,0.08) 0%, #020204 70%)',
        }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Drops */}
        {drops
          .filter((d) => !d.claimed)
          .map((drop) => (
            <motion.button
              key={drop.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl cursor-pointer"
              style={{
                left: `${drop.x}%`,
                top: `${drop.y}%`,
                opacity: drop.opacity,
              }}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => claimDrop(drop)}
              title={`Claim ◎ ${drop.amount}`}
            >
              <div className="relative">
                🧧
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold whitespace-nowrap"
                  style={{
                    color: '#14F195',
                    textShadow: '0 0 8px rgba(20,241,149,0.8)',
                  }}
                >
                  ◎{drop.amount}
                </div>
              </div>
            </motion.button>
          ))}

        {/* Claim animations */}
        <AnimatePresence>
          {claimAnims.map((anim) => (
            <motion.div
              key={`anim-${anim.id}`}
              className="absolute pointer-events-none font-bold text-sm"
              style={{
                left: `${anim.x}%`,
                top: `${anim.y}%`,
                color: '#14F195',
                textShadow: '0 0 12px rgba(20,241,149,0.9)',
                fontFamily: 'var(--font-space-grotesk, sans-serif)',
              }}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -50, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              +◎{anim.amount} ✓
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {!isRaining && drops.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <div className="text-5xl">🧧</div>
            <div className="text-[#94A3B8] text-sm">
              Press &ldquo;Start Rain&rdquo; to trigger a TipLink airdrop
            </div>
          </div>
        )}

        {/* Stats bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/[0.06]">
          <span className="text-xs text-[#94A3B8]">
            🧧 {drops.filter((d) => !d.claimed).length} envelopes floating
          </span>
          <span className="text-xs text-[#14F195] font-semibold">
            ✓ {claimedIds.length} claimed
          </span>
          <span className="text-xs text-[#94A3B8]">
            ◎{' '}
            {drops
              .filter((d) => !d.claimed)
              .reduce((a, d) => a + d.amount, 0)
              .toFixed(3)}{' '}
            remaining
          </span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: LOOTBOX STUDIO
// ─────────────────────────────────────────────
const LootboxPanel: React.FC<{
  audioEnabled: boolean;
  onActivity: (item: ActivityFeedItem) => void;
}> = ({ audioEnabled, onActivity }) => {
  const [poolAmount, setPoolAmount] = useState('2.0');
  const [packCount, setPackCount] = useState(5);
  const [isOpening, setIsOpening] = useState(false);
  const [openResult, setOpenResult] = useState<LootboxResult | null>(null);
  const [openHistory, setOpenHistory] = useState<LootboxResult[]>([]);
  const [chestPhase, setChestPhase] = useState<'idle' | 'shaking' | 'open' | 'reveal'>('idle');

  const tierConfig: Record<
    LootboxResult['tier'],
    { bg: string; glow: string; icon: string }
  > = {
    common:    { bg: 'bg-[#94A3B8]/10 border-[#94A3B8]/20', glow: '#94A3B8', icon: '📦' },
    rare:      { bg: 'bg-[#9945FF]/10 border-[#9945FF]/30', glow: '#9945FF', icon: '💜' },
    legendary: { bg: 'bg-[#14F195]/10 border-[#14F195]/30', glow: '#14F195', icon: '👑' },
  };

  const openLootbox = () => {
    if (isOpening) return;
    setIsOpening(true);
    setOpenResult(null);
    setChestPhase('shaking');

    setTimeout(() => setChestPhase('open'), 800);
    setTimeout(() => {
      const rand = Math.random();
      const result: LootboxResult =
        rand < 0.1
          ? LOOTBOX_TIERS[2]
          : rand < 0.4
          ? LOOTBOX_TIERS[1]
          : LOOTBOX_TIERS[0];

      setOpenResult(result);
      setChestPhase('reveal');
      setOpenHistory((prev) => [result, ...prev].slice(0, 10));
      if (audioEnabled) synth.playLootbox(result.tier);
      onActivity(generateActivity('lootbox'));

      setTimeout(() => {
        setIsOpening(false);
        setChestPhase('idle');
      }, 2500);
    }, 1600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Config */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest">
          Create Lootbox
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#94A3B8]">Pool (SOL)</label>
            <input
              className="p-3 rounded-lg border border-white/[0.06] bg-[#090911] text-sm text-[#F8FAFC] outline-none focus:border-[#14F195]/50 transition-colors"
              value={poolAmount}
              onChange={(e) => setPoolAmount(e.target.value)}
              type="number"
              step="0.1"
              min="0.1"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#94A3B8]">Packs</label>
            <input
              className="p-3 rounded-lg border border-white/[0.06] bg-[#090911] text-sm text-[#F8FAFC] outline-none focus:border-[#14F195]/50 transition-colors"
              value={packCount}
              onChange={(e) => setPackCount(parseInt(e.target.value) || 1)}
              type="number"
              min="1"
              max="20"
            />
          </div>
        </div>

        {/* Probability bars */}
        <div className="p-4 rounded-xl border border-white/[0.04] bg-[#090911] flex flex-col gap-3">
          <div className="text-xs font-semibold text-[#94A3B8] mb-1">
            Reward Distribution — P(x) = 1/N
          </div>
          {LOOTBOX_TIERS.map((tier) => (
            <div key={tier.tier} className="flex items-center gap-3">
              <div className="text-sm w-4">{tierConfig[tier.tier].icon}</div>
              <div className="flex-1">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: tier.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${tier.probability * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
              <span
                className="text-xs font-mono w-8 text-right"
                style={{ color: tier.color }}
              >
                {(tier.probability * 100).toFixed(0)}%
              </span>
              <span className="text-xs text-[#F8FAFC] font-medium w-12">
                ◎{tier.amount}
              </span>
              <span className="text-xs text-[#94A3B8] capitalize w-16">
                {tier.label}
              </span>
            </div>
          ))}
        </div>

        {/* Chest */}
        <div className="flex flex-col items-center gap-4 py-4">
          <motion.div
            className="text-7xl select-none"
            animate={
              chestPhase === 'shaking'
                ? { rotate: [-8, 8, -6, 6, -4, 4, 0], scale: [1, 1.05, 1, 1.05, 1] }
                : chestPhase === 'open'
                ? { scale: [1, 1.3, 1.1] }
                : {}
            }
            transition={{ duration: 0.8 }}
          >
            {chestPhase === 'open' || chestPhase === 'reveal' ? '🎁' : '📦'}
          </motion.div>

          <AnimatePresence mode="wait">
            {openResult && chestPhase === 'reveal' && (
              <motion.div
                key={openResult.tier}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`px-6 py-3 rounded-2xl border text-center ${tierConfig[openResult.tier].bg}`}
                style={{
                  boxShadow: `0 0 30px ${tierConfig[openResult.tier].glow}40`,
                }}
              >
                <div className="text-2xl mb-1">{tierConfig[openResult.tier].icon}</div>
                <div
                  className="font-bold text-lg"
                  style={{
                    fontFamily: 'var(--font-space-grotesk, sans-serif)',
                    color: openResult.color,
                  }}
                >
                  ◎ {openResult.amount} SOL
                </div>
                <div
                  className="text-xs capitalize mt-0.5"
                  style={{ color: openResult.color }}
                >
                  {openResult.label} Reward
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <GlowButton
            onClick={openLootbox}
            variant="purple"
            disabled={isOpening}
            className="px-8 py-3 text-base"
          >
            <Gift size={16} />
            {isOpening ? 'Opening...' : 'Open Lootbox'}
          </GlowButton>
        </div>
      </div>

      {/* History */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest">
          Open History
        </h3>
        <div
          className="flex flex-col gap-2 max-h-[480px] overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <AnimatePresence mode="popLayout">
            {openHistory.map((result, i) => (
              <motion.div
                key={`${i}-${result.amount}-${result.tier}`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${tierConfig[result.tier].bg}`}
                style={{
                  boxShadow:
                    i === 0
                      ? `0 0 16px ${tierConfig[result.tier].glow}25`
                      : 'none',
                }}
              >
                <div className="text-xl">{tierConfig[result.tier].icon}</div>
                <div className="flex-1">
                  <div
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: 'var(--font-space-grotesk, sans-serif)',
                      color: result.color,
                    }}
                  >
                    ◎ {result.amount} SOL
                  </div>
                  <div className="text-xs text-[#94A3B8] capitalize">
                    {result.label}
                  </div>
                </div>
                <div className="text-xs text-[#94A3B8]">
                  {(result.probability * 100).toFixed(0)}% chance
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {openHistory.length === 0 && (
            <div className="text-center py-12 text-[#94A3B8]/50 text-sm">
              Open your first lootbox to see history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function TipLinkLiveDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [tips, setTips] = useState<TipAlert[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [streamLive, setStreamLive] = useState(false);

  useEffect(() => {
    if (!streamLive) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const tip = generateTip();
        setTips((prev) => [tip, ...prev].slice(0, 80));
        setActivityFeed((prev) =>
          [generateActivity('tip'), ...prev].slice(0, 40)
        );
      }
    }, 1800 + Math.random() * 1200);
    return () => clearInterval(interval);
  }, [streamLive]);

  const addActivity = useCallback((item: ActivityFeedItem) => {
    setActivityFeed((prev) => [item, ...prev].slice(0, 40));
  }, []);

  const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Creator Dashboard', icon: <TrendingUp size={15} /> },
    { id: 'obs',       label: 'OBS Overlay',        icon: <Radio size={15} /> },
    { id: 'blink',     label: 'Blink Builder',       icon: <Link2 size={15} /> },
    { id: 'spatial',   label: 'Spatial Drop Map',    icon: <Map size={15} /> },
    { id: 'lootbox',   label: 'Lootbox Studio',      icon: <Gift size={15} /> },
  ];

  return (
    <div
      className="min-h-screen text-[#F8FAFC] flex flex-col"
      style={{
        background:
          'radial-gradient(ellipse at 15% 20%, rgba(153,69,255,0.07) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(20,241,149,0.05) 0%, transparent 50%), #020204',
      }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 border-b border-white/[0.04] backdrop-blur-xl"
        style={{ background: 'rgba(2,2,4,0.85)' }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
            >
              <Zap size={16} className="text-black" />
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
            >
              TipLink{' '}
              <span style={{ color: '#14F195' }}>Live</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1 ml-4 overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#14F195] bg-[#14F195]/10 border border-[#14F195]/25'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04] border border-transparent'
                }`}
                style={
                  activeTab === tab.id
                    ? { boxShadow: '0 0 14px rgba(20,241,149,0.15)' }
                    : {}
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setAudioEnabled((v) => !v)}
              className="p-2 rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-colors"
              title={audioEnabled ? 'Mute audio' : 'Enable audio alerts'}
            >
              {audioEnabled ? (
                <Volume2 size={14} className="text-[#14F195]" />
              ) : (
                <VolumeX size={14} className="text-[#94A3B8]" />
              )}
            </button>
            <GlowButton
              onClick={() => setStreamLive((v) => !v)}
              variant={streamLive ? 'orange' : 'green'}
            >
              {streamLive ? (
                <><Pause size={13} /> Stop</>
              ) : (
                <><Play size={13} /> Go Live</>
              )}
            </GlowButton>
          </div>
        </div>
      </header>

      {/* ── MOBILE TABS ── */}
      <div
        className="md:hidden flex overflow-x-auto border-b border-white/[0.04] bg-[#020204]"
        style={{ scrollbarWidth: 'none' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2.5 text-[10px] font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'text-[#14F195] border-[#14F195]'
                : 'text-[#94A3B8] border-transparent'
            }`}
          >
            {tab.icon}
            <span>{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* ── MAIN ── */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Content */}
          <div className="flex-1 min-w-0">
            {streamLive && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#14F195]/20 bg-[#14F195]/5 w-fit text-xs"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
                <span className="text-[#14F195] font-semibold">STREAM LIVE</span>
                <span className="text-[#94A3B8]">
                  — Tips flowing in real-time
                </span>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && (
                  <CreatorDashboard tips={tips} />
                )}
                {activeTab === 'obs' && (
                  <OBSOverlay tips={tips} audioEnabled={audioEnabled} />
                )}
                {activeTab === 'blink' && <BlinkBuilder />}
                {activeTab === 'spatial' && (
                  <SpatialDropMap
                    audioEnabled={audioEnabled}
                    onActivity={addActivity}
                  />
                )}
                {activeTab === 'lootbox' && (
                  <LootboxPanel
                    audioEnabled={audioEnabled}
                    onActivity={addActivity}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Activity sidebar */}
          <div className="hidden xl:flex flex-col w-64 flex-shrink-0">
            <div
              className="sticky top-20 p-4 rounded-2xl border border-white/[0.04] bg-[#090911]/80 backdrop-blur-sm overflow-hidden"
              style={{ height: 'calc(100vh - 120px)' }}
            >
              <ActivityFeed items={activityFeed} />
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.04] py-4 px-6 flex items-center justify-between text-xs text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-[#9945FF]" />
          <span>
            Built for Hackprix Season 3 ·{' '}
            <span className="text-[#14F195]">Blockchain &amp; Web3 Track</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye size={11} /> 347 viewers
          </span>
          <span className="flex items-center gap-1 text-[#14F195]">
            <Flame size={11} /> Trending #2
          </span>
        </div>
      </footer>
    </div>
  );
}
