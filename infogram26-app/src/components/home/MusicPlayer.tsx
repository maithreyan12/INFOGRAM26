'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, Pause, Play, X, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  src: string;
  songName?: string;
  artist?: string;
}

export default function MusicPlayer({
  src,
  songName = 'INFOGRAM\'26 Theme',
  artist = 'Background Music',
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Update progress bar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener('timeupdate', update);
    return () => audio.removeEventListener('timeupdate', update);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  if (!visible) return null;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />

      {/* Floating Player — bottom right */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 2 }}
          className="fixed bottom-6 right-4 z-50"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {/* Expanded panel */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="mb-3 rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(4,13,26,0.92)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,212,255,0.1)',
                  width: '240px',
                }}
              >
                {/* Song info */}
                <div className="p-4">
                  {/* Animated bars when playing */}
                  <div className="flex items-center gap-1 mb-3 h-6">
                    {playing ? (
                      [1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 rounded-full bg-[#00d4ff]"
                          animate={{ height: ['4px', '20px', '8px', '16px', '4px'] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.12,
                            ease: 'easeInOut',
                          }}
                        />
                      ))
                    ) : (
                      [1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-[#00d4ff]/40" />
                      ))
                    )}
                    <Music2 className="w-4 h-4 text-[#00d4ff]/60 ml-auto" />
                  </div>

                  {/* Song name */}
                  <div className="overflow-hidden mb-1">
                    <p
                      className="text-white font-bold text-sm truncate"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {songName}
                    </p>
                    <p className="text-white/40 text-xs truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                      {artist}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1 rounded-full bg-white/10 mt-3 mb-4 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#0097c7]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={toggleMute}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors bg-white/5"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>

                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #00d4ff, #0097c7)',
                        boxShadow: '0 4px 20px rgba(0,212,255,0.4)',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      {playing
                        ? <Pause className="w-4 h-4 text-white" />
                        : <Play className="w-4 h-4 text-white ml-0.5" />}
                    </button>

                    <button
                      onClick={() => { setVisible(false); audioRef.current?.pause(); }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors bg-white/5"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating button */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileTap={{ scale: 0.92 }}
            className="w-12 h-12 rounded-full flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,150,200,0.15))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,212,255,0.4)',
              boxShadow: playing
                ? '0 0 25px rgba(0,212,255,0.5), 0 4px 20px rgba(0,0,0,0.4)'
                : '0 4px 20px rgba(0,0,0,0.4)',
              WebkitTapHighlightColor: 'transparent',
            }}
            aria-label="Music Player"
          >
            <Music2 className={`w-5 h-5 ${playing ? 'text-[#00d4ff]' : 'text-white/70'}`} />

            {/* Pulse ring when playing */}
            {playing && (
              <motion.div
                className="absolute inset-0 rounded-full border border-[#00d4ff]/50"
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
