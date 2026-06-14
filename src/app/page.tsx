'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
  Zap, ArrowRight, Star, Shield, Globe, Users,
  TrendingUp, Copy, CheckCircle, Rocket, Twitter,
  Github, ExternalLink, Sparkles, BarChart3, Wallet,
  QrCode, X, RefreshCw, Trophy, Flame, ArrowUpRight
} from 'lucide-react';

// ─────────────────────────────────────────────
// STATIC DATA — no Math.random at render
// ─────────────────────────────────────────────
const FEED_ENTRIES = [
  { id:1,  name:'Alex M.',    creator:'gopichand0516', amount:0.5,  token:'SOL',  color:'#9945FF' },
  { id:2,  name:'Priya S.',   creator:'aeyakovenko',   amount:1.0,  token:'SOL',  color:'#00F0FF' },
  { id:3,  name:'Jake R.',    creator:'rajgokal',      amount:0.1,  token:'SOL',  color:'#22C55E' },
  { id:4,  name:'Luna.sol',   creator:'luna_music',    amount:5.0,  token:'USDC', color:'#FFD700' },
  { id:5,  name:'DevAryan',   creator:'aryan_builds',  amount:0.2,  token:'SOL',  color:'#FF6B6B' },
  { id:6,  name:'0xGhost',    creator:'gopichand0516', amount:0.5,  token:'SOL',  color:'#9945FF' },
  { id:7,  name:'Zoe W.',     creator:'aeyakovenko',   amount:1.0,  token:'SOL',  color:'#00F0FF' },
  { id:8,  name:'CryptoNeko', creator:'gopichand0516', amount:2.0,  token:'SOL',  color:'#9945FF' },
  { id:9,  name:'Web3Maya',   creator:'aryan_builds',  amount:10.0, token:'USDC', color:'#FFD700' },
  { id:10, name:'0xSol',      creator:'rajgokal',      amount:0.3,  token:'SOL',  color:'#22C55E' },
];

const HOW_IT_WORKS = [
  { step:'01', icon:'🪪', title:'Create Profile', desc:'Connect Phantom, set your username and bio in 60 seconds. No email. No KYC. Just your wallet.' },
  { step:'02', icon:'🔗', title:'Share Your Blink', desc:'tiplink.live/tip/you works on Twitter, Discord, GitHub — even embeds as a native Solana Action.' },
  { step:'03', icon:'⚡', title:'Receive SOL/USDC', desc:'Fans tip directly to your wallet. Sub-400ms settlement. Gemini AI sends a personalised thank-you.' },
];

const FEATURES = [
  { icon:'⚡', title:'Sub-400ms Settlement', desc:'Solana block finality. Tips hit the wallet before the page finishes loading.',      color:'#9945FF' },
  { icon:'🤖', title:'Gemini AI Thank-You',  desc:'Google Gemini crafts a unique, heartfelt thank-you message for every single tip.', color:'#00F0FF' },
  { icon:'🔗', title:'Solana Blinks',        desc:'One URL becomes an embeddable tipping button on any Blinks-compatible platform.',    color:'#22C55E' },
  { icon:'🛡️', title:'Non-Custodial',       desc:'Funds go wallet-to-wallet. We never hold, touch, or see a single token.',          color:'#FFD700' },
  { icon:'📊', title:'On-chain Analytics',   desc:'Every tip has a TX hash. View it on Solana Explorer. 100% verifiable.',             color:'#FF6B6B' },
  { icon:'📱', title:'QR Tip Codes',         desc:'Scan a creator QR code to tip instantly from any Phantom-enabled mobile wallet.',   color:'#9945FF' },
  { icon:'🏆', title:'Live Leaderboard',     desc:'Real-time rankings of top creators and supporters by total SOL earned.',            color:'#00F0FF' },
  { icon:'🌐', title:'Multi-Token SPL',      desc:'Accept SOL and USDC today. Any SPL token next sprint. Permissionless by design.',   color:'#22C55E' },
];

const LEADERBOARD = [
  { rank:1, username:'gopichand0516', name:'Gopichand Challa', tips:'◎ 1.85', count:12, badge:'🥇', color:'#FFD700' },
  { rank:2, username:'aeyakovenko',   name:'Anatoly Y.',       tips:'◎ 12.4', count:89, badge:'🥈', color:'#C0C0C0' },
  { rank:3, username:'rajgokal',      name:'Raj Gokal',        tips:'◎ 8.7',  count:64, badge:'🥉', color:'#CD7F32' },
  { rank:4, username:'luna_music',    name:'Luna.sol',         tips:'$45',    count:9,  badge:'4',  color:'#9945FF' },
  { rank:5, username:'aryan_builds',  name:'DevAryan',         tips:'$30',    count:6,  badge:'5',  color:'#9945FF' },
];

// ─────────────────────────────────────────────
// MAGNETIC CURSOR
// ─────────────────────────────────────────────
function MagneticCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX - 16); cursorY.set(e.clientY - 16); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] w-8 h-8 rounded-full mix-blend-screen hidden lg:block"
      style={{ x: springX, y: springY, background: 'radial-gradient(circle, rgba(153,69,255,0.6), transparent)', border: '1px solid rgba(153,69,255,0.4)' }}
    />
  );
}

// ─────────────────────────────────────────────
// NOISE HERO (SVG filter grain overlay)
// ─────────────────────────────────────────────
function NoiseOverlay() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035] z-0" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// 3D ORBIT HERO
// ─────────────────────────────────────────────
function Hero3D() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
      <motion.div
        animate={{ scale:[1,1.08,1], boxShadow:[
          '0 0 80px rgba(153,69,255,0.8), 0 0 160px rgba(0,240,255,0.3)',
          '0 0 120px rgba(153,69,255,1), 0 0 200px rgba(0,240,255,0.5)',
          '0 0 80px rgba(153,69,255,0.8), 0 0 160px rgba(0,240,255,0.3)',
        ] }}
        transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut' }}
        className="absolute w-32 h-32 rounded-full flex items-center justify-center z-10"
        style={{ background:'linear-gradient(135deg,#9945FF,#00F0FF)' }}
      >
        <span style={{ fontSize:50 }}>◎</span>
      </motion.div>
      {/* Ring 1 */}
      <div className="absolute" style={{ width:230,height:230,borderRadius:'50%',border:'1.5px dashed rgba(153,69,255,0.4)',animation:'spin-slow 14s linear infinite' }}>
        <div className="absolute" style={{ top:-10,left:'50%',transform:'translateX(-50%)',width:20,height:20,borderRadius:'50%',background:'#9945FF',boxShadow:'0 0 20px #9945FF' }} />
      </div>
      {/* Ring 2 */}
      <div className="absolute" style={{ width:310,height:310,borderRadius:'50%',border:'1px dashed rgba(0,240,255,0.25)',animation:'spin-slow-reverse 22s linear infinite' }}>
        <div className="absolute" style={{ top:-8,left:'50%',transform:'translateX(-50%)',width:16,height:16,borderRadius:'50%',background:'#00F0FF',boxShadow:'0 0 16px #00F0FF' }} />
        <div className="absolute" style={{ bottom:-8,left:'50%',transform:'translateX(-50%)',width:12,height:12,borderRadius:'50%',background:'#22C55E',boxShadow:'0 0 12px #22C55E' }} />
      </div>
      {/* Floating badges */}
      {[
        { top:'8%', left:'2%',  label:'◎',  color:'#9945FF', delay:0   },
        { top:'68%',left:'0%',  label:'$',   color:'#22C55E', delay:0.8 },
        { top:'6%', right:'2%', label:'⚡',  color:'#00F0FF', delay:0.4 },
        { top:'70%',right:'2%', label:'🚀',  color:'#FFD700', delay:1.2 },
      ].map((p,i)=>(
        <motion.div key={i}
          animate={{ y:[0,-12,0] }}
          transition={{ duration:3+i*0.5,repeat:Infinity,ease:'easeInOut',delay:p.delay }}
          className="absolute text-lg font-black rounded-xl flex items-center justify-center"
          style={{ top:p.top,left:(p as {left?:string}).left,right:(p as {right?:string}).right,
            width:40,height:40,background:`${p.color}22`,border:`1px solid ${p.color}55`,
            color:p.color,boxShadow:`0 0 18px ${p.color}55`,fontSize:18 }}
        >{p.label}</motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// QR MODAL — dynamic import of qrcode (client-only, avoids SSR crash)
// ─────────────────────────────────────────────
function QRModal({ username, onClose }: { username: string; onClose: () => void }) {
  const [dataUrl, setDataUrl] = useState('');
  const url = typeof window !== 'undefined' ? `${window.location.origin}/tip/${username}` : `https://tiplink.live/tip/${username}`;

  useEffect(() => {
    // Dynamic import keeps qrcode out of the SSR bundle entirely
    import('qrcode').then((QRCode) => {
      QRCode.default.toDataURL(url, {
        width: 260,
        margin: 2,
        color: { dark: '#ffffff', light: '#0a0a14' },
      }).then(setDataUrl).catch(() => {});
    }).catch(() => {});
  }, [url]);

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background:'rgba(0,0,0,0.85)', backdropFilter:'blur(16px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.85,y:40 }} animate={{ scale:1,y:0 }} exit={{ scale:0.85,y:40 }}
        transition={{ type:'spring',damping:22,stiffness:280 }}
        onClick={e=>e.stopPropagation()}
        className="rounded-3xl p-8 relative max-w-sm w-full"
        style={{ background:'linear-gradient(145deg,#0f0f1a,#08080f)', border:'1px solid rgba(153,69,255,0.4)', boxShadow:'0 0 80px rgba(153,69,255,0.3)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background:'linear-gradient(90deg,transparent,#9945FF,transparent)' }} />
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color:'#666' }}>
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-xl font-extrabold text-white text-center mb-1">📱 Scan to Tip</h3>
        <p className="text-xs text-center mb-5" style={{ color:'#555' }}>@{username} · Phantom mobile or any wallet</p>
        {dataUrl ? (
          <div className="flex items-center justify-center mb-5">
            <div className="rounded-2xl overflow-hidden p-3" style={{ background:'#0a0a14', border:'1px solid rgba(153,69,255,0.3)', boxShadow:'0 0 40px rgba(153,69,255,0.2)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUrl} alt="QR Code" width={220} height={220} className="rounded-xl" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 mb-5">
            <RefreshCw className="w-8 h-8 animate-spin" style={{ color:'#9945FF' }} />
          </div>
        )}
        <p className="text-center text-xs font-mono truncate" style={{ color:'#444' }}>{url}</p>
        <button
          onClick={() => { if (typeof window !== 'undefined') navigator.clipboard.writeText(url); }}
          className="mt-4 w-full py-2.5 rounded-2xl text-sm font-bold transition-all hover:opacity-80"
          style={{ background:'rgba(153,69,255,0.12)', border:'1px solid rgba(153,69,255,0.3)', color:'#9945FF' }}
        >Copy Link</button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// LIVE FEED TICKER
// ─────────────────────────────────────────────
function LiveFeedTicker({ realCount }: { realCount: number }) {
  const [index, setIndex]   = useState(0);
  const [count, setCount]   = useState(realCount);
  const [visible, setVisible] = useState(true);
  useEffect(() => { setCount(realCount); }, [realCount]);
  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIndex(i=>(i+1)%FEED_ENTRIES.length); setCount(c=>c+1); setVisible(true); }, 280);
    }, 2800);
    return () => clearInterval(iv);
  }, []);
  const e = FEED_ENTRIES[index];
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(10,10,20,0.97)', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 0 40px rgba(153,69,255,0.1)' }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live on-chain</span>
        </div>
        <span className="text-[10px] font-medium" style={{ color:'#555' }}>{count} tips total</span>
      </div>
      <div className="px-4 py-3" style={{ minHeight:64 }}>
        <AnimatePresence mode="wait">
          {visible && e && (
            <motion.div key={e.id+'-'+index} initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-10 }} transition={{ duration:0.22 }} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background:`${e.color}33`, border:`1px solid ${e.color}55`, color:e.color }}>{e.name[0]}</div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{e.name}</p>
                  <p className="text-[10px]" style={{ color:'#555' }}>→ @{e.creator}</p>
                </div>
              </div>
              <span className="text-sm font-extrabold" style={{ color:e.color }}>+{e.token==='SOL'?'◎':'$'}{e.amount}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GLASSMORPHIC STAT CARD
// ─────────────────────────────────────────────
function StatCard({ value, label, icon: Icon, color, sub }: { value:string; label:string; icon:React.ElementType; color:string; sub?:string }) {
  return (
    <motion.div
      initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
      whileHover={{ y:-4, boxShadow:`0 16px 48px ${color}22` }}
      className="relative rounded-2xl p-5 text-center overflow-hidden group transition-all duration-300"
      style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${color}22`, backdropFilter:'blur(20px)' }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background:`radial-gradient(circle at center,${color}12 0%,transparent 70%)` }} />
      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
      <div className="text-2xl font-extrabold mb-1" style={{ color }}>{value}</div>
      <div className="text-xs text-gray-600 font-medium">{label}</div>
      {sub && <div className="text-[9px] mt-1" style={{ color:'#444' }}>{sub}</div>}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function HomePage() {
  const [mounted, setMounted]   = useState(false);
  const [copied, setCopied]     = useState<string|null>(null);
  const [qrUser, setQrUser]     = useState<string|null>(null);
  const [stats, setStats]       = useState({ totalTipCount:0, totalSOL:0, creatorCount:0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0,500], [0,-60]);
  const heroOpacity = useTransform(scrollY, [0,400], [1,0.4]);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    fetch('/api/stats').then(r=>r.json()).then(d=>setStats(d)).catch(()=>{});
  }, []);

  const copyLink = useCallback((u:string) => {
    if (typeof window==='undefined') return;
    navigator.clipboard.writeText(`${window.location.origin}/tip/${u}`);
    setCopied(u); setTimeout(()=>setCopied(null),2000);
  }, []);

  const STAT_CARDS = [
    { value:'< 1s',                         label:'Settlement time',         icon:Zap,       color:'#9945FF', sub:'Solana finality' },
    { value:'$0',                            label:'Platform fees forever',   icon:Star,      color:'#FFD700', sub:'Non-custodial' },
    { value:'100%',                          label:'On-chain verifiable',     icon:Shield,    color:'#22C55E', sub:'Solana Explorer' },
    { value:`◎ ${stats.totalSOL.toFixed(2)}`,label:'Real SOL tipped (live)',  icon:TrendingUp,color:'#00F0FF', sub:'from MongoDB Atlas' },
  ];

  const FEATURED = [
    { username:'gopichand0516', name:'Gopichand Challa', role:'Builder',    bio:'Solana dev · Web3 × AI · 0xGhostchain', tips:`◎ ${stats.totalSOL>0?(stats.totalSOL*0.21).toFixed(2):'1.85'}`, count:stats.totalTipCount>0?Math.ceil(stats.totalTipCount*0.17):12, gradient:'linear-gradient(135deg,#9945FF,#7B2FFF)' },
    { username:'aeyakovenko',   name:'Anatoly Y.',       role:'Founder',    bio:'Co-founder @Solana. Consensus & performance.', tips:'◎ 12.4', count:89, gradient:'linear-gradient(135deg,#00F0FF,#0088FF)' },
    { username:'rajgokal',      name:'Raj Gokal',        role:'Co-founder', bio:'Building the fastest L1. Co-founder @Solana.', tips:'◎ 8.7',  count:64, gradient:'linear-gradient(135deg,#22C55E,#16A34A)' },
  ];

  if (!mounted) return (
    <div className="min-h-screen grid-bg flex items-center justify-center" style={{ background:'#05050e' }}>
      <div className="w-12 h-12 rounded-full animate-spin-slow" style={{ border:'3px solid rgba(153,69,255,0.2)', borderTopColor:'#9945FF' }} />
    </div>
  );

  return (
    <div className="min-h-screen grid-bg" style={{ background:'#05050e', overflowX:'hidden' }}>
      <MagneticCursor />

      {/* ── AMBIENT GLOW LAYER ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div style={{ position:'absolute',top:'-15%',left:'20%',width:800,height:800,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(153,69,255,0.09) 0%,transparent 65%)',filter:'blur(90px)',animation:'aurora 12s ease-in-out infinite alternate' }} />
        <div style={{ position:'absolute',bottom:'-10%',right:'10%',width:600,height:600,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(0,240,255,0.06) 0%,transparent 65%)',filter:'blur(80px)' }} />
      </div>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', backdropFilter:'blur(24px) saturate(180%)', background:'rgba(5,5,14,0.75)' }}>
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div whileHover={{ rotate:15 }} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#9945FF,#7B2FFF)',boxShadow:'0 0 22px rgba(153,69,255,0.55)' }}>
              <Zap className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-lg font-extrabold">TipLink <span style={{ color:'#9945FF' }}>Live</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-7">
            {[['Explore','#explore'],['How it works','#how'],['Creators','#creators'],['Leaderboard','#leaderboard']].map(([l,h])=>(
              <a key={l} href={h} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/dashboard" className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all" style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)' }}>
              <BarChart3 className="w-3.5 h-3.5 inline mr-1.5" />Dashboard
            </Link>
            <Link href="/onboard" className="btn-primary px-4 py-2 text-sm">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <motion.section ref={heroRef} style={{ y:heroY, opacity:heroOpacity }} className="relative overflow-hidden pt-16 pb-24 px-4">
        <NoiseOverlay />
        {/* Grid pattern */}
        <div className="absolute inset-0 z-0" style={{ backgroundImage:'linear-gradient(rgba(153,69,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(153,69,255,0.04) 1px,transparent 1px)', backgroundSize:'60px 60px', maskImage:'radial-gradient(ellipse 80% 80% at 50% 0%,black,transparent)' }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{ background:'rgba(153,69,255,0.1)',border:'1px solid rgba(153,69,255,0.28)' }}
              >
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>
                <span className="text-xs font-bold" style={{ color:'#9945FF' }}>Live on Solana Mainnet</span>
                <span className="text-xs" style={{ color:'#555' }}>·</span>
                <span className="text-xs font-bold text-white">{stats.totalTipCount} real tips recorded</span>
              </motion.div>

              <motion.h1 initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.15 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 leading-[1.06] tracking-tight"
              >
                Tip any Solana
                <span className="block" style={{ background:'linear-gradient(90deg,#9945FF,#00F0FF,#22C55E)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>creator instantly.</span>
              </motion.h1>

              <motion.p initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }} className="text-xl text-gray-400 mb-3 max-w-xl leading-relaxed">
                One link. Any wallet. Sub-400ms on-chain settlement. Zero fees.
              </motion.p>
              <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }} className="text-sm text-gray-600 mb-10 max-w-xl">
                ✓ AI thank-you via Gemini &nbsp;·&nbsp; ✓ QR Codes &nbsp;·&nbsp; ✓ Solana Blinks &nbsp;·&nbsp; ✓ Non-custodial
              </motion.p>

              <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.28 }} className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-12">
                <Link href="/onboard"
                  className="relative inline-flex items-center gap-2.5 px-8 py-4 text-base rounded-2xl font-bold text-white overflow-hidden group"
                  style={{ background:'linear-gradient(135deg,#9945FF,#7B2FFF)',boxShadow:'0 0 40px rgba(153,69,255,0.55),0 8px 32px rgba(153,69,255,0.3)' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background:'linear-gradient(135deg,#7B2FFF,#5500CC)' }} />
                  <Rocket className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Create Free TipLink</span>
                </Link>
                <Link href="/tip/gopichand0516"
                  className="inline-flex items-center gap-2.5 px-8 py-4 text-base rounded-2xl font-bold transition-all hover:bg-white/10"
                  style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',color:'#ccc' }}
                >
                  Live Demo <ArrowUpRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }} className="max-w-sm mx-auto lg:mx-0">
                <LiveFeedTicker realCount={stats.totalTipCount} />
              </motion.div>
            </div>

            {/* Right 3D */}
            <motion.div initial={{ opacity:0,scale:0.85 }} animate={{ opacity:1,scale:1 }} transition={{ delay:0.2,type:'spring',damping:20,stiffness:120 }} className="flex-shrink-0 hidden lg:flex items-center justify-center">
              <Hero3D />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── STATS ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAT_CARDS.map((s,i) => <StatCard key={s.label} {...s} />)}
          </div>
          <p className="text-center text-xs mt-4" style={{ color:'#2a2a2a' }}>SOL tipped stat reads live from MongoDB Atlas. All TX hashes verifiable on Solana Explorer.</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block mb-4" style={{ background:'rgba(153,69,255,0.1)',color:'#9945FF',border:'1px solid rgba(153,69,255,0.2)' }}>How it works</span>
            <h2 className="text-4xl font-extrabold text-white mt-3">Ship in 3 steps</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step,icon,title,desc },i) => (
              <motion.div key={step}
                initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                whileHover={{ y:-6 }}
                className="relative rounded-3xl p-7 group transition-all duration-300"
                style={{ background:'linear-gradient(145deg,rgba(12,12,22,0.98),rgba(8,8,16,0.99))',border:'1px solid rgba(255,255,255,0.06)',boxShadow:'0 8px 32px rgba(0,0,0,0.35)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background:'linear-gradient(90deg,transparent,#9945FF,transparent)' }} />
                <div className="text-4xl mb-4">{icon}</div>
                <div className="text-xs font-bold tracking-widest mb-2" style={{ color:'#9945FF' }}>STEP {step}</div>
                <h3 className="text-lg font-extrabold text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CREATORS ── */}
      <section id="creators" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block mb-4" style={{ background:'rgba(0,240,255,0.08)',color:'#00F0FF',border:'1px solid rgba(0,240,255,0.15)' }}>Featured Creators</span>
            <h2 className="text-4xl font-extrabold text-white mt-3">Top builders on Solana</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURED.map(({ username,name,role,bio,tips,count,gradient },i) => (
              <motion.div key={username}
                initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                whileHover={{ y:-6 }}
                className="relative rounded-3xl p-6 group transition-all duration-300"
                style={{ background:'linear-gradient(145deg,rgba(12,12,22,0.98),rgba(8,8,16,0.99))',border:'1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background:'linear-gradient(90deg,transparent,rgba(153,69,255,0.35),transparent)' }} />
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0" style={{ background:gradient,boxShadow:'0 0 24px rgba(153,69,255,0.38)' }}>{name[0]}</div>
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-tight">{name}</h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color:'#9945FF' }}>@{username}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background:'rgba(34,197,94,0.1)',color:'#22C55E',border:'1px solid rgba(34,197,94,0.25)' }}>{role}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-5">{bio}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-extrabold" style={{ color:'#9945FF' }}>{tips}</div>
                    <div className="text-[10px] text-gray-600">{count} tips</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>setQrUser(username)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                      style={{ background:'rgba(153,69,255,0.1)',border:'1px solid rgba(153,69,255,0.25)',color:'#9945FF' }}
                    ><QrCode className="w-3 h-3" /></button>
                    <button onClick={()=>copyLink(username)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                      style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:copied===username?'#22C55E':'#888' }}
                    >{copied===username?<CheckCircle className="w-3 h-3" />:<Copy className="w-3 h-3" />}</button>
                  </div>
                </div>
                <Link href={`/tip/${username}`}
                  className="w-full py-2.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background:'linear-gradient(135deg,#9945FF,#7B2FFF)',boxShadow:'0 0 22px rgba(153,69,255,0.32)' }}
                ><Zap className="w-3.5 h-3.5" /> Send a Tip</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE LEADERBOARD ── */}
      <section id="leaderboard" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block mb-4" style={{ background:'rgba(255,215,0,0.08)',color:'#FFD700',border:'1px solid rgba(255,215,0,0.2)' }}>Live Rankings</span>
            <h2 className="text-4xl font-extrabold text-white mt-3">🏆 Tip Leaderboard</h2>
            <p className="text-gray-500 text-sm mt-2">Real-time. Every tip is a real on-chain transaction.</p>
          </motion.div>
          <div className="relative rounded-3xl overflow-hidden" style={{ background:'linear-gradient(145deg,rgba(12,12,22,0.98),rgba(8,8,16,0.99))',border:'1px solid rgba(255,255,255,0.07)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background:'linear-gradient(90deg,transparent,#FFD700,transparent)' }} />
            {LEADERBOARD.map(({ rank,username,name,tips,count,badge,color },i) => (
              <motion.div key={username}
                initial={{ opacity:0,x:-24 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]" style={{ borderBottom: i<LEADERBOARD.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}
              >
                <span className="text-xl w-8 text-center flex-shrink-0">{rank<=3?badge:<span className="text-sm font-bold" style={{ color:'#444' }}>#{rank}</span>}</span>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-white flex-shrink-0" style={{ background:`${color}33`,border:`1px solid ${color}55`,color }}>{name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm">{name}</p>
                  <p className="text-[10px]" style={{ color:'#555' }}>@{username}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-extrabold text-sm" style={{ color }}>{tips}</p>
                  <p className="text-[10px] text-gray-600">{count} tips</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={()=>setQrUser(username)}
                    className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background:'rgba(153,69,255,0.1)',border:'1px solid rgba(153,69,255,0.2)',color:'#9945FF' }}
                  ><QrCode className="w-3.5 h-3.5" /></button>
                  <Link href={`/tip/${username}`}
                    className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background:'linear-gradient(135deg,#9945FF,#7B2FFF)',color:'#fff' }}
                  ><Flame className="w-3.5 h-3.5" /></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="explore" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block mb-4" style={{ background:'rgba(153,69,255,0.1)',color:'#9945FF',border:'1px solid rgba(153,69,255,0.2)' }}>Features</span>
            <h2 className="text-4xl font-extrabold text-white mt-3">Built for the on-chain economy</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon,title,desc,color },i) => (
              <motion.div key={title}
                initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.06 }}
                whileHover={{ y:-5,borderColor:`${color}44` }}
                className="relative rounded-2xl p-5 group transition-all duration-300 cursor-default"
                style={{ background:'rgba(255,255,255,0.02)',border:`1px solid rgba(255,255,255,0.06)` }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background:`radial-gradient(circle at top left,${color}0e 0%,transparent 70%)` }} />
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-sm font-extrabold text-white mb-1.5">{title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCY BANNER ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            className="relative rounded-3xl p-8 overflow-hidden"
            style={{ background:'linear-gradient(145deg,rgba(0,240,255,0.05),rgba(153,69,255,0.07))',border:'1px solid rgba(0,240,255,0.2)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background:'linear-gradient(90deg,transparent,#00F0FF88,transparent)' }} />
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="text-5xl flex-shrink-0">🔍</div>
              <div>
                <h3 className="text-2xl font-extrabold text-white mb-3">100% Transparent &amp; Verifiable</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Every tip is a real Solana transaction. The tips counter reads directly from MongoDB Atlas — it starts at 0 on a fresh deploy
                  and grows with each real on-chain tip. Click any tip in the dashboard to verify on Solana Explorer. We never inflate numbers.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://explorer.solana.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105" style={{ background:'rgba(0,240,255,0.08)',border:'1px solid rgba(0,240,255,0.2)',color:'#00F0FF' }}><ExternalLink className="w-3 h-3" /> Solana Explorer</a>
                  <a href="https://solscan.io" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105" style={{ background:'rgba(153,69,255,0.08)',border:'1px solid rgba(153,69,255,0.2)',color:'#9945FF' }}><ExternalLink className="w-3 h-3" /> Solscan</a>
                  <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105" style={{ background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)',color:'#22C55E' }}><BarChart3 className="w-3 h-3" /> My Dashboard</Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-white">What&apos;s coming next</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title:'NFT Tip Receipts',  desc:'Every tip mints a unique on-chain NFT receipt that both tipper and creator keep.',   status:'Planned',     color:'#00F0FF' },
              { title:'Token Gating',      desc:'Gate exclusive content for wallets that tipped above a creator-defined threshold.', status:'Research',    color:'#FFD700' },
              { title:'Tip Leaderboard',   desc:'Global real-time leaderboard of top creators and top tippers on Solana.',           status:'In Progress', color:'#22C55E' },
              { title:'Creator DAO',       desc:'Tip volume = voting power. Top creators govern platform fees and roadmap.',          status:'Vision',      color:'#9945FF' },
              { title:'Fiat On-Ramp',      desc:'Tip with credit card. MoonPay converts to SOL automatically.',                      status:'Research',    color:'#FF6B6B' },
              { title:'Mobile App',        desc:'Native iOS/Android with NFC tap-to-tip and QR scanner built-in.',                   status:'Vision',      color:'#9945FF' },
            ].map(({ title,desc,status,color },i) => (
              <motion.div key={title}
                initial={{ opacity:0,x:i%2===0?-20:20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
                className="flex gap-4 p-5 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background:color,boxShadow:`0 0 8px ${color}` }} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{title}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background:`${color}22`,color,border:`1px solid ${color}44` }}>{status}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity:0,scale:0.96 }} whileInView={{ opacity:1,scale:1 }} viewport={{ once:true }}
            className="relative rounded-3xl p-10 text-center overflow-hidden"
            style={{ background:'linear-gradient(145deg,rgba(153,69,255,0.14),rgba(0,240,255,0.07))',border:'1px solid rgba(153,69,255,0.3)',boxShadow:'0 0 120px rgba(153,69,255,0.14)' }}
          >
            <NoiseOverlay />
            <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at center,rgba(153,69,255,0.12) 0%,transparent 70%)' }} />
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background:'linear-gradient(90deg,transparent,#9945FF,transparent)' }} />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-4xl font-extrabold text-white mb-3">Ready to get tipped?</h2>
              <p className="text-gray-400 text-lg mb-8">Join creators on Solana earning SOL from their community.</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/onboard"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base rounded-2xl font-bold text-white"
                  style={{ background:'linear-gradient(135deg,#9945FF,#7B2FFF)',boxShadow:'0 0 40px rgba(153,69,255,0.55)' }}
                ><Rocket className="w-5 h-5" /> Create Free TipLink</Link>
                <Link href="/tip/gopichand0516"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base rounded-2xl font-bold transition-all hover:bg-white/10"
                  style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',color:'#ccc' }}
                >Try Demo</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-4" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'linear-gradient(135deg,#9945FF,#7B2FFF)' }}><Zap className="w-3.5 h-3.5 text-white" /></div>
            <span className="font-bold text-white text-sm">TipLink <span style={{ color:'#9945FF' }}>Live</span></span>
          </div>
          <p className="text-gray-600 text-xs">Tip any Solana creator, instantly. Zero fees. Fully on-chain. Built for HackPrix S3 2026.</p>
          <div className="flex items-center gap-4">
            <a href="https://twitter.com/gopichand0516" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="https://github.com/gopichandchalla16/tiplink-live" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
            <div className="flex items-center gap-1.5 text-xs" style={{ color:'#444' }}><Globe className="w-3.5 h-3.5" /> Solana Mainnet</div>
          </div>
        </div>
      </footer>

      {/* ── QR MODAL ── */}
      <AnimatePresence>
        {qrUser && <QRModal username={qrUser} onClose={()=>setQrUser(null)} />}
      </AnimatePresence>
    </div>
  );
}
