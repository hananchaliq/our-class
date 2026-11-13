"use client";

import * as React from "react";
import {
   ArrowUp,
   CalendarClock,
   Code2,
   FolderGit2,
   Gift,
   LayoutDashboard,
   Terminal,
   Users,
} from "lucide-react";
import { AdminAccessButton } from "../auth/admin-login-modal";
import { CommandPaletteTrigger } from "../command/command-palette";
import { ThemeSwitcher } from "../theme/theme-switcher";

export interface NavSectionItem {
   id: string;
   code: string;
   label: string;
   shortLabel: string;
   badge?: string;
   icon: React.ComponentType<{ className?: string }>;
   accent?: "cyan" | "indigo" | "amber";
}

export const CLASS_NAV_ITEMS: NavSectionItem[] = [
   {
      id: "hero-section",
      code: "01",
      label: "Bento Dashboard",
      shortLabel: "Beranda",
      badge: "LIVE",
      icon: LayoutDashboard,
      accent: "cyan",
   },
   {
      id: "lanyard-section",
      code: "02",
      label: "22 ID Card Siswa",
      shortLabel: "22 Siswa",
      badge: "22",
      icon: Users,
      accent: "indigo",
   },
   {
      id: "schedule-section",
      code: "03",
      label: "Jadwal & Piket",
      shortLabel: "Jadwal",
      badge: "6 HARI",
      icon: CalendarClock,
      accent: "cyan",
   },
   {
      id: "gallery-section",
      code: "04",
      label: "Project & Galeri",
      shortLabel: "Karya",
      badge: "PPLG",
      icon: FolderGit2,
      accent: "indigo",
   },
   {
      id: "farewell-gift-section",
      code: "05",
      label: "Kapsul Kado 3D",
      shortLabel: "Kado 3D",
      badge: "2026",
      icon: Gift,
      accent: "amber",
   },
];

const DIVISION_SUMMARY = [
   { name: "Frontend Eng.", count: "06", color: "bg-sky-400" },
   { name: "Backend & Cloud", count: "06", color: "bg-indigo-400" },
   { name: "UI/UX & Creative", count: "05", color: "bg-pink-400" },
   { name: "Game & Mobile", count: "05", color: "bg-emerald-400" },
];

interface ClassNavigationShellProps {
   children: React.ReactNode;
}

export function ClassNavigationShell({ children }: ClassNavigationShellProps) {
   const [activeSection, setActiveSection] =
      React.useState<string>("hero-section");
   const [wibTime, setWibTime] = React.useState<string>("--:--:--");
   const [scrollProgressPct, setScrollProgressPct] = React.useState<number>(0);
   const [showScrollTop, setShowScrollTop] = React.useState<boolean>(false);

   // Live Clock WIB (Asia/Jakarta)
   React.useEffect(() => {
      const updateClock = () => {
         try {
            const now = new Date();
            const formatted = new Intl.DateTimeFormat("id-ID", {
               timeZone: "Asia/Jakarta",
               hour: "2-digit",
               minute: "2-digit",
               second: "2-digit",
               hour12: false,
            }).format(now);
            setWibTime(formatted.replace(/\./g, ":"));
         } catch {
            setWibTime("12:00:00");
         }
      };

      updateClock();
      const timer = window.setInterval(updateClock, 1000);
      return () => window.clearInterval(timer);
   }, []);

   // Scroll-Spy IntersectionObserver untuk Indikator Section Aktif
   React.useEffect(() => {
      const sectionElements = CLASS_NAV_ITEMS.map((item) =>
         document.getElementById(item.id)
      ).filter((el): el is HTMLElement => el !== null);

      if (sectionElements.length === 0) return;

      const observer = new IntersectionObserver(
         (entries) => {
            const visible = entries
               .filter((entry) => entry.isIntersecting)
               .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visible.length > 0 && visible[0]?.target?.id) {
               setActiveSection(visible[0].target.id);
            }
         },
         {
            rootMargin: "-18% 0px -55% 0px",
            threshold: [0.1, 0.25, 0.5],
         }
      );

      sectionElements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
   }, []);

   // Tracker progres scroll halaman & visibilitas tombol Ke Atas di HP
   React.useEffect(() => {
      const handleScroll = () => {
         const scrollTop = window.scrollY || document.documentElement.scrollTop;
         const docHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
         const pct =
            docHeight > 0
               ? Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)))
               : 0;
         setScrollProgressPct(pct);
         setShowScrollTop(scrollTop > 480);
      };

      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   const handleNavigate = (id: string) => {
      setActiveSection(id);
      const element = document.getElementById(id);
      if (element) {
         element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
   };

   const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("hero-section");
   };

   const currentNavMeta = React.useMemo(() => {
      return (
         CLASS_NAV_ITEMS.find((item) => item.id === activeSection) ??
         CLASS_NAV_ITEMS[0]
      );
   }, [activeSection]);

   return (
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
         {/* =================================================================
          1. DESKTOP SLIM LEFT NAVIGATION RAIL (TERINSPIRASI REFERENSI BENTO)
         ================================================================= */}
         <aside
            aria-label="Navigasi Utama Kelas"
            className="hidden lg:fixed lg:inset-y-4 lg:left-4 lg:z-40 lg:flex lg:w-60 lg:flex-col">
            <div className="obsidian-surface flex h-full flex-col justify-between p-4">
               {/* Bagian Atas: Identitas Kelas, Jam WIB & Tombol Ctrl+K */}
               <div className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
                     <a
                        href="#hero-section"
                        onClick={(e) => {
                           e.preventDefault();
                           handleNavigate("hero-section");
                        }}
                        className="group flex items-center gap-2.5 focus-visible:outline-none">
                        <span className="obsidian-pill flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-sky-400/35 bg-sky-500/15 text-sky-600 dark:text-sky-300 glow-cyan">
                           <Terminal className="h-4 w-4" />
                        </span>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold tracking-tight text-foreground whitespace-nowrap">
                              XII PPLG 1
                           </span>
                           <span className="mono-tabular text-[11px] text-muted-foreground whitespace-nowrap">
                              BATCH 2026 · 22 DEV
                           </span>
                        </div>
                     </a>
                  </div>

                  {/* Indikator Jam Real-time WIB */}
                  <div className="obsidian-pill flex items-center justify-between rounded-xl px-3 py-2">
                     <span className="text-[11px] font-medium text-muted-foreground">
                        WIB Live
                     </span>
                     <span className="mono-tabular text-xs font-semibold tracking-wider text-sky-600 dark:text-sky-300">
                        {wibTime}
                     </span>
                  </div>

                  {/* Quick Command Palette Trigger (Ctrl + K) */}
                  <CommandPaletteTrigger variant="rail" />

                  {/* Daftar Menu Navigasi Utama */}
                  <nav
                     aria-label="Menu Section Kelas"
                     className="flex flex-col gap-1">
                     <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Navigasi Arsip
                     </div>
                     {CLASS_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        const isFarewell = item.accent === "amber";

                        return (
                           <button
                              key={item.id}
                              type="button"
                              onClick={() => handleNavigate(item.id)}
                              aria-current={isActive ? "location" : undefined}
                              className={`group relative flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                                 isActive
                                    ? isFarewell
                                       ? "obsidian-pill border-amber-400/40 bg-amber-500/15 text-amber-700 dark:text-amber-200 glow-amber"
                                       : "obsidian-pill border-sky-400/40 bg-sky-500/15 text-sky-700 dark:text-sky-200 glow-cyan"
                                    : "text-muted-foreground hover:bg-[var(--color-surface-hover)] hover:text-foreground"
                              }`}>
                              <span className="flex items-center gap-2.5 min-w-0">
                                 <Icon
                                    className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                                       isActive
                                          ? isFarewell
                                             ? "text-amber-500 dark:text-amber-300"
                                             : "text-sky-500 dark:text-sky-300"
                                          : "text-muted-foreground group-hover:text-foreground"
                                    }`}
                                 />
                                 <span className="truncate">{item.label}</span>
                              </span>

                              {item.badge && (
                                 <span
                                    className={`mono-tabular shrink-0 text-[10px] font-semibold ${
                                       isActive
                                          ? isFarewell
                                             ? "text-amber-600 dark:text-amber-300"
                                             : "text-sky-600 dark:text-sky-300"
                                          : "text-muted-foreground/75"
                                    }`}>
                                    {item.badge}
                                 </span>
                              )}
                           </button>
                        );
                     })}
                  </nav>

                  {/* Ringkasan Divisi Teknis */}
                  <div className="border-t border-[var(--color-border)] pt-3">
                     <div className="flex items-center justify-between px-2 pb-1.5">
                        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                           4 Divisi Teknis
                        </span>
                        <span className="mono-tabular text-[10px] font-semibold text-foreground">
                           22 Siswa
                        </span>
                     </div>
                     <div className="flex flex-col gap-1 px-1">
                        {DIVISION_SUMMARY.map((div) => (
                           <div
                              key={div.name}
                              className="flex items-center justify-between rounded-lg px-2 py-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-2 truncate">
                                 <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${div.color}`}
                                 />
                                 <span className="truncate text-[11px]">
                                    {div.name}
                                 </span>
                              </span>
                              <span className="mono-tabular text-[11px] font-medium text-foreground">
                                 {div.count}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Bagian Bawah: Pengatur Tema & Tombol Khusus Admin Login */}
               <div className="flex flex-col gap-2.5 border-t border-[var(--color-border)] pt-3">
                  <div className="flex items-center justify-between gap-2 px-1">
                     <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <Code2 className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                        <span>Mode Tampilan</span>
                     </span>
                     <ThemeSwitcher variant="icon" />
                  </div>

                  {/* Tombol Khusus Admin Login / Admin Active di Sudut Bawah Left Rail */}
                  <AdminAccessButton variant="rail" />
               </div>
            </div>
         </aside>

         {/* =================================================================
          2. MOBILE COMPACT TOP BAR (< 1024px, OPTIMASI LAYAR 360px - 430px)
         ================================================================= */}
         <header className="sticky top-0 z-30 flex flex-col border-b border-[var(--color-border)] bg-[var(--color-card)] backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between gap-1.5 px-3 py-2 sm:px-4">
               <a
                  href="#hero-section"
                  onClick={(e) => {
                     e.preventDefault();
                     handleNavigate("hero-section");
                  }}
                  className="flex items-center gap-2 min-w-0">
                  <span className="obsidian-pill flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-sky-400/35 bg-sky-500/15 text-sky-600 dark:text-sky-300">
                     <Terminal className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col min-w-0">
                     <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold tracking-tight text-foreground whitespace-nowrap">
                           XII PPLG 1
                        </span>
                        <span className="mono-tabular rounded bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-bold text-sky-600 dark:text-sky-300">
                           SEC {currentNavMeta.code}
                        </span>
                     </div>
                     <span className="mono-tabular truncate text-[10px] text-muted-foreground">
                        {wibTime} WIB · {currentNavMeta.shortLabel}
                     </span>
                  </div>
               </a>

               <div className="flex items-center gap-1 shrink-0">
                  <CommandPaletteTrigger variant="mobile" />
                  <AdminAccessButton variant="mobile" />
                  <ThemeSwitcher variant="icon" className="h-8 w-8 rounded-lg" />
               </div>
            </div>

            {/* Indikator Progres Baca Halaman Mobile (Tipis & Presisi) */}
            <div className="h-[2px] w-full overflow-hidden bg-transparent">
               <div
                  style={{ width: `${scrollProgressPct}%` }}
                  className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400 transition-all duration-150"
               />
            </div>
         </header>

         {/* =================================================================
          3. MAIN CONTENT AREA (DENGAN SAFE-AREA DOCK DI HP & OFFSET RAIL DI DESKTOP)
         ================================================================= */}
         <div className="pb-safe-dock flex-1 lg:pb-12 lg:pl-[264px]">
            {children}
         </div>

         {/* =================================================================
          4. TOMBOL MELAYANG "KE ATAS" DI MOBILE SAAT SCROLL JAUH KE BAWAH
         ================================================================= */}
         {showScrollTop && (
            <button
               type="button"
               onClick={handleScrollToTop}
               aria-label="Kembali ke bagian atas halaman"
               className="obsidian-pill fixed right-3.5 bottom-[5.25rem] z-40 inline-flex items-center gap-1.5 rounded-full border-sky-400/45 px-3 py-2 text-[11px] font-bold text-sky-600 shadow-lg transition hover:border-sky-400 dark:text-sky-300 lg:right-6 lg:bottom-6">
               <ArrowUp className="h-3.5 w-3.5" />
               <span className="mono-tabular">{scrollProgressPct}%</span>
            </button>
         )}

         {/* =================================================================
          5. MOBILE BOTTOM FLOATING DOCK (< 1024px, ERGONOMIS & <= 15% VIEWPORT)
         ================================================================= */}
         <nav
            aria-label="Navigasi Bawah Mobile"
            className="fixed inset-x-2.5 bottom-2.5 z-40 sm:inset-x-4 lg:hidden">
            <div className="obsidian-surface mx-auto flex max-w-md items-center justify-around gap-1 rounded-2xl p-1.5 shadow-2xl">
               {CLASS_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  const isFarewell = item.accent === "amber";

                  return (
                     <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigate(item.id)}
                        aria-current={isActive ? "location" : undefined}
                        className={`flex min-h-[46px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition-all duration-200 whitespace-nowrap ${
                           isActive
                              ? isFarewell
                                 ? "obsidian-pill border-amber-400/40 bg-amber-500/15 text-amber-700 dark:text-amber-200 glow-amber"
                                 : "obsidian-pill border-sky-400/40 bg-sky-500/15 text-sky-700 dark:text-sky-200 glow-cyan"
                              : "text-muted-foreground hover:text-foreground"
                        }`}>
                        <Icon
                           className={`h-4 w-4 shrink-0 ${
                              isActive
                                 ? isFarewell
                                    ? "text-amber-500 dark:text-amber-300"
                                    : "text-sky-500 dark:text-sky-300"
                                 : "text-muted-foreground"
                           }`}
                        />
                        <span className="max-w-[60px] truncate leading-none">
                           {item.shortLabel}
                        </span>
                     </button>
                  );
               })}
            </div>
         </nav>
      </div>
   );
}
