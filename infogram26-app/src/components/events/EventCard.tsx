'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, IndianRupee, ArrowRight } from 'lucide-react';
import { Event } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isTechnical = event.category === 'technical';
  const seatsLeft = event.maxParticipants - (event.registeredCount || 0);
  const seatsPercentage = (seatsLeft / event.maxParticipants) * 100;

  let seatColor = 'text-emerald-500';
  if (seatsPercentage < 10) seatColor = 'text-red-500';
  else if (seatsPercentage < 50) seatColor = 'text-amber-500';

  const statusColor =
    event.status === 'live'
      ? 'text-red-500 border-red-500/30 bg-red-500/10'
      : event.status === 'completed'
      ? isDark ? 'text-slate-400 border-slate-700 bg-slate-800/50' : 'text-slate-500 border-slate-200 bg-slate-100'
      : isDark ? 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10' : 'text-cyan-700 border-cyan-200 bg-cyan-50';

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      style={{ willChange: 'transform', WebkitTapHighlightColor: 'transparent' }}
      className="h-full"
    >
      <div className={`glass-card rounded-2xl overflow-hidden flex flex-col h-full border transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900/85 border-purple-500/30 text-white shadow-2xl hover:border-purple-400/50' 
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-md hover:border-[#7c3aed]/30'
      }`}>
        {/* Banner gradient / Image */}
        <div
          className={`h-28 sm:h-32 relative flex-shrink-0 ${
            event.bannerUrl 
              ? 'bg-cover bg-center' 
              : isTechnical
                ? 'bg-gradient-to-br from-sky-600/50 via-blue-500/30 to-indigo-600/30'
                : 'bg-gradient-to-br from-purple-600/50 via-fuchsia-500/30 to-pink-600/30'
          }`}
          style={event.bannerUrl ? { backgroundImage: `url('${event.bannerUrl}')` } : {}}
        >
          {event.bannerUrl && <div className="absolute inset-0 bg-black/40" />}
          {/* Top-left category label */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md ${
                isTechnical
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                  : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
              }`}
            >
              {isTechnical ? 'Technical' : 'Non-Technical'}
            </span>
          </div>
          {/* Top-right status */}
          <div className="absolute top-3 right-3">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md ${statusColor}`}
            >
              {event.status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex-grow flex flex-col gap-3">
          <h3 className={`font-bold text-[clamp(1rem,3.5vw,1.2rem)] leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {event.name}
          </h3>

          <p className={`text-sm leading-relaxed line-clamp-2 flex-grow font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {event.description}
          </p>

          {/* Info pills */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className={`flex items-center gap-2 text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Calendar className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
              <span>{event.startTime} - {event.endTime}</span>
            </div>

            <div className={`flex items-center gap-2 text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
              <span className="truncate">{event.venue}</span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/20">
              <div className="flex items-center font-extrabold text-amber-500 text-sm">
                <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                <span>{event.registrationFee}</span>
              </div>
              <span className={`text-[11px] font-bold ${seatColor}`}>
                {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Registration Full'}
              </span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/events/${event.slug}`}
            className={`mt-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 border ${
              isDark 
                ? 'bg-purple-500/20 text-amber-300 border-purple-500/40 hover:bg-purple-500/30' 
                : 'bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30 hover:bg-[#7c3aed]/20'
            }`}
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
