// Solana utility helpers
// @solana/web3.js is only used at runtime in API routes — not bundled client-side.

export function isValidSolanaAddress(address: string): boolean {
  // Basic validation: base58, 32-44 chars
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function solToLamports(sol: number): number {
  return Math.round(sol * 1_000_000_000);
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}
