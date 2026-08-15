'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';
import { CheckCircle, User, Calendar, ClipboardList, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

const personalInfoSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  college: z.string().min(1, 'College is required'),
  department: z.string().min(1, 'Department is required'),
  year: z.enum(['1st', '2nd', '3rd', '4th']),
  registerNumber: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  gender: z.enum(['Male', 'Female', 'Other']),
}).superRefine((data, ctx) => {
  if (data.year !== '1st' && !data.registerNumber?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Register Number is required for 2nd year and above',
      path: ['registerNumber'],
    });
  }
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

import { OFFICIAL_EVENTS, formatTimeRange, generateApplicantId } from '@/lib/eventsData';

const demoEvents = OFFICIAL_EVENTS.map(e => ({
  id: e.id,
  slug: e.slug,
  name: e.name,
  category: e.category === 'technical' ? 'Technical' : 'Non-Technical',
  fee: e.registrationFee,
  maxParticipants: e.maxParticipants,
  time: formatTimeRange(e.startTime, e.endTime),
  coordinatorName: e.coordinatorName,
  rules: e.rules,
}));

// 3 steps — College ID upload removed
const STEPS = [
  { number: 1, label: 'Personal Info', icon: User },
  { number: 2, label: 'Select Events', icon: Calendar },
  { number: 3, label: 'Review', icon: ClipboardList },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState<any[]>(demoEvents);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Dynamic Theme-aware Style Tokens
  const inputStyle = `w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 border ${
    isDark
      ? 'bg-slate-950/90 border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 shadow-xs'
  }`;

  const labelStyle = `block text-xs font-black uppercase tracking-wider mb-2 ${
    isDark ? 'text-amber-300' : 'text-slate-900'
  }`;

  const errorStyle = 'text-red-500 text-xs mt-1.5 font-bold';

  const selectStyle = `w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 cursor-pointer border ${
    isDark
      ? 'bg-slate-950 border-slate-700 text-white focus:outline-none focus:border-amber-400'
      : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-[#7c3aed] shadow-xs'
  }`;

  const {
    register,
    watch,
    formState: { errors },
    trigger,
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
  });

  const formData = watch();

  useEffect(() => {
    // Check URL query param for preselected event
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const preselected = params.get('event');
      if (preselected) {
        const normPre = preselected.toLowerCase().replace(/[^a-z0-9]/g, '');
        const match = demoEvents.find(
          e => e.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === normPre || e.id === preselected
        );
        if (match) {
          setSelectedEvents([match.id]);
        }
      }
    }

    const fetchEvents = async () => {
      try {
        if (!db) { setEvents(demoEvents); return; }
        const snap = await getDocs(collection(db, 'events'));
        if (snap.empty) {
          setEvents(demoEvents);
        } else {
          const dbEvts = snap.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              slug: data.slug || d.id,
              name: data.name,
              category: data.category === 'technical' || data.category === 'Technical' ? 'Technical' : 'Non-Technical',
              fee: data.registrationFee ?? data.fee ?? 50,
              maxParticipants: data.maxParticipants ?? 2,
              time: data.startTime && data.endTime ? formatTimeRange(data.startTime, data.endTime) : 'Full Day',
              coordinatorName: data.coordinatorName,
              rules: data.rules,
            };
          });
          setEvents(dbEvts.length > 0 ? dbEvts : demoEvents);
        }
      } catch { setEvents(demoEvents); }
    };
    fetchEvents();
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      const ok = await trigger();
      if (ok) setStep(2);
    } else if (step === 2) {
      if (selectedEvents.length > 0) setStep(3);
    }
  };

  const toggleEvent = (id: string) =>
    setSelectedEvents(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  const getTotalFee = () =>
    selectedEvents.reduce((sum, id) => sum + (events.find(e => e.id === id)?.fee || 0), 0);

  const onSubmit = async () => {
    if (selectedEvents.length === 0) return;
    setIsSubmitting(true);
    let targetRegId = 'mock_reg_123';
    const totalFee = getTotalFee();
    const eventNamesList = selectedEvents.map(id => events.find(e => e.id === id)?.name).filter(Boolean);

    try {
      if (db) {
        try {
          const applicantId = generateApplicantId(eventNamesList as string[]);
          const cleanPersonalInfo = JSON.parse(
            JSON.stringify(formData, (key, value) => (value === undefined ? null : value))
          );
          const docRef = await addDoc(collection(db, 'registrations'), {
            applicantId,
            personalInfo: cleanPersonalInfo,
            events: selectedEvents,
            eventNames: eventNamesList,
            totalFee,
            status: 'pending_payment',
            createdAt: serverTimestamp(),
          });
          targetRegId = docRef.id;

          // Non-blocking sync to Google Sheets upon registration completion
          try {
            fetch('/api/sheets', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                applicantId,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                college: formData.college,
                department: formData.department,
                year: formData.year,
                events: eventNamesList.join(', '),
                amount: totalFee,
                paymentMethod: 'pending',
                status: 'pending_payment',
              }),
            }).catch((err) => console.warn('Google Sheets sync warning:', err));
          } catch (sheetsErr) {
            console.warn('Google Sheets sync skipped:', sheetsErr);
          }
        } catch (dbErr) {
          console.warn('Firestore write warning, proceeding to payment:', dbErr);
        }
      }
      toast.success('Registration saved! Opening payment...');
      const params = new URLSearchParams({
        regId: targetRegId,
        fee: String(totalFee),
        events: eventNamesList.join(','),
        name: formData.fullName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        auto: 'true',
      });
      router.push(`/payment?${params.toString()}`);
    } catch (err: any) {
      console.error('Registration error, redirecting to payment:', err);
      const params = new URLSearchParams({
        regId: 'mock_reg_123',
        fee: String(totalFee),
        events: eventNamesList.join(','),
        name: formData.fullName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        auto: 'true',
      });
      router.push(`/payment?${params.toString()}`);
    }
  };

  const progressPct = ((step - 1) / 2) * 100;
  const techEvents = events.filter(e => e.category === 'Technical' || !e.category);
  const nonTechEvents = events.filter(e => e.category === 'Non-Technical');

  return (
    <PublicLayout>
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider mb-4 border ${
              isDark ? 'bg-purple-500/10 border-purple-500/30 text-amber-300' : 'bg-[#7c3aed]/10 border-[#7c3aed]/25 text-[#7c3aed]'
            }`}>
              ⚡ Registration Open
            </div>
            <h1
              className={`text-3xl sm:text-5xl font-black tracking-tight uppercase leading-none mb-3 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              style={{
                fontFamily: 'var(--font-display)',
                textShadow: isDark
                  ? '0 0 20px rgba(192, 132, 252, 0.5)'
                  : '0 2px 8px rgba(15, 23, 42, 0.1)',
              }}
            >
              INFOGRAM&apos;26
            </h1>
            <p className={`text-xs sm:text-sm font-black uppercase tracking-[0.16em] ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              NATIONAL LEVEL TECHNICAL SYMPOSIUM
            </p>
          </div>

          {/* Step Indicators */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative mb-3">
              <div className={`absolute left-0 right-0 top-5 h-1 mx-12 z-0 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <motion.div
                  className={`h-full rounded-full ${isDark ? 'bg-gradient-to-r from-amber-300 to-purple-400' : 'bg-gradient-to-r from-[#7c3aed] to-[#059669]'}`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
              {STEPS.map(s => {
                const Icon = s.icon;
                const done = step > s.number;
                const active = step === s.number;
                return (
                  <div key={s.number} className="flex flex-col items-center gap-2 z-10">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        done ? (isDark ? 'bg-amber-300 border-amber-300 text-slate-950 font-black' : 'bg-[#7c3aed] border-[#7c3aed] text-white font-black')
                          : active ? (isDark ? 'bg-purple-500/20 border-amber-300 text-amber-300 font-black shadow-lg ring-4 ring-amber-300/20' : 'bg-[#7c3aed] border-[#7c3aed] text-white font-black shadow-lg ring-4 ring-[#7c3aed]/20')
                          : (isDark ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-white border-slate-300 text-slate-500 shadow-xs')
                      }`}
                    >
                      {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span
                      className={`text-xs font-black uppercase tracking-wider hidden sm:block transition-colors duration-300 ${
                        active ? (isDark ? 'text-amber-300' : 'text-[#7c3aed]') : done ? (isDark ? 'text-slate-200' : 'text-slate-900') : (isDark ? 'text-slate-500' : 'text-slate-600')
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`p-6 sm:p-10 rounded-3xl border transition-colors duration-300 ${
                isDark
                  ? 'bg-slate-900/90 border-purple-500/30 text-white shadow-2xl backdrop-blur-2xl'
                  : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xl backdrop-blur-2xl'
              }`}
            >
              {/* STEP 1 — Personal Info */}
              {step === 1 && (
                <div>
                  <h2 className={`text-xl sm:text-2xl font-black mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <User className={`w-6 h-6 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelStyle}>Full Name *</label>
                      <input {...register('fullName')} className={inputStyle} placeholder="Enter your full name" />
                      {errors.fullName && <p className={errorStyle}>{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className={labelStyle}>Email Address *</label>
                      <input {...register('email')} type="email" className={inputStyle} placeholder="your@email.com" />
                      {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className={labelStyle}>Phone Number *</label>
                      <input {...register('phone')} className={inputStyle} placeholder="10-digit number" maxLength={10} />
                      {errors.phone && <p className={errorStyle}>{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className={labelStyle}>College Name *</label>
                      <input {...register('college')} className={inputStyle} placeholder="Your college name" />
                      {errors.college && <p className={errorStyle}>{errors.college.message}</p>}
                    </div>
                    <div>
                      <label className={labelStyle}>Department *</label>
                      <input {...register('department')} className={inputStyle} placeholder="e.g. B.E Computer Science" />
                      {errors.department && <p className={errorStyle}>{errors.department.message}</p>}
                    </div>
                    <div>
                      <label className={labelStyle}>
                        Register Number
                        {formData.year === '1st'
                          ? <span className="ml-2 text-[10px] normal-case font-bold text-amber-400/80">(Optional for 1st year)</span>
                          : <span className="ml-1">*</span>
                        }
                      </label>
                      <input {...register('registerNumber')} className={inputStyle} placeholder={formData.year === '1st' ? 'Leave blank if not yet assigned' : 'College register number'} />
                      {errors.registerNumber && <p className={errorStyle}>{errors.registerNumber.message}</p>}
                    </div>
                    <div>
                      <label className={labelStyle}>Year of Study *</label>
                      <select {...register('year')} className={selectStyle}>
                        <option value="" className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>Select Year</option>
                        <option value="1st" className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>1st Year</option>
                        <option value="2nd" className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>2nd Year</option>
                        <option value="3rd" className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>3rd Year</option>
                        <option value="4th" className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>4th Year</option>
                      </select>
                      {errors.year && <p className={errorStyle}>{errors.year.message}</p>}
                    </div>
                    <div>
                      <label className={labelStyle}>Gender *</label>
                      <div className="flex gap-6 mt-3">
                        {['Male', 'Female', 'Other'].map(g => (
                          <label key={g} className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" value={g} {...register('gender')} className="accent-[#7c3aed] w-5 h-5 cursor-pointer" />
                            <span className={`text-sm font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{g}</span>
                          </label>
                        ))}
                      </div>
                      {errors.gender && <p className={errorStyle}>{errors.gender.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Select Events */}
              {step === 2 && (
                <div>
                  <h2 className={`text-xl sm:text-2xl font-black mb-2 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Calendar className={`w-6 h-6 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} /> Select Events
                  </h2>
                  <p className={`text-sm font-bold mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Select one or more events to participate in</p>

                  {techEvents.length > 0 && (
                    <div className="mb-6">
                      <p className={`text-xs font-black uppercase tracking-wider mb-3 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>🔧 Technical Events</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {techEvents.map(event => {
                          const sel = selectedEvents.includes(event.id);
                          return (
                            <div key={event.id} onClick={() => toggleEvent(event.id)}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                                sel
                                  ? isDark ? 'border-amber-300 bg-amber-300/10' : 'border-[#7c3aed] bg-[#7c3aed]/10 ring-2 ring-[#7c3aed]/30'
                                  : isDark ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.name}</h3>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  sel
                                    ? isDark ? 'border-amber-300 bg-amber-300' : 'border-[#7c3aed] bg-[#7c3aed]'
                                    : isDark ? 'border-slate-700' : 'border-slate-300'
                                }`}>
                                  {sel && <span className={`text-[10px] font-black ${isDark ? 'text-black' : 'text-white'}`}>✓</span>}
                                </div>
                              </div>
                              <p className={`text-xs mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{event.time}</p>
                              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/40 dark:border-slate-800">
                                <p className="text-amber-500 font-extrabold text-sm">₹{event.fee}</p>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                                  ⚡ 200 Slots
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {nonTechEvents.length > 0 && (
                    <div className="mb-6">
                      <p className="text-teal-600 font-black text-xs uppercase tracking-wider mb-3">🎭 Non-Technical Events</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {nonTechEvents.map(event => {
                          const sel = selectedEvents.includes(event.id);
                          return (
                            <div key={event.id} onClick={() => toggleEvent(event.id)}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                                sel
                                  ? 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/30'
                                  : isDark ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.name}</h3>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  sel ? 'border-teal-500 bg-teal-500' : isDark ? 'border-slate-700' : 'border-slate-300'
                                }`}>
                                  {sel && <span className="text-white text-[10px] font-black">✓</span>}
                                </div>
                              </div>
                              <p className={`text-xs mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{event.time}</p>
                              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/40 dark:border-slate-800">
                                <p className="text-amber-500 font-extrabold text-sm">₹{event.fee}</p>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                                  ⚡ 200 Slots
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className={`mt-4 p-5 rounded-2xl border flex justify-between items-center ${
                    isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-[#7c3aed]/10 border-[#7c3aed]/20'
                  }`}>
                    <div>
                      <p className={`text-xs uppercase font-black tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Selected</p>
                      <p className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs uppercase font-black tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Total Fee</p>
                      <p className="text-amber-500 font-black text-3xl">₹{getTotalFee()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Review & Submit */}
              {step === 3 && (
                <div>
                  <h2 className={`text-xl sm:text-2xl font-black mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <ClipboardList className={`w-6 h-6 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} /> Review &amp; Submit
                  </h2>
                  <div className="space-y-5">
                    <div className={`rounded-2xl p-5 border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <h3 className={`text-xs font-black uppercase tracking-wider mb-4 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>Personal Details</h3>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                        {[
                          ['Name', formData.fullName], ['Email', formData.email],
                          ['Phone', formData.phone], ['College', formData.college],
                          ['Department', formData.department], ['Reg. No.', formData.registerNumber],
                          ['Year', formData.year], ['Gender', formData.gender],
                        ].map(([key, val]) => (
                          <div key={key}>
                            <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{key}</p>
                            <p className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-2xl p-5 border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <h3 className={`text-xs font-black uppercase tracking-wider mb-4 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>Selected Events</h3>
                      <ul className="space-y-2">
                        {selectedEvents.map(id => {
                          const event = events.find(e => e.id === id);
                          return (
                            <li key={id} className="flex justify-between items-center text-sm">
                              <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{event?.name}</span>
                              <span className="text-amber-500 font-extrabold">₹{event?.fee}</span>
                            </li>
                          );
                        })}
                      </ul>
                      <div className={`mt-4 pt-3 border-t flex justify-between items-center ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                        <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Total Amount</span>
                        <span className="text-amber-500 font-black text-2xl">₹{getTotalFee()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200/40">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className={`px-6 py-3 rounded-full text-sm font-black flex items-center gap-2 border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (step === 1 && (!formData.fullName || !formData.email || !formData.phone || !formData.college || !formData.department || !formData.year || !formData.gender || (formData.year !== '1st' && !formData.registerNumber))) ||
                      (step === 2 && selectedEvents.length === 0)
                    }
                    className="px-8 py-3.5 rounded-full text-sm font-black flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-xl hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-full text-sm font-black flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#059669] text-white shadow-xl hover:brightness-110"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing…</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PublicLayout>
  );
}
