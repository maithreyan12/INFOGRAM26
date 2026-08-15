'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Save, Eye, EyeOff, Check, RefreshCw, ShieldCheck, CreditCard, Calendar, Phone, Mail, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(true);

  // Event Settings State
  const [symposiumDates, setSymposiumDates] = useState('August 22, 2026');
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const [contactEmail, setContactEmail] = useState('info@cahcet.edu.in');
  const [contactPhone, setContactPhone] = useState('9342706675');
  const [savingEvent, setSavingEvent] = useState(false);

  // Razorpay Settings State
  const [enableRazorpay, setEnableRazorpay] = useState(true);
  const [razorpayKeyId, setRazorpayKeyId] = useState(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TPacWV4BbmByiW');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');
  const [savingRazorpay, setSavingRazorpay] = useState(false);

  // UPI Settings State
  const [upiId, setUpiId] = useState('9342706675@okbizaxis');
  const [merchantName, setMerchantName] = useState('INFOGRAM 26 SYMPOSIUM');
  const [qrUrlInput, setQrUrlInput] = useState('');
  const [savingUpi, setSavingUpi] = useState(false);

  /* ── 1. Live Firestore Sync ── */
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      doc(db, 'settings', 'global'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.symposiumDates !== undefined) setSymposiumDates(data.symposiumDates);
          if (data.registrationsOpen !== undefined) setRegistrationsOpen(data.registrationsOpen);
          if (data.contactEmail !== undefined) setContactEmail(data.contactEmail);
          if (data.contactPhone !== undefined) setContactPhone(data.contactPhone);

          if (data.enableRazorpay !== undefined) setEnableRazorpay(data.enableRazorpay);
          if (data.razorpayKeyId !== undefined) setRazorpayKeyId(data.razorpayKeyId);
          if (data.razorpayKeySecret !== undefined) setRazorpayKeySecret(data.razorpayKeySecret);

          if (data.upiId !== undefined) setUpiId(data.upiId);
          if (data.merchantName !== undefined) setMerchantName(data.merchantName);
          if (data.qrUrlInput !== undefined) setQrUrlInput(data.qrUrlInput);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Global settings sync notice:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  /* ── 2. Save Handlers ── */
  const handleSaveEventSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEvent(true);
    const toastId = toast.loading('Saving Event Configuration...');
    try {
      if (db) {
        await setDoc(
          doc(db, 'settings', 'global'),
          {
            symposiumDates,
            registrationsOpen,
            contactEmail,
            contactPhone,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      toast.dismiss(toastId);
      toast.success('✅ Event Settings saved live!');
    } catch (err: any) {
      console.error('Save event settings error:', err);
      toast.dismiss(toastId);
      toast.error('Failed to save event settings.');
    } finally {
      setSavingEvent(false);
    }
  };

  const handleSaveRazorpaySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRazorpay(true);
    const toastId = toast.loading('Saving Razorpay Configuration...');
    try {
      if (db) {
        await setDoc(
          doc(db, 'settings', 'global'),
          {
            enableRazorpay,
            razorpayKeyId,
            razorpayKeySecret,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      toast.dismiss(toastId);
      toast.success('✅ Razorpay API Keys updated live!');
    } catch (err: any) {
      console.error('Save Razorpay settings error:', err);
      toast.dismiss(toastId);
      toast.error('Failed to save API keys.');
    } finally {
      setSavingRazorpay(false);
    }
  };

  const handleSaveUpiSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUpi(true);
    const toastId = toast.loading('Saving UPI Configuration...');
    try {
      if (db) {
        await setDoc(
          doc(db, 'settings', 'global'),
          {
            upiId,
            merchantName,
            qrUrlInput,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      toast.dismiss(toastId);
      toast.success('✅ Manual UPI Payment Info saved live!');
    } catch (err: any) {
      console.error('Save UPI settings error:', err);
      toast.dismiss(toastId);
      toast.error('Failed to save UPI settings.');
    } finally {
      setSavingUpi(false);
    }
  };

  const activeQrCodeUrl =
    qrUrlInput.trim() ||
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&cu=INR`
    )}`;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Global Settings &amp; Configuration
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
          Configure symposium parameters, contact numbers, payment gateways, and UPI credentials
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#08182b] border border-gray-800 rounded-3xl text-gray-400">
          <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-bold text-sm">Loading global settings from Firestore...</p>
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl">
          {/* EVENT SETTINGS */}
          <form
            onSubmit={handleSaveEventSettings}
            className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
              <Calendar className="w-5 h-5 text-[#00d4ff]" />
              <h2 className="text-lg font-black text-white">Event Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Symposium Dates</label>
                <input
                  type="text"
                  value={symposiumDates}
                  onChange={(e) => setSymposiumDates(e.target.value)}
                  className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]"
                />
              </div>

              <div className="flex flex-col justify-center">
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Registration Status</label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registrationsOpen}
                    onChange={(e) => setRegistrationsOpen(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4ff]"></div>
                  <span className="ml-3 text-xs font-black uppercase tracking-wider text-white">
                    {registrationsOpen ? '🟢 Registrations Open' : '🔴 Registrations Closed'}
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Contact Phone / Support WhatsApp</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingEvent}
                className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {savingEvent ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Event Settings
                  </>
                )}
              </button>
            </div>
          </form>

          {/* PAYMENT SETTINGS */}
          <form
            onSubmit={handleSaveRazorpaySettings}
            className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-black text-white">Razorpay Configuration</h2>
            </div>

            <div className="mb-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableRazorpay}
                  onChange={(e) => setEnableRazorpay(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className="ml-3 text-xs font-black uppercase tracking-wider text-white">
                  {enableRazorpay ? '🟢 Enable Razorpay Gateway' : '⚪ Razorpay Gateway Disabled'}
                </span>
              </label>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Razorpay Key ID (Live / Test)</label>
                <input
                  type="text"
                  placeholder="e.g. rzp_live_TPacWV4BbmByiW"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#00d4ff] focus:outline-none focus:border-[#00d4ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Razorpay Key Secret</label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    placeholder="Enter Razorpay Secret Key"
                    value={razorpayKeySecret}
                    onChange={(e) => setRazorpayKeySecret(e.target.value)}
                    className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 pr-12 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00d4ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingRazorpay}
                className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {savingRazorpay ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save API Keys
                  </>
                )}
              </button>
            </div>
          </form>

          {/* UPI SETTINGS */}
          <form
            onSubmit={handleSaveUpiSettings}
            className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
              <QrCode className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">Manual UPI Payment Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">UPI VPA ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#00d4ff] focus:outline-none focus:border-[#00d4ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">Merchant Name</label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">Custom QR Code Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/qr.png"
                    value={qrUrlInput}
                    onChange={(e) => setQrUrlInput(e.target.value)}
                    className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00d4ff]"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Leave blank to auto-generate dynamic UPI payment QR code for VPA {upiId}.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-black/60 border border-gray-800 rounded-2xl p-6">
                <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Live Dynamic QR Code Preview</p>
                <div className="w-44 h-44 bg-white p-3 rounded-2xl flex items-center justify-center border-4 border-[#00d4ff]/30 shadow-2xl overflow-hidden shrink-0">
                  <img
                    src={activeQrCodeUrl}
                    alt="UPI Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[10px] text-[#00d4ff] font-mono font-bold mt-3">{upiId}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingUpi}
                className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {savingUpi ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save UPI Info
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
