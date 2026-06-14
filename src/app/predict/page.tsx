'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';

interface Market {
  id: string;
  creator: string;
  question: string;
  category: string;
  yesSOL: number;
  noSOL: number;
  endDate: string;
  status: 'open' | 'resolved_yes' | 'resolved_no';
  yourBet?: { side: 'yes' | 'no'; amount: number };
}

const MARKETS: Market[] = [
  { id: 'm1', creator: 'Arjun Dev', question: 'Will Arjun ship his Solana SDK to mainnet by July 2026?', category: '💻 Dev', yesSOL: 45.2, noSOL: 12.8, endDate: '2026-07-15', status: 'open' },
  { id: 'm2', creator: 'Priya Music', question: 'Will Priya reach 10k Spotify streams on debut album within 30 days?', category: '🎵 Music', yesSOL: 78.5, noSOL: 31.2, endDate: '2026-07-30', status: 'open' },
  { id: 'm3', creator: 'Rahul Builds', question: 'Will Rahul complete all 10 tutorial videos before Aug 1?', category: '📹 Content', yesSOL: 22.0, noSOL: 18.0, endDate: '2026-08-01', status: 'resolved_yes' },
];

export default function PredictPage() {
  const { connected } = useWallet();
  const [markets, setMarkets] = useState<Market[]>(MARKETS);
  const [placing, setPlacing] = useState<string | null>(null);
  const [betDone, setBetDone] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState('1');

  function getOdds(yes: number, no: number) {
    const total = yes + no;
    if (!total) return { yes: 50, no: 50 };
    return { yes: Math.round((yes / total) * 100), no: Math.round((no / total) * 100) };
  }

  async function placeBet(marketId: string, side: 'yes' | 'no') {
    setPlacing(marketId + side);
    await new Promise(r => setTimeout(r, 2000));
    setMarkets(prev => prev.map(m => m.id === marketId
      ? { ...m, yourBet: { side, amount: parseFloat(betAmount) }, yesSOL: side === 'yes' ? m.yesSOL + parseFloat(betAmount) : m.yesSOL, noSOL: side === 'no' ? m.noSOL + parseFloat(betAmount) : m.noSOL }
      : m
    ));
    setBetDone(marketId);
    setPlacing(null);
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0f00 100%)', padding: '40px 24px', fontFamily: 'Inter, sans-serif', color: '#e8e8f0' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔮</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #F7931A, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
            Creator Prediction Market
          </h1>
          <p style={{ color: '#7070a0', fontSize: 15, lineHeight: 1.6 }}>
            Tip a creator AND bet on whether they hit their goals.<br />
            If they succeed — YES bettors split the pool. Fully on-chain, no platform custody.
          </p>
          {!connected && <div style={{ marginTop: 24 }}><WalletMultiButton /></div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {markets.map(m => {
            const odds = getOdds(m.yesSOL, m.noSOL);
            const total = m.yesSOL + m.noSOL;
            const resolved = m.status !== 'open';
            const resColor = m.status === 'resolved_yes' ? '#14F195' : m.status === 'resolved_no' ? '#ff4d6d' : '#F7931A';

            return (
              <div key={m.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${resolved ? resColor + '40' : '#2a2a40'}`, borderRadius: 18, padding: 28, position: 'relative', overflow: 'hidden' }}>

                {/* Glow */}
                {resolved && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: resColor }} />}

                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(247,147,26,0.15)', color: '#F7931A', border: '1px solid rgba(247,147,26,0.25)' }}>{m.category}</span>
                  {resolved && <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${resColor}20`, color: resColor, border: `1px solid ${resColor}40` }}>{m.status === 'resolved_yes' ? '✅ YES Won' : '❌ NO Won'}</span>}
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: '#7070a0' }}>Closes {m.endDate}</span>
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{m.creator}</div>
                <div style={{ fontSize: 14, color: '#b0b0c8', lineHeight: 1.5, marginBottom: 20 }}>❓ {m.question}</div>

                {/* Odds bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: '#14F195', fontWeight: 700 }}>YES {odds.yes}% · {m.yesSOL.toFixed(1)} SOL</span>
                    <span style={{ color: '#ff4d6d', fontWeight: 700 }}>{m.noSOL.toFixed(1)} SOL · {odds.no}% NO</span>
                  </div>
                  <div style={{ height: 10, background: '#ff4d6d', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${odds.yes}%`, background: '#14F195', borderRadius: 5, transition: 'width 0.8s ease' }} />
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 11, color: '#7070a0', marginTop: 4 }}>Total pool: {total.toFixed(1)} SOL · Potential payout: {(total / (m.yesSOL || 1)).toFixed(2)}x</div>
                </div>

                {/* Bet UI */}
                {!resolved && connected && (
                  betDone === m.id && m.yourBet ? (
                    <div style={{ textAlign: 'center', padding: 14, background: 'rgba(20,241,149,0.08)', borderRadius: 12, fontSize: 13, color: '#14F195', fontWeight: 600 }}>
                      ✅ Bet placed — {m.yourBet.amount} SOL on <strong>{m.yourBet.side.toUpperCase()}</strong>. Funds locked until resolution.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} min="0.1" step="0.1"
                        style={{ width: 100, padding: '10px 12px', borderRadius: 10, border: '1px solid #2a2a40', background: '#1a1a28', color: '#e8e8f0', fontSize: 14 }}
                        placeholder="SOL" />
                      <button onClick={() => placeBet(m.id, 'yes')} disabled={!!placing}
                        style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', background: placing === m.id + 'yes' ? '#2a2a40' : 'linear-gradient(135deg, #14F195, #0ea866)', color: '#0a0a0f', fontWeight: 800, cursor: placing ? 'not-allowed' : 'pointer', fontSize: 13 }}>
                        {placing === m.id + 'yes' ? '⏳...' : '📈 BET YES'}
                      </button>
                      <button onClick={() => placeBet(m.id, 'no')} disabled={!!placing}
                        style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', background: placing === m.id + 'no' ? '#2a2a40' : 'linear-gradient(135deg, #ff4d6d, #c0392b)', color: 'white', fontWeight: 800, cursor: placing ? 'not-allowed' : 'pointer', fontSize: 13 }}>
                        {placing === m.id + 'no' ? '⏳...' : '📉 BET NO'}
                      </button>
                    </div>
                  )
                )}

                {resolved && m.yourBet && (
                  <div style={{ textAlign: 'center', padding: 14, background: m.yourBet.side === (m.status === 'resolved_yes' ? 'yes' : 'no') ? 'rgba(20,241,149,0.08)' : 'rgba(255,77,109,0.08)', borderRadius: 12, fontSize: 13, fontWeight: 600, color: m.yourBet.side === (m.status === 'resolved_yes' ? 'yes' : 'no') ? '#14F195' : '#ff4d6d' }}>
                    {m.yourBet.side === (m.status === 'resolved_yes' ? 'yes' : 'no') ? '🏆 You won! Claim your payout.' : '😔 You lost this one. Better luck next time.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 32, padding: 20, background: 'rgba(247,147,26,0.06)', border: '1px solid rgba(247,147,26,0.2)', borderRadius: 14, fontSize: 13, color: '#b0b0c8', lineHeight: 1.7 }}>
          <strong style={{ color: '#F7931A' }}>⚙️ How it works: </strong>
          SOL bets lock in a Solana escrow program. When the creator submits proof of completion (GitHub commit / Spotify link / etc.), an oracle verifies and the program auto-distributes winnings. If the creator fails to submit proof by deadline, NO bettors claim the pool. 100% trustless.
        </div>
      </div>
    </main>
  );
}
