'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus, Trash2, Edit2, Save, X, Bell, Info,
  AlertTriangle, CheckCircle, Megaphone, Eye, EyeOff, Loader2
} from 'lucide-react';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, orderBy, query, serverTimestamp
} from 'firebase/firestore';
// @ts-ignore
import { db, isFirebaseConfigured } from '@/lib/firebase/config';

type AnnouncementType = 'info' | 'warning' | 'success' | 'urgent';

type Announcement = {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  isActive: boolean;
  createdAt: any;
  dateStr?: string;
};

const TYPE_CONFIG: Record<AnnouncementType, { label: string; color: string; border: string; bg: string; icon: React.ReactNode }> = {
  info:    { label: 'Info',    color: '#38bdf8', border: 'rgba(56,189,248,0.4)',  bg: 'rgba(56,189,248,0.08)',  icon: <Info size={16} color="#38bdf8" /> },
  success: { label: 'Success', color: '#4ade80', border: 'rgba(74,222,128,0.4)',  bg: 'rgba(74,222,128,0.08)',  icon: <CheckCircle size={16} color="#4ade80" /> },
  warning: { label: 'Warning', color: '#fbbf24', border: 'rgba(251,191,36,0.4)',  bg: 'rgba(251,191,36,0.08)',  icon: <AlertTriangle size={16} color="#fbbf24" /> },
  urgent:  { label: 'Urgent',  color: '#f87171', border: 'rgba(248,113,113,0.4)', bg: 'rgba(248,113,113,0.08)', icon: <Bell size={16} color="#f87171" /> },
};

const EMPTY: Omit<Announcement, 'id' | 'createdAt' | 'dateStr'> = {
  title: '', content: '', type: 'info', isActive: true,
};

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured || !db) { setLoading(false); return; }
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setAnnouncements(snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id, ...data,
          dateStr: data.createdAt ? new Date(data.createdAt.toMillis()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Just now',
        } as Announcement;
      }));
    } catch (e) {
      showToast('Failed to load announcements', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const openCreate = () => {
    setForm({ ...EMPTY });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (a: Announcement) => {
    setForm({ title: a.title, content: a.content, type: a.type, isActive: a.isActive });
    setEditId(a.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) { showToast('Title and content are required', 'error'); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateDoc(doc(db, 'announcements', editId), { ...form });
        showToast('Announcement updated!');
      } else {
        await addDoc(collection(db, 'announcements'), { ...form, createdAt: serverTimestamp() });
        showToast('Announcement created!');
      }
      setShowForm(false);
      await fetchAnnouncements();
    } catch (e) {
      showToast('Save failed', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'announcements', id));
      showToast('Deleted successfully');
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch {
      showToast('Delete failed', 'error');
    }
    setDeleting(null);
  };

  const toggleActive = async (a: Announcement) => {
    try {
      await updateDoc(doc(db, 'announcements', a.id), { isActive: !a.isActive });
      setAnnouncements(prev => prev.map(x => x.id === a.id ? { ...x, isActive: !x.isActive } : x));
      showToast(a.isActive ? 'Hidden from public' : 'Now visible on homepage');
    } catch {
      showToast('Update failed', 'error');
    }
  };

  return (
    <AdminLayout>
      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          padding: '12px 20px', borderRadius: 12,
          background: toast.type === 'success' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(74,222,128,0.5)' : 'rgba(248,113,113,0.5)'}`,
          color: 'white', fontWeight: 600, fontSize: 14,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Megaphone className="text-cyan-400" size={28} />
            Announcements
          </h1>
          <p className="text-gray-400 mt-1">Manage news and updates shown on the homepage</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all"
          style={{
            background: 'linear-gradient(135deg,#00d4ff,#0097c7)',
            color: 'white', border: 'none',
            boxShadow: '0 4px 20px rgba(0,212,255,0.3)',
          }}
        >
          <Plus size={18} /> New Announcement
        </button>
      </div>

      {/* ── Create / Edit Form ── */}
      {showForm && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(0,212,255,0.2)',
          borderTop: '2px solid rgba(0,212,255,0.5)',
          borderRadius: 18,
          padding: '28px 24px',
          marginBottom: 28,
          backdropFilter: 'blur(20px)',
        }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editId ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Venue Change for Hackathon"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontSize: 14,
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(TYPE_CONFIG) as AnnouncementType[]).map(t => {
                  const cfg = TYPE_CONFIG[t];
                  const active = form.type === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setForm(f => ({ ...f, type: t }))}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: active ? cfg.bg : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${active ? cfg.border : 'rgba(255,255,255,0.08)'}`,
                        color: active ? cfg.color : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {cfg.icon} {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
              <div className="flex gap-2">
                {[true, false].map(val => (
                  <button
                    key={String(val)}
                    onClick={() => setForm(f => ({ ...f, isActive: val }))}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: form.isActive === val ? (val ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)') : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${form.isActive === val ? (val ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)') : 'rgba(255,255,255,0.08)'}`,
                      color: form.isActive === val ? (val ? '#4ade80' : '#f87171') : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {val ? <Eye size={14} /> : <EyeOff size={14} />}
                    {val ? 'Public' : 'Hidden'}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
              <textarea
                rows={3}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Write the announcement message..."
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none resize-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontSize: 14,
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg,#00d4ff,#0097c7)',
                color: 'white',
                opacity: saving ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(0,212,255,0.25)',
              }}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-xl font-semibold text-sm text-gray-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Announcements List ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-cyan-400" size={36} />
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Megaphone size={48} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Announcements Yet</h3>
          <p className="text-gray-500 mb-6">Create your first announcement to show on the homepage</p>
          <button onClick={openCreate} className="btn-primary px-6 py-3 rounded-xl font-bold text-sm">
            + Create Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total', value: announcements.length, color: '#00d4ff' },
              { label: 'Active', value: announcements.filter(a => a.isActive).length, color: '#4ade80' },
              { label: 'Hidden', value: announcements.filter(a => !a.isActive).length, color: '#f87171' },
              { label: 'Urgent', value: announcements.filter(a => a.type === 'urgent').length, color: '#fbbf24' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 14, padding: '14px 16px',
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {announcements.map(a => {
            const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.info;
            return (
              <div
                key={a.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderLeft: `3px solid ${cfg.color}`,
                  borderRadius: 14,
                  padding: '16px 18px',
                  opacity: a.isActive ? 1 : 0.55,
                  transition: 'opacity 0.2s',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}
              >
                {/* Type icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginTop: 2,
                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>{a.title}</span>
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 600,
                      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>{cfg.label}</span>
                    {!a.isActive && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
                        Hidden
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.5, marginBottom: 4 }}>{a.content}</p>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{a.dateStr}</span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => toggleActive(a)}
                    title={a.isActive ? 'Hide' : 'Show'}
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)', color: a.isActive ? '#4ade80' : '#f87171',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}
                  >
                    {a.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(a)}
                    title="Edit"
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)', color: '#00d4ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    title="Delete"
                    disabled={deleting === a.id}
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)',
                      background: 'rgba(248,113,113,0.08)', color: '#f87171',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}
                  >
                    {deleting === a.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
