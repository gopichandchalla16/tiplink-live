'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, TrendingUp, Users, Star, ArrowUpRight, Wallet, Copy, Check, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');
  const [creator, setCreator] = useState<Record<string, unknown> | null>(null);
  const [tips, setTips] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const load = async (u: string) => {
    setLoading(true); setError('');
    const [cRes, tRes] = await Promise.all([
      fetch(`/api/creators/${u}`),
      fetch(`/api/tips/${u}`),
    ]);
    const cData = await cRes.json();
    const tData = await tRes.json();
    if (!cRes.ok) { setError('Creator not found'); setLoading(false); return; }
    setCreator(cData.creator);
    setTips(tData.tips ?? []);
    setLoading(false);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tipUrl = creator ? `${typeof window !== 'undefined' ? window.location.origin : ''}/tip/${String(creator.username)}` : '';

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-700/10 blur-[100px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => router.push('/')} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg btn-glow flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <span className="font-bold gradient-text">TipLink Live</span>
        </button>
        <button onClick={() => router.push('/create')} className="btn-glow text-sm font-semibold px-4 py-2 rounded-xl text-white">
          + Create Page
        </button>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black mb-2">Creator <span className="gradient-text">Dashboard</span></h1>
        <p className="text-white/40 mb-8">Track your tips and earnings</p>

        {/* Username lookup */}
        {!creator && (
          <div className="glass rounded-2xl p-6 mb-8">
            <label className="block text-sm font-medium text-white/60 mb-3">Enter your username to view dashboard</label>
            <div className="flex gap-3">
              <input
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition"
                placeholder="your-username"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && load(input)}
              />
              <button onClick={() => load(input)} disabled={loading} className="btn-glow px-6 py-3 rounded-xl font-bold">
                {loading ? '...' : 'Load'}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
        )}

        {creator && (
          <>
            {/* Profile header */}
            <div className="glass rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl btn-glow flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-black">{String(creator.displayName ?? creator.username).charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-black">{String(creator.displayName)}</h2>
                <p className="text-purple-400 text-sm">@{String(creator.username)}</p>
                {creator.bio && <p className="text-white/40 text-sm mt-1">{String(creator.bio)}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => copy(tipUrl)} className="glass px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 hover:bg-white/8 transition">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button onClick={() => router.push(`/tip/${creator.username}`)} className="btn-glow px-3 py-2 rounded-xl text-sm flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4" /> View Page
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[{
                label: 'Total Earned', value: `${Number(creator.totalTips ?? 0).toFixed(2)} SOL`, icon: TrendingUp, color: 'text-purple-400'
              }, {
                label: 'Total Tips', value: String(creator.tipCount ?? 0), icon: Star, color: 'text-yellow-400'
              }, {
                label: 'Supporters', value: String(tips.length), icon: Users, color: 'text-pink-400'
              }].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="glass rounded-2xl p-5 text-center">
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                  <div className="text-2xl font-black gradient-text">{value}</div>
                  <div className="text-xs text-white/40 mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Tips list */}
            <div className="glass rounded-3xl p-6">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-purple-400" /> Recent Tips
              </h3>
              {tips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">💫</div>
                  <p className="text-white/40">No tips yet. Share your link to get started!</p>
                  <button onClick={() => router.push(`/tip/${creator.username}`)} className="btn-glow mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold">
                    Share Tip Page
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tips.map((tip, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl hover:bg-white/[0.06] transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{String(tip.senderAddress ?? 'Anonymous').slice(0, 8)}...</p>
                          {tip.message && <p className="text-xs text-white/40 italic">&ldquo;{String(tip.message)}&rdquo;</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg gradient-text">{Number(tip.amount).toFixed(2)} SOL</p>
                        <p className="text-xs text-white/30">{new Date(String(tip.createdAt)).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
