"use client";

import * as React from "react";
import { ClassLanyardShowcase } from "./components/3d/class-lanyard-showcase";
import { AdminAccessButton } from "./components/auth/admin-login-modal";
import { BentoHeroTelemetry } from "./components/bento/bento-hero-telemetry";
import { ClassActivityWidgets } from "./components/bento/class-activity-widgets";
import { CommandPaletteTrigger } from "./components/command/command-palette";
import { FarewellStageSection } from "./components/farewell/farewell-stage-section";
import { ClassProjectGallery } from "./components/gallery/class-project-gallery";
import { ClassNavigationShell } from "./components/navigation/class-navigation-shell";
import { ClassScheduleArchive } from "./components/schedule/class-schedule-archive";
import { ClassTasksAgendaBoard } from "./components/schedule/class-tasks-agenda-board";
import { ThemeSwitcher } from "./components/theme/theme-switcher";

export default function Home() {
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
             2. HALAMAN / SECTION KEDUA: ID CARD 3D LANYARD RAIL (22 SISWA — FASE 8)
            ===================================================================== */}
            <section id="lanyard-section" className="scroll-mt-6">
               <ClassLanyardShowcase />
            </section>

            {/* =====================================================================
             3. SECTION KETIGA: JADWAL MAPEL, PIKET & PAPAN TUGAS/AGENDA (FASE 9 & 10)
            ===================================================================== */}
            <section id="schedule-section" className="flex scroll-mt-6 flex-col gap-4">
               <ClassScheduleArchive />
               <ClassTasksAgendaBoard />
            </section>

            {/* =====================================================================
             4. SECTION KEEMPAT: ETALASE PROJECT PPLG & GALERI FOTO KELAS (FASE 11)
            ===================================================================== */}
            <section id="gallery-section" className="scroll-mt-6">
               <ClassProjectGallery />
            </section>

            {/* =====================================================================
             5. HALAMAN KHUSUS PERPISAHAN: PANGGUNG KADO 3D + VINYL & KUBUS (FASE 12)
            ===================================================================== */}
            <section id="farewell-gift-section" className="scroll-mt-6">
               <FarewellStageSection />
            </section>
         </main>
      </ClassNavigationShell>
   );
}
