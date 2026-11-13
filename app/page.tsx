"use client";

import * as React from "react";
import { ClassLanyardShowcase } from "./components/3d/class-lanyard-showcase";
import { FarewellGiftBox3D } from "./components/3d/farewell-gift-box-3d";
import { GraduationCap3D, TechKeycap3D } from "./components/3d/hero-props-3d";
import { MemoryPhotoCube3D, VinylDisc3D } from "./components/3d/memory-props-3d";

export default function Home() {
   return (
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
         {/* =====================================================================
          1. HERO SECTION (IDENTITAS KELAS + OBJEK 3D KEYCAP & TOGA)
         ===================================================================== */}
         <section className="obsidian-surface relative overflow-hidden p-8 md:p-12">
            <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
               <div className="max-w-xl text-center lg:text-left">
                  <div className="obsidian-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1">
                     <span className="h-2 w-2 rounded-full bg-sky-400 glow-cyan" />
                     <span className="font-mono text-[11px] tracking-widest text-sky-300">XII PPLG 1 · ANGKATAN 2026</span>
                  </div>

                  <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
                     22 Baris Logika, <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400 bg-clip-text text-transparent">Satu Kapsul Memori.</span>
                  </h1>

                  <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">Arsip digital, direktori interaktif 22 developer XII PPLG 1, jadwal kenangan, serta kotak kado perpisahan 3D menjelang kelulusan.</p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                     <a href="#lanyard-section" className="obsidian-pill rounded-full border-sky-400/40 bg-sky-500/15 px-5 py-2.5 text-xs font-semibold text-sky-200 transition hover:bg-sky-500/25 glow-cyan">
                        Lihat 22 ID Card Siswa ↓
                     </a>
                     <a href="#farewell-gift-section" className="obsidian-pill rounded-full border-amber-400/40 bg-amber-500/15 px-5 py-2.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/25 glow-amber">
                        Buka Kado Perpisahan 3D
                     </a>
                  </div>
               </div>

               {/* Objek 3D Mandiri di Hero */}
               <div className="flex flex-wrap items-center justify-center gap-4">
                  <TechKeycap3D label="PPLG-1" sublabel="22 SISWA" />
                  <GraduationCap3D year="2026" />
               </div>
            </div>
         </section>

         {/* =====================================================================
          2. HALAMAN / SECTION KEDUA: ID CARD 3D LANYARD RAIL (22 SISWA)
         ===================================================================== */}
         <section id="lanyard-section" className="scroll-mt-8">
            <ClassLanyardShowcase />
         </section>

         {/* =====================================================================
          3. HALAMAN KHUSUS PERPISAHAN: KADO 3D + VINYL & KUBUS MEMORI
         ===================================================================== */}
         <section id="farewell-gift-section" className="obsidian-surface scroll-mt-8 p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
               <span className="obsidian-pill inline-block rounded-full px-3.5 py-1 font-mono text-[11px] tracking-widest text-amber-300">GRADUATION CAPSULE · XII PPLG 1</span>
               <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">Kado Perpisahan & Ruang Memori Kelas</h2>
               <p className="mt-2 text-sm text-slate-400">Putar kado 3D di bawah ini dan klik untuk membuka album foto kenangan, surat perpisahan, serta quotes teman sekelas.</p>
            </div>

            <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-3">
               {/* Kiri: Pemutar Vinyl 3D */}
               <div className="flex justify-center">
                  <VinylDisc3D />
               </div>

               {/* Tengah: Kado 3D Utama */}
               <div className="flex justify-center">
                  <FarewellGiftBox3D canEdit={true} />
               </div>

               {/* Kanan: Kubus Foto Momen 3D */}
               <div className="flex justify-center">
                  <MemoryPhotoCube3D />
               </div>
            </div>
         </section>
      </main>
   );
}
