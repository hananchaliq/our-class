"use client";

import * as React from "react";
import {
   ArrowUp,
   CalendarClock,
   Code2,
   Database,
   FolderGit2,
   Gift,
   Heart,
   LayoutDashboard,
   Shuffle,
   Sparkles,
   Terminal,
   Users,
} from "lucide-react";
import { INITIAL_PPLG1_STUDENTS } from "@/app/types/class-system";
import { AdminAccessButton } from "../auth/admin-login-modal";
import { CommandPaletteTrigger } from "../command/command-palette";
import { ThemeSwitcher } from "../theme/theme-switcher";
import {
   getSupabaseBrowserClient,
   isSupabaseConfigured,
} from "@/lib/supabase/client";

const FOOTER_SECTION_LINKS = [
   {
      id: "hero-section",
      code: "01",
      label: "Bento Dashboard & Telemetri",
      icon: LayoutDashboard,
   },
   {
      id: "lanyard-section",
      code: "02",
      label: "22 ID Card Lanyard 3D",
      icon: Users,
   },
   {
      id: "schedule-section",
      code: "03",
      label: "Jadwal Mapel, Piket & Tugas",
      icon: CalendarClock,
   },
   {
      id: "gallery-section",
      code: "04",
      label: "Etalase Karya & Galeri Foto",
      icon: FolderGit2,
   },
   {
      id: "farewell-gift-section",
      code: "05",
      label: "Panggung Kapsul Kado 3D",
      icon: Gift,
   },
];

const TECH_STACK_BADGES = [
   "Next.js App Router",
   "TypeScript Strict",
   "Tailwind CSS v4",
   "True 3D CSS & Physics",
   "Supabase PostgreSQL & Storage",
   "Dual-Theme Glassmorphism",
];

export function ClassFooterCredits() {
   const [supabaseConnected, setSupabaseConnected] = React.useState(false);
   const [lastRandomAbsen, setLastRandomAbsen] = React.useState<number | null>(
      null
   );

   React.useEffect(() => {
      setSupabaseConnected(
         isSupabaseConfigured() && Boolean(getSupabaseBrowserClient())
      );
   }, []);

   const handleScrollToSection = (sectionId: string) => {
      const el = document.getElementById(sectionId);
      if (el) {
         el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
   };

   const handleJumpToRandomStudent = () => {
      const randomIndex = Math.floor(
         Math.random() * INITIAL_PPLG1_STUDENTS.length
      );
      const picked =
         INITIAL_PPLG1_STUDENTS[randomIndex] ?? INITIAL_PPLG1_STUDENTS[0];
      setLastRandomAbsen(picked.absen);

      const lanyardEl = document.getElementById("lanyard-section");
      if (lanyardEl) {
         lanyardEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      window.dispatchEvent(
         new CustomEvent("pplg1:select-student", {
            detail: { absen: picked.absen, studentId: picked.id },
         })
      );
   };

   const handleScrollTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   return (
      <footer
         aria-label="Footer Dedikasi Angkatan XII PPLG 1"
         className="obsidian-surface relative overflow-hidden p-5 sm:p-7">
         {/* =================================================================
          1. BAGIAN ATAS: IDENTITAS ARSIP DIGITAL & TOMBOL AKSI CEPAT
         ================================================================= */}
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Kolom Kiri (5 Kolom): Identitas & Dedikasi Angkatan */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-5">
               <div>
                  <div className="inline-flex items-center gap-2">
                     <span className="obsidian-pill flex h-9 w-9 items-center justify-center rounded-xl border-sky-400/35 bg-sky-500/15 text-sky-600 dark:text-sky-300 glow-cyan">
                        <Terminal className="h-4 w-4" />
                     </span>
                     <div>
                        <span className="mono-tabular block text-[10px] font-bold tracking-widest text-sky-600 uppercase dark:text-sky-300">
                           DIGITAL ARCHIVE · CLASS OF 2026
                        </span>
                        <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                           XII PPLG 1 — Rekayasa Perangkat Lunak & Gim
                        </h2>
                     </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                     Ruang arsip interaktif untuk mengabadikan perjalanan 22
                     developer muda XII PPLG 1: mulai dari direktori ID Card
                     Lanyard 3D, jadwal produktif lab, galeri karya, hingga
                     kapsul kado kelulusan 2026.
                  </p>
               </div>

               {/* Statistik Singkat 2 Kolom di HP */}
               <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="obsidian-pill rounded-xl px-3 py-2">
                     <div className="mono-tabular text-sm font-bold text-sky-600 dark:text-sky-300">
                        22
                     </div>
                     <div className="text-[10px] font-medium text-muted-foreground">
                        Siswa Aktif
                     </div>
                  </div>
                  <div className="obsidian-pill rounded-xl px-3 py-2">
                     <div className="mono-tabular text-sm font-bold text-indigo-600 dark:text-indigo-300">
                        04
                     </div>
                     <div className="text-[10px] font-medium text-muted-foreground">
                        Divisi Teknis
                     </div>
                  </div>
                  <div className="obsidian-pill rounded-xl px-3 py-2">
                     <div className="mono-tabular text-sm font-bold text-emerald-600 dark:text-emerald-300">
                        06
                     </div>
                     <div className="text-[10px] font-medium text-muted-foreground">
                        Hari Produktif
                     </div>
                  </div>
                  <div className="obsidian-pill rounded-xl px-3 py-2">
                     <div className="mono-tabular text-sm font-bold text-amber-600 dark:text-amber-300">
                        2026
                     </div>
                     <div className="text-[10px] font-medium text-muted-foreground">
                        Tahun Lulus
                     </div>
                  </div>
               </div>
            </div>

            {/* Kolom Tengah (4 Kolom): Peta Navigasi 5 Section (Card Grid 2 Kolom di HP) */}
            <div className="flex flex-col justify-between gap-3 lg:col-span-4">
               <div>
                  <div className="text-xs font-bold tracking-wider text-foreground uppercase">
                     Peta Section Arsip Kelas
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-1">
                     {FOOTER_SECTION_LINKS.map((item) => {
                        const Icon = item.icon;
                        return (
                           <button
                              key={item.id}
                              type="button"
                              onClick={() => handleScrollToSection(item.id)}
                              className="obsidian-pill flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs transition hover:border-sky-400/40">
                              <span className="flex min-w-0 items-center gap-2">
                                 <Icon className="h-3.5 w-3.5 shrink-0 text-sky-500 dark:text-sky-300" />
                                 <span className="truncate font-semibold text-foreground">
                                    {item.label}
                                 </span>
                              </span>
                              <span className="mono-tabular shrink-0 text-[10px] font-bold text-muted-foreground">
                                 #{item.code}
                              </span>
                           </button>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* Kolom Kanan (3 Kolom): Eksplorasi Cepat & Status Sistem */}
            <div className="flex flex-col justify-between gap-3 lg:col-span-3">
               <div className="flex flex-col gap-2.5">
                  <div className="text-xs font-bold tracking-wider text-foreground uppercase">
                     Eksplorasi & Utilitas
                  </div>

                  {/* Tombol Lompat ke Siswa Acak (#01 - #22) */}
                  <button
                     type="button"
                     onClick={handleJumpToRandomStudent}
                     className="obsidian-pill flex items-center justify-between gap-2 rounded-xl border-indigo-400/40 bg-indigo-500/15 px-3.5 py-2.5 text-left text-xs font-semibold text-indigo-700 transition hover:border-indigo-400 dark:text-indigo-200">
                     <span className="inline-flex items-center gap-2">
                        <Shuffle className="h-3.5 w-3.5 shrink-0" />
                        <span>Kenali Siswa Acak</span>
                     </span>
                     <span className="mono-tabular rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold">
                        {lastRandomAbsen
                           ? `#${String(lastRandomAbsen).padStart(2, "0")}`
                           : "#01–#22"}
                     </span>
                  </button>

                  {/* Trigger Command Palette & Admin Login */}
                  <div className="flex flex-wrap items-center gap-2">
                     <CommandPaletteTrigger variant="topbar" />
                     <AdminAccessButton variant="topbar" />
                  </div>
               </div>

               {/* Badge Status Backend & Kembali ke Atas */}
               <div className="obsidian-pill flex flex-col gap-2 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                     <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                        <Database className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300" />
                        <span>Penyimpanan Data</span>
                     </span>
                     <span
                        className={`mono-tabular rounded px-1.5 py-0.5 text-[9px] font-bold ${
                           supabaseConnected
                              ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                              : "bg-sky-500/20 text-sky-700 dark:text-sky-300"
                        }`}>
                        {supabaseConnected ? "SUPABASE CLOUD" : "LOCAL READY"}
                     </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-2">
                     <ThemeSwitcher variant="pill" />
                     <button
                        type="button"
                        onClick={handleScrollTop}
                        className="obsidian-pill inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-sky-600 dark:text-sky-300">
                        <ArrowUp className="h-3 w-3" />
                        <span>Ke Atas</span>
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* =================================================================
          2. BARIS TECH STACK & COPYRIGHT ANGKATAN 2026
         ================================================================= */}
         <div className="mt-6 flex flex-col justify-between gap-3 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-1.5">
               <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                  <Code2 className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300" />
                  <span>Arsitektur:</span>
               </span>
               {TECH_STACK_BADGES.map((tech) => (
                  <span
                     key={tech}
                     className="obsidian-pill mono-tabular rounded-md px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                     {tech}
                  </span>
               ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
               <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-300 shrink-0" />
               <span>Dirancang & Dikembangkan oleh</span>
               <strong className="font-bold text-foreground">
                  Keluarga Besar XII PPLG 1
               </strong>
               <Heart className="h-3.5 w-3.5 text-rose-500 shrink-0" />
               <span className="mono-tabular font-semibold text-foreground">
                  2026
               </span>
            </div>
         </div>
      </footer>
   );
}
