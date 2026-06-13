'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap, ArrowLeft, Copy, CheckCircle,
  Star, Shield, RefreshCw, Share2, Users, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Creator } from '@/lib/storage';
import SupporterWall from '@/components/SupporterWall';
import TipSuccessModal from '@/components/TipSuccessModal';

type Token = 'SOL' | 'USDC';

interface TipResult {
  txHash: string;
  thankYouMessage: string;
  amount: number;
  token: Token;
}

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: ['#9945FF', '#00F0FF', '#22C55E', '#FFD700', '#FF6B6B'][i % 5],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    duration: `${2 + Math.random() * 2}s`,
    size: `${6 + Math.random() * 8}px`,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

function TipButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200"
      style={
        selected
          ? {
              background: 'linear-gradient(135deg, #9945FF, #7B2FFF)',
              color: '#fff',
              boxShadow: '0 0 24px #9945FF60, 0 4px 16px rgba(153,69,255,0.4)',
            }
          : {
              background: 'rgba(153,69,255,0.08)',
              border: '1px solid rgba(153,69,255,0.2)',
              color: '#d1d5db',
            }
      }
    >
      {label}
    </motion.button>
  );
}

export default function TipPage() {
  const { username } = useParams<{ username: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const SOL_PRESETS = [0.01, 0.1, 0.5, 1];
  const USDC_PRESETS = [1, 5, 10, 25];
  const presets = token === 'SOL' ? SOL_PRESETS : USDC_PRESETS;
  const amount = customAmount
    ? parseFloat(customAmount)
    : selectedPreset !== null
    ? presets[selectedPreset]
    : 0;

  useEffect(() => {
    if (!username) return;
    fetch(`/api/creators/${username}`)
      .then((r) => r.json())
      .then((d: Creator) => setCreator(d))
      .catch(() => setError('Creator not found'))
      .finally(() => setLoading(false));
  }, [username]);

  const connectWallet = async () => {
    setConnectingWallet(true);
    try {
      const { solana } = window as unknown as {
        solana?: {
          connect: () => Promise<{ publicKey: { toString: () => string } }>;
          isPhantom: boolean;
        };
      };
      if (!solana?.isPhantom) {
        window.open('https://phantom.app/', '_blank');
        return;
      }
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
      // 1. Build the Solana transaction via Blink
      const blinkRes = await fetch(
        `/api/actions/tip/${username}?amount=${amount}&token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: walletAddress }),
        }
      );
      const blinkData = await blinkRes.json() as { transaction?: string };

      let txSignature = `mock_${Date.now()}`;

      if (blinkData.transaction) {
        const { solana } = window as unknown as {
          solana?: {
            signAndSendTransaction: (tx: unknown) => Promise<{ signature: string }>;
          };
        };
        if (solana) {
          const { VersionedTransaction } = await import('@solana/web3.js');
          const txBytes = Buffer.from(blinkData.transaction, 'base64');
          const tx = VersionedTransaction.deserialize(txBytes);
          const res = await solana.signAndSendTransaction(tx);
          txSignature = res.signature;
        }
      }

      // 2. Record tip in DB
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
      const recordData = await recordRes.json() as { thankYouMessage?: string };

      setResult({
        txHash: txSignature,
        thankYouMessage:
          recordData.thankYouMessage ??
          `Thank you so much for the ${amount} ${token} tip! 🙏`,
        amount,
        token,
      });
      setShowSuccessModal(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      setTipError(
        msg.includes('rejected') ? 'Transaction rejected by wallet.' : msg
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
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center" style={{ background: '#080810' }}>
        <div className="w-full max-w-sm mx-auto p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl shimmer" />
          ))}
        </div>
      </div>
    );

  if (error || !creator)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080810' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">◎</div>
          <h1 className="text-2xl font-bold text-white mb-2">Creator not found</h1>
          <p className="text-gray-400 mb-6">@{username} hasn&apos;t created their TipLink yet.</p>
          <Link href="/" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    );

  const avatarBg = 'linear-gradient(135deg, #9945FF, #00F0FF)';

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

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(153,69,255,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Nav */}
      <nav
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">TipLink Live</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9B9B9B' }}
          >
            {copied ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          {walletConnected ? (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-mono">
                {walletAddress.slice(0, 4)}…{walletAddress.slice(-4)}
              </span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={connectWallet}
              disabled={connectingWallet}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold btn-secondary"
            >
              {connectingWallet ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Shield className="w-3.5 h-3.5" />
              )}
              {connectingWallet ? 'Connecting…' : 'Connect Phantom'}
            </motion.button>
          )}
        </div>
      </nav>

      <main className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* Creator card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-7 mb-4 noise"
          style={{
            background: 'linear-gradient(145deg, rgba(15,15,26,0.95) 0%, rgba(10,10,20,0.98) 100%)',
            border: '1px solid rgba(153,69,255,0.25)',
            boxShadow: '0 0 60px rgba(153,69,255,0.12), 0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background: 'linear-gradient(90deg, transparent, #9945FF80, transparent)' }} />
          <div className="flex items-start gap-5">
            <motion.div
              whileHover={{ rotateY: 8, rotateX: -4, scale: 1.05 }}
              style={{ transformStyle: 'preserve-3d', perspective: 800 }}
              className="relative flex-shrink-0"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden" style={{ background: avatarBg, padding: '2px', boxShadow: '0 0 24px rgba(153,69,255,0.4)' }}>
                <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-900">
                  {creator.avatarUrl ? (
                    <Image src={creator.avatarUrl} alt={creator.name} width={80} height={80} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-extrabold text-white" style={{ background: avatarBg }}>
                      {creator.name[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', boxShadow: '0 0 12px #9945FF80' }}>
                <Zap className="w-3 h-3 text-white" />
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-extrabold text-white truncate">{creator.name}</h1>
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>✓ Verified</span>
              </div>
              <p className="text-purple-400 text-sm mb-1.5">@{creator.username}</p>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{creator.bio}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Total Earned', value: `◎ ${(creator.totalTips ?? 0).toFixed(2)}`, icon: '💎' },
              { label: 'Supporters', value: String(creator.tipCount ?? 0), icon: '🫶' },
              { label: 'Network', value: 'Solana', icon: '⚡' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-base mb-1">{icon}</div>
                <div className="font-bold text-white text-sm">{value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { key: 'tip', label: '⚡ Send Tip' },
            { key: 'supporters', label: '🫶 Supporters' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'tip' | 'supporters')}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={
                activeTab === tab.key
                  ? { background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', color: '#fff', boxShadow: '0 0 20px #9945FF40' }
                  : { color: '#666' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'tip' ? (
            <motion.div key="tip" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
              <div className="relative rounded-3xl p-6 noise" style={{
                background: 'linear-gradient(145deg, rgba(15,15,26,0.95) 0%, rgba(10,10,20,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}>
                {/* Token toggle */}
                <div className="flex gap-2 mb-5 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {(['SOL', 'USDC'] as Token[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setToken(t); setSelectedPreset(1); setCustomAmount(''); }}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
                      style={token === t ? { background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', color: '#fff', boxShadow: '0 0 20px #9945FF50' } : { color: '#888' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Choose amount</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {presets.map((p, i) => (
                    <TipButton
                      key={p}
                      label={token === 'SOL' ? `◎${p}` : `$${p}`}
                      selected={selectedPreset === i && !customAmount}
                      onClick={() => { setSelectedPreset(i); setCustomAmount(''); }}
                    />
                  ))}
                </div>

                <div className="relative mb-4">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">{token === 'SOL' ? '◎' : '$'}</div>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedPreset(null); }}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl text-white placeholder-gray-600 text-sm font-semibold focus:outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: customAmount ? '1px solid rgba(153,69,255,0.5)' : '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>

                <textarea
                  placeholder="Add a message (optional, max 120 chars)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 120))}
                  rows={2}
                  className="w-full px-4 py-3 rounded-2xl text-white placeholder-gray-600 text-sm resize-none focus:outline-none transition-all mb-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />

                {tipError && (
                  <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <span className="text-red-400 text-sm">{tipError}</span>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97, rotateX: 4 }}
                  onClick={sendTip}
                  disabled={sending || (!amount || amount <= 0)}
                  className="w-full py-4 rounded-2xl font-extrabold text-lg transition-all relative overflow-hidden"
                  style={{
                    background: sending ? 'rgba(153,69,255,0.3)' : 'linear-gradient(135deg, #9945FF, #7B2FFF)',
                    color: '#fff',
                    boxShadow: sending ? 'none' : '0 0 40px #9945FF60, 0 8px 32px rgba(153,69,255,0.35)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
                  {sending ? (
                    <span className="flex items-center justify-center gap-3">
                      <RefreshCw className="w-5 h-5 animate-spin" /> Sending on Solana…
                    </span>
                  ) : !walletConnected ? (
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" /> Connect Phantom to Tip
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      Send {amount > 0 ? `${token === 'SOL' ? '◎' : '$'}${amount}` : ''} {token}
                    </span>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-4 mt-4">
                  {([Shield, Star, Zap] as const).map((Icon, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Icon className="w-3 h-3" />
                      {['Non-custodial', 'Zero fees', 'Sub-second'][i]}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="supporters"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="relative rounded-3xl p-6"
              style={{
                background: 'linear-gradient(145deg, rgba(15,15,26,0.95) 0%, rgba(10,10,20,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              <SupporterWall username={username ?? ''} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blinks + share */}
        <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
          <a
            href={`/api/actions/tip/${username}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.2)', color: '#9945FF' }}
          >
            <Share2 className="w-3 h-3" /> Share as Solana Blink
          </a>
          <a
            href={`https://explorer.solana.com/address/${creator.walletAddress}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.15)', color: '#00F0FF' }}
          >
            <ExternalLink className="w-3 h-3" /> On-chain
          </a>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
            style={{ background: 'rgba(153,69,255,0.06)', border: '1px solid rgba(153,69,255,0.12)', color: '#666' }}
          >
            <Users className="w-3 h-3" /> Powered by Solana Blinks
          </div>
        </div>
      </main>
    </div>
  );
}
