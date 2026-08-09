'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface LiquidGlassButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Apple iPhone 17 Pro Max — Ultra-Realistic Liquid Glass Pill Button
 * 
 * Specs:
 * 1. Glassmorphism Surface: blur(28px), saturate(190%), translucent glass layer.
 * 2. Liquid Specular Rim & Inner Glow: Inset top rim reflection + ambient depth shadow.
 * 3. Fluid Animated Gloss Sheen: Sweeping diagonal gloss light reflection on hover.
 * 4. Spring Physics & Tactile Compression: Hover translateY(-2px) scale(1.03), active scale(0.95).
 */
export const LiquidGlassButton = React.forwardRef<HTMLButtonElement, LiquidGlassButtonProps>(
  (
    {
      children,
      variant = 'light',
      size = 'md',
      icon,
      iconPosition = 'right',
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    // Size variants
    const sizeClasses = {
      sm: 'px-4 py-2 text-xs min-h-[38px] gap-1.5',
      md: 'px-6 py-3 text-sm min-h-[44px] gap-2',
      lg: 'px-8 py-4 text-base min-h-[52px] gap-2.5',
    };

    // Style variants matching Apple Liquid Glass specs
    const variantClasses = {
      light: `
        bg-white/75 hover:bg-white/90 text-slate-900 
        border border-white/80 border-t-white
        shadow-[0_8px_30px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
        hover:shadow-[0_12px_35px_rgba(124,58,237,0.15),inset_0_1px_0_#ffffff]
        hover:border-[#7c3aed]/30
      `,
      dark: `
        bg-slate-900/90 hover:bg-slate-900 text-white 
        border border-slate-700/80 border-t-slate-600
        shadow-[0_8px_25px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.2)]
        hover:shadow-[0_14px_40px_rgba(15,23,42,0.4),inset_0_1px_0_rgba(255,255,255,0.35)]
        hover:border-slate-500
      `,
      primary: `
        bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#059669] text-white 
        border border-white/30 border-t-white/50
        shadow-[0_8px_30px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]
        hover:shadow-[0_14px_45px_rgba(124,58,237,0.5),inset_0_1px_0_rgba(255,255,255,0.6)]
        hover:brightness-105
      `,
    };

    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        whileHover={{ translateY: -2, scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
          mass: 0.8,
        }}
        style={{
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          willChange: 'transform',
        }}
        className={`
          relative inline-flex items-center justify-center font-bold tracking-wide 
          rounded-full cursor-pointer overflow-hidden transition-colors select-none
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        {...props}
      >
        {/* ── Fluid Sweeping Diagonal Gloss Sheen Overlay ── */}
        <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-0">
          <span 
            className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] transition-all duration-700 ease-out group-hover:left-[100%]"
            aria-hidden="true"
          />
        </span>

        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}

        {/* Label */}
        <span className="relative z-10">{children}</span>

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
            {icon}
          </span>
        )}
      </motion.button>
    );
  }
);

LiquidGlassButton.displayName = 'LiquidGlassButton';

export default LiquidGlassButton;
