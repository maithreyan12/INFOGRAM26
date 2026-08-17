'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Trash2, Edit3, ExternalLink, Building2, Check, X, ShieldCheck, RefreshCw, Star, Upload, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { toast } from 'sonner';

interface SponsorItem {
  id: string;
  name: string;
  websiteUrl?: string;
  logoUrl?: string;
  tier: 'gold' | 'silver' | 'bronze' | 'partner';
}

export function normalizeImageUrl(url?: string): string {
  if (!url) return '';
  let clean = url.trim();

  // 1. Google Drive URL converter
  const gDriveMatch = clean.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  }

  // 2. Dropbox URL converter
  if (clean.includes('dropbox.com')) {
    return clean.replace(/\?dl=0$/, '?raw=1').replace(/&dl=0$/, '&raw=1');
  }

  // 3. GitHub Blob to Raw URL
  if (clean.includes('github.com') && clean.includes('/blob/')) {
    return clean.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }

  return clean;
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
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tier, setTier] = useState<'gold' | 'silver' | 'bronze' | 'partner'>('gold');
  const [logoUrl, setLogoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── 1. Fetch & Listen to Sponsors ── */
  const fetchSponsorsFromApi = async () => {
    try {
      const res = await fetch('/api/admin/sponsors');
      const data = await res.json();
      if (data.success && Array.isArray(data.sponsors)) {
        if (data.sponsors.length > 0) {
          setSponsors(data.sponsors);
        } else {
          setSponsors(DEFAULT_SPONSORS.map((s, i) => ({ id: `default-${i}`, ...s })));
        }
      }
    } catch (e) {
      console.warn('API sponsors fetch fallback error:', e);
      setSponsors(DEFAULT_SPONSORS.map((s, i) => ({ id: `default-${i}`, ...s })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorsFromApi();
    if (!db) return;
    let unsub: (() => void) | undefined;
    try {
      unsub = onSnapshot(collection(db, 'sponsors'), (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as SponsorItem[];
          setSponsors(list);
        }
        setLoading(false);
      }, (err) => {
        console.warn('Sponsors live sync warning:', err);
      });
    } catch (e) {
      console.warn('Live listener attach notice:', e);
    }
    return () => { if (unsub) unsub(); };
  }, []);

  /* ── File Upload Handler ── */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setLogoUrl(result);
        toast.success('Logo loaded from device!');
      }
    };
    reader.onerror = () => { toast.error('Failed to read file.'); };
    reader.readAsDataURL(file);
  };

  /* ── Seed Defaults Handler ── */
  const handleSeedDefaults = async () => {
    const toastId = toast.loading('Adding default sponsors...');
    try {
      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed', sponsors: DEFAULT_SPONSORS }),
      });
      const data = await res.json();
      if (data.success) {
        toast.dismiss(toastId);
        toast.success('Default sponsors added!');
        await fetchSponsorsFromApi();
      } else {
        throw new Error(data.error || 'Failed to seed');
      }
    } catch (e: any) {
      toast.dismiss(toastId);
      toast.error(`Failed to seed default sponsors: ${e.message}`);
    }
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Sponsor name is required.');
      return;
    }
    setSaving(true);
    const toastId = toast.loading(editingId ? 'Updating sponsor...' : 'Adding sponsor...');
    try {
      const normalizedLogo = normalizeImageUrl(logoUrl);
      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name: name.trim(),
          websiteUrl: websiteUrl.trim(),
          tier,
          logoUrl: normalizedLogo,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Server rejected sponsor save');
      }
      toast.dismiss(toastId);
      toast.success(editingId ? '✅ Sponsor updated successfully!' : '🎉 New sponsor added live!');
      setShowModal(false);
      await fetchSponsorsFromApi();
    } catch (err: any) {
      console.error('Save sponsor error:', err);
      toast.dismiss(toastId);
      toast.error(`Failed to save sponsor: ${err?.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, sponsorName: string) => {
    if (!confirm(`Are you sure you want to remove ${sponsorName}?`)) return;
    try {
      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete sponsor');
      }
      setSponsors((prev) => prev.filter((s) => s.id !== id));
      toast.success(`Removed ${sponsorName} from sponsors.`);
    } catch (err: any) {
      console.error('Delete sponsor error:', err);
      toast.error(`Failed to delete sponsor: ${err?.message || 'Unknown error'}`);
    }
  };

  const getTierBadge = (t: string) => {
    switch (t) {
      case 'gold': return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">🥇 Gold Sponsor / Title</span>;
      case 'silver': return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-400/20 text-slate-200 border border-slate-400/40">🥈 Silver Sponsor</span>;
      case 'bronze': return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-700/20 text-amber-400 border border-amber-700/40">🥉 Bronze Sponsor</span>;
      default: return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">🤝 Event Partner</span>;
    }
  };

  const getInitials = (n: string) => (n ? n.substring(0, 5).toUpperCase() : 'SP');

  const groupedTiers = [
    { title: 'Gold & Title Sponsors', key: 'gold' },
    { title: 'Silver Sponsors', key: 'silver' },
    { title: 'Bronze Sponsors', key: 'bronze' },
    { title: 'Event & Community Partners', key: 'partner' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>Sponsors &amp; Partners Management</h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">Manage event partners, official branding tiers, and live website marquee logos</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {sponsors.length === 0 && (
            <button onClick={handleSeedDefaults} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
              <RefreshCw className="w-4 h-4 text-[#00d4ff]" /> Seed Sample Sponsors
            </button>
          )}
          <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" /> Add New Sponsor
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#08182b] border border-gray-800 rounded-3xl text-gray-400">
          <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-bold text-sm">Syncing live sponsors...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedTiers.map((tierGroup) => {
            const tierSponsors = sponsors.filter((s) => (s.tier || 'gold') === tierGroup.key);
            return (
              <div key={tierGroup.key} className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden">
                <div className="bg-black/40 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-white">{tierGroup.title}</h2>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00d4ff] px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">{tierSponsors.length} Active</span>
                </div>
                <div className="p-5">
                  {tierSponsors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 font-semibold text-xs">No sponsors in this tier yet. Click &quot;Add New Sponsor&quot; to add one.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tierSponsors.map((sp) => {
                        const normalizedLogo = normalizeImageUrl(sp.logoUrl);
                        const hasFailed = failedImages[sp.id];
                        const showImage = normalizedLogo && !hasFailed;
                        return (
                          <div key={sp.id} className="flex items-center gap-4 bg-black/60 border border-gray-800 p-4 rounded-2xl hover:border-gray-700 transition-all group">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center p-1 shrink-0 overflow-hidden relative">
                              {showImage ? (
                                <img src={normalizedLogo} alt={sp.name} className="w-full h-full object-contain rounded-xl" onError={() => setFailedImages((prev) => ({ ...prev, [sp.id]: true }))} />
                              ) : (
                                <div className="w-full h-full bg-[#00d4ff]/20 text-[#00d4ff] font-black text-xs flex items-center justify-center rounded-xl font-mono text-center px-1">{getInitials(sp.name)}</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-white text-base truncate mb-1">{sp.name}</h3>
                              <div className="mb-1.5">{getTierBadge(sp.tier)}</div>
                              {sp.websiteUrl ? (
                                <a href={sp.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#00d4ff] font-mono hover:underline flex items-center gap-1 truncate">
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{sp.websiteUrl}</span>
                                </a>
                              ) : <span className="text-[10px] text-gray-500 font-mono">No website URL set</span>}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => handleOpenEdit(sp)} className="p-2 text-gray-400 hover:text-[#00d4ff] hover:bg-gray-800 rounded-xl transition-all" title="Edit Sponsor"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(sp.id, sp.name)} className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all" title="Delete Sponsor"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#08182b] border border-gray-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-[#00d4ff]" />{editingId ? 'Edit Sponsor Details' : 'Add New Sponsor'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">Company Name <span className="text-rose-400">*</span></label>
                <input type="text" required placeholder="e.g. My Company" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-[#00d4ff]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">Website URL</label>
                <input type="url" placeholder="https://example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00d4ff]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">Sponsorship Tier <span className="text-rose-400">*</span></label>
                <select value={tier} onChange={(e) => setTier(e.target.value as any)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-[#00d4ff]">
                  <option value="gold">🥇 Gold Sponsor / Title Sponsor</option>
                  <option value="silver">🥈 Silver Sponsor</option>
                  <option value="bronze">🥉 Bronze Sponsor</option>
                  <option value="partner">🤝 Event / Community Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">Logo Image (Upload or URL)</label>
                <div className="flex items-center gap-3 mb-2">
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-[#00d4ff] border border-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all">
                    <Upload className="w-4 h-4" /> Upload from Device
                  </button>
                  {logoUrl && <button type="button" onClick={() => setLogoUrl('')} className="text-xs text-rose-400 hover:underline font-bold">Clear Logo</button>}
                </div>
                <input type="text" placeholder="Or paste image URL" value={logoUrl.startsWith('data:') ? '[Data URL Image]' : logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00d4ff]" />
                {logoUrl && (
                  <div className="mt-3 p-3 bg-black/40 border border-gray-800 rounded-2xl flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden p-1 shrink-0">
                      <img src={normalizeImageUrl(logoUrl)} alt="Preview" className="w-full h-full object-contain rounded-lg" onError={(e) => (e.target as HTMLElement).style.display = 'none'} />
                    </div>
                    <div className="text-xs text-gray-300"><p className="font-bold text-white">Logo Preview</p></div>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-xs text-gray-300 hover:bg-gray-800 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all disabled:opacity-50">
                  {saving ? 'Saving...' : <><Check className="w-4 h-4" /> Save &amp; Publish</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
