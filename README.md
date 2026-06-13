# ⚡ TipLink Live

> **Tip any creator on Solana with just a link. No dApp. No friction. Just SOL.**

Built at **HackPrix Season 3** · June 13–14, 2026 · Hyderabad
Team: **0xGhostchain**
Track: **Blockchain & Web3**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://tiplink-live.vercel.app)
[![Built on Solana](https://img.shields.io/badge/Built%20on-Solana-9945FF?style=for-the-badge&logo=solana)](https://solana.com)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

---

## 🔴 The Problem

Every day, thousands of creators — developers, musicians, artists, writers, open-source contributors — create real value for people online. Someone reads a blog post that saves them 3 hours. Someone listens to a track that changes their mood. Someone uses a GitHub library that powers their product.

**What happens when they want to say thank you with money?**

### The current creator tipping flow is broken:

| Step | What happens today |
|------|--------------------|
| 1 | Fan wants to tip. Searches for creator's wallet/donation page. |
| 2 | Finds a Patreon or Ko-fi. Has to sign up. |
| 3 | Platform takes 5–12% cut of every tip. |
| 4 | Creator waits 15–30 days for payout. |
| 5 | Fan gives up. Creator gets nothing. |

Even in crypto, the flow is painful:
- Fan has to know the creator's wallet address
- Has to visit a separate dApp
- Has to connect wallet on that dApp
- Has to find the creator again
- Transaction takes 15+ seconds and costs $3–$10 in ETH gas fees

**Result: people want to tip but don't. Small moments of value go unrecognized.**

---

## 🟢 The Solution — TipLink Live

TipLink Live collapses the entire tipping flow into **one URL**.

A creator connects their Phantom wallet once, fills in their profile, and gets a personal Blink URL:

```
https://tiplink-live.vercel.app/tip/gopichand
```

This URL — posted on Twitter, GitHub README, Discord, WhatsApp — **IS the tipping experience**.

Anyone who clicks it sees the creator's card and four tip buttons. They click, approve in Phantom, and SOL arrives in the creator's wallet in **under 1 second**, directly wallet-to-wallet.

No platform. No middleman. No fee. No signup. **Just a link.**

---

## ✨ Features

### Core Features
- **🔗 One-Click Tip Link** — Creator gets a personal Solana Blink URL shareable anywhere
- **⚡ Instant SOL Transfer** — Direct wallet-to-wallet, sub-second confirmation on Solana devnet
- **🤖 AI Thank-You Messages** — Google Gemini 1.5 Flash writes a personalized 2-sentence message after every tip in the creator's voice
- **🎭 4 AI Personalities** — Warm & Personal, Funny & Casual, Professional, Hype & Energetic
- **📱 QR Code Sharing** — Every tip page auto-generates a QR code for mobile tipping
- **🔍 Solana Explorer Link** — Every tip shows a verified on-chain Explorer transaction link
- **📊 Creator Dashboard** — Live stats: total SOL received, unique tippers, tip history
- **🏆 Explore Leaderboard** — Public page ranking all creators by tips received

### Technical Features
- **Solana Actions/Blinks compliant** API — works with any Blink-compatible wallet
- **CORS headers** on all Action endpoints — renders inline in supported platforms
- **No custodial risk** — platform never holds funds, no private keys touched
- **Pre-seeded demo data** — 5 real creator profiles for instant leaderboard showcase

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        TipLink Live                             │
│                   System Architecture                           │
└─────────────────────────────────────────────────────────────────┘

  CREATOR FLOW                        TIPPER FLOW
  ─────────────                       ────────────
  1. Connect Phantom wallet            1. Click/scan creator's link
  2. Fill profile + pick AI tone       2. Creator card loads instantly
  3. Click "Generate My Tip Link"      3. Choose tip amount (or custom)
  4. Receive personal Blink URL        4. Connect Phantom wallet
  5. Share URL anywhere                5. Click "Tip X SOL"
                                       6. Phantom popup → Approve
                                       7. SOL confirmed on-chain (<1s)
                                       8. Gemini AI thank-you appears
                                       9. Explorer link for verification

┌─────────────────────────────────────────────────────────────────┐
│                     Tech Stack Layers                           │
├──────────────────────┬──────────────────────────────────────────┤
│  FRONTEND            │  Next.js 15 App Router + Tailwind CSS    │
│                      │  Phantom Wallet Adapter                  │
│                      │  qrcode.react for QR generation          │
│                      │  lucide-react icons                      │
├──────────────────────┼──────────────────────────────────────────┤
│  SOLANA BLINKS API   │  GET  /api/actions/tip/[username]        │
│                      │  → Returns ActionGetResponse JSON        │
│                      │  → title, icon, description, actions[]   │
│                      │                                          │
│                      │  POST /api/actions/tip/[username]        │
│                      │  → Receives: { account: walletAddress }  │
│                      │  → Builds unsigned SOL Transfer tx       │
│                      │  → Serializes to base64                  │
│                      │  → Returns ActionPostResponse            │
│                      │                                          │
│                      │  OPTIONS → CORS preflight handler        │
├──────────────────────┼──────────────────────────────────────────┤
│  BLOCKCHAIN          │  Solana Devnet                           │
│                      │  @solana/web3.js SystemProgram.transfer  │
│                      │  Transaction fee payer: tipper           │
│                      │  Direct: tipper wallet → creator wallet  │
│                      │  Confirmation: ~400ms average            │
│                      │  Cost: ~0.000005 SOL per transaction     │
├──────────────────────┼──────────────────────────────────────────┤
│  AI LAYER            │  Google Gemini 1.5 Flash API             │
│                      │  Input: creatorName, bio, tipAmount,     │
│                      │         personality mode                 │
│                      │  Output: 2-sentence personalized         │
│                      │          thank-you message               │
│                      │  Fallback: static message if API fails   │
├──────────────────────┼──────────────────────────────────────────┤
│  STORAGE             │  In-memory Map (hackathon MVP)           │
│                      │  creators: Map<username, Creator>        │
│                      │  tips: TipRecord[]                       │
│                      │  Pre-seeded with 5 demo creators         │
│                      │  Production path: MongoDB Atlas          │
├──────────────────────┼──────────────────────────────────────────┤
│  DEPLOYMENT          │  Vercel (Next.js serverless)             │
│                      │  GitHub Actions CI on every push         │
│                      │  Env vars: GEMINI_API_KEY,               │
│                      │           NEXT_PUBLIC_APP_URL            │
└──────────────────────┴──────────────────────────────────────────┘
```

### Solana Blinks Flow — Detailed

```
User clicks URL: /tip/gopichand
        │
        ▼
[TipPage React Component]
        │
        ├── Fetches GET /api/creator?username=gopichand
        │   └── Returns: Creator profile data
        │
        ├── Renders: Avatar, bio, tip amount buttons, QR code
        │
        └── On "Tip 0.1 SOL" click:
                │
                ▼
        [POST /api/actions/tip/gopichand?amount=0.1]
                │
                ├── Builds SystemProgram.transfer transaction
                │   fromPubkey: tipper's wallet
                │   toPubkey:   creator's wallet  
                │   lamports:   100_000_000 (0.1 SOL)
                │
                ├── Gets latest blockhash from Solana devnet
                ├── Sets feePayer = tipper
                ├── Serializes tx (requireAllSignatures: false)
                └── Returns base64-encoded unsigned transaction
                        │
                        ▼
        [Frontend: Transaction.from(base64Buffer)]
                │
                ├── sendTransaction(tx, connection)
                │   └── Phantom: shows approval popup
                │       User clicks Approve
                │       Phantom signs + broadcasts
                │
                ├── connection.confirmTransaction(sig, 'confirmed')
                │
                ├── POST /api/thankyou → Gemini generates message
                │
                └── Shows: ✅ Success + Explorer link + Thank-you card
```

---

## 📁 Project Structure

```
tiplink-live/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout + wallet providers
│   │   ├── globals.css                 # Dark theme + custom styles
│   │   ├── create/
│   │   │   └── page.tsx                # Creator onboarding form
│   │   ├── tip/
│   │   │   └── [username]/
│   │   │       └── page.tsx            # Tipper UI + QR code
│   │   ├── explore/
│   │   │   └── page.tsx                # Creator leaderboard
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Creator dashboard
│   │   └── api/
│   │       ├── actions/
│   │       │   └── tip/
│   │       │       └── [username]/
│   │       │           └── route.ts    # ⭐ Solana Blinks API
│   │       ├── creator/
│   │       │   └── route.ts            # Creator CRUD
│   │       └── thankyou/
│   │           └── route.ts            # Gemini AI endpoint
│   ├── components/
│   │   └── WalletProvider.tsx          # Phantom wallet context
│   └── lib/
│       ├── storage.ts                  # In-memory data layer
│       ├── gemini.ts                   # Gemini AI integration
│       └── solana.ts                   # Solana utilities
├── public/
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Phantom wallet browser extension
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone & Install

```bash
git clone https://github.com/gopichandchalla16/tiplink-live.git
cd tiplink-live
npm install --legacy-peer-deps
```

### 2. Environment Setup

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Get Devnet SOL

```bash
solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet
```

Or use [faucet.solana.com](https://faucet.solana.com)

---

## 🧪 Testing the App

### Test Creator Profile (Pre-seeded)
Open: `http://localhost:3000/tip/gopichand`

### Test the Blink API
```bash
curl http://localhost:3000/api/actions/tip/gopichand
```

Expected response:
```json
{
  "title": "Tip Gopichand Challa ⚡",
  "icon": "https://avatars.githubusercontent.com/u/162360009",
  "description": "Solana developer. Building in public for 100+ days.",
  "label": "Send Tip",
  "links": {
    "actions": [
      { "label": "0.05 SOL", "href": "...?amount=0.05" },
      { "label": "0.1 SOL",  "href": "...?amount=0.1"  },
      { "label": "0.5 SOL",  "href": "...?amount=0.5"  },
      { "label": "Custom Amount", "parameters": [...] }
    ]
  }
}
```

### Full Demo Flow
1. Go to `/create` → Connect Phantom (devnet) → Fill profile → Generate link
2. Open your tip URL → Select amount → Connect wallet → Click Tip
3. Approve in Phantom → See Explorer confirmation + Gemini thank-you
4. Go to `/dashboard` → See your tip history and total SOL
5. Go to `/explore` → See leaderboard of all creators

---

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard:
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL` → your Vercel URL

---

## 🔮 Roadmap (Post-Hackathon)

| Feature | Description |
|---------|-------------|
| **Persistent Storage** | MongoDB Atlas instead of in-memory Map |
| **SPL Token Tips** | Tip with USDC, BONK, or any SPL token |
| **Token-2022 Extensions** | Transfer hooks for creator royalties |
| **Tip Milestones** | "100 SOL received" on-chain badge/NFT |
| **Twitter/X Blink Integration** | Renders tip card natively inside tweets |
| **Analytics Dashboard** | Charts for tip history, peak times |
| **Mobile App** | React Native with Solana Mobile SDK |
| **Mainnet Launch** | Move from devnet to mainnet-beta |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Blockchain | Solana (devnet), @solana/web3.js |
| Wallet | Phantom Wallet Adapter |
| Blinks | @solana/actions (Actions/Blinks spec) |
| AI | Google Gemini 1.5 Flash |
| QR Code | qrcode.react |
| Icons | lucide-react |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

---

## 👥 Team — 0xGhostchain

Built with 🔥 at **HackPrix Season 3**, Hyderabad, June 2026

- **Gopichand Challa** — Solana developer, Web3 × AI builder
  - GitHub: [@gopichandchalla16](https://github.com/gopichandchalla16)
  - 100+ days of Solana projects: SPL tokens, NFTs, AI agents, ZK proofs

---

## 📜 License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

**Built for HackPrix Season 3 · Blockchain & Web3 Track**

*"In 36 hours, we didn't just build a product — we built a new primitive for creator monetization on Solana."*

⚡ **TipLink Live** — Tip any creator. Just a link.

</div>
