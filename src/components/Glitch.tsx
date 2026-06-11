'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface GlitchProps {
  children: React.ReactNode;
  className?: string;
}

export default function Glitch({ children, className = '' }: GlitchProps) {
  const [isHovered, setIsHovered] = useState(false);

  const glitchAnim = {
    clipPath: [
      'inset(80% 0 0 0)',
      'inset(10% 0 80% 0)',
      'inset(50% 0 30% 0)',
      'inset(20% 0 60% 0)',
      'inset(70% 0 10% 0)',
      'inset(0% 0 85% 0)',
      'inset(40% 0 43% 0)',
      'inset(80% 0 0 0)',
    ],
    x: [0, -2, 2, -1, 1, -2, 2, 0],
    y: [0, 1, -1, 2, -2, 1, -1, 0],
  };

  return (
    <div
      className={`glitch-wrapper ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                filter: 'drop-shadow(-2px 0 #ff0000) contrast(150%)',
                mixBlendMode: 'screen',
                opacity: 0.8,
              }}
              animate={glitchAnim}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                ease: 'linear',
              }}
            >
              {children}
            </motion.div>
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                filter: 'drop-shadow(2px 0 #00ffff) contrast(150%)',
                mixBlendMode: 'screen',
                opacity: 0.8,
              }}
              animate={glitchAnim}
              transition={{
                repeat: Infinity,
                duration: 0.7,
                ease: 'linear',
                delay: 0.05,
              }}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
