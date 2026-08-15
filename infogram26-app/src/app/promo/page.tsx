'use client';

import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Download, Sparkles, Zap, Trophy, ShieldCheck, QrCode, ChevronRight, Award, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PromoStudioPage() {
  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);
  const slide3Ref = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadSlide = async (ref: React.RefObject<HTMLDivElement | null>, slideName: string) => {
    if (!ref.current) return;
    setDownloading(true);
    toast.info(`Generating 1080x1080 HD PNG for ${slideName}...`);

    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#030712',
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `INFOGRAM26_${slideName}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(`✅ Downloaded ${slideName} successfully!`);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to export slide image');
    } finally {
      setDownloading(false);
    }
  };

  const downloadAll = async () => {
    await downloadSlide(slide1Ref, 'Instagram_Slide1_Cover');
    await new Promise((r) => setTimeout(r, 500));
    await downloadSlide(slide2Ref, 'Instagram_Slide2_Events');
    await new Promise((r) => setTimeout(r, 500));
    await downloadSlide(slide3Ref, 'Instagram_Slide3_ScannableQR');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 sm:p-8 font-sans selection:bg-[#00d4ff] selection:text-black">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#00d4ff]/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Navigation / Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Ultra-Premium Promo Studio
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Instagram Carousel Pack Generator
            </h1>
            <p className="text-gray-400 text-sm font-semibold mt-1">
              1080x1080 Pixel-Perfect HD Graphics • 100% Real Scannable QR Code • Crisp Metallic Typography
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 transition-all"
            >
              Back to Admin
            </Link>
            <button
              onClick={downloadAll}
              disabled={downloading}
              className="flex items-center gap-2 bg-gradient-to-r from-[#00d4ff] to-purple-500 hover:opacity-90 text-slate-950 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Download All 3 HD Slides
            </button>
          </div>
        </div>

        {/* ── 3 SLIDES DISPLAY GRID ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">

          {/* ════════════════ SLIDE 1: HERO COVER ════════════════ */}
          <div className="flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-3 px-1">
              <span className="text-xs font-black uppercase text-[#00d4ff] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Slide 1: Launch Cover
              </span>
              <button
                onClick={() => downloadSlide(slide1Ref, 'Instagram_Slide1_Cover')}
                className="text-xs font-black text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded-lg"
              >
                <Download className="w-3.5 h-3.5" /> Save PNG
              </button>
            </div>

            {/* 1080x1080 Export Container */}
            <div className="w-full max-w-[540px] aspect-square rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/10 relative">
              <div
                ref={slide1Ref}
                className="w-full h-full bg-[#050b14] p-8 flex flex-col justify-between relative overflow-hidden select-none"
                style={{ width: '540px', height: '540px' }}
              >
                {/* Futuristic Grid & Light Effect Background */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00d4ff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00d4ff]/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header Badge */}
                <div className="relative z-10 text-center">
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 bg-purple-950/60 border border-purple-500/40 px-3 py-1 rounded-full inline-block mb-1 shadow-lg">
                    C. ABDUL HAKEEM COLLEGE OF ENGG &amp; TECH
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-300">
                    DEPARTMENT OF INFORMATION TECHNOLOGY PRESENTS
                  </div>
                </div>

                {/* Center Title */}
                <div className="relative z-10 my-auto text-center space-y-2">
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-purple-300 to-[#00d4ff] tracking-tight filter drop-shadow-[0_0_25px_rgba(0,212,255,0.6)]">
                    INFOGRAM &apos;26
                  </div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-4 py-1.5 rounded-xl inline-block shadow-md">
                    NATIONAL LEVEL TECHNICAL SYMPOSIUM
                  </div>

                  {/* Highlights Badge Bar */}
                  <div className="pt-2 flex justify-center gap-2 text-[9px] font-bold text-gray-300">
                    <span className="bg-black/60 border border-gray-800 px-2.5 py-1 rounded-lg">🗓️ MARCH 2026</span>
                    <span className="bg-black/60 border border-gray-800 px-2.5 py-1 rounded-lg">📍 IT BLOCK</span>
                    <span className="bg-black/60 border border-gray-800 px-2.5 py-1 rounded-lg">🏆 ₹50,000+ CASH</span>
                  </div>
                </div>

                {/* Call-to-action banner */}
                <div className="relative z-10 space-y-3 text-center">
                  <div className="bg-gradient-to-r from-purple-900/80 via-blue-900/80 to-purple-900/80 border border-cyan-500/50 p-3.5 rounded-2xl shadow-xl shadow-cyan-500/10">
                    <div className="text-xs font-black text-[#00d4ff] uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                      ONLINE REGISTRATION NOW LIVE!
                    </div>
                    <div className="text-[10px] text-gray-200 font-semibold mt-0.5">
                      Grab Your Slots Fast — Seats Filling Rapidly! ⚡
                    </div>
                  </div>

                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center justify-center gap-1">
                    <span>SWIPE LEFT FOR EVENTS &amp; QR</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#00d4ff]" />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* ════════════════ SLIDE 2: EVENTS SHOWCASE ════════════════ */}
          <div className="flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-3 px-1">
              <span className="text-xs font-black uppercase text-purple-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> Slide 2: 16+ Events Showcase
              </span>
              <button
                onClick={() => downloadSlide(slide2Ref, 'Instagram_Slide2_Events')}
                className="text-xs font-black text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded-lg"
              >
                <Download className="w-3.5 h-3.5" /> Save PNG
              </button>
            </div>

            {/* 1080x1080 Export Container */}
            <div className="w-full max-w-[540px] aspect-square rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/10 relative">
              <div
                ref={slide2Ref}
                className="w-full h-full bg-[#050b14] p-6 flex flex-col justify-between relative overflow-hidden select-none"
                style={{ width: '540px', height: '540px' }}
              >
                <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="text-center relative z-10">
                  <div className="text-xs font-black uppercase tracking-[0.25em] text-[#00d4ff]">
                    INFOGRAM &apos;26 SYMPOSIUM
                  </div>
                  <div className="text-xl font-black text-white uppercase tracking-tight mt-0.5">
                    16+ ELECTRIFYING EVENTS
                  </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-2 gap-2.5 my-auto relative z-10">
                  <div className="p-2.5 rounded-xl bg-gray-900/80 border border-cyan-500/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                      <span className="text-xs font-black text-cyan-300">&lt;/&gt;</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white leading-tight">BYTE BATTLE</div>
                      <div className="text-[9px] font-bold text-gray-400">Competitive Coding</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-900/80 border border-purple-500/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                      <span className="text-xs">🐞</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white leading-tight">CODESTORM</div>
                      <div className="text-[9px] font-bold text-gray-400">Code Debugging</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-900/80 border border-amber-500/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                      <span className="text-xs">🛠️</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white leading-tight">HACK FORGE</div>
                      <div className="text-[9px] font-bold text-gray-400">Hackathon Pitch</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-900/80 border border-emerald-500/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <span className="text-xs">🏴‍☠️</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white leading-tight">QUEST X</div>
                      <div className="text-[9px] font-bold text-gray-400">Mega Treasure Hunt</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-900/80 border border-red-500/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                      <span className="text-xs">🎮</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white leading-tight">BATTLE VERSE</div>
                      <div className="text-[9px] font-bold text-gray-400">BGMI Tournament</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-900/80 border border-blue-500/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                      <span className="text-xs">🎤</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white leading-tight">TECH TALKS</div>
                      <div className="text-[9px] font-bold text-gray-400">Paper Presentation</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-900/80 border border-pink-500/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shrink-0">
                      <span className="text-xs">🎨</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white leading-tight">PIXEL CRAFT</div>
                      <div className="text-[9px] font-bold text-gray-400">UI/UX Design</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-900/80 border border-teal-500/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                      <span className="text-xs">🥳</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white leading-tight">FUN FIESTA</div>
                      <div className="text-[9px] font-bold text-gray-400">Non-Tech Gaming</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Callout */}
                <div className="relative z-10 space-y-2 text-center">
                  <div className="bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-xl text-center">
                    <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Cash Prizes + Official Certificates + Free Food
                    </div>
                  </div>

                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center justify-center gap-1">
                    <span>SWIPE LEFT FOR REGISTRATION QR</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#00d4ff]" />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* ════════════════ SLIDE 3: 100% REAL SCANNABLE QR CODE ════════════════ */}
          <div className="flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-3 px-1">
              <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" /> Slide 3: 100% Working Scannable QR
              </span>
              <button
                onClick={() => downloadSlide(slide3Ref, 'Instagram_Slide3_ScannableQR')}
                className="text-xs font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg"
              >
                <Download className="w-3.5 h-3.5" /> Save PNG
              </button>
            </div>

            {/* 1080x1080 Export Container */}
            <div className="w-full max-w-[540px] aspect-square rounded-3xl overflow-hidden border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 relative">
              <div
                ref={slide3Ref}
                className="w-full h-full bg-[#050b14] p-6 flex flex-col justify-between items-center relative overflow-hidden select-none text-center"
                style={{ width: '540px', height: '540px' }}
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="relative z-10">
                  <div className="text-xs font-black uppercase tracking-[0.25em] text-[#00d4ff]">
                    INFOGRAM &apos;26 SYMPOSIUM
                  </div>
                  <div className="text-xl font-black text-white uppercase tracking-tight mt-0.5">
                    SCAN QR TO REGISTER NOW 🚀
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Point phone camera to scan
                  </div>
                </div>

                {/* Center Scannable QR Code Box */}
                <div className="relative z-10 my-auto p-4 rounded-3xl bg-white border-4 border-[#00d4ff] shadow-[0_0_40px_rgba(0,212,255,0.4)]">
                  <QRCode
                    value="https://infogram26.in/register"
                    size={200}
                    level="H"
                    fgColor="#000000"
                    bgColor="#FFFFFF"
                  />
                  <div className="mt-2 text-[9px] font-black uppercase tracking-wider text-black bg-[#00d4ff] py-0.5 rounded-md">
                    ✓ 100% SCANNABLE QR
                  </div>
                </div>

                {/* Footer URL & Info */}
                <div className="relative z-10 space-y-2 w-full">
                  <div className="bg-black/80 border border-cyan-500/40 p-2.5 rounded-xl font-mono text-xs font-black text-[#00d4ff] flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                    <span>https://infogram26.in/register</span>
                  </div>

                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    C. ABDUL HAKEEM COLLEGE OF ENGG &amp; TECH • DEPT OF IT
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Callout Section */}
        <div className="p-8 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl text-center space-y-4">
          <h2 className="text-2xl font-black text-white">How to use these Instagram Promo Graphics:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto text-xs font-semibold text-gray-300">
            <div className="p-4 rounded-2xl bg-black/40 border border-gray-800">
              <span className="text-xl font-black text-[#00d4ff] block mb-1">1. Click Download</span>
              Hit the &quot;Download All 3 HD Slides&quot; button above to save 1080x1080 crystal clear PNG images.
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-gray-800">
              <span className="text-xl font-black text-purple-400 block mb-1">2. Upload as Carousel</span>
              On Instagram, create a new Post and select all 3 images in order (Slide 1, Slide 2, Slide 3).
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-gray-800">
              <span className="text-xl font-black text-emerald-400 block mb-1">3. Test QR Scan</span>
              Followers can swipe to Slide 3 and point their phone camera right at the QR code to open <code className="text-[#00d4ff]">infogram26.in/register</code>!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
