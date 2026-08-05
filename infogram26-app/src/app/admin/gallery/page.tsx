'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { UploadCloud, Trash2, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Gallery Manager</h1>
          <p className="text-gray-400 mt-1">Upload and manage memories</p>
        </div>
      </div>

      <div className="glass-card bg-white/5 border border-dashed border-white/20 rounded-2xl p-8 mb-8 text-center flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
        <UploadCloud className="w-12 h-12 text-purple-400 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Drag & Drop Images</h3>
        <p className="text-gray-400 text-sm mb-4">Supports JPG, PNG, WEBP (Max 5MB each)</p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium">Select Files</button>
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Current Gallery</h2>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {/* Placeholder images */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="break-inside-avoid relative group rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <div className="aspect-[4/3] bg-gray-800 flex items-center justify-center">
               <ImageIcon className="w-10 h-10 text-gray-600" />
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <button className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg backdrop-blur-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <input type="text" placeholder="Add caption..." className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500 mb-2" defaultValue={`Memory ${i}`} />
                <select className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500">
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
