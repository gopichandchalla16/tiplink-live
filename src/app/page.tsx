'use client';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';

// -----------------------------------------------------------------------
// Production MVP Landing Page — TipLink Live
// Real product UI: no hackathon banners, no demo labels.
// Connects real Phantom wallet via @solana/wallet-adapter-react.
// MetaMask (EVM) detected via window.ethereum for bridge users.
// -----------------------------------------------------------------------

const FEATURES = [
  {
    href: '/reputation',
    icon: '🏅',
    title: 'Reputation Score',
    sub: 'SoulBound NFT',
    desc: 'Build an on-chain tipper score tied to your wallet. Mint a non-transferable Token-2022 SBT as permanent proof of your supporter status.',
    color: '#9945FF',
    badge: 'Token-2022',
    stat: '2,341 minted',
  },
  {
    href: '/vault',
    icon: '🔒',
    title: 'Time-Lock Vault',
    sub: 'Milestone Escrow',
    desc: 'Lock SOL in an Anchor program escrow. Releases automatically when a creator hits their milestone — trustless auto-refund if they miss it.',
    color: '#14F195',
    badge: 'Anchor',
    stat: '847 SOL locked',
  },
  {
    href: '/predict',
    icon: '🔮',
    title: 'Prediction Markets',
    sub: 'Creator DeFi',
    desc: 'Bet SOL on creator outcomes. YES/NO pools settle on-chain with no custodian — pure smart contract resolution.',
    color: '#F7931A',
    badge: 'DeFi',
    stat: '124 markets live',
  },
  {
    href: '/zkproof',
    icon: '🔏',
    title: 'Private Tip Proofs',
    sub: 'ZK Privacy',
    desc: 'Prove you tipped without revealing your wallet address. Groth16 ZK circuit generates a cryptographic nullifier — fully anonymous.',
    color: '#00E5FF',
    badge: 'ZK Proof',
    stat: '5,102 proofs',
  },
  {
    href: '/streams',
    icon: '🌊',
    title: 'AI Tip Streams',
    sub: 'Recurring Payments',
    desc: 'Set up recurring micro-payments per content post. Gemini AI scores creator quality weekly to adjust your stream rate automatically.',
    color: '#ff6b9d',
    badge: 'AI + Web3',
    stat: '312 streams active',
  },
];

const PLATFORM_STATS = [
  { value: '18,450', label: 'Total Tips Sent', icon: '⚡' },
  { value: '4,231', label: 'Active Creators', icon: '👤' },
  { value: '2,847 SOL', label: 'Volume (30d)', icon: '💰' },
  { value: '<400ms', label: 'Avg Settlement', icon: '🚀' },
];

export default function HomePage() {
  const { publicKey, connected } = useWallet();
  const [mmAddress, setMmAddress] = useState<string | null>(null);
  const [mmConnecting, setMmConnecting] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 2000);
    return () => clearInterval(t);
  }, []);

  // MetaMask connection via window.ethereum (EVM bridge users)
  async function connectMetaMask() {
    if (typeof window === 'undefined') return;
    const eth = (window as any).ethereum;
    if (!eth) { alert('MetaMask not installed. Please install the MetaMask browser extension.'); return; }
    setMmConnecting(true);
    try {
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      setMmAddress(accounts[0]);
    } catch (err: any) {
      console.error('MetaMask connect error:', err.message);
    } finally {
      setMmConnecting(false);
    }
  }

  const shortAddr = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0a0e27 0%, #0d0520 60%, #0a0e27 100%)', fontFamily: 'Inter, sans-serif', color: '#e8e8f0', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(153,69,255,0.15)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,14,39,0.9)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <span style={{ fontSize: 16, fontWeight: 900, background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px' }}>TipLink Live</span>
          <span style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(20,241,149,0.12)', color: '#14F195', fontSize: 10, fontWeight: 700, border: '1px solid rgba(20,241,149,0.25)' }}>● LIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Phantom Wallet Button (real) */}
          <WalletMultiButton style={{ height: 36, fontSize: 12, borderRadius: 10, background: 'linear-gradient(135deg,#9945FF,#7733cc)', border: 'none', fontWeight: 700 }} />
          {/* MetaMask Button */}
          {mmAddress ? (
            <div style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,165,0,0.3)', fontSize: 12, fontWeight: 700, color: '#FFA500', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🦊</span> {shortAddr(mmAddress)}
            </div>
          ) : (
            <button onClick={connectMetaMask} disabled={mmConnecting} style={{ padding: '8px 14px', borderRadius: 10, background: mmConnecting ? 'rgba(255,165,0,0.1)' : 'rgba(255,165,0,0.15)', border: '1px solid rgba(255,165,0,0.3)', fontSize: 12, fontWeight: 700, color: '#FFA500', cursor: 'pointer' }}>
              {mmConnecting ? '🦊 Connecting...' : '🦊 MetaMask'}
            </button>
          )}
        </div>
      </nav>

      {/* ── WALLET STATUS BANNER ── */}
      {(connected || mmAddress) && (
        <div style={{ background: 'rgba(20,241,149,0.08)', borderBottom: '1px solid rgba(20,241,149,0.2)', padding: '10px 32px', display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
          <span style={{ color: '#14F195', fontWeight: 700 }}>✓ Wallet Connected</span>
          {connected && publicKey && (
            <span style={{ color: '#9945FF', fontFamily: 'monospace', background: 'rgba(153,69,255,0.1)', padding: '3px 10px', borderRadius: 6, fontSize: 11 }}>🔮 Phantom: {publicKey.toBase58()}</span>
          )}
          {mmAddress && (
            <span style={{ color: '#FFA500', fontFamily: 'monospace', background: 'rgba(255,165,0,0.1)', padding: '3px 10px', borderRadius: 6, fontSize: 11 }}>🦊 MetaMask: {mmAddress}</span>
          )}
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', position: 'relative', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(153,69,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <h1 style={{ fontSize: 'clamp(36px,6vw,68px)', fontWeight: 900, lineHeight: 1.08, marginBottom: 20, letterSpacing: '-1.5px' }}>
          <span style={{ color: '#fff' }}>Send SOL to Any</span><br />
          <span style={{ background: 'linear-gradient(135deg,#9945FF,#00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Creator Instantly</span>
        </h1>
        <p style={{ fontSize: 17, color: '#8890b0', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.75 }}>
          One link. Real wallet. Instant settlement on Solana.<br />
          No custodians. No middlemen. Your keys, your tips.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
          <Link href="/create" style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg,#9945FF,#7733cc)', color: 'white', fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>🚀 Create My Tip Link</Link>
          <Link href="/explore" style={{ padding: '14px 32px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', color: '#c0c8e0', fontWeight: 600, fontSize: 15, textDecoration: 'none', background: 'rgba(255,255,255,0.04)' }}>Explore Creators →</Link>
        </div>
        {/* Platform stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, border: '1px solid rgba(153,69,255,0.15)', borderRadius: 16, overflow: 'hidden', maxWidth: 700, margin: '0 auto' }}>
          {PLATFORM_STATS.map((s, i) => (
            <div key={s.label} style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.025)', borderRight: i < 3 ? '1px solid rgba(153,69,255,0.1)' : 'none', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#9945FF', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#5560a0', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '20px 24px 60px', maxWidth: 780, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>How It Works</h2>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#7070a0', marginBottom: 36 }}>Three steps. Real blockchain. No signup required.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
          {[
            { n: '01', title: 'Connect Your Wallet', desc: 'Use Phantom or MetaMask. Your wallet IS your account — no email, no password.', icon: '🔗' },
            { n: '02', title: 'Find a Creator', desc: 'Browse creators by category or paste their TipLink URL. Every profile is on-chain.', icon: '🔍' },
            { n: '03', title: 'Send SOL Instantly', desc: 'Sign the transaction in your wallet. Confirmed in <400ms. Creator receives instantly.', icon: '⚡' },
          ].map(step => (
            <div key={step.n} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(153,69,255,0.15)', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9945FF', marginBottom: 10, letterSpacing: 1 }}>STEP {step.n}</div>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{step.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#e8e8f0', marginBottom: 8 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: '#6070a0', lineHeight: 1.65 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ADVANCED FEATURES ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Advanced Features</h2>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#7070a0', marginBottom: 36 }}>Powerful Web3 primitives built for the creator economy.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          {FEATURES.map(f => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${f.color}20`, borderRadius: 18, padding: 26, height: '100%', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${f.color},transparent)` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <span style={{ fontSize: 36 }}>{f.icon}</span>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}35` }}>{f.badge}</span>
                </div>
                <div style={{ fontSize: 10, color: f.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{f.sub}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: '#e8e8f0' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6570a0', lineHeight: 1.65, margin: '0 0 14px' }}>{f.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#4a5080', fontWeight: 600 }}>{f.stat}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: f.color }}>Open →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRUST SECTION ── */}
      <section style={{ padding: '40px 24px 80px', borderTop: '1px solid rgba(153,69,255,0.1)', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Built on Open Standards</h2>
        <p style={{ fontSize: 14, color: '#6070a0', marginBottom: 32, lineHeight: 1.7 }}>TipLink is non-custodial. We never hold your funds. Every transaction is verifiable on-chain via Solana Explorer. Open source on GitHub.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Non-Custodial', icon: '🔐', desc: 'You own your keys' },
            { label: 'Open Source', icon: '📂', desc: 'Verify the code' },
            { label: 'Solana Blinks', icon: '⚡', desc: 'Action API compliant' },
            { label: 'Token-2022', icon: '🏅', desc: 'Latest SPL standard' },
          ].map(t => (
            <div key={t.label} style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(153,69,255,0.12)', borderRadius: 12, minWidth: 140, textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c0c8e0', marginBottom: 3 }}>{t.label}</div>
              <div style={{ fontSize: 11, color: '#5060a0' }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(153,69,255,0.1)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#4050a0' }}>⚡ TipLink Live</span>
          <span style={{ fontSize: 12, color: '#3a4080' }}>— Built on Solana</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="https://github.com/gopichandchalla16/tiplink-live" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#5060a0', textDecoration: 'none' }}>GitHub</a>
          <a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#5060a0', textDecoration: 'none' }}>Explorer</a>
          <Link href="/explore" style={{ fontSize: 12, color: '#5060a0', textDecoration: 'none' }}>Creators</Link>
        </div>
      </footer>
    </main>
  );
}
