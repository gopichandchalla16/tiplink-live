'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Zap, ArrowRight, Star, TrendingUp, Users } from 'lucide-react';
import type { Creator } from '@/lib/storage';

const CATEGORIES = ['All','developer','artist','musician','writer','creator','gamer'];

function CreatorCard({ c }: { c: Creator }) {
  const avatarBg = 'linear-gradient(135deg, #9945FF, #00F0FF)';
  return (
    <div className="relative rounded-2xl p-5 card-hover noise" style={{
      background: 'linear-gradient(145deg, rgba(15,15,26,0.95), rgba(10,10,20,0.98))',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* top glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, transparent, #9945FF60, transparent)' }} />

      <div className="flex items-start gap-3 mb-4">
        <div className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden" style={{ background: avatarBg, padding: '1.5px', boxShadow: '0 0 16px rgba(153,69,255,0.3)' }}>
          <div className="w-full h-full rounded-xl overflow-hidden bg-gray-900">
            {c.avatarUrl ? (
              <Image src={c.avatarUrl} alt={c.name} width={48} height={48} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-extrabold text-white text-lg" style={{ background: avatarBg }}>
                {c.name[0]}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-extrabold text-white text-sm truncate">{c.name}</span>
            <Zap className="w-3 h-3 flex-shrink-0" style={{ color: '#9945FF' }} />
          </div>
          <span className="text-gray-500 text-xs">@{c.username}</span>
        </div>
        {c.category && (
          <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: 'rgba(153,69,255,0.1)', color: '#9945FF', border: '1px solid rgba(153,69,255,0.2)' }}>
            {c.category}
          </span>
        )}
      </div>

      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">{c.bio || 'Solana creator.'}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="font-extrabold text-white text-sm">{(c.totalTips ?? 0).toFixed(2)}</div>
            <div className="text-gray-600 text-xs">SOL</div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <div className="font-extrabold text-white text-sm">{c.tipCount ?? 0}</div>
            <div className="text-gray-600 text-xs">tips</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5" style={{ color: i < Math.min(5, Math.ceil((c.tipCount ?? 0) / 2)) ? '#FFD700' : '#333' }} />
          ))}
        </div>
      </div>

      <Link href={`/tip/${c.username}`}
        className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] btn-primary"
      >
        <Zap className="w-3.5 h-3.5" /> Tip Now
      </Link>
    </div>
  );
}

export default function ExplorePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('/api/creators')
      .then(r => r.json())
      .then((d: Creator[]) => setCreators(Array.isArray(d) ? d : []))
      .catch(() => setCreators([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = creators.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.username.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => (b.totalTips ?? 0) - (a.totalTips ?? 0));

  return (
    <div className="min-h-screen grid-bg" style={{ background: '#080810' }}>
      {/* ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-64 rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(153,69,255,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}>
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-white" style={{ fontFamily: 'Space Grotesk' }}>TipLink Live</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/create" className="px-4 py-2 rounded-xl text-sm font-semibold btn-primary">Create Link</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.2)', color: '#9945FF' }}>
            <TrendingUp className="w-3 h-3" /> Live Leaderboard
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Explore Creators</h1>
          <p className="text-gray-400">Discover and support the best builders on Solana.</p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search creators…"
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-white placeholder-gray-600 text-sm focus:outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all"
                style={category === c ? {
                  background: 'linear-gradient(135deg, #9945FF, #7B2FFF)',
                  color: '#fff', boxShadow: '0 0 16px #9945FF40',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#888',
                }}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        {!loading && (
          <div className="flex items-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" style={{ color: '#9945FF' }} />
              <span><strong className="text-white">{creators.length}</strong> creators</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-4 h-4" style={{ color: '#22C55E' }} />
              <span><strong className="text-white">{creators.reduce((s, c) => s + (c.totalTips ?? 0), 0).toFixed(2)}</strong> SOL tipped</span>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-52 rounded-2xl shimmer" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No creators found</h3>
            <p className="text-gray-400 mb-6">Try a different search or category.</p>
            <Link href="/create" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-primary font-semibold text-sm">
              Be the first <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((c, i) => (
              <div key={c.username} className="relative">
                {i < 3 && (
                  <div className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold" style={{ background: ['linear-gradient(135deg,#FFD700,#FFA500)','linear-gradient(135deg,#C0C0C0,#A8A8A8)','linear-gradient(135deg,#CD7F32,#A0522D)'][i], boxShadow: '0 0 12px rgba(255,215,0,0.5)' }}>
                    #{i+1}
                  </div>
                )}
                <CreatorCard c={c} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
