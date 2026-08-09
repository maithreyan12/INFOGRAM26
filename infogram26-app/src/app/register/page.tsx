'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { db, storage } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';
import { CheckCircle, User, Upload, Calendar, ClipboardList, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const personalInfoSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  college: z.string().min(1, 'College is required'),
  department: z.string().min(1, 'Department is required'),
  year: z.enum(['1st', '2nd', '3rd', '4th']),
  registerNumber: z.string().min(1, 'Register Number is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  gender: z.enum(['Male', 'Female', 'Other']),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

const demoEvents = [
  { id: 'demo-1', name: 'Code Clash', category: 'Technical', fee: 150, time: '09:00 AM - 11:00 AM' },
  { id: 'demo-2', name: 'Web Warriors', category: 'Technical', fee: 200, time: '11:00 AM - 01:00 PM' },
  { id: 'demo-3', name: 'Debug Dash', category: 'Technical', fee: 150, time: '02:00 PM - 04:00 PM' },
  { id: 'demo-4', name: 'AI Arena', category: 'Technical', fee: 200, time: '09:00 AM - 12:00 PM' },
  { id: 'demo-5', name: 'Paper Presentation', category: 'Technical', fee: 100, time: '10:00 AM - 12:00 PM' },
  { id: 'demo-6', name: 'Project Expo', category: 'Technical', fee: 200, time: '09:00 AM - 05:00 PM' },
  { id: 'demo-7', name: 'Pixel Perfect', category: 'Non-Technical', fee: 100, time: '01:00 PM - 03:00 PM' },
  { id: 'demo-8', name: 'Treasure Hunt', category: 'Non-Technical', fee: 100, time: '11:00 AM - 01:00 PM' },
  { id: 'demo-9', name: 'Quiz Quest', category: 'Non-Technical', fee: 100, time: '02:00 PM - 03:30 PM' },
  { id: 'demo-10', name: 'Connections', category: 'Non-Technical', fee: 100, time: '10:00 AM - 12:00 PM' },
];

const STEPS = [
  { number: 1, label: 'Personal Info', icon: User },
  { number: 2, label: 'College ID', icon: Upload },
  { number: 3, label: 'Select Events', icon: Calendar },
  { number: 4, label: 'Review', icon: ClipboardList },
];

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00d4ff]/60 focus:bg-white/8 transition-all duration-200';
const labelClass = 'block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2';
const errorClass = 'text-red-400 text-xs mt-1.5';
const selectClass =
  'w-full bg-[#071422] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00d4ff]/60 transition-all duration-200 cursor-pointer';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const inputClass = `w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 border ${
    isDark
      ? 'bg-slate-950/80 border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400'
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#7c3aed]'
  }`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${
    isDark ? 'text-slate-200' : 'text-slate-900'
  }`;
  const errorClass = 'text-red-500 text-xs mt-1.5 font-semibold';
  const selectClass = `w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 cursor-pointer border ${
    isDark
      ? 'bg-slate-950 border-slate-700 text-white focus:outline-none focus:border-amber-400'
      : 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:border-[#7c3aed]'
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
    const fetchEvents = async () => {
      try {
        if (!db) { setEvents(demoEvents); return; }
        const snap = await getDocs(collection(db, 'events'));
        setEvents(snap.empty ? demoEvents : snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch { setEvents(demoEvents); }
    };
    fetchEvents();
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      const ok = await trigger();
      if (ok) setStep(2);
    } else if (step === 2) {
      if (idFile) setStep(3);
    } else if (step === 3) {
      if (selectedEvents.length > 0) setStep(4);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
  };

  const handleFileSelection = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      setIdFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setIdPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setIdPreview(null);
      }
    }
  };

  const toggleEvent = (id: string) =>
    setSelectedEvents(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  const getTotalFee = () =>
    selectedEvents.reduce((sum, id) => sum + (events.find(e => e.id === id)?.fee || 0), 0);

  const generateApplicantId = () => `APP${Math.floor(100000 + Math.random() * 900000)}`;

  const onSubmit = async () => {
    if (!idFile || selectedEvents.length === 0) return;
    setIsSubmitting(true);
    try {
      if (!db || !storage) {
        router.push(`/payment?regId=mock_reg_123`);
        return;
      }
      setUploadProgress(25);
      const storageRef = ref(storage, `college-ids/${Date.now()}-${idFile.name}`);
      await uploadBytes(storageRef, idFile);
      setUploadProgress(60);
      const idUrl = await getDownloadURL(storageRef);
      const applicantId = generateApplicantId();
      const docRef = await addDoc(collection(db, 'registrations'), {
        applicantId,
        personalInfo: formData,
        idCardUrl: idUrl,
        events: selectedEvents,
        eventNames: selectedEvents.map(id => events.find(e => e.id === id)?.name).filter(Boolean),
        totalFee: getTotalFee(),
        status: 'pending_payment',
        createdAt: serverTimestamp(),
      });
      setUploadProgress(100);
      router.push(`/payment?regId=${docRef.id}`);
    } catch (err) {
      console.error('Registration failed:', err);
      setIsSubmitting(false);
    }
  };

  const progressPct = ((step - 1) / 3) * 100;
  const techEvents = events.filter(e => e.category === 'Technical' || !e.category);
  const nonTechEvents = events.filter(e => e.category === 'Non-Technical');

  return (
    <PublicLayout>
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4 border ${
              isDark ? 'bg-purple-500/10 border-purple-500/30 text-amber-300' : 'bg-[#7c3aed]/10 border-[#7c3aed]/20 text-[#7c3aed]'
            }`}>
              ⚡ Registration Open
            </div>
            <h1
              className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-none mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                background: isDark
                  ? 'linear-gradient(180deg, #ffffff 0%, #c084fc 50%, #38bdf8 100%)'
                  : 'linear-gradient(180deg, #0f172a 0%, #6d28d9 55%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}
            >
              INFOGRAM&apos;26
            </h1>
            <p className={`text-xs sm:text-sm font-extrabold uppercase tracking-[0.16em] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              NATIONAL LEVEL TECHNICAL SYMPOSIUM
            </p>
          </div>

          {/* Step Indicators */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative mb-3">
              <div className={`absolute left-0 right-0 top-5 h-px mx-12 z-0 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        done ? (isDark ? 'bg-amber-300 border-amber-300 text-slate-950 font-bold' : 'bg-[#7c3aed] border-[#7c3aed] text-white')
                          : active ? (isDark ? 'bg-purple-500/20 border-amber-300 text-amber-300 font-bold' : 'bg-[#7c3aed]/15 border-[#7c3aed] text-[#7c3aed] font-bold')
                          : (isDark ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-white border-slate-200 text-slate-400')
                      }`}
                    >
                      {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block transition-colors duration-300 ${
                        active ? (isDark ? 'text-amber-300' : 'text-[#7c3aed]') : done ? (isDark ? 'text-slate-200' : 'text-slate-700') : (isDark ? 'text-slate-500' : 'text-slate-400')
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
              className={`glass-card p-6 sm:p-8 rounded-3xl border transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/90 border-purple-500/30 text-white shadow-2xl' 
                  : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'
              }`}
            >
              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <User className={`w-5 h-5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input {...register('fullName')} className={inputClass} placeholder="Enter your full name" />
                      {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input {...register('email')} type="email" className={inputClass} placeholder="your@email.com" />
                      {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <input {...register('phone')} className={inputClass} placeholder="10-digit number" maxLength={10} />
                      {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>College Name *</label>
                      <input {...register('college')} className={inputClass} placeholder="Your college name" />
                      {errors.college && <p className={errorClass}>{errors.college.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Department *</label>
                      <input {...register('department')} className={inputClass} placeholder="e.g. B.E Computer Science" />
                      {errors.department && <p className={errorClass}>{errors.department.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Register Number *</label>
                      <input {...register('registerNumber')} className={inputClass} placeholder="College register number" />
                      {errors.registerNumber && <p className={errorClass}>{errors.registerNumber.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Year of Study *</label>
                      <select {...register('year')} className={selectClass}>
                        <option value="" className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>Select Year</option>
                        <option value="1st" className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>1st Year</option>
                        <option value="2nd" className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>2nd Year</option>
                        <option value="3rd" className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>3rd Year</option>
                        <option value="4th" className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>4th Year</option>
                      </select>
                      {errors.year && <p className={errorClass}>{errors.year.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Gender *</label>
                      <div className="flex gap-5 mt-3">
                        {['Male', 'Female', 'Other'].map(g => (
                          <label key={g} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value={g} {...register('gender')} className="accent-[#7c3aed] w-4 h-4" />
                            <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{g}</span>
                          </label>
                        ))}
                      </div>
                      {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Upload className={`w-5 h-5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} /> College ID Upload
                  </h2>
                  <div
                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
                      dragOver ? (isDark ? 'border-amber-300 bg-amber-300/10' : 'border-[#7c3aed] bg-[#7c3aed]/10')
                        : idFile ? 'border-emerald-500/50 bg-emerald-500/5'
                        : isDark ? 'border-slate-700 hover:border-amber-300/40 hover:bg-slate-800/50' : 'border-slate-300 hover:border-[#7c3aed]/40 hover:bg-slate-50'
                    }`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => document.getElementById('id-upload')?.click()}
                  >
                    <input type="file" id="id-upload" className="hidden" accept="image/*,.pdf"
                      onChange={e => e.target.files?.[0] && handleFileSelection(e.target.files[0])} />
                    {idFile ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <p className="text-emerald-600 font-bold">{idFile.name}</p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Click to change file</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-purple-500/10' : 'bg-[#7c3aed]/10'}`}>
                          <Upload className={`w-8 h-8 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                        </div>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Drag & drop your College ID</p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>or click to browse • JPG, PNG, PDF accepted</p>
                        <div className="btn-primary px-5 py-2 rounded-full text-sm font-bold mt-2">Choose File</div>
                      </div>
                    )}
                  </div>
                  {idPreview && (
                    <div className="mt-6">
                      <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Preview</p>
                      <img src={idPreview} alt="ID Preview" className="max-h-56 mx-auto rounded-xl border border-slate-300 shadow-lg" />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <h2 className={`text-xl font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Calendar className={`w-5 h-5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} /> Select Events
                  </h2>
                  <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Select one or more events to participate in</p>

                  {techEvents.length > 0 && (
                    <div className="mb-6">
                      <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>🔧 Technical Events</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {techEvents.map(event => {
                          const sel = selectedEvents.includes(event.id);
                          return (
                            <div key={event.id} onClick={() => toggleEvent(event.id)}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                                sel 
                                  ? isDark ? 'border-amber-300 bg-amber-300/10' : 'border-[#7c3aed] bg-[#7c3aed]/10'
                                  : isDark ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.name}</h3>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  sel 
                                    ? isDark ? 'border-amber-300 bg-amber-300' : 'border-[#7c3aed] bg-[#7c3aed]'
                                    : isDark ? 'border-slate-700' : 'border-slate-300'
                                }`}>
                                  {sel && <span className={`text-[10px] font-black ${isDark ? 'text-black' : 'text-white'}`}>✓</span>}
                                </div>
                              </div>
                              <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{event.time}</p>
                              <p className="text-amber-500 font-extrabold text-sm">₹{event.fee}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {nonTechEvents.length > 0 && (
                    <div className="mb-6">
                      <p className="text-teal-500 text-xs font-bold uppercase tracking-wider mb-3">🎭 Non-Technical Events</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {nonTechEvents.map(event => {
                          const sel = selectedEvents.includes(event.id);
                          return (
                            <div key={event.id} onClick={() => toggleEvent(event.id)}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                                sel 
                                  ? 'border-teal-500 bg-teal-500/10'
                                  : isDark ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.name}</h3>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  sel ? 'border-teal-500 bg-teal-500' : isDark ? 'border-slate-700' : 'border-slate-300'
                                }`}>
                                  {sel && <span className="text-white text-[10px] font-black">✓</span>}
                                </div>
                              </div>
                              <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{event.time}</p>
                              <p className="text-amber-500 font-extrabold text-sm">₹{event.fee}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className={`mt-4 p-4 rounded-2xl border flex justify-between items-center ${
                    isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-[#7c3aed]/5 border-[#7c3aed]/20'
                  }`}>
                    <div>
                      <p className={`text-xs uppercase font-bold tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Selected</p>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs uppercase font-bold tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Total Fee</p>
                      <p className="text-amber-500 font-black text-2xl">₹{getTotalFee()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div>
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <ClipboardList className={`w-5 h-5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} /> Review & Submit
                  </h2>
                  <div className="space-y-5">
                    <div className={`rounded-2xl p-5 border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>Personal Details</h3>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                        {[
                          ['Name', formData.fullName], ['Email', formData.email],
                          ['Phone', formData.phone], ['College', formData.college],
                          ['Department', formData.department], ['Reg. No.', formData.registerNumber],
                          ['Year', formData.year], ['Gender', formData.gender],
                        ].map(([key, val]) => (
                          <div key={key}>
                            <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{key}</p>
                            <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-2xl p-5 border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>Selected Events</h3>
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
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Total Amount</span>
                        <span className="text-amber-500 font-black text-xl">₹{getTotalFee()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200/20">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 border transition-all ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                        : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (step === 1 && (!formData.fullName || !formData.email || !formData.phone || !formData.college || !formData.department || !formData.registerNumber || !formData.year || !formData.gender)) ||
                      (step === 2 && !idFile) ||
                      (step === 3 && selectedEvents.length === 0)
                    }
                    className="btn-primary px-7 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="btn-primary px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing ({uploadProgress}%)</span>
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
