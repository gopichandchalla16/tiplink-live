'use client';

import { motion } from 'framer-motion';

export default function HeroOrb() {
  const ORBIT_DOTS = [
    { angle: 0,   size: 6,  color: '#9945FF', duration: 5   },
    { angle: 72,  size: 4,  color: '#00F0FF', duration: 7   },
    { angle: 144, size: 5,  color: '#22C55E', duration: 6   },
    { angle: 216, size: 4,  color: '#FFD700', duration: 8   },
    { angle: 288, size: 5,  color: '#9945FF', duration: 5.5 },
  ];

  return (
    <div
      className="relative select-none pointer-events-none"
      style={{ width: 320, height: 320 }}
    >
      {/* ── Outer ambient glow ── */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 40% 35%, rgba(153,69,255,0.22) 0%, rgba(0,240,255,0.1) 45%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* ── Spinning rings wrapper ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d', perspective: 800 }}
      >
        {/* Ring 1 — purple */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1.5px solid rgba(153,69,255,0.55)',
            transform: 'rotateX(75deg)',
            animation: 'ring-spin 8s linear infinite',
            boxShadow: '0 0 12px rgba(153,69,255,0.3)',
          }}
        />
        {/* Ring 2 — cyan */}
        <div
          className="absolute"
          style={{
            inset: '24px',
            borderRadius: '50%',
            border: '1.5px solid rgba(0,240,255,0.45)',
            animation: 'ring-spin-reverse 12s linear infinite',
            boxShadow: '0 0 10px rgba(0,240,255,0.2)',
          }}
        />
        {/* Ring 3 — green faint */}
        <div
          className="absolute"
          style={{
            inset: '48px',
            borderRadius: '50%',
            border: '1px solid rgba(34,197,94,0.3)',
            transform: 'rotateX(75deg) rotateY(90deg)',
            animation: 'ring-spin 16s linear infinite',
          }}
        />
      </motion.div>

      {/* ── Core sphere ── */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute animate-morph"
        style={{
          inset: '60px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 35% 30%, rgba(153,69,255,0.9) 0%, rgba(123,47,255,0.7) 40%, rgba(0,240,255,0.3) 75%, transparent 100%)',
          boxShadow:
            '0 0 40px rgba(153,69,255,0.6), 0 0 80px rgba(153,69,255,0.3), inset 0 0 30px rgba(0,240,255,0.15)',
        }}
      />

      {/* ── Inner highlight ── */}
      <div
        className="absolute"
        style={{
          top: '30%',
          left: '30%',
          width: '28%',
          height: '22%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 80%)',
          filter: 'blur(4px)',
        }}
      />

      {/* ── Solana ◎ symbol ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.span
          animate={{ opacity: [0.7, 1, 0.7], scale: [0.97, 1.03, 0.97] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: 'rgba(255,255,255,0.92)',
            textShadow:
              '0 0 24px rgba(153,69,255,1), 0 0 48px rgba(0,240,255,0.6)',
            lineHeight: 1,
          }}
        >
          ◎
        </motion.span>
      </div>

      {/* ── Orbiting dots ── */}
      {ORBIT_DOTS.map((dot, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: (i * dot.duration) / ORBIT_DOTS.length,
          }}
          className="absolute inset-0"
          style={{ transformOrigin: 'center center' }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              background: dot.color,
              boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
              transform: `rotate(${dot.angle}deg) translateX(148px) translateY(-50%)`,
            }}
          />
        </motion.div>
      ))}

      {/* ── Outer particle ring (slower) ── */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 360;
        return (
          <motion.div
            key={`outer-${i}`}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{
              duration: 18 + i * 1.2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0"
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 2,
                height: 2,
                borderRadius: '50%',
                background: i % 3 === 0 ? '#9945FF' : i % 3 === 1 ? '#00F0FF' : '#22C55E',
                opacity: 0.5,
                transform: `rotate(${angle}deg) translateX(155px) translateY(-50%)`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
