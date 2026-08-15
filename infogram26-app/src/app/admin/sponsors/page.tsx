'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Trash2, Edit3, ExternalLink, Building2, Check, X, ShieldCheck, RefreshCw, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface SponsorItem {
  id: string;
  name: string;
  websiteUrl?: string;
  logoUrl?: string;
  tier: 'gold' | 'silver' | 'bronze' | 'partner';
}

const DEFAULT_SPONSORS: Omit<SponsorItem, 'id'>[] = [
  { name: 'Appziio Technologies', websiteUrl: 'https://appziio.com', tier: 'gold', logoUrl: '' },
  { name: 'CAHCET IT Alumni', websiteUrl: 'https://cahcet.in', tier: 'gold', logoUrl: '' },
  { name: 'CodeForge Studio', websiteUrl: 'https://codeforge.dev', tier: 'silver', logoUrl: '' },
  { name: 'CloudScale Systems', websiteUrl: 'https://cloudscale.io', tier: 'silver', logoUrl: '' },
  { name: 'DevMatrix Labs', websiteUrl: 'https://devmatrix.org', tier: 'bronze', logoUrl: '' },
  { name: 'Hackathon India', websiteUrl: 'https://hackathonindia.com', tier: 'partner', logoUrl: '' },
];

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tier, setTier] = useState<'gold' | 'silver' | 'bronze' | 'partner'>('gold');
  const [logoUrl, setLogoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  /* ── 1. Live Firestore Listener ── */
  useEffect(() => {
    if (!db) {
      setSponsors(DEFAULT_SPONSORS.map((s, i) => ({ id: `default-${i}`, ...s })));
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      collection(db, 'sponsors'),
      (snap) => {
        if (snap.empty) {
          // Auto-seed default sponsors if collection is empty
          DEFAULT_SPONSORS.forEach(async (sp) => {
            try {
              await addDoc(collection(db, 'sponsors'), {
                ...sp,
                createdAt: serverTimestamp(),
              });
            } catch (e) {}
          });
        } else {
          const list = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as SponsorItem[];
          setSponsors(list);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Sponsors live sync error:', err);
        setSponsors(DEFAULT_SPONSORS.map((s, i) => ({ id: `default-${i}`, ...s })));
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  /* ── 2. Open Modal for Create / Edit ── */
  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setWebsiteUrl('');
    setTier('gold');
    setLogoUrl('');
    setShowModal(true);
  };

  const handleOpenEdit = (sp: SponsorItem) => {
    setEditingId(sp.id);
    setName(sp.name);
    setWebsiteUrl(sp.websiteUrl || '');
    setTier(sp.tier || 'gold');
    setLogoUrl(sp.logoUrl || '');
    setShowModal(true);
  };

  /* ── 3. Save Sponsor Handler ── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Sponsor name is required.');
      return;
    }

    setSaving(true);
    const toastId = toast.loading(editingId ? 'Updating sponsor...' : 'Adding sponsor...');

    try {
      if (db) {
        if (editingId && !editingId.startsWith('default-')) {
          await setDoc(
            doc(db, 'sponsors', editingId),
            {
              name: name.trim(),
              websiteUrl: websiteUrl.trim(),
              tier,
              logoUrl: logoUrl.trim(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } else {
          const newDoc = await addDoc(collection(db, 'sponsors'), {
            name: name.trim(),
            websiteUrl: websiteUrl.trim(),
            tier,
            logoUrl: logoUrl.trim(),
            createdAt: serverTimestamp(),
          });
          setEditingId(newDoc.id);
        }
      }

      toast.dismiss(toastId);
      toast.success(editingId ? '✅ Sponsor updated successfully!' : '🎉 New sponsor added live!');
      setShowModal(false);
    } catch (err: any) {
      console.error('Save sponsor error:', err);
      toast.dismiss(toastId);
      toast.error('Failed to save sponsor.');
    } finally {
      setSaving(false);
    }
  };

  /* ── 4. Delete Sponsor Handler ── */
  const handleDelete = async (id: string, sponsorName: string) => {
    if (!confirm(`Are you sure you want to remove ${sponsorName}?`)) return;

    try {
      if (db && !id.startsWith('default-')) {
        await deleteDoc(doc(db, 'sponsors', id));
      } else {
        setSponsors((prev) => prev.filter((s) => s.id !== id));
      }
      toast.success(`Removed ${sponsorName} from sponsors.`);
    } catch (err) {
      console.error('Delete sponsor error:', err);
      toast.error('Failed to delete sponsor.');
    }
  };

  const getTierBadge = (t: string) => {
    switch (t) {
      case 'gold':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            🥇 Gold Sponsor / Title
          </span>
        );
      case 'silver':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-400/20 text-slate-200 border border-slate-400/40">
            🥈 Silver Sponsor
          </span>
        );
      case 'bronze':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-700/20 text-amber-400 border border-amber-700/40">
            🥉 Bronze Sponsor
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
            🤝 Event Partner
          </span>
        );
    }
  };

  const getInitials = (n: string) => (n ? n.substring(0, 2).toUpperCase() : 'SP');

  const groupedTiers = [
    { title: 'Gold & Title Sponsors', key: 'gold' },
    { title: 'Silver Sponsors', key: 'silver' },
    { title: 'Bronze Sponsors', key: 'bronze' },
    { title: 'Event & Community Partners', key: 'partner' },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Sponsors &amp; Partners Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Manage event partners, official branding tiers, and live website marquee logos
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Sponsor
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#08182b] border border-gray-800 rounded-3xl text-gray-400">
          <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-bold text-sm">Syncing live sponsors from Firestore...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedTiers.map((tierGroup) => {
            const tierSponsors = sponsors.filter((s) => (s.tier || 'gold') === tierGroup.key);

            return (
              <div
                key={tierGroup.key}
                className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden"
              >
                <div className="bg-black/40 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-white">
                      {tierGroup.title}
                    </h2>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00d4ff] px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                    {tierSponsors.length} Active
                  </span>
                </div>

                <div className="p-5">
                  {tierSponsors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 font-semibold text-xs">
                      No sponsors in this tier yet. Click &quot;Add New Sponsor&quot; to add one.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tierSponsors.map((sp) => (
                        <div
                          key={sp.id}
                          className="flex items-center gap-4 bg-black/60 border border-gray-800 p-4 rounded-2xl hover:border-gray-700 transition-all group"
                        >
                          {/* Logo Preview */}
                          <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                            {sp.logoUrl ? (
                              <img
                                src={sp.logoUrl}
                                alt={sp.name}
                                className="w-full h-full object-contain rounded-xl"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#00d4ff]/20 text-[#00d4ff] font-black text-base flex items-center justify-center rounded-xl font-mono">
                                {getInitials(sp.name)}
                              </div>
                            )}
                          </div>

                          {/* Sponsor Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-black text-white text-base truncate">{sp.name}</h3>
                            </div>
                            <div className="mb-1.5">{getTierBadge(sp.tier)}</div>
                            {sp.websiteUrl ? (
                              <a
                                href={sp.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-[#00d4ff] font-mono hover:underline flex items-center gap-1 truncate"
                              >
                                <ExternalLink className="w-3 h-3 shrink-0" />
                                <span className="truncate">{sp.websiteUrl}</span>
                              </a>
                            ) : (
                              <span className="text-[10px] text-gray-500 font-mono">No website URL set</span>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEdit(sp)}
                              className="p-2 text-gray-400 hover:text-[#00d4ff] hover:bg-gray-800 rounded-xl transition-all"
                              title="Edit Sponsor"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(sp.id, sp.name)}
                              className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                              title="Delete Sponsor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal for Create / Edit Sponsor ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#08182b] border border-gray-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#00d4ff]" />
                  {editingId ? 'Edit Sponsor Details' : 'Add New Sponsor'}
                </h2>
                <p className="text-xs font-semibold text-gray-400 mt-0.5">
                  Appears live on the website sponsors marquee section
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                  Company / Organization Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Appziio Technologies"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-[#00d4ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00d4ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                  Sponsorship Tier <span className="text-rose-400">*</span>
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-[#00d4ff]"
                >
                  <option value="gold">🥇 Gold Sponsor / Title Sponsor</option>
                  <option value="silver">🥈 Silver Sponsor</option>
                  <option value="bronze">🥉 Bronze Sponsor</option>
                  <option value="partner">🤝 Event / Community Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                  Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00d4ff]"
                />
                <p className="text-[10px] text-gray-400 mt-1 font-medium">
                  Leave blank to auto-generate crisp styled lettermark logo based on company name.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-gray-300 hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Save &amp; Publish
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
