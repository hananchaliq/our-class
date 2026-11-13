"use client";

import * as React from "react";
import {
   ArrowDown,
   Award,
   Calendar,
   Clock,
   Code2,
   Cpu,
   Gift,
   Layers,
   ShieldCheck,
   Terminal,
   Users,
} from "lucide-react";
import { GraduationCap3D, TechKeycap3D } from "../3d/hero-props-3d";
import { useClassAuth } from "../auth/class-auth-provider";

interface TelemetryClockState {
   greeting: string;
   timeString: string;
   dateString: string;
   days: string;
   hours: string;
   minutes: string;
   seconds: string;
   isGraduated: boolean;
}

// Target seremoni pelepasan & kapsul kelulusan XII PPLG 1
const GRADUATION_TARGET_ISO = "2026-05-15T08:00:00+07:00";
const NEXT_REUNION_TARGET_ISO = "2027-05-15T08:00:00+07:00";

function pad2(n: number): string {
   return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

function computeTelemetry(mode: "graduation" | "reunion"): TelemetryClockState {
   const now = new Date();

   // Ambil jam WIB (Asia/Jakarta)
   const wibHourStr = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      hour12: false,
   }).format(now);
   const wibHour = Number.parseInt(wibHourStr, 10) || 12;

   let greeting = "Selamat Malam, Warga XII PPLG 1";
   if (wibHour >= 4 && wibHour < 11) {
      greeting = "Selamat Pagi, Warga XII PPLG 1";
   } else if (wibHour >= 11 && wibHour < 15) {
      greeting = "Selamat Siang, Warga XII PPLG 1";
   } else if (wibHour >= 15 && wibHour < 18) {
      greeting = "Selamat Sore, Warga XII PPLG 1";
   }

   const timeString = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
   })
      .format(now)
      .replace(/\./g, ":");

   const dateString = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
   }).format(now);

   const gradDate = new Date(GRADUATION_TARGET_ISO);
   const reunionDate = new Date(NEXT_REUNION_TARGET_ISO);
   const isGraduated = now.getTime() >= gradDate.getTime();

   const targetMs =
      mode === "reunion"
         ? reunionDate.getTime()
         : isGraduated
           ? now.getTime() - gradDate.getTime()
           : gradDate.getTime() - now.getTime();

   const absDiff = Math.max(0, mode === "reunion" ? targetMs - now.getTime() : targetMs);

   const totalSeconds = Math.floor(absDiff / 1000);
   const d = Math.floor(totalSeconds / 86400);
   const h = Math.floor((totalSeconds % 86400) / 3600);
   const m = Math.floor((totalSeconds % 3600) / 60);
   const s = totalSeconds % 60;

   return {
      greeting,
      timeString,
      dateString,
      days: String(d).padStart(2, "0"),
      hours: pad2(h),
      minutes: pad2(m),
      seconds: pad2(s),
      isGraduated,
   };
}

const BENTO_KPI_ITEMS = [
   {
      code: "01",
      value: "22",
      unit: "DEV",
      label: "Total Siswa Aktif",
      detail: "Absen #01 s/d #22",
      icon: Users,
      accent: "text-sky-500 dark:text-sky-300",
   },
   {
      code: "02",
      value: "04",
      unit: "DIVISI",
      label: "Spesialisasi Teknis",
      detail: "FE · BE · UI/UX · Game",
      icon: Layers,
      accent: "text-indigo-500 dark:text-indigo-300",
   },
   {
      code: "03",
      value: "100%",
      unit: "READY",
      label: "Portofolio & UKK",
      detail: "Full-Stack & Gim 2026",
      icon: Cpu,
      accent: "text-emerald-500 dark:text-emerald-300",
   },
   {
      code: "04",
      value: "2026",
      unit: "BATCH",
      label: "Kapsul Kelulusan",
      detail: "22 ID Card & Kado 3D",
      icon: Award,
      accent: "text-amber-500 dark:text-amber-300",
   },
];

export function BentoHeroTelemetry() {
   const { isAdmin, openLoginModal } = useClassAuth();
   const [countdownMode, setCountdownMode] = React.useState<"graduation" | "reunion">(
      "graduation"
   );
   const [telemetry, setTelemetry] = React.useState<TelemetryClockState>({
      greeting: "Selamat Datang, Warga XII PPLG 1",
      timeString: "--:--:--",
      dateString: "Memuat tanggal WIB...",
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      isGraduated: false,
   });

   React.useEffect(() => {
      const update = () => {
         setTelemetry(computeTelemetry(countdownMode));
      };
      update();
      const timer = window.setInterval(update, 1000);
      return () => window.clearInterval(timer);
   }, [countdownMode]);

   return (
      <div className="flex flex-col gap-4">
         {/* =================================================================
          1. BARIS UTAMA BENTO HERO (8 KOLOM KIRI + 4 KOLOM TELEMETRI KANAN)
         ================================================================= */}
         <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
            {/* PANEL UTAMA HERO + OBJEK 3D KEYCAP & TOGA (8 KOLOM) */}
            <div className="obsidian-surface relative flex flex-col justify-between overflow-hidden p-6 sm:p-8 lg:col-span-8">
               {/* Ornamen Koordinat Sudut Swiss-Grid */}
               <span
                  aria-hidden="true"
                  className="mono-tabular pointer-events-none absolute top-3.5 right-4 text-xs text-muted-foreground/40 select-none">
                  + PPLG1.2026
               </span>

               <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-center">
                  {/* Kolom Teks & Identitas Kelas */}
                  <div className="max-w-xl">
                     <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-300">
                        <Terminal className="h-3.5 w-3.5 shrink-0" />
                        <span className="mono-tabular tracking-wider uppercase">
                           {telemetry.greeting}
                        </span>
                        {isAdmin && (
                           <button
                              type="button"
                              onClick={openLoginModal}
                              className="inline-flex items-center gap-1 rounded-md border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Admin Active</span>
                           </button>
                        )}
                     </div>

                     <h1 className="mt-3.5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl xl:text-[2.65rem] xl:leading-[1.12] text-balance">
                        22 Baris Logika,{" "}
                        <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 dark:from-sky-400 dark:via-indigo-400 dark:to-amber-400 bg-clip-text text-transparent">
                           Satu Kapsul Memori.
                        </span>
                     </h1>

                     <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        Ruang arsip digital, direktori interaktif 22 developer{" "}
                        <strong className="font-semibold text-foreground">
                           XII PPLG 1 — Class of 2026
                        </strong>
                        , jadwal kenangan, etalase karya rekayasa perangkat lunak, serta kado perpisahan 3D.
                     </p>

                     {/* Tombol Aksi Utama */}
                     <div className="mt-6 flex flex-wrap items-center gap-2.5">
                        <a
                           href="#lanyard-section"
                           className="obsidian-pill inline-flex items-center gap-2 rounded-full border-sky-400/45 bg-sky-500/15 px-4 py-2.5 text-xs font-semibold text-sky-700 dark:text-sky-200 transition hover:bg-sky-500/25 glow-cyan whitespace-nowrap shrink-0">
                           <span>Eksplorasi 22 ID Card 3D</span>
                           <ArrowDown className="h-3.5 w-3.5" />
                        </a>
                        <a
                           href="#farewell-gift-section"
                           className="obsidian-pill inline-flex items-center gap-2 rounded-full border-amber-400/45 bg-amber-500/15 px-4 py-2.5 text-xs font-semibold text-amber-800 dark:text-amber-200 transition hover:bg-amber-500/25 glow-amber whitespace-nowrap shrink-0">
                           <Gift className="h-3.5 w-3.5" />
                           <span>Buka Kado Perpisahan 3D</span>
                        </a>
                     </div>
                  </div>

                  {/* Panggung Objek 3D Mandiri (TechKeycap3D & GraduationCap3D Utuh) */}
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 shrink-0 py-2">
                     <TechKeycap3D label="PPLG-1" sublabel="22 SISWA" />
                     <GraduationCap3D year="2026" />
                  </div>
               </div>

               {/* Baris Bawah Panel Utama: Metadata Unboxed Teknis */}
               <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-2">
                     <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                        <Code2 className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                        <span>Pengembangan Perangkat Lunak & Gim</span>
                     </span>
                     <span aria-hidden="true">·</span>
                     <span className="mono-tabular">06 Frontend</span>
                     <span aria-hidden="true">·</span>
                     <span className="mono-tabular">06 Backend</span>
                     <span aria-hidden="true">·</span>
                     <span className="mono-tabular">05 UI/UX</span>
                     <span aria-hidden="true">·</span>
                     <span className="mono-tabular">05 Game & Mobile</span>
                  </div>

                  <span className="mono-tabular text-[11px] font-semibold text-sky-600 dark:text-sky-300">
                     BATCH 2023 — 2026
                  </span>
               </div>
            </div>

            {/* PANEL KANAN: LIVE CLOCK WIB & GRADUATION COUNTDOWN 2026 (4 KOLOM) */}
            <div className="flex flex-col gap-4 lg:col-span-4">
               {/* Widget 1: Live Clock WIB Telemetry */}
               <div className="obsidian-surface flex flex-1 flex-col justify-between p-5">
                  <div className="flex items-center justify-between gap-2">
                     <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                        <span>Waktu Server Kelas (WIB)</span>
                     </span>
                     <span className="mono-tabular text-[11px] font-semibold text-sky-600 dark:text-sky-300">
                        UTC+07:00
                     </span>
                  </div>

                  <div className="my-3 flex items-baseline justify-between gap-2">
                     <div className="mono-tabular text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {telemetry.timeString}
                     </div>
                     <span className="mono-tabular text-xs font-semibold text-muted-foreground">
                        WIB
                     </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs text-muted-foreground">
                     <span className="inline-flex items-center gap-1.5 truncate">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                        <span className="truncate">{telemetry.dateString}</span>
                     </span>
                     <span className="mono-tabular font-medium text-foreground shrink-0">
                        XII PPLG 1
                     </span>
                  </div>
               </div>

               {/* Widget 2: Graduation Capsule Timer 2026 */}
               <div className="obsidian-surface flex flex-1 flex-col justify-between p-5">
                  <div className="flex items-center justify-between gap-2">
                     <span className="text-xs font-semibold text-foreground">
                        {countdownMode === "graduation"
                           ? telemetry.isGraduated
                              ? "Usia Kapsul Kelulusan 2026"
                              : "Hitung Mundur Kelulusan"
                           : "Menuju Reuni Akbar 2027"}
                     </span>

                     {/* Segmented Mode Control */}
                     <div className="obsidian-pill inline-flex items-center gap-0.5 rounded-lg p-0.5">
                        <button
                           type="button"
                           onClick={() => setCountdownMode("graduation")}
                           className={`rounded-md px-2 py-1 text-[10px] font-semibold transition whitespace-nowrap ${
                              countdownMode === "graduation"
                                 ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                                 : "text-muted-foreground hover:text-foreground"
                           }`}>
                           Kapsul 2026
                        </button>
                        <button
                           type="button"
                           onClick={() => setCountdownMode("reunion")}
                           className={`rounded-md px-2 py-1 text-[10px] font-semibold transition whitespace-nowrap ${
                              countdownMode === "reunion"
                                 ? "bg-sky-500/20 text-sky-700 dark:text-sky-300"
                                 : "text-muted-foreground hover:text-foreground"
                           }`}>
                           Reuni 2027
                        </button>
                     </div>
                  </div>

                  {/* 4 Blok Angka Tabular */}
                  <div className="my-3 grid grid-cols-4 gap-2">
                     {[
                        { label: "HARI", value: telemetry.days },
                        { label: "JAM", value: telemetry.hours },
                        { label: "MENIT", value: telemetry.minutes },
                        { label: "DETIK", value: telemetry.seconds },
                     ].map((unit) => (
                        <div
                           key={unit.label}
                           className="obsidian-pill flex flex-col items-center justify-center rounded-xl py-2.5 px-1 text-center">
                           <span className="mono-tabular text-lg font-bold tracking-tight text-foreground sm:text-xl">
                              {unit.value}
                           </span>
                           <span className="mono-tabular mt-0.5 text-[9px] font-semibold tracking-wider text-muted-foreground">
                              {unit.label}
                           </span>
                        </div>
                     ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                     <span>Seremoni Pelepasan Angkatan</span>
                     <span className="mono-tabular font-semibold text-amber-600 dark:text-amber-300">
                        15 MEI 2026
                     </span>
                  </div>
               </div>
            </div>
         </div>

         {/* =================================================================
          2. STRIP 4 KARTU BENTO RINGKASAN KELAS (2 KOLOM DI HP, 4 DI DESKTOP)
         ================================================================= */}
         <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {BENTO_KPI_ITEMS.map((item) => {
               const Icon = item.icon;
               return (
                  <div
                     key={item.code}
                     className="obsidian-surface flex flex-col justify-between p-4 sm:p-5">
                     <div className="flex items-center justify-between gap-2">
                        <span className="mono-tabular text-[11px] font-semibold text-muted-foreground">
                           {item.code} / METRIC
                        </span>
                        <Icon className={`h-4 w-4 shrink-0 ${item.accent}`} />
                     </div>

                     <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="mono-tabular text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                           {item.value}
                        </span>
                        <span className="mono-tabular text-[10px] font-semibold tracking-wider text-muted-foreground">
                           {item.unit}
                        </span>
                     </div>

                     <div className="mt-2 border-t border-[var(--color-border)] pt-2">
                        <div className="truncate text-xs font-semibold text-foreground">
                           {item.label}
                        </div>
                        <div className="mono-tabular truncate text-[11px] text-muted-foreground">
                           {item.detail}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
