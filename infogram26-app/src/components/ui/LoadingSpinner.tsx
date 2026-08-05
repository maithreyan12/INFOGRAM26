'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const dim = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center ${dim}`}>
      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-t-2 border-r-2 border-sky-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner Ring */}
      <motion.div
        className="absolute inset-1 rounded-full border-b-2 border-l-2 border-sky-400"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      {/* Center Dot */}
      <motion.div
        className="w-2 h-2 rounded-full bg-sky-300"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
