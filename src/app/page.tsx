'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const FEATURES = [
  { href: '/reputation', icon: '🏅', title: 'SoulBound Reputation NFT', desc: 'Earn on-chain tipper score. Mint non-transferable SBT proving your supporter status forever.', color: '#9945FF', badge: 'Token-2022' },
  { href: '/vault', icon: '🔒', title: 'Time-Lock Vault', desc: 'Lock SOL tips in Anchor escrow. Releases only when creator hits milestone — auto-refunds if they fail.', color: '#14F195', badge: 'Anchor' },
  { href: '/predict', icon: '🔮', title: 'Creator Prediction Market', desc: 'Tip + bet SOL on creator goals. YES/NO pools resolve automatically on-chain. No custodian.', color: '#F7931A', badge: 'DeFi' },
  { href: '/zkproof', icon: '🔏', title: 'ZK-Anonymous Tip Proofs', desc: 'Prove you tipped without revealing your wallet. Groth16 ZK circuit — cryptographic privacy.', color: '#0088ff', badge: 'ZK Proof' },
  { href: '/streams', icon: '🌊', title: 'AI-Powered Tip Streams', desc: 'Recurring micro-payments per content post. Gemini AI scores creator quality weekly.', color: '#ff6b9d', badge: 'AI + Web3' },
];

const STATS = [
  { value: '5', label: 'Novel Web3 Features' },
  { value: 'SOL', label: 'Native Blockchain' },
  { value: 'ZK', label: 'Privacy Layer' },
  { value: 'AI', label: 'Intelligence Layer' },
];

export default function HomePage() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 2000); return () => clearInterval(t); }, []);

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0520 50%, #0a0a0f 100%)', fontFamily: 'Inter, sans-serif', color: '#e8e8f0', overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,15,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <span style={{ fontSize: 17, fontWeight: 800, background: 'linear-gradient(135deg, #9945FF, #14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TipLink Live</span>
          <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(20,241,149,0.15)', color: '#14F195', fontSize: 10, fontWeight: 700, border: '1px solid rgba(20,241,149,0.3)', animation: tick % 2 === 0 ? 'none' : undefined }}>● LIVE</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FEATURES.map(f => (
            <Link key={f.href} href={f.href} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#9070c0', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s' }}>
              {f.icon} {f.title.split(' ').slice(0, 2).join(' ')}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(153,69,255,0.15) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.3)', fontSize: 12, color: '#9945FF', marginBottom: 24 }}>
          🏆 Hackathon Demo — 5 World-First Web3 Features
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
          <span style={{ background: 'linear-gradient(135deg, #ffffff, #c0b0e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>The Future of</span><br />
          <span style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Creator Tipping</span><br />
          <span style={{ background: 'linear-gradient(135deg, #ffffff, #c0b0e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>on Solana</span>
        </h1>
        <p style={{ fontSize: 17, color: '#8070a0', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
          SoulBound NFTs · Time-Lock Vaults · Prediction Markets · ZK Proofs · AI Tip Streams<br />
          <strong style={{ color: '#c0b0e0' }}>5 novel Web3 features no one has built before.</strong>
        </p>

        {/* Stats */}
        <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 40 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.03)', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#9945FF' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#6060a0', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/reputation" style={{ padding: '14px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #9945FF, #14F195)', color: 'white', fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
            🚀 Explore All Features
          </Link>
          <a href="https://github.com/gopichandchalla16/tiplink-live" target="_blank" rel="noreferrer" style={{ padding: '14px 28px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', color: '#c0c0e0', fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'inline-block', background: 'rgba(255,255,255,0.04)' }}>
            📂 View on GitHub
          </a>
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#6060a0', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 32 }}>5 NOVEL WEB3 FEATURES</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${f.color}25`, borderRadius: 20, padding: 28, height: '100%', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <span style={{ fontSize: 40 }}>{f.icon}</span>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${f.color}20`, color: f.color, border: `1px solid ${f.color}40` }}>{f.badge}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: '#e8e8f0' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#7070a0', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                <div style={{ marginTop: 20, fontSize: 12, fontWeight: 700, color: f.color }}>Explore → </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#4040606' }}>⚡ TipLink Live — Built on Solana · Powered by Web3 + AI</span>
        <div style={{ display: 'flex', gap: 16 }}>
          {FEATURES.map(f => <Link key={f.href} href={f.href} style={{ fontSize: 12, color: '#5050a0', textDecoration: 'none' }}>{f.icon}</Link>)}
        </div>
      </footer>
    </main>
  );
}
