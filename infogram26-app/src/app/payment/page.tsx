'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase/config';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PublicLayout from '@/components/layout/PublicLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  CheckCircle, Upload, AlertCircle, Copy, ShieldCheck,
  Smartphone, Monitor, QrCode, ArrowLeft, Zap,
} from 'lucide-react';
import { toast } from 'sonner';

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

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-400/60 transition-all duration-200';
const labelClass = 'block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2';

/* ─── UPI App config ─────────────────────────────────────── */
type UpiApp = {
  id: string;
  name: string;
  short: string;
  gradient: string;
  ring: string;
  buildLink: (pa: string, am: number, pn: string, tn: string) => string;
};

const UPI_APPS: UpiApp[] = [
  {
    id: 'phonepe',
    name: 'PhonePe',
    short: 'Pe',
    gradient: 'from-[#5f259f] to-[#7b3cc3]',
    ring: 'ring-purple-500/40',
    buildLink: (pa, am, pn, tn) =>
      `phonepe://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR&tn=${encodeURIComponent(tn)}`,
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    short: 'G',
    gradient: 'from-[#1a73e8] to-[#34a853]',
    ring: 'ring-blue-500/40',
    buildLink: (pa, am, pn, tn) =>
      `tez://upi/pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR&tn=${encodeURIComponent(tn)}`,
  },
  {
    id: 'paytm',
    name: 'Paytm',
    short: 'Pt',
    gradient: 'from-[#00baf2] to-[#007ec5]',
    ring: 'ring-sky-500/40',
    buildLink: (pa, am, pn) =>
      `paytmmp://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR`,
  },
  {
    id: 'bhim',
    name: 'BHIM',
    short: 'B',
    gradient: 'from-[#1a237e] to-[#1565c0]',
    ring: 'ring-indigo-500/40',
    buildLink: (pa, am, pn, tn) =>
      `bhim://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR&tn=${encodeURIComponent(tn)}`,
  },
  {
    id: 'supermoney',
    name: 'SuperMoney',
    short: 'SM',
    gradient: 'from-[#e65100] to-[#ff8f00]',
    ring: 'ring-orange-500/40',
    buildLink: (pa, am, pn, tn) =>
      `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR&tn=${encodeURIComponent(tn)}`,
  },
  {
    id: 'any',
    name: 'Any UPI App',
    short: '↗',
    gradient: 'from-[#374151] to-[#1f2937]',
    ring: 'ring-white/20',
    buildLink: (pa, am, pn, tn) =>
      `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR&tn=${encodeURIComponent(tn)}`,
  },
];

/* ─── Main component ─────────────────────────────────────── */
function PaymentContent() {
  const searchParams = useSearchParams();
  const regId = searchParams.get('regId');
  const router = useRouter();

  const [registration, setRegistration] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [isPayingWithRazorpay, setIsPayingWithRazorpay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUtrForm, setShowUtrForm] = useState(false);
  const [launchedApp, setLaunchedApp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  /* Device detection */
  useEffect(() => {
    const mobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    setIsMobile(mobile || window.innerWidth < 768);
  }, []);

  /* Fetch registration + settings */
  useEffect(() => {
    const fetchData = async () => {
      if (!regId) { router.push('/register'); return; }
      try {
        if (regId === 'mock_reg_123') {
          setRegistration({
            id: 'mock_reg_123', applicantId: 'APP123456', totalFee: 350,
            events: [], eventNames: ['Code Clash', 'Web Warriors'],
            personalInfo: { fullName: 'Test User', email: 'test@example.com', phone: '9876543210', college: 'Demo College', department: 'CSE', year: '2nd' },
          });
          setSettings({ upiId: '9342706675@okbizaxis', merchantName: 'INFOGRAM 26 SYMPOSIUM' });
          setLoading(false);
          return;
        }
        const regDoc = await getDoc(doc(db, 'registrations', regId));
        if (!regDoc.exists()) { router.push('/register'); return; }
        setRegistration({ id: regDoc.id, ...regDoc.data() });
        const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
        if (settingsDoc.exists()) setSettings(settingsDoc.data());
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [regId, router]);

  /* ── Finalize payment (write ticket + redirect) ── */
  const finalizePayment = useCallback(async (paymentDetails: {
    method: 'razorpay' | 'upi';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    utrNumber?: string;
    proofUrl?: string;
  }) => {
    if (!registration) return;

    if (registration.id === 'mock_reg_123' || !db) {
      setPaymentDone(true);
      toast.success('Payment confirmed! Generating your ticket...');
      setTimeout(() => router.push('/ticket/mock_ticket_123'), 2000);
      return;
    }

    const paymentRef = await addDoc(collection(db, 'payments'), {
      registrationId: registration.id,
      amount: registration.totalFee,
      method: paymentDetails.method,
      razorpayOrderId: paymentDetails.razorpayOrderId || null,
      razorpayPaymentId: paymentDetails.razorpayPaymentId || null,
      razorpaySignature: paymentDetails.razorpaySignature || null,
      utrNumber: paymentDetails.utrNumber || null,
      proofUrl: paymentDetails.proofUrl || null,
      status: 'success',
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'registrations', registration.id), {
      status: 'paid',
      paymentId: paymentRef.id,
      ...(paymentDetails.utrNumber ? { utrNumber: paymentDetails.utrNumber } : {}),
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
      paymentMethod: paymentDetails.method,
      utrNumber: paymentDetails.utrNumber || null,
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
          paymentMethod: paymentDetails.method,
          utrNumber: paymentDetails.utrNumber || '',
          status: 'paid',
        }),
      });
    } catch (sheetErr) {
      console.warn('Google Sheets sync failed (non-critical):', sheetErr);
    }

    setPaymentDone(true);
    toast.success('Payment confirmed! Generating your ticket...');
    setTimeout(() => router.push(`/ticket/${newTicketRef.id}`), 2000);
  }, [registration, router]);

  /* ── Razorpay checkout ── */
  const handleRazorpayPayment = async () => {
    if (!registration) return;
    setIsPayingWithRazorpay(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Razorpay script failed to load');

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: registration.totalFee, receipt: `rcpt_${registration.id}`, registrationId: registration.id }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.id) throw new Error(orderData.error || 'Could not create Razorpay order');

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: settings?.merchantName || 'INFOGRAM 26 SYMPOSIUM',
        description: `Registration — ${registration.applicantId}`,
        image: '/logo.png',
        prefill: {
          name: registration.personalInfo?.fullName,
          email: registration.personalInfo?.email,
          contact: registration.personalInfo?.phone,
        },
        theme: { color: '#7c3aed' },
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
              method: 'razorpay',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          } catch (err) {
            console.error('Verification failed:', err);
            toast.error('Payment verification failed. Please enter UTR number.');
            setShowUtrForm(true);
          } finally {
            setIsPayingWithRazorpay(false);
          }
        },
        modal: { ondismiss: () => setIsPayingWithRazorpay(false) },
      });
      rzp.on('payment.failed', (resp: any) => {
        toast.error(`Payment failed: ${resp.error?.description || 'Unknown error'}`);
        setIsPayingWithRazorpay(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay error:', err);
      toast.error(err.message || 'Razorpay unavailable. Please pay via UPI.');
      setIsPayingWithRazorpay(false);
    }
  };

  /* ── UPI App deep-link click ── */
  const handleUpiAppClick = (app: UpiApp) => {
    const upiId = settings?.upiId || '9342706675@okbizaxis';
    const amount = registration?.totalFee || 0;
    const pn = settings?.merchantName || 'INFOGRAM26';
    const tn = `INFOGRAM26-${registration?.applicantId || ''}`;
    const deepLink = app.buildLink(upiId, amount, pn, tn);

    setLaunchedApp(app.name);
    window.location.href = deepLink;

    // Countdown then show UTR form
    let c = 3;
    setCountdown(c);
    const t = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(t);
        setShowUtrForm(true);
        setCountdown(0);
      }
    }, 1000);
  };

  /* ── UTR submit ── */
  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 12) {
      toast.error('Please enter a valid 12-digit UTR number');
      return;
    }
    if (!registration) return;
    setIsSubmitting(true);
    try {
      let proofUrl = '';
      if (registration.id !== 'mock_reg_123' && db && storage && screenshot) {
        const storageRef = ref(storage, `payment-proofs/${registration.id}-${Date.now()}`);
        await uploadBytes(storageRef, screenshot);
        proofUrl = await getDownloadURL(storageRef);
      }
      await finalizePayment({ method: 'upi', utrNumber: utrNumber.trim(), proofUrl });
    } catch (err) {
      console.error('UPI submit failed:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScreenshotChange = (file: File) => {
    setScreenshot(file);
    const reader = new FileReader();
    reader.onloadend = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const copyUpiId = () => {
    const upiId = settings?.upiId || '9342706675@okbizaxis';
    navigator.clipboard.writeText(upiId).then(() => toast.success('UPI ID copied!'));
  };

  /* Build QR URL */
  const upiId = settings?.upiId || '9342706675@okbizaxis';
  const upiQrString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(settings?.merchantName || 'INFOGRAM26')}&am=${registration?.totalFee || ''}&cu=INR&tn=${encodeURIComponent(`INFOGRAM26-${registration?.applicantId || ''}`)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiQrString)}&bgcolor=ffffff&color=1a0030&qzone=2`;

  if (loading) return (
    <PublicLayout>
      <div className="flex justify-center items-center min-h-[60vh]" style={{ background: 'linear-gradient(135deg,#070913 0%,#1a0030 100%)', color: 'white' }}><LoadingSpinner size="lg" /></div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <div className="min-h-screen pt-28 pb-16 px-4" style={{ background: 'linear-gradient(135deg,#070913 0%,#130025 50%,#070913 100%)', color: 'white' }}>
        <div className="max-w-4xl mx-auto">

          {/* ── Header ── */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-4 py-1.5 text-xs font-semibold text-violet-300 uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" /> Complete Your Payment
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase"
              style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg,#fff 30%,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              INFOGRAM&apos;26
            </h1>
            <p className="text-white/40 text-sm mt-2 uppercase tracking-widest">Secure Payment &amp; Instant Ticket</p>
          </div>

          {/* ── Payment Done ── */}
          {paymentDone ? (
            <div className="glass-card p-10 text-center rounded-2xl max-w-lg mx-auto" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="w-20 h-20 bg-green-400/15 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Payment Confirmed!</h2>
              <p className="text-white/60 mb-6">Your QR ticket is being generated. Redirecting...</p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-start">

              {/* ── Order Summary ── */}
              <div className="lg:col-span-2 space-y-4">
                <div className="glass-card p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h2 className="text-white/60 font-bold text-xs mb-4 uppercase tracking-wider flex items-center gap-2">
                    📋 Order Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-white/4 rounded-xl p-3.5 border border-white/8">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Applicant ID</p>
                      <p className="font-mono text-white font-semibold text-sm">{registration?.applicantId}</p>
                    </div>
                    <div className="bg-white/4 rounded-xl p-3.5 border border-white/8">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Name</p>
                      <p className="text-white font-semibold text-sm">{registration?.personalInfo?.fullName}</p>
                    </div>
                    <div className="bg-white/4 rounded-xl p-3.5 border border-white/8">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Events</p>
                      <ul className="space-y-1.5">
                        {(registration?.eventNames || registration?.events || []).map((ev: string, i: number) => (
                          <li key={i} className="text-white text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                            {ev}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-[#ffd700]/10 to-violet-600/10 rounded-xl p-4 border border-[#ffd700]/20 flex justify-between items-center">
                      <span className="text-white/60 font-medium text-sm">Total Amount</span>
                      <span className="text-[#ffd700] font-black text-2xl">₹{registration?.totalFee}</span>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-4 rounded-2xl flex items-center gap-3" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <ShieldCheck className="w-7 h-7 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-semibold text-sm">100% Secure</p>
                    <p className="text-white/35 text-xs">Powered by Razorpay &amp; UPI</p>
                  </div>
                </div>
              </div>

              {/* ── Right: Payment Panel ── */}
              <div className="lg:col-span-3 space-y-4">

                {/* Device chip */}
                <div className="flex items-center gap-2 text-white/35 text-xs px-1">
                  {isMobile
                    ? <><Smartphone className="w-3.5 h-3.5 text-violet-400" /><span>Mobile detected — tap any UPI app to pay instantly</span></>
                    : <><Monitor className="w-3.5 h-3.5 text-[#00d4ff]" /><span>Desktop detected — scan QR or pay via Razorpay</span></>
                  }
                </div>

                {/* ══ MOBILE: UPI App Picker ══ */}
                {isMobile && !showUtrForm && (
                  <div className="glass-card rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* Amount banner */}
                    <div className="bg-gradient-to-r from-violet-600/30 to-purple-900/30 border-b border-white/8 p-5 text-center">
                      <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Amount to Pay</p>
                      <p className="text-[#ffd700] font-black text-5xl tracking-tight">₹{registration?.totalFee}</p>
                      <p className="text-white/30 text-xs mt-2">To: <span className="text-white/60 font-mono">{upiId}</span></p>
                    </div>

                    <div className="p-5 space-y-5">
                      <div>
                        <p className="text-white font-bold flex items-center gap-2 mb-0.5">
                          <Smartphone className="w-4 h-4 text-violet-400" /> Pay with UPI App
                        </p>
                        <p className="text-white/40 text-xs">Tap to open your preferred UPI app directly</p>
                      </div>

                      {/* App grid */}
                      <div className="grid grid-cols-3 gap-3">
                        {UPI_APPS.map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => handleUpiAppClick(app)}
                            className={`group flex flex-col items-center gap-2.5 p-4 rounded-2xl
                              bg-gradient-to-br ${app.gradient}
                              ring-1 ${app.ring}
                              hover:scale-105 active:scale-95
                              transition-all duration-200 shadow-lg`}
                          >
                            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-black text-base">
                              {app.short}
                            </div>
                            <span className="text-white text-[11px] font-semibold text-center leading-tight">{app.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Countdown */}
                      {countdown > 0 && (
                        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-center">
                          <p className="text-violet-300 text-sm">Opening {launchedApp}... <span className="font-bold">{countdown}s</span></p>
                          <p className="text-white/30 text-xs mt-1">UTR entry will appear after payment</p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowUtrForm(true)}
                        className="w-full py-3.5 rounded-xl border border-green-400/30 text-green-400 text-sm font-bold hover:bg-green-400/10 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> I&apos;ve Paid — Enter UTR Number
                      </button>

                      {/* Razorpay alt */}
                      <div className="border-t border-white/8 pt-4 space-y-2">
                        <p className="text-white/30 text-xs text-center">Or pay with Card / Net Banking</p>
                        <button
                          type="button"
                          onClick={handleRazorpayPayment}
                          disabled={isPayingWithRazorpay}
                          className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-all bg-gradient-to-r from-violet-600 to-purple-600 hover:brightness-110 text-white shadow-lg"
                        >
                          {isPayingWithRazorpay
                            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Opening Razorpay...</>
                            : <><ShieldCheck className="w-4 h-4" /> Pay ₹{registration?.totalFee} via Razorpay</>
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ DESKTOP: QR + Razorpay ══ */}
                {!isMobile && !showUtrForm && (
                  <div className="glass-card rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* Amount banner */}
                    <div className="bg-gradient-to-r from-violet-600/25 to-purple-900/25 border-b border-white/8 p-5 text-center">
                      <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Amount to Pay</p>
                      <p className="text-[#ffd700] font-black text-5xl tracking-tight">₹{registration?.totalFee}</p>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* QR Section */}
                      <div>
                        <p className="text-white font-bold flex items-center gap-2 mb-1">
                          <QrCode className="w-4 h-4 text-[#00d4ff]" /> Scan &amp; Pay via UPI
                        </p>
                        <p className="text-white/40 text-xs mb-4">Scan with PhonePe, GPay, Paytm, BHIM or any UPI app</p>

                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                          {/* QR code */}
                          <div className="flex-shrink-0">
                            <div className="p-3 bg-white rounded-2xl shadow-2xl shadow-violet-900/50 border-4 border-violet-500/20 inline-block">
                              <img
                                src={settings?.upiQrCodeUrl || qrUrl}
                                alt="UPI QR Code"
                                className="w-52 h-52 object-cover rounded-lg"
                              />
                            </div>
                            <p className="text-white/30 text-xs text-center mt-2">Scan to pay ₹{registration?.totalFee}</p>
                          </div>

                          {/* UPI details */}
                          <div className="flex-1 space-y-3 w-full">
                            <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-white/35 text-xs mb-0.5">UPI ID</p>
                                <p className="text-white font-mono font-semibold text-sm">{upiId}</p>
                              </div>
                              <button type="button" onClick={copyUpiId} className="text-[#00d4ff] p-2 rounded-lg hover:bg-[#00d4ff]/10 transition-colors flex-shrink-0">
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
                              <AlertCircle className="text-amber-400 w-4 h-4 flex-shrink-0 mt-0.5" />
                              <p className="text-white/60 text-xs">
                                Pay exactly <strong className="text-[#ffd700]">₹{registration?.totalFee}</strong> — wrong amount delays your ticket
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              {['Open any UPI app on your phone', 'Scan the QR code or enter UPI ID', `Confirm ₹${registration?.totalFee} payment`, 'Note your UTR / transaction number'].map((step, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-xs text-white/50">
                                  <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                                  {step}
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => setShowUtrForm(true)}
                              className="w-full py-3.5 rounded-xl bg-green-400/10 border border-green-400/30 text-green-400 text-sm font-bold hover:bg-green-400/20 transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" /> I&apos;ve Paid — Enter UTR Number
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Razorpay */}
                      <div className="border-t border-white/8 pt-5">
                        <p className="text-white/30 text-xs text-center mb-4">Or pay instantly with Card / Net Banking / Wallet</p>
                        <button
                          type="button"
                          onClick={handleRazorpayPayment}
                          disabled={isPayingWithRazorpay}
                          className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-gradient-to-r from-violet-600 to-purple-600 hover:brightness-110 text-white shadow-xl shadow-purple-900/40"
                        >
                          {isPayingWithRazorpay
                            ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Opening Razorpay...</>
                            : <><ShieldCheck className="w-5 h-5" /> Pay ₹{registration?.totalFee} — Cards / Net Banking / Wallet</>
                          }
                        </button>
                        <p className="text-center text-white/20 text-xs mt-3">256-bit SSL encrypted · PCI DSS compliant</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ UTR Confirmation Form ══ */}
                {showUtrForm && (
                  <form onSubmit={handleUtrSubmit} className="glass-card rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="bg-gradient-to-r from-green-500/15 to-emerald-600/15 border-b border-green-500/15 p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-bold">Confirm Your Payment</p>
                          <p className="text-white/40 text-xs">
                            {launchedApp ? `Opened ${launchedApp} — ` : ''}Enter the UTR from your UPI app to get your ticket
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      <div>
                        <label className={labelClass}>UTR / Transaction Reference Number *</label>
                        <input
                          type="text"
                          required
                          value={utrNumber}
                          onChange={e => setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                          className={inputClass}
                          placeholder="Enter 12-digit UTR number"
                          maxLength={12}
                          autoFocus
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-white/30 text-xs">Found in your UPI app under transaction details</p>
                          <p className={`text-xs font-mono ${utrNumber.length === 12 ? 'text-green-400' : 'text-white/30'}`}>
                            {utrNumber.length}/12
                          </p>
                        </div>
                      </div>

                      {/* Screenshot */}
                      <div>
                        <label className={labelClass}>Payment Screenshot <span className="normal-case font-normal text-white/25">(optional)</span></label>
                        <div
                          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${screenshot ? 'border-green-400/50 bg-green-400/5' : 'border-white/12 hover:border-violet-400/40 hover:bg-violet-400/5'}`}
                          onClick={() => document.getElementById('screenshot-upload')?.click()}
                        >
                          <input type="file" id="screenshot-upload" className="hidden" accept="image/*"
                            onChange={e => e.target.files?.[0] && handleScreenshotChange(e.target.files[0])} />
                          {screenshotPreview ? (
                            <div className="space-y-2">
                              <img src={screenshotPreview} alt="Screenshot" className="max-h-36 mx-auto rounded-lg border border-white/10" />
                              <p className="text-green-400 text-xs font-semibold">{screenshot?.name}</p>
                              <p className="text-white/30 text-xs">Click to change</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="w-7 h-7 text-white/25" />
                              <p className="text-white/40 text-sm">Upload payment screenshot</p>
                              <p className="text-white/25 text-xs">PNG, JPG accepted</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !utrNumber || utrNumber.length < 12}
                        className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-gradient-to-r from-green-500 to-emerald-500 hover:brightness-110 text-white shadow-xl shadow-green-900/30"
                      >
                        {isSubmitting
                          ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Confirming Payment...</>
                          : <><CheckCircle className="w-5 h-5" /> Confirm Payment &amp; Get Ticket</>
                        }
                      </button>

                      <button
                        type="button"
                        onClick={() => { setShowUtrForm(false); setLaunchedApp(null); }}
                        className="w-full text-center text-white/30 text-sm hover:text-white/55 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to payment options
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>
      </PublicLayout>
    }>
      <PaymentContent />
    </Suspense>
  );
}
