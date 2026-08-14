'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase/config';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PublicLayout from '@/components/layout/PublicLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { CheckCircle, Upload, AlertCircle, Copy, ShieldCheck, QrCode } from 'lucide-react';
import { toast } from 'sonner';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00d4ff]/60 transition-all duration-200';
const labelClass = 'block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2';

declare global {
  interface Window {
    Razorpay: any;
  }
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

  // Razorpay is the primary payment method. If it fails to load, errors
  // creating the order, or the user backs out of checkout, we fall back
  // to the UPI QR + UTR verification flow instead of leaving them stuck.
  // Razorpay temporarily disabled — UPI QR + UTR is the active payment method.
  // Flip razorpayAvailable back to true once Razorpay keys are configured.
  const [razorpayAvailable, setRazorpayAvailable] = useState(false);
  const [showQrFallback, setShowQrFallback] = useState(true);
  const [isPayingWithRazorpay, setIsPayingWithRazorpay] = useState(false);

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
          setSettings({ upiId: 'infogram26@upi', merchantName: 'INFOGRAM 26' });
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
    const upiId = settings?.upiId || 'infogram26@upi';
    navigator.clipboard.writeText(upiId).then(() => toast.success('UPI ID copied!'));
  };

  // Shared success path for BOTH Razorpay and UPI/QR payments: records the
  // payment, marks the registration paid, generates the ticket, syncs to
  // Sheets, then redirects. `newId` is captured in a local variable (not
  // read back from state) so the redirect always targets the real ticket.
  const finalizePayment = useCallback(async (paymentDetails: {
    method: 'razorpay' | 'upi';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    utrNumber?: string;
    proofUrl?: string;
  }) => {
    if (!registration) return;

    if (registration.id === 'mock_reg_123' || !db || !storage) {
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
      console.warn('Google Sheets save failed (non-critical):', sheetErr);
    }

    const newTicketId = newTicketRef.id;
    setPaymentDone(true);
    toast.success('Payment confirmed! Generating your ticket...');
    setTimeout(() => router.push(`/ticket/${newTicketId}`), 2000);
  }, [registration, router]);

  const handleRazorpayPayment = async () => {
    if (!registration) return;
    setIsPayingWithRazorpay(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay checkout script failed to load');
      }

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

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: settings?.merchantName || 'INFOGRAM 26',
        description: `Registration fee — ${registration.applicantId}`,
        prefill: {
          name: registration.personalInfo?.fullName,
          email: registration.personalInfo?.email,
          contact: registration.personalInfo?.phone,
        },
        theme: { color: '#00d4ff' },
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
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error('Payment verification failed');
            }
            await finalizePayment({
              method: 'razorpay',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          } catch (err) {
            console.error('Razorpay verification failed:', err);
            toast.error('Could not verify your Razorpay payment. Please pay via UPI QR instead.');
            setShowQrFallback(true);
          } finally {
            setIsPayingWithRazorpay(false);
          }
        },
        modal: {
          ondismiss: () => {
            // User closed the checkout without paying — let them retry
            // Razorpay or use the QR fallback, don't force either.
            setIsPayingWithRazorpay(false);
          },
        },
      });

      razorpay.on('payment.failed', () => {
        toast.error('Razorpay payment failed. You can retry, or pay via UPI QR below.');
        setShowQrFallback(true);
        setIsPayingWithRazorpay(false);
      });

      razorpay.open();
    } catch (err) {
      console.error('Razorpay unavailable, falling back to UPI QR:', err);
      setRazorpayAvailable(false);
      setShowQrFallback(true);
      setIsPayingWithRazorpay(false);
      toast.error('Razorpay is unavailable right now. Please pay via UPI QR below.');
    }
  };

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 12) {
      toast.error('Please enter a valid 12-digit UTR number');
      return;
    }
    if (!registration) return;

    setIsSubmitting(true);
    try {
      await finalizePayment({ method: 'upi', utrNumber: utrNumber.trim() });
    } catch (err) {
      console.error('Payment submission failed:', err);
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
            <h1 className="text-3xl sm:text-4xl font-black gradient-text-animated uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              INFOGRAM&apos;26
            </h1>
            <p className="text-white/50 text-sm mt-2" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
              PAYMENT & TICKET GENERATION
            </p>
          </div>

          {paymentDone ? (
            <div className="glass-card p-10 text-center rounded-2xl max-w-lg mx-auto">
              <div className="w-20 h-20 bg-green-400/15 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Payment Confirmed!</h2>
              <p className="text-white/60 mb-6">Your QR ticket is being generated. Redirecting...</p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-start">
              {/* Order Summary */}
              <div className="lg:col-span-2 space-y-4">
                <div className="glass-card p-6 rounded-2xl">
                  <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                    <span className="text-[#00d4ff]">📋</span> Order Summary
                  </h2>

                  <div className="space-y-4">
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
                            <span className="text-[#00d4ff] text-xs">✓</span> {ev}
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

              {/* Payment Methods */}
              <div className="lg:col-span-3 space-y-4">
                {/* Razorpay — primary */}
                {razorpayAvailable && (
                  <div className="glass-card p-6 rounded-2xl space-y-4">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                      <ShieldCheck className="text-[#00d4ff] w-5 h-5" /> Pay Securely with Razorpay
                    </h2>
                    <p className="text-white/60 text-sm">
                      Cards, UPI, netbanking &amp; wallets — instantly verified, ticket generated right after payment.
                    </p>
                    <button
                      type="button"
                      onClick={handleRazorpayPayment}
                      disabled={isPayingWithRazorpay}
                      className="w-full btn-primary py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isPayingWithRazorpay ? (
                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Opening Razorpay...</>
                      ) : (
                        <><ShieldCheck className="w-5 h-5" /> Pay ₹{registration?.totalFee} with Razorpay</>
                      )}
                    </button>
                    {!showQrFallback && (
                      <button
                        type="button"
                        onClick={() => setShowQrFallback(true)}
                        className="w-full text-center text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
                      >
                        Trouble with Razorpay? Pay via UPI QR instead
                      </button>
                    )}
                  </div>
                )}

                {/* Balances column height + sets expectations while Razorpay is the only visible method */}
                {razorpayAvailable && !showQrFallback && (
                  <div className="glass-card p-6 rounded-2xl space-y-3">
                    <h3 className="text-white/80 font-bold text-sm uppercase tracking-wider">What happens next</h3>
                    <ul className="space-y-2.5 text-sm text-white/60">
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#00d4ff] mt-0.5">1.</span>
                        <span>Razorpay opens in a secure popup — pay with card, UPI, netbanking, or wallet.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#00d4ff] mt-0.5">2.</span>
                        <span>Payment is verified automatically the moment it completes.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#00d4ff] mt-0.5">3.</span>
                        <span>Your QR ticket is generated instantly — no manual review needed.</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* UPI QR + UTR — fallback */}
                {(showQrFallback || !razorpayAvailable) && (
                  <form onSubmit={handleUtrSubmit} className="glass-card p-6 rounded-2xl space-y-6">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                      <QrCode className="text-[#00d4ff] w-5 h-5" /> Pay via UPI QR
                    </h2>
                    {!razorpayAvailable && (
                      <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
                        <AlertCircle className="text-amber-400 w-4 h-4 flex-shrink-0" />
                        <p className="text-white/70 text-sm">Razorpay is currently unavailable. Please use UPI instead.</p>
                      </div>
                    )}

                    {/* UPI QR */}
                    <div className="bg-white/4 rounded-2xl p-6 text-center border border-white/8">
                      <p className="text-white/60 text-sm mb-4">Scan QR code or use UPI ID below</p>
                      <div className="bg-white p-3 rounded-xl inline-block mb-4 shadow-lg">
                        {settings?.upiQrCodeUrl ? (
                          <img src={settings.upiQrCodeUrl} alt="UPI QR" className="w-44 h-44 object-cover" />
                        ) : (
                          <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-lg">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📱</div>
                              <p className="text-gray-500 text-xs">QR Code</p>
                              <p className="text-gray-500 text-xs">will appear here</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-white/6 rounded-xl p-3 flex items-center justify-between gap-3 border border-white/10">
                        <div className="text-left">
                          <p className="text-white/40 text-xs">UPI ID</p>
                          <p className="text-white font-mono font-semibold text-sm">{settings?.upiId || 'infogram26@upi'}</p>
                        </div>
                        <button type="button" onClick={copyUpiId}
                          className="text-[#00d4ff] p-2 rounded-lg hover:bg-[#00d4ff]/10 transition-colors flex-shrink-0">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-white/40 text-xs mt-3">Merchant: <span className="text-white/60 font-medium">{settings?.merchantName || 'INFOGRAM 26'}</span></p>
                    </div>

                    {/* Amount to pay reminder */}
                    <div className="flex items-center gap-3 bg-[#00d4ff]/8 border border-[#00d4ff]/20 rounded-xl px-4 py-3">
                      <AlertCircle className="text-[#00d4ff] w-4 h-4 flex-shrink-0" />
                      <p className="text-white/70 text-sm">
                        Pay exactly <strong className="text-[#ffd700]">₹{registration?.totalFee}</strong> via UPI, then fill the details below.
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

                     <button
                       type="submit"
                       disabled={isSubmitting || !utrNumber || utrNumber.length < 12}
                      className="w-full btn-primary py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Confirming Payment...</>
                      ) : (
                        <><CheckCircle className="w-5 h-5" /> Confirm Payment & Get Ticket</>
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
