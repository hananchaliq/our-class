"use client";

import * as React from "react";
import {
   Activity,
   ArrowUpRight,
   CheckCircle2,
   Code2,
   Cpu,
   Gamepad2,
   GitCommitHorizontal,
   Palette,
   Server,
} from "lucide-react";

type TimeframeKey = "weekly" | "ukk" | "archive";
type DivisionFilterKey = "all" | "Frontend" | "Backend" | "UI/UX & Creative" | "Game & Mobile";

interface DailyActivityPoint {
   day: string;
   fullDay: string;
   commits: number;
   labHours: number;
   modulesDone: number;
   focusTopic: string;
}

const ACTIVITY_DATA: Record<TimeframeKey, DailyActivityPoint[]> = {
   weekly: [
      {
         day: "SEN",
         fullDay: "Senin",
         commits: 34,
         labHours: 6,
         modulesDone: 12,
         focusTopic: "Arsitektur Next.js App Router & Auth",
      },
      {
         day: "SEL",
         fullDay: "Selasa",
         commits: 48,
         labHours: 8,
         modulesDone: 16,
         focusTopic: "Integrasi PostgreSQL, RLS & REST API",
      },
      {
         day: "RAB",
         fullDay: "Rabu",
         commits: 62,
         labHours: 8,
         modulesDone: 19,
         focusTopic: "Design System, Swiss-Grid & Prototyping",
      },
      {
         day: "KAM",
         fullDay: "Kamis",
         commits: 54,
         labHours: 7,
         modulesDone: 15,
         focusTopic: "Physics 3D Shader & Mobile Build APK",
      },
      {
         day: "JUM",
         fullDay: "Jumat",
         commits: 41,
         labHours: 5,
         modulesDone: 14,
         focusTopic: "Code Review, Testing & Optimasi Bundle",
      },
      {
         day: "SAB",
         fullDay: "Sabtu",
         commits: 29,
         labHours: 4,
         modulesDone: 10,
         focusTopic: "Deployment Vercel & Dokumentasi UKK",
      },
   ],
   ukk: [
      {
         day: "SEN",
         fullDay: "Senin (Pra-UKK)",
         commits: 52,
         labHours: 8,
         modulesDone: 18,
         focusTopic: "Perancangan ERD & Skema Database UKK",
      },
      {
         day: "SEL",
         fullDay: "Selasa (Inti)",
         commits: 74,
         labHours: 9,
         modulesDone: 22,
         focusTopic: "Implementasi Full CRUD & Role Access",
      },
      {
         day: "RAB",
         fullDay: "Rabu (UI/UX)",
         commits: 68,
         labHours: 8,
         modulesDone: 20,
         focusTopic: "Responsivitas Mobile & Validasi Form",
      },
      {
         day: "KAM",
         fullDay: "Kamis (QA)",
         commits: 81,
         labHours: 9,
         modulesDone: 24,
         focusTopic: "Uji Fungsionalitas & Bug Fixing",
      },
      {
         day: "JUM",
         fullDay: "Jumat (Final)",
         commits: 64,
         labHours: 7,
         modulesDone: 21,
         focusTopic: " Staging Production & Laporan Teknis",
      },
      {
         day: "SAB",
         fullDay: "Sabtu (Sidang)",
         commits: 45,
         labHours: 6,
         modulesDone: 22,
         focusTopic: "Presentasi & Demo Aplikasi 22 Siswa",
      },
   ],
   archive: [
      {
         day: "SEN",
         fullDay: "Semester 1",
         commits: 180,
         labHours: 42,
         modulesDone: 45,
         focusTopic: "Algoritma Dasar, HTML/CSS & Git Flow",
      },
      {
         day: "SEL",
         fullDay: "Semester 2",
         commits: 240,
         labHours: 50,
         modulesDone: 58,
         focusTopic: "Pemrograman Berorientasi Objek & SQL",
      },
      {
         day: "RAB",
         fullDay: "Semester 3",
         commits: 310,
         labHours: 64,
         modulesDone: 72,
         focusTopic: "Framework Web Modern & UI/UX Design",
      },
      {
         day: "KAM",
         fullDay: "Semester 4",
         commits: 365,
         labHours: 70,
         modulesDone: 84,
         focusTopic: "Mobile Flutter, Unity 3D & Cloud API",
      },
      {
         day: "JUM",
         fullDay: "Semester 5",
         commits: 420,
         labHours: 82,
         modulesDone: 92,
         focusTopic: "Praktik Kerja Lapangan & Proyek Industri",
      },
      {
         day: "SAB",
         fullDay: "Semester 6",
         commits: 490,
         labHours: 90,
         modulesDone: 100,
         focusTopic: "Kapsul Kelulusan & Portofolio Akhir 2026",
      },
   ],
};

interface DivisionTelemetryItem {
   key: DivisionFilterKey;
   label: string;
   shortLabel: string;
   studentsCount: number;
   studentNumbers: string;
   completionPct: number;
   projectsBuilt: number;
   colorHex: string;
   badgeClass: string;
   stackSummary: string;
   icon: React.ComponentType<{ className?: string }>;
}

const DIVISION_METRICS: DivisionTelemetryItem[] = [
   {
      key: "all",
      label: "Seluruh Kelas XII PPLG 1",
      shortLabel: "Semua (22)",
      studentsCount: 22,
      studentNumbers: "Absen #01 — #22",
      completionPct: 96,
      projectsBuilt: 28,
      colorHex: "#38bdf8",
      badgeClass: "text-sky-600 dark:text-sky-300 border-sky-400/40 bg-sky-500/15",
      stackSummary: "Next.js · Supabase · Laravel · Unity · Flutter",
      icon: Activity,
   },
   {
      key: "Frontend",
      label: "Frontend Architecture",
      shortLabel: "Frontend",
      studentsCount: 6,
      studentNumbers: "#04, #09, #12, #15, #19, #22",
      completionPct: 98,
      projectsBuilt: 9,
      colorHex: "#38bdf8",
      badgeClass: "text-sky-600 dark:text-sky-300 border-sky-400/40 bg-sky-500/15",
      stackSummary: "Next.js 15 · React 19 · Tailwind v4 · TypeScript",
      icon: Code2,
   },
   {
      key: "Backend",
      label: "Backend & Cloud Systems",
      shortLabel: "Backend",
      studentsCount: 6,
      studentNumbers: "#01, #05, #07, #11, #14, #18",
      completionPct: 95,
      projectsBuilt: 8,
      colorHex: "#818cf8",
      badgeClass: "text-indigo-600 dark:text-indigo-300 border-indigo-400/40 bg-indigo-500/15",
      stackSummary: "PostgreSQL · Supabase · Go · Laravel · Docker",
      icon: Server,
   },
   {
      key: "UI/UX & Creative",
      label: "UI/UX & Creative Tech",
      shortLabel: "UI/UX",
      studentsCount: 5,
      studentNumbers: "#02, #08, #10, #16, #20",
      completionPct: 97,
      projectsBuilt: 6,
      colorHex: "#f472b6",
      badgeClass: "text-pink-600 dark:text-pink-300 border-pink-400/40 bg-pink-500/15",
      stackSummary: "Figma · Design System · CSS 3D · Motion",
      icon: Palette,
   },
   {
      key: "Game & Mobile",
      label: "Game & Mobile Dev",
      shortLabel: "Game/Mobile",
      studentsCount: 5,
      studentNumbers: "#03, #06, #13, #17, #21",
      completionPct: 94,
      projectsBuilt: 5,
      colorHex: "#34d399",
      badgeClass: "text-emerald-600 dark:text-emerald-300 border-emerald-400/40 bg-emerald-500/15",
      stackSummary: "Unity 3D · C# · Blender · Flutter · Dart",
      icon: Gamepad2,
   },
];

export function ClassActivityWidgets() {
   const [timeframe, setTimeframe] = React.useState<TimeframeKey>("weekly");
   const [selectedDayIdx, setSelectedDayIdx] = React.useState<number>(2); // Default Rabu (puncak aktivitas)
   const [selectedDivision, setSelectedDivision] =
      React.useState<DivisionFilterKey>("all");

   const activeSeries = ACTIVITY_DATA[timeframe];
   const maxCommits = React.useMemo(
      () => Math.max(...activeSeries.map((d) => d.commits), 1),
      [activeSeries]
   );
   const totalCommits = React.useMemo(
      () => activeSeries.reduce((acc, item) => acc + item.commits, 0),
      [activeSeries]
   );
   const totalLabHours = React.useMemo(
      () => activeSeries.reduce((acc, item) => acc + item.labHours, 0),
      [activeSeries]
   );

   const activePoint = activeSeries[selectedDayIdx] ?? activeSeries[0];
   const activeDivisionObj =
      DIVISION_METRICS.find((d) => d.key === selectedDivision) ?? DIVISION_METRICS[0];

   // Konfigurasi Geometri SVG Progress Ring
   const ringRadius = 58;
   const ringCircumference = 2 * Math.PI * ringRadius;
   const ringStrokeOffset =
      ringCircumference - (activeDivisionObj.completionPct / 100) * ringCircumference;

   return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
         {/* =================================================================
          1. WIDGET KIRI: WEEKLY CLASS ACTIVITY BAR & MOMENTUM CHART (7 KOLOM)
         ================================================================= */}
         <div className="obsidian-surface flex flex-col justify-between p-5 sm:p-6 lg:col-span-7">
            {/* Header Widget & Filter Timeframe */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
               <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-300">
                     <GitCommitHorizontal className="h-3.5 w-3.5 shrink-0" />
                     <span className="mono-tabular tracking-wider uppercase">
                        TELEMETRI AKTIVITAS PRAKTIK & KODE
                     </span>
                  </div>
                  <h2 className="mt-1 text-base font-bold tracking-tight text-foreground sm:text-lg">
                     Momentum Produktivitas Lab XII PPLG 1
                  </h2>
               </div>

               {/* Segmented Timeframe Selector */}
               <div
                  role="group"
                  aria-label="Pilih periode aktivitas kelas"
                  className="obsidian-pill inline-flex items-center gap-1 self-start rounded-xl p-1 sm:self-auto">
                  {(
                     [
                        { key: "weekly", label: "Mingguan" },
                        { key: "ukk", label: "Sprint UKK" },
                        { key: "archive", label: "3 Tahun" },
                     ] as const
                  ).map((tab) => {
                     const active = timeframe === tab.key;
                     return (
                        <button
                           key={tab.key}
                           type="button"
                           onClick={() => setTimeframe(tab.key)}
                           className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition whitespace-nowrap shrink-0 ${
                              active
                                 ? "bg-sky-500/20 text-sky-700 dark:text-sky-200 border border-sky-400/35 glow-cyan"
                                 : "text-muted-foreground hover:text-foreground border border-transparent"
                           }`}>
                           {tab.label}
                        </button>
                     );
                  })}
               </div>
            </div>

            {/* Highlight Bar Info (Terinspirasi Floating Callout pada Referensi Tracle) */}
            <div className="obsidian-pill mt-4 flex flex-col justify-between gap-2 rounded-xl px-4 py-3 sm:flex-row sm:items-center">
               <div className="flex items-center gap-3 min-w-0">
                  <span className="mono-tabular rounded-lg border border-indigo-400/40 bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-200 glow-indigo shrink-0">
                     {activePoint.day}
                  </span>
                  <div className="min-w-0">
                     <div className="truncate text-xs font-semibold text-foreground">
                        {activePoint.fullDay} — {activePoint.focusTopic}
                     </div>
                     <div className="mono-tabular text-[11px] text-muted-foreground">
                        {activePoint.labHours} Jam Lab Produktif · {activePoint.modulesDone}% Target Selesai
                     </div>
                  </div>
               </div>

               <div className="flex items-baseline gap-1.5 self-end sm:self-auto shrink-0">
                  <span className="mono-tabular text-lg font-bold text-sky-600 dark:text-sky-300">
                     +{activePoint.commits}
                  </span>
                  <span className="mono-tabular text-[10px] font-semibold text-muted-foreground">
                     COMMITS
                  </span>
               </div>
            </div>

            {/* Interactive Bar Chart (6 Hari Aktif: SEN - SAB) */}
            <div
               className="mt-5 grid grid-cols-6 items-end gap-2.5 sm:gap-4 pt-6 pb-1"
               role="region"
               aria-label="Grafik batang aktivitas harian kelas">
               {activeSeries.map((point, idx) => {
                  const isSelected = idx === selectedDayIdx;
                  const heightPct = Math.max(
                     22,
                     Math.round((point.commits / maxCommits) * 100)
                  );

                  return (
                     <button
                        key={point.day}
                        type="button"
                        onClick={() => setSelectedDayIdx(idx)}
                        onMouseEnter={() => setSelectedDayIdx(idx)}
                        aria-pressed={isSelected}
                        className="group relative flex flex-col items-center gap-2 focus:outline-none">
                        {/* Angka di Atas Batang */}
                        <span
                           className={`mono-tabular text-[10px] font-semibold transition-all duration-200 ${
                              isSelected
                                 ? " rounded-md border border-indigo-400/45 bg-indigo-500/25 px-1.5 py-0.5 text-indigo-700 dark:text-indigo-200 glow-indigo -translate-y-0.5"
                                 : "text-muted-foreground opacity-75 group-hover:opacity-100"
                           }`}>
                           {point.commits}
                        </span>

                        {/* Track & Batang Vertikal */}
                        <div className="relative flex h-32 w-full max-w-[44px] items-end overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/45 p-1">
                           <div
                              style={{ height: `${heightPct}%` }}
                              className={`w-full rounded-lg transition-all duration-300 ${
                                 isSelected
                                    ? "bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-300 glow-cyan"
                                    : "bg-sky-500/35 dark:bg-sky-400/25 group-hover:bg-sky-500/55"
                              }`}
                           />
                        </div>

                        {/* Label Hari */}
                        <span
                           className={`mono-tabular text-[11px] font-semibold tracking-wider transition-colors ${
                              isSelected
                                 ? "text-sky-600 dark:text-sky-300"
                                 : "text-muted-foreground group-hover:text-foreground"
                           }`}>
                           {point.day}
                        </span>
                     </button>
                  );
               })}
            </div>

            {/* Footer Ringkasan Aktivitas (2 Kolom di HP, 3 di Desktop) */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-[var(--color-border)] pt-4 sm:grid-cols-3">
               <div className="obsidian-pill rounded-xl px-3 py-2">
                  <span className="text-[10px] text-muted-foreground">
                     Total Kontribusi
                  </span>
                  <div className="mono-tabular mt-0.5 text-sm font-bold text-foreground">
                     {totalCommits} Commits
                  </div>
               </div>

               <div className="obsidian-pill rounded-xl px-3 py-2">
                  <span className="text-[10px] text-muted-foreground">
                     Jam Praktik Lab
                  </span>
                  <div className="mono-tabular mt-0.5 text-sm font-bold text-foreground">
                     {totalLabHours} Jam Aktif
                  </div>
               </div>

               <div className="obsidian-pill col-span-2 flex items-center justify-between rounded-xl px-3 py-2 sm:col-span-1">
                  <div>
                     <span className="text-[10px] text-muted-foreground">
                        Status Repo Kelas
                     </span>
                     <div className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>On Track 100%</span>
                     </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
               </div>
            </div>
         </div>

         {/* =================================================================
          2. WIDGET KANAN: DIVISION PROGRESS RING & 2-COL SELECTOR (5 KOLOM)
         ================================================================= */}
         <div className="obsidian-surface flex flex-col justify-between p-5 sm:p-6 lg:col-span-5">
            {/* Header Widget Kanan */}
            <div className="flex items-start justify-between gap-2">
               <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                     <Cpu className="h-3.5 w-3.5 shrink-0" />
                     <span className="mono-tabular tracking-wider uppercase">
                        DISTRIBUSI & PROGRES DIVISI
                     </span>
                  </div>
                  <h2 className="mt-1 text-base font-bold tracking-tight text-foreground sm:text-lg">
                     Kesiapan Karya 4 Divisi Teknis
                  </h2>
               </div>

               <button
                  type="button"
                  onClick={() => setSelectedDivision("all")}
                  className={`obsidian-pill rounded-lg px-2.5 py-1 text-[10px] font-semibold transition whitespace-nowrap ${
                     selectedDivision === "all"
                        ? "border-sky-400/40 bg-sky-500/15 text-sky-700 dark:text-sky-200"
                        : "text-muted-foreground hover:text-foreground"
                  }`}>
                  Reset (22 Siswa)
               </button>
            </div>

            {/* Area Tengah: Glowing Progress Ring + Detail Divisi Aktif */}
            <div className="my-4 flex flex-col items-center gap-5 sm:flex-row">
               {/* SVG Circular Progress Ring Bercahaya */}
               <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
                  <svg
                     className="h-full w-full -rotate-90"
                     viewBox="0 0 140 140"
                     aria-label={`Progress kesiapan ${activeDivisionObj.label}: ${activeDivisionObj.completionPct} persen`}>
                     <circle
                        cx="70"
                        cy="70"
                        r={ringRadius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-slate-200/70 dark:text-slate-800/80"
                     />
                     <circle
                        cx="70"
                        cy="70"
                        r={ringRadius}
                        fill="none"
                        stroke={activeDivisionObj.colorHex}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringStrokeOffset}
                        style={{
                           transition: "stroke-dashoffset 400ms cubic-bezier(0.16, 1, 0.3, 1), stroke 250ms ease",
                           filter: `drop-shadow(0 0 8px ${activeDivisionObj.colorHex}66)`,
                        }}
                     />
                  </svg>

                  {/* Angka Tengah Ring */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                     <span className="mono-tabular text-2xl font-bold tracking-tight text-foreground">
                        {activeDivisionObj.completionPct}%
                     </span>
                     <span className="mono-tabular text-[10px] font-semibold text-muted-foreground">
                        {activeDivisionObj.studentsCount} SISWA
                     </span>
                  </div>
               </div>

               {/* Informasi Divisi Terpilih */}
               <div className="flex flex-1 flex-col gap-1.5 text-center sm:text-left min-w-0">
                  <span
                     className={`inline-flex self-center sm:self-start items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${activeDivisionObj.badgeClass}`}>
                     <span>{activeDivisionObj.shortLabel}</span>
                     <span aria-hidden="true">·</span>
                     <span className="mono-tabular">
                        {activeDivisionObj.projectsBuilt} Project
                     </span>
                  </span>

                  <h3 className="truncate text-sm font-bold text-foreground">
                     {activeDivisionObj.label}
                  </h3>

                  <p className="mono-tabular text-[11px] text-muted-foreground">
                     Anggota: {activeDivisionObj.studentNumbers}
                  </p>

                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                     Stack Utama:{" "}
                     <span className="font-medium text-foreground">
                        {activeDivisionObj.stackSummary}
                     </span>
                  </p>
               </div>
            </div>

            {/* Pemilih 4 Divisi dengan Card Grid 2 Kolom (Wajib grid-cols-2 di HP) */}
            <div
               role="group"
               aria-label="Filter metrik berdasarkan divisi"
               className="grid grid-cols-2 gap-2 border-t border-[var(--color-border)] pt-4">
               {DIVISION_METRICS.slice(1).map((div) => {
                  const Icon = div.icon;
                  const isSelected = selectedDivision === div.key;

                  return (
                     <button
                        key={div.key}
                        type="button"
                        onClick={() =>
                           setSelectedDivision((prev) =>
                              prev === div.key ? "all" : div.key
                           )
                        }
                        aria-pressed={isSelected}
                        className={`obsidian-pill flex items-center justify-between gap-2 rounded-xl p-2.5 text-left transition-all duration-200 ${
                           isSelected
                              ? "border-sky-400/50 bg-sky-500/15 glow-cyan"
                              : "hover:border-sky-400/30"
                        }`}>
                        <div className="flex items-center gap-2 min-w-0">
                           <Icon className="h-3.5 w-3.5 shrink-0 text-sky-500 dark:text-sky-300" />
                           <div className="min-w-0">
                              <div className="truncate text-xs font-semibold text-foreground">
                                 {div.shortLabel}
                              </div>
                              <div className="mono-tabular truncate text-[10px] text-muted-foreground">
                                 {div.studentsCount} Siswa
                              </div>
                           </div>
                        </div>

                        <span className="mono-tabular text-xs font-bold text-foreground shrink-0">
                           {div.completionPct}%
                        </span>
                     </button>
                  );
               })}
            </div>
         </div>
      </div>
   );
}
