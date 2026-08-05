'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/shared/PageHero';
import { GalleryImage } from '@/types';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState('All');
  const [events, setEvents] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage & { eventName?: string }));
        setImages(data as GalleryImage[]);
        
        const uniqueEvents = Array.from(new Set(data.map(img => (img as GalleryImage & {eventName?: string}).eventName).filter(Boolean)));
        setEvents(uniqueEvents as string[]);
      } catch (error) {
        console.error('Error fetching gallery images', error);
      }
    };
    
    // In a real app we would call fetchImages(), for now let's just use empty array
    // fetchImages();
  }, []);

  const filteredImages = filter === 'All' ? images : images.filter(img => (img as GalleryImage & {eventName?: string}).eventName === filter);

  // Generate placeholder images if empty
  const displayImages = filteredImages.length > 0 ? filteredImages : Array.from({ length: 12 }).map((_, i) => ({
    id: `placeholder-${i}`,
    url: '',
    caption: `Sample Memory ${i + 1}`,
    eventName: i % 2 === 0 ? 'Coding Contest' : 'Paper Presentation',
    aspectRatio: i % 3 === 0 ? 'aspect-video' : i % 2 === 0 ? 'aspect-square' : 'aspect-[3/4]'
  }));

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex(prev => prev !== null && prev < displayImages.length - 1 ? prev + 1 : prev);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex(prev => prev !== null && prev > 0 ? prev - 1 : prev);
  };

  return (
    <PublicLayout>
      <PageHero 
        title="Photo Gallery" 
        subtitle="Memories from INFOGRAM"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery', href: '/gallery' }]}
      />
      
      <div className="section-padding container-xl mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          <button 
            onClick={() => setFilter('All')}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${filter === 'All' ? 'bg-primary text-white' : 'glass-card hover:bg-white/10'}`}
          >
            All
          </button>
          {events.length > 0 ? events.map(evt => (
            <button
              key={evt}
              onClick={() => setFilter(evt)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${filter === evt ? 'bg-primary text-white' : 'glass-card hover:bg-white/10'}`}
            >
              {evt}
            </button>
          )) : (
            <>
              <button onClick={() => setFilter('Coding Contest')} className={`px-4 py-2 rounded-full transition-all duration-300 ${filter === 'Coding Contest' ? 'bg-primary text-white' : 'glass-card hover:bg-white/10'}`}>Coding Contest</button>
              <button onClick={() => setFilter('Paper Presentation')} className={`px-4 py-2 rounded-full transition-all duration-300 ${filter === 'Paper Presentation' ? 'bg-primary text-white' : 'glass-card hover:bg-white/10'}`}>Paper Presentation</button>
            </>
          )}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="masonry-grid columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {displayImages.map((img: any, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={img.id}
                className="masonry-item break-inside-avoid relative group overflow-hidden rounded-2xl glass-card cursor-pointer"
                onClick={() => openLightbox(idx)}
              >
                {img.url ? (
                  <img src={img.url} alt={img.caption || 'Gallery image'} className="w-full object-cover rounded-2xl" />
                ) : (
                  <div className={`w-full ${img.aspectRatio || 'aspect-square'} bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl`} />
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ZoomIn className="text-white/70 w-8 h-8" />
                  </div>
                  <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.eventName && (
                      <span className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-2 block">{img.eventName}</span>
                    )}
                    <h3 className="text-white font-medium">{img.caption}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>

            {lightboxIndex > 0 && (
              <button 
                className="absolute left-6 text-white/50 hover:text-white transition-colors p-2 rounded-full glass-card"
                onClick={prevImage}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-5xl max-h-[80vh] w-full p-4 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {(displayImages[lightboxIndex] as any).url ? (
                <img 
                  src={(displayImages[lightboxIndex] as any).url} 
                  alt={(displayImages[lightboxIndex] as any).caption}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-full max-w-2xl aspect-video bg-gradient-to-br from-indigo-500/40 to-purple-500/40 rounded-xl flex items-center justify-center">
                  <p className="text-white/50 text-xl">Placeholder Image</p>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">{(displayImages[lightboxIndex] as any).caption}</h3>
                {(displayImages[lightboxIndex] as any).eventName && (
                  <p className="text-primary-400">{(displayImages[lightboxIndex] as any).eventName}</p>
                )}
              </div>
            </motion.div>

            {lightboxIndex < displayImages.length - 1 && (
              <button 
                className="absolute right-6 text-white/50 hover:text-white transition-colors p-2 rounded-full glass-card"
                onClick={nextImage}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PublicLayout>
  );
}
