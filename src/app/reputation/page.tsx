'use client';
import { useState, useEffect } from 'react';

const TIERS = [
  { name: 'Bronze',  min: 0,    color: '#CD7F32', emoji: '🥉', perks: ['Basic tipper badge', 'Public tip history'] },
  { name: 'Silver',  min: 100,  color: '#C0C0C0', emoji: '🥈', perks: ['Silver frame on tips', 'Creator priority queue'] },
  { name: 'Gold',    min: 500,  color: '#FFD700', emoji: '🥇', perks: ['Gold animated badge', 'Exclusive creator DMs', 'Early content access'] },
  { name: 'Diamond', min: 2000, color: '#B9F2FF', emoji: '💎', perks: ['Diamond holographic NFT', 'DAO voting rights', 'Revenue share'] },
  { name: 'Legend',  min: 5000, color: '#9945FF', emoji: '👑', perks: ['Legend status', 'Co-creator opportunities', 'Protocol governance'] },
];

export default function ReputationPage() {
  const [wallet, setWallet] = useState('');
  const [score] = useState(847);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [txSig, setTxSig] = useState('');

  const tier = TIERS.slice().reverse().find(t => score >= t.min) || TIERS[0];
  const nextTier = TIERS.find(t => t.min > score);
  const progress = nextTier ? Math.round(((score - tier.min) / (nextTier.min - tier.min)) * 100) : 100;

  function connect() {
    setWallet('8xKp...9mNd');
    setConnected(true);
  }

  async function mintSBT() {
    setMinting(true);
    await new Promise(r => setTimeout(r, 2500));
    setTxSig('5xK9mNd...devnet');
    setMinted(true);
    setMinting(false);
  }

  return (
    <main style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a0a0f,#1a0a2e)',padding:'40px 24px',fontFamily:'Inter,sans-serif',color:'#e8e8f0'}}>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <a href="/" style={{color:'#9945FF',fontSize:13,textDecoration:'none'}}>← Back to Home</a>
          <div style={{fontSize:52,margin:'16px 0 8px'}}>🏅</div>
          <h1 style={{fontSize:28,fontWeight:900,background:'linear-gradient(135deg,#9945FF,#14F195)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:'0 0 8px'}}>SoulBound Tipper Reputation NFT</h1>
          <p style={{color:'#7070a0',fontSize:14,lineHeight:1.6}}>Every tip builds your permanent on-chain reputation score.<br/>Mint your SoulBound NFT — non-transferable proof of your supporter status.</p>
        </div>

        {!connected ? (
          <div style={{textAlign:'center',padding:40}}>
            <button onClick={connect} style={{padding:'14px 32px',borderRadius:12,border:'none',background:'linear-gradient(135deg,#9945FF,#14F195)',color:'white',fontSize:16,fontWeight:800,cursor:'pointer'}}>🔗 Connect Wallet (Demo)</button>
            <p style={{color:'#5050a0',fontSize:12,marginTop:12}}>Simulated Phantom wallet — no real transaction required for demo</p>
          </div>
        ) : (
          <>
            <div style={{background:'rgba(255,255,255,0.04)',border:`2px solid ${tier.color}40`,borderRadius:20,padding:28,marginBottom:20,textAlign:'center',boxShadow:`0 0 40px ${tier.color}15`}}>
              <div style={{fontSize:12,color:'#5050a0',marginBottom:4}}>Connected: {wallet}</div>
              <div style={{fontSize:60,margin:'8px 0'}}>{tier.emoji}</div>
              <div style={{fontSize:44,fontWeight:900,color:tier.color}}>{score}</div>
              <div style={{fontSize:18,fontWeight:700,color:tier.color,marginBottom:20}}>{tier.name} Tipper</div>
              {nextTier && (
                <div style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#6060a0',marginBottom:6}}>
                    <span>{tier.name} ({tier.min})</span><span>{nextTier.name} ({nextTier.min})</span>
                  </div>
                  <div style={{height:8,background:'#2a2a40',borderRadius:4,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${progress}%`,background:`linear-gradient(90deg,${tier.color},#14F195)`,borderRadius:4,transition:'width 1s ease'}} />
                  </div>
                  <div style={{fontSize:11,color:'#6060a0',marginTop:4}}>{progress}% to {nextTier.name}</div>
                </div>
              )}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                {[['💰','12.4 SOL','Total Tipped'],['🎨','23','Creators'],['🔥','14d','Streak']].map(([icon,val,label])=>(
                  <div key={label} style={{background:'rgba(255,255,255,0.04)',borderRadius:10,padding:12}}>
                    <div style={{fontSize:20}}>{icon}</div>
                    <div style={{fontSize:18,fontWeight:800}}>{val}</div>
                    <div style={{fontSize:9,color:'#6060a0',marginTop:2}}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid #2a2a40',borderRadius:14,padding:20,marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:700,color:tier.color,marginBottom:12}}>✨ {tier.name} Perks Unlocked</div>
              {tier.perks.map(p=>(<div key={p} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderBottom:'1px solid #1a1a28',fontSize:13}}><span style={{color:'#14F195'}}>✓</span>{p}</div>))}
            </div>

            {!minted ? (
              <button onClick={mintSBT} disabled={minting} style={{width:'100%',padding:15,borderRadius:12,border:'none',background:minting?'#2a2a40':`linear-gradient(135deg,${tier.color},#9945FF)`,color:'white',fontSize:15,fontWeight:700,cursor:minting?'not-allowed':'pointer'}}>
                {minting?'⏳ Minting on Solana devnet...':'🎖️ Mint SoulBound NFT (Token-2022 Non-Transferable)'}
              </button>
            ) : (
              <div style={{background:'rgba(20,241,149,0.08)',border:'1px solid rgba(20,241,149,0.3)',borderRadius:12,padding:20,textAlign:'center'}}>
                <div style={{fontSize:32,marginBottom:8}}>✅</div>
                <div style={{fontWeight:700,color:'#14F195',marginBottom:4}}>SoulBound NFT Minted on Solana!</div>
                <div style={{fontSize:11,color:'#6060a0'}}>Token-2022 · Non-Transferable · Tx: {txSig}</div>
                <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noreferrer" style={{display:'inline-block',marginTop:10,fontSize:12,color:'#9945FF'}}>View on Solana Explorer →</a>
              </div>
            )}
          </>
        )}

        <div style={{marginTop:32,background:'rgba(255,255,255,0.02)',border:'1px solid #2a2a40',borderRadius:14,padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:'#9945FF',marginBottom:12}}>⚙️ How It Works</div>
          {[
            ['1','Tip any creator → each SOL tip adds points: (SOL × 10) + (creators × 5) + (streak × 2)'],
            ['2','Reach a tier threshold → unlock exclusive perks automatically on-chain'],
            ['3','Mint your SoulBound NFT using Solana Token-2022 non-transferable extension'],
            ['4','Higher tiers unlock DAO voting, revenue share, and creator co-opportunities'],
          ].map(([n,t])=>(
            <div key={n} style={{display:'flex',gap:12,marginBottom:12}}>
              <div style={{width:24,height:24,borderRadius:'50%',background:'rgba(153,69,255,0.2)',border:'1px solid #9945FF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#9945FF',flexShrink:0}}>{n}</div>
              <p style={{fontSize:12,color:'#8080a0',lineHeight:1.5,margin:0}}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
