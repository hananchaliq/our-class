"use client";

import * as React from "react";
import { ArrowDown, CalendarClock, FolderGit2, Gift } from "lucide-react";
import { ClassLanyardShowcase } from "./components/3d/class-lanyard-showcase";
import { FarewellGiftBox3D } from "./components/3d/farewell-gift-box-3d";
import { GraduationCap3D, TechKeycap3D } from "./components/3d/hero-props-3d";
import { MemoryPhotoCube3D, VinylDisc3D } from "./components/3d/memory-props-3d";
import { ClassNavigationShell } from "./components/navigation/class-navigation-shell";
import { ThemeSwitcher } from "./components/theme/theme-switcher";

export default function Home() {
   return (
      <ClassNavigationShell>
         <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-6 sm:px-6 lg:px-8">
            {/* =====================================================================
             0. DESKTOP TOP CONTEXT BAR (BREADCRUMB TEKNIS & THEME SWITCHER)
            ===================================================================== */}
            <div className="hidden lg:flex items-center justify-between gap-4">
               <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <span className="mono-tabular font-semibold text-foreground">
                     XII PPLG 1
                  </span>
                  <span aria-hidden="true">/</span>
                  <span>Rekayasa Perangkat Lunak & Gim</span>
                  <span aria-hidden="true">·</span>
                  <span className="mono-tabular">Angkatan 2026</span>
               </div>

               <ThemeSwitcher variant="pill" />
            </div>

            {/* =====================================================================
             1. HERO SECTION (IDENTITAS KELAS + OBJEK 3D KEYCAP & TOGA)
            ===================================================================== */}
            <section
               id="hero-section"
               className="obsidian-surface relative scroll-mt-6 overflow-hidden p-6 sm:p-8 md:p-12">
               <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
                  <div className="max-w-xl text-center lg:text-left">
                     <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-300">
                        <span className="mono-tabular tracking-widest">
                           XII PPLG 1 · ANGKATAN 2026
                        </span>
                     </div>
                     <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                        22 Baris Logika,{" "}
                        <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 dark:from-sky-400 dark:via-indigo-400 dark:to-amber-400 bg-clip-text text-transparent">
                           Satu Kapsul Memori.
                        </span>
                     </h1>
                     <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Arsip digital, direktori interaktif 22 developer XII PPLG 1, jadwal kenangan, serta kotak kado perpisahan 3D menjelang kelulusan.
                     </p>
                     <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                        <a
                           href="#lanyard-section"
                           className="obsidian-pill inline-flex items-center gap-2 rounded-full border-sky-400/40 bg-sky-500/15 px-5 py-2.5 text-xs font-semibold text-sky-700 dark:text-sky-200 transition hover:bg-sky-500/25 glow-cyan whitespace-nowrap shrink-0">
                           <span>Lihat 22 ID Card Siswa</span>
                           <ArrowDown className="h-3.5 w-3.5" />
                        </a>
                        <a
                           href="#farewell-gift-section"
                           className="obsidian-pill inline-flex items-center gap-2 rounded-full border-amber-400/40 bg-amber-500/15 px-5 py-2.5 text-xs font-semibold text-amber-800 dark:text-amber-200 transition hover:bg-amber-500/25 glow-amber whitespace-nowrap shrink-0">
                           <Gift className="h-3.5 w-3.5" />
                           <span>Buka Kado Perpisahan 3D</span>
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
            <section id="lanyard-section" className="scroll-mt-6">
               <ClassLanyardShowcase />
            </section>

            {/* =====================================================================
             3. ANCHOR SECTION JADWAL & PIKET (DIPERLUAS PADA FASE 9 & 10)
            ===================================================================== */}
            <section
               id="schedule-section"
               className="obsidian-surface scroll-mt-6 p-6 sm:p-8">
               <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                     <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-300">
                        <CalendarClock className="h-3.5 w-3.5" />
                        <span className="mono-tabular tracking-widest">
                           SECTION 03 · JADWAL MAPEL, PIKET & AGENDA
                        </span>
                     </div>
                     <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        Arsip Jadwal Pelajaran & Piket Harian XII PPLG 1
                     </h2>
                     <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        Jadwal produktif PPLG, mata pelajaran umum, serta pembagian piket harian Senin–Sabtu (22 siswa).
                     </p>
                  </div>
                  <span className="mono-tabular text-xs font-semibold text-muted-foreground">
                     SENIN — SABTU
                  </span>
               </div>
            </section>

            {/* =====================================================================
             4. ANCHOR SECTION PROJECT & GALERI (DIPERLUAS PADA FASE 11)
            ===================================================================== */}
            <section
               id="gallery-section"
               className="obsidian-surface scroll-mt-6 p-6 sm:p-8">
               <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                     <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                        <FolderGit2 className="h-3.5 w-3.5" />
                        <span className="mono-tabular tracking-widest">
                           SECTION 04 · ETALASE KARYA & MEMORI KELAS
                        </span>
                     </div>
                     <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        PPLG Projects Showcase & Galeri Momen Kelas
                     </h2>
                     <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        Kumpulan repositori aplikasi web, mobile, gim, serta dokumentasi kenangan angkatan 2026.
                     </p>
                  </div>
                  <span className="mono-tabular text-xs font-semibold text-muted-foreground">
                     4 DIVISI TEKNIS
                  </span>
               </div>
            </section>

            {/* =====================================================================
             5. HALAMAN KHUSUS PERPISAHAN: KADO 3D + VINYL & KUBUS MEMORI
            ===================================================================== */}
            <section
               id="farewell-gift-section"
               className="obsidian-surface scroll-mt-6 p-6 sm:p-8 md:p-12">
               <div className="mx-auto max-w-2xl text-center">
                  <span className="mono-tabular text-xs font-semibold tracking-widest text-amber-600 dark:text-amber-300">
                     GRADUATION CAPSULE · XII PPLG 1
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                     Kado Perpisahan & Ruang Memori Kelas
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                     Putar kado 3D di bawah ini dan klik untuk membuka album foto kenangan, surat perpisahan, serta quotes teman sekelas.
                  </p>
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
      </ClassNavigationShell>
   );
}
