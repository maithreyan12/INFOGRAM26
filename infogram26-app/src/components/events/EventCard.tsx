'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, IndianRupee, ArrowRight } from 'lucide-react';
import { Event } from '@/types';
import { useTheme } from '@/context/ThemeContext';

import { formatTimeRange } from '@/lib/eventsData';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isTechnical = event.category === 'technical';
  const totalSlots = event.maxSlots || 200;
  const seatsLeft = Math.max(0, totalSlots - (event.registeredCount || 0));
  const seatsPercentage = (seatsLeft / totalSlots) * 100;

  let seatColor = 'text-emerald-600 dark:text-emerald-400';
  if (seatsPercentage < 10) seatColor = 'text-red-600 dark:text-red-400';
  else if (seatsPercentage < 50) seatColor = 'text-amber-600 dark:text-amber-400';

  const statusColor =
    event.status === 'live'
      ? 'text-red-600 dark:text-red-400 border-red-500/40 bg-red-500/10'
      : event.status === 'completed'
      ? isDark ? 'text-slate-400 border-slate-700 bg-slate-800/50' : 'text-slate-600 border-slate-300 bg-slate-100'
      : isDark ? 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' : 'text-cyan-800 border-cyan-300 bg-cyan-50 font-bold';

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      style={{ willChange: 'transform', WebkitTapHighlightColor: 'transparent' }}
      className="h-full"
    >
      <div className={`rounded-3xl overflow-hidden flex flex-col h-full border transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900/90 border-purple-500/30 text-white shadow-2xl hover:border-purple-400/50 backdrop-blur-2xl' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl hover:border-[#7c3aed]/40 backdrop-blur-2xl'
      }`}>
        {/* Banner gradient / Image */}
        <div
          className={`h-32 sm:h-36 relative flex-shrink-0 ${
            event.bannerUrl 
              ? 'bg-cover bg-center' 
              : isTechnical
                ? 'bg-gradient-to-br from-indigo-700 via-purple-700 to-sky-700'
                : 'bg-gradient-to-br from-purple-700 via-fuchsia-700 to-pink-700'
          }`}
          style={event.bannerUrl ? { backgroundImage: `url('${event.bannerUrl}')` } : {}}
        >
          {event.bannerUrl && <div className="absolute inset-0 bg-black/30" />}
          
          {/* Top-left category label */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md shadow-sm ${
                isTechnical
                  ? 'bg-sky-500/20 text-white border-sky-400/40'
                  : 'bg-purple-500/20 text-white border-purple-400/40'
              }`}
            >
              {isTechnical ? 'Technical' : 'Non-Technical'}
            </span>
          </div>

          {/* Top-right status */}
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md shadow-sm ${statusColor}`}
            >
              {event.status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-grow flex flex-col gap-3">
          <h3 className={`font-black text-lg sm:text-xl leading-snug ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {event.name}
          </h3>

          <p className={`text-sm leading-relaxed line-clamp-2 flex-grow font-semibold ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            {event.description}
          </p>

          {/* Info pills */}
          <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-slate-200/40 dark:border-slate-800">
            <div className={`flex items-center gap-2.5 text-xs font-bold ${
              isDark ? 'text-slate-300' : 'text-slate-800'
            }`}>
              <Calendar className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
              <span>{formatTimeRange(event.startTime, event.endTime)}</span>
            </div>

            <div className={`flex items-center gap-2.5 text-xs font-bold ${
              isDark ? 'text-slate-300' : 'text-slate-800'
            }`}>
              <MapPin className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
              <span className="truncate">{event.venue}</span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-800">
              <div className="flex items-center font-black text-amber-500 text-base">
                <IndianRupee className="w-4 h-4 mr-0.5" />
                <span>{event.registrationFee}</span>
              </div>
              <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {seatsLeft > 0 ? `⚡ ${seatsLeft} / ${totalSlots} Slots` : 'Registration Full'}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Link
              href={`/events/${event.slug}`}
              className={`py-3 px-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 border ${
                isDark 
                  ? 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Details</span>
            </Link>
            {seatsLeft > 0 && event.status !== 'completed' ? (
              <Link
                href={`/register?event=${event.slug}`}
                className={`py-3 px-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 shadow-md ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110' 
                    : 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white hover:brightness-110'
                }`}
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                disabled
                className={`py-3 px-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center cursor-not-allowed border ${
                  isDark ? 'bg-slate-800/50 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                <span>Closed</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
