"use client";

import * as React from "react";
import {
   ArrowRight,
   CalendarClock,
   CornerDownLeft,
   FolderGit2,
   Gift,
   KeyRound,
   Moon,
   Search,
   Sun,
   Users,
   X,
} from "lucide-react";
import { INITIAL_PPLG1_STUDENTS } from "../../types/class-system";
import { useClassAuth } from "../auth/class-auth-provider";
import { useTheme } from "../theme/theme-provider";

export type CommandCategory =
   | "all"
   | "student"
   | "schedule"
   | "project"
   | "action";

export interface CommandItem {
   id: string;
   category: Exclude<CommandCategory, "all">;
   code: string;
   title: string;
   subtitle: string;
   keywords: string;
   badge: string;
   targetSection?: string;
   studentAbsen?: number;
   studentId?: string;
   actionType?: "toggle-theme" | "open-admin" | "jump-section";
}

interface CommandPaletteContextValue {
   isOpen: boolean;
   openPalette: (initialQuery?: string) => void;
   closePalette: () => void;
   togglePalette: () => void;
}

const CommandPaletteContext = React.createContext<
   CommandPaletteContextValue | undefined
>(undefined);

const QUICK_SCHEDULE_ENTRIES: CommandItem[] = [
   {
      id: "sched-senin",
      category: "schedule",
      code: "SEN",
      title: "Jadwal Senin — Pemrograman Web & Basis Data",
      subtitle: "Produktif PPLG · Piket Absen #01–#04",
      keywords: "senin web nextjs postgresql piket jadwal mapel",
      badge: "JADWAL",
      targetSection: "schedule-section",
   },
   {
      id: "sched-selasa",
      category: "schedule",
      code: "SEL",
      title: "Jadwal Selasa — Mobile Flutter & Rekayasa Gim",
      subtitle: "Praktik Lab PPLG · Piket Absen #05–#08",
      keywords: "selasa mobile flutter dart unity gim piket jadwal",
      badge: "JADWAL",
      targetSection: "schedule-section",
   },
   {
      id: "sched-rabu",
      category: "schedule",
      code: "RAB",
      title: "Jadwal Rabu — Arsitektur Backend, Cloud & DevOps",
      subtitle: "Lab Server & Deployment · Piket Absen #09–#12",
      keywords: "rabu backend cloud docker devops laravel piket jadwal",
      badge: "JADWAL",
      targetSection: "schedule-section",
   },
   {
      id: "sched-kamis",
      category: "schedule",
      code: "KAM",
      title: "Jadwal Kamis — UI/UX Design System & Kreatif",
      subtitle: "Studio Desain & Prototyping · Piket Absen #13–#16",
      keywords: "kamis ui ux figma design system piket jadwal",
      badge: "JADWAL",
      targetSection: "schedule-section",
   },
   {
      id: "sched-jumat",
      category: "schedule",
      code: "JUM",
      title: "Jadwal Jumat — Proyek Akhir UKK & Code Review",
      subtitle: "Evaluasi Sprint Mingguan · Piket Absen #17–#19",
      keywords: "jumat ukk proyek akhir review piket jadwal",
      badge: "JADWAL",
      targetSection: "schedule-section",
   },
   {
      id: "sched-sabtu",
      category: "schedule",
      code: "SAB",
      title: "Jadwal Sabtu — Dokumentasi Portofolio & Ekstrakurikuler",
      subtitle: "Persiapan Kelulusan 2026 · Piket Absen #20–#22",
      keywords: "sabtu portofolio kelulusan piket jadwal",
      badge: "JADWAL",
      targetSection: "schedule-section",
   },
];

const QUICK_PROJECT_ENTRIES: CommandItem[] = [
   {
      id: "proj-archive-3d",
      category: "project",
      code: "PRJ-01",
      title: "XII PPLG 1 — 3D Digital Archive & Lanyard Showcase",
      subtitle: "Next.js App Router · Tailwind v4 · Supabase · True CSS 3D",
      keywords: "project web arsip kelas lanyard 3d nextjs supabase",
      badge: "PROJECT",
      targetSection: "gallery-section",
   },
   {
      id: "proj-erp-school",
      category: "project",
      code: "PRJ-02",
      title: "Sistem Akademik & Presensi QR Terpadu",
      subtitle: "Divisi Backend & Cloud · PostgreSQL · Go · Docker",
      keywords: "project backend presensi qr postgresql go docker",
      badge: "PROJECT",
      targetSection: "gallery-section",
   },
   {
      id: "proj-nusantara-rpg",
      category: "project",
      code: "PRJ-03",
      title: "Nusantara Chrono 3D — Action Adventure Game",
      subtitle: "Divisi Game & Mobile · Unity 3D · C# · Blender Shader",
      keywords: "project game unity blender c# 3d nusantara",
      badge: "PROJECT",
      targetSection: "gallery-section",
   },
   {
      id: "proj-obsidian-ui",
      category: "project",
      code: "PRJ-04",
      title: "Obsidian Swiss-Grid Component Kit",
      subtitle: "Divisi UI/UX & Creative · Figma Tokens · Motion",
      keywords: "project ui ux figma design system swiss grid",
      badge: "PROJECT",
      targetSection: "gallery-section",
   },
];

export function CommandPaletteProvider({
   children,
}: {
   children: React.ReactNode;
}) {
   const [isOpen, setIsOpen] = React.useState(false);
   const [initialQuery, setInitialQuery] = React.useState("");

   const openPalette = React.useCallback((query = "") => {
      setInitialQuery(query);
      setIsOpen(true);
   }, []);

   const closePalette = React.useCallback(() => {
      setIsOpen(false);
   }, []);

   const togglePalette = React.useCallback(() => {
      setIsOpen((prev) => !prev);
   }, []);

   // Global Shortcut Ctrl + K / Cmd + K
   React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, []);

   const value = React.useMemo(
      () => ({
         isOpen,
         openPalette,
         closePalette,
         togglePalette,
      }),
      [isOpen, openPalette, closePalette, togglePalette]
   );

   return (
      <CommandPaletteContext.Provider value={value}>
         {children}
         <CommandPaletteModal initialSeedQuery={initialQuery} />
      </CommandPaletteContext.Provider>
   );
}

export function useCommandPalette(): CommandPaletteContextValue {
   const context = React.useContext(CommandPaletteContext);
   if (!context) {
      throw new Error(
         "useCommandPalette harus digunakan di dalam CommandPaletteProvider"
      );
   }
   return context;
}

interface CommandPaletteTriggerProps {
   variant?: "topbar" | "rail" | "mobile";
   className?: string;
}

export function CommandPaletteTrigger({
   variant = "topbar",
   className = "",
}: CommandPaletteTriggerProps) {
   const { openPalette } = useCommandPalette();

   if (variant === "mobile") {
      return (
         <button
            type="button"
            onClick={() => openPalette()}
            aria-label="Cari siswa, jadwal, atau project (Ctrl + K)"
            className={`obsidian-pill inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground hover:border-sky-400/45 ${className}`}>
            <Search className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300" />
         </button>
      );
   }

   if (variant === "rail") {
      return (
         <button
            type="button"
            onClick={() => openPalette()}
            className={`obsidian-pill group flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs text-muted-foreground transition hover:border-sky-400/45 hover:text-foreground ${className}`}>
            <span className="flex items-center gap-2 min-w-0">
               <Search className="h-3.5 w-3.5 shrink-0 text-sky-500 dark:text-sky-300" />
               <span className="truncate">Cari siswa / jadwal...</span>
            </span>
            <kbd className="mono-tabular shrink-0 rounded border border-[var(--color-border)] bg-[var(--color-muted)]/60 px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
               Ctrl K
            </kbd>
         </button>
      );
   }

   // Default: "topbar"
   return (
      <button
         type="button"
         onClick={() => openPalette()}
         className={`obsidian-pill group inline-flex items-center justify-between gap-4 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground transition hover:border-sky-400/45 hover:text-foreground ${className}`}>
         <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <Search className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300" />
            <span>Cari 22 siswa, absen, jadwal...</span>
         </span>
         <kbd className="mono-tabular rounded-md border border-[var(--color-border)] bg-[var(--color-muted)]/60 px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
            Ctrl + K
         </kbd>
      </button>
   );
}

function CommandPaletteModal({
   initialSeedQuery = "",
}: {
   initialSeedQuery?: string;
}) {
   const { isOpen, closePalette } = useCommandPalette();
   const { theme, toggleTheme } = useTheme();
   const { isAdmin, openLoginModal } = useClassAuth();

   const [query, setQuery] = React.useState(initialSeedQuery);
   const [category, setCategory] = React.useState<CommandCategory>("all");
   const [activeIndex, setActiveIndex] = React.useState(0);
   const inputRef = React.useRef<HTMLInputElement | null>(null);

   React.useEffect(() => {
      if (isOpen) {
         setQuery(initialSeedQuery);
         setActiveIndex(0);
         const timer = window.setTimeout(() => {
            inputRef.current?.focus();
         }, 30);
         return () => window.clearTimeout(timer);
      }
   }, [isOpen, initialSeedQuery]);

   // Bangun daftar seluruh item pencarian (22 Siswa + Jadwal + Project + Aksi Cepat)
   const allItems = React.useMemo<CommandItem[]>(() => {
      const studentItems: CommandItem[] = INITIAL_PPLG1_STUDENTS.map((s) => {
         const absenStr = String(s.absen).padStart(2, "0");
         return {
            id: `student-${s.id}`,
            category: "student",
            code: `#${absenStr}`,
            title: `${s.name} — ${s.role}`,
            subtitle: `Divisi ${s.division} · ${(s.tags ?? []).join(" · ")}`,
            keywords: `${s.name} ${absenStr} ${s.absen} ${s.role} ${s.division} ${(
               s.tags ?? []
            ).join(" ")} ${s.bio ?? ""}`.toLowerCase(),
            badge: s.division.toUpperCase(),
            targetSection: "lanyard-section",
            studentAbsen: s.absen,
            studentId: s.id,
         };
      });

      const actionItems: CommandItem[] = [
         {
            id: "act-farewell-box",
            category: "action",
            code: "3D",
            title: "Buka Kado Perpisahan 3D & Kapsul Memori 2026",
            subtitle: "Lompat langsung ke panggung Kado 3D, Vinyl & Kubus Memori",
            keywords: "kado perpisahan 3d gift box kelulusan surat quotes",
            badge: "KAPSUL 2026",
            targetSection: "farewell-gift-section",
            actionType: "jump-section",
         },
         {
            id: "act-lanyard-22",
            category: "action",
            code: "22",
            title: "Lihat Rel 22 ID Card 3D Siswa XII PPLG 1",
            subtitle: "Tarik, ayunkan, dan balik kartu identitas 22 developer",
            keywords: "lanyard id card 22 siswa rel 3d",
            badge: "SECTION 02",
            targetSection: "lanyard-section",
            actionType: "jump-section",
         },
         {
            id: "act-toggle-theme",
            category: "action",
            code: "UI",
            title:
               theme === "dark"
                  ? "Beralih ke Tema Daylight Glass (Light Mode)"
                  : "Beralih ke Tema Obsidian Dark (Dark Mode)",
            subtitle: "Ubah suasana antarmuka dengan transisi kaca halus",
            keywords: "tema dark light mode gelap terang obsidian daylight",
            badge: "TEMA",
            actionType: "toggle-theme",
         },
         {
            id: "act-admin-auth",
            category: "action",
            code: "AUTH",
            title: isAdmin
               ? "Kelola Sesi Admin Active (1 Akun Kelas Bersama)"
               : "Login Admin Kelas Bersama (Buka Akses CRUD)",
            subtitle: "Autentikasi 1 akun bersama untuk edit siswa, jadwal & kado",
            keywords: "admin login auth akun kelas bersama crud edit",
            badge: isAdmin ? "ACTIVE" : "LOGIN",
            actionType: "open-admin",
         },
      ];

      return [
         ...actionItems,
         ...studentItems,
         ...QUICK_SCHEDULE_ENTRIES,
         ...QUICK_PROJECT_ENTRIES,
      ];
   }, [theme, isAdmin]);

   const filteredItems = React.useMemo(() => {
      const q = query.trim().toLowerCase();
      return allItems.filter((item) => {
         if (category !== "all" && item.category !== category) return false;
         if (!q) return true;
         return (
            item.title.toLowerCase().includes(q) ||
            item.subtitle.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q) ||
            item.keywords.includes(q)
         );
      });
   }, [allItems, query, category]);

   React.useEffect(() => {
      setActiveIndex(0);
   }, [query, category]);

   const executeCommand = React.useCallback(
      (item: CommandItem) => {
         closePalette();

         if (item.actionType === "toggle-theme") {
            toggleTheme();
            return;
         }

         if (item.actionType === "open-admin") {
            openLoginModal();
            return;
         }

         if (item.targetSection) {
            const el = document.getElementById(item.targetSection);
            if (el) {
               el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
         }

         if (item.studentAbsen !== undefined && item.studentId) {
            window.dispatchEvent(
               new CustomEvent("pplg1:select-student", {
                  detail: {
                     absen: item.studentAbsen,
                     studentId: item.studentId,
                  },
               })
            );
         }
      },
      [closePalette, toggleTheme, openLoginModal]
   );

   React.useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            e.preventDefault();
            closePalette();
         } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) =>
               filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0
            );
         } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) =>
               filteredItems.length > 0
                  ? (prev - 1 + filteredItems.length) % filteredItems.length
                  : 0
            );
         } else if (e.key === "Enter" && filteredItems[activeIndex]) {
            e.preventDefault();
            executeCommand(filteredItems[activeIndex]);
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isOpen, filteredItems, activeIndex, closePalette, executeCommand]);

   if (!isOpen) return null;

   const renderCategoryIcon = (item: CommandItem) => {
      if (item.category === "student") {
         return <Users className="h-4 w-4 text-sky-500 dark:text-sky-300" />;
      }
      if (item.category === "schedule") {
         return <CalendarClock className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />;
      }
      if (item.category === "project") {
         return <FolderGit2 className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />;
      }
      if (item.actionType === "toggle-theme") {
         return theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-500" />
         ) : (
            <Moon className="h-4 w-4 text-sky-400" />
         );
      }
      if (item.actionType === "open-admin") {
         return <KeyRound className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />;
      }
      return <Gift className="h-4 w-4 text-amber-500 dark:text-amber-300" />;
   };

   return (
      <div
         role="dialog"
         aria-modal="true"
         aria-label="Command Palette & Pencarian Cepat XII PPLG 1"
         className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-14 sm:pt-20">
         {/* Backdrop */}
         <div
            onClick={closePalette}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
         />

         {/* Panel Utama Command Palette (Flat Surface Glassmorphism) */}
         <div className="obsidian-surface relative z-10 flex w-full max-w-2xl flex-col overflow-hidden shadow-2xl">
            {/* Input Bar Pencarian */}
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3.5">
               <Search className="h-4 w-4 shrink-0 text-sky-500 dark:text-sky-300" />
               <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ketik nama siswa, nomor absen (#01-#22), mapel, project, atau 'kado'..."
                  className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
               />
               {query && (
                  <button
                     type="button"
                     onClick={() => setQuery("")}
                     className="obsidian-pill rounded-md px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground">
                     Reset
                  </button>
               )}
               <button
                  type="button"
                  onClick={closePalette}
                  aria-label="Tutup pencarian"
                  className="obsidian-pill inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
               </button>
            </div>

            {/* Filter Tab Kategori */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-2">
               <div className="flex flex-wrap items-center gap-1">
                  {(
                     [
                        { key: "all", label: "Semua" },
                        { key: "student", label: "22 Siswa" },
                        { key: "schedule", label: "Jadwal & Piket" },
                        { key: "project", label: "Project PPLG" },
                        { key: "action", label: "Aksi Cepat" },
                     ] as const
                  ).map((tab) => {
                     const active = category === tab.key;
                     return (
                        <button
                           key={tab.key}
                           type="button"
                           onClick={() => setCategory(tab.key)}
                           className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition whitespace-nowrap ${
                              active
                                 ? "bg-sky-500/20 text-sky-700 dark:text-sky-200 border border-sky-400/35"
                                 : "text-muted-foreground hover:text-foreground border border-transparent"
                           }`}>
                           {tab.label}
                        </button>
                     );
                  })}
               </div>

               <span className="mono-tabular text-[11px] text-muted-foreground">
                  {filteredItems.length} Hasil
               </span>
            </div>

            {/* Daftar Hasil Pencarian */}
            <div className="max-h-[360px] overflow-y-auto p-2">
               {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                     <p className="text-xs font-semibold text-foreground">
                        Tidak ditemukan hasil untuk &ldquo;{query}&rdquo;
                     </p>
                     <p className="mt-1 text-[11px] text-muted-foreground">
                        Coba cari nomor absen (#01 s/d #22), nama siswa, divisi Frontend/Backend, atau jadwal hari.
                     </p>
                  </div>
               ) : (
                  <div className="flex flex-col gap-1">
                     {filteredItems.map((item, idx) => {
                        const isSelected = idx === activeIndex;
                        return (
                           <button
                              key={item.id}
                              type="button"
                              onClick={() => executeCommand(item)}
                              onMouseEnter={() => setActiveIndex(idx)}
                              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                                 isSelected
                                    ? "obsidian-pill border-sky-400/45 bg-sky-500/15"
                                    : "hover:bg-[var(--color-surface-hover)]"
                              }`}>
                              <div className="flex items-center gap-3 min-w-0">
                                 <span className="obsidian-pill flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                                    {renderCategoryIcon(item)}
                                 </span>

                                 <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                       <span className="mono-tabular text-[11px] font-bold text-sky-600 dark:text-sky-300 shrink-0">
                                          {item.code}
                                       </span>
                                       <span className="truncate text-xs font-semibold text-foreground">
                                          {item.title}
                                       </span>
                                    </div>
                                    <div className="truncate text-[11px] text-muted-foreground">
                                       {item.subtitle}
                                    </div>
                                 </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                 <span className="mono-tabular hidden sm:inline-block rounded-md border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                    {item.badge}
                                 </span>
                                 <ArrowRight
                                    className={`h-3.5 w-3.5 transition-transform ${
                                       isSelected
                                          ? "translate-x-0.5 text-sky-500 dark:text-sky-300"
                                          : "text-muted-foreground/50"
                                    }`}
                                 />
                              </div>
                           </button>
                        );
                     })}
                  </div>
               )}
            </div>

            {/* Footer Petunjuk Keyboard */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] bg-[var(--color-muted)]/30 px-4 py-2 text-[11px] text-muted-foreground">
               <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                     <CornerDownLeft className="h-3 w-3 text-sky-500 dark:text-sky-300" />
                     <span>Enter untuk pilih</span>
                  </span>
                  <span>·</span>
                  <span>Panah Atas/Bawah untuk navigasi</span>
               </div>
               <span className="mono-tabular font-semibold">ESC untuk tutup</span>
            </div>
         </div>
      </div>
   );
}
