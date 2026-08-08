'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  useEffect(() => {
    if (isInView && videoRef.current) {
      const playVideo = async () => {
        try {
          videoRef.current!.muted = false;
          await videoRef.current!.play();
        } catch {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }
      };
      playVideo();
    }
  }, [isInView]);

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-20 container-xl px-2 sm:px-4 mx-auto relative">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="text-center mb-8 sm:mb-10 px-2"
      >
        <span
          className="inline-block mb-3 px-5 py-1.5 rounded-full text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/25 text-xs tracking-[0.15em] uppercase font-semibold"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          🎬 Official Promo
        </span>
        <h2
          className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-3"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
        >
          Feel the{' '}
          <span className="gradient-text">INFOGRAM</span>
          <span className="text-[#00d4ff]">&apos;</span>
          <span className="gradient-text">26</span>
          {' '}Energy
        </h2>
        <p className="text-white/50 text-sm sm:text-base max-w-lg mx-auto" style={{ fontFamily: 'var(--font-heading)' }}>
          Experience the most electrifying symposium in Tamil Nadu
        </p>
      </motion.div>

      {/* Edge-to-Edge Video Container — Pure Video, No Frame, No Controls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
        className="relative mx-auto max-w-5xl w-full"
      >
        {/* Glow aura behind video */}
        <div
          className="absolute -inset-2 rounded-2xl sm:rounded-3xl opacity-40 blur-2xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.35), transparent 70%)' }}
        />

        {/* Video wrapper — edge-to-edge */}
        <div
          className="relative w-full rounded-xl sm:rounded-3xl overflow-hidden border border-[#00d4ff]/30 cursor-pointer"
          style={{
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.18)',
            transform: 'translate3d(0,0,0)',
          }}
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            src="/infogram-promo.mp4"
            className="w-full h-full block rounded-xl sm:rounded-3xl object-cover"
            autoPlay
            loop
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      </motion.div>

      {/* Hashtag tags below video */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-wrap justify-center gap-2 mt-8"
      >
        {['#INFOGRAM26', '#NationalLevel', '#CAHCET', '#ITDept', '#TechFest'].map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-xs font-semibold text-[#00d4ff]/70 border border-[#00d4ff]/15 bg-[#00d4ff]/5 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
