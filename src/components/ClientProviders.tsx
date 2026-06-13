'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// ssr:false must live in a 'use client' file — NOT in layout.tsx (Server Component)
const WalletProvider = dynamic(() => import('./WalletProvider'), { ssr: false });

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
