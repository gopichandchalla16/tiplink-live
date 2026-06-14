'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';

interface TipStream {
  id: string;
  creatorName: string;
  creatorUsername: string;
  avatar: string;
  contentType: string;
  ratePerPost: number;
  subscribers: number;
  postsThisMonth: number;
  isSubscribed: boolean;
  totalPaidOut: number;
  nextPost?: string;
  aiSummary: string;
}

const STREAMS: TipStream[] = [
  { id: 's1', creatorName: 'Arjun Dev', creatorUsername: 'arjundev', avatar: '👨‍💻', contentType: '🛠️ Solana tutorials', ratePerPost: 0.05, subscribers: 142, postsThisMonth: 8, isSubscribed: false, totalPaidOut: 56.8, nextPost: 'Token-2022 deep dive', aiSummary: 'Highly consistent — 8 posts/month avg. Technical depth score: 9.2/10. Audience engagement: high.' },
  { id: 's2', creatorName: 'Priya Music', creatorUsername: 'priyamusic', avatar: '🎵', contentType: '🎶 Original tracks', ratePerPost: 0.02, subscribers: 891, postsThisMonth: 4, isSubscribed: true, totalPaidOut: 71.3, nextPost: 'Lo-fi study beats EP', aiSummary: 'Consistent bi-weekly releases. Audio quality improving over time. Listener retention: 87%.' },
  { id: 's3', creatorName: 'Rahul Builds', creatorUsername: 'rahulbuilds', avatar: '🔨', contentType: '📹 Build in public', ratePerPost: 0.03, subscribers: 234, postsThisMonth: 12, isSubscribed: false, totalPaidOut: 84.2, nextPost: 'TipLink integration live', aiSummary: 'Most prolific creator this week. Ships frequently. Engagement per post trending up 23% MoM.' },
];

export default function StreamsPage() {
  const { connected } = useWallet();
  const [streams, setStreams] = useState<TipStream[]>(STREAMS);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [totalSpend, setTotalSpend] = useState(0);
  const [activeTab, setActiveTab] = useState<'discover' | 'mine'>('discover');

  useEffect(() => {
    const myStreams = streams.filter(s => s.isSubscribed);
    const spend = myStreams.reduce((acc, s) => acc + s.ratePerPost * s.postsThisMonth, 0);
    setTotalSpend(Math.round(spend * 100) / 100);
  }, [streams]);

  async function toggleSubscribe(id: string) {
    setSubscribing(id);
    await new Promise(r => setTimeout(r, 1800));
    setStreams(prev => prev.map(s => s.id === id ? { ...s, isSubscribed: !s.isSubscribed, subscribers: s.isSubscribed ? s.subscribers - 1 : s.subscribers + 1 } : s));
    setSubscribing(null);
  }

  const myStreams = streams.filter(s => s.isSubscribed);

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0a001a 100%)', padding: '40px 24px', fontFamily: 'Inter, sans-serif', color: '#e8e8f0' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🌊</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #9945FF, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
            AI-Powered Tip Streams
          </h1>
          <p style={{ color: '#7070a0', fontSize: 15, lineHeight: 1.6 }}>
            Subscribe to creators with recurring micro-payments per content post.<br />
            AI monitors output quality and recommends the best streams for your budget.
          </p>
          {!connected && <div style={{ marginTop: 24 }}><WalletMultiButton /></div>}
        </div>

        {connected && (
          <>
            {/* My spending summary */}
            {myStreams.length > 0 && (
              <div style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.12), rgba(255,107,157,0.08))', border: '1px solid rgba(153,69,255,0.3)', borderRadius: 16, padding: 20, marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {[
                  { label: 'Active Streams', value: myStreams.length, unit: '' },
                  { label: 'This Month', value: totalSpend, unit: ' SOL' },
                  { label: 'Total Posts Funded', value: myStreams.reduce((a,s)=>a+s.postsThisMonth,0), unit: '' },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#9945FF' }}>{item.value}{item.unit}</div>
                    <div style={{ fontSize: 10, color: '#7070a0', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 3 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {(['discover', 'mine'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '8px 18px', borderRadius: 10, border: `1px solid ${activeTab === tab ? '#9945FF' : '#2a2a40'}`, background: activeTab === tab ? 'rgba(153,69,255,0.15)' : 'rgba(255,255,255,0.03)', color: activeTab === tab ? '#9945FF' : '#7070a0', fontWeight: 600, cursor: 'pointer', fontSize: 13, textTransform: 'capitalize' }}>
                  {tab === 'mine' ? `⚡ My Streams (${myStreams.length})` : '🔍 Discover'}
                </button>
              ))}
            </div>

            {/* Stream cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {(activeTab === 'mine' ? myStreams : streams).map(s => (
                <div key={s.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.isSubscribed ? 'rgba(153,69,255,0.4)' : '#2a2a40'}`, borderRadius: 18, padding: 24, position: 'relative' }}>

                  {s.isSubscribed && (
                    <div style={{ position: 'absolute', top: -1, left: 24, right: 24, height: 2, background: 'linear-gradient(90deg, #9945FF, #ff6b9d)' }} />
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 40, lineHeight: 1 }}>{s.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{s.creatorName}</span>
                        <span style={{ fontSize: 11, color: '#7070a0' }}>@{s.creatorUsername}</span>
                        {s.isSubscribed && <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(153,69,255,0.2)', color: '#9945FF', fontSize: 10, fontWeight: 700 }}>SUBSCRIBED</span>}
                      </div>
                      <div style={{ fontSize: 13, color: '#b0b0c8' }}>{s.contentType}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#9945FF' }}>{s.ratePerPost} SOL</div>
                      <div style={{ fontSize: 10, color: '#7070a0' }}>per post</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                    {[
                      ['👥', s.subscribers, 'Subscribers'],
                      ['📝', s.postsThisMonth + '/mo', 'Posts'],
                      ['💰', (s.ratePerPost * s.postsThisMonth).toFixed(2) + ' SOL', 'Est/Month'],
                      ['📦', s.totalPaidOut + ' SOL', 'Total Paid'],
                    ].map(([icon, val, label]) => (
                      <div key={label as string} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                        <div style={{ fontSize: 16 }}>{icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#e8e8f0', marginTop: 2 }}>{val}</div>
                        <div style={{ fontSize: 9, color: '#7070a0' }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* AI analysis */}
                  <div style={{ padding: '10px 14px', background: 'rgba(153,69,255,0.06)', border: '1px solid rgba(153,69,255,0.15)', borderRadius: 10, marginBottom: 16, fontSize: 12, color: '#b0b0c8', lineHeight: 1.5 }}>
                    <span style={{ color: '#9945FF', fontWeight: 700 }}>🤖 AI Analysis: </span>{s.aiSummary}
                  </div>

                  {/* Next post */}
                  {s.nextPost && (
                    <div style={{ padding: '8px 14px', background: 'rgba(20,241,149,0.05)', border: '1px solid rgba(20,241,149,0.15)', borderRadius: 10, marginBottom: 16, fontSize: 12, color: '#14F195' }}>
                      📅 Next post: <strong>{s.nextPost}</strong>
                    </div>
                  )}

                  <button onClick={() => toggleSubscribe(s.id)} disabled={subscribing === s.id}
                    style={{ width: '100%', padding: 13, borderRadius: 12, border: s.isSubscribed ? '1px solid rgba(255,77,109,0.4)' : 'none', background: subscribing === s.id ? '#2a2a40' : s.isSubscribed ? 'rgba(255,77,109,0.1)' : 'linear-gradient(135deg, #9945FF, #ff6b9d)', color: s.isSubscribed ? '#ff4d6d' : 'white', fontWeight: 700, cursor: subscribing === s.id ? 'not-allowed' : 'pointer', fontSize: 14 }}>
                    {subscribing === s.id ? '⏳ Processing on Solana...' : s.isSubscribed ? '⏸️ Cancel Stream' : `⚡ Stream ${s.ratePerPost} SOL/post`}
                  </button>
                </div>
              ))}

              {activeTab === 'mine' && myStreams.length === 0 && (
                <div style={{ textAlign: 'center', padding: 48, color: '#7070a0' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🌊</div>
                  <p>No active streams yet. Go to Discover to subscribe to a creator.</p>
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ marginTop: 32, padding: 22, background: 'rgba(153,69,255,0.05)', border: '1px solid rgba(153,69,255,0.2)', borderRadius: 14, fontSize: 13, color: '#b0b0c8', lineHeight: 1.7 }}>
          <strong style={{ color: '#9945FF' }}>⚙️ How TipStreams work: </strong>
          When a creator publishes new content, a Vercel webhook detects the post and triggers a Solana instruction that pulls micro-payments from all subscriber escrow accounts simultaneously. Gemini AI analyzes creator output quality weekly and adjusts your smart recommendations. You can cancel any stream instantly — unused escrow balance returns to your wallet.
        </div>
      </div>
    </main>
  );
}
