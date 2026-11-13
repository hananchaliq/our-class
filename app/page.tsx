"use client";

import * as React from "react";
import { CalendarClock, FolderGit2, Gift, Users } from "lucide-react";
import { ClassLanyardShowcase } from "./components/3d/class-lanyard-showcase";
import { AdminAccessButton } from "./components/auth/admin-login-modal";
import { BentoHeroTelemetry } from "./components/bento/bento-hero-telemetry";
import { ClassActivityWidgets } from "./components/bento/class-activity-widgets";
import { CommandPaletteTrigger } from "./components/command/command-palette";
import { FarewellStageSection } from "./components/farewell/farewell-stage-section";
import { ClassProjectGallery } from "./components/gallery/class-project-gallery";
import { ClassFooterCredits } from "./components/navigation/class-footer-credits";
import { ClassNavigationShell } from "./components/navigation/class-navigation-shell";
import { ClassScheduleArchive } from "./components/schedule/class-schedule-archive";
import { ClassTasksAgendaBoard } from "./components/schedule/class-tasks-agenda-board";
import { ThemeSwitcher } from "./components/theme/theme-switcher";

const MOBILE_QUICK_SHORTCUTS = [
   {
      href: "#lanyard-section",
      label: "22 ID Card 3D",
      sub: "Absen #01–#22",
      icon: Users,
      accent: "text-sky-600 dark:text-sky-300",
   },
   {
      href: "#schedule-section",
      label: "Jadwal & Piket",
      sub: "Senin–Sabtu",
      icon: CalendarClock,
      accent: "text-indigo-600 dark:text-indigo-300",
   },
   {
      href: "#gallery-section",
      label: "Karya & Galeri",
      sub: "4 Divisi PPLG",
      icon: FolderGit2,
      accent: "text-emerald-600 dark:text-emerald-300",
   },
   {
      href: "#farewell-gift-section",
      label: "Kapsul Kado 3D",
      sub: "Memori 2026",
      icon: Gift,
      accent: "text-amber-600 dark:text-amber-300",
   },
];

export default function Home() {
   return (
      <ClassNavigationShell>
         <main className="mx-auto flex w-full max-w-6xl flex-col gap-9 px-3 py-4 sm:gap-12 sm:px-6 sm:py-6 lg:gap-14 lg:px-8">
            {/* =====================================================================
             0A. DESKTOP TOP CONTEXT BAR (BREADCRUMB, SEARCH CTRL+K, ADMIN & THEME)
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
             0B. MOBILE QUICK SHORTCUT GRID (360px - 430px CARD GRID 2 KOLOM)
            ===================================================================== */}
            <div
               aria-label="Pintasan Cepat Mobile"
               className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:hidden">
               {MOBILE_QUICK_SHORTCUTS.map((item) => {
                  const Icon = item.icon;
                  return (
                     <a
                        key={item.href}
                        href={item.href}
                        className="obsidian-pill flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition active:scale-[0.99]">
                        <span className="obsidian-pill flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                           <Icon className={`h-4 w-4 ${item.accent}`} />
                        </span>
                        <div className="min-w-0">
                           <div className="truncate text-xs font-bold text-foreground">
                              {item.label}
                           </div>
                           <div className="mono-tabular truncate text-[10px] text-muted-foreground">
                              {item.sub}
                           </div>
                        </div>
                     </a>
                  );
               })}
            </div>

            {/* =====================================================================
             1. BENTO HERO, LIVE TELEMETRY & INTERACTIVE ACTIVITY WIDGETS (FASE 5 & 6)
            ===================================================================== */}
            <section
               id="hero-section"
               className="flex scroll-mt-16 flex-col gap-4 lg:scroll-mt-6">
               <BentoHeroTelemetry />
               <ClassActivityWidgets />
            </section>

            {/* =====================================================================
             2. HALAMAN / SECTION KEDUA: ID CARD 3D LANYARD RAIL (22 SISWA — FASE 8)
            ===================================================================== */}
            <section
               id="lanyard-section"
               className="scroll-mt-16 lg:scroll-mt-6">
               <ClassLanyardShowcase />
            </section>

            {/* =====================================================================
             3. SECTION KETIGA: JADWAL MAPEL, PIKET & PAPAN TUGAS/AGENDA (FASE 9 & 10)
            ===================================================================== */}
            <section
               id="schedule-section"
               className="flex scroll-mt-16 flex-col gap-4 lg:scroll-mt-6">
               <ClassScheduleArchive />
               <ClassTasksAgendaBoard />
            </section>

            {/* =====================================================================
             4. SECTION KEEMPAT: ETALASE PROJECT PPLG & GALERI FOTO KELAS (FASE 11)
            ===================================================================== */}
            <section
               id="gallery-section"
               className="scroll-mt-16 lg:scroll-mt-6">
               <ClassProjectGallery />
            </section>

            {/* =====================================================================
             5. HALAMAN KHUSUS PERPISAHAN: PANGGUNG KADO 3D + VINYL & KUBUS (FASE 12)
            ===================================================================== */}
            <section
               id="farewell-gift-section"
               className="scroll-mt-16 lg:scroll-mt-6">
               <FarewellStageSection />
            </section>

            {/* =====================================================================
             6. FOOTER DEDIKASI & STATUS ARSIP DIGITAL XII PPLG 1 — 2026 (FASE 20)
            ===================================================================== */}
            <ClassFooterCredits />
         </main>
      </ClassNavigationShell>
   );
}
