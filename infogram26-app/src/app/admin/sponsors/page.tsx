'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Trash2, ExternalLink, X, MapPin, Phone, Building2, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { listenToCollection, collections, createDocument, deleteDocument } from '@/lib/firebase/firestore';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import type { Sponsor, SponsorTier } from '@/types';

const TIERS: { key: SponsorTier; label: string; color: string }[] = [
  { key: 'gold',    label: '🥇 Title / Gold Sponsor',  color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  { key: 'silver',  label: '🥈 Silver Sponsor',         color: 'text-gray-300 bg-gray-300/10 border-gray-300/30' },
  { key: 'bronze',  label: '🥉 Bronze Sponsor',         color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
  { key: 'partner', label: '🤝 Event Partner',          color: 'text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/30' },
];

interface SponsorForm {
  name: string;
  details: string;
  location: string;
  contact: string;
  website: string;
  tier: SponsorTier;
  logoFile: File | null;
}

const defaultForm: SponsorForm = {
  name: '', details: '', location: '', contact: '', website: '', tier: 'gold', logoFile: null,
};

export default function SponsorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SponsorForm>(defaultForm);

  useEffect(() => {
    const unsubscribe = listenToCollection<Sponsor>(collections.sponsors, (data) => {
      setSponsors(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Sponsor name is required'); return; }
    setSaving(true);
    try {
      let logoUrl = '';
      if (form.logoFile && storage) {
        const storageRef = ref(storage, `sponsors/${Date.now()}-${form.logoFile.name}`);
        await uploadBytes(storageRef, form.logoFile);
        logoUrl = await getDownloadURL(storageRef);
      }
      await createDocument<Omit<Sponsor, 'id'>>(collections.sponsors, {
        name:     form.name.trim(),
        website:  form.website.trim(),
        logoUrl,
        tier:     form.tier,
        order:    sponsors.length,
        isActive: true,
        // Extra fields stored as part of doc
        ...(form.details  && { details:  form.details.trim()  }),
        ...(form.location && { location: form.location.trim() }),
        ...(form.contact  && { contact:  form.contact.trim()  }),
      } as any);
      toast.success('Sponsor added successfully!');
      setForm(defaultForm);
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save sponsor:', err);
      toast.error('Could not save sponsor. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this sponsor?')) return;
    try {
      await deleteDocument(collections.sponsors, id);
      toast.success('Sponsor removed');
    } catch {
      toast.error('Could not remove sponsor');
    }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full bg-[#0d1f35] border border-gray-700 focus:border-[#00d4ff] rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors placeholder:text-gray-600";

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Sponsors &amp; Partners
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Manage event sponsors, partners and their branding tiers
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Sponsor
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-[#00d4ff]/20 border-t-[#00d4ff] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {TIERS.map(({ key, label, color }) => {
            const tierSponsors = sponsors.filter((s) => s.tier === key);
            return (
              <div key={key} className="rounded-3xl border border-gray-800 bg-[#08182b] shadow-2xl overflow-hidden">
                <div className="bg-black/40 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-base font-black text-white">{label}</h2>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${color}`}>
                    {tierSponsors.length} sponsor{tierSponsors.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {tierSponsors.length === 0 ? (
                    <p className="text-xs text-gray-600 font-bold px-2 py-4 text-center">No sponsors in this tier yet.</p>
                  ) : (
                    tierSponsors.map((sponsor) => (
                      <div key={sponsor.id} className="flex items-start gap-4 bg-black/40 border border-gray-800 p-4 rounded-2xl hover:border-gray-700 transition-colors group">
                        {/* Logo */}
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shrink-0 overflow-hidden">
                          {sponsor.logoUrl ? (
                            <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full bg-slate-200 rounded-lg flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-slate-500" />
                            </div>
                          )}
                        </div>
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-white text-base mb-1">{sponsor.name}</h3>
                          {(sponsor as any).details && (
                            <p className="text-xs text-gray-400 mb-1.5 line-clamp-2">{(sponsor as any).details}</p>
                          )}
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {(sponsor as any).location && (
                              <span className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                                <MapPin className="w-3 h-3 text-[#00d4ff]" /> {(sponsor as any).location}
                              </span>
                            )}
                            {(sponsor as any).contact && (
                              <span className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                                <Phone className="w-3 h-3 text-green-400" /> {(sponsor as any).contact}
                              </span>
                            )}
                            {sponsor.website && (
                              <a href={sponsor.website} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-[#00d4ff] font-mono hover:underline">
                                <ExternalLink className="w-3 h-3" /> {sponsor.website}
                              </a>
                            )}
                          </div>
                        </div>
                        <button onClick={() => handleDelete(sponsor.id)} className="text-gray-600 hover:text-red-400 p-2 transition-all shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Sponsor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#08182b] border border-gray-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-white">Add New Sponsor</h2>
                <p className="text-xs text-gray-500 font-bold mt-0.5">Fill in sponsor details</p>
              </div>
              <button onClick={() => { setShowModal(false); setForm(defaultForm); }} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Sponsor / Company Name *">
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. TechCorp Solutions" className={inputCls} />
              </Field>

              <Field label="About / Details">
                <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })}
                  placeholder="Brief description about the sponsor..." rows={3} className={inputCls + " resize-none"} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Location / City">
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Chennai, TN" className={inputCls} />
                </Field>
                <Field label="Contact Number">
                  <input type="tel" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="e.g. 9876543210" className={inputCls} />
                </Field>
              </div>

              <Field label="Website URL">
                <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://example.com" className={inputCls} />
              </Field>

              <Field label="Sponsorship Tier">
                <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as SponsorTier })} className={inputCls}>
                  {TIERS.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
                </select>
              </Field>

              <Field label="Logo Image">
                <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, logoFile: e.target.files?.[0] || null })}
                  className="w-full bg-[#0d1f35] border border-gray-700 rounded-xl px-4 py-2.5 text-gray-400 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#00d4ff]/20 file:text-[#00d4ff] file:font-bold file:text-xs cursor-pointer" />
                {form.logoFile && (
                  <p className="text-xs text-green-400 font-bold mt-1">✓ {form.logoFile.name}</p>
                )}
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setShowModal(false); setForm(defaultForm); }}
                className="px-5 py-2.5 rounded-xl font-black text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-xl font-black text-xs bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 disabled:opacity-50 flex items-center gap-2 transition-all active:scale-95">
                <Star className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Add Sponsor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
