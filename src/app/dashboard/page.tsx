'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Zap,
  Globe,
  ArrowUpRight,
  Shield,
  Copy,
  CheckCircle,
  TrendingUp,
  Star,
  RefreshCw,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import type { Creator } from '@/lib/storage';

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

/* ── Stat Card ──────────────────────────────────────────── */
function StatCard({
  label,
  value,
  sub,
  accent,
  Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-5 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
        >
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <TrendingUp className="w-4 h-4" style={{ color: accent, opacity: 0.5 }} />
      </div>
      <div
        className="text-2xl font-extrabold mb-1 gradient-text"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {value}
      </div>
      <div className="text-gray-500 text-xs">{label}</div>
      {sub && <div className="text-gray-600 text-xs mt-0.5">{sub}</div>}
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
export default function DashboardPage() {
  const [wallet, setWallet] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [tips, setTips] = useState<TipRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState<'overview' | 'tips'>('overview');
  const [copied, setCopied] = useState(false);
  const [tipPage, setTipPage] = useState(0);
  const PAGE_SIZE = 8;

  const connectWallet = async () => {
    setConnecting(true);
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
      setWallet(resp.publicKey.toString());
    } catch {
      /* cancelled */
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet('');
    setCreator(null);
    setTips([]);
  };

  useEffect(() => {
    if (!wallet) return;
    setLoading(true);
    fetch(`/api/tips/by-wallet/${wallet}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.creator) {
          setCreator(d.creator);
          setTips(d.tips ?? []);
        } else {
          setCreator(null);
          setTips([]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wallet]);

  const tipUrl = creator
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://tiplink-live.vercel.app'}/tip/${creator.username}`
    : '';

  const copyUrl = () => {
    if (!tipUrl) return;
    navigator.clipboard.writeText(tipUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const solTips = tips.filter((t) => t.token === 'SOL');
  const usdcTips = tips.filter((t) => t.token === 'USDC');
  const totalSOL = solTips.reduce((s, t) => s + t.amount, 0);
  const totalUSDC = usdcTips.reduce((s, t) => s + t.amount, 0);
  const uniqueWallets = new Set(tips.map((t) => t.tipperWallet)).size;

  const STAT_CARDS = [
    { label: 'Total SOL', value: `◎ ${totalSOL.toFixed(3)}`, sub: `${solTips.length} txns`, accent: '#9945FF', Icon: Zap },
    { label: 'Total USDC', value: `$ ${totalUSDC.toFixed(2)}`, sub: `${usdcTips.length} txns`, accent: '#22C55E', Icon: TrendingUp },
    { label: 'Total Tips', value: String(tips.length), sub: 'all time', accent: '#00F0FF', Icon: ArrowUpRight },
    { label: 'Top Supporters', value: String(uniqueWallets), sub: 'unique wallets', accent: '#FFD700', Icon: Star },
  ];

  const NAV_ITEMS = [
    { key: 'overview', label: 'Overview', Icon: LayoutDashboard },
    { key: 'tips', label: 'Tips', Icon: Zap },
  ];

  const pagedTips = tips.slice(tipPage * PAGE_SIZE, (tipPage + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(tips.length / PAGE_SIZE);

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#080810' }}
    >
      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-56 flex-shrink-0"
        style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)' }}
          >
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span
            className="font-extrabold text-sm text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            TipLink Live
          </span>
        </div>

        <nav className="flex-1 px-3 pt-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key as 'overview' | 'tips')}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl mb-1 text-sm font-semibold transition-all text-left"
              style={
                activeNav === item.key
                  ? {
                      background: 'rgba(153,69,255,0.15)',
                      color: '#9945FF',
                      borderLeft: '2px solid #9945FF',
                    }
                  : { color: '#6B7280' }
              }
            >
              <item.Icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-5 space-y-1">
          <Link
            href="/explore"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5" /> Explore
          </Link>
          {creator && (
            <Link
              href={`/tip/${creator.username}`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> My TipLink
            </Link>
          )}
          {wallet && (
            <button
              onClick={disconnectWallet}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-500 hover:text-red-300 transition-colors w-full text-left"
            >
              <LogOut className="w-3.5 h-3.5" /> Disconnect
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <h1
            className="text-xl font-extrabold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Dashboard
          </h1>
          {wallet ? (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-mono">
                {wallet.slice(0, 4)}…{wallet.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="btn-primary px-4 py-2 text-sm"
            >
              {connecting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Shield className="w-3.5 h-3.5" />
              )}
              {connecting ? 'Connecting…' : 'Connect Phantom'}
            </button>
          )}
        </header>

        <main className="flex-1 px-6 py-8 overflow-auto">

          {/* ── NOT CONNECTED ── */}
          {!wallet && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5 animate-pulse-glow"
                style={{
                  background: 'rgba(153,69,255,0.12)',
                  border: '1px solid rgba(153,69,255,0.3)',
                }}
              >
                <Shield className="w-9 h-9" style={{ color: '#9945FF' }} />
              </div>
              <h2
                className="text-2xl font-extrabold text-white mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Connect your wallet
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Link Phantom to view your creator dashboard
              </p>
              <button onClick={connectWallet} className="btn-primary">
                <Shield className="w-4 h-4" /> Connect Phantom
              </button>
            </motion.div>
          )}

          {/* ── LOADING ── */}
          {wallet && loading && (
            <div className="flex items-center justify-center py-24">
              <RefreshCw
                className="w-8 h-8 animate-spin"
                style={{ color: '#9945FF' }}
              />
            </div>
          )}

          {/* ── NO CREATOR FOUND ── */}
          {wallet && !loading && !creator && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="text-6xl mb-5">◎</div>
              <h2
                className="text-2xl font-extrabold text-white mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                No profile found
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                This wallet doesn&apos;t have a TipLink profile yet.
              </p>
              <Link href="/create" className="btn-primary">
                <Zap className="w-4 h-4" /> Create Your TipLink
              </Link>
            </motion.div>
          )}

          {/* ── DASHBOARD ── */}
          <AnimatePresence>
            {wallet && !loading && creator && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Creator strip */}
                <div
                  className="rounded-2xl p-5 mb-6"
                  style={{
                    background: 'rgba(153,69,255,0.06)',
                    border: '1px solid rgba(153,69,255,0.2)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="font-extrabold text-white text-lg"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          {creator.name}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{
                            background: 'rgba(153,69,255,0.15)',
                            color: '#9945FF',
                          }}
                        >
                          @{creator.username}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{creator.bio}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono text-gray-500 truncate max-w-[120px] hidden sm:block">
                        {tipUrl}
                      </span>
                      <button
                        onClick={copyUrl}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copy link"
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <Link
                        href={`/tip/${creator.username}`}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Open TipLink"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {STAT_CARDS.map((card, i) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <StatCard
                        label={card.label}
                        value={card.value}
                        sub={card.sub}
                        accent={card.accent}
                        Icon={card.Icon}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Tab nav */}
                <div
                  className="flex gap-1 p-1 rounded-2xl mb-6 w-fit"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {[
                    { key: 'overview', label: 'Overview' },
                    { key: 'tips', label: 'All Tips' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveNav(t.key as 'overview' | 'tips')}
                      className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                      style={
                        activeNav === t.key
                          ? {
                              background:
                                'linear-gradient(135deg,#9945FF,#7B2FFF)',
                              color: '#fff',
                            }
                          : { color: '#6B7280' }
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {/* ── OVERVIEW TAB ── */}
                  {activeNav === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      {/* Recent tips */}
                      <div
                        className="rounded-2xl p-5"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <h3
                          className="font-bold text-white mb-4 text-sm"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          Recent Tips
                        </h3>
                        {tips.length === 0 ? (
                          <div className="flex flex-col items-center py-10">
                            <div className="text-3xl mb-2">🌟</div>
                            <p className="text-gray-600 text-sm">
                              No tips yet — share your link!
                            </p>
                          </div>
                        ) : (
                          tips.slice(0, 5).map((t, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between py-3"
                              style={{
                                borderBottom:
                                  i < Math.min(tips.length, 5) - 1
                                    ? '1px solid rgba(255,255,255,0.04)'
                                    : 'none',
                              }}
                            >
                              <div>
                                <div className="text-sm font-semibold text-white">
                                  {t.tipperWallet.slice(0, 6)}…
                                  {t.tipperWallet.slice(-4)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(t.timestamp).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className="font-bold text-sm"
                                  style={{
                                    color:
                                      t.token === 'SOL' ? '#9945FF' : '#22C55E',
                                  }}
                                >
                                  {t.token === 'SOL' ? '◎' : '$'}
                                  {t.amount}
                                </span>
                                {t.txSignature && (
                                  <a
                                    href={`https://explorer.solana.com/tx/${t.txSignature}?cluster=devnet`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <ExternalLink className="w-3 h-3 text-gray-500 hover:text-white" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Profile details */}
                      <div
                        className="rounded-2xl p-5"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <h3
                          className="font-bold text-white mb-4 text-sm"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          Profile Details
                        </h3>
                        {([
                          ['Username', `@${creator.username}`],
                          ['Category', creator.category],
                          ['Personality', creator.personality],
                          [
                            'Wallet',
                            `${creator.walletAddress.slice(0, 8)}…${creator.walletAddress.slice(-4)}`,
                          ],
                          ['Total SOL', `◎ ${creator.totalTips?.toFixed(3) ?? '0.000'}`],
                          ['Tip Count', String(creator.tipCount ?? 0)],
                        ] as [string, string][]).map(([k, v]) => (
                          <div
                            key={k}
                            className="flex items-center justify-between py-2.5"
                            style={{
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                            }}
                          >
                            <span className="text-gray-500 text-sm">{k}</span>
                            <span className="text-white text-sm font-medium">
                              {v}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── TIPS TAB ── */}
                  {activeNav === 'tips' && (
                    <motion.div
                      key="tips"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        {/* Table header */}
                        <div
                          className="grid grid-cols-5 gap-3 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                          }}
                        >
                          <span className="col-span-2">From</span>
                          <span>Amount</span>
                          <span>Date</span>
                          <span>Tx</span>
                        </div>

                        {tips.length === 0 ? (
                          <div className="flex flex-col items-center py-12">
                            <div className="text-3xl mb-2">⚡</div>
                            <p className="text-gray-600 text-sm">
                              No tips yet
                            </p>
                          </div>
                        ) : (
                          pagedTips.map((t, i) => (
                            <div
                              key={i}
                              className="grid grid-cols-5 gap-3 px-4 py-3.5 text-sm items-center hover:bg-white/[0.02] transition-colors"
                              style={{
                                borderBottom:
                                  i < pagedTips.length - 1
                                    ? '1px solid rgba(255,255,255,0.04)'
                                    : 'none',
                              }}
                            >
                              <div className="col-span-2 flex items-center gap-2">
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                  style={{
                                    background:
                                      'linear-gradient(135deg,#9945FF40,#00F0FF30)',
                                  }}
                                >
                                  {t.tipperWallet[0]}
                                </div>
                                <span className="font-mono text-xs text-gray-300">
                                  {t.tipperWallet.slice(0, 6)}…
                                  {t.tipperWallet.slice(-4)}
                                </span>
                              </div>
                              <span
                                className="font-bold"
                                style={{
                                  color:
                                    t.token === 'SOL' ? '#9945FF' : '#22C55E',
                                }}
                              >
                                {t.token === 'SOL' ? '◎' : '$'}{t.amount}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {new Date(t.timestamp).toLocaleDateString()}
                              </span>
                              <span>
                                {t.txSignature ? (
                                  <a
                                    href={`https://explorer.solana.com/tx/${t.txSignature}?cluster=devnet`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-500 hover:text-purple-400 transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                ) : (
                                  <span className="text-gray-700">—</span>
                                )}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <button
                            onClick={() => setTipPage((p) => Math.max(0, p - 1))}
                            disabled={tipPage === 0}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-30 transition-all"
                            style={{
                              background: 'rgba(153,69,255,0.1)',
                              border: '1px solid rgba(153,69,255,0.2)',
                              color: '#9945FF',
                            }}
                          >
                            ← Prev
                          </button>
                          <span className="text-gray-500 text-xs">
                            {tipPage + 1} / {totalPages}
                          </span>
                          <button
                            onClick={() =>
                              setTipPage((p) => Math.min(totalPages - 1, p + 1))
                            }
                            disabled={tipPage >= totalPages - 1}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-30 transition-all"
                            style={{
                              background: 'rgba(153,69,255,0.1)',
                              border: '1px solid rgba(153,69,255,0.2)',
                              color: '#9945FF',
                            }}
                          >
                            Next →
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
