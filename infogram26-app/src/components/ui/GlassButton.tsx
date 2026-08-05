'use client';
import { motion } from 'framer-motion';
import { ReactNode, MouseEvent } from 'react';
interface GlassButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'glass';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}
export default function GlassButton({ children, onClick, variant = 'glass', className = '', disabled, type = 'button', fullWidth }: GlassButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.93 } : {}}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`${variant === 'primary' ? 'btn-primary' : 'btn-glass'} ${fullWidth ? 'w-full' : ''} ${className} ${ disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', willChange: 'transform' }}
    >
      {children}
    </motion.button>
  );
}
