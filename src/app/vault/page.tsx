'use client';
import { useState } from 'react';

const DEMO_VAULTS = [
  { id:'v1', creatorName:'Arjun Dev', goal:'Launch open-source Solana SDK with 500 GitHub stars', targetSOL:50, lockedSOL:32.5, contributors:18, deadline:'2026-07-15', status:'active' },
  { id:'v2', creatorName:'Priya Music', goal:'Release debut album — 1000 pre-saves on Spotify', targetSOL:25, lockedSOL:25, contributors:41, deadline:'2026-06-30', status:'released' },
  { id:'v3', creatorName:'Rahul Builds', goal:'Ship TipLink tutorial series (10 videos)', targetSOL:15, lockedSOL:8.2, contributors:9, deadline:'2026-08-01', status:'active' },
];

export default function VaultPage() {
  const [vaults, setVaults] = useState(DEMO_VAULTS);
  const [selected, setSelected] = useState<string|null>(null);
  const [amount, setAmount] = useState('0.5');
  const [locking, setLocking] = useState(false);
  const [locked, setLocked] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  async function lockSOL(id: string) {
    setLocking(true);
    await new Promise(r=>setTimeout(r,2000));
    setVaults(prev=>prev.map(v=>v.id===id?{...v,lockedSOL:v.lockedSOL+parseFloat(amount),contributors:v.contributors+1}:v));
    setLocked(prev=>[...prev,id]);
    setLocking(false);
    setSelected(null);
  }

  async function createVault() {
    setCreating(true);
    await new Promise(r=>setTimeout(r,2000));
    setCreating(false);
    setCreated(true);
  }

  return (
    <main style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a0a0f,#0a1a2e)',padding:'40px 24px',fontFamily:'Inter,sans-serif',color:'#e8e8f0'}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <a href="/" style={{color:'#14F195',fontSize:13,textDecoration:'none'}}>← Back to Home</a>
          <div style={{fontSize:52,margin:'16px 0 8px'}}>🔒</div>
          <h1 style={{fontSize:28,fontWeight:900,background:'linear-gradient(135deg,#14F195,#9945FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:'0 0 8px'}}>TipLink Time-Lock Vault</h1>
          <p style={{color:'#7070a0',fontSize:14,lineHeight:1.6}}>Lock SOL tips in an on-chain Anchor escrow vault.<br/>Funds release only when creator hits their milestone — auto-refunds if they fail.</p>
        </div>

        <h2 style={{fontSize:14,fontWeight:700,color:'#14F195',marginBottom:14}}>📦 Active Vaults</h2>
        {vaults.map(v=>{
          const pct=Math.min(100,(v.lockedSOL/v.targetSOL)*100);
          const sc=v.status==='released'?'#14F195':v.status==='refunded'?'#ff4d6d':'#F7931A';
          return (
            <div key={v.id} style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${sc}25`,borderRadius:16,padding:24,marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{v.creatorName}</div>
                  <div style={{fontSize:12,color:'#9090b0',lineHeight:1.5}}>🎯 {v.goal}</div>
                </div>
                <span style={{padding:'3px 10px',borderRadius:20,fontSize:10,fontWeight:700,background:`${sc}20`,color:sc,border:`1px solid ${sc}40`,whiteSpace:'nowrap',marginLeft:12}}>
                  {v.status==='active'?'⏳ Active':v.status==='released'?'✅ Released':'↩️ Refunded'}
                </span>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#6060a0',marginBottom:5}}>
                  <span>Locked: <strong style={{color:'#14F195'}}>{v.lockedSOL} SOL</strong></span>
                  <span>Target: {v.targetSOL} SOL · {v.contributors} supporters · Deadline: {v.deadline}</span>
                </div>
                <div style={{height:7,background:'#1a1a28',borderRadius:4,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#9945FF,#14F195)',borderRadius:4}} />
                </div>
                <div style={{fontSize:10,color:'#6060a0',marginTop:3}}>{Math.round(pct)}% funded</div>
              </div>
              {v.status==='active' && (
                locked.includes(v.id) ? (
                  <div style={{textAlign:'center',padding:10,background:'rgba(20,241,149,0.08)',borderRadius:8,fontSize:12,color:'#14F195',fontWeight:600}}>✅ Your {amount} SOL is locked! Releases when goal is achieved.</div>
                ) : selected===v.id ? (
                  <div style={{display:'flex',gap:8}}>
                    <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} min="0.1" step="0.1" style={{flex:1,padding:'8px 12px',borderRadius:8,border:'1px solid #9945FF',background:'#1a1a28',color:'#e8e8f0',fontSize:13}} />
                    <button onClick={()=>lockSOL(v.id)} disabled={locking} style={{padding:'8px 18px',borderRadius:8,border:'none',background:locking?'#2a2a40':'linear-gradient(135deg,#9945FF,#14F195)',color:'white',fontWeight:700,cursor:locking?'not-allowed':'pointer',fontSize:12}}>{locking?'⏳ Locking...':'🔒 Lock SOL'}</button>
                    <button onClick={()=>setSelected(null)} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #2a2a40',background:'transparent',color:'#7070a0',cursor:'pointer',fontSize:12}}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={()=>setSelected(v.id)} style={{width:'100%',padding:11,borderRadius:10,border:'1px solid #9945FF40',background:'rgba(153,69,255,0.08)',color:'#9945FF',fontWeight:700,cursor:'pointer',fontSize:13}}>🔒 Lock SOL into this Vault</button>
                )
              )}
            </div>
          );
        })}

        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid #2a2a40',borderRadius:16,padding:24,marginTop:8}}>
          <div style={{fontSize:14,fontWeight:700,color:'#9945FF',marginBottom:16}}>➕ Create Your Vault</div>
          {created ? (
            <div style={{textAlign:'center',padding:20,background:'rgba(20,241,149,0.08)',borderRadius:10}}>
              <div style={{fontSize:28,marginBottom:8}}>🚀</div>
              <div style={{fontWeight:700,color:'#14F195'}}>Vault deployed on Solana devnet!</div>
              <div style={{fontSize:12,color:'#6060a0',marginTop:4}}>Anchor Program ID: VLT1...demo · Share your link to start collecting locked tips</div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <textarea value={newGoal} onChange={e=>setNewGoal(e.target.value)} rows={3} placeholder="Your goal/milestone e.g. Launch Solana SDK by July 2026" style={{padding:'10px 12px',borderRadius:8,border:'1px solid #2a2a40',background:'#1a1a28',color:'#e8e8f0',fontSize:13,resize:'vertical',fontFamily:'Inter,sans-serif'}} />
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <input type="number" placeholder="Target SOL" style={{padding:'10px 12px',borderRadius:8,border:'1px solid #2a2a40',background:'#1a1a28',color:'#e8e8f0',fontSize:13}} />
                <input type="date" style={{padding:'10px 12px',borderRadius:8,border:'1px solid #2a2a40',background:'#1a1a28',color:'#e8e8f0',fontSize:13}} />
              </div>
              <button onClick={createVault} disabled={creating||!newGoal} style={{padding:13,borderRadius:10,border:'none',background:creating?'#2a2a40':'linear-gradient(135deg,#14F195,#9945FF)',color:'white',fontSize:14,fontWeight:700,cursor:creating||!newGoal?'not-allowed':'pointer'}}>
                {creating?'⏳ Deploying Anchor Vault Program...':'🚀 Create Time-Lock Vault'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
