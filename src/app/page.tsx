'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Zap, Shield, Star, ArrowRight, Users, TrendingUp, Globe } from 'lucide-react';
import LiveTransactionFeed from '@/components/LiveTransactionFeed';
import HeroOrb from '@/components/HeroOrb';

const MOCK_CREATORS = [
  { name: 'Gopichand Challa',  username: 'gopichand',   bio: 'Solana dev · Web3 × AI · Team 0xGhostchain', avatar: 'G', total: '1.85', count: 12,  color: '#9945FF' },
  { name: 'Anatoly Yakovenko', username: 'aeyakovenko', bio: 'Co-founder of Solana. Built Proof of History.', avatar: 'A', total: '42.50', count: 180, color: '#00F0FF' },
  { name: 'Raj Gokal',         username: 'rajgokal',    bio: 'Co-founder of Solana. Building the fastest chain on Earth.', avatar: 'R', total: '38.20', count: 156, color: '#22C55E' },
];

const STATS = [
  { label: 'Tips Sent',     target: 2847, suffix: '+', icon: Zap,       color: '#9945FF' },
  { label: 'Creators Live', target: 142,  suffix: '',  icon: Users,     color: '#00F0FF' },
  { label: 'SOL Tipped',    target: 389,  suffix: '',  icon: TrendingUp, color: '#22C55E' },
  { label: 'On-Chain',      target: 100,  suffix: '%', icon: Shield,    color: '#FFD700' },
];

const STEPS = [
  { num: '01', icon: Shield, title: 'Connect Wallet',  desc: 'Link your Phantom wallet — non-custodial, read-only access only.', color: '#9945FF' },
  { num: '02', icon: Zap,    title: 'Share Your Link', desc: 'Your URL is a native Solana Blink — works in any compatible wallet.', color: '#00F0FF' },
  { num: '03', icon: Star,   title: 'Receive Tips',    desc: 'SOL lands in your wallet in under 1 second. Zero platform fees.', color: '#22C55E' },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    let step = 0;
    const steps = 60;
    const timer = setInterval(() => {
      step++;
      setVal(Math.round((target * step) / steps));
      if (step >= steps) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const [creatorIdx, setCreatorIdx] = useState(0);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  useEffect(() => {
    const t = setInterval(() => setCreatorIdx(i => (i + 1) % MOCK_CREATORS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: `${5 + (i * 3.5) % 90}%`,
    y: `${10 + (i * 7) % 80}%`,
    size: 2 + (i % 4),
    color: ['#9945FF','#00F0FF','#22C55E','#FFD700','#9945FF'][i % 5],
    duration: 3 + (i % 4),
    delay: (i * 0.25) % 3,
  }));

  const creator = MOCK_CREATORS[creatorIdx];

  return (
    <div className="min-h-screen grid-bg" style={{ background: '#080810' }}>

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(153,69,255,0.12) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      </div>

      {/* NAV */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)' }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>TipLink Live</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/explore" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Explore</Link>
          <Link href="/create" className="btn-primary px-4 py-2 text-sm">Create TipLink</Link>
        </div>
      </nav>

      {/* HERO */}
      <motion.section style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20">

        {/* Particle field */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(p => (
            <motion.div key={p.id}
              className="absolute rounded-full"
              style={{ left: p.x, top: p.y, width: p.size, height: p.size, background: p.color, opacity: 0.6 }}
              animate={{ y: [-8, 8, -8], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-bold" style={{ background: 'rgba(153,69,255,0.12)', border: '1px solid rgba(153,69,255,0.3)', color: '#9945FF' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Built on Solana Blinks · HackPrix Season 3
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Turn your wallet into a{' '}
              <span className="gradient-text">creator storefront</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              The first Solana-native tipping platform where your tip page IS a Blink —
              shareable, interactive, and settled on-chain in under a second.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/create" className="btn-primary">
                <Zap className="w-4 h-4" /> Create Your TipLink
              </Link>
              <Link href="/explore" className="btn-secondary">
                <Globe className="w-4 h-4" /> Explore Creators
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {['Non-custodial','<1s confirmation','Zero platform fee','AI thank-you'].map(b => (
                <div key={b} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-1 h-1 rounded-full bg-green-400" />
                  {b}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — 3D Orb behind the creator card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            {/* 3D Orb background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" style={{ top: '-40px' }}>
              <HeroOrb />
            </div>

            {/* Cards on top */}
            <div className="relative z-10 space-y-4">
              {/* Rotating creator card */}
              <div className="relative rounded-3xl p-6 overflow-hidden" style={{
                background: 'linear-gradient(145deg, rgba(15,15,26,0.95), rgba(10,10,20,0.98))',
                border: '1px solid rgba(153,69,255,0.3)',
                boxShadow: '0 0 60px rgba(153,69,255,0.12)',
              }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #9945FF80, transparent)' }} />
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">Featured Creator</p>
                <AnimatePresence mode="wait">
                  <motion.div key={creator.username}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${creator.color}40, ${creator.color}20)`, border: `2px solid ${creator.color}60` }}>
                      {creator.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white">{creator.name}</div>
                      <div className="text-xs text-gray-400">@{creator.username}</div>
                      <div className="text-xs text-gray-500 mt-1 truncate">{creator.bio}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-white">◎ {creator.total}</div>
                      <div className="text-xs text-gray-500">{creator.count} tips</div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <Link href={`/tip/${creator.username}`}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', boxShadow: '0 0 20px #9945FF40' }}
                >
                  <Zap className="w-3.5 h-3.5" /> Tip {creator.name.split(' ')[0]}
                </Link>
              </div>
              <LiveTransactionFeed />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* STATS BAR */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-3xl font-extrabold mb-1" style={{ color: s.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                <CountUp target={s.target} suffix={s.suffix} />
              </div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>How it works</h2>
          <p className="text-gray-500">Three steps to start earning tips on Solana</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative rounded-3xl p-7 cursor-default"
              style={{
                background: 'linear-gradient(145deg, rgba(15,15,26,0.9), rgba(10,10,20,0.98))',
                border: `1px solid ${step.color}25`,
                boxShadow: `0 0 40px ${step.color}08`,
              }}
            >
              <div className="absolute top-6 right-6 text-4xl font-black opacity-10" style={{ color: step.color, fontFamily: 'Space Grotesk, sans-serif' }}>{step.num}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}>
                <step.icon className="w-6 h-6" style={{ color: step.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-12 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(153,69,255,0.12), rgba(15,15,26,0.97))',
            border: '1px solid rgba(153,69,255,0.25)',
            boxShadow: '0 0 80px rgba(153,69,255,0.15)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(153,69,255,0.18) 0%, transparent 70%)' }} />
          <h2 className="text-3xl font-extrabold text-white mb-3 relative z-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Ready to monetize your work?</h2>
          <p className="text-gray-400 mb-8 relative z-10">Join 142+ creators already earning on TipLink Live</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/create" className="btn-primary">
              <Zap className="w-4 h-4" /> Create My TipLink
            </Link>
            <Link href="/explore" className="btn-secondary">
              <ArrowRight className="w-4 h-4" /> Browse Creators
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}