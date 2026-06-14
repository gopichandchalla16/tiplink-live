// Solana mock — no native Node.js crypto dependency at build time
// Real wallet adapter can be added client-side only via dynamic import

export interface SolanaConnection {
  getBalance: (pubkey: string) => Promise<number>;
  getRecentBlockhash: () => Promise<{ blockhash: string }>;
}

export function createMockConnection(rpcUrl: string): SolanaConnection {
  return {
    async getBalance(_pubkey: string) {
      // In production, wire up real @solana/web3.js on client only
      return 0;
    },
    async getRecentBlockhash() {
      return { blockhash: 'mock-blockhash' };
    },
  };
}

export const LAMPORTS_PER_SOL = 1_000_000_000;

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

export function solToLamports(sol: number): number {
  return Math.round(sol * LAMPORTS_PER_SOL);
}

export function isValidSolanaAddress(address: string): boolean {
  // Base58 check: 32-44 chars, alphanumeric excluding 0, O, I, l
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}
