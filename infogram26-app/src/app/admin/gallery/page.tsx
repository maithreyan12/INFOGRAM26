'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { UploadCloud, Trash2, Image as ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { listenToCollection, collections, createDocument, updateDocument, deleteDocument } from '@/lib/firebase/firestore';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import type { GalleryImage } from '@/types';

export default function GalleryPage() {
  const { adminUser } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = listenToCollection<GalleryImage>(collections.gallery, (data) => {
      setImages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const uploadFiles = async (files: FileList | File[]) => {
    if (!storage) {
      toast.error('Storage is not configured');
      return;
    }
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) return;

    setUploading(true);
    try {
      for (const file of list) {
        const storageRef = ref(storage, `gallery/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        await createDocument<Omit<GalleryImage, 'id'>>(collections.gallery, {
          url,
          caption: '',
          uploadedBy: adminUser?.email || 'admin',
          uploadedAt: new Date(),
          isActive: true,
        });
      }
      toast.success(`${list.length} image(s) uploaded`);
    } catch (err) {
      console.error('Gallery upload failed:', err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCaptionBlur = async (id: string, caption: string) => {
    try {
      await updateDocument(collections.gallery, id, { caption });
    } catch (err) {
      console.error('Failed to update caption:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(collections.gallery, id);
      toast.success('Image removed');
    } catch (err) {
      console.error('Failed to delete image:', err);
      toast.error('Could not remove image');
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Gallery Manager
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Upload and manage symposium memories &amp; event photos
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-3xl border border-dashed bg-[#08182b] text-white shadow-2xl p-8 mb-8 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
          dragOver ? 'border-[#00d4ff] bg-[#00d4ff]/5' : 'border-[#00d4ff]/30 hover:border-[#00d4ff]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <UploadCloud className="w-12 h-12 text-[#00d4ff] mb-4" />
        <h3 className="text-lg font-black text-white mb-2">Drag &amp; Drop Images</h3>
        <p className="text-gray-400 text-xs font-bold mb-4">Supports JPG, PNG, WEBP (Max 5MB each)</p>
        <button
          type="button"
          disabled={uploading}
          className="bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Select Files'}
        </button>
      </div>

      <h2 className="text-xl font-black text-white mb-6">Current Gallery</h2>
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-[#00d4ff]/20 border-t-[#00d4ff] rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm font-bold">No images uploaded yet.</div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {images.map((img) => (
            <div key={img.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-gray-800 bg-[#08182b]">
              <div className="aspect-[4/3] bg-black/60 flex items-center justify-center overflow-hidden">
                {img.url ? (
                  <img src={img.url} alt={img.caption || 'Gallery image'} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-gray-600" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <button onClick={() => handleDelete(img.id)} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-xl backdrop-blur-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Add caption..."
                    defaultValue={img.caption}
                    onBlur={(e) => handleCaptionBlur(img.id, e.target.value)}
                    className="w-full bg-black/80 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00d4ff] font-bold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
