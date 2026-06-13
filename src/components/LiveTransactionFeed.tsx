'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAMES = ['Alex M.', 'Sarah K.', 'Mike T.', 'Priya S.', 'Anonymous', 'Jake R.', 'Luna.sol', 'DevAryan', 'Zoe W.', 'Riya.eth', 'Sam B.', '0xGhost'];
const AMOUNTS = [0.05, 0.1, 0.2, 0.5, 1.0, 2.0];
const CREATORS = ['gopichand0516', 'aeyakovenko', 'rajgokal', 'luna_music', 'priya.sol', 'aryan_builds'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Tx {
  id: number;
  name: string;
  amount: number;
  creator: string;
}

export default function LiveTransactionFeed() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [total, setTotal] = useState(847);

  useEffect(() => {
    const seed: Tx[] = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      name: randomItem(NAMES),
      amount: randomItem(AMOUNTS),
      creator: randomItem(CREATORS),
    }));
    setTxs(seed);

    const iv = setInterval(() => {
      setTxs(prev => [{ id: Date.now(), name: randomItem(NAMES), amount: randomItem(AMOUNTS), creator: randomItem(CREATORS) }, ...prev.slice(0, 5)]);
      setTotal(t => t + 1);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: 'rgba(13,13,24,0.97)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live on-chain</span>
        </div>
        <span className="text-[10px] text-gray-600">{total} tips today</span>
      </div>
      <div className="px-3 py-2 space-y-1.5">
        <AnimatePresence initial={false}>
          {txs.map(tx => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              className="flex items-center justify-between px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #9945FF, #7B2FFF)' }}>
                  {tx.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-none">{tx.name}</p>
                  <p className="text-[10px] text-gray-600">→ @{tx.creator}</p>
                </div>
              </div>
              <span className="text-xs font-bold" style={{ color: '#9945FF' }}>+◎ {tx.amount}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
