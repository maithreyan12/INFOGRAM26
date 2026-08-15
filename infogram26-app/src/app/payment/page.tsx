'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import PublicLayout from '@/components/layout/PublicLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  CheckCircle, ShieldCheck, Zap, CreditCard, Lock, Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

/* ─── types ─────────────────────────────────────────────── */
declare global { interface Window { Razorpay: any; } }

/* ─── helpers ───────────────────────────────────────────── */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/* ─── Main component ─────────────────────────────────────── */
function PaymentContent() {
  const searchParams = useSearchParams();
  const regId = searchParams.get('regId');
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [registration, setRegistration] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPayingWithRazorpay, setIsPayingWithRazorpay] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  /* Fetch registration + settings */
  useEffect(() => {
    const fetchData = async () => {
      if (!regId) { router.push('/register'); return; }

      const urlFee = Number(searchParams.get('fee')) || 0;
      const urlEvents = searchParams.get('events') ? searchParams.get('events')!.split(',') : [];
      const urlName = searchParams.get('name') || '';
      const urlEmail = searchParams.get('email') || '';
      const urlPhone = searchParams.get('phone') || '';
      const urlCollege = searchParams.get('college') || '';
      const urlDept = searchParams.get('department') || '';
      const urlYear = searchParams.get('year') || '';

      try {
        if (!db) {
          setRegistration({
            id: regId,
            applicantId: `INFO26-EVT-${Math.floor(10000 + Math.random() * 90000)}`,
            totalFee: urlFee || 50,
            events: [],
            eventNames: urlEvents.length > 0 ? urlEvents : ['Symposium Event'],
            personalInfo: { fullName: urlName, email: urlEmail, phone: urlPhone, college: urlCollege, department: urlDept, year: urlYear },
          });
          setSettings({ merchantName: 'INFOGRAM 26 SYMPOSIUM' });
          setLoading(false);
          return;
        }
        const regDoc = await getDoc(doc(db, 'registrations', regId));
        if (regDoc.exists()) {
          const data = regDoc.data();
          setRegistration({
            id: regDoc.id,
            ...data,
            totalFee: data.totalFee || urlFee || 50,
            eventNames: data.eventNames || (urlEvents.length > 0 ? urlEvents : data.events),
          });
        } else {
          setRegistration({
            id: regId,
            applicantId: `INFO26-EVT-${Math.floor(10000 + Math.random() * 90000)}`,
            totalFee: urlFee || 50,
            eventNames: urlEvents.length > 0 ? urlEvents : ['Event Registration'],
            personalInfo: { fullName: urlName, email: urlEmail, phone: urlPhone, college: urlCollege, department: urlDept, year: urlYear },
          });
        }
        const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
        if (settingsDoc.exists()) setSettings(settingsDoc.data());
      } catch (err) {
        console.error('Error fetching data:', err);
        setRegistration({
          id: regId,
          applicantId: `INFO26-EVT-${Math.floor(10000 + Math.random() * 90000)}`,
          totalFee: urlFee || 50,
          eventNames: urlEvents.length > 0 ? urlEvents : ['Event Registration'],
          personalInfo: { fullName: urlName, email: urlEmail, phone: urlPhone, college: urlCollege, department: urlDept, year: urlYear },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [regId, router, searchParams]);

  /* ── Finalize payment (write ticket + redirect) ── */
  const finalizePayment = useCallback(async (paymentDetails: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    if (!registration) return;

    if (!db) {
      setPaymentDone(true);
      toast.success('Payment confirmed! Redirecting to ticket lookup...');
      setTimeout(() => router.push('/my-ticket'), 2000);
      return;
    }

    const paymentRef = await addDoc(collection(db, 'payments'), {
      registrationId: registration.id,
      amount: registration.totalFee,
      method: 'razorpay',
      razorpayOrderId: paymentDetails.razorpayOrderId,
      razorpayPaymentId: paymentDetails.razorpayPaymentId,
      razorpaySignature: paymentDetails.razorpaySignature,
      status: 'success',
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'registrations', registration.id), {
      status: 'paid',
      paymentId: paymentRef.id,
    });

    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const qrData = JSON.stringify({
      ticketNumber,
      applicantId: registration.applicantId,
      name: registration.personalInfo?.fullName,
      events: registration.eventNames || registration.events,
      verified: true,
    });

    const newTicketRef = await addDoc(collection(db, 'tickets'), {
      ticketNumber,
      applicantId: registration.applicantId,
      registrationId: registration.id,
      studentName: registration.personalInfo?.fullName,
      email: registration.personalInfo?.email,
      phone: registration.personalInfo?.phone,
      college: registration.personalInfo?.college,
      department: registration.personalInfo?.department,
      year: registration.personalInfo?.year,
      events: registration.eventNames || registration.events,
      totalAmount: registration.totalFee,
      paymentMethod: 'razorpay',
      razorpayPaymentId: paymentDetails.razorpayPaymentId,
      qrData,
      status: 'valid',
      issueDate: serverTimestamp(),
    });

    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId: registration.applicantId,
          ticketNumber,
          name: registration.personalInfo?.fullName,
          email: registration.personalInfo?.email,
          phone: registration.personalInfo?.phone,
          college: registration.personalInfo?.college,
          department: registration.personalInfo?.department,
          year: registration.personalInfo?.year,
          events: (registration.eventNames || registration.events || []).join(', '),
          amount: registration.totalFee,
          paymentMethod: 'razorpay',
          razorpayPaymentId: paymentDetails.razorpayPaymentId,
          status: 'paid',
        }),
      });
    } catch (sheetErr) {
      console.warn('Google Sheets sync failed (non-critical):', sheetErr);
    }

    setPaymentDone(true);
    setTicketId(newTicketRef.id);
    toast.success('Payment confirmed! Generating your ticket...');
    setTimeout(() => router.push(`/ticket/${newTicketRef.id}`), 2500);
  }, [registration, router]);

  /* Preload Razorpay script on page mount for instant mobile response */
  useEffect(() => {
    loadRazorpayScript().catch((err) => console.warn('Razorpay script preload warning:', err));
  }, []);

  /* ── Auto-trigger Razorpay modal if coming from registration form ── */
  useEffect(() => {
    const autoParam = searchParams.get('auto');
    if (autoParam === 'true' && registration && !loading && !paymentDone && !isPayingWithRazorpay) {
      const timer = setTimeout(() => {
        handleRazorpayPayment();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [searchParams, registration, loading, paymentDone]);

  /* ── Razorpay checkout ── */
  const handleRazorpayPayment = async () => {
    if (!registration) return;
    setIsPayingWithRazorpay(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Razorpay script failed to load. Please check your internet connection.');

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: registration.totalFee,
            receipt: `rcpt_${registration.id}`,
            registrationId: registration.id,
            applicantId: registration.applicantId,
            name: registration.personalInfo?.fullName,
            email: registration.personalInfo?.email,
            phone: registration.personalInfo?.phone,
            college: registration.personalInfo?.college,
            department: registration.personalInfo?.department,
            year: registration.personalInfo?.year,
            events: registration.eventNames || registration.events,
          }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.id) throw new Error(orderData.error || 'Could not create Razorpay order');

      const razorpayKey = orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TPacWV4BbmByiW';

      const options: any = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: settings?.merchantName || 'INFOGRAM 26 SYMPOSIUM',
        description: `Registration — ${registration.applicantId}`,
        image: '/logo.png',
        prefill: {
          name: registration.personalInfo?.fullName || '',
          email: registration.personalInfo?.email || '',
          contact: registration.personalInfo?.phone ? String(registration.personalInfo.phone).replace(/\D/g, '').slice(-10) : '',
        },
        theme: { color: '#7c3aed' },
        modal: {
          ondismiss: () => setIsPayingWithRazorpay(false),
          backdropclose: false,
          escape: true,
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registrationId: registration.id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) throw new Error('Signature verification failed');
            await finalizePayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          } catch (err) {
            console.error('Verification failed:', err);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setIsPayingWithRazorpay(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        toast.error(`Payment failed: ${resp.error?.description || 'Transaction cancelled or failed'}`);
        setIsPayingWithRazorpay(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay error:', err);
      toast.error(err.message || 'Payment failed. Please try again.');
      setIsPayingWithRazorpay(false);
    }
  };

  if (loading) return (
    <PublicLayout>
      <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>
    </PublicLayout>
  );

  /* ─── Glass styles ─── */
  const glassBg = isDark
    ? 'bg-white/[0.03] border-white/[0.08]'
    : 'bg-white/60 border-white/30';
  const glassCard = isDark
    ? 'bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
    : 'bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-slate-500';
  const textMuted = isDark ? 'text-white/30' : 'text-slate-400';

  return (
    <PublicLayout>
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* ── Header ── */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider mb-4 border ${
              isDark ? 'bg-violet-500/10 border-violet-500/25 text-violet-300' : 'bg-[#7c3aed]/10 border-[#7c3aed]/25 text-[#7c3aed]'
            }`}>
              <Zap className="w-3.5 h-3.5" /> Complete Your Payment
            </div>
            <h1 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${textPrimary}`}
              style={{ fontFamily: 'var(--font-display)' }}>
              INFOGRAM&apos;26
            </h1>
            <p className={`text-sm mt-2 uppercase tracking-widest ${textMuted}`}>Secure Payment &amp; Instant Ticket</p>
          </div>

          {/* ── Payment Done ── */}
          {paymentDone ? (
            <div className={`${glassCard} rounded-3xl p-10 text-center max-w-lg mx-auto`}>
              {/* Success animation ring */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-500/20 animate-ping" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-400/15 to-green-500/15 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
              </div>
              <h2 className={`text-2xl font-black mb-2 ${textPrimary}`}>Payment Successful!</h2>
              <p className={`text-sm mb-6 ${textSecondary}`}>Your ticket is being generated...</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : (
            <div className="space-y-5">

              {/* ── Order Summary Card ── */}
              <div className={`${glassCard} rounded-3xl overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-white/[0.06]' : 'border-slate-200/60'}`}>
                  <h2 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${textSecondary}`}>
                    📋 Order Summary
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Applicant Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Applicant ID</p>
                      <p className={`text-sm font-black mt-0.5 ${textPrimary}`}>{registration?.applicantId}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Name</p>
                      <p className={`text-sm font-black mt-0.5 ${textPrimary}`}>{registration?.personalInfo?.fullName}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-200/60'}`} />

                  {/* Events */}
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Events</p>
                    <div className="space-y-2">
                      {(registration?.eventNames || registration?.events || []).map((name: string, i: number) => (
                        <div key={i} className={`flex justify-between items-center py-2 px-3 rounded-xl ${
                          isDark ? 'bg-white/[0.03]' : 'bg-slate-50/80'
                        }`}>
                          <span className={`text-sm font-bold ${textPrimary}`}>
                            <span className="text-violet-400 mr-2">•</span>{name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-200/60'}`} />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-black uppercase tracking-wider ${textSecondary}`}>Total Amount</span>
                    <span className="text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      ₹{registration?.totalFee}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Pay Button ── */}
              <button
                onClick={handleRazorpayPayment}
                disabled={isPayingWithRazorpay}
                className="group relative w-full overflow-hidden rounded-2xl text-white font-black text-base py-4 px-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(124,58,237,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)', animation: 'shimmer 2s infinite' }} />

                <div className="relative flex items-center justify-center gap-3">
                  {isPayingWithRazorpay ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Opening Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay ₹{registration?.totalFee} — Secure Checkout</span>
                      <Sparkles className="w-4 h-4 opacity-60" />
                    </>
                  )}
                </div>
              </button>

              {/* ── Mobile Fallback Direct Link ── */}
              <div className="text-center pt-1">
                <a
                  href="https://razorpay.me/@infogram26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all hover:underline ${
                    isDark ? 'text-violet-300 hover:text-violet-200' : 'text-[#7c3aed] hover:text-purple-800'
                  }`}
                >
                  <span>Having trouble on mobile? Pay directly via Razorpay Page</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>

              {/* ── Trust Badges ── */}
              <div className={`${glassCard} rounded-2xl p-4`}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className={`text-xs font-bold ${textSecondary}`}>100% Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-violet-400" />
                    <span className={`text-xs font-bold ${textSecondary}`}>256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span className={`text-xs font-bold ${textSecondary}`}>Cards • UPI • Net Banking</span>
                  </div>
                </div>
              </div>

              {/* ── Razorpay branding ── */}
              <p className={`text-center text-[10px] font-semibold ${textMuted}`}>
                Powered by Razorpay • PCI DSS Compliant
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </PublicLayout>
  );
}

/* ─── page wrapper ── */
export default function PaymentPage() {
  return (
    <Suspense fallback={<PublicLayout><div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner size="lg" /></div></PublicLayout>}>
      <PaymentContent />
    </Suspense>
  );
}
