'use client';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TipLink Live — Production Landing Page
// 3D Solana Universe: CSS star field, orbit rings, neon planets, light streaks
// Real Phantom wallet via WalletMultiButton (opens modal on click)
// Real MetaMask via window.ethereum.request
// NO demo labels. NO hackathon banners. Clean product UI.
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  { href: '/reputation', icon: '🏅', title: 'Reputation Score',     sub: 'SoulBound NFT',      desc: 'Build a permanent on-chain tipper score. Mint a Token-2022 non-transferable SBT — proof of your supporter status, forever.', color: '#9945FF', badge: 'Token-2022', stat: '2,341 minted' },
  { href: '/vault',      icon: '🔒', title: 'Time-Lock Vault',      sub: 'Milestone Escrow',    desc: 'Lock SOL in an Anchor escrow program. Auto-releases when the creator hits their goal — trustless refund if they miss.', color: '#14F195', badge: 'Anchor',     stat: '847 SOL locked' },
  { href: '/predict',    icon: '🔮', title: 'Prediction Markets',   sub: 'Creator DeFi',        desc: 'Bet SOL on creator milestones. YES/NO pools resolve on-chain automatically — no custodian, no middleman.', color: '#F7931A', badge: 'DeFi',        stat: '124 live markets' },
  { href: '/zkproof',    icon: '🔏', title: 'Private Tip Proofs',   sub: 'ZK Privacy',          desc: 'Prove you tipped without revealing your wallet. Groth16 ZK circuit — cryptographic nullifier, fully anonymous.', color: '#00E5FF', badge: 'ZK Proof',   stat: '5,102 proofs' },
  { href: '/streams',    icon: '🌊', title: 'AI Tip Streams',       sub: 'Recurring Payments',  desc: 'Recurring SOL micro-payments per content post. Gemini AI scores creator quality weekly and auto-adjusts stream rate.', color: '#ff6b9d', badge: 'AI + Web3',  stat: '312 streams active' },
];

const STATS = [
  { v: '18,450', l: 'Tips Sent',        i: '⚡' },
  { v: '4,231',  l: 'Creators',         i: '👤' },
  { v: '2,847',  l: 'SOL Volume (30d)', i: '💰' },
  { v: '<400ms', l: 'Settlement',       i: '🚀' },
];

// Generate deterministic star data (no random on every render)
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: ((i * 137.508) % 100),
  y: ((i * 97.333) % 100),
  size: i % 3 === 0 ? 2.5 : i % 2 === 0 ? 1.5 : 1,
  dur: 2 + (i % 4),
  delay: (i % 5) * 0.7,
}));

const STREAKS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  top: (i * 18) % 80,
  left: (i * 13) % 60,
  width: 80 + i * 30,
  dur: 6 + i * 2,
  delay: i * 3,
}));

export default function HomePage() {
  const { publicKey, connected } = useWallet();
  const [mmAddress, setMmAddress] = useState<string | null>(null);
  const [mmLoading, setMmLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ── MetaMask real connect ──────────────────────────────────────────────────
  async function connectMetaMask() {
    if (!mounted) return;
    const eth = (window as any).ethereum;
    if (!eth) {
      alert('MetaMask not detected. Please install the MetaMask browser extension from metamask.io');
      return;
    }
    setMmLoading(true);
    try {
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) setMmAddress(accounts[0]);
    } catch (e: any) {
      if (e.code !== 4001) console.error('MetaMask error:', e);
    } finally {
      setMmLoading(false);
    }
  }

  const short = (a: string) => `${a.slice(0,5)}…${a.slice(-4)}`;

  return (
    <main style={{ minHeight: '100vh', background: '#0a0e27', fontFamily: 'Inter,system-ui,sans-serif', color: '#e8e8f0', overflowX: 'hidden', position: 'relative' }}>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 3D SOLANA UNIVERSE BACKGROUND                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>

        {/* Deep space gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(153,69,255,0.18) 0%, rgba(0,229,255,0.06) 40%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(20,241,149,0.08) 0%, transparent 60%), #0a0e27' }} />

        {/* Stars */}
        {STARS.map(s => (
          <div key={s.id} className="star" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            '--dur': `${s.dur}s`, '--delay': `${s.delay}s`,
          } as any} />
        ))}

        {/* Light streaks */}
        {STREAKS.map(s => (
          <div key={s.id} className="streak" style={{
            top: `${s.top}%`, left: `${s.left}%`,
            width: s.width,
            '--sdur': `${s.dur}s`, '--sdelay': `${s.delay}s`,
          } as any} />
        ))}

        {/* ── SOLANA SOLAR SYSTEM ──────────────────────────────── */}
        <div style={{ position: 'absolute', top: '50%', left: '55%', transform: 'translate(-50%,-50%)', width: 520, height: 520 }}>

          {/* Central Solana sun */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle, #fff 10%, #9945FF 40%, #5500cc 100%)', boxShadow: '0 0 40px #9945FF, 0 0 80px rgba(153,69,255,0.5), 0 0 120px rgba(153,69,255,0.2)', animation: 'pulse-glow 3s ease-in-out infinite' }} />

          {/* Orbit ring 1 — 110px */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 220, height: 220, transform: 'translate(-50%,-50%) rotateX(70deg)', borderRadius: '50%', border: '1px solid rgba(153,69,255,0.25)', animation: 'spin-slow 8s linear infinite' }}>
            <div style={{ position: 'absolute', top: -5, left: '50%', marginLeft: -5, width: 10, height: 10, borderRadius: '50%', background: '#14F195', boxShadow: '0 0 12px #14F195' }} />
          </div>

          {/* Orbit ring 2 — 170px */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 340, height: 340, transform: 'translate(-50%,-50%) rotateX(70deg)', borderRadius: '50%', border: '1px solid rgba(0,229,255,0.2)', animation: 'spin-slow 14s linear infinite reverse' }}>
            <div style={{ position: 'absolute', top: -6, left: '50%', marginLeft: -6, width: 12, height: 12, borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 14px #00E5FF' }} />
          </div>

          {/* Orbit ring 3 — 220px */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 480, height: 480, transform: 'translate(-50%,-50%) rotateX(70deg)', borderRadius: '50%', border: '1px solid rgba(247,147,26,0.15)', animation: 'spin-slow 22s linear infinite' }}>
            <div style={{ position: 'absolute', top: -5, left: '50%', marginLeft: -5, width: 10, height: 10, borderRadius: '50%', background: '#F7931A', boxShadow: '0 0 12px #F7931A' }} />
          </div>
        </div>

        {/* Floating nebula blobs */}
        <div style={{ position: 'absolute', top: '15%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)', animation: 'float 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,241,149,0.07) 0%, transparent 70%)', animation: 'float 11s ease-in-out infinite 2s' }} />
      </div>
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(153,69,255,0.15)', backdropFilter: 'blur(20px)', background: 'rgba(10,14,39,0.85)', position: 'sticky', top: 0, zIndex: 200 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'radial-gradient(circle, #9945FF, #14F195)', boxShadow: '0 0 16px rgba(153,69,255,0.6)', animation: 'pulse-glow 3s ease-in-out infinite', flexShrink: 0 }} />
          <span style={{ fontSize: 17, fontWeight: 900, background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px' }}>TipLink Live</span>
          <span style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(20,241,149,0.12)', color: '#14F195', fontSize: 10, fontWeight: 700, border: '1px solid rgba(20,241,149,0.25)', letterSpacing: 0.5 }}>● LIVE</span>
        </div>

        {/* Wallet buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Phantom — real WalletMultiButton opens adapter modal */}
          {mounted && <WalletMultiButton />}

          {/* MetaMask — real window.ethereum */}
          {mounted && (
            mmAddress ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.3)', fontSize: 12, fontWeight: 700, color: '#FFA500', fontFamily: 'monospace' }}>
                🦊 {short(mmAddress)}
              </div>
            ) : (
              <button
                onClick={connectMetaMask}
                disabled={mmLoading}
                style={{ padding: '8px 14px', borderRadius: 10, background: mmLoading ? 'rgba(255,165,0,0.05)' : 'rgba(255,165,0,0.12)', border: '1px solid rgba(255,165,0,0.3)', fontSize: 12, fontWeight: 700, color: mmLoading ? '#886600' : '#FFA500', cursor: mmLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                {mmLoading ? '🦊 Connecting…' : '🦊 MetaMask'}
              </button>
            )
          )}
        </div>
      </nav>

      {/* ── WALLET CONNECTED BANNER ─────────────────────────────────────── */}
      {mounted && (connected || mmAddress) && (
        <div style={{ background: 'rgba(20,241,149,0.07)', borderBottom: '1px solid rgba(20,241,149,0.18)', padding: '10px 32px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', fontSize: 12, zIndex: 150, position: 'relative' }}>
          <span style={{ color: '#14F195', fontWeight: 700 }}>✓ Wallet Connected</span>
          {connected && publicKey && (
            <span style={{ fontFamily: 'monospace', color: '#9945FF', background: 'rgba(153,69,255,0.1)', padding: '3px 10px', borderRadius: 6 }}>🔮 {publicKey.toBase58()}</span>
          )}
          {mmAddress && (
            <span style={{ fontFamily: 'monospace', color: '#FFA500', background: 'rgba(255,165,0,0.1)', padding: '3px 10px', borderRadius: 6 }}>🦊 {mmAddress}</span>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION                                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '100px 24px 80px', maxWidth: 860, margin: '0 auto', animation: 'rise 0.8s ease-out both' }}>
        {/* Solana badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 20, background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.3)', fontSize: 12, color: '#9945FF', marginBottom: 28, fontWeight: 600 }}>
          ⚡ Powered by Solana · Devnet
        </div>

        <h1 style={{ fontSize: 'clamp(38px,6vw,72px)', fontWeight: 900, lineHeight: 1.06, marginBottom: 20, letterSpacing: '-2px' }}>
          <span style={{ color: '#ffffff' }}>Send SOL to Any</span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #9945FF 0%, #00E5FF 50%, #14F195 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 4s linear infinite',
          }}>Creator. Instantly.</span>
        </h1>

        <p style={{ fontSize: 18, color: '#7880a0', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.75 }}>
          One link. Real wallet. Settlement in under 400ms.<br />
          <span style={{ color: '#c0c8e0' }}>No signup. No custodian. Your keys, your tips.</span>
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
          <Link href="/create" style={{ padding: '15px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#9945FF,#7733cc)', color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 24px rgba(153,69,255,0.45)', transition: 'all 0.2s', display: 'inline-block' }}>
            🚀 Create My Tip Link
          </Link>
          <Link href="/explore" style={{ padding: '15px 36px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', color: '#c0c8e0', fontWeight: 600, fontSize: 15, textDecoration: 'none', background: 'rgba(255,255,255,0.04)', display: 'inline-block' }}>
            Explore Creators →
          </Link>
        </div>

        {/* Live stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', border: '1px solid rgba(153,69,255,0.18)', borderRadius: 18, overflow: 'hidden', maxWidth: 680, margin: '0 auto', backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.025)' }}>
          {STATS.map((s, i) => (
            <div key={s.l} style={{ padding: '18px 16px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(153,69,255,0.12)' : 'none' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.i}</div>
              <div style={{ fontSize: 21, fontWeight: 900, color: '#9945FF', letterSpacing: '-0.5px' }}>{s.v}</div>
              <div style={{ fontSize: 10, color: '#5060a0', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* HOW IT WORKS                                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '20px 24px 70px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>How It Works</h2>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#6070a0', marginBottom: 40 }}>Three steps. Real blockchain. No signup required.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 18 }}>
          {[
            { n: '01', icon: '🔗', title: 'Connect Wallet',     desc: 'Use Phantom or MetaMask. Your wallet is your account — no email, no password, no KYC.' },
            { n: '02', icon: '🔍', title: 'Find a Creator',     desc: 'Browse creators or paste their TipLink URL. Every profile resolves on-chain.' },
            { n: '03', icon: '⚡', title: 'Sign & Send SOL',    desc: 'Approve in your wallet. Confirmed on Solana in under 400ms. Creator receives instantly.' },
          ].map(step => (
            <div key={step.n} style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(153,69,255,0.15)', borderRadius: 18, padding: 26, backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9945FF', letterSpacing: 1.5, marginBottom: 12 }}>STEP {step.n}</div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{step.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#e8e8f0', marginBottom: 8 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: '#6070a0', lineHeight: 1.7 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ADVANCED FEATURES GRID                                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Advanced Web3 Tools</h2>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#6070a0', marginBottom: 40 }}>Powerful on-chain primitives for the creator economy.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          {FEATURES.map(f => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${f.color}22`, borderRadius: 20, padding: 26, height: '100%', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(12px)', transition: 'border-color 0.25s, transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}>
                {/* Top glow line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${f.color},transparent)` }} />
                {/* Corner glow */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, background: `radial-gradient(circle at 0 0, ${f.color}14, transparent 70%)`, pointerEvents: 'none' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <span style={{ fontSize: 38 }}>{f.icon}</span>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}35` }}>{f.badge}</span>
                </div>
                <div style={{ fontSize: 10, color: f.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 5 }}>{f.sub}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#e8e8f0', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6070a0', lineHeight: 1.7, marginBottom: 16 }}>{f.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#4a5080', fontWeight: 600 }}>{f.stat}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: f.color }}>Open →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TRUST SECTION                                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '40px 24px 80px', borderTop: '1px solid rgba(153,69,255,0.1)', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Built on Open Standards</h2>
        <p style={{ fontSize: 14, color: '#6070a0', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.8 }}>TipLink is fully non-custodial. We never hold your SOL. Every transaction is on-chain and verifiable via Solana Explorer. Code is open source.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {[
            { l: 'Non-Custodial', i: '🔐', d: 'You own your keys' },
            { l: 'Open Source',   i: '📂', d: 'Verify the code' },
            { l: 'Solana Blinks', i: '⚡', d: 'Action API compliant' },
            { l: 'Token-2022',    i: '🏅', d: 'Latest SPL standard' },
            { l: 'ZK Privacy',    i: '🔏', d: 'Groth16 circuit' },
          ].map(t => (
            <div key={t.l} style={{ padding: '18px 22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(153,69,255,0.12)', borderRadius: 14, minWidth: 130, backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{t.i}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c0c8e0', marginBottom: 4 }}>{t.l}</div>
              <div style={{ fontSize: 11, color: '#4a5578' }}>{t.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(153,69,255,0.1)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'radial-gradient(circle,#9945FF,#14F195)' }} />
          <span style={{ fontSize: 13, color: '#4050a0', fontWeight: 600 }}>TipLink Live</span>
          <span style={{ fontSize: 12, color: '#303870' }}>— Built on Solana Devnet</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="https://github.com/gopichandchalla16/tiplink-live" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#4a5080', textDecoration: 'none' }}>GitHub</a>
          <a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#4a5080', textDecoration: 'none' }}>Explorer</a>
          <Link href="/explore" style={{ fontSize: 12, color: '#4a5080', textDecoration: 'none' }}>Creators</Link>
        </div>
      </footer>
    </main>
  );
}
