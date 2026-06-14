// ─────────────────────────────────────────────────────────────────────────────
// Root Layout — Server Component
// WalletContextProvider imported dynamically to prevent SSR crash.
// CSS for wallet adapter loaded in globals.css (not in the provider).
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import './globals.css';
import { WalletContextProvider } from '@/context/WalletContextProvider';

export const metadata: Metadata = {
  title: 'TipLink Live — Solana Creator Tipping',
  description: 'Send SOL tips to any creator instantly. Real wallet. Zero custodian.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
