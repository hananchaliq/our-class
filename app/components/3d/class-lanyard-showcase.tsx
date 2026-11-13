"use client";

import * as React from "react";
import {
   ExternalLink,
   Layers,
   RotateCw,
   Search,
   Sparkles,
   Users,
} from "lucide-react";
import { TeamLanyardRail } from "./team-lanyard-rail";
import {
   INITIAL_PPLG1_STUDENTS,
   type ClassStudent,
} from "@/app/types/class-system";

export interface ClassLanyardShowcaseProps {
   students?: ClassStudent[];
   className?: string;
   onEditStudent?: (student: ClassStudent) => void;
}

type FilterMode =
   | "batch-1"
   | "batch-2"
   | "batch-3"
   | "Frontend"
   | "Backend"
   | "UI/UX & Creative"
   | "Game & Mobile"
   | "all";

const FILTER_TABS: { id: FilterMode; label: string; badge: string }[] = [
   { id: "batch-1", label: "Rel 1 (Absen 01–08)", badge: "08" },
   { id: "batch-2", label: "Rel 2 (Absen 09–15)", badge: "07" },
   { id: "batch-3", label: "Rel 3 (Absen 16–22)", badge: "07" },
   { id: "Frontend", label: "Frontend", badge: "06" },
   { id: "Backend", label: "Backend", badge: "06" },
   { id: "UI/UX & Creative", label: "UI/UX", badge: "05" },
   { id: "Game & Mobile", label: "Game & Mobile", badge: "05" },
   { id: "all", label: "Semua Siswa (Carousel)", badge: "22" },
];

function resolveBatchForAbsen(absen: number): FilterMode {
   if (absen >= 1 && absen <= 8) return "batch-1";
   if (absen >= 9 && absen <= 15) return "batch-2";
   return "batch-3";
}

export function ClassLanyardShowcase({
   students = INITIAL_PPLG1_STUDENTS,
   className = "",
   onEditStudent,
}: ClassLanyardShowcaseProps) {
   const [filter, setFilter] = React.useState<FilterMode>("batch-1");
   const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
   const [flippedIdx, setFlippedIdx] = React.useState<number | null>(null);
   const [showAbsenGrid, setShowAbsenGrid] = React.useState<boolean>(true);

   const filteredStudents = React.useMemo(() => {
      switch (filter) {
         case "batch-1":
            return students.filter(
               (s: ClassStudent) => s.absen >= 1 && s.absen <= 8
            );
         case "batch-2":
            return students.filter(
               (s: ClassStudent) => s.absen >= 9 && s.absen <= 15
            );
         case "batch-3":
            return students.filter(
               (s: ClassStudent) => s.absen >= 16 && s.absen <= 22
            );
         case "Frontend":
         case "Backend":
         case "UI/UX & Creative":
         case "Game & Mobile":
            return students.filter((s: ClassStudent) => s.division === filter);
         case "all":
         default:
            return students;
      }
   }, [students, filter]);

   const activeStudent = React.useMemo(() => {
      if (activeIdx === null) return null;
      return filteredStudents[activeIdx] ?? null;
   }, [filteredStudents, activeIdx]);

   const handleFilterChange = (nextFilter: FilterMode) => {
      setActiveIdx(null);
      setFlippedIdx(null);
      setFilter(nextFilter);
   };

   // Lompat cepat ke nomor absen tertentu (01 - 22)
   const handleJumpToAbsen = React.useCallback(
      (targetAbsen: number) => {
         const existingIdxInCurrent = filteredStudents.findIndex(
            (s) => s.absen === targetAbsen
         );

         if (existingIdxInCurrent !== -1) {
            setActiveIdx(existingIdxInCurrent);
            setFlippedIdx(null);
            return;
         }

         const targetBatch = resolveBatchForAbsen(targetAbsen);
         const nextList = students.filter((s) => {
            if (targetBatch === "batch-1") return s.absen >= 1 && s.absen <= 8;
            if (targetBatch === "batch-2") return s.absen >= 9 && s.absen <= 15;
            return s.absen >= 16 && s.absen <= 22;
         });

         const nextIdx = nextList.findIndex((s) => s.absen === targetAbsen);
         setFilter(targetBatch);
         setFlippedIdx(null);
         setActiveIdx(nextIdx !== -1 ? nextIdx : null);
      },
      [filteredStudents, students]
   );

   // Dengarkan event pencarian dari Command Palette (Ctrl + K)
   React.useEffect(() => {
      const handleSelectStudentEvent = (event: Event) => {
         const custom = event as CustomEvent<{
            absen?: number;
            studentId?: string;
         }>;
         if (custom.detail?.absen) {
            handleJumpToAbsen(custom.detail.absen);
         }
      };

      window.addEventListener("pplg1:select-student", handleSelectStudentEvent);
      return () =>
         window.removeEventListener(
            "pplg1:select-student",
            handleSelectStudentEvent
         );
   }, [handleJumpToAbsen]);

   return (
      <div className={`w-full flex flex-col gap-4 ${className}`}>
         {/* =================================================================
          1. PANEL KONTROL HEADER SECTION 02 (DIVISI, BATCH & NOMOR ABSEN 01-22)
         ================================================================= */}
         <div className="obsidian-surface flex flex-col gap-4 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
               <div>
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-300">
                     <Users className="h-3.5 w-3.5 shrink-0" />
                     <span className="mono-tabular tracking-widest uppercase">
                        SECTION 02 · DIREKTORI INTERAKTIF 22 ID CARD 3D
                     </span>
                  </div>
                  <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                     Rel Lanyard Fisika 3D — XII PPLG 1
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                     Pilih rel absen, filter berdasarkan 4 divisi teknis, atau klik nomor absen{" "}
                     <span className="mono-tabular font-semibold text-foreground">
                        01–22
                     </span>{" "}
                     untuk menyorot dan membalik ID Card 3D siswa.
                  </p>
               </div>

               <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                  <button
                     type="button"
                     onClick={() => setShowAbsenGrid((prev) => !prev)}
                     className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground transition hover:border-sky-400/45 whitespace-nowrap">
                     <Layers className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300" />
                     <span>{showAbsenGrid ? "Sembunyikan Absen" : "Pilih Absen 01–22"}</span>
                  </button>

                  <button
                     type="button"
                     onClick={() =>
                        window.dispatchEvent(
                           new KeyboardEvent("keydown", {
                              key: "k",
                              ctrlKey: true,
                           })
                        )
                     }
                     className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-sky-400/45 hover:text-foreground whitespace-nowrap">
                     <Search className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-300" />
                     <span>Cari Siswa</span>
                     <kbd className="mono-tabular rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-foreground">
                        Ctrl K
                     </kbd>
                  </button>
               </div>
            </div>

            {/* Filter Tab Rel & Divisi (Adaptif Dark & Light Mode) */}
            <div
               role="group"
               aria-label="Filter Rel dan Divisi Siswa"
               className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-4">
               {FILTER_TABS.map((tab) => {
                  const isSelected = filter === tab.id;
                  return (
                     <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleFilterChange(tab.id)}
                        aria-pressed={isSelected}
                        className={`obsidian-pill inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                           isSelected
                              ? "border-sky-400/50 bg-sky-500/15 text-sky-700 dark:text-sky-200 glow-cyan"
                              : "text-muted-foreground hover:border-sky-400/30 hover:text-foreground"
                        }`}>
                        <span>{tab.label}</span>
                        <span
                           className={`mono-tabular rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              isSelected
                                 ? "bg-sky-500/25 text-sky-700 dark:text-sky-200"
                                 : "bg-[var(--color-muted)] text-muted-foreground"
                           }`}>
                           {tab.badge}
                        </span>
                     </button>
                  );
               })}
            </div>

            {/* Navigasi Cepat Nomor Absen 01 - 22 (Tabular Nums) */}
            {showAbsenGrid && (
               <div className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-3.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                     <span className="font-medium">
                        Lompat Cepat Nomor Absen (Klik angka untuk fokus kartu 3D):
                     </span>
                     <span className="mono-tabular font-semibold text-foreground">
                        {filteredStudents.length} Kartu di Rel Aktif
                     </span>
                  </div>

                  <div
                     role="group"
                     aria-label="Pilih nomor absen 01 sampai 22"
                     className="grid grid-cols-11 gap-1.5 sm:grid-cols-11 md:grid-cols-22">
                     {students.map((student) => {
                        const absenCode = String(student.absen).padStart(2, "0");
                        const isCurrentlyFocused =
                           activeStudent?.absen === student.absen;
                        const isInCurrentRail = filteredStudents.some(
                           (s) => s.absen === student.absen
                        );

                        return (
                           <button
                              key={student.id}
                              type="button"
                              onClick={() => handleJumpToAbsen(student.absen)}
                              title={`#${absenCode} — ${student.name} (${student.division})`}
                              aria-label={`Pilih absen ${absenCode} ${student.name}`}
                              className={`mono-tabular flex h-8 items-center justify-center rounded-lg border text-[11px] font-bold transition-all duration-150 ${
                                 isCurrentlyFocused
                                    ? "border-sky-400 bg-sky-500/25 text-sky-700 dark:text-sky-200 glow-cyan scale-105"
                                    : isInCurrentRail
                                      ? "border-[var(--color-border)] bg-[var(--color-card-solid)]/80 text-foreground hover:border-sky-400/50"
                                      : "border-transparent bg-[var(--color-muted)]/40 text-muted-foreground/70 hover:border-[var(--color-border)] hover:text-foreground"
                              }`}>
                              {absenCode}
                           </button>
                        );
                     })}
                  </div>
               </div>
            )}

            {/* Inspector Bar Siswa Aktif (Muncul Saat Kartu Dipilih) */}
            {activeStudent && (
               <div className="obsidian-pill flex flex-col justify-between gap-3 rounded-xl border-sky-400/40 bg-sky-500/10 p-3.5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3 min-w-0">
                     <span className="mono-tabular flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-400/40 bg-sky-500/20 text-xs font-bold text-sky-700 dark:text-sky-200">
                        #{String(activeStudent.absen).padStart(2, "0")}
                     </span>
                     <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                           <span className="truncate text-xs sm:text-sm font-bold text-foreground">
                              {activeStudent.name}
                           </span>
                           <span aria-hidden="true" className="text-muted-foreground">
                              ·
                           </span>
                           <span className="text-xs font-medium text-sky-600 dark:text-sky-300">
                              {activeStudent.role}
                           </span>
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">
                           Divisi {activeStudent.division} ·{" "}
                           {(activeStudent.tags ?? []).join(" · ")}
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                     <button
                        type="button"
                        onClick={() =>
                           setFlippedIdx((prev) =>
                              prev === activeIdx ? null : activeIdx
                           )
                        }
                        className="obsidian-pill inline-flex items-center gap-1.5 rounded-lg border-sky-400/45 bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-200 hover:bg-sky-500/30 whitespace-nowrap">
                        <RotateCw className="h-3.5 w-3.5" />
                        <span>
                           {flippedIdx === activeIdx
                              ? "Lihat Sisi Depan"
                              : "Balik ID Card 3D"}
                        </span>
                     </button>

                     {activeStudent.links?.[0] && (
                        <a
                           href={activeStudent.links[0].href}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="obsidian-pill inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground hover:border-sky-400/40 whitespace-nowrap">
                           <span>Portofolio</span>
                           <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </a>
                     )}

                     {onEditStudent && (
                        <button
                           type="button"
                           onClick={() => onEditStudent(activeStudent)}
                           className="obsidian-pill inline-flex items-center gap-1.5 rounded-lg border-emerald-400/45 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-200 whitespace-nowrap">
                           <Sparkles className="h-3.5 w-3.5" />
                           <span>Edit Siswa</span>
                        </button>
                     )}

                     <button
                        type="button"
                        onClick={() => {
                           setActiveIdx(null);
                           setFlippedIdx(null);
                        }}
                        className="obsidian-pill rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                        Tutup Fokus
                     </button>
                  </div>
               </div>
            )}
         </div>

         {/* =================================================================
          2. PANGGUNG UTAMA TEAMLANYARDRAIL (FISIKA 3D 100% UTUH TANPA PERUBAHAN)
         ================================================================= */}
         <TeamLanyardRail
            items={filteredStudents}
            eyebrow="DIRECTORY ANGGOTA · XII PPLG 1"
            heading="22 Developer, Satu Identitas"
            caption="Tarik tali ke bawah, geser untuk membenturkan kartu, atau klik ID Card untuk membalik biodata."
            autoplay={false}
            active={activeIdx}
            onActiveChange={setActiveIdx}
            flipped={flippedIdx}
            onFlippedChange={setFlippedIdx}
            labels={{
               flip: "Klik atau tekan Enter untuk membalik ID Card",
               back: "Klik lagi atau tekan Esc untuk kembali ke depan",
               show: "Pilih Siswa",
            }}
            className="obsidian-surface rounded-2xl border border-[var(--color-border)]"
         />
      </div>
   );
}

export default ClassLanyardShowcase;