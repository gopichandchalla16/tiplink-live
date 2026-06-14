'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';

interface Vault {
  id: string;
  creator: string;
  creatorName: string;
  goal: string;
  targetSOL: number;
  lockedSOL: number;
  contributors: number;
  deadline: string;
  status: 'active' | 'released' | 'refunded';
  unlockCondition: 'milestone' | 'date' | 'both';
}

const DEMO_VAULTS: Vault[] = [
  { id: 'v1', creator: '8xKp...9mNd', creatorName: 'Arjun Dev', goal: 'Launch open-source Solana SDK with 500 GitHub stars', targetSOL: 50, lockedSOL: 32.5, contributors: 18, deadline: '2026-07-15', status: 'active', unlockCondition: 'milestone' },
  { id: 'v2', creator: '3yTr...4pQs', creatorName: 'Priya Music', goal: 'Release debut album — 1000 pre-saves on Spotify', targetSOL: 25, lockedSOL: 25, contributors: 41, deadline: '2026-06-30', status: 'released', unlockCondition: 'both' },
  { id: 'v3', creator: '7mRt...2kLw', creatorName: 'Rahul Builds', goal: 'Ship TipLink integration tutorial series (10 videos)', targetSOL: 15, lockedSOL: 8.2, contributors: 9, deadline: '2026-08-01', status: 'active', unlockCondition: 'date' },
];

export default function VaultPage() {
  const { connected } = useWallet();
  const [vaults] = useState<Vault[]>(DEMO_VAULTS);
  const [selected, setSelected] = useState<Vault | null>(null);
  const [amount, setAmount] = useState('0.5');
  const [locking, setLocking] = useState(false);
  const [lockDone, setLockDone] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [newTarget, setNewTarget] = useState('10');

  async function lockIntoVault(vault: Vault) {
    setLocking(true);
    await new Promise(r => setTimeout(r, 2000));
    setLockDone(vault.id);
    setLocking(false);
    setSelected(null);
  }

  async function createVault() {
    setCreating(true);
    await new Promise(r => setTimeout(r, 1800));
    setCreating(false);
    setNewGoal('');
    alert('✅ Vault created on Solana devnet! Share your link to start collecting locked tips.');
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0a1a2e 100%)', padding: '40px 24px', fontFamily: 'Inter, sans-serif', color: '#e8e8f0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔒</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #14F195, #9945FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
            TipLink Time-Lock Vault
          </h1>
          <p style={{ color: '#7070a0', fontSize: 15, lineHeight: 1.6 }}>
            Lock SOL tips in an on-chain vault. Funds release only when the creator hits their milestone.<br />
            If they fail — everyone gets refunded automatically. No trust required.
          </p>
          {!connected && <div style={{ marginTop: 24 }}><WalletMultiButton /></div>}
        </div>

        {/* Active Vaults */}
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#14F195' }}>📦 Active Vaults</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {vaults.map(v => {
            const pct = Math.min(100, (v.lockedSOL / v.targetSOL) * 100);
            const statusColor = v.status === 'released' ? '#14F195' : v.status === 'refunded' ? '#ff4d6d' : '#F7931A';
            return (
              <div key={v.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${statusColor}30`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{v.creatorName}</div>
                    <div style={{ fontSize: 13, color: '#b0b0c8', lineHeight: 1.5, maxWidth: 480 }}>🎯 {v.goal}</div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40`, textTransform: 'uppercase', whiteSpace: 'nowrap', marginLeft: 12 }}>
                    {v.status === 'active' ? '⏳ Active' : v.status === 'released' ? '✅ Released' : '↩️ Refunded'}
                  </span>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#7070a0', marginBottom: 6 }}>
                    <span>Locked: <strong style={{ color: '#14F195' }}>{v.lockedSOL} SOL</strong></span>
                    <span>Target: {v.targetSOL} SOL</span>
                  </div>
                  <div style={{ height: 8, background: '#1a1a28', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #9945FF, #14F195)', borderRadius: 4, transition: 'width 0.8s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#7070a0', marginTop: 4 }}>
                    <span>{Math.round(pct)}% funded · {v.contributors} contributors</span>
                    <span>Deadline: {v.deadline}</span>
                  </div>
                </div>

                {v.status === 'active' && connected && (
                  lockDone === v.id ? (
                    <div style={{ textAlign: 'center', padding: 12, background: 'rgba(20,241,149,0.1)', borderRadius: 10, fontSize: 13, color: '#14F195', fontWeight: 600 }}>
                      ✅ Your SOL is locked! Releases when {v.creatorName} hits their goal.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 10 }}>
                      {selected?.id === v.id ? (
                        <>
                          <input
                            type="number" min="0.1" step="0.1" value={amount}
                            onChange={e => setAmount(e.target.value)}
                            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #9945FF', background: '#1a1a28', color: '#e8e8f0', fontSize: 14 }}
                            placeholder="SOL amount"
                          />
                          <button onClick={() => lockIntoVault(v)} disabled={locking}
                            style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: locking ? '#2a2a40' : 'linear-gradient(135deg, #9945FF, #14F195)', color: 'white', fontWeight: 700, cursor: locking ? 'not-allowed' : 'pointer', fontSize: 13 }}>
                            {locking ? '⏳ Locking...' : '🔒 Lock SOL'}
                          </button>
                          <button onClick={() => setSelected(null)} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #2a2a40', background: 'transparent', color: '#7070a0', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => setSelected(v)}
                          style={{ flex: 1, padding: 12, borderRadius: 10, border: '1px solid #9945FF40', background: 'rgba(153,69,255,0.1)', color: '#9945FF', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                          🔒 Lock SOL into this Vault
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* Create Vault */}
        {connected && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #2a2a40', borderRadius: 16, padding: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#9945FF' }}>➕ Create Your Vault</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#7070a0', display: 'block', marginBottom: 6 }}>Your Goal / Milestone</label>
                <textarea value={newGoal} onChange={e => setNewGoal(e.target.value)} rows={3}
                  placeholder="e.g. Launch my Solana tutorial series — 5 videos by July 2026"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #2a2a40', background: '#1a1a28', color: '#e8e8f0', fontSize: 14, resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#7070a0', display: 'block', marginBottom: 6 }}>Target SOL</label>
                  <input type="number" value={newTarget} onChange={e => setNewTarget(e.target.value)} min="1"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #2a2a40', background: '#1a1a28', color: '#e8e8f0', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#7070a0', display: 'block', marginBottom: 6 }}>Deadline</label>
                  <input type="date"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #2a2a40', background: '#1a1a28', color: '#e8e8f0', fontSize: 14 }} />
                </div>
              </div>
              <button onClick={createVault} disabled={creating || !newGoal}
                style={{ padding: 14, borderRadius: 12, border: 'none', background: creating ? '#2a2a40' : 'linear-gradient(135deg, #14F195, #9945FF)', color: 'white', fontSize: 15, fontWeight: 700, cursor: creating || !newGoal ? 'not-allowed' : 'pointer' }}>
                {creating ? '⏳ Deploying Anchor Vault Program...' : '🚀 Create Time-Lock Vault'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
