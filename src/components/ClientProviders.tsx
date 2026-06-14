'use client';

import { FC, ReactNode } from 'react';
import WalletProvider from './WalletProvider';

const ClientProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return <WalletProvider>{children}</WalletProvider>;
};

export default ClientProviders;
