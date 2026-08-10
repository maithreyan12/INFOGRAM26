'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase/config';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PublicLayout from '@/components/layout/PublicLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { CheckCircle, Upload, AlertCircle, Copy, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00d4ff]/60 transition-all duration-200';
const labelClass = 'block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2';

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
  const [ticketId, setTicketId] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 12) {
      toast.error('Please enter a valid 12-digit UTR number');
      return;
    }
    if (!screenshot) {
      toast.error('Please upload a payment screenshot');
      return;
    }
    if (!registration) return;

    setIsSubmitting(true);
    try {
      let proofUrl = '';
      let paymentRef: any = null;

      if (registration.id !== 'mock_reg_123' && db && storage) {
        // Upload screenshot
        const storageRef = ref(storage, `payment-proofs/${registration.id}-${Date.now()}`);
        await uploadBytes(storageRef, screenshot);
        proofUrl = await getDownloadURL(storageRef);

        // Save payment record
        paymentRef = await addDoc(collection(db, 'payments'), {
          registrationId: registration.id,
          amount: registration.totalFee,
          method: 'upi',
          utrNumber: utrNumber.trim(),
          proofUrl,
          status: 'success',
          createdAt: serverTimestamp(),
        });

        // Update registration status
        await updateDoc(doc(db, 'registrations', registration.id), {
          status: 'paid',
          paymentId: paymentRef.id,
          utrNumber: utrNumber.trim(),
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
          utrNumber: utrNumber.trim(),
          qrData,
          status: 'valid',
          issueDate: serverTimestamp(),
        });

        // Save to Google Sheets
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
              utrNumber: utrNumber.trim(),
              status: 'paid',
            }),
          });
        } catch (sheetErr) {
          console.warn('Google Sheets save failed (non-critical):', sheetErr);
        }

        setTicketId(newTicketRef.id);
      } else {
        // Mock mode
        setTicketId('mock_ticket_123');
      }

      setPaymentDone(true);
      toast.success('Payment confirmed! Generating your ticket...');

      setTimeout(() => {
        router.push(`/ticket/${ticketId || 'mock_ticket_123'}`);
      }, 2000);
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
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
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

              {/* Payment Form */}
              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-6">
                  <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <Smartphone className="text-[#00d4ff] w-5 h-5" /> Pay via UPI
                  </h2>

                  {/* UPI QR */}
                  <div className="bg-white/4 rounded-2xl p-6 text-center border border-white/8">
                    <p className="text-white/60 text-sm mb-4">Scan QR code or use UPI ID below</p>
                    <div className="bg-white p-3 rounded-xl inline-block mb-4 shadow-lg border-2 border-[#00d4ff]/40">
                      <img 
                        src={settings?.upiQrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${settings?.upiId || '9342706675@okbizaxis'}&pn=INFOGRAM26&am=${registration?.totalFee || 350}&cu=INR`)}`} 
                        alt="UPI QR Code" 
                        className="w-48 h-48 object-cover rounded-lg" 
                      />
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

                  {/* Screenshot Upload */}
                  <div>
                    <label className={labelClass}>Payment Screenshot *</label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                        screenshot ? 'border-green-400/50 bg-green-400/5' : 'border-white/15 hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/5'
                      }`}
                      onClick={() => document.getElementById('screenshot-upload')?.click()}
                    >
                      <input type="file" id="screenshot-upload" className="hidden" accept="image/*"
                        onChange={e => e.target.files?.[0] && handleScreenshotChange(e.target.files[0])} />
                      {screenshotPreview ? (
                        <div className="space-y-3">
                          <img src={screenshotPreview} alt="Screenshot" className="max-h-36 mx-auto rounded-lg border border-white/10" />
                          <p className="text-green-400 text-xs font-semibold">{screenshot?.name}</p>
                          <p className="text-white/40 text-xs">Click to change</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-white/30" />
                          <p className="text-white/60 text-sm font-medium">Upload payment screenshot</p>
                          <p className="text-white/30 text-xs">Click to browse • PNG, JPG accepted</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !utrNumber || utrNumber.length < 12 || !screenshot}
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
