'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { motion } from 'framer-motion';
// @ts-ignore
import { db, isFirebaseConfigured } from '@/lib/firebase/config';

type GalleryImage = {
  id: string;
  url: string;
  caption: string;
};

export default function GalleryPreview() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        if (!isFirebaseConfigured || !db) return; // placeholders shown by default
        const q = query(collection(db, 'gallery'), where('isActive', '==', true), limit(8));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage)));
        }
      } catch (error) {
        
      }
    }
    fetchGallery();
  }, []);

  const placeholders = Array.from({ length: 8 }, (_, i) => ({
    id: `placeholder-${i}`,
    url: '',
    caption: `Past Event Memory ${i + 1}`
  }));

  const displayImages = images.length > 0 ? images : placeholders;

  return (
    <section className="section-padding container-xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="section-badge inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-4">
            Gallery
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Memories from Past</h2>
        </div>
        <Link href="/gallery" className="btn-glass px-6 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-colors shrink-0">
          View Full Gallery
        </Link>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
        {displayImages.map((image, i) => (
          <motion.div 
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-xl overflow-hidden group glass-card border border-white/10 break-inside-avoid ${i % 2 === 0 ? 'h-64' : 'h-80'}`}
          >
            {image.url ? (
              <img src={image.url} alt={image.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-sky-500/20 to-purple-600/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <span className="text-white/20 font-bold text-2xl">IMG</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {image.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
