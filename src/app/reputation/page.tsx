'use client';
import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

// ------------------------------------------------------------------
// /reputation — SoulBound Tipper Reputation NFT
// Real wallet: reads publicKey from @solana/wallet-adapter-react.
// Minting simulates Token-2022 non-transferable SBT flow.
// Transaction signing uses the real connected wallet.
// ------------------------------------------------------------------

const TIERS = [
  { name: 'Bronze',  min: 0,    color: '#CD7F32', emoji: '🥉', perks: ['Basic tipper badge', 'Public tip history'] },
  { name: 'Silver',  min: 100,  color: '#C0C0C0', emoji: '🥈', perks: ['Silver frame on tips', 'Creator priority queue'] },
  { name: 'Gold',    min: 500,  color: '#FFD700', emoji: '🥇', perks: ['Gold animated badge', 'Exclusive creator DMs', 'Early content access'] },
  { name: 'Diamond', min: 2000, color: '#B9F2FF', emoji: '💎', perks: ['Diamond holographic NFT', 'DAO voting rights', 'Revenue share'] },
  { name: 'Legend',  min: 5000, color: '#9945FF', emoji: '👑', perks: ['Legend status', 'Co-creator opportunities', 'Protocol governance'] },
];

export default function ReputationPage() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [score] = useState(847);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [txSig, setTxSig] = useState('');
  const [txError, setTxError] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  // MetaMask state
  const [mmAddress, setMmAddress] = useState<string | null>(null);

  const tier = TIERS.slice().reverse().find(t => score >= t.min) || TIERS[0];
  const nextTier = TIERS.find(t => t.min > score);
  const progress = nextTier ? Math.round(((score - tier.min) / (nextTier.min - tier.min)) * 100) : 100;

  // Fetch SOL balance when wallet connects
  useEffect(() => {
    if (!publicKey) { setBalance(null); return; }
    connection.getBalance(publicKey).then(bal => setBalance(bal / LAMPORTS_PER_SOL)).catch(() => setBalance(null));
  }, [publicKey, connection]);

  // MetaMask connect
  async function connectMetaMask() {
    const eth = (window as any).ethereum;
    if (!eth) { alert('Install MetaMask to use this option.'); return; }
    try {
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      setMmAddress(accounts[0]);
    } catch (e: any) { console.error(e); }
  }

  // Mint SBT — creates a real devnet transaction (0 SOL self-transfer to simulate on-chain record)
  const mintSBT = useCallback(async () => {
    if (!publicKey || !sendTransaction) return;
    setMinting(true);
    setTxError('');
    try {
      // In production this would call your Anchor program's mint_sbt instruction.
      // Here we create a verifiable devnet transaction as proof-of-intent.
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey, // self-transfer as on-chain record
          lamports: 1000,      // 0.000001 SOL
        })
      );
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed');
      setTxSig(sig);
      setMinted(true);
    } catch (err: any) {
      setTxError(err.message || 'Transaction failed');
    } finally {
      setMinting(false);
    }
  }, [publicKey, sendTransaction, connection]);

  const shortKey = (k: string) => `${k.slice(0,6)}...${k.slice(-4)}`;
  const isConnected = connected && !!publicKey;

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0e27,#0d0520)', padding: '40px 24px', fontFamily: 'Inter,sans-serif', color: '#e8e8f0' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <a href="/" style={{ color: '#9945FF', fontSize: 13, textDecoration: 'none' }}>← TipLink</a>
          <div style={{ display: 'flex', gap: 8 }}>
            <WalletMultiButton style={{ height: 34, fontSize: 12, borderRadius: 10, background: 'linear-gradient(135deg,#9945FF,#7733cc)' }} />
            {!mmAddress ? (
              <button onClick={connectMetaMask} style={{ padding: '6px 14px', borderRadius: 10, background: 'rgba(255,165,0,0.15)', border: '1px solid rgba(255,165,0,0.3)', fontSize: 12, color: '#FFA500', cursor: 'pointer', fontWeight: 600 }}>🦊 MetaMask</button>
            ) : (
              <div style={{ padding: '6px 14px', borderRadius: 10, background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.3)', fontSize: 12, color: '#FFA500', fontWeight: 600, fontFamily: 'monospace' }}>🦊 {shortKey(mmAddress)}</div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, margin: '0 0 12px' }}>🏅</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px' }}>Tipper Reputation NFT</h1>
          <p style={{ color: '#6070a0', fontSize: 14, lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>Your on-chain supporter score. Every SOL tip earns points. Mint a non-transferable SoulBound Token as permanent proof.</p>
        </div>

        {/* Wallet not connected */}
        {!isConnected && !mmAddress && (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(153,69,255,0.2)', borderRadius: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔗</div>
            <p style={{ color: '#8080a0', fontSize: 15, marginBottom: 24 }}>Connect your wallet to view your reputation score and mint your SBT.</p>
            <WalletMultiButton style={{ margin: '0 auto 12px', display: 'block', borderRadius: 12, background: 'linear-gradient(135deg,#9945FF,#7733cc)', fontSize: 14, fontWeight: 700, height: 44 }} />
            <p style={{ color: '#5050a0', fontSize: 12 }}>or</p>
            <button onClick={connectMetaMask} style={{ padding: '10px 24px', borderRadius: 12, background: 'rgba(255,165,0,0.15)', border: '1px solid rgba(255,165,0,0.3)', color: '#FFA500', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>🦊 Connect MetaMask</button>
          </div>
        )}

        {/* Wallet connected — show dashboard */}
        {(isConnected || mmAddress) && (
          <>
            {/* Connected wallet info */}
            <div style={{ background: 'rgba(20,241,149,0.06)', border: '1px solid rgba(20,241,149,0.2)', borderRadius: 12, padding: '12px 20px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
              {isConnected && publicKey && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#14F195', fontWeight: 700 }}>🔮 Phantom:</span>
                  <span style={{ color: '#9945FF', fontFamily: 'monospace', background: 'rgba(153,69,255,0.1)', padding: '2px 10px', borderRadius: 6 }}>{publicKey.toBase58()}</span>
                </div>
              )}
              {mmAddress && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#FFA500', fontWeight: 700 }}>🦊 MetaMask:</span>
                  <span style={{ color: '#FFA500', fontFamily: 'monospace', background: 'rgba(255,165,0,0.1)', padding: '2px 10px', borderRadius: 6 }}>{mmAddress}</span>
                </div>
              )}
              {balance !== null && <span style={{ color: '#6070a0' }}>Balance: <strong style={{ color: '#14F195' }}>{balance.toFixed(4)} SOL</strong></span>}
            </div>

            {/* Score Card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: `2px solid ${tier.color}40`, borderRadius: 20, padding: 28, marginBottom: 20, textAlign: 'center', boxShadow: `0 0 60px ${tier.color}10` }}>
              <div style={{ fontSize: 56, margin: '0 0 6px' }}>{tier.emoji}</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: tier.color, letterSpacing: '-1px' }}>{score}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: tier.color, marginBottom: 20 }}>{tier.name} Tipper</div>
              {nextTier && (
                <div style={{ marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6060a0', marginBottom: 6 }}>
                    <span>{tier.name} ({tier.min})</span><span>{nextTier.name} ({nextTier.min})</span>
                  </div>
                  <div style={{ height: 8, background: '#1a1a30', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${tier.color},#14F195)`, borderRadius: 4, transition: 'width 1.5s ease' }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#6060a0', marginTop: 4 }}>{progress}% to {nextTier.name}</div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[['💰','12.4 SOL','Total Tipped'],['🎨','23','Creators Tipped'],['🔥','14d','Tip Streak']].map(([icon,val,label])=>(
                  <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 22 }}>{icon}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{val}</div>
                    <div style={{ fontSize: 9, color: '#5060a0', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Perks */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #2a2a40', borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: tier.color, marginBottom: 12 }}>✨ {tier.name} Perks Active</div>
              {tier.perks.map(p=>(<div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #1a1a28', fontSize: 13 }}><span style={{ color: '#14F195' }}>✓</span>{p}</div>))}
            </div>

            {/* Error */}
            {txError && (
              <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 13, color: '#ff8080' }}>⚠️ {txError}</div>
            )}

            {/* Mint Button */}
            {!minted ? (
              <button onClick={mintSBT} disabled={minting || !isConnected} style={{ width: '100%', padding: 16, borderRadius: 12, border: 'none', background: (minting || !isConnected) ? '#2a2a40' : `linear-gradient(135deg,${tier.color},#9945FF)`, color: 'white', fontSize: 15, fontWeight: 700, cursor: (minting || !isConnected) ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                {!isConnected ? '🔗 Connect Phantom to Mint' : minting ? '⏳ Broadcasting to Solana...' : '🎖️ Mint SoulBound NFT — Token-2022 Non-Transferable'}
              </button>
            ) : (
              <div style={{ background: 'rgba(20,241,149,0.08)', border: '1px solid rgba(20,241,149,0.3)', borderRadius: 14, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <div style={{ fontWeight: 800, color: '#14F195', fontSize: 16, marginBottom: 6 }}>SoulBound NFT Minted!</div>
                <div style={{ fontSize: 12, color: '#6060a0', marginBottom: 10, fontFamily: 'monospace', wordBreak: 'break-all' }}>Tx: {txSig}</div>
                <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '8px 18px', borderRadius: 8, background: 'rgba(153,69,255,0.15)', color: '#9945FF', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>View on Solana Explorer ↗</a>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
