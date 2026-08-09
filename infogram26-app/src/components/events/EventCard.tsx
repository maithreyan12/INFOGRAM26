'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, IndianRupee, ArrowRight } from 'lucide-react';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const isTechnical = event.category === 'technical';
  const seatsLeft = event.maxParticipants - (event.registeredCount || 0);
  const seatsPercentage = (seatsLeft / event.maxParticipants) * 100;

  let seatColor = 'text-emerald-400';
  if (seatsPercentage < 10) seatColor = 'text-red-400';
  else if (seatsPercentage < 50) seatColor = 'text-amber-400';

  const statusColor =
    event.status === 'live'
      ? 'text-red-400 border-red-500/30 bg-red-500/10'
      : event.status === 'completed'
      ? 'text-white/40 border-white/10 bg-white/5'
      : 'text-sky-400 border-sky-500/30 bg-sky-500/10';

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      style={{ willChange: 'transform', WebkitTapHighlightColor: 'transparent' }}
      className="h-full"
    >
      <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
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
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
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
          {/* Decorative corner glow */}
          <div
            className={`absolute bottom-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-40 ${
              isTechnical ? 'bg-sky-400' : 'bg-purple-400'
            }`}
            style={{ transform: 'translate(30%, 30%)' }}
          />
        </div>

        {/* Body */}
        <div className="p-5 flex-grow flex flex-col gap-3">
          <h3 className="font-bold text-[clamp(1rem,3.5vw,1.2rem)] text-slate-900 leading-snug">
            {event.name}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 flex-grow font-medium">
            {event.description}
          </p>

          {/* Info pills */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
              <IndianRupee className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
              <span>₹{event.registrationFee} registration</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-slate-200/80 flex items-center justify-between gap-2">
            <div className="text-xs">
              <span className={`font-bold text-sm ${seatColor}`}>{seatsLeft}</span>
              <span className="text-slate-500 font-semibold ml-1">seats left</span>
            </div>

            <motion.div
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Link
                href={`/events/${event.slug}`}
                className="btn-glass inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full text-slate-900 whitespace-nowrap shadow-xs hover:border-[#7c3aed]/40"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Details <ArrowRight className="w-3.5 h-3.5 text-[#7c3aed]" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
