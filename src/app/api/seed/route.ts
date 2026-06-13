import { NextResponse } from 'next/server';
import { createCreator, recordTip, getCreatorByUsername } from '@/lib/storage';

export async function POST() {
  try {
    const creators = [
      { username: 'gopichand', name: 'Gopichand Challa', bio: 'Solana dev · Web3 × AI · Team 0xGhostchain', category: 'developer', personality: 'hype', walletAddress: 'GopicHandWaLLetAddressSo1ana11111111111111111', avatarUrl: 'https://avatars.githubusercontent.com/u/162360009' },
      { username: 'aeyakovenko', name: 'Anatoly Yakovenko', bio: 'Co-founder of Solana. Built Proof of History.', category: 'developer', personality: 'professional', walletAddress: 'So1anaFounderWaLLetAddress111111111111111111', avatarUrl: '' },
      { username: 'rajgokal', name: 'Raj Gokal', bio: 'Co-founder of Solana. Building fastest chain on Earth.', category: 'creator', personality: 'grateful', walletAddress: 'RajGokaLWaLLetAddress1111111111111111111111111', avatarUrl: '' },
    ];

    let createdCount = 0;
    for (const c of creators) {
      const existing = await getCreatorByUsername(c.username);
      if (!existing) {
        await createCreator(c);
        createdCount++;
      }
    }

    const fakeTippers = ['ABc1xYz2wallet111111111111111111', 'DEf3gHi4wallet222222222222222222', 'JKl5mNo6wallet333333333333333333'];
    let tipCount = 0;
    for (const c of creators) {
      for (let i = 0; i < 3; i++) {
        await recordTip({
          creatorUsername: c.username,
          tipperWallet: fakeTippers[i],
          amount: [0.05, 0.1, 0.5][i],
          token: i === 2 ? 'USDC' : 'SOL',
          thankYouMessage: 'Thanks for the seed tip! 🌱',
          txSignature: `seed_tx_${c.username}_${i}_${Date.now()}`,
          message: 'Seeded tip — love the project!',
        });
        tipCount++;
      }
    }

    return NextResponse.json({ seeded: true, creators: createdCount, tips: tipCount });
  } catch (err) {
    console.error('[POST /api/seed]', err);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}
