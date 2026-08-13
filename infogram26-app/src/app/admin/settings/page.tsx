'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Save, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import type { Settings } from '@/types';

const DEFAULT_SETTINGS: Settings = {
  razorpayEnabled: true,
  razorpayKeyId: '',
  razorpaySecret: '',
  upiId: '',
  merchantName: 'INFOGRAM 26 SYMPOSIUM',
  upiQrCodeUrl: '',
  symposiumDate: 'August 22, 2026',
  symposiumVenue: '',
  contactEmail: 'info@cahcet.edu.in',
  contactPhone: '9342706675',
  collegeAddress: '',
  mapEmbedUrl: '',
  heroTitle: '',
  heroSubtitle: '',
  isRegistrationOpen: true,
};

export default function SettingsPage() {
  const [showSecret, setShowSecret] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [qrFile, setQrFile] = useState<File | null>(null);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setSettings({ ...DEFAULT_SETTINGS, ...data } as Settings);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const saveSection = async (section: string, data: Partial<Settings>) => {
    setSavingSection(section);
    try {
      await updateSettings(data);
      toast.success('Settings saved');
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast.error('Could not save settings');
    } finally {
      setSavingSection(null);
    }
  };

  const saveEventSettings = () => saveSection('event', {
    symposiumDate: settings.symposiumDate,
    isRegistrationOpen: settings.isRegistrationOpen,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
  });

  const saveApiKeys = () => saveSection('razorpay', {
    razorpayEnabled: settings.razorpayEnabled,
    razorpayKeyId: settings.razorpayKeyId,
    razorpaySecret: settings.razorpaySecret,
  });

  const saveUpiInfo = async () => {
    setSavingSection('upi');
    try {
      let upiQrCodeUrl = settings.upiQrCodeUrl;
      if (qrFile && storage) {
        const storageRef = ref(storage, `settings/upi-qr-${Date.now()}-${qrFile.name}`);
        await uploadBytes(storageRef, qrFile);
        upiQrCodeUrl = await getDownloadURL(storageRef);
        set('upiQrCodeUrl', upiQrCodeUrl);
      }
      await updateSettings({
        upiId: settings.upiId,
        merchantName: settings.merchantName,
        upiQrCodeUrl,
      });
      setQrFile(null);
      toast.success('UPI settings saved');
    } catch (err) {
      console.error('Failed to save UPI settings:', err);
      toast.error('Could not save UPI settings');
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-[#00d4ff]/20 border-t-[#00d4ff] rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Global Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
          Configure application parameters, contact details, and payment gateways
        </p>
      </div>

      <div className="space-y-8 max-w-4xl">
        {/* EVENT SETTINGS */}
        <section className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg font-black text-white mb-6 border-b border-gray-800 pb-4">
            Event Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Symposium Dates</label>
              <input
                type="text"
                value={settings.symposiumDate}
                onChange={(e) => set('symposiumDate', e.target.value)}
                className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Registration Status</label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.isRegistrationOpen}
                  onChange={(e) => set('isRegistrationOpen', e.target.checked)}
                />
                <div className="relative w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4ff]"></div>
                <span className="ml-3 text-xs font-black uppercase tracking-wider text-white">Registrations Open</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => set('contactEmail', e.target.value)}
                className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => set('contactPhone', e.target.value)}
                className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveEventSettings}
              disabled={savingSection === 'event'}
              className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {savingSection === 'event' ? 'Saving...' : 'Save Event Settings'}
            </button>
          </div>
        </section>

        {/* PAYMENT SETTINGS */}
        <section className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg font-black text-white mb-6 border-b border-gray-800 pb-4">
            Razorpay Configuration
          </h2>
          <div className="mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.razorpayEnabled}
                onChange={(e) => set('razorpayEnabled', e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ml-3 text-xs font-black uppercase tracking-wider text-white">Enable Razorpay Gateway</span>
            </label>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Razorpay Key ID</label>
              <input
                type="text"
                value={settings.razorpayKeyId}
                onChange={(e) => set('razorpayKeyId', e.target.value)}
                placeholder="rzp_live_..."
                className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#00d4ff] focus:outline-none focus:border-[#00d4ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Razorpay Key Secret</label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={settings.razorpaySecret}
                  onChange={(e) => set('razorpaySecret', e.target.value)}
                  className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 pr-12 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00d4ff]"
                />
                <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5">
                Note: the live checkout server routes read keys from environment variables (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET), not from here yet — this stores the value for reference/future use.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveApiKeys}
              disabled={savingSection === 'razorpay'}
              className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {savingSection === 'razorpay' ? 'Saving...' : 'Save API Keys'}
            </button>
          </div>
        </section>

        {/* UPI SETTINGS */}
        <section className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg font-black text-white mb-6 border-b border-gray-800 pb-4">
            Manual UPI Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">UPI VPA ID</label>
                <input
                  type="text"
                  value={settings.upiId}
                  onChange={(e) => set('upiId', e.target.value)}
                  placeholder="yourid@okbizaxis"
                  className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#00d4ff] focus:outline-none focus:border-[#00d4ff]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Merchant Name</label>
                <input
                  type="text"
                  value={settings.merchantName}
                  onChange={(e) => set('merchantName', e.target.value)}
                  className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Upload New QR Code</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                  className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2 text-xs text-gray-300 font-bold"
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-black/60 border border-gray-800 rounded-2xl p-4">
              <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Current QR Preview</p>
              <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center border-4 border-[#00d4ff]/30 shadow-xl overflow-hidden relative">
                {qrFile ? (
                  <img src={URL.createObjectURL(qrFile)} alt="New QR preview" className="w-full h-full object-cover" />
                ) : settings.upiQrCodeUrl ? (
                  <img src={settings.upiQrCodeUrl} alt="UPI QR" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-gray-500 font-bold uppercase text-center px-4">No QR uploaded yet</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveUpiInfo}
              disabled={savingSection === 'upi'}
              className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {savingSection === 'upi' ? 'Saving...' : 'Save UPI Info'}
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
