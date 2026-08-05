'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ComponentProps } from 'react';
type Props = ComponentProps<typeof Link> & { children: React.ReactNode };
export default function SmoothLink({ children, className, ...props }: Props) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      style={{ display: 'inline-block', WebkitTapHighlightColor: 'transparent' }}
    >
      <Link {...props} className={className} style={{ WebkitTapHighlightColor: 'transparent', ...((props as any).style || {}) }}>
        {children}
      </Link>
    </motion.div>
  );
}
