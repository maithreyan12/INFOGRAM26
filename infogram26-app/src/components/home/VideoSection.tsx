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

  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().then(() => {
        setPlaying(true);
      }).catch(() => {});
    }
  }, [isInView]);

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
    <section ref={sectionRef} className="py-12 sm:py-20 container-xl px-3 sm:px-4 mx-auto relative">
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

      {/* Mac Window Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
        className="relative mx-auto max-w-5xl w-full"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onTouchStart={() => setShowControls(true)}
        onTouchEnd={() => setTimeout(() => setShowControls(false), 2500)}
      >
        {/* Glow aura behind card */}
        <div
          className="absolute -inset-2 rounded-2xl sm:rounded-3xl opacity-40 blur-2xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.35), transparent 70%)' }}
        />

        {/* Mac Window Shell */}
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#00d4ff]/30 bg-[#071422]"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.18)',
            transform: 'translate3d(0,0,0)',
          }}
        >


          {/* Video Container — Edge-to-Edge inside Mac Shell, zero black gaps */}
          <div className="relative w-full aspect-video bg-black overflow-hidden group">
            <video
              ref={videoRef}
              src="/infogram-promo.mp4"
              className="w-full h-full object-cover block"
              muted={muted}
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

            {/* Play/Pause Center Button Overlay */}
            <motion.button
              onClick={togglePlay}
              className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
              style={{ background: playing && !showControls ? 'transparent' : 'rgba(0,0,0,0.3)' }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              <motion.div
                initial={false}
                animate={{
                  opacity: !playing || showControls ? 1 : 0,
                  scale: !playing || showControls ? 1 : 0.85,
                }}
                transition={{ duration: 0.2 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(0,212,255,0.2)',
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

            {/* Bottom Floating Control Overlay */}
            <motion.div
              initial={false}
              animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 z-30 px-4 py-3 flex items-center gap-3"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4 text-[#00d4ff]" />}
              </button>

              <div className="flex-1" />

              <span className="flex items-center gap-1.5 text-xs text-white/70 font-medium tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse inline-block" />
                INFOGRAM &apos;26 PROMO
              </span>

              <button
                onClick={(e) => { e.stopPropagation(); openFullscreen(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
                aria-label="Fullscreen"
              >
                <Maximize className="w-4 h-4 text-white/80" />
              </button>
            </motion.div>
          </div>
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
