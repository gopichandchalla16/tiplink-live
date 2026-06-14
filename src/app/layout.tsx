import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TipLink Live — Gamified Solana Tipping Platform',
  description:
    'Real-time interactive tipping, spatial airdrops, Blink builder, and lootbox rewards powered by Solana and TipLink. Built for Hackprix Season 3.',
  keywords: ['Solana', 'TipLink', 'Web3', 'streaming', 'tipping', 'blockchain', 'DeFi'],
  openGraph: {
    title: 'TipLink Live',
    description: 'Gamified Solana tipping for live streamers — Hackprix Season 3',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}
    >
      <body
        style={{
          background: '#020204',
          fontFamily: 'var(--font-plus-jakarta), sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
