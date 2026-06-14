'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Zap, User, FileText, Wallet, Check, Copy, ExternalLink, ArrowLeft, Sparkles } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Profile' },
  { id: 2, label: 'Wallet' },
  { id: 3, label: 'Launch' },
];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    bio: '',
    walletAddress: '',
    avatarUrl: '',
  });
  const [tipUrl, setTipUrl] = useState('');
  const [error, setError] = useState('');

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed'); setLoading(false); return; }
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      setTipUrl(`${base}/tip/${form.username}`);
      setStep(3);
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(tipUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* BG orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-700/15 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center gap-4 px-6 py-5 border-b border-white/5">
        <button onClick={() => router.push('/')} className="text-white/40 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg btn-glow flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <span className="font-bold gradient-text">TipLink Live</span>
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs text-purple-300">Free Creator Page</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">
              Create Your <span className="gradient-text">Tip Page</span>
            </h1>
            <p className="text-white/40">Set up in 60 seconds. Start receiving SOL instantly.</p>
          </div>

          {/* Step indicator */}
          {step < 3 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {STEPS.map((s, i) => (
                <>
                  <div key={s.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    step === s.id ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    step > s.id ? 'bg-green-500/20 text-green-400' : 'text-white/30'
                  }`}>
                    {step > s.id ? <Check className="w-3 h-3" /> : <span>{s.id}</span>}
                    {s.label}
                  </div>
                  {i < STEPS.length - 1 && <div className="w-6 h-px bg-white/10" />}
                </>
              ))}
            </div>
          )}

          {/* Card */}
          <div className="glass rounded-3xl p-8">
            {/* Step 1 — Profile */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-bold text-xl mb-1">Your Profile</h2>
                <p className="text-sm text-white/40 mb-6">Tell supporters who you are</p>

                {[{
                  label: 'Username *', key: 'username', icon: User,
                  placeholder: 'e.g. satoshi', hint: 'tiplink.live/tip/satoshi'
                }, {
                  label: 'Display Name *', key: 'displayName', icon: User,
                  placeholder: 'e.g. Satoshi Nakamoto'
                }, {
                  label: 'Bio', key: 'bio', icon: FileText,
                  placeholder: 'What do you create? (optional)', multiline: true
                }, {
                  label: 'Avatar URL', key: 'avatarUrl', icon: User,
                  placeholder: 'https://your-image.com/avatar.jpg (optional)'
                }].map(({ label, key, icon: Icon, placeholder, hint, multiline }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                      {multiline ? (
                        <textarea
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 pt-3 pb-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 resize-none transition"
                          placeholder={placeholder}
                          rows={3}
                          value={(form as Record<string,string>)[key]}
                          onChange={(e) => update(key, e.target.value)}
                        />
                      ) : (
                        <input
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition"
                          placeholder={placeholder}
                          value={(form as Record<string,string>)[key]}
                          onChange={(e) => update(key, e.target.value)}
                        />
                      )}
                    </div>
                    {hint && <p className="text-xs text-white/25 mt-1.5 pl-1">{hint}</p>}
                  </div>
                ))}

                <button
                  onClick={() => { if (!form.username || !form.displayName) { setError('Username and display name required'); return; } setError(''); setStep(2); }}
                  className="btn-glow w-full py-3.5 rounded-xl font-bold mt-2"
                >
                  Continue →
                </button>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              </div>
            )}

            {/* Step 2 — Wallet */}
            {step === 2 && (
              <div className="space-y-5">
                <button onClick={() => setStep(1)} className="text-white/40 hover:text-white transition text-sm flex items-center gap-1 mb-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <h2 className="font-bold text-xl">Connect Your Wallet</h2>
                <p className="text-sm text-white/40 mb-6">Tips go directly to this address — we never touch your funds</p>

                <div className="glass rounded-2xl p-5 border border-green-500/20 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-400">Non-Custodial</p>
                      <p className="text-xs text-white/40 mt-0.5">Only you control your wallet. TipLink Live has zero access to your funds.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Solana Wallet Address *</label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition font-mono"
                      placeholder="Enter your Solana wallet address"
                      value={form.walletAddress}
                      onChange={(e) => update('walletAddress', e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={() => { if (!form.walletAddress) { setError('Wallet address required'); return; } setError(''); handleCreate(); }}
                  disabled={loading}
                  className="btn-glow w-full py-3.5 rounded-xl font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Launching...' : '🚀 Launch My Tip Page'}
                </button>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              </div>
            )}

            {/* Step 3 — Success */}
            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl btn-glow flex items-center justify-center mx-auto float">
                  <Zap className="w-8 h-8 text-white" fill="white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black mb-2">🎉 You&apos;re Live!</h2>
                  <p className="text-white/40">Share your link and start receiving SOL tips</p>
                </div>

                {/* QR Code */}
                {tipUrl && (
                  <div className="bg-white rounded-2xl p-4 inline-block mx-auto">
                    <QRCodeSVG value={tipUrl} size={160} level="H" includeMargin={false} />
                  </div>
                )}

                {/* URL copy */}
                <div className="glass rounded-2xl p-4 border border-white/10">
                  <p className="text-xs text-white/40 mb-2">Your Tip Link</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-purple-300 truncate">{tipUrl}</code>
                    <button onClick={copy} className="text-white/40 hover:text-white transition flex-shrink-0">
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => router.push(tipUrl.replace(window.location.origin, ''))}
                    className="btn-glow w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> View My Page
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="glass w-full py-3.5 rounded-xl font-semibold text-white/70 hover:text-white hover:bg-white/8 transition"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
