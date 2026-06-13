import type { Metadata } from 'next';
import './globals.css';
import dynamic from 'next/dynamic';

// CRITICAL: Solana wallet adapter reads window/localStorage — must be client-only
const WalletProvider = dynamic(() => import('@/components/WalletProvider'), { ssr: false });

export const metadata: Metadata = {
  title: 'TipLink Live — Tip any Solana creator instantly',
  description: 'One link. Any Solana creator. Instant SOL & USDC tips. AI thank-you messages. Zero fees. Fully on-chain.',
  keywords: 'Solana, tipping, creator economy, Web3, SOL, USDC, Blinks, on-chain',
  openGraph: {
    title: 'TipLink Live',
    description: 'Tip any Solana creator with one link. Zero fees. Instant.',
    url: 'https://tiplink-live.vercel.app',
    siteName: 'TipLink Live',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TipLink Live',
    description: 'Tip any Solana creator instantly on Solana.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {WalletProvider ? <WalletProvider>{children}</WalletProvider> : children}
      </body>
    </html>
  );
}
