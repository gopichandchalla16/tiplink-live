'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Star, Shield, ArrowRight, Users, TrendingUp, Wallet, ChevronDown } from 'lucide-react';

const STATS = [
  { label: 'Creators Onboarded', value: '2,400+', icon: Users },
  { label: 'Tips Sent', value: '18,900+', icon: Zap },
  { label: 'SOL Distributed', value: '4,300+', icon: TrendingUp },
];

const FEATURES = [
  { icon: Zap, title: 'Instant Tips', desc: 'Send SOL in seconds with a single link. No apps, no accounts, no barriers.' },
  { icon: Shield, title: 'Non-Custodial', desc: 'Funds go directly to creator wallets. We never hold your money.' },
  { icon: Star, title: 'Beautiful Pages', desc: 'Every creator gets a stunning branded page that converts visitors into tippers.' },
  { icon: Wallet, title: 'Blink-Ready', desc: 'Solana Actions & Blinks support — tip directly from Twitter/X or any platform.' },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-700/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-violet-700/10 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-glow flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold gradient-text">TipLink Live</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/explore')} className="text-sm text-white/60 hover:text-white transition px-4 py-2">
            Explore
          </button>
          <button onClick={() => router.push('/create')} className="btn-glow text-sm font-semibold px-5 py-2 rounded-xl text-white">
            Create Page
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-8">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
          <span className="text-xs text-purple-300 font-medium">Powered by Solana — Sub-second finality</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight max-w-4xl mb-6">
          The{' '}
          <span className="gradient-text">Creator Economy</span>
          <br />Runs on Solana
        </h1>
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
          Give your audience the easiest way to support you. One link, beautiful page, instant SOL tips — no middleman, no fees.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={() => router.push('/create')}
            className="btn-glow flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg"
          >
            Launch Your Page <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/explore')}
            className="glass flex items-center gap-2 px-8 py-4 rounded-2xl text-white/80 font-semibold text-lg hover:bg-white/8 transition"
          >
            Explore Creators
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl w-full">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center">
              <Icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-black gradient-text">{value}</div>
              <div className="text-xs text-white/40 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Everything Creators Need</h2>
          <p className="text-white/40">Built for the next generation of digital creators</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition">
                <Icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-3xl mx-auto glass rounded-3xl p-10 text-center border-animated">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to <span className="gradient-text">Monetize</span> Your Content?
          </h2>
          <p className="text-white/40 mb-8">Join thousands of creators earning SOL directly from their community.</p>
          <button
            onClick={() => router.push('/create')}
            className="btn-glow px-10 py-4 rounded-2xl text-white font-bold text-lg"
          >
            Create Your Free Page →
          </button>
        </div>
      </section>

      <footer className="relative z-10 text-center py-8 text-white/20 text-sm border-t border-white/5">
        © 2026 TipLink Live · Built on Solana · Made with ❤️ for creators
      </footer>
    </div>
  );
}
