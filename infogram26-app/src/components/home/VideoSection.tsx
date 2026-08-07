'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  // Autoplay (muted) when section comes into view
  useEffect(() => {
    if (isInView && videoRef.current && !hasStarted) {
      videoRef.current.play().then(() => {
        setPlaying(true);
        setHasStarted(true);
      }).catch(() => {});
    }
  }, [isInView, hasStarted]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const openFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if ((videoRef.current as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
      (videoRef.current as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    }
  };

  return (
    <section ref={sectionRef} className="section-padding container-xl px-4 mx-auto relative">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="text-center mb-10"
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

      {/* Video Card — cinematic reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 40 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1], delay: 0.25 }}
        className="relative mx-auto max-w-4xl"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onTouchStart={() => setShowControls(true)}
        onTouchEnd={() => setTimeout(() => setShowControls(false), 2500)}
      >
        {/* Glow aura behind video */}
        <div
          className="absolute -inset-3 rounded-3xl opacity-40 blur-2xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.3), transparent 70%)' }}
        />

        {/* Video wrapper */}
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10"
          style={{
            background: '#000',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Top cinematic bar */}
          <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 bg-black z-10 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="mx-auto text-white/30 text-xs tracking-widest font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              INFOGRAM&apos;26
            </span>
          </div>

          {/* Bottom cinematic bar */}
          <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 bg-black z-10" />

          {/* The Video */}
          <div className="pt-8 sm:pt-10 pb-8 sm:pb-10">
            <video
              ref={videoRef}
              src="/infogram-promo.mp4"
              className="w-full block"
              muted
              loop
              playsInline
              preload="metadata"
              style={{ display: 'block' }}
            />
          </div>

          {/* Center play overlay */}
          <motion.button
            onClick={togglePlay}
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: playing && !showControls ? 'transparent' : 'rgba(0,0,0,0.25)' }}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            <motion.div
              initial={false}
              animate={{
                opacity: !playing || showControls ? 1 : 0,
                scale: !playing || showControls ? 1 : 0.85,
              }}
              transition={{ duration: 0.2 }}
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(0,212,255,0.18)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(0,212,255,0.5)',
                boxShadow: '0 0 30px rgba(0,212,255,0.3)',
              }}
            >
              {playing ? (
                <Pause className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              ) : (
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-0.5" />
              )}
            </motion.div>
          </motion.button>

          {/* Bottom controls bar */}
          <motion.div
            initial={false}
            animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-8 sm:bottom-10 left-0 right-0 z-30 px-4 pb-3 flex items-center gap-3"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
          >
            {/* Mute toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitTapHighlightColor: 'transparent' }}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <div className="flex-1" />

            {/* LIVE indicator */}
            <span className="flex items-center gap-1.5 text-xs text-white/60 font-medium" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] inline-block" />
              INFOGRAM&apos;26 PROMO
            </span>

            {/* Fullscreen */}
            <button
              onClick={(e) => { e.stopPropagation(); openFullscreen(); }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitTapHighlightColor: 'transparent' }}
              aria-label="Fullscreen"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>

        {/* Bottom reflection */}
        <div
          className="h-8 mx-4 rounded-b-3xl opacity-20 blur-sm"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,212,255,0.15), transparent)',
            transform: 'scaleY(-0.3) translateY(-80%)',
          }}
        />
      </motion.div>

      {/* Tags below video */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-wrap justify-center gap-2 mt-8"
      >
        {['#INFOGRAM26', '#NationalLevelSymposium', '#CAHCET', '#ITDept', '#TechFest'].map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-xs font-semibold text-[#00d4ff]/70 border border-[#00d4ff]/15 bg-[#00d4ff]/5"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
