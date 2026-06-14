'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Search, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function Explore() {
  const router = useRouter();
  const [creators, setCreators] = useState<Record<string, unknown>[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/creators')
      .then((r) => r.json())
      .then((d) => { setCreators(d.creators ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = creators.filter((c) =>
    String(c.displayName ?? '').toLowerCase().includes(search.toLowerCase()) ||
    String(c.username ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[100px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => router.push('/')} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg btn-glow flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <span className="font-bold gradient-text">TipLink Live</span>
        </button>
        <button onClick={() => router.push('/create')} className="btn-glow text-sm font-semibold px-4 py-2 rounded-xl text-white">
          Create Page
        </button>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3">Explore <span className="gradient-text">Creators</span></h1>
          <p className="text-white/40">Discover and support amazing creators on TipLink Live</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-4 w-5 h-5 text-white/30" />
          <input
            className="w-full glass rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 border border-white/10 transition"
            placeholder="Search creators by name or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white/40 mb-4">{search ? 'No creators match your search' : 'No creators yet. Be the first!'}</p>
            <button onClick={() => router.push('/create')} className="btn-glow px-8 py-3 rounded-xl font-bold">
              Create Your Page
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c, i) => (
              <div
                key={i}
                onClick={() => router.push(`/tip/${c.username}`)}
                className="glass rounded-2xl p-6 cursor-pointer hover:bg-white/[0.07] transition group"
              >
                <div className="flex items-center gap-4 mb-4">
                  {c.avatarUrl ? (
                    <img src={String(c.avatarUrl)} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl btn-glow flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-black">{String(c.displayName ?? c.username).charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{String(c.displayName ?? c.username)}</p>
                    <p className="text-purple-400 text-xs">@{String(c.username)}</p>
                  </div>
                </div>
                {c.bio && <p className="text-white/40 text-sm mb-4 line-clamp-2">{String(c.bio)}</p>}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="text-xs text-white/30">
                      <span className="font-bold text-white/60">{Number(c.tipCount ?? 0)}</span> tips
                    </div>
                    <div className="text-xs text-white/30">
                      <span className="font-bold text-white/60">{Number(c.totalTips ?? 0).toFixed(1)}</span> SOL
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
