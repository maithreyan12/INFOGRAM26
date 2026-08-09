'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { UploadCloud, Trash2, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
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

      <div className="rounded-3xl border border-dashed border-[#00d4ff]/30 bg-[#08182b] text-white shadow-2xl p-8 mb-8 text-center flex flex-col items-center justify-center hover:border-[#00d4ff] transition-all cursor-pointer">
        <UploadCloud className="w-12 h-12 text-[#00d4ff] mb-4" />
        <h3 className="text-lg font-black text-white mb-2">Drag &amp; Drop Images</h3>
        <p className="text-gray-400 text-xs font-bold mb-4">Supports JPG, PNG, WEBP (Max 5MB each)</p>
        <button className="bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20">
          Select Files
        </button>
      </div>

      <h2 className="text-xl font-black text-white mb-6">Current Gallery</h2>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-gray-800 bg-[#08182b]">
            <div className="aspect-[4/3] bg-black/60 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-gray-600" />
            </div>
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <button className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-xl backdrop-blur-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <input type="text" placeholder="Add caption..." className="w-full bg-black/80 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00d4ff] mb-2 font-bold" defaultValue={`Memory ${i}`} />
                <select className="w-full bg-black/80 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00d4ff] font-bold">
                  <option>General</option>
                  <option>Hackathon</option>
                  <option>Inauguration</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
