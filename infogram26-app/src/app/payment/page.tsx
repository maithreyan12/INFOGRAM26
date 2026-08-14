'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase/config';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PublicLayout from '@/components/layout/PublicLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { CheckCircle, Upload, AlertCircle, Copy, ShieldCheck, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00d4ff]/60 transition-all duration-200';
const labelClass = 'block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2';

declare global {
  interface Window { Razorpay: any; }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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
  // Show UPI fallback if Razorpay fails or user prefers it
  const [showUpi, setShowUpi] = useState(false);
  // Tab: 'razorpay' | 'upi'
  const [activeTab, setActiveTab] = useState<'razorpay' | 'upi'>('razorpay');

  useEffect(() => {
    const fetchData = async () => {
      if (!regId) { router.push('/register'); return; }
      try {
        if (regId === 'mock_reg_123') {
          setRegistration({
            id: 'mock_reg_123',
            applicantId: 'APP123456',
            totalFee: 350,
            events: ['demo-1', 'demo-2'],
            eventNames: ['Code Clash', 'Web Warriors'],
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

  // ── Shared finalize: write ticket + redirect ────────────────
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

    // Save payment record
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

    // Update registration
    await updateDoc(doc(db, 'registrations', registration.id), {
      status: 'paid',
      paymentId: paymentRef.id,
      ...(paymentDetails.utrNumber ? { utrNumber: paymentDetails.utrNumber } : {}),
    });

    // Generate ticket
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

    // Sync to Google Sheets (non-critical)
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

  // ── Razorpay Standard Checkout ──────────────────────────────
  const handleRazorpayPayment = async () => {
    if (!registration) return;
    setIsPayingWithRazorpay(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Razorpay script failed to load');

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: registration.totalFee,
          receipt: `rcpt_${registration.id}`,
          registrationId: registration.id,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.id) {
        throw new Error(orderData.error || 'Could not create Razorpay order');
      }

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
            toast.error('Payment verification failed. Please use UPI or contact support.');
            setActiveTab('upi');
          } finally {
            setIsPayingWithRazorpay(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPayingWithRazorpay(false);
          },
        },
      });

      rzp.on('payment.failed', (resp: any) => {
        toast.error(`Payment failed: ${resp.error?.description || 'Unknown error'}. Try UPI instead.`);
        setActiveTab('upi');
        setIsPayingWithRazorpay(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error('Razorpay error:', err);
      toast.error(err.message || 'Razorpay unavailable. Please pay via UPI.');
      setActiveTab('upi');
      setIsPayingWithRazorpay(false);
    }
  };

  // ── UPI / UTR Submit ────────────────────────────────────────
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

  if (loading) return (
    <PublicLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#ffd700]/10 border border-[#ffd700]/25 rounded-full px-4 py-1.5 text-xs font-semibold text-[#ffd700] uppercase tracking-wider mb-4">
              💳 Complete Your Payment
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase" style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              INFOGRAM&apos;26
            </h1>
            <p className="text-white/50 text-sm mt-2 uppercase tracking-widest">Payment &amp; Ticket Generation</p>
          </div>

          {paymentDone ? (
            <div className="glass-card p-10 text-center rounded-2xl max-w-lg mx-auto">
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
                <div className="glass-card p-6 rounded-2xl">
                  <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                    <span className="text-purple-400">📋</span> Order Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-white/4 rounded-xl p-4 border border-white/8">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Applicant ID</p>
                      <p className="font-mono text-white font-semibold">{registration?.applicantId}</p>
                    </div>
                    <div className="bg-white/4 rounded-xl p-4 border border-white/8">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Name</p>
                      <p className="text-white font-semibold">{registration?.personalInfo?.fullName}</p>
                    </div>
                    <div className="bg-white/4 rounded-xl p-4 border border-white/8">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Events</p>
                      <ul className="space-y-1">
                        {(registration?.eventNames || registration?.events || []).map((ev: string, i: number) => (
                          <li key={i} className="text-white text-sm flex items-center gap-2">
                            <span className="text-purple-400 text-xs">✓</span> {ev}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-[#ffd700]/8 rounded-xl p-4 border border-[#ffd700]/20 flex justify-between items-center">
                      <span className="text-white/70 font-medium">Total Amount</span>
                      <span className="text-[#ffd700] font-black text-2xl">₹{registration?.totalFee}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Payment Methods ── */}
              <div className="lg:col-span-3">
                {/* Tab switcher */}
                <div className="flex rounded-2xl overflow-hidden border border-white/10 mb-5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('razorpay')}
                    className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                      activeTab === 'razorpay'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Razorpay
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upi')}
                    className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                      activeTab === 'upi'
                        ? 'bg-[#00d4ff]/20 text-[#00d4ff] border-l border-[#00d4ff]/30'
                        : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 border-l border-white/10'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> UPI / QR
                  </button>
                </div>

                {/* ── RAZORPAY TAB ── */}
                {activeTab === 'razorpay' && (
                  <div className="glass-card p-6 rounded-2xl space-y-5">
                    <div>
                      <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-1">
                        <ShieldCheck className="text-purple-400 w-5 h-5" /> Secure Online Payment
                      </h2>
                      <p className="text-white/50 text-sm">Pay instantly with Card, UPI, Net Banking or Wallets. Ticket generated immediately after payment.</p>
                    </div>

                    <div className="bg-white/4 rounded-xl p-4 border border-white/8 space-y-2">
                      {['💳 Debit / Credit Cards', '📱 UPI (GPay, PhonePe, Paytm)', '🏦 Net Banking', '👛 Wallets'].map(m => (
                        <div key={m} className="flex items-center gap-2 text-sm text-white/70">
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleRazorpayPayment}
                      disabled={isPayingWithRazorpay}
                      className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-gradient-to-r from-purple-600 to-violet-600 hover:brightness-110 text-white shadow-xl shadow-purple-900/40"
                    >
                      {isPayingWithRazorpay ? (
                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Opening Razorpay...</>
                      ) : (
                        <><ShieldCheck className="w-5 h-5" /> Pay ₹{registration?.totalFee} with Razorpay</>
                      )}
                    </button>

                    <p className="text-center text-white/30 text-xs">
                      Trouble with Razorpay?{' '}
                      <button type="button" onClick={() => setActiveTab('upi')} className="text-[#00d4ff] underline underline-offset-2 hover:text-[#00d4ff]/80 transition-colors">
                        Pay via UPI instead
                      </button>
                    </p>
                  </div>
                )}

                {/* ── UPI TAB ── */}
                {activeTab === 'upi' && (
                  <form onSubmit={handleUtrSubmit} className="glass-card p-6 rounded-2xl space-y-5">
                    <div>
                      <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-1">
                        <Smartphone className="text-[#00d4ff] w-5 h-5" /> Pay via UPI
                      </h2>
                      <p className="text-white/50 text-sm">Scan the QR code or copy the UPI ID, pay, then enter your UTR number below.</p>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white/4 rounded-2xl p-5 text-center border border-white/8">
                      <div className="bg-white p-3 rounded-xl inline-block mb-4 shadow-lg">
                        <img
                          src={
                            settings?.upiQrCodeUrl ||
                            `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                              `upi://pay?pa=${settings?.upiId || '9342706675@okbizaxis'}&pn=INFOGRAM26&am=${registration?.totalFee || 350}&cu=INR&tn=INFOGRAM26-${registration?.applicantId || ''}`
                            )}`
                          }
                          alt="UPI QR Code"
                          className="w-48 h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="bg-white/6 rounded-xl p-3 flex items-center justify-between gap-3 border border-white/10">
                        <div className="text-left">
                          <p className="text-white/40 text-xs">UPI ID</p>
                          <p className="text-white font-mono font-semibold text-sm">{settings?.upiId || '9342706675@okbizaxis'}</p>
                        </div>
                        <button type="button" onClick={copyUpiId} className="text-[#00d4ff] p-2 rounded-lg hover:bg-[#00d4ff]/10 transition-colors flex-shrink-0">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-white/40 text-xs mt-3">Merchant: <span className="text-white/60 font-medium">{settings?.merchantName || 'INFOGRAM 26 SYMPOSIUM'}</span></p>
                    </div>

                    {/* Amount reminder */}
                    <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
                      <AlertCircle className="text-amber-400 w-4 h-4 flex-shrink-0" />
                      <p className="text-white/70 text-sm">
                        Pay exactly <strong className="text-[#ffd700]">₹{registration?.totalFee}</strong> via UPI, then fill in the UTR number below.
                      </p>
                    </div>

                    {/* UTR Number */}
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
                      />
                      <p className="text-white/30 text-xs mt-1.5">Found in your UPI app under transaction details</p>
                    </div>

                    {/* Screenshot (optional) */}
                    <div>
                      <label className={labelClass}>Payment Screenshot <span className="normal-case font-normal text-white/30">(optional)</span></label>
                      <div
                        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
                          screenshot ? 'border-green-400/50 bg-green-400/5' : 'border-white/15 hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/5'
                        }`}
                        onClick={() => document.getElementById('screenshot-upload')?.click()}
                      >
                        <input type="file" id="screenshot-upload" className="hidden" accept="image/*"
                          onChange={e => e.target.files?.[0] && handleScreenshotChange(e.target.files[0])} />
                        {screenshotPreview ? (
                          <div className="space-y-2">
                            <img src={screenshotPreview} alt="Screenshot" className="max-h-36 mx-auto rounded-lg border border-white/10" />
                            <p className="text-green-400 text-xs font-semibold">{screenshot?.name}</p>
                            <p className="text-white/40 text-xs">Click to change</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-7 h-7 text-white/30" />
                            <p className="text-white/50 text-sm">Upload payment screenshot</p>
                            <p className="text-white/30 text-xs">PNG, JPG accepted</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !utrNumber || utrNumber.length < 12}
                      className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-gradient-to-r from-[#00d4ff] to-[#0ea5e9] text-slate-900 shadow-xl shadow-[#00d4ff]/20"
                    >
                      {isSubmitting ? (
                        <><div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> Confirming Payment...</>
                      ) : (
                        <><CheckCircle className="w-5 h-5" /> Confirm Payment &amp; Get Ticket</>
                      )}
                    </button>
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </PublicLayout>
    }>
      <PaymentContent />
    </Suspense>
  );
}
