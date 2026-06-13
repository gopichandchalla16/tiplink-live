import type { Metadata } from 'next';
import './globals.css';
import WalletProvider from '@/components/WalletProvider';

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
  themeColor: '#9945FF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body><WalletProvider>{children}</WalletProvider></body>
    </html>
  );
}
