'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, Pause, Play, X, Volume2, VolumeX, SkipForward, SkipBack, ListMusic, Disc } from 'lucide-react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
}

export const ONLINE_PLAYLIST: Track[] = [
  {
    id: 'vaathi-coming',
    title: 'Vaathi Coming (Mass Remix)',
    artist: 'Anirudh Ravichander • Master',
    src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=electronic-future-beats-117997.mp3',
  },
  {
    id: 'hukum-mass',
    title: 'Hukum (Thalaivar Alappara)',
    artist: 'Anirudh Ravichander • Jailer',
    src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=sport-fashion-rock-action-142823.mp3',
  },
  {
    id: 'aalaporaan-thamizhan',
    title: 'Aalaporaan Thamizhan',
    artist: 'A.R. Rahman • Mersal',
    src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=energetic-hip-hop-8303.mp3',
  },
  {
    id: 'infogram-edm',
    title: 'INFogram\'26 Cyber Anthem',
    artist: 'IT Association • CAHCET',
    src: 'https://cdn.pixabay.com/download/audio/2023/10/24/audio_33132e0e98.mp3?filename=tech-house-beat-172554.mp3',
  },
  {
    id: 'vikram-title',
    title: 'Vikram Title Track',
    artist: 'Anirudh Ravichander • Vikram',
    src: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939794d2c.mp3?filename=action-rock-124476.mp3',
  },
];

interface MusicPlayerProps {
  initialTrackId?: string;
}

export default function MusicPlayer({ initialTrackId }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);

  const currentTrack = ONLINE_PLAYLIST[currentTrackIndex] || ONLINE_PLAYLIST[0];

  // Update progress bar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    const handleError = () => {
      setAudioError(true);
      setPlaying(false);
    };

    audio.addEventListener('timeupdate', update);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrackIndex]);

  // When current track index changes, reset error & attempt playback if already playing
  useEffect(() => {
    setAudioError(false);
    if (audioRef.current) {
      audioRef.current.load();
      if (playing) {
        audioRef.current.play().catch(() => setPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setAudioError(false);
      audio
        .play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.warn('Playback blocked or failed:', err);
          setAudioError(true);
          setPlaying(false);
        });
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % ONLINE_PLAYLIST.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + ONLINE_PLAYLIST.length) % ONLINE_PLAYLIST.length);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  if (!visible) return null;

  return (
    <>
      <audio ref={audioRef} src={currentTrack.src} preload="metadata" />

      {/* Floating Player Widget */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 1 }}
          className="fixed bottom-6 right-4 z-50"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {/* Expanded control panel */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="mb-3 rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(4, 13, 26, 0.95)',
                  backdropFilter: 'blur(28px)',
                  border: '1.5px solid rgba(0, 212, 255, 0.3)',
                  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 212, 255, 0.15)',
                  width: '280px',
                }}
              >
                {/* Main Player Content */}
                <div className="p-4">
                  {/* Header / Animated Equalizer */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 h-6">
                      {playing ? (
                        [1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full bg-[#00d4ff]"
                            animate={{ height: ['4px', '22px', '8px', '18px', '4px'] }}
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
                          <div key={i} className="w-1 h-1.5 rounded-full bg-[#00d4ff]/40" />
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPlaylist(!showPlaylist)}
                        className={`p-1.5 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ${
                          showPlaylist ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                        title="Choose Track"
                      >
                        <ListMusic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setVisible(false); audioRef.current?.pause(); }}
                        className="p-1.5 rounded-lg text-white/50 hover:text-white bg-white/5 transition-colors"
                        title="Close Player"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Song Title & Artist */}
                  <div className="overflow-hidden mb-2">
                    <div className="flex items-center gap-2">
                      <Disc className={`w-4 h-4 text-[#00d4ff] shrink-0 ${playing ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                      <p className="text-white font-black text-sm truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                        {currentTrack.title}
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs font-semibold truncate mt-0.5 pl-6">
                      {currentTrack.artist}
                    </p>
                  </div>

                  {/* Audio Load Error Warning */}
                  {audioError && (
                    <p className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-1 rounded-md mb-2 border border-amber-400/20">
                      ⚠️ Network error loading track. Try clicking Next!
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div
                    onClick={(e) => {
                      const audio = audioRef.current;
                      if (!audio || !audio.duration) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const pct = clickX / rect.width;
                      audio.currentTime = pct * audio.duration;
                    }}
                    className="w-full h-1.5 rounded-full bg-white/10 my-3 overflow-hidden cursor-pointer group"
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] via-purple-400 to-amber-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Playlist Selector Dropdown */}
                  <AnimatePresence>
                    {showPlaylist && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-3 border-t border-b border-white/10 py-2 space-y-1 max-h-40 overflow-y-auto custom-scrollbar"
                      >
                        {ONLINE_PLAYLIST.map((track, idx) => (
                          <button
                            key={track.id}
                            onClick={() => {
                              setCurrentTrackIndex(idx);
                              setPlaying(true);
                              setShowPlaylist(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              idx === currentTrackIndex
                                ? 'bg-[#00d4ff]/20 text-[#00d4ff] font-black'
                                : 'text-gray-300 hover:bg-white/5 font-semibold'
                            }`}
                          >
                            <span className="truncate">{track.title}</span>
                            {idx === currentTrackIndex && (
                              <span className="text-[10px] bg-[#00d4ff] text-slate-950 font-black px-1.5 py-0.5 rounded-full">
                                PLAYING
                              </span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Full Controls Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={toggleMute}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors bg-white/5 border border-white/10"
                      title={muted ? 'Unmute' : 'Mute'}
                    >
                      {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevTrack}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors bg-white/5 border border-white/10"
                        title="Previous Song"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>

                      {/* Play/Pause Button */}
                      <button
                        onClick={togglePlay}
                        className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
                        style={{
                          background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)',
                        }}
                        title={playing ? 'Pause' : 'Play'}
                      >
                        {playing ? (
                          <Pause className="w-5 h-5 text-white fill-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        )}
                      </button>

                      <button
                        onClick={handleNextTrack}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors bg-white/5 border border-white/10"
                        title="Next Song"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Trigger Button */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileTap={{ scale: 0.92 }}
            className="w-13 h-13 rounded-full flex items-center justify-center relative shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(4, 13, 26, 0.9), rgba(12, 35, 64, 0.9))',
              backdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(0, 212, 255, 0.5)',
              boxShadow: playing
                ? '0 0 30px rgba(0, 212, 255, 0.6), 0 8px 32px rgba(0, 0, 0, 0.5)'
                : '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
            aria-label="Music Player"
          >
            <Music2 className={`w-6 h-6 ${playing ? 'text-[#00d4ff] animate-bounce' : 'text-white'}`} />

            {/* Pulse rings when audio is playing */}
            {playing && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#00d4ff]/60"
                  animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-purple-500/40"
                  animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                />
              </>
            )}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
