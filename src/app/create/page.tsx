'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, RefreshCw, Zap, Copy, ExternalLink } from 'lucide-react';

const CATEGORIES = ['creator', 'developer', 'artist', 'musician', 'writer', 'gamer'];
const PERSONALITIES = [
  {
    key: 'grateful', emoji: '🙏', label: 'Grateful', desc: 'Warm & heartfelt', color: '#9945FF',
    sample: "Thank you SO much for the tip! Your support genuinely moves me and helps me keep creating. You're amazing! 🙏",
  },
  {
    key: 'hype', emoji: '🔥', label: 'Hype', desc: 'High-energy & excited', color: '#FF6B35',
    sample: 'LFG!! That tip just MADE MY DAY!! We are building together and I am SO HYPE!! 🔥🚀💯',
  },
  {
    key: 'professional', emoji: '💼', label: 'Professional', desc: 'Clean & polished', color: '#00F0FF',
    sample: 'Thank you for your generous support. Your contribution directly funds the work I do. I genuinely appreciate it.',
  },
  {
    key: 'creative', emoji: '🎨', label: 'Creative', desc: 'Poetic & imaginative', color: '#22C55E',
    sample: 'Your tip is like sunlight through glass — it bends into color and fills this work with new possibility. Thank you. ✨',
  },
];

type Step = 1 | 2 | 3 | 4;

// QR canvas rendered client-side using the installed `qrcode` package
function QRCanvas({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!value || !canvasRef.current) return;
    import('qrcode').then((QRCode) => {
      QRCode.default.toCanvas(canvasRef.current!, value, {
        width: 180,
        margin: 2,
        color: { dark: '#9945FF', light: '#FFFFFF' },
      }).catch(() => {});
    }).catch(() => {});
  }, [value]);
  return <canvas ref={canvasRef} style={{ borderRadius: 12 }} />;
}

export default function CreatePage() {
  const [step, setStep] = useState<Step>(1);
  const [walletAddress, setWalletAddress] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [enhancing, setEnhancing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [category, setCategory] = useState('creator');
  const [personality, setPersonality] = useState('grateful');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [tipUrl, setTipUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const { solana } = window as unknown as {
        solana?: { connect: () => Promise<{ publicKey: { toString: () => string } }>; isPhantom: boolean };
      };
      if (!solana?.isPhantom) { window.open('https://phantom.app/', '_blank'); setConnecting(false); return; }
      const resp = await solana.connect();
      setWalletAddress(resp.publicKey.toString());
      setTimeout(() => setStep(2), 500);
    } catch {
      setError('Wallet connection cancelled.');
    } finally {
      setConnecting(false);
    }
  };

  const checkUsername = useCallback(async (val: string) => {
    if (!val || val.length < 3) { setUsernameStatus('idle'); return; }
    setUsernameStatus('checking');
    try {
      const res = await fetch(`/api/creators/${val}`);
      setUsernameStatus(res.ok ? 'taken' : 'available');
    } catch { setUsernameStatus('available'); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => checkUsername(username), 500);
    return () => clearTimeout(t);
  }, [username, checkUsername]);

  const enhanceBio = async () => {
    if (!bio || !displayName) return;
    setEnhancing(true);
    try {
      const res = await fetch('/api/enhance-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, name: displayName }),
      });
      const data = await res.json() as { enhancedBio?: string };
      if (data.enhancedBio) setBio(data.enhancedBio);
    } catch { /* silent */ } finally { setEnhancing(false); }
  };

  const createProfile = async () => {
    setCreating(true); setError('');
    try {
      const res = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.toLowerCase(), name: displayName, bio, avatarUrl, category, personality, walletAddress }),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error ?? 'Failed to create profile'); }
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tiplink-live.vercel.app';
      setTipUrl(`${origin}/tip/${username.toLowerCase()}`);
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally { setCreating(false); }
  };

  const copyUrl = () => {
    if (!tipUrl) return;
    navigator.clipboard.writeText(tipUrl);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const canContinue2 = usernameStatus === 'available' && displayName.trim().length >= 2;

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center px-4 py-12" style={{ background: '#080810' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(153,69,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="flex items-center gap-2 mb-8 relative z-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="rounded-full transition-all duration-300" style={
            step > s ? { width: 8, height: 8, background: '#22C55E' }
            : step === s ? { width: 20, height: 8, background: '#9945FF' }
            : { width: 8, height: 8, background: 'rgba(255,255,255,0.15)' }
          } />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl p-8" style={{ background: 'linear-gradient(145deg, rgba(15,15,26,0.97), rgba(10,10,20,0.99))', border: '1px solid rgba(153,69,255,0.2)' }}>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)' }}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-white text-center mb-2">Connect your wallet</h1>
              <p className="text-gray-400 text-center text-sm mb-8">Link Phantom to create your creator profile. Non-custodial — we never touch your keys.</p>
              <div className="flex justify-center gap-6 mb-8">
                {[{ icon: Shield, label: 'Non-custodial' }, { icon: CheckCircle, label: 'Read-only' }, { icon: Zap, label: 'No fees' }].map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.2)' }}>
                      <b.icon className="w-4 h-4" style={{ color: '#9945FF' }} />
                    </div>
                    <span className="text-xs text-gray-500">{b.label}</span>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
              <button onClick={connectWallet} disabled={connecting} className="btn-primary w-full">
                {connecting ? <><RefreshCw className="w-4 h-4 animate-spin" /> Connecting…</> : <><Shield className="w-4 h-4" /> Connect Phantom Wallet</>}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl p-8" style={{ background: 'linear-gradient(145deg, rgba(15,15,26,0.97), rgba(10,10,20,0.99))', border: '1px solid rgba(153,69,255,0.2)' }}>
              <h1 className="text-2xl font-extrabold text-white mb-1">Create your profile</h1>
              <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)} connected
              </div>
              <div className="mb-4">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5 block">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">@</span>
                  <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="yourname" className="w-full pl-8 pr-10 py-3 rounded-2xl text-white placeholder-gray-600 text-sm font-semibold focus:outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: usernameStatus === 'available' ? '1px solid #22C55E' : usernameStatus === 'taken' ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)' }} />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus === 'checking' && <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />}
                    {usernameStatus === 'available' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {usernameStatus === 'taken' && <span className="text-xs text-red-400 font-bold">Taken</span>}
                  </div>
                </div>
                {usernameStatus === 'available' && <p className="text-green-400 text-xs mt-1">✓ tiplink-live.vercel.app/tip/{username}</p>}
              </div>
              <div className="mb-4">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5 block">Display Name</label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-2xl text-white placeholder-gray-600 text-sm font-semibold focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Bio</label>
                  <button onClick={enhanceBio} disabled={!bio || !displayName || enhancing}
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-all"
                    style={{ color: '#9945FF', background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.2)' }}>
                    {enhancing ? <RefreshCw className="w-3 h-3 animate-spin" /> : '✨'} Enhance with Gemini
                  </button>
                </div>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell your supporters who you are..."
                  className="w-full px-4 py-3 rounded-2xl text-white placeholder-gray-600 text-sm resize-none focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <div className="mb-4">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5 block">Avatar URL (optional)</label>
                <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..."
                  className="w-full px-4 py-3 rounded-2xl text-white placeholder-gray-600 text-sm focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <div className="mb-6">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setCategory(c)} className="px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all"
                      style={category === c ? { background: 'linear-gradient(135deg, #9945FF, #7B2FFF)', color: '#fff', boxShadow: '0 0 16px #9945FF40' } : { background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button onClick={() => setStep(3)} disabled={!canContinue2} className="btn-primary w-full">
                Continue <Zap className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl p-8" style={{ background: 'linear-gradient(145deg, rgba(15,15,26,0.97), rgba(10,10,20,0.99))', border: '1px solid rgba(153,69,255,0.2)' }}>
              <h1 className="text-2xl font-extrabold text-white mb-2">Choose your personality</h1>
              <p className="text-gray-400 text-sm mb-6">Gemini AI writes your thank-you messages in this style.</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {PERSONALITIES.map((p) => (
                  <button key={p.key} onClick={() => setPersonality(p.key)} className="relative rounded-2xl p-4 text-left transition-all"
                    style={personality === p.key ? { background: `${p.color}15`, border: `2px solid ${p.color}60`, boxShadow: `0 0 20px ${p.color}25` } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {personality === p.key && <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: p.color }}><CheckCircle className="w-3 h-3 text-white" /></div>}
                    <div className="text-2xl mb-2">{p.emoji}</div>
                    <div className="font-bold text-white text-sm">{p.label}</div>
                    <div className="text-gray-500 text-xs">{p.desc}</div>
                  </button>
                ))}
              </div>
              <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(153,69,255,0.06)', border: '1px solid rgba(153,69,255,0.2)' }}>
                <p className="text-xs text-gray-400 font-semibold mb-2">SAMPLE THANK-YOU</p>
                <p className="text-gray-300 text-sm italic">{PERSONALITIES.find((p) => p.key === personality)?.sample}</p>
              </div>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button onClick={createProfile} disabled={creating} className="btn-primary w-full">
                {creating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Creating…</> : <><Zap className="w-4 h-4" /> Create My TipLink</>}
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="rounded-3xl p-8 text-center" style={{ background: 'linear-gradient(145deg, rgba(15,15,26,0.97), rgba(10,10,20,0.99))', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid #22C55E' }}>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2">You&apos;re live! 🎉</h1>
              <p className="text-gray-400 text-sm mb-6">Your TipLink is ready to receive tips on Solana.</p>
              {tipUrl && (
                <div className="flex justify-center mb-6">
                  <div className="inline-block bg-white p-4 rounded-3xl">
                    <QRCanvas value={tipUrl} />
                  </div>
                </div>
              )}
              <div className="rounded-2xl p-3 mb-4 flex items-center gap-2" style={{ background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.25)' }}>
                <span className="text-purple-400 text-sm font-mono flex-1 text-left truncate">{tipUrl}</span>
                <button onClick={copyUrl} className="text-gray-400 hover:text-white transition-colors">
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-6">Scan the QR code to tip on mobile</p>
              <div className="flex gap-3">
                <Link href={tipUrl.replace(typeof window !== 'undefined' ? window.location.origin : '', '')} className="btn-primary flex-1">
                  <ExternalLink className="w-4 h-4" /> View Page
                </Link>
                <Link href="/dashboard" className="btn-secondary flex-1">Dashboard</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
