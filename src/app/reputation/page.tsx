'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';

interface ReputationScore {
  wallet: string;
  score: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Legend';
  totalTipped: number;
  uniqueCreators: number;
  streakDays: number;
  sbtMinted: boolean;
  mintSignature?: string;
}

const TIER_CONFIG = {
  Bronze:  { min: 0,    color: '#CD7F32', emoji: '🥉', perks: ['Basic tipper badge', 'Public tip history'] },
  Silver:  { min: 100,  color: '#C0C0C0', emoji: '🥈', perks: ['Silver frame on tips', 'Creator priority queue'] },
  Gold:    { min: 500,  color: '#FFD700', emoji: '🥇', perks: ['Gold animated badge', 'Exclusive creator DMs', 'Early content access'] },
  Diamond: { min: 2000, color: '#B9F2FF', emoji: '💎', perks: ['Diamond holographic NFT', 'DAO voting rights', 'Revenue share eligibility'] },
  Legend:  { min: 5000, color: '#9945FF', emoji: '👑', perks: ['Legend status', 'Co-creator opportunities', 'Protocol governance power'] },
};

function calcTier(score: number): ReputationScore['tier'] {
  if (score >= 5000) return 'Legend';
  if (score >= 2000) return 'Diamond';
  if (score >= 500)  return 'Gold';
  if (score >= 100)  return 'Silver';
  return 'Bronze';
}

export default function ReputationPage() {
  const { publicKey, connected } = useWallet();
  const [rep, setRep] = useState<ReputationScore | null>(null);
  const [minting, setMinting] = useState(false);
  const [mintDone, setMintDone] = useState(false);

  useEffect(() => {
    if (!publicKey) return;
    // Simulate fetching on-chain rep score
    const mockScore = 847;
    const tier = calcTier(mockScore);
    setRep({
      wallet: publicKey.toBase58(),
      score: mockScore,
      tier,
      totalTipped: 12.4,
      uniqueCreators: 23,
      streakDays: 14,
      sbtMinted: false,
    });
  }, [publicKey]);

  async function mintSBT() {
    if (!rep) return;
    setMinting(true);
    // Simulate Token-2022 non-transferable mint
    await new Promise(r => setTimeout(r, 2200));
    setRep({ ...rep, sbtMinted: true, mintSignature: '5xK9...demo' });
    setMintDone(true);
    setMinting(false);
  }

  const tier = rep ? TIER_CONFIG[rep.tier] : null;
  const nextTierEntry = rep ? Object.entries(TIER_CONFIG).find(([, v]) => v.min > rep.score) : null;
  const progress = rep && nextTierEntry
    ? Math.min(100, ((rep.score - (tier?.min ?? 0)) / (nextTierEntry[1].min - (tier?.min ?? 0))) * 100)
    : 100;

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 100%)', padding: '40px 24px', fontFamily: 'Inter, sans-serif', color: '#e8e8f0' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🏅</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #9945FF, #14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
            SoulBound Tipper Reputation
          </h1>
          <p style={{ color: '#7070a0', fontSize: 15, lineHeight: 1.6 }}>
            Every tip you send builds your permanent on-chain reputation score.<br />
            Mint your SoulBound NFT — non-transferable proof of your supporter status.
          </p>
          {!connected && <div style={{ marginTop: 24 }}><WalletMultiButton /></div>}
        </div>

        {connected && rep && (
          <>
            {/* Score Card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: `2px solid ${tier?.color}40`, borderRadius: 20, padding: 32, marginBottom: 24, textAlign: 'center', boxShadow: `0 0 40px ${tier?.color}20` }}>
              <div style={{ fontSize: 64, marginBottom: 8 }}>{tier?.emoji}</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: tier?.color, marginBottom: 4 }}>{rep.score}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: tier?.color, marginBottom: 20 }}>{rep.tier} Tipper</div>

              {/* Progress to next tier */}
              {nextTierEntry && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#7070a0', marginBottom: 6 }}>
                    <span>{rep.tier}</span>
                    <span>→ {nextTierEntry[0]} ({nextTierEntry[1].min} pts)</span>
                  </div>
                  <div style={{ height: 8, background: '#2a2a40', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${tier?.color}, #14F195)`, borderRadius: 4, transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#7070a0', marginTop: 4 }}>{Math.round(progress)}% to {nextTierEntry[0]}</div>
                </div>
              )}

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {[['💰', rep.totalTipped + ' SOL', 'Total Tipped'], ['🎨', rep.uniqueCreators, 'Creators Supported'], ['🔥', rep.streakDays + 'd', 'Tip Streak']].map(([icon, val, label]) => (
                  <div key={label as string} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 10px' }}>
                    <div style={{ fontSize: 22 }}>{icon}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#e8e8f0' }}>{val}</div>
                    <div style={{ fontSize: 10, color: '#7070a0', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Perks */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #2a2a40', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tier?.color, marginBottom: 14 }}>✨ Your {rep.tier} Perks</h3>
              {tier?.perks.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #1a1a28', fontSize: 13 }}>
                  <span style={{ color: '#14F195' }}>✓</span> {p}
                </div>
              ))}
            </div>

            {/* Mint SBT */}
            {!rep.sbtMinted ? (
              <button
                onClick={mintSBT}
                disabled={minting}
                style={{ width: '100%', padding: 16, borderRadius: 14, border: 'none', background: minting ? '#2a2a40' : `linear-gradient(135deg, ${tier?.color}, #9945FF)`, color: 'white', fontSize: 16, fontWeight: 700, cursor: minting ? 'not-allowed' : 'pointer' }}
              >
                {minting ? '⏳ Minting SoulBound NFT on Solana...' : `🎖️ Mint ${rep.tier} SoulBound NFT (FREE)`}
              </button>
            ) : (
              <div style={{ background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.3)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <div style={{ fontWeight: 700, color: '#14F195', marginBottom: 4 }}>SoulBound NFT Minted!</div>
                <div style={{ fontSize: 12, color: '#7070a0' }}>Token-2022 Non-Transferable · Tx: {rep.mintSignature}</div>
              </div>
            )}
          </>
        )}

        {/* How it works */}
        <div style={{ marginTop: 40, background: 'rgba(255,255,255,0.02)', border: '1px solid #2a2a40', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#9945FF' }}>⚙️ How It Works</h3>
          {[
            ['1', 'Tip any creator on TipLink Live — each SOL tip adds points to your on-chain score'],
            ['2', 'Score = (SOL amount × 10) + (unique creators × 5) + (streak bonus × 2)'],
            ['3', 'Reach a tier threshold and mint your SoulBound NFT — forever on Solana, non-transferable'],
            ['4', 'Higher tiers unlock exclusive perks, DAO voting, and creator co-opportunities'],
          ].map(([n, t]) => (
            <div key={n} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(153,69,255,0.2)', border: '1px solid #9945FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#9945FF', flexShrink: 0 }}>{n}</div>
              <p style={{ fontSize: 13, color: '#b0b0c8', lineHeight: 1.5, margin: 0 }}>{t}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
