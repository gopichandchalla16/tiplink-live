'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Zap, ArrowRight, TrendingUp, Users, Sparkles } from 'lucide-react';
import type { Creator } from '@/lib/storage';

const CATEGORIES = ['All','developer','artist','musician','writer','creator','gamer'];

function CreatorCard({ c, rank }: { c: Creator; rank: number }) {
  const medalColors: Record<number, string> = {
    1: 'linear-gradient(135deg,#FFD700,#FFA500)',
    2: 'linear-gradient(135deg,#C0C0C0,#A8A8A8)',
    3: 'linear-gradient(135deg,#CD7F32,#A0522D)',
  };
  return (
    <div className="group relative rounded-2xl p-5 transition-all hover:-translate-y-1" style={{
      background: 'linear-gradient(145deg, rgba(15,15,26,0.97), rgba(10,10,20,0.99))',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}>
      {rank <= 3 && (
        <div className="absolute -top-2.5 -right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: medalColors[rank], boxShadow: '0 0 14px rgba(255,215,0,0.45)' }}>#{rank}</div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <div className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#9945FF,#00F0FF)', padding: '1.5px' }}>
          <div className="w-full h-full rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center">
            {c.avatarUrl ? (
              <Image src={c.avatarUrl} alt={c.name} width={48} height={48} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-black text-white" style={{ background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{c.name[0]}</span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-white text-sm truncate mb-0.5">{c.name}</div>
          <div className="text-gray-500 text-xs">@{c.username}</div>
        </div>
        {c.category && (
          <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: 'rgba(153,69,255,0.12)', color: '#9945FF', border: '1px solid rgba(153,69,255,0.25)' }}>{c.category}</span>
        )}
      </div>

      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">{c.bio || 'Solana creator.'}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="font-extrabold text-white text-sm">{(c.totalTips ?? 0).toFixed(3)}</div>
            <div className="text-gray-600 text-xs">SOL</div>
          </div>
          <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div>
            <div className="font-extrabold text-white text-sm">{c.tipCount ?? 0}</div>
            <div className="text-gray-600 text-xs">tips</div>
          </div>
        </div>
      </div>

      <Link href={`/tip/${c.username}`}
        className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
        style={{ background: 'linear-gradient(135deg,#9945FF,#7B2FFF)', color: '#fff', boxShadow: '0 0 16px rgba(153,69,255,0.3)' }}
      >
        <Zap className="w-3.5 h-3.5" /> Send Tip
      </Link>
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,rgba(153,69,255,0.15),rgba(20,241,149,0.08))', border: '1px solid rgba(153,69,255,0.2)' }}>
          <Sparkles className="w-10 h-10" style={{ color: '#9945FF' }} />
        </div>
        <div className="absolute -inset-4 rounded-full" style={{ background: 'radial-gradient(ellipse,rgba(153,69,255,0.08),transparent 70%)' }} />
      </div>
      <h3 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>
        {hasSearch ? 'No creators found' : 'No creators yet'}
      </h3>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">
        {hasSearch
          ? 'Try a different search term or category.'
          : 'Be the first creator on TipLink Live. Create your tip page and start receiving on-chain tips.'}
      </p>
      {!hasSearch && (
        <Link href="/create"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg,#9945FF,#14F195)', color: '#fff', boxShadow: '0 0 24px rgba(153,69,255,0.35)' }}
        >
          Create Your Page <ArrowRight className="w-4 h-4" />
        </Link>
      )}
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
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => (b.totalTips ?? 0) - (a.totalTips ?? 0));
  const hasSearch = !!(search || category !== 'All');

  return (
    <div className="min-h-screen" style={{ background: '#080810' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-72" style={{ background: 'radial-gradient(ellipse,rgba(153,69,255,0.05) 0%,transparent 70%)', filter: 'blur(48px)' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#9945FF,#14F195)' }}>
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-white" style={{ fontFamily: 'Space Grotesk' }}>TipLink Live</span>
        </Link>
        <Link href="/create" className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg,#9945FF,#7B2FFF)' }}>Create Link</Link>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.2)', color: '#9945FF' }}>
            <TrendingUp className="w-3 h-3" /> Live Leaderboard
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Explore Creators</h1>
          <p className="text-gray-400 text-sm">Discover and support builders on Solana. Every tip is a real on-chain transaction.</p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search creators…"
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-white placeholder-gray-600 text-sm focus:outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all"
                style={category === cat ? {
                  background: 'linear-gradient(135deg,#9945FF,#7B2FFF)',
                  color: '#fff',
                  boxShadow: '0 0 16px rgba(153,69,255,0.35)',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#888',
                }}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Stats strip — only show when there are real creators */}
        {!loading && creators.length > 0 && (
          <div className="flex items-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" style={{ color: '#9945FF' }} />
              <span><strong className="text-white">{creators.length}</strong> creator{creators.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-4 h-4" style={{ color: '#22C55E' }} />
              <span><strong className="text-white">{creators.reduce((s, c) => s + (c.totalTips ?? 0), 0).toFixed(3)}</strong> SOL tipped</span>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState hasSearch={hasSearch} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((c, i) => (
              <CreatorCard key={c.username} c={c} rank={i + 1} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
