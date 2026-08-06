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
            <div className="inline-flex items-center gap-2 bg-[#00d4ff]/10 border border-[#00d4ff]/25 rounded-full px-4 py-1.5 text-xs font-semibold text-[#00d4ff] uppercase tracking-wider mb-4">
              ⚡ Registration Open
            </div>
            <h1
              className="text-3xl sm:text-5xl font-black tracking-tight gradient-text-animated uppercase leading-none mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              INFOGRAM&apos;26
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.12em' }}>
              NATIONAL LEVEL TECHNICAL SYMPOSIUM
            </p>
          </div>

          {/* Step Indicators */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative mb-3">
              <div className="absolute left-0 right-0 top-5 h-px bg-white/8 mx-12 z-0">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00b8d4] rounded-full"
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
                        done ? 'bg-[#00d4ff] border-[#00d4ff] text-black'
                          : active ? 'bg-[#00d4ff]/15 border-[#00d4ff] text-[#00d4ff]'
                          : 'bg-white/5 border-white/15 text-white/30'
                      }`}
                    >
                      {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider hidden sm:block transition-colors duration-300 ${
                        active ? 'text-[#00d4ff]' : done ? 'text-white/70' : 'text-white/25'
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
              className="glass-card p-6 sm:p-8 rounded-2xl"
            >
              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="text-[#00d4ff] w-5 h-5" /> Personal Information
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
                        <option value="" className="bg-[#071422]">Select Year</option>
                        <option value="1st" className="bg-[#071422]">1st Year</option>
                        <option value="2nd" className="bg-[#071422]">2nd Year</option>
                        <option value="3rd" className="bg-[#071422]">3rd Year</option>
                        <option value="4th" className="bg-[#071422]">4th Year</option>
                      </select>
                      {errors.year && <p className={errorClass}>{errors.year.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Gender *</label>
                      <div className="flex gap-5 mt-3">
                        {['Male', 'Female', 'Other'].map(g => (
                          <label key={g} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value={g} {...register('gender')} className="accent-[#00d4ff] w-4 h-4" />
                            <span className="text-white/80 text-sm">{g}</span>
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
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Upload className="text-[#00d4ff] w-5 h-5" /> College ID Upload
                  </h2>
                  <div
                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
                      dragOver ? 'border-[#00d4ff] bg-[#00d4ff]/10'
                        : idFile ? 'border-green-400/50 bg-green-400/5'
                        : 'border-white/15 hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/5'
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
                        <div className="w-16 h-16 bg-green-400/15 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        <p className="text-green-400 font-semibold">{idFile.name}</p>
                        <p className="text-white/40 text-sm">Click to change file</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-[#00d4ff]/10 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-[#00d4ff]" />
                        </div>
                        <p className="text-white font-semibold">Drag & drop your College ID</p>
                        <p className="text-white/40 text-sm">or click to browse • JPG, PNG, PDF accepted</p>
                        <div className="btn-primary px-5 py-2 rounded-full text-sm font-medium mt-2">Choose File</div>
                      </div>
                    )}
                  </div>
                  {idPreview && (
                    <div className="mt-6">
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Preview</p>
                      <img src={idPreview} alt="ID Preview" className="max-h-56 mx-auto rounded-xl border border-white/10 shadow-lg" />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Calendar className="text-[#00d4ff] w-5 h-5" /> Select Events
                  </h2>
                  <p className="text-white/40 text-sm mb-6">Select one or more events to participate in</p>

                  {techEvents.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[#00d4ff] text-xs font-bold uppercase tracking-wider mb-3">🔧 Technical Events</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {techEvents.map(event => {
                          const sel = selectedEvents.includes(event.id);
                          return (
                            <div key={event.id} onClick={() => toggleEvent(event.id)}
                              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                sel ? 'border-[#00d4ff]/60 bg-[#00d4ff]/10' : 'border-white/10 bg-white/3 hover:border-[#00d4ff]/30'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h3 className="font-bold text-white text-sm">{event.name}</h3>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${sel ? 'border-[#00d4ff] bg-[#00d4ff]' : 'border-white/25'}`}>
                                  {sel && <span className="text-black text-[10px] font-black">✓</span>}
                                </div>
                              </div>
                              <p className="text-white/40 text-xs mb-1">{event.time}</p>
                              <p className="text-[#ffd700] font-bold text-sm">₹{event.fee}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {nonTechEvents.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[#ffd700] text-xs font-bold uppercase tracking-wider mb-3">🎭 Non-Technical Events</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {nonTechEvents.map(event => {
                          const sel = selectedEvents.includes(event.id);
                          return (
                            <div key={event.id} onClick={() => toggleEvent(event.id)}
                              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                sel ? 'border-[#ffd700]/60 bg-[#ffd700]/8' : 'border-white/10 bg-white/3 hover:border-[#ffd700]/30'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h3 className="font-bold text-white text-sm">{event.name}</h3>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${sel ? 'border-[#ffd700] bg-[#ffd700]' : 'border-white/25'}`}>
                                  {sel && <span className="text-black text-[10px] font-black">✓</span>}
                                </div>
                              </div>
                              <p className="text-white/40 text-xs mb-1">{event.time}</p>
                              <p className="text-[#ffd700] font-bold text-sm">₹{event.fee}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-4 rounded-xl bg-[#00d4ff]/8 border border-[#00d4ff]/20 flex justify-between items-center">
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider">Selected</p>
                      <p className="text-white font-semibold">{selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs uppercase tracking-wider">Total Fee</p>
                      <p className="text-[#ffd700] font-black text-2xl">₹{getTotalFee()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ClipboardList className="text-[#00d4ff] w-5 h-5" /> Review & Submit
                  </h2>
                  <div className="space-y-5">
                    <div className="bg-white/4 rounded-xl p-5 border border-white/8">
                      <h3 className="text-[#00d4ff] text-xs font-bold uppercase tracking-wider mb-4">Personal Details</h3>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                        {[
                          ['Name', formData.fullName], ['Email', formData.email],
                          ['Phone', formData.phone], ['College', formData.college],
                          ['Department', formData.department], ['Reg. No.', formData.registerNumber],
                          ['Year', formData.year], ['Gender', formData.gender],
                        ].map(([key, val]) => (
                          <div key={key}>
                            <p className="text-white/40 text-xs">{key}</p>
                            <p className="text-white text-sm font-medium truncate">{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/4 rounded-xl p-5 border border-white/8">
                      <h3 className="text-[#00d4ff] text-xs font-bold uppercase tracking-wider mb-4">Selected Events</h3>
                      <ul className="space-y-2">
                        {selectedEvents.map(id => {
                          const event = events.find(e => e.id === id);
                          return (
                            <li key={id} className="flex justify-between items-center text-sm">
                              <span className="text-white flex items-center gap-2"><span className="text-[#00d4ff]">✓</span>{event?.name}</span>
                              <span className="text-[#ffd700] font-semibold">₹{event?.fee}</span>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-white/60 font-medium">Total Amount Due</span>
                        <span className="text-[#ffd700] font-black text-xl">₹{getTotalFee()}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-[#ffd700]/8 border border-[#ffd700]/20 rounded-xl p-4">
                      <span className="text-[#ffd700] text-lg mt-0.5">⚠️</span>
                      <p className="text-white/70 text-sm">
                        After clicking <strong className="text-white">Proceed to Payment</strong>, scan the UPI QR code, pay, then enter your UTR number to confirm. Your QR ticket will be generated instantly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-white/8">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} disabled={isSubmitting}
                    className="btn-glass flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button onClick={handleNext}
                    disabled={(step === 2 && !idFile) || (step === 3 && selectedEvents.length === 0)}
                    className="btn-primary flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={onSubmit} disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2 px-8 py-3 rounded-xl font-bold disabled:opacity-60">
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing... {uploadProgress > 0 && `${uploadProgress}%`}</>
                    ) : (
                      <>Proceed to Payment <ChevronRight className="w-4 h-4" /></>
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
