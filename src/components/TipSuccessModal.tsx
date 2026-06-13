'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, ExternalLink, X } from 'lucide-react';

interface TipSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  token: string;
  thankYouMessage: string;
  txSignature: string;
  creatorName: string;
}

const CONFETTI_COLORS = ['#9945FF', '#00F0FF', '#22C55E', '#FFD700', '#FF6B6B', '#FF9F43'];

export default function TipSuccessModal({
  isOpen,
  onClose,
  amount,
  token,
  thankYouMessage,
  txSignature,
  creatorName,
}: TipSuccessModalProps) {
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${(i / 20) * 100}%`,
    delay: i * 0.07,
    rotateZ: Math.floor(Math.random() * 360),
    rotateY: Math.floor(Math.random() * 180),
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          />

          {/* Confetti */}
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {pieces.map((p) => (
              <motion.div
                key={p.id}
                initial={{ y: -20, opacity: 1, rotateZ: 0, rotateY: 0 }}
                animate={{ y: '100vh', opacity: 0, rotateZ: p.rotateZ, rotateY: p.rotateY }}
                transition={{ duration: 2.5 + p.delay, ease: 'easeIn', delay: p.delay }}
                style={{
                  position: 'absolute',
                  left: p.left,
                  top: 0,
                  width: 8,
                  height: 8,
                  background: p.color,
                  borderRadius: p.id % 2 === 0 ? '50%' : '2px',
                }}
              />
            ))}
          </div>

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: 1200,
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 51,
              width: '90vw',
              maxWidth: 420,
            }}
          >
            <div
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #0f0f1a 0%, #080810 100%)',
                border: '1px solid rgba(153,69,255,0.4)',
                boxShadow: '0 0 80px rgba(153,69,255,0.25), 0 40px 80px rgba(0,0,0,0.6)',
              }}
            >
              {/* Top shimmer */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #9945FF, transparent)' }}
              />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                className="flex items-center justify-center mb-5"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(34,197,94,0.15)',
                    border: '2px solid rgba(34,197,94,0.4)',
                    boxShadow: '0 0 40px rgba(34,197,94,0.25)',
                  }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: '#22C55E' }} />
                </div>
              </motion.div>

              <h2
                className="text-2xl font-extrabold text-white text-center mb-1"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Tip Sent! 🚀
              </h2>
              <p className="text-gray-400 text-sm text-center mb-6">
                You sent{' '}
                <span className="font-bold" style={{ color: token === 'SOL' ? '#9945FF' : '#22C55E' }}>
                  {token === 'SOL' ? '◎' : '$'}{amount} {token}
                </span>{' '}
                to {creatorName}
              </p>

              {/* Thank-you message */}
              <div
                className="rounded-2xl p-4 mb-5"
                style={{
                  background: 'rgba(153,69,255,0.08)',
                  border: '1px solid rgba(153,69,255,0.2)',
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9945FF' }}>
                  Message from {creatorName}
                </p>
                <p className="text-white text-sm leading-relaxed italic">
                  &ldquo;{thankYouMessage}&rdquo;
                </p>
              </div>

              {/* Explorer link */}
              {txSignature && !txSignature.startsWith('mock_') && (
                <a
                  href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold mb-4 transition-all hover:opacity-80"
                  style={{
                    background: 'rgba(0,240,255,0.08)',
                    border: '1px solid rgba(0,240,255,0.2)',
                    color: '#00F0FF',
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Solana Explorer
                </a>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-bold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #9945FF, #7B2FFF)',
                  boxShadow: '0 0 24px rgba(153,69,255,0.4)',
                }}
              >
                Done ✓
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
