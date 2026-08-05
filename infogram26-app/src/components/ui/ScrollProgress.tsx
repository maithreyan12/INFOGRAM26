'use client';
import { motion, useScroll, useSpring } from 'framer-motion';
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%', position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)', zIndex: 9999, willChange: 'transform' }}
    />
  );
}
