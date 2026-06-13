'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAMES = ['Alex', 'Sarah', 'Mike', 'Priya', 'Anonymous', 'Jake', 'Luna', 'Dev', 'Aryan', 'Zoe', 'Riya', 'Sam'];
const AMOUNTS = [0.05, 0.1, 0.2, 0.5, 1, 2];
const CREATORS = ['gopi.sol', 'sarah_dev', 'mike_art', 'luna_music', 'priya.sol', 'aryan_builds'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Transaction {
  id: number;
  name: string;
  amount: number;
  creator: string;
  time: string;
}

export default function LiveTransactionFeed() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // seed with 4 initial txs
    const initial: Transaction[] = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      name: randomItem(NAMES),
      amount: randomItem(AMOUNTS),
      creator: randomItem(CREATORS),
      time: 'just now',
    }));
    setTxs(initial);
    setCounter(4);

    const interval = setInterval(() => {
      const newTx: Transaction = {
        id: Date.now(),
        name: randomItem(NAMES),
        amount: randomItem(AMOUNTS),
        creator: randomItem(CREATORS),
        time: 'just now',
      };
      setTxs(prev => [newTx, ...prev.slice(0, 6)]);
      setCounter(c => c + 1);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Live on-chain</span>
      </div>
      <div className="space-y-2 overflow-hidden">
        <AnimatePresence initial={false}>
          {txs.map(tx => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                  {tx.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white leading-none">{tx.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">→ {tx.creator}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-purple-300">◎ {tx.amount}</p>
                <p className="text-xs text-white/30">just now</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p className="text-center text-xs text-white/30 mt-3">{counter + 847} tips sent today</p>
    </div>
  );
}
