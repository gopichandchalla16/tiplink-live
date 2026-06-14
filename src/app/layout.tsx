import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SolanaWalletProvider from '@/components/WalletProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TipLink Live — Web3 Creator Tipping on Solana',
  description: 'Tip creators with SOL. SoulBound NFTs, Time-Lock Vaults, Prediction Markets, ZK Proofs, AI Streams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}