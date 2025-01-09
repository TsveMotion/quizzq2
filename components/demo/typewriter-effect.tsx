'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterEffectProps {
  text: string;
  onComplete?: () => void;
  delay?: number;
  speed?: number;
}

export function TypewriterEffect({
  text,
  onComplete,
  delay = 0,
  speed = 30,
}: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === text.length) {
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, onComplete, speed, text]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="whitespace-pre-wrap"
    >
      {displayedText}
      <AnimatePresence>
        {currentIndex < text.length && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
