import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TipLink Live — Tip Your Favorite Creators on Solana',
  description: 'The fastest, most beautiful way to send SOL tips to creators. No friction. Instant. Decentralized.',
  openGraph: {
    title: 'TipLink Live',
    description: 'Tip creators on Solana instantly',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">{children}</body>
    </html>
  );
}
