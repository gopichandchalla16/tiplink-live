'use client';
import { useState, useEffect } from 'react';

const INIT_STREAMS = [
  { id:'s1', name:'Arjun Dev', username:'arjundev', avatar:'👨‍💻', type:'🛠️ Solana tutorials', rate:0.05, subscribers:142, posts:8, subscribed:false, total:56.8, next:'Token-2022 deep dive', ai:'Highly consistent — 8 posts/month avg. Technical depth: 9.2/10. Engagement: High.' },
  { id:'s2', name:'Priya Music', username:'priyamusic', avatar:'🎵', type:'🎶 Original tracks', rate:0.02, subscribers:891, posts:4, subscribed:true, total:71.3, next:'Lo-fi study beats EP', ai:'Consistent bi-weekly releases. Audio quality improving. Listener retention: 87%.' },
  { id:'s3', name:'Rahul Builds', username:'rahulbuilds', avatar:'🔨', type:'📹 Build in public', rate:0.03, subscribers:234, posts:12, subscribed:false, total:84.2, next:'TipLink integration live', ai:'Most prolific creator this week. Ships frequently. Engagement trending +23% MoM.' },
];

export default function StreamsPage() {
  const [streams, setStreams] = useState(INIT_STREAMS);
  const [tab, setTab] = useState<'discover'|'mine'>('discover');
  const [busy, setBusy] = useState('');
  const [monthlySOL, setMonthlySOL] = useState(0);

  useEffect(()=>{
    const mine=streams.filter(s=>s.subscribed);
    setMonthlySOL(Math.round(mine.reduce((a,s)=>a+s.rate*s.posts,0)*100)/100);
  },[streams]);

  async function toggle(id:string){
    setBusy(id);
    await new Promise(r=>setTimeout(r,1800));
    setStreams(prev=>prev.map(s=>s.id===id?{...s,subscribed:!s.subscribed,subscribers:s.subscribed?s.subscribers-1:s.subscribers+1}:s));
    setBusy('');
  }

  const mine=streams.filter(s=>s.subscribed);
  const list=tab==='mine'?mine:streams;

  return (
    <main style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a0a0f,#0a001a)',padding:'40px 24px',fontFamily:'Inter,sans-serif',color:'#e8e8f0'}}>
      <div style={{maxWidth:840,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <a href="/" style={{color:'#9945FF',fontSize:13,textDecoration:'none'}}>← Back to Home</a>
          <div style={{fontSize:52,margin:'16px 0 8px'}}>🌊</div>
          <h1 style={{fontSize:28,fontWeight:900,background:'linear-gradient(135deg,#9945FF,#ff6b9d)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:'0 0 8px'}}>AI-Powered Tip Streams</h1>
          <p style={{color:'#7070a0',fontSize:14,lineHeight:1.6}}>Subscribe to creators with recurring micro-payments per content post.<br/>Gemini AI monitors output quality and recommends the best streams.</p>
        </div>

        {mine.length>0&&(
          <div style={{background:'linear-gradient(135deg,rgba(153,69,255,0.1),rgba(255,107,157,0.07))',border:'1px solid rgba(153,69,255,0.25)',borderRadius:14,padding:18,marginBottom:20,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {[['Active Streams',mine.length,''],['This Month',monthlySOL,' SOL'],['Posts Funded',mine.reduce((a,s)=>a+s.posts,0),'']].map(([label,val,unit])=>(
              <div key={label} style={{textAlign:'center'}}>
                <div style={{fontSize:24,fontWeight:900,color:'#9945FF'}}>{val}{unit}</div>
                <div style={{fontSize:10,color:'#6060a0',textTransform:'uppercase',letterSpacing:'0.5px',marginTop:2}}>{label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{display:'flex',gap:8,marginBottom:18}}>
          {(['discover','mine'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'7px 16px',borderRadius:9,border:`1px solid ${tab===t?'#9945FF':'#2a2a40'}`,background:tab===t?'rgba(153,69,255,0.12)':'rgba(255,255,255,0.03)',color:tab===t?'#9945FF':'#6060a0',fontWeight:600,cursor:'pointer',fontSize:12,textTransform:'capitalize'}}>
              {t==='mine'?`⚡ My Streams (${mine.length})`:'🔍 Discover'}
            </button>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {list.map(s=>(
            <div key={s.id} style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${s.subscribed?'rgba(153,69,255,0.35)':'#2a2a40'}`,borderRadius:16,padding:22,position:'relative'}}>
              {s.subscribed&&<div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#9945FF,#ff6b9d)',borderRadius:'16px 16px 0 0'}} />}
              <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:14}}>
                <div style={{fontSize:36,lineHeight:1}}>{s.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                    <span style={{fontSize:15,fontWeight:700}}>{s.name}</span>
                    <span style={{fontSize:11,color:'#6060a0'}}>@{s.username}</span>
                    {s.subscribed&&<span style={{padding:'2px 7px',borderRadius:9,background:'rgba(153,69,255,0.2)',color:'#9945FF',fontSize:9,fontWeight:700}}>SUBSCRIBED</span>}
                  </div>
                  <div style={{fontSize:12,color:'#9090b0'}}>{s.type}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:20,fontWeight:800,color:'#9945FF'}}>{s.rate} SOL</div>
                  <div style={{fontSize:10,color:'#6060a0'}}>per post</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:12}}>
                {[['👥',s.subscribers,'Subscribers'],['📝',s.posts+'/mo','Posts'],['💰',(s.rate*s.posts).toFixed(2)+' SOL','Est/Month'],['📦',s.total+' SOL','Total Paid']].map(([icon,val,label])=>(
                  <div key={label} style={{background:'rgba(255,255,255,0.03)',borderRadius:9,padding:'9px 6px',textAlign:'center'}}>
                    <div style={{fontSize:14}}>{icon}</div>
                    <div style={{fontSize:12,fontWeight:700,marginTop:2}}>{val}</div>
                    <div style={{fontSize:9,color:'#6060a0'}}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:'9px 12px',background:'rgba(153,69,255,0.05)',border:'1px solid rgba(153,69,255,0.15)',borderRadius:8,marginBottom:10,fontSize:11,color:'#9090b0',lineHeight:1.5}}>
                <strong style={{color:'#9945FF'}}>🤖 Gemini AI: </strong>{s.ai}
              </div>
              {s.next&&<div style={{padding:'7px 12px',background:'rgba(20,241,149,0.05)',border:'1px solid rgba(20,241,149,0.15)',borderRadius:8,marginBottom:12,fontSize:11,color:'#14F195'}}>📅 Next post: <strong>{s.next}</strong></div>}
              <button onClick={()=>toggle(s.id)} disabled={busy===s.id} style={{width:'100%',padding:12,borderRadius:10,border:s.subscribed?'1px solid rgba(255,77,109,0.3)':'none',background:busy===s.id?'#2a2a40':s.subscribed?'rgba(255,77,109,0.08)':'linear-gradient(135deg,#9945FF,#ff6b9d)',color:s.subscribed?'#ff4d6d':'white',fontWeight:700,cursor:busy===s.id?'not-allowed':'pointer',fontSize:13}}>
                {busy===s.id?'⏳ Processing on Solana..':s.subscribed?'⏸️ Cancel Stream':`⚡ Stream ${s.rate} SOL/post`}
              </button>
            </div>
          ))}
          {tab==='mine'&&mine.length===0&&(
            <div style={{textAlign:'center',padding:48,color:'#5050a0'}}>
              <div style={{fontSize:36,marginBottom:10}}>🌊</div>
              <p style={{fontSize:13}}>No active streams. Go to Discover and subscribe to a creator.</p>
            </div>
          )}
        </div>

        <div style={{marginTop:24,padding:18,background:'rgba(153,69,255,0.05)',border:'1px solid rgba(153,69,255,0.2)',borderRadius:12,fontSize:12,color:'#9090b0',lineHeight:1.7}}>
          <strong style={{color:'#9945FF'}}>⚙️ How TipStreams work: </strong>When a creator posts new content, a Vercel webhook triggers a Solana instruction that pulls micro-payments from all subscriber escrow accounts simultaneously. Gemini AI analyzes creator output weekly and adjusts recommendations. Cancel any stream instantly — unused balance returns to your wallet.
        </div>
      </div>
    </main>
  );
}
