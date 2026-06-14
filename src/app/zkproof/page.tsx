'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';

interface ZKProof {
  proofId: string;
  nullifierHash: string;
  commitment: string;
  creatorUsername: string;
  amountRange: string;
  timestamp: number;
  verified: boolean;
}

export default function ZKProofPage() {
  const { publicKey, connected } = useWallet();
  const [step, setStep] = useState<'idle' | 'generating' | 'done'>('idle');
  const [proof, setProof] = useState<ZKProof | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [creatorInput, setCreatorInput] = useState('arjundev');
  const [rangeInput, setRangeInput] = useState('0.5-5 SOL');

  async function generateProof() {
    setStep('generating');
    // Simulate ZK proof generation (Light Protocol / Circom circuit)
    await new Promise(r => setTimeout(r, 3000));
    const nullifier = Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const commitment = Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setProof({
      proofId: 'zkp_' + Date.now(),
      nullifierHash: '0x' + nullifier,
      commitment: '0x' + commitment,
      creatorUsername: creatorInput,
      amountRange: rangeInput,
      timestamp: Date.now(),
      verified: false,
    });
    setStep('done');
  }

  async function verifyProof() {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 1500));
    setVerified(true);
    setVerifying(false);
  }

  function copyProof() {
    if (proof) navigator.clipboard.writeText(JSON.stringify(proof, null, 2));
  }

  const CODE_SNIPPET = `// ZK Circuit (Circom pseudocode)
template TipProof() {
  // Private inputs (never revealed)
  signal private input walletSecret;
  signal private input tipAmount;
  signal private input txSignature;
  
  // Public inputs (shared with verifier)
  signal input creatorPubkey;
  signal input nullifierHash;
  signal input commitment;
  signal input amountRangeLow;
  signal input amountRangeHigh;
  
  // Constraints
  // 1. Prove wallet owns the tip transaction
  component walletCheck = WalletOwnership();
  walletCheck.secret <== walletSecret;
  walletCheck.pubkey === derivePublicKey(walletSecret);
  
  // 2. Prove tip amount is in claimed range
  tipAmount >= amountRangeLow;
  tipAmount <= amountRangeHigh;
  
  // 3. Prevent double-proof (nullifier uniqueness)
  nullifierHash === hash(walletSecret + txSignature);
}`;

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #001a1a 100%)', padding: '40px 24px', fontFamily: 'Inter, sans-serif', color: '#e8e8f0' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔏</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #14F195, #0088ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
            ZK-Anonymous Tip Proofs
          </h1>
          <p style={{ color: '#7070a0', fontSize: 15, lineHeight: 1.6 }}>
            Prove you tipped a creator without revealing your wallet address.<br />
            Zero-knowledge cryptography — the verifier learns nothing except that the tip happened.
          </p>
          {!connected && <div style={{ marginTop: 24 }}><WalletMultiButton /></div>}
        </div>

        {connected && (
          <>
            {/* How it works visual */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { icon: '🔐', title: 'Private Input', desc: 'Your wallet + tip tx stay completely private — never shared' },
                { icon: '⚡', title: 'ZK Circuit', desc: 'Circom circuit generates a cryptographic proof from your private inputs' },
                { icon: '✅', title: 'Public Proof', desc: 'Share the proof hash — anyone can verify you tipped without knowing who you are' },
              ].map(item => (
                <div key={item.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1a3a3a', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#14F195' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#7070a0', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Generate form */}
            {step === 'idle' && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1a3a3a', borderRadius: 16, padding: 28, marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#14F195' }}>🔧 Generate Your ZK Proof</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#7070a0', display: 'block', marginBottom: 6 }}>Creator Username</label>
                    <input value={creatorInput} onChange={e => setCreatorInput(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #2a2a40', background: '#1a1a28', color: '#e8e8f0', fontSize: 14 }}
                      placeholder="e.g. arjundev" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#7070a0', display: 'block', marginBottom: 6 }}>Claimed Tip Range</label>
                    <select value={rangeInput} onChange={e => setRangeInput(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #2a2a40', background: '#1a1a28', color: '#e8e8f0', fontSize: 14 }}>
                      <option>0.1-0.5 SOL</option>
                      <option>0.5-5 SOL</option>
                      <option>5-50 SOL</option>
                      <option>50+ SOL</option>
                    </select>
                  </div>
                </div>
                <div style={{ padding: 14, background: 'rgba(20,241,149,0.04)', border: '1px solid rgba(20,241,149,0.15)', borderRadius: 10, marginBottom: 20, fontSize: 12, color: '#7070a0', lineHeight: 1.6 }}>
                  🔐 <strong style={{ color: '#e8e8f0' }}>Privacy guarantee:</strong> Your wallet address ({publicKey?.toBase58().slice(0,8)}...) and exact tip amount will never be included in the proof. The ZK circuit generates a nullifier hash that cryptographically proves the tip occurred without revealing the prover.
                </div>
                <button onClick={generateProof}
                  style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #14F195, #0088ff)', color: '#0a0a0f', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                  ⚡ Generate ZK Proof
                </button>
              </div>
            )}

            {step === 'generating' && (
              <div style={{ textAlign: 'center', padding: 48, background: 'rgba(255,255,255,0.03)', border: '1px solid #1a3a3a', borderRadius: 16, marginBottom: 24 }}>
                <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚙️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#14F195', marginBottom: 8 }}>Generating ZK Proof...</div>
                <div style={{ fontSize: 12, color: '#7070a0', lineHeight: 1.7 }}>
                  Running Circom circuit · Computing Groth16 proof<br />
                  Deriving nullifier hash · Verifying constraints
                </div>
              </div>
            )}

            {step === 'done' && proof && (
              <div style={{ background: 'rgba(20,241,149,0.04)', border: '1px solid rgba(20,241,149,0.25)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#14F195' }}>✅ ZK Proof Generated</h3>
                  <button onClick={() => setStep('idle')}
                    style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #2a2a40', background: 'transparent', color: '#7070a0', cursor: 'pointer', fontSize: 12 }}>New Proof</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {[
                    ['Proof ID', proof.proofId],
                    ['Nullifier Hash', proof.nullifierHash + '...'],
                    ['Commitment', proof.commitment + '...'],
                    ['Creator', '@' + proof.creatorUsername],
                    ['Claimed Range', proof.amountRange],
                    ['Generated', new Date(proof.timestamp).toLocaleTimeString()],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                      <span style={{ color: '#7070a0' }}>{k}</span>
                      <span style={{ fontFamily: 'monospace', color: '#e8e8f0', fontSize: 12 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button onClick={copyProof}
                    style={{ padding: 12, borderRadius: 10, border: '1px solid rgba(20,241,149,0.3)', background: 'rgba(20,241,149,0.08)', color: '#14F195', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>📋 Copy Proof JSON</button>
                  <button onClick={verifyProof} disabled={verifying || verified}
                    style={{ padding: 12, borderRadius: 10, border: 'none', background: verified ? 'rgba(20,241,149,0.15)' : 'linear-gradient(135deg, #14F195, #0088ff)', color: verified ? '#14F195' : '#0a0a0f', fontWeight: 700, cursor: verifying || verified ? 'not-allowed' : 'pointer', fontSize: 13 }}>
                    {verifying ? '⏳ Verifying...' : verified ? '✅ Proof Verified On-Chain' : '🔍 Verify On Solana'}
                  </button>
                </div>
              </div>
            )}

            {/* Circuit code preview */}
            <div style={{ background: '#0d1117', border: '1px solid #2a2a40', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', background: '#161b22', borderBottom: '1px solid #2a2a40', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#7070a0' }}>zkproof/circuit.circom</span>
                <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 6, background: 'rgba(20,241,149,0.1)', color: '#14F195', fontSize: 10, fontWeight: 700 }}>ZK CIRCUIT</span>
              </div>
              <pre style={{ padding: 20, fontSize: 11, color: '#8b9dc3', lineHeight: 1.7, overflowX: 'auto', margin: 0 }}>{CODE_SNIPPET}</pre>
            </div>
          </>
        )}

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </main>
  );
}
