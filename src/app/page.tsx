'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Star, ArrowRight, Users, TrendingUp, Globe, Twitter, Github, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically load heavy animated components to avoid SSR issues
const LiveTransactionFeed = dynamic(() => import('@/components/LiveTransactionFeed'), { ssr: false });
const HeroOrb = dynamic(() => import('@/components/HeroOrb'), { ssr: false });

const FEATURED_CREATORS = [
  {
    name: 'Anatoly Yakovenko',
    username: 'aeyakovenko',
    bio: 'Co-founder of Solana. Built Proof of History. Scaling crypto to 1 billion users.',
    avatar: 'AY',
    total: '42.50',
    count: 180,
    color: '#9945FF',
    tag: 'Founder',
  },
  {
    name: 'Raj Gokal',
    username: 'rajgokal',
    bio: 'Co-founder of Solana. Building the fastest blockchain on Earth.',
    avatar: 'RG',
    total: '38.20',
    count: 156,
    color: '#00F0FF',
    tag: 'Founder',
  },
  {
    name: 'Gopichand Challa',
    username: 'gopichand0516',
    bio: 'Solana dev · Web3 × AI builder · Team 0xGhostchain · HackPrix S3',
    avatar: 'GC',
    total: '1.85',
    count: 12,
    color: '#22C55E',
    tag: 'Developer',
  },
];

const STATS = [
  { label: 'Tips Sent',     value: '2,847+', icon: Zap,        color: '#9945FF' },
  { label: 'Creators Live', value: '142',    icon: Users,      color: '#00F0FF' },
  { label: 'SOL Tipped',    value: '389 ◎',  icon: TrendingUp, color: '#22C55E' },
  { label: 'On-Chain',      value: '100%',   icon: Shield,     color: '#FFD700' },
];

const STEPS = [
  { num: '01', icon: Shield, title: 'Connect Phantom',  desc: 'Link your Phantom wallet in one click — non-custodial, read-only permissions only. Your keys stay with you.', color: '#9945FF' },
  { num: '02', icon: Zap,    title: 'Get Your Blink',   desc: 'Your TipLink is a native Solana Blink — a live URL that works inside Twitter, Telegram, and any Blink-compatible app.', color: '#00F0FF' },
  { num: '03', icon: Star,   title: 'Earn Instantly',   desc: 'SOL lands in your wallet in under 400ms. Zero platform cuts. Every tip generates a personalised AI thank-you message.', color: '#22C55E' },
];

const FEATURES = [
  { icon: Zap,        title: 'Solana Blinks',         desc: 'Your tip page works as a native Solana Blink — embeddable in any social app.', color: '#9945FF' },
  { icon: Shield,     title: 'Non-Custodial',         desc: 'We never hold your funds. Transactions go directly wallet-to-wallet.', color: '#00F0FF' },
  { icon: Star,       title: 'AI Thank-You',          desc: 'Gemini AI crafts a personalised message for every tip received.', color: '#FFD700' },
  { icon: Globe,      title: '<400ms Settlement',     desc: 'Solana confirms in under a second — the fastest L1 on the planet.', color: '#22C55E' },
  { icon: TrendingUp, title: 'Creator Dashboard',     desc: 'Real-time analytics, tip history, and earnings overview in one place.', color: '#9945FF' },
  { icon: Users,      title: 'Supporter Wall',        desc: 'Every tipper is recognised publicly — building community around creators.', color: '#00F0FF' },
];

export default function LandingPage() {
  const [creatorIdx, setCreatorIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setCreatorIdx(i => (i + 1) % FEATURED_CREATORS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const creator = FEATURED_CREATORS[creatorIdx];

  return (
    <div className="min-h-screen" style={{ background: '#07070f' }}>

      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-80 -left-80 w-[700px] h-[700px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(153,69,255,0.10) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.07) 0%, transparent 65%)', filter: 'blur(70px)' }} />
        <div className="absolute -bottom-60 left-1/3 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(153,69,255,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        {/* Subtle dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(153,69,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', boxShadow: '0 0 20px rgba(153,69,255,0.5)' }}>
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>TipLink
            <span style={{ color: '#9945FF' }}> Live</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/explore" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Explore</Link>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Dashboard</Link>
          <a href="https://github.com/gopichandchalla16/tiplink-live" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
        </div>
        <Link href="/create" className="btn-primary px-5 py-2.5 text-sm">
          <Zap className="w-4 h-4" /> Create TipLink
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7 text-xs font-bold" style={{ background: 'rgba(153,69,255,0.12)', border: '1px solid rgba(153,69,255,0.28)', color: '#a78bfa' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Built on Solana Blinks · HackPrix Season 3
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.12] mb-6 text-white" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
              The creator
              <br />
              <span className="gradient-text">tip page</span>
              <br />
              is now a Blink.
            </h1>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md">
              Share one link. Supporters tip you in SOL — directly, on-chain,
              in under a second. No middlemen. No fees. Just value.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/create" className="btn-primary">
                <Zap className="w-4 h-4" /> Create My TipLink
              </Link>
              <Link href="/explore" className="btn-secondary">
                <Globe className="w-4 h-4" /> Explore Creators
              </Link>
            </div>

            <div className="flex flex-wrap gap-5">
              {['Non-custodial', '<400ms confirmation', 'Zero platform fee', 'AI thank-you', 'Solana Blinks'].map(badge => (
                <div key={badge} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span className="w-1 h-1 rounded-full" style={{ background: '#9945FF' }} />
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="relative flex flex-col items-center gap-4"
          >
            {/* Orb behind cards */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-0">
              {mounted && <HeroOrb />}
            </div>

            <div className="relative z-10 w-full max-w-sm space-y-3">
              {/* Rotating creator preview card */}
              <div className="rounded-2xl p-5 relative overflow-hidden" style={{
                background: 'linear-gradient(145deg, rgba(13,13,24,0.97), rgba(9,9,18,0.99))',
                border: '1px solid rgba(153,69,255,0.25)',
                boxShadow: '0 0 50px rgba(153,69,255,0.10)',
              }}>
                <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(153,69,255,0.5), transparent)' }} />
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-3">Featured Creator</p>
                <AnimatePresence mode="wait">
                  <motion.div key={creator.username}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 text-white"
                        style={{ background: `linear-gradient(135deg, ${creator.color}50, ${creator.color}25)`, border: `1.5px solid ${creator.color}50` }}>
                        {creator.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{creator.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${creator.color}20`, color: creator.color }}>{creator.tag}</span>
                        </div>
                        <div className="text-xs text-gray-500">@{creator.username}</div>
                        <div className="text-xs text-gray-600 mt-0.5 truncate">{creator.bio}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-extrabold text-white text-sm">◎ {creator.total}</div>
                        <div className="text-xs text-gray-600">{creator.count} tips</div>
                      </div>
                    </div>
                    <Link href={`/tip/${creator.username}`}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02]"
                      style={{ background: `linear-gradient(135deg, ${creator.color}cc, ${creator.color}99)`, boxShadow: `0 0 20px ${creator.color}30` }}
                    >
                      <Zap className="w-3 h-3" /> Send a tip to {creator.name.split(' ')[0]}
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Live tx feed */}
              {mounted && <LiveTransactionFeed />}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5 text-center relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.color}50, transparent)` }} />
              <div className="text-3xl font-extrabold mb-1" style={{ color: s.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                {s.value}
              </div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold" style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', color: '#67e8f9' }}>How it works</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Three steps to start<br />earning on Solana</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <motion.div key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="relative rounded-2xl p-7 group cursor-default transition-all"
              style={{
                background: 'rgba(13,13,24,0.97)',
                border: `1px solid ${step.color}20`,
              }}
            >
              <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)` }} />
              <div className="text-6xl font-black mb-6 leading-none select-none" style={{ color: step.color, opacity: 0.12, fontFamily: 'Space Grotesk, sans-serif' }}>{step.num}</div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                <step.icon className="w-5 h-5" style={{ color: step.color }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold" style={{ background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.2)', color: '#a78bfa' }}>Platform</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Everything a creator needs</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-6 relative overflow-hidden group hover:border-opacity-50 transition-all"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-bold text-white mb-1.5 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-12 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(153,69,255,0.10), rgba(10,10,20,0.98))',
            border: '1px solid rgba(153,69,255,0.22)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 0%, rgba(153,69,255,0.16) 0%, transparent 70%)' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-xs font-bold" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> 142 creators already live
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Ready to monetize<br />your work on-chain?</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Create your free TipLink in under 30 seconds. No KYC. No fees. Just your wallet and your community.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/create" className="btn-primary">
                <Zap className="w-4 h-4" /> Create My TipLink — Free
              </Link>
              <Link href="/explore" className="btn-secondary">
                <ArrowRight className="w-4 h-4" /> Browse Creators
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)' }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">TipLink Live</span>
            <span className="text-gray-700 text-xs ml-1">· Built on Solana</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            <Link href="/explore" className="hover:text-gray-400 transition-colors">Explore</Link>
            <Link href="/create" className="hover:text-gray-400 transition-colors">Create</Link>
            <Link href="/dashboard" className="hover:text-gray-400 transition-colors">Dashboard</Link>
            <a href="https://github.com/gopichandchalla16/tiplink-live" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors flex items-center gap-1"><Github className="w-3 h-3" /> Source</a>
          </div>
          <p className="text-xs text-gray-700">© 2026 TipLink Live · HackPrix Season 3</p>
        </div>
      </footer>

    </div>
  );
}
