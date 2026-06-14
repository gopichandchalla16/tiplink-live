import type { Metadata } from 'next';
import './globals.css';
import { WalletContextProvider } from '@/context/WalletContextProvider';

export const metadata: Metadata = {
  title: 'TipLink Live — Solana Creator Tipping',
  description: 'Send SOL tips instantly to any creator. SoulBound NFTs, Time-Lock Vaults, Prediction Markets, ZK Proofs, AI Streams.',
  openGraph: {
    title: 'TipLink Live',
    description: 'The fastest way to tip creators on Solana.',
    url: 'https://tiplink-live.vercel.app',
    siteName: 'TipLink Live',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'TipLink Live', description: 'Tip any creator on Solana instantly.' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0a0e27' }}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
