'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap, ArrowLeft, Copy, CheckCircle,
  Star, Shield, RefreshCw, Share2, Users, ExternalLink, Heart, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Creator } from '@/lib/storage';

type Token = 'SOL' | 'USDC';

interface TipResult {
  txHash: string;
  thankYouMessage: string;
  amount: number;
  token: Token;
}

interface TipRecord {
  creatorUsername: string;
  tipperWallet: string;
  amount: number;
  token: string;
  thankYouMessage: string;
  txSignature: string;
  timestamp: number;
  message?: string;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const CONFETTI_DATA = [
  { left: '5%', delay: '0s', dur: '2.8s', size: '8px', color: '#9945FF', radius: '50%' },
  { left: '12%', delay: '0.2s', dur: '3.1s', size: '6px', color: '#00F0FF', radius: '2px' },
  { left: '20%', delay: '0.05s', dur: '2.6s', size: '10px', color: '#22C55E', radius: '50%' },
  { left: '28%', delay: '0.4s', dur: '3.4s', size: '7px', color: '#FFD700', radius: '2px' },
  { left: '35%', delay: '0.15s', dur: '2.9s', size: '9px', color: '#FF6B6B', radius: '50%' },
  { left: '43%', delay: '0.6s', dur: '3.2s', size: '6px', color: '#9945FF', radius: '2px' },
  { left: '50%', delay: '0.1s', dur: '2.7s', size: '8px', color: '#00F0FF', radius: '50%' },
  { left: '58%', delay: '0.35s', dur: '3.0s', size: '11px', color: '#22C55E', radius: '2px' },
  { left: '65%', delay: '0.55s', dur: '3.3s', size: '7px', color: '#FFD700', radius: '50%' },
  { left: '72%', delay: '0.25s', dur: '2.8s', size: '9px', color: '#FF6B6B', radius: '2px' },
  { left: '80%', delay: '0.45s', dur: '3.1s', size: '8px', color: '#9945FF', radius: '50%' },
  { left: '88%', delay: '0.3s', dur: '2.9s', size: '6px', color: '#00F0FF', radius: '2px' },
  { left: '15%', delay: '0.7s', dur: '3.5s', size: '10px', color: '#22C55E', radius: '50%' },
  { left: '40%', delay: '0.8s', dur: '2.6s', size: '7px', color: '#FFD700', radius: '2px' },
  { left: '60%', delay: '0.9s', dur: '3.2s', size: '8px', color: '#FF6B6B', radius: '50%' },
  { left: '75%', delay: '1.0s', dur: '2.7s', size: '6px', color: '#9945FF', radius: '2px' },
  { left: '90%', delay: '0.65s', dur: '3.0s', size: '9px', color: '#00F0FF', radius: '50%' },
  { left: '3%', delay: '0.85s', dur: '3.3s', size: '7px', color: '#22C55E', radius: '2px' },
  { left: '55%', delay: '0.95s', dur: '2.9s', size: '11px', color: '#FFD700', radius: '50%' },
  { left: '95%', delay: '0.5s', dur: '3.1s', size: '8px', color: '#FF6B6B', radius: '2px' },
];

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {CONFETTI_DATA.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.left, top: '-20px',
          width: p.size, height: p.size,
          background: p.color, borderRadius: p.radius,
          animation: `confetti-fall ${p.dur} ${p.delay} ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

const MODAL_CONFETTI = [
  { left: '5%', delay: 0, color: '#9945FF', rotZ: 45 },
  { left: '15%', delay: 0.1, color: '#00F0FF', rotZ: 120 },
  { left: '25%', delay: 0.05, color: '#22C55E', rotZ: 200 },
  { left: '35%', delay: 0.2, color: '#FFD700', rotZ: 80 },
  { left: '45%', delay: 0.15, color: '#FF6B6B', rotZ: 160 },
  { left: '55%', delay: 0.25, color: '#9945FF', rotZ: 300 },
  { left: '65%', delay: 0.08, color: '#00F0FF', rotZ: 240 },
  { left: '75%', delay: 0.3, color: '#22C55E', rotZ: 180 },
  { left: '85%', delay: 0.18, color: '#FFD700', rotZ: 270 },
  { left: '93%', delay: 0.12, color: '#FF6B6B', rotZ: 330 },
];

function isMockTx(sig: string) {
  return !sig || sig.startsWith('mock_') || sig.length < 32;
}

function TipSuccessModal({
  isOpen, onClose, amount, token, thankYouMessage, txSignature, creatorName,
}: {
  isOpen: boolean; onClose: () => void; amount: number; token: Token;
  thankYouMessage: string; txSignature: string; creatorName: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
          />
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {MODAL_CONFETTI.map((p, i) => (
              <motion.div key={i}
                initial={{ y: -20, opacity: 1, rotateZ: 0 }}
                animate={{ y: '100vh', opacity: 0, rotateZ: p.rotZ }}
                transition={{ duration: 2.5 + p.delay, ease: 'easeIn', delay: p.delay }}
                style={{ position: 'absolute', left: p.left, top: 0, width: 8, height: 8,
                  background: p.color, borderRadius: i % 2 === 0 ? '50%' : '2px' }}
              />
            ))}
          </div>
          <motion.div key="modal"
            initial={{ scale: 0.85, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 51, width: '90vw', maxWidth: 440 }}
          >
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{
              background: 'linear-gradient(145deg, #0f0f1a 0%, #08080f 100%)',
              border: '1px solid rgba(153,69,255,0.4)',
              boxShadow: '0 0 100px rgba(153,69,255,0.3), 0 40px 80px rgba(0,0,0,0.7)',
            }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #9945FF, transparent)' }} />
              <button onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10 text-gray-500 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
              <motion.div
                initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', damping: 12, stiffness: 200 }}
                className="flex items-center justify-center mb-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                    background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.5)',
                    boxShadow: '0 0 50px rgba(34,197,94,0.3)',
                  }}>
                    <CheckCircle className="w-10 h-10" style={{ color: '#22C55E' }} />
                  </div>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full" style={{ border: '2px dashed rgba(34,197,94,0.3)' }}
                  />
                </div>
              </motion.div>
              <h2 className="text-3xl font-extrabold text-white text-center mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Tip Sent! 🚀</h2>
              <p className="text-gray-400 text-sm text-center mb-6">
                You sent{' '}
                <span className="font-bold text-lg" style={{ color: token === 'SOL' ? '#9945FF' : '#22C55E' }}>
                  {token === 'SOL' ? '◎' : '$'}{amount} {token}
                </span>{' '}to <span className="text-white font-semibold">{creatorName}</span>
              </p>
              <div className="rounded-2xl p-4 mb-5" style={{
                background: 'linear-gradient(135deg, rgba(153,69,255,0.08), rgba(0,240,255,0.05))',
                border: '1px solid rgba(153,69,255,0.2)',
              }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#9945FF' }}>✨ Message from {creatorName}</p>
                <p className="text-white text-sm leading-relaxed">&ldquo;{thankYouMessage}&rdquo;</p>
              </div>
              {/* Only show explorer link for real on-chain transactions */}
              {!isMockTx(txSignature) && (
                <a href={`https://explorer.solana.com/tx/${txSignature}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold mb-4 transition-all hover:opacity-80"
                  style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', color: '#00F0FF' }}
                >
                  <ExternalLink className="w-4 h-4" /> View on Solana Explorer
                </a>
              )}
              {isMockTx(txSignature) && (
                <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm mb-4"
                  style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.2)', color: '#FFC107' }}
                >
                  ⚠️ Connect Phantom to send real on-chain transactions
                </div>
              )}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-base"
                style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', boxShadow: '0 0 30px rgba(153,69,255,0.5)' }}
              >
                Done ✓
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SupporterWall({ username }: { username: string }) {
  const [tips, setTips] = useState<TipRecord[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!username) return;
    fetch(`/api/tips/${username}`)
      .then(r => r.json())
      .then((d: TipRecord[]) => setTips(Array.isArray(d) ? d : []))
      .catch(() => setTips([]))
      .finally(() => setLoading(false));
  }, [username]);
  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl shimmer" />)}</div>;
  if (!tips.length) return (
    <div className="flex flex-col items-center py-14">
      <motion.div animate={{ scale: [1,1.1,1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-5xl mb-4">🌟</motion.div>
      <p className="text-white font-bold text-lg mb-1">Be the first to tip!</p>
      <p className="text-gray-500 text-sm">Your wallet will appear here</p>
    </div>
  );
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-4 h-4" style={{ color: '#FF6B6B' }} />
        <span className="text-sm font-bold text-white">{tips.length} Supporter{tips.length !== 1 ? 's' : ''}</span>
      </div>
      {tips.map((tip, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between gap-3 p-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.4), rgba(0,240,255,0.3))' }}>
              {(tip.tipperWallet[0] ?? '?').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold font-mono truncate">{tip.tipperWallet.slice(0,6)}…{tip.tipperWallet.slice(-4)}</p>
              {tip.message && <p className="text-gray-500 text-xs truncate">&ldquo;{tip.message}&rdquo;</p>}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-bold" style={{ color: tip.token === 'SOL' ? '#9945FF' : '#22C55E' }}>
              {tip.token === 'SOL' ? '◎' : '$'}{tip.amount} {tip.token}
            </p>
            <p className="text-gray-600 text-[10px]">{timeAgo(tip.timestamp)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function TipPage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? '';

  const [mounted, setMounted] = useState(false);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [token, setToken] = useState<Token>('SOL');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<TipResult | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [tipError, setTipError] = useState('');
  const [activeTab, setActiveTab] = useState<'tip' | 'supporters'>('tip');
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!username) return;
    fetch(`/api/creators/${username}`)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then((d: Creator) => {
        if (d && d.username) setCreator(d);
        else setPageError('Creator not found');
      })
      .catch(() => setPageError('Creator not found'))
      .finally(() => setLoading(false));
  }, [username]);

  const SOL_PRESETS = [0.01, 0.1, 0.5, 1];
  const USDC_PRESETS = [1, 5, 10, 25];
  const presets = token === 'SOL' ? SOL_PRESETS : USDC_PRESETS;
  const amount = customAmount ? parseFloat(customAmount) : selectedPreset !== null ? presets[selectedPreset] : 0;

  const connectWallet = async () => {
    setConnectingWallet(true);
    setTipError('');
    try {
      const { solana } = window as unknown as {
        solana?: { connect: () => Promise<{ publicKey: { toString: () => string } }>; isPhantom: boolean };
      };
      if (!solana?.isPhantom) { window.open('https://phantom.app/', '_blank'); return; }
      const resp = await solana.connect();
      setWalletAddress(resp.publicKey.toString());
      setWalletConnected(true);
    } catch {
      setTipError('Wallet connection cancelled.');
    } finally {
      setConnectingWallet(false);
    }
  };

  const sendTip = async () => {
    if (!walletConnected) { connectWallet(); return; }
    if (!amount || amount <= 0) { setTipError('Enter a valid amount.'); return; }
    if (!creator) return;
    setTipError('');
    setSending(true);
    try {
      // Build the Solana transaction via Blinks API
      const blinkRes = await fetch(`/api/actions/tip/${username}?amount=${amount}&token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: walletAddress }),
      });
      if (!blinkRes.ok) throw new Error('Failed to build transaction');
      const blinkData = await blinkRes.json() as { transaction?: string; error?: string };
      if (blinkData.error) throw new Error(blinkData.error);

      let txSignature = `mock_${Date.now()}`;

      if (blinkData.transaction) {
        const { solana } = window as unknown as {
          solana?: {
            signAndSendTransaction: (tx: unknown, opts?: unknown) => Promise<{ signature: string }>;
          };
        };
        if (solana) {
          // The Blinks API returns a legacy Transaction (not VersionedTransaction)
          // Use @solana/web3.js Transaction.from() to deserialize it
          const { Transaction } = await import('@solana/web3.js');
          const txBytes = Buffer.from(blinkData.transaction, 'base64');
          const tx = Transaction.from(txBytes);
          const { signature } = await solana.signAndSendTransaction(tx, { commitment: 'confirmed' });
          txSignature = signature;
        }
      }

      // Record the tip and get AI thank-you message
      const recordRes = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorUsername: username,
          tipperWallet: walletAddress,
          amount,
          token,
          txSignature,
          message,
        }),
      });
      if (!recordRes.ok) throw new Error('Failed to record tip');
      const recordData = await recordRes.json() as { thankYouMessage?: string };

      setResult({
        txHash: txSignature,
        thankYouMessage: recordData.thankYouMessage ?? `Thank you so much for the ${amount} ${token} tip! 🙏`,
        amount,
        token,
      });
      setShowSuccessModal(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 4500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      setTipError(
        msg.includes('rejected') || msg.includes('User rejected')
          ? 'Transaction rejected by wallet.'
          : msg
      );
    } finally {
      setSending(false);
    }
  };

  const resetTip = () => {
    setResult(null);
    setShowSuccessModal(false);
    setCustomAmount('');
    setSelectedPreset(1);
    setMessage('');
    setTipError('');
  };

  const copyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted || loading) return (
    <div className="min-h-screen grid-bg flex items-center justify-center" style={{ background: '#080810' }}>
      <div className="w-full max-w-sm mx-auto p-6 space-y-4">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-full animate-spin-slow"
            style={{ border: '3px solid rgba(153,69,255,0.2)', borderTopColor: '#9945FF' }} />
        </div>
        {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl shimmer" />)}
      </div>
    </div>
  );

  if (pageError || !creator) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080810' }}>
      <div className="text-center px-6">
        <div className="text-7xl mb-6">◎</div>
        <h1 className="text-3xl font-extrabold text-white mb-3">Creator not found</h1>
        <p className="text-gray-400 mb-8">@{username} hasn&apos;t created their TipLink yet.</p>
        <Link href="/create" className="btn-primary px-8 py-3.5 inline-flex items-center gap-2 mr-3">
          <Zap className="w-4 h-4" /> Create yours
        </Link>
        <Link href="/" className="btn-secondary px-8 py-3.5 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen grid-bg" style={{ background: '#080810' }}>
      <Confetti active={confetti} />

      {result && (
        <TipSuccessModal
          isOpen={showSuccessModal}
          creatorName={creator.name}
          amount={result.amount}
          token={result.token}
          thankYouMessage={result.thankYouMessage}
          txSignature={result.txHash}
          onClose={resetTip}
        />
      )}

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div style={{ position: 'absolute', top: -200, left: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(153,69,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -200, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,240,255,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', background: 'rgba(8,8,16,0.7)' }}
      >
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-bold">TipLink <span style={{ color: '#9945FF' }}>Live</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#22C55E' : '#9B9B9B' }}
          >
            {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Share'}
          </button>
          {walletConnected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-mono">{walletAddress.slice(0,4)}…{walletAddress.slice(-4)}</span>
            </div>
          ) : (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={connectWallet} disabled={connectingWallet}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', boxShadow: '0 0 20px rgba(153,69,255,0.4)' }}
            >
              {connectingWallet ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wallet className="w-3.5 h-3.5" />}
              {connectingWallet ? 'Connecting…' : 'Connect'}
            </motion.button>
          )}
        </div>
      </nav>

      <main className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-16">
        {/* Creator Profile Card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="relative rounded-3xl p-6 mb-4 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(15,15,26,0.98), rgba(10,10,20,0.99))',
            border: '1px solid rgba(153,69,255,0.25)',
            boxShadow: '0 0 80px rgba(153,69,255,0.1), 0 24px 60px rgba(0,0,0,0.6)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #9945FF80, transparent)' }} />
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{ background: 'radial-gradient(circle at top right, rgba(153,69,255,0.08), transparent 70%)' }} />

          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #9945FF, #00F0FF)', padding: 2, borderRadius: 16, boxShadow: '0 0 30px rgba(153,69,255,0.5)' }}>
                <div className="w-full h-full rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center" style={{ borderRadius: 14 }}>
                  {creator.avatarUrl ? (
                    <Image src={creator.avatarUrl} alt={creator.name} width={68} height={68} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-extrabold text-white"
                      style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', width: 68, height: 68 }}>
                      {creator.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', boxShadow: '0 0 10px rgba(153,69,255,0.7)' }}>
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-extrabold text-white">{creator.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>✓ Verified</span>
              </div>
              <p className="text-sm font-medium mb-1.5" style={{ color: '#9945FF' }}>@{creator.username}</p>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{creator.bio}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Total Earned', value: `◎ ${(creator.totalTips ?? 0).toFixed(2)}`, icon: '💎', color: '#9945FF' },
              { label: 'Supporters', value: String(creator.tipCount ?? 0), icon: '🫶', color: '#FF6B6B' },
              { label: 'Network', value: 'Solana', icon: '⚡', color: '#00F0FF' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="rounded-2xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-lg mb-1">{icon}</div>
                <div className="font-extrabold text-sm" style={{ color }}>{value}</div>
                <div className="text-gray-600 text-[10px] mt-0.5 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex gap-1 p-1 rounded-2xl mb-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {([{ key: 'tip', label: '⚡ Send Tip' }, { key: 'supporters', label: '🫶 Supporters' }] as const).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={activeTab === tab.key
                ? { background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', color: '#fff', boxShadow: '0 0 20px rgba(153,69,255,0.4)' }
                : { color: '#555' }}
            >{tab.label}</button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'tip' ? (
            <motion.div key="tip" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
              <div className="relative rounded-3xl p-6 overflow-hidden" style={{
                background: 'linear-gradient(145deg, rgba(15,15,26,0.98), rgba(10,10,20,0.99))',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(153,69,255,0.4), transparent)' }} />

                {/* Token toggle */}
                <div className="flex gap-1.5 mb-5 p-1 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {(['SOL', 'USDC'] as Token[]).map((t) => (
                    <button key={t} onClick={() => { setToken(t); setSelectedPreset(1); setCustomAmount(''); }}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                      style={token === t
                        ? { background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', color: '#fff', boxShadow: '0 0 20px rgba(153,69,255,0.4)' }
                        : { color: '#555' }}
                    >
                      {t === 'SOL' ? '◎' : '$'} {t}
                    </button>
                  ))}
                </div>

                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Choose Amount</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {presets.map((p, i) => (
                    <motion.button key={p} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={() => { setSelectedPreset(i); setCustomAmount(''); }}
                      className="relative py-3 rounded-2xl font-bold text-sm transition-all duration-200"
                      style={selectedPreset === i && !customAmount
                        ? { background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', color: '#fff', boxShadow: '0 0 24px rgba(153,69,255,0.5)' }
                        : { background: 'rgba(153,69,255,0.06)', border: '1px solid rgba(153,69,255,0.15)', color: '#888' }}
                    >
                      {token === 'SOL' ? `◎${p}` : `$${p}`}
                    </motion.button>
                  ))}
                </div>

                <div className="relative mb-4">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: '#555' }}>
                    {token === 'SOL' ? '◎' : '$'}
                  </div>
                  <input type="number" placeholder="Custom amount" value={customAmount}
                    onChange={e => { setCustomAmount(e.target.value); setSelectedPreset(null); }}
                    min="0" step="any"
                    className="w-full pl-9 pr-4 py-3.5 rounded-2xl text-white placeholder-gray-700 text-sm font-semibold focus:outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: customAmount ? '1px solid rgba(153,69,255,0.5)' : '1px solid rgba(255,255,255,0.07)', boxShadow: customAmount ? '0 0 20px rgba(153,69,255,0.15)' : 'none' }}
                  />
                </div>

                <textarea placeholder="Leave a message (optional, 120 chars max)" value={message}
                  onChange={e => setMessage(e.target.value.slice(0, 120))} rows={2}
                  className="w-full px-4 py-3 rounded-2xl text-white placeholder-gray-700 text-sm resize-none focus:outline-none transition-all mb-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                />
                <p className="text-gray-700 text-xs text-right mb-4">{message.length}/120</p>

                {tipError && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl mb-4"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
                  >
                    <span className="text-red-400 text-sm font-medium">⚠️ {tipError}</span>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(153,69,255,0.7), 0 8px 32px rgba(153,69,255,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={sendTip}
                  disabled={sending || (!walletConnected && connectingWallet)}
                  className="w-full py-4 rounded-2xl font-extrabold text-lg text-white transition-all relative overflow-hidden"
                  style={{
                    background: sending ? 'rgba(153,69,255,0.4)' : 'linear-gradient(135deg, #9945FF, #7B2FFF)',
                    boxShadow: sending ? 'none' : '0 0 40px rgba(153,69,255,0.55), 0 8px 32px rgba(153,69,255,0.3)',
                  }}
                >
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 2.5s ease infinite' }} />
                  <span className="relative flex items-center justify-center gap-2.5">
                    {sending ? (
                      <><RefreshCw className="w-5 h-5 animate-spin" /> Sending on Solana…</>
                    ) : !walletConnected ? (
                      <><Wallet className="w-5 h-5" /> Connect Phantom to Tip</>
                    ) : (
                      <><Zap className="w-5 h-5" /> Send {amount > 0 ? `${token === 'SOL' ? '◎' : '$'}${amount}` : ''} {token}</>
                    )}
                  </span>
                </motion.button>

                <div className="flex items-center justify-center gap-5 mt-4">
                  {([{ icon: Shield, label: 'Non-custodial' }, { icon: Star, label: 'Zero fees' }, { icon: Zap, label: 'Sub-second' }] as const).map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-[11px]" style={{ color: '#444' }}>
                      <Icon className="w-3 h-3" />{label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="supporters" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              className="relative rounded-3xl p-6" style={{
                background: 'linear-gradient(145deg, rgba(15,15,26,0.98), rgba(10,10,20,0.99))',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <SupporterWall username={username} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-5 flex items-center justify-center gap-3 flex-wrap"
        >
          <a href={`/api/actions/tip/${username}`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.2)', color: '#9945FF' }}
          ><Share2 className="w-3 h-3" /> Solana Blink</a>
          <a href={`https://explorer.solana.com/address/${creator.walletAddress}`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.15)', color: '#00F0FF' }}
          ><ExternalLink className="w-3 h-3" /> On-chain</a>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#444' }}>
            <Users className="w-3 h-3" /> Powered by Solana Blinks
          </div>
        </motion.div>
      </main>
    </div>
  );
}
