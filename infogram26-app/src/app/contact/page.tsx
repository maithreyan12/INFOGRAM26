'use client';
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, Building, Send, CheckCircle, Users, ExternalLink, Code, Globe, Sparkles, Compass, MapPin } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/shared/PageHero';
import { useTheme } from '@/context/ThemeContext';

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;

const studentCoordinators = [
  { name: 'Naveeth Khan', phone: '9360257573' },
  { name: 'Farish Sharif', phone: '9487233290' },
  { name: 'Kafil Ahmed', phone: '8940210491' },
  { name: 'MD Thameem', phone: '9361900720' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      if (!db) {
        alert("Message received in offline mode.");
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
        return;
      }
      await addDoc(collection(db, 'contacts'), {
        ...data,
        createdAt: new Date().toISOString(),
        status: 'unread'
      });
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#070913] text-white' : 'bg-[#f8fafc] text-slate-950'}`}>
        
        <PageHero 
          title="Contact Us" 
          subtitle="Get in touch with our organizing committee"
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]}
        />

        <div className="section-padding container-xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-16">
            
            {/* Left Column - Info Cards */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <span className={`inline-block mb-3 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                  isDark ? 'bg-purple-500/10 border-purple-500/30 text-amber-300' : 'bg-[#7c3aed]/10 border-[#7c3aed]/25 text-[#7c3aed]'
                }`}>
                  Reach Out
                </span>
                <h2 className={`text-3xl sm:text-4xl font-black uppercase mb-3 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  Get In Touch
                </h2>
                <p className={`font-black text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                  Have questions about INFOGRAM&apos;26 events, registration, or sponsorship? Reach out directly to our committee.
                </p>
              </div>

              {/* 👑 BOLD HIGH-IMPACT WEBSITE ADMINISTRATOR & DEVELOPER CARD (FIRST) 👑 */}
              <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-2xl relative overflow-hidden transition-all ${
                isDark 
                  ? 'bg-gradient-to-r from-slate-950 via-purple-950/80 to-slate-950 border-amber-400/60 shadow-[0_0_30px_rgba(252,211,77,0.25)] text-white' 
                  : 'bg-gradient-to-r from-purple-50 via-white to-amber-50/60 border-purple-600/50 shadow-2xl text-slate-950'
              }`}>
                {/* Glowing Corner Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-lg ${
                      isDark ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-500/20' : 'bg-purple-600 text-white border-purple-500 shadow-purple-600/30'
                    }`}>
                      <Code className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-amber-400 text-slate-950 border border-amber-300 font-bold shadow-xs">
                          ★ WEBSITE ADMINISTRATOR &amp; DEV ★
                        </span>
                      </div>
                      <h3 className={`text-xl sm:text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`} style={{ fontFamily: 'var(--font-display)' }}>
                        Maithreyan D
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href="https://maithreyan.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border transition-all shadow-md active:scale-95 ${
                        isDark 
                          ? 'bg-amber-400 text-slate-950 border-amber-300 hover:bg-amber-300 shadow-amber-400/20' 
                          : 'bg-[#7c3aed] text-white border-[#7c3aed] hover:bg-[#6d28d9] shadow-purple-600/30'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>Portfolio (maithreyan.in)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                    <a
                      href="tel:+919342706675"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-95 whitespace-nowrap"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call 9342706675</span>
                    </a>
                  </div>
                </div>

                <div className={`pt-3 border-t text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isDark ? 'border-purple-500/20 text-slate-300' : 'border-purple-200 text-slate-700'
                }`}>
                  <p>For any website issues, developer support, or portal admin queries</p>
                  <p className={`font-black ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                    Website: <a href="https://maithreyan.in" target="_blank" rel="noopener noreferrer" className="underline">https://maithreyan.in</a>
                  </p>
                </div>
              </div>

              {/* Student Coordinators Card */}
              <div className={`p-6 rounded-3xl border shadow-xl ${
                isDark ? 'bg-slate-900/90 border-purple-500/35 text-white' : 'bg-white border-slate-200 text-slate-950'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-950'}`}>Student Coordinators</h3>
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Contact our student team for event queries &amp; assistance</p>
                    </div>
                  </div>
                </div>

                {/* Student Coordinators Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {studentCoordinators.map((c) => (
                    <a
                      key={c.name}
                      href={`tel:+91${c.phone}`}
                      className={`p-3 rounded-2xl border flex items-center justify-between group transition-all ${
                        isDark 
                          ? 'bg-slate-950/80 border-purple-500/20 text-white hover:border-amber-300/50' 
                          : 'bg-slate-50 border-slate-200 text-slate-950 hover:border-[#7c3aed]/40'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black flex items-center gap-1.5">
                          <span>{c.name}</span>
                          <span className={`text-[9px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>(Student Coordinator)</span>
                        </div>
                        <div className={`text-xs font-bold ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>{c.phone}</div>
                      </div>
                      <Phone className="w-4 h-4 text-[#7c3aed] group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>

              {/* College Address — Spacious 2-Row Card with Perfect Maps Alignment */}
              <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl ${
                isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
              }`}>
                {/* Header */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-950'}`}>College Address</h3>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 inline-flex items-center gap-1">
                        <Compass className="w-3 h-3 text-blue-400" /> Campus Navigation
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full-Width Spacious Address Text */}
                <div className={`p-4 rounded-2xl border mb-5 ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <p className="font-black text-sm sm:text-base text-purple-400 mb-0.5">
                    Department of Information Technology, Info Club
                  </p>
                  <p className={`font-black text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    C. Abdul Hakeem College of Engineering &amp; Technology
                  </p>
                  <p className="font-bold text-xs sm:text-sm text-slate-400 mt-1">
                    Hakeem Nagar, Melvisharam – 632 509, Ranipet District, Tamil Nadu
                  </p>
                </div>

                {/* Equal Aligned Maps Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://www.google.com/maps/place/C.+Abdul+Hakeem+College+of+Engineering+%26+Technology,+Melvisharam,+Ranipet,+Tamil+Nadu+632509/data=!4m2!3m1!1s0x3bad35d34059d16f:0xb443fab6e00b313f"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 transition-all active:scale-95 group"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#FFFFFF" />
                      <circle cx="12" cy="9" r="2.5" fill="#EA4335" />
                    </svg>
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a
                    href="https://maps.apple.com/p/~nwAp4fu74pyaQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-950 hover:bg-slate-900 text-white border border-slate-700 shadow-lg transition-all active:scale-95 group"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.1-.97.04-2.17.65-2.86 1.45-.61.71-1.15 1.87-.99 2.99 1.09.08 2.22-.53 2.86-1.34z" />
                    </svg>
                    <span>Apple Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-5 flex items-center gap-3.5 rounded-3xl border shadow-xl ${
                  isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
                }`}>
                  <div className="w-10 h-10 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#7c3aed]" />
                  </div>
                  <div>
                    <h3 className={`font-black text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email Us</h3>
                    <a href="mailto:info@cahcet.edu.in" className={`font-black text-sm transition-colors ${isDark ? 'text-slate-100 hover:text-amber-300' : 'text-slate-950 hover:text-[#7c3aed]'}`}>
                      info@cahcet.edu.in
                    </a>
                  </div>
                </div>

                <div className={`p-5 flex items-center gap-3.5 rounded-3xl border shadow-xl ${
                  isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
                }`}>
                  <div className="w-10 h-10 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#7c3aed]" />
                  </div>
                  <div>
                    <h3 className={`font-black text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>HOD Contact</h3>
                    <a href="tel:+918248963928" className={`font-black text-sm transition-colors ${isDark ? 'text-slate-100 hover:text-amber-300' : 'text-slate-950 hover:text-[#7c3aed]'}`}>
                      Dr. S. Umamaheswari (8248963928)
                    </a>
                  </div>
                </div>
              </div>

              {/* Instagram Card */}
              <div className={`p-5 flex items-center justify-between rounded-3xl border shadow-xl ${
                isDark ? 'bg-slate-900/90 border-pink-500/30 text-white' : 'bg-white border-pink-200 text-slate-950'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>Instagram Handle</h3>
                    <p className="text-xs font-bold text-pink-500">@infogram_26</p>
                  </div>
                </div>
                <a 
                  href="https://www.instagram.com/infogram_26/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 rounded-full bg-pink-500 text-white text-xs font-black uppercase tracking-wider hover:bg-pink-600 active:scale-95 transition-all shadow-md"
                >
                  Follow Us
                </a>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden ${
                isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
              }`}>
                <h3 className={`text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-950'}`}>Send a Message</h3>
                
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h4 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>Message Sent!</h4>
                    <p className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>We&apos;ll get back to you as soon as possible.</p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="mt-6 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-600 text-white hover:bg-purple-700 active:scale-95 transition-all shadow-md"
                    >
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Full Name</label>
                      <input 
                        type="text" 
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold transition-colors ${
                          isDark 
                            ? 'bg-slate-950 border-purple-500/30 text-white placeholder-slate-500 focus:border-amber-300' 
                            : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400 focus:border-[#7c3aed]'
                        }`}
                        placeholder="John Doe"
                        {...register("name")}
                      />
                      {errors.name && <p className="text-xs font-bold text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Email</label>
                        <input 
                          type="email" 
                          className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold transition-colors ${
                            isDark 
                              ? 'bg-slate-950 border-purple-500/30 text-white placeholder-slate-500 focus:border-amber-300' 
                              : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400 focus:border-[#7c3aed]'
                          }`}
                          placeholder="john@example.com"
                          {...register("email")}
                        />
                        {errors.email && <p className="text-xs font-bold text-red-500 mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Phone (Optional)</label>
                        <input 
                          type="tel" 
                          className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold transition-colors ${
                            isDark 
                              ? 'bg-slate-950 border-purple-500/30 text-white placeholder-slate-500 focus:border-amber-300' 
                              : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400 focus:border-[#7c3aed]'
                          }`}
                          placeholder="+91..."
                          {...register("phone")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Subject</label>
                      <select 
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold transition-colors ${
                          isDark 
                            ? 'bg-slate-950 border-purple-500/30 text-white focus:border-amber-300' 
                            : 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#7c3aed]'
                        }`} 
                        {...register("subject")}
                      >
                        <option value="">Select a subject...</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Event Query">Event Query</option>
                        <option value="Sponsorship">Sponsorship</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.subject && <p className="text-xs font-bold text-red-500 mt-1">{errors.subject.message}</p>}
                    </div>

                    <div>
                      <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Message</label>
                      <textarea 
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold min-h-[120px] resize-y transition-colors ${
                          isDark 
                            ? 'bg-slate-950 border-purple-500/30 text-white placeholder-slate-500 focus:border-amber-300' 
                            : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400 focus:border-[#7c3aed]'
                        }`} 
                        placeholder="How can we help you?"
                        {...register("message")}
                      />
                      {errors.message && <p className="text-xs font-bold text-red-500 mt-1">{errors.message.message}</p>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full py-3.5 rounded-full font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                        isDark
                          ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white hover:opacity-90'
                          : 'bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#059669] text-white hover:opacity-90'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-2 rounded-3xl overflow-hidden border shadow-xl ${
              isDark ? 'bg-slate-900/90 border-purple-500/30' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-full h-[400px] rounded-2xl overflow-hidden relative">
              <iframe
                title="College Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d79.6!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3OcKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
