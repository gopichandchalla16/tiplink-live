'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Zap, Heart, Send, ArrowLeft, Copy, Check, Star, Wallet } from 'lucide-react';

const PRESET_AMOUNTS = [0.1, 0.5, 1, 2, 5];

export default function TipPage() {
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [creator, setCreator] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('0.5');
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [thankYou, setThankYou] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/creators/${username}`)
      .then((r) => r.json())
      .then((d) => { setCreator(d.creator ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [username]);

  const sendTip = async () => {
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount'); return; }
    setSending(true); setError('');
    try {
      const res = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderAddress: sender || 'anonymous',
          recipientUsername: username,
          amount: parseFloat(amount),
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed'); setSending(false); return; }
      setThankYou(data.thankYou ?? '🙏 Thank you!');
      setSuccess(true);
    } catch { setError('Network error'); }
    setSending(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
    </div>
  );

  if (!creator) return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
      <div className="text-6xl">😕</div>
      <h1 className="text-2xl font-bold">Creator not found</h1>
      <button onClick={() => router.push('/')} className="text-purple-400 hover:text-purple-300 transition">← Go Home</button>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[120px]" />
      </div>
      <div className="relative z-10 glass rounded-3xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-3xl btn-glow flex items-center justify-center mx-auto mb-6 float">
          <Heart className="w-10 h-10 text-white" fill="white" />
        </div>
        <h1 className="text-3xl font-black mb-3">Tip Sent! 🎉</h1>
        <p className="text-white/60 mb-6 text-lg">{thankYou}</p>
        <div className="glass rounded-2xl p-4 mb-6">
          <p className="text-4xl font-black gradient-text">{amount} SOL</p>
          <p className="text-white/40 text-sm mt-1">sent to {String(creator.displayName ?? creator.username)}</p>
        </div>
        {message && <p className="text-white/50 italic mb-6">&ldquo;{message}&rdquo;</p>}
        <div className="flex flex-col gap-3">
          <button onClick={() => { setSuccess(false); setAmount('0.5'); setMessage(''); }} className="btn-glow py-3.5 rounded-xl font-bold">
            Send Another Tip
          </button>
          <button onClick={() => router.push('/')} className="glass py-3.5 rounded-xl font-semibold text-white/70 hover:text-white transition">
            ← Back to TipLink
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-700/15 blur-[100px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => router.push('/')} className="text-white/40 hover:text-white transition flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> TipLink
        </button>
        <button onClick={copy} className="text-white/40 hover:text-white transition flex items-center gap-1.5 text-sm">
          {copied ? <><Check className="w-4 h-4 text-green-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Share</>}
        </button>
      </nav>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-10">
        {/* Creator Card */}
        <div className="glass rounded-3xl p-8 mb-6 text-center">
          <div className="relative inline-block mb-5">
            {creator.avatarUrl ? (
              <img src={String(creator.avatarUrl)} alt="avatar" className="w-24 h-24 rounded-2xl object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-2xl btn-glow flex items-center justify-center">
                <span className="text-4xl font-black">{String(creator.displayName ?? creator.username).charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-green-400 border-2 border-[#0a0a0f] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-black" fill="black" />
            </div>
          </div>
          <h1 className="text-2xl font-black mb-1">{String(creator.displayName ?? creator.username)}</h1>
          <p className="text-purple-400 text-sm mb-3">@{String(creator.username)}</p>
          {creator.bio && <p className="text-white/50 text-sm leading-relaxed">{String(creator.bio)}</p>}
          <div className="flex justify-center gap-6 mt-5 pt-5 border-t border-white/5">
            <div className="text-center">
              <div className="text-xl font-black gradient-text">{Number(creator.tipCount ?? 0)}</div>
              <div className="text-xs text-white/30">Tips</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-xl font-black gradient-text">{Number(creator.totalTips ?? 0).toFixed(2)}</div>
              <div className="text-xs text-white/30">SOL Earned</div>
            </div>
          </div>
        </div>

        {/* Tip Form */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-purple-400" /> Send a Tip
          </h2>

          {/* Preset amounts */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-white/60 mb-3">Choose Amount</label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className={`py-2.5 rounded-xl text-sm font-bold transition ${
                    amount === String(a)
                      ? 'btn-glow text-white'
                      : 'glass text-white/60 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-white/60 mb-2">Custom SOL Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-white/60 mb-2">Message (optional)</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 resize-none transition"
              placeholder="Leave a kind message..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Sender wallet */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/60 mb-2">Your Wallet (optional)</label>
            <div className="relative">
              <Wallet className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition font-mono"
                placeholder="Your Solana wallet address"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          <button
            onClick={sendTip}
            disabled={sending}
            className="btn-glow w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
            ) : (
              <><Heart className="w-5 h-5" fill="white" /> Send {amount} SOL</>
            )}
          </button>

          <p className="text-center text-xs text-white/20 mt-4">Non-custodial · Powered by Solana · Instant settlement</p>
        </div>
      </div>
    </div>
  );
}
