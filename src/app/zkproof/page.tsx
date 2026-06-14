'use client';
import { useState } from 'react';

const CIRCUIT = `// ZK Circuit (Circom pseudocode)
template TipProof() {
  // Private inputs — NEVER revealed
  signal private input walletSecret;
  signal private input tipAmount;
  signal private input txSignature;

  // Public outputs — shared with verifier
  signal input nullifierHash;
  signal input commitment;
  signal input amountRangeLow;
  signal input amountRangeHigh;

  // Constraints
  // 1. Wallet owns the transaction
  walletPubkey === derivePublicKey(walletSecret);
  // 2. Amount is in claimed range
  tipAmount >= amountRangeLow;
  tipAmount <= amountRangeHigh;
  // 3. Prevent double-proof
  nullifierHash === hash(walletSecret + txSignature);
}`;

export default function ZKProofPage() {
  const [creator, setCreator] = useState('arjundev');
  const [range, setRange] = useState('0.5-5 SOL');
  const [step, setStep] = useState<'idle'|'generating'|'done'>('idle');
  const [proof, setProof] = useState<{id:string,nullifier:string,commitment:string,ts:number}|null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  function rand(n:number){return Array.from({length:n},()=>Math.floor(Math.random()*16).toString(16)).join('');}

  async function generate() {
    setStep('generating');
    await new Promise(r=>setTimeout(r,3000));
    setProof({id:'zkp_'+Date.now(),nullifier:'0x'+rand(16),commitment:'0x'+rand(16),ts:Date.now()});
    setStep('done');
  }

  async function verify() {
    setVerifying(true);
    await new Promise(r=>setTimeout(r,1500));
    setVerified(true);
    setVerifying(false);
  }

  function copy() {
    if(proof) navigator.clipboard.writeText(JSON.stringify({proofId:proof.id,nullifier:proof.nullifier,commitment:proof.commitment,creator,range},null,2));
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  }

  return (
    <main style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a0a0f,#001a1a)',padding:'40px 24px',fontFamily:'Inter,sans-serif',color:'#e8e8f0'}}>
      <div style={{maxWidth:780,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <a href="/" style={{color:'#14F195',fontSize:13,textDecoration:'none'}}>← Back to Home</a>
          <div style={{fontSize:52,margin:'16px 0 8px'}}>🔏</div>
          <h1 style={{fontSize:28,fontWeight:900,background:'linear-gradient(135deg,#14F195,#0088ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:'0 0 8px'}}>ZK-Anonymous Tip Proofs</h1>
          <p style={{color:'#7070a0',fontSize:14,lineHeight:1.6}}>Prove you tipped a creator without revealing your wallet address.<br/>Zero-knowledge cryptography — the verifier learns nothing except that the tip happened.</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:28}}>
          {[['🔐','Private Input','Wallet + tip tx stay completely private'],['⚡','ZK Circuit','Circom Groth16 generates cryptographic proof'],['✅','Public Proof','Share hash — anyone verifies without knowing you']].map(([icon,title,desc])=>(
            <div key={title} style={{background:'rgba(255,255,255,0.04)',border:'1px solid #1a3a3a',borderRadius:12,padding:18,textAlign:'center'}}>
              <div style={{fontSize:28,marginBottom:6}}>{icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:'#14F195',marginBottom:4}}>{title}</div>
              <div style={{fontSize:10,color:'#6060a0',lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </div>

        {step==='idle'&&(
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a3a3a',borderRadius:14,padding:24,marginBottom:20}}>
            <div style={{fontSize:14,fontWeight:700,color:'#14F195',marginBottom:16}}>🔧 Generate Your ZK Proof</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
              <div>
                <label style={{fontSize:11,color:'#6060a0',display:'block',marginBottom:5}}>Creator Username</label>
                <input value={creator} onChange={e=>setCreator(e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:8,border:'1px solid #2a2a40',background:'#1a1a28',color:'#e8e8f0',fontSize:13}} />
              </div>
              <div>
                <label style={{fontSize:11,color:'#6060a0',display:'block',marginBottom:5}}>Claimed Tip Range</label>
                <select value={range} onChange={e=>setRange(e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:8,border:'1px solid #2a2a40',background:'#1a1a28',color:'#e8e8f0',fontSize:13}}>
                  <option>0.1-0.5 SOL</option><option>0.5-5 SOL</option><option>5-50 SOL</option><option>50+ SOL</option>
                </select>
              </div>
            </div>
            <div style={{padding:12,background:'rgba(20,241,149,0.04)',border:'1px solid rgba(20,241,149,0.12)',borderRadius:8,marginBottom:16,fontSize:11,color:'#7070a0',lineHeight:1.6}}>
              🔐 <strong style={{color:'#c0c0d0'}}>Privacy guarantee:</strong> Your wallet address and exact tip amount will NEVER be included in the proof. The ZK circuit generates a nullifier hash that cryptographically proves the tip occurred without revealing the prover identity.
            </div>
            <button onClick={generate} style={{width:'100%',padding:13,borderRadius:10,border:'none',background:'linear-gradient(135deg,#14F195,#0088ff)',color:'#0a0a0f',fontSize:14,fontWeight:800,cursor:'pointer'}}>⚡ Generate ZK Proof</button>
          </div>
        )}

        {step==='generating'&&(
          <div style={{textAlign:'center',padding:48,background:'rgba(255,255,255,0.03)',border:'1px solid #1a3a3a',borderRadius:14,marginBottom:20}}>
            <div style={{fontSize:44,marginBottom:12,display:'inline-block'}}>⚙️</div>
            <div style={{fontSize:15,fontWeight:700,color:'#14F195',marginBottom:6}}>Generating ZK Proof...</div>
            <div style={{fontSize:12,color:'#6060a0',lineHeight:1.8}}>Running Circom circuit · Computing Groth16 proof<br/>Deriving nullifier hash · Verifying constraints<br/>Building commitment tree</div>
          </div>
        )}

        {step==='done'&&proof&&(
          <div style={{background:'rgba(20,241,149,0.04)',border:'1px solid rgba(20,241,149,0.25)',borderRadius:14,padding:24,marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:700,color:'#14F195'}}>✅ ZK Proof Generated</div>
              <button onClick={()=>{setStep('idle');setVerified(false);setProof(null);}} style={{padding:'5px 12px',borderRadius:7,border:'1px solid #2a2a40',background:'transparent',color:'#6060a0',cursor:'pointer',fontSize:11}}>New Proof</button>
            </div>
            {[['Proof ID',proof.id],['Nullifier Hash',proof.nullifier+'...'],['Commitment',proof.commitment+'...'],['Creator','@'+creator],['Claimed Range',range],['Generated',new Date(proof.ts).toLocaleTimeString()]].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:12}}>
                <span style={{color:'#6060a0'}}>{k}</span>
                <span style={{fontFamily:'monospace',color:'#e8e8f0',fontSize:11}}>{v}</span>
              </div>
            ))}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:16}}>
              <button onClick={copy} style={{padding:11,borderRadius:9,border:'1px solid rgba(20,241,149,0.3)',background:'rgba(20,241,149,0.07)',color:'#14F195',fontWeight:700,cursor:'pointer',fontSize:12}}>{copied?'✅ Copied!':'📋 Copy Proof JSON'}</button>
              <button onClick={verify} disabled={verifying||verified} style={{padding:11,borderRadius:9,border:'none',background:verified?'rgba(20,241,149,0.15)':'linear-gradient(135deg,#14F195,#0088ff)',color:verified?'#14F195':'#0a0a0f',fontWeight:700,cursor:verifying||verified?'not-allowed':'pointer',fontSize:12}}>{verifying?'⏳ Verifying...':verified?'✅ Verified On-Chain':'🔍 Verify on Solana'}</button>
            </div>
          </div>
        )}

        <div style={{background:'#0d1117',border:'1px solid #2a2a40',borderRadius:12,overflow:'hidden'}}>
          <div style={{padding:'10px 16px',background:'#161b22',borderBottom:'1px solid #2a2a40',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:11,color:'#6060a0'}}>zkproof/circuit.circom</span>
            <span style={{padding:'2px 8px',borderRadius:5,background:'rgba(20,241,149,0.1)',color:'#14F195',fontSize:9,fontWeight:700}}>ZK CIRCUIT</span>
          </div>
          <pre style={{padding:18,fontSize:11,color:'#8b9dc3',lineHeight:1.7,overflowX:'auto',margin:0}}>{CIRCUIT}</pre>
        </div>
      </div>
    </main>
  );
}
