'use client';
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, Building, Send, CheckCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/shared/PageHero';

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      if (!db) {
        alert("Firebase is not configured. Message received in offline/mock mode.");
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
      <PageHero 
        title="Contact Us" 
        subtitle="We'd love to hear from you"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]}
      />

      <div className="section-padding container-xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          
          {/* Left Column - Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-4 gradient-text">Get In Touch</h2>
              <p className="text-slate-300 text-lg">
                Have questions about INFOGRAM'26? Reach out to our organizing team.
              </p>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6 flex items-start gap-4 rounded-2xl border border-white/10 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Building className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">College Address</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Department of Information Technology, Info Club<br />
                    C. Abdul Hakeem College of Engineering & Technology<br />
                    Hakeem Nagar, Melvisharam - 632 509<br />
                    Ranipet District, Tamil Nadu
                  </p>
                </div>
              </div>

              <div className="glass-card p-6 flex items-center gap-4 rounded-2xl border border-white/10 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email Us</h3>
                  <a href="mailto:info@cahcet.edu.in" className="text-slate-300 hover:text-primary-400 transition-colors">info@cahcet.edu.in</a>
                </div>
              </div>

              <div className="glass-card p-6 flex items-center gap-4 rounded-2xl border border-white/10 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Call Us</h3>
                  <a href="tel:+914172267387" className="text-slate-300 hover:text-primary-400 transition-colors">+91 4172 267387</a>
                </div>
              </div>

              <div className="glass-card p-6 flex items-center gap-4 rounded-2xl border border-pink-500/20 hover:border-pink-500/40 bg-pink-500/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Follow Us on Instagram</h3>
                  <a 
                    href="https://www.instagram.com/infogram_2k26?utm_source=qr&igsh=N2JqNW5zOWF0cHIw" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-pink-400 hover:text-pink-300 font-semibold transition-colors text-sm"
                  >
                    @infogram_2k26 &rarr;
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-2xl font-semibold text-white mb-6">Send a Message</h3>
              
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Message Sent!</h4>
                  <p className="text-slate-300">We'll get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 btn-glass px-6 py-2 rounded-full text-sm"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="John Doe"
                      {...register("name")}
                    />
                    {errors.name && <p className="form-error">{errors.name.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="john@example.com"
                        {...register("email")}
                      />
                      {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="form-label">Phone (Optional)</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        placeholder="+91..."
                        {...register("phone")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Subject</label>
                    <select className="form-input bg-[#0B0F19]" {...register("subject")}>
                      <option value="">Select a subject...</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Event Query">Event Query</option>
                      <option value="Sponsorship">Sponsorship</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && <p className="form-error">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="form-label">Message</label>
                    <textarea 
                      className="form-input min-h-[120px] resize-y" 
                      placeholder="How can we help you?"
                      {...register("message")}
                    />
                    {errors.message && <p className="form-error">{errors.message.message}</p>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2 group"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
          className="glass-card p-2 rounded-3xl overflow-hidden border border-white/10"
        >
          <div className="w-full h-[400px] bg-slate-900 rounded-2xl overflow-hidden relative">
            <iframe
              title="College Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d79.6!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3OcKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) opacity(0.8)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs text-white/70">
              Note: Map embed URL can be configured by admin.
            </div>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  );
}
