'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface TipSuccessModalProps {
  open: boolean;
  creatorName: string;
  amount: number;
  message: string;
  txSignature?: string;
  onClose: () => void;
  onShare?: () => void;
}

export default function TipSuccessModal({
  open,
  creatorName,
  amount,
  message,
  txSignature,
  onClose,
  onShare,
}: TipSuccessModalProps) {
  const explorerUrl = txSignature
    ? `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`
    : null;

  const shareText = `I just tipped ◎${amount} SOL to ${creatorName} on TipLink Live! ⚡ Support your favourite creators instantly on Solana. https://tiplink-live.vercel.app`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-sm bg-[#0d0d14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Top gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-600/20 to-transparent pointer-events-none" />

            <div className="relative p-8 text-center">
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
                className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30"
              >
                <span className="text-4xl">⚡</span>
              </motion.div>

              <h2 className="text-2xl font-black text-white mb-1">Tip Sent!</h2>
              <p className="text-white/50 text-sm mb-5">
                <span className="text-purple-300 font-bold">◎ {amount} SOL</span> sent to {creatorName}
              </p>

              {/* AI Message */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 text-left">
                <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-2">✨ AI Thank You</p>
                <p className="text-sm text-white/80 leading-relaxed italic">&ldquo;{message}&rdquo;</p>
              </div>

              {/* Buttons */}
              <div className="space-y-2.5">
                {explorerUrl && (
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors"
                  >
                    <span>🔍</span> View on Explorer
                  </a>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
                      '_blank'
                    );
                    onShare?.();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20"
                >
                  🐦 Share on X (Twitter)
                </motion.button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
