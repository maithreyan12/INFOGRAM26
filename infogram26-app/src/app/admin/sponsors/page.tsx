'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { listenToCollection, collections, createDocument, deleteDocument } from '@/lib/firebase/firestore';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import type { Sponsor, SponsorTier } from '@/types';

const TIERS: { key: SponsorTier; label: string }[] = [
  { key: 'gold', label: 'Title / Gold Sponsor' },
  { key: 'silver', label: 'Silver Sponsor' },
  { key: 'bronze', label: 'Bronze Sponsor' },
  { key: 'partner', label: 'Event Partner' },
];

export default function SponsorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [tier, setTier] = useState<SponsorTier>('gold');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = listenToCollection<Sponsor>(collections.sponsors, (data) => {
      setSponsors(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setName('');
    setWebsite('');
    setTier('gold');
    setLogoFile(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Company name is required');
      return;
    }
    setSaving(true);
    try {
      let logoUrl = '';
      if (logoFile && storage) {
        const storageRef = ref(storage, `sponsors/${Date.now()}-${logoFile.name}`);
        await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(storageRef);
      }
      await createDocument<Omit<Sponsor, 'id'>>(collections.sponsors, {
        name: name.trim(),
        website: website.trim(),
        logoUrl,
        tier,
        order: sponsors.length,
        isActive: true,
      });
      toast.success('Sponsor added');
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save sponsor:', err);
      toast.error('Could not save sponsor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(collections.sponsors, id);
      toast.success('Sponsor removed');
    } catch (err) {
      console.error('Failed to delete sponsor:', err);
      toast.error('Could not remove sponsor');
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Sponsors &amp; Partners
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Manage event partners and sponsor branding tiers
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all">
          <Plus className="w-4 h-4" /> Add Sponsor
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-[#00d4ff]/20 border-t-[#00d4ff] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {TIERS.map(({ key, label }) => {
            const tierSponsors = sponsors.filter((s) => s.tier === key);
            return (
              <div key={key} className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden">
                <div className="bg-black/40 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-base font-black text-white">{label}</h2>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00d4ff] px-2.5 py-0.5 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                    {tierSponsors.length} sponsor{tierSponsors.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {tierSponsors.length === 0 ? (
                    <p className="text-xs text-gray-500 font-bold px-2 py-3">No sponsors in this tier yet.</p>
                  ) : (
                    tierSponsors.map((sponsor) => (
                      <div key={sponsor.id} className="flex items-center gap-4 bg-black/50 border border-gray-800 p-4 rounded-2xl hover:border-gray-700 transition-colors group">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shrink-0 overflow-hidden">
                          {sponsor.logoUrl ? (
                            <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center text-white font-black text-[10px]">
                              LOGO
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-black text-white text-base">{sponsor.name}</h3>
                          {sponsor.website && (
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00d4ff] font-mono hover:underline flex items-center gap-1 w-fit">
                              {sponsor.website} <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <button onClick={() => handleDelete(sponsor.id)} className="text-gray-500 hover:text-red-400 p-2 transition-all">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Sponsor</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Website URL</label>
                <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Sponsorship Tier</label>
                <select value={tier} onChange={(e) => setTier(e.target.value as SponsorTier)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  {TIERS.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Logo Upload</label>
                <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-1.5 text-gray-400" />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-800">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Sponsor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
