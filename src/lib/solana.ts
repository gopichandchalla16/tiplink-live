import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'

export const SOLANA_NETWORK = 'devnet'
export const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed')

export function isValidPublicKey(address: string): boolean {
  try { new PublicKey(address); return true } catch { return false }
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000)
}
