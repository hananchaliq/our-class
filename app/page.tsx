"use client";

import * as React from "react";
import { CalendarClock, FolderGit2 } from "lucide-react";
import { ClassLanyardShowcase } from "./components/3d/class-lanyard-showcase";
import { FarewellGiftBox3D } from "./components/3d/farewell-gift-box-3d";
import { MemoryPhotoCube3D, VinylDisc3D } from "./components/3d/memory-props-3d";
import { AdminAccessButton } from "./components/auth/admin-login-modal";
import { useClassAuth } from "./components/auth/class-auth-provider";
import { BentoHeroTelemetry } from "./components/bento/bento-hero-telemetry";
import { ClassActivityWidgets } from "./components/bento/class-activity-widgets";
import { CommandPaletteTrigger } from "./components/command/command-palette";
import { ClassNavigationShell } from "./components/navigation/class-navigation-shell";
import { ThemeSwitcher } from "./components/theme/theme-switcher";

export default function Home() {
   const { isAdmin } = useClassAuth();

   return (
      <ClassNavigationShell>
         <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-6 sm:px-6 lg:px-8">
            {/* =====================================================================
             0. DESKTOP TOP CONTEXT BAR (BREADCRUMB, SEARCH CTRL+K, ADMIN & THEME)
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

               <div className="flex items-center gap-2.5">
                  <CommandPaletteTrigger variant="topbar" />
                  <AdminAccessButton variant="topbar" />
                  <ThemeSwitcher variant="pill" />
               </div>
            </div>

            {/* =====================================================================
             1. BENTO HERO, LIVE TELEMETRY & INTERACTIVE ACTIVITY WIDGETS (FASE 5 & 6)
            ===================================================================== */}
            <section id="hero-section" className="flex scroll-mt-6 flex-col gap-4">
               <BentoHeroTelemetry />
               <ClassActivityWidgets />
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

                  {/* Tengah: Kado 3D Utama (Mode Edit Terbuka Saat Admin Active) */}
                  <div className="flex justify-center">
                     <FarewellGiftBox3D canEdit={isAdmin} />
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
