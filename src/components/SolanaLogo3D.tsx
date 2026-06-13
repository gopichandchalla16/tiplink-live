'use client';

import { motion } from 'framer-motion';

interface SolanaLogo3DProps {
  size?: number;
  className?: string;
}

export default function SolanaLogo3D({ size = 48, className = '' }: SolanaLogo3DProps) {
  const bars = [
    { skew: -12, width: '100%', bg: 'linear-gradient(90deg, #9945FF, #7B2FFF)', top: '10%' },
    { skew: -12, width: '75%',  bg: 'linear-gradient(90deg, #9945FF, #00F0FF)', top: '40%' },
    { skew: -12, width: '50%',  bg: 'linear-gradient(90deg, #00F0FF, #22C55E)', top: '70%' },
  ];

  return (
    <motion.div
      className={`relative flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        perspective: 400,
      }}
      whileHover={{
        rotateY: 20,
        rotateX: -10,
        scale: 1.1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
        animate={{ rotateY: [0, 8, 0, -8, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: size * 0.22,
            background: 'linear-gradient(135deg, rgba(153,69,255,0.15), rgba(0,240,255,0.08))',
            border: '1px solid rgba(153,69,255,0.35)',
            boxShadow:
              '0 0 16px rgba(153,69,255,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: `${size * 0.18}px ${size * 0.16}px`,
            gap: size * 0.1,
          }}
        >
          {bars.map((bar, i) => (
            <div
              key={i}
              style={{
                height: size * 0.13,
                width: bar.width,
                background: bar.bg,
                borderRadius: size * 0.06,
                transform: `skewX(${bar.skew}deg)`,
                boxShadow: `0 0 ${size * 0.12}px rgba(153,69,255,0.4)`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
