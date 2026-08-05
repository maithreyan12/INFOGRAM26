'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase/config';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PublicLayout from '@/components/layout/PublicLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function PaymentContent() {
  const searchParams = useSearchParams();
  const regId = searchParams.get('regId');
  const router = useRouter();

  const [registration, setRegistration] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // UPI state
  const [upiRefId, setUpiRefId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!regId) {
        router.push('/register');
        return;
      }

      try {
        const regDoc = await getDoc(doc(db, 'registrations', regId));
        if (!regDoc.exists()) {
          router.push('/register');
          return;
        }
        setRegistration({ id: regDoc.id, ...regDoc.data() });

        const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data());
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [regId, router]);

  useEffect(() => {
    if (settings?.razorpayEnabled) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [settings?.razorpayEnabled]);

  const handleRazorpayPayment = async () => {
    if (!registration) return;
    
    try {
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: registration.totalFee,
          registrationId: registration.id,
          receipt: registration.applicantId
        })
      });
      
      const order = await orderRes.json();
      
      const options = {
        key: settings?.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "INFOGRAM'26",
        description: "Event Registration Payment",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationId: registration.id
            })
          });
          
          if (verifyRes.ok) {
            // Payment record created in webhook/verify, but we might do it here or server side.
            // Assuming verify creates it or we do it. Let's create it here for simplicity.
            const paymentRef = await addDoc(collection(db, 'payments'), {
              registrationId: registration.id,
              amount: registration.totalFee,
              method: 'razorpay',
              transactionId: response.razorpay_payment_id,
              status: 'success',
              createdAt: serverTimestamp()
            });
            
            await updateDoc(doc(db, 'registrations', registration.id), {
              status: 'paid',
              paymentId: paymentRef.id
            });
            
            // Generate ticket - Ideally via a server function but doing it here as simplified flow
            const { generateTicket, saveTicket } = await import('@/lib/utils/ticket');
            const ticket = generateTicket(registration, { id: paymentRef.id, transactionId: response.razorpay_payment_id, status: 'success' } as any);
            const newTicketId = await saveTicket(ticket);
            
            router.push(`/ticket/${newTicketId}`);
          }
        },
        prefill: {
          name: registration.personalInfo.fullName,
          email: registration.personalInfo.email,
          contact: registration.personalInfo.phone
        },
        theme: {
          color: "#3B82F6"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment initiation failed', err);
    }
  };

  const handleUPIPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiRefId || !screenshot || !registration) return;
    
    setIsSubmitting(true);
    try {
      const storageRef = ref(storage, `payment-proofs/${registration.id}-${Date.now()}`);
      await uploadBytes(storageRef, screenshot);
      const proofUrl = await getDownloadURL(storageRef);
      
      const paymentRef = await addDoc(collection(db, 'payments'), {
        registrationId: registration.id,
        amount: registration.totalFee,
        method: 'upi',
        transactionId: upiRefId,
        proofUrl,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      await updateDoc(doc(db, 'registrations', registration.id), {
        status: 'payment_pending_approval',
        paymentId: paymentRef.id
      });
      
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <PublicLayout><div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></PublicLayout>;

  return (
    <PublicLayout>
      <div className="container-xl py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 gradient-text">Complete Payment</h1>
        
        {paymentSuccess ? (
          <div className="glass-card p-10 text-center rounded-2xl">
            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">⏳</div>
            <h2 className="text-2xl font-bold mb-4">Payment Submitted</h2>
            <p className="text-gray-600 mb-6">Your payment proof has been submitted and is awaiting admin approval. You will receive an email once your ticket is generated.</p>
            <button onClick={() => router.push('/')} className="btn-primary px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold">Return Home</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl h-fit">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Applicant ID</p>
                  <p className="font-mono font-medium">{registration?.applicantId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Events Selected</p>
                  <ul className="space-y-2">
                    {registration?.events.map((eId: string, i: number) => (
                      <li key={i} className="flex justify-between items-center text-sm">
                        <span>Event ID: {eId}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex justify-between items-center mt-6">
                  <span className="font-semibold text-lg">Total Amount</span>
                  <span className="font-bold text-3xl text-blue-600">₹{registration?.totalFee}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
              
              {settings?.razorpayEnabled ? (
                <div className="space-y-6">
                  <p className="text-gray-600">Pay securely using Credit/Debit Card, Net Banking, or UPI via Razorpay.</p>
                  <button 
                    onClick={handleRazorpayPayment}
                    className="w-full btn-primary py-4 rounded-xl bg-[#02042B] text-white font-bold text-lg hover:bg-gray-900 transition-colors shadow-lg flex justify-center items-center gap-3"
                  >
                    <span>Pay with Razorpay</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUPIPayment} className="space-y-6">
                  <div className="text-center bg-gray-50 p-6 rounded-xl mb-6">
                    <p className="font-medium mb-4">Scan QR Code to Pay</p>
                    <div className="bg-white p-4 inline-block rounded-xl shadow-sm mb-4">
                      {settings?.upiQrCodeUrl ? (
                        <img src={settings.upiQrCodeUrl} alt="UPI QR" className="w-48 h-48 object-cover" />
                      ) : (
                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-400">No QR</div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">UPI ID: <span className="font-semibold text-black select-all">{settings?.upiId || 'infogram@upi'}</span></p>
                    <p className="text-sm text-gray-600">Merchant: <span className="font-medium text-black">{settings?.merchantName || 'INFOGRAM 26'}</span></p>
                  </div>
                  
                  <div>
                    <label className="form-label block mb-2 font-medium">UPI Transaction / Reference ID *</label>
                    <input 
                      type="text" 
                      required
                      value={upiRefId}
                      onChange={e => setUpiRefId(e.target.value)}
                      className="form-input w-full p-3 rounded-lg border border-gray-300"
                      placeholder="e.g. 123456789012"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label block mb-2 font-medium">Payment Screenshot *</label>
                    <input 
                      type="file" 
                      required
                      accept="image/*"
                      onChange={e => setScreenshot(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-2"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-70"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Payment Proof'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
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

