'use client';
import { useState } from 'react';

const INIT_MARKETS = [
  { id:'m1', creator:'Arjun Dev', question:'Will Arjun ship his Solana SDK to mainnet by July 2026?', category:'💻 Dev', yesSOL:45.2, noSOL:12.8, endDate:'2026-07-15', status:'open', yourBet:null as {side:string,amount:number}|null },
  { id:'m2', creator:'Priya Music', question:'Will Priya reach 10k Spotify streams on debut album within 30 days?', category:'🎵 Music', yesSOL:78.5, noSOL:31.2, endDate:'2026-07-30', status:'open', yourBet:null as {side:string,amount:number}|null },
  { id:'m3', creator:'Rahul Builds', question:'Will Rahul complete all 10 tutorial videos before Aug 1?', category:'📹 Content', yesSOL:40.0, noSOL:18.0, endDate:'2026-08-01', status:'resolved_yes', yourBet:null as {side:string,amount:number}|null },
];

export default function PredictPage() {
  const [markets, setMarkets] = useState(INIT_MARKETS);
  const [placing, setPlacing] = useState('');
  const [amount, setAmount] = useState('1');

  async function placeBet(id: string, side: string) {
    setPlacing(id+side);
    await new Promise(r=>setTimeout(r,1800));
    setMarkets(prev=>prev.map(m=>m.id===id?{...m,yourBet:{side,amount:parseFloat(amount)},yesSOL:side==='yes'?m.yesSOL+parseFloat(amount):m.yesSOL,noSOL:side==='no'?m.noSOL+parseFloat(amount):m.noSOL}:m));
    setPlacing('');
  }

  return (
    <main style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a0a0f,#1a0f00)',padding:'40px 24px',fontFamily:'Inter,sans-serif',color:'#e8e8f0'}}>
      <div style={{maxWidth:820,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <a href="/" style={{color:'#F7931A',fontSize:13,textDecoration:'none'}}>← Back to Home</a>
          <div style={{fontSize:52,margin:'16px 0 8px'}}>🔮</div>
          <h1 style={{fontSize:28,fontWeight:900,background:'linear-gradient(135deg,#F7931A,#FFD700)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:'0 0 8px'}}>Creator Prediction Market</h1>
          <p style={{color:'#7070a0',fontSize:14,lineHeight:1.6}}>Tip + bet SOL on whether creators hit their goals.<br/>YES bettors split the pool on success. 100% on-chain, no custodian.</p>
        </div>
        {markets.map(m=>{
          const total=m.yesSOL+m.noSOL;
          const yesPct=Math.round((m.yesSOL/total)*100);
          const noPct=100-yesPct;
          const resolved=m.status!=='open';
          const rc=m.status==='resolved_yes'?'#14F195':'#ff4d6d';
          return (
            <div key={m.id} style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${resolved?rc+'40':'#2a2a40'}`,borderRadius:18,padding:26,marginBottom:18,position:'relative'}}>
              {resolved&&<div style={{position:'absolute',top:0,left:0,right:0,height:3,background:rc,borderRadius:'18px 18px 0 0'}} />}
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
                <span style={{padding:'2px 9px',borderRadius:20,fontSize:10,fontWeight:600,background:'rgba(247,147,26,0.15)',color:'#F7931A',border:'1px solid rgba(247,147,26,0.25)'}}>{m.category}</span>
                {resolved&&<span style={{padding:'2px 9px',borderRadius:20,fontSize:10,fontWeight:700,background:`${rc}20`,color:rc,border:`1px solid ${rc}40`}}>{m.status==='resolved_yes'?'✅ YES Won':'❌ NO Won'}</span>}
                <span style={{marginLeft:'auto',fontSize:11,color:'#6060a0'}}>Closes {m.endDate}</span>
              </div>
              <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{m.creator}</div>
              <div style={{fontSize:13,color:'#9090b0',lineHeight:1.5,marginBottom:16}}>❓ {m.question}</div>
              <div style={{marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5}}>
                  <span style={{color:'#14F195',fontWeight:700}}>YES {yesPct}% · {m.yesSOL.toFixed(1)} SOL</span>
                  <span style={{color:'#ff4d6d',fontWeight:700}}>{m.noSOL.toFixed(1)} SOL · {noPct}% NO</span>
                </div>
                <div style={{height:9,background:'#ff4d6d',borderRadius:5,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${yesPct}%`,background:'#14F195',borderRadius:5,transition:'width 0.8s'}} />
                </div>
                <div style={{textAlign:'center',fontSize:10,color:'#6060a0',marginTop:3}}>Pool: {total.toFixed(1)} SOL · Payout: {(total/(m.yesSOL||1)).toFixed(2)}x</div>
              </div>
              {!resolved&&(
                m.yourBet ? (
                  <div style={{textAlign:'center',padding:12,background:'rgba(20,241,149,0.08)',borderRadius:10,fontSize:13,color:'#14F195',fontWeight:600}}>✅ Bet placed — {m.yourBet.amount} SOL on {m.yourBet.side.toUpperCase()}. Locked in escrow.</div>
                ) : (
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} min="0.1" step="0.1" style={{width:80,padding:'8px 10px',borderRadius:8,border:'1px solid #2a2a40',background:'#1a1a28',color:'#e8e8f0',fontSize:13}} />
                    <button onClick={()=>placeBet(m.id,'yes')} disabled={!!placing} style={{flex:1,padding:11,borderRadius:9,border:'none',background:placing===m.id+'yes'?'#2a2a40':'linear-gradient(135deg,#14F195,#0ea866)',color:'#0a0a0f',fontWeight:800,cursor:placing?'not-allowed':'pointer',fontSize:13}}>{placing===m.id+'yes'?'⏳...':'📈 BET YES'}</button>
                    <button onClick={()=>placeBet(m.id,'no')} disabled={!!placing} style={{flex:1,padding:11,borderRadius:9,border:'none',background:placing===m.id+'no'?'#2a2a40':'linear-gradient(135deg,#ff4d6d,#c0392b)',color:'white',fontWeight:800,cursor:placing?'not-allowed':'pointer',fontSize:13}}>{placing===m.id+'no'?'⏳...':'📉 BET NO'}</button>
                  </div>
                )
              )}
            </div>
          );
        })}
        <div style={{padding:18,background:'rgba(247,147,26,0.05)',border:'1px solid rgba(247,147,26,0.2)',borderRadius:12,fontSize:12,color:'#9090b0',lineHeight:1.7}}>
          <strong style={{color:'#F7931A'}}>⚙️ On-Chain Logic: </strong>SOL bets lock in a Solana escrow program. When the creator submits proof (GitHub commit/Spotify link), an oracle verifies and auto-distributes winnings. If no proof by deadline, NO bettors claim the pool. 100% trustless.
        </div>
      </div>
    </main>
  );
}
