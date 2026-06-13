'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Zap, ArrowRight, Star, Shield, Globe, Users,
  TrendingUp, Copy, CheckCircle, Rocket, Twitter, Github
} from 'lucide-react';

// ── Static live feed data (no Math.random at render) ──
const FEED_ENTRIES = [
  { id: 1, name: 'Alex M.', creator: 'gopichand0516', amount: 0.5, color: '#9945FF' },
  { id: 2, name: 'Priya S.', creator: 'aeyakovenko', amount: 1.0, color: '#00F0FF' },
  { id: 3, name: 'Jake R.', creator: 'rajgokal', amount: 0.1, color: '#22C55E' },
  { id: 4, name: 'Luna.sol', creator: 'luna_music', amount: 2.0, color: '#FFD700' },
  { id: 5, name: 'DevAryan', creator: 'aryan_builds', amount: 0.2, color: '#FF6B6B' },
  { id: 6, name: '0xGhost', creator: 'gopichand0516', amount: 0.5, color: '#9945FF' },
  { id: 7, name: 'Zoe W.', creator: 'aeyakovenko', amount: 1.0, color: '#00F0FF' },
  { id: 8, name: 'Sam B.', creator: 'rajgokal', amount: 0.1, color: '#22C55E' },
];

function LiveFeedTicker() {
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(847);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % FEED_ENTRIES.length);
        setTotal(t => t + 1);
        setVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const entry = FEED_ENTRIES[index];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(13,13,24,0.97)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live on-chain</span>
        </div>
        <span className="text-[10px] font-medium" style={{ color: '#444' }}>{total} tips today</span>
      </div>
      <div className="px-4 py-3" style={{ minHeight: 60 }}>
        <AnimatePresence mode="wait">
          {visible && entry && (
            <motion.div key={entry.id + '-' + index}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${entry.color}88, ${entry.color}44)`, border: `1px solid ${entry.color}44` }}>
                  {entry.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{entry.name}</p>
                  <p className="text-[10px]" style={{ color: '#555' }}>→ @{entry.creator}</p>
                </div>
              </div>
              <span className="text-sm font-extrabold" style={{ color: entry.color }}>+◎ {entry.amount}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const FEATURED_CREATORS = [
  { username: 'gopichand0516', name: 'Gopichand Challa', role: 'Builder', bio: 'Solana dev · Web3 × AI · 0xGhostchain', tips: '◎ 1.85', count: 12, gradient: 'linear-gradient(135deg, #9945FF, #7B2FFF)' },
  { username: 'aeyakovenko', name: 'Anatoly Y.', role: 'Founder', bio: 'Co-founder @Solana. Consensus & performance.', tips: '◎ 12.4', count: 89, gradient: 'linear-gradient(135deg, #00F0FF, #0088FF)' },
  { username: 'rajgokal', name: 'Raj Gokal', role: 'Co-founder', bio: 'Building the fastest L1. Co-founder @Solana.', tips: '◎ 8.7', count: 64, gradient: 'linear-gradient(135deg, #22C55E, #16A34A)' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '👤', title: 'Create Profile', desc: 'Set up your creator profile with wallet address and bio in 60 seconds.' },
  { step: '02', icon: '🔗', title: 'Share Your Link', desc: 'Share tiplink.live/tip/yourname anywhere — Twitter, Discord, GitHub.' },
  { step: '03', icon: '⚡', title: 'Receive SOL Instantly', desc: 'Fans tip you in SOL or USDC directly to your wallet. Sub-second settlement.' },
];

const STATS = [
  { value: '< 1s', label: 'Settlement time', icon: Zap, color: '#9945FF' },
  { value: '$0', label: 'Platform fees', icon: Star, color: '#FFD700' },
  { value: '100%', label: 'Non-custodial', icon: Shield, color: '#22C55E' },
  { value: '400ms', label: 'Block time', icon: TrendingUp, color: '#00F0FF' },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.96]);

  useEffect(() => { setMounted(true); }, []);

  const copyLink = (username: string) => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(`${window.location.origin}/tip/${username}`);
    setCopied(username);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!mounted) return (
    <div className="min-h-screen grid-bg" style={{ background: '#080810' }}>
      <div className="max-w-6xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full animate-spin-slow" style={{ border: '3px solid rgba(153,69,255,0.2)', borderTopColor: '#9945FF' }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen grid-bg" style={{ background: '#080810' }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50" style={{ backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,16,0.85)' }}>
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', boxShadow: '0 0 20px rgba(153,69,255,0.5)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              TipLink <span style={{ color: '#9945FF' }}>Live</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {[['Explore', '#explore'], ['How it works', '#how'], ['Creators', '#creators']].map(([label, href]) => (
              <a key={label} href={href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{label}</a>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/dashboard"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >Dashboard</Link>
            <Link href="/onboard" className="btn-primary px-4 py-2 text-sm">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative overflow-hidden pt-20 pb-24 px-4"
      >
        {/* Big ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse, rgba(153,69,255,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.25)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-bold" style={{ color: '#9945FF' }}>Live on Solana Mainnet</span>
            <span className="text-xs text-gray-500">· 847 tips today</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.08] tracking-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Tip any Solana
            <span className="block gradient-text">creator instantly.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            One link. Any wallet. Sub-second on-chain settlement.
            <span className="text-white font-semibold"> Zero platform fees.</span> AI-generated thank-you messages.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-16"
          >
            <Link href="/onboard"
              className="btn-primary px-8 py-4 text-base gap-2.5 rounded-2xl"
            >
              <Rocket className="w-5 h-5" /> Create Your TipLink
            </Link>
            <Link href="/tip/gopichand0516"
              className="btn-secondary px-8 py-4 text-base rounded-2xl"
            >
              View Demo ↗
            </Link>
          </motion.div>

          {/* Hero cards row */}
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="max-w-sm mx-auto"
          >
            <LiveFeedTicker />
          </motion.div>
        </div>
      </motion.section>

      {/* ── STATS ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label, icon: Icon, color }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="relative rounded-2xl p-5 text-center overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${color}0a 0%, transparent 70%)` }} />
                <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
                <div className="text-3xl font-extrabold mb-1" style={{ color, fontFamily: 'Space Grotesk, sans-serif' }}>{value}</div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 inline-block"
              style={{ background: 'rgba(153,69,255,0.1)', color: '#9945FF', border: '1px solid rgba(153,69,255,0.2)' }}>How it works</span>
            <h2 className="text-4xl font-extrabold text-white mt-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Ship in 3 steps</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, icon, title, desc }, i) => (
              <motion.div key={step}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative rounded-3xl p-7 group hover:border-purple-500/40 transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, rgba(15,15,26,0.98), rgba(10,10,20,0.99))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(90deg, transparent, #9945FF, transparent)' }} />
                <div className="text-4xl mb-4">{icon}</div>
                <div className="text-xs font-bold tracking-widest mb-2" style={{ color: '#9945FF' }}>STEP {step}</div>
                <h3 className="text-lg font-extrabold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CREATORS ── */}
      <section id="creators" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 inline-block"
              style={{ background: 'rgba(0,240,255,0.08)', color: '#00F0FF', border: '1px solid rgba(0,240,255,0.15)' }}>Featured Creators</span>
            <h2 className="text-4xl font-extrabold text-white mt-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Top builders on Solana</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURED_CREATORS.map(({ username, name, role, bio, tips, count, gradient }, i) => (
              <motion.div key={username}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(153,69,255,0.12)' }}
                className="relative rounded-3xl p-6 group cursor-pointer transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, rgba(15,15,26,0.98), rgba(10,10,20,0.99))',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(153,69,255,0.3), transparent)' }} />
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white flex-shrink-0"
                    style={{ background: gradient, boxShadow: '0 0 20px rgba(153,69,255,0.35)' }}>
                    {name[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-tight">{name}</h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color: '#9945FF' }}>@{username}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}>{role}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-5">{bio}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-extrabold" style={{ color: '#9945FF', fontFamily: 'Space Grotesk, sans-serif' }}>{tips}</div>
                    <div className="text-[10px] text-gray-600">{count} tips</div>
                  </div>
                  <button onClick={() => copyLink(username)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: copied === username ? '#22C55E' : '#888' }}
                  >
                    {copied === username ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === username ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
                <Link href={`/tip/${username}`}
                  className="w-full py-2.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', boxShadow: '0 0 20px rgba(153,69,255,0.3)' }}
                >
                  <Zap className="w-3.5 h-3.5" /> Send a Tip
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="explore" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 inline-block"
              style={{ background: 'rgba(153,69,255,0.1)', color: '#9945FF', border: '1px solid rgba(153,69,255,0.2)' }}>Features</span>
            <h2 className="text-4xl font-extrabold text-white mt-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Built for the on-chain economy</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '⚡', title: 'Instant Settlement', desc: 'Sub-400ms block finality on Solana. Tips hit the wallet before you blink.', color: '#9945FF' },
              { icon: '🤖', title: 'AI Thank-You', desc: 'GPT-4 crafts personalised thank-you messages for every tip automatically.', color: '#00F0FF' },
              { icon: '🔗', title: 'Solana Blinks', desc: 'Embed a tipping button on any website or in a tweet with one URL.', color: '#22C55E' },
              { icon: '🛡️', title: 'Non-Custodial', desc: 'We never touch your funds. Direct wallet-to-wallet on Solana mainnet.', color: '#FFD700' },
              { icon: '📊', title: 'Creator Analytics', desc: 'Track tips, supporters, top tokens, and earnings from your dashboard.', color: '#FF6B6B' },
              { icon: '🌐', title: 'Multi-Token', desc: 'Accept SOL and USDC. More SPL tokens coming next sprint.', color: '#9945FF' },
            ].map(({ icon, title, desc, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="relative rounded-2xl p-6 group transition-all duration-300 hover:border-opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at top left, ${color}0d 0%, transparent 70%)` }} />
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-base font-extrabold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-10 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(153,69,255,0.15), rgba(0,240,255,0.08))',
              border: '1px solid rgba(153,69,255,0.3)',
              boxShadow: '0 0 100px rgba(153,69,255,0.15)',
            }}
          >
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(153,69,255,0.12) 0%, transparent 70%)' }} />
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #9945FF, transparent)' }} />
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-4xl font-extrabold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Ready to get tipped?</h2>
              <p className="text-gray-400 text-lg mb-8">Join hundreds of Solana creators earning SOL from their community.</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/onboard" className="btn-primary px-8 py-4 text-base rounded-2xl gap-2">
                  <Rocket className="w-5 h-5" /> Create Free TipLink
                </Link>
                <Link href="/tip/gopichand0516" className="btn-secondary px-8 py-4 text-base rounded-2xl">
                  Try Demo
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)' }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">TipLink <span style={{ color: '#9945FF' }}>Live</span></span>
          </div>
          <p className="text-gray-600 text-xs">Tip any Solana creator, instantly. Zero fees. Fully on-chain.</p>
          <div className="flex items-center gap-4">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="https://github.com/gopichandchalla16/tiplink-live" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#444' }}>
              <Globe className="w-3.5 h-3.5" /> Solana Mainnet
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
