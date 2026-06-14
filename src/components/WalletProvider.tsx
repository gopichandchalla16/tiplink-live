'use client';

import { FC, ReactNode } from 'react';

// Lightweight pass-through provider.
// The app uses window.solana (Phantom) directly for wallet connection;
// the heavy @solana/wallet-adapter-react-ui suite is not installed and not needed.
const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default WalletProvider;
