# TipLink Live

A creator tipping app on Solana. A creator registers a wallet and shares one link. Fans connect Phantom, send SOL straight to the creator's wallet, and the app confirms the transaction on chain and records it. The app never holds funds.

Live app: https://tiplink-live.vercel.app (Solana Devnet)

## What works

- **Creator profiles.** Register a username and wallet address, with an optional bio that Gemini can tidy up.
- **Tipping.** The `/api/tip` route builds an unsigned SOL transfer, the fan signs it in Phantom, and `/api/confirm` reads the transaction from Solana and stores it in MongoDB.
- **Solana Actions.** A tip action route and an `actions.json` file, so a tip link can work inside apps that support Actions.
- **AI thank you messages.** A Gemini route writes a short reply to each tip in one of four tones: grateful, hype, professional or creative.
- **Dashboard and explorer.** Creator earnings, tip history, and a page to browse creators.

## Prototype pages

These pages are interface prototypes. They show a possible design but do not run on chain yet. Their actions are simulated in the browser.

- `/vault`: time lock vault
- `/predict`: prediction markets
- `/zkproof`: anonymous tip proofs (the circuit is pseudocode, and the proof values are random)
- `/streams`: recurring tip streams
- `/reputation`: reputation badge

The repo has no Anchor program and no Token-2022 mint code yet.

## Stack

Next.js 14, TypeScript, Solana web3.js, Solana wallet adapter (Phantom), MongoDB Atlas (falls back to an in-memory store), Google Gemini API, Vercel.

## How a tip flows

1. The fan enters an amount on a creator page.
2. `POST /api/tip` returns a base64 unsigned transaction.
3. Phantom signs and sends it to Solana.
4. `POST /api/confirm` reads the transaction from the network and saves the tip.

## API routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/tip` | Build an unsigned SOL transfer |
| POST | `/api/confirm` | Verify a transaction on chain and store the tip |
| POST | `/api/creator` | Register a creator |
| GET | `/api/creators` | List creators |
| GET | `/api/creators/[username]` | Get a creator by username |
| GET | `/api/creators/by-wallet/[wallet]` | Get a creator by wallet |
| GET, POST | `/api/tips` | List or record tips |
| GET | `/api/tips/[username]` | Tips received by a creator |
| GET | `/api/tips/by-wallet/[wallet]` | Tips sent by a wallet |
| POST | `/api/generate-thankyou` | Gemini thank you message in a chosen tone |
| POST | `/api/enhance-bio` | Gemini bio rewrite |
| GET, POST | `/api/actions/tip/[username]` | Solana Actions tip endpoint |
| GET | `/api/stats` | Platform totals |
| GET | `/api/health` | Health check |

## Run it locally

```bash
git clone https://github.com/gopichandchalla16/tiplink-live
cd tiplink-live
npm install
cp .env.example .env.local   # add GEMINI_API_KEY, optionally MONGODB_URI
npm run dev
```

Open http://localhost:3000. Use a Phantom wallet set to Devnet and get test SOL from a Devnet faucet.

## Environment variables

| Name | Needed | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | For AI features | Thank you messages and bio rewrite |
| `NEXT_PUBLIC_APP_URL` | For deploys | Your app URL |
| `MONGODB_URI` | Optional | MongoDB Atlas connection string |

## Next steps

- Move the vault into a real Anchor program.
- Mint the reputation badge with Token-2022.
- Add tests for the tip and confirm routes.

## License

See [LICENSE](LICENSE).
