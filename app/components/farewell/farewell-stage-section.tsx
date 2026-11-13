"use client";

import * as React from "react";
import {
   Disc3,
   Gift,
   Images,
   Lock,
   MessageSquareQuote,
   Music,
   RotateCcw,
   ShieldCheck,
   Sparkles,
   Unlock,
} from "lucide-react";
import {
   INITIAL_FAREWELL_DATA,
   type FarewellBoxPayload,
} from "../../types/class-system";
import { FarewellGiftBox3D } from "../3d/farewell-gift-box-3d";
import { MemoryPhotoCube3D, VinylDisc3D } from "../3d/memory-props-3d";
import { useClassAuth } from "../auth/class-auth-provider";

const FAREWELL_STORAGE_KEY = "pplg1-farewell-capsule-v1";

export interface FarewellPlaylistTrack {
   id: string;
   code: string;
   title: string;
   artist: string;
   bpmLabel: string;
   coverImage: string;
}

export const FAREWELL_PLAYLIST: FarewellPlaylistTrack[] = [
   {
      id: "trk-01",
      code: "SIDE A · 01",
      title: "See You Again on Production",
      artist: "XII PPLG 1 · Class of 2026",
      bpmLabel: "84 BPM · Lo-Fi Ambient",
      coverImage:
         "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80",
   },
   {
      id: "trk-02",
      code: "SIDE A · 02",
      title: "Midnight Debugging at Lab RPL",
      artist: "22 Developers Ensemble",
      bpmLabel: "78 BPM · Synth Chill",
      coverImage:
         "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=80",
   },
   {
      id: "trk-03",
      code: "SIDE B · 01",
      title: "Final Commit Before Graduation",
      artist: "Angkatan 2026 Acoustic",
      bpmLabel: "92 BPM · Nostalgic Warm",
      coverImage:
         "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&auto=format&fit=crop&q=80",
   },
];

interface FarewellStageSectionProps {
   initialCapsuleData?: FarewellBoxPayload;
   onSyncCapsuleData?: (updated: FarewellBoxPayload) => Promise<void> | void;
}

export function FarewellStageSection({
   initialCapsuleData = INITIAL_FAREWELL_DATA,
   onSyncCapsuleData,
}: FarewellStageSectionProps) {
   const { isAdmin, openLoginModal } = useClassAuth();

   const [capsuleData, setCapsuleData] =
      React.useState<FarewellBoxPayload>(initialCapsuleData);
   const [capsuleVersion, setCapsuleVersion] = React.useState(0);
   const [activeTrackIndex, setActiveTrackIndex] = React.useState(0);
   const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(null);

   // Muat data kapsul perpisahan yang tersimpan lokal jika ada
   React.useEffect(() => {
      try {
         const raw = window.localStorage.getItem(FAREWELL_STORAGE_KEY);
         if (!raw) return;
         const parsed = JSON.parse(raw) as FarewellBoxPayload;
         if (
            parsed &&
            typeof parsed.headline === "string" &&
            Array.isArray(parsed.photos) &&
            Array.isArray(parsed.quotes)
         ) {
            setCapsuleData(parsed);
            setCapsuleVersion((v) => v + 1);
         }
      } catch {
         // Abaikan bila localStorage tidak tersedia
      }
   }, []);

   const handleSaveCapsuleData = (updated: FarewellBoxPayload) => {
      setCapsuleData(updated);
      try {
         window.localStorage.setItem(
            FAREWELL_STORAGE_KEY,
            JSON.stringify(updated)
         );
         const now = new Date();
         setLastSavedAt(
            now.toLocaleTimeString("id-ID", {
               hour: "2-digit",
               minute: "2-digit",
               second: "2-digit",
            })
         );
      } catch {
         // Abaikan error penyimpanan lokal
      }
      onSyncCapsuleData?.(updated);
   };

   const handleResetDefaultCapsule = () => {
      setCapsuleData(INITIAL_FAREWELL_DATA);
      setCapsuleVersion((v) => v + 1);
      try {
         window.localStorage.removeItem(FAREWELL_STORAGE_KEY);
         setLastSavedAt(null);
      } catch {
         // Abaikan
      }
      onSyncCapsuleData?.(INITIAL_FAREWELL_DATA);
   };

   const currentTrack =
      FAREWELL_PLAYLIST[activeTrackIndex] ?? FAREWELL_PLAYLIST[0]!;

   return (
      <div className="obsidian-surface relative overflow-hidden p-5 sm:p-8 lg:p-10">
         {/* =====================================================================
          0. AMBIENT SPOTLIGHT STAGE LIGHTING (CYAN & WARM GRADUATION GOLD)
         ===================================================================== */}
         <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{
               background:
                  "radial-gradient(circle, rgba(251,146,60,0.34) 0%, rgba(56,189,248,0.22) 55%, transparent 100%)",
            }}
         />

         {/* =====================================================================
          1. HEADER PANGGUNG PERPISAHAN & STATUS AKSES KAPSUL 2026
         ===================================================================== */}
         <div className="relative z-10 flex flex-col justify-between gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
               <div className="inline-flex flex-wrap items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-300">
                  <Gift className="h-3.5 w-3.5 shrink-0" />
                  <span className="mono-tabular tracking-widest uppercase">
                     SECTION 05 · GRADUATION MEMORY CAPSULE · ANGKATAN{" "}
                     {capsuleData.graduation_year}
                  </span>
               </div>
               <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {capsuleData.headline}
               </h2>
               <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                  {capsuleData.subheadline} — Putar kado 3D 360°, dengarkan piringan hitam kenangan, dan buka kapsul waktu untuk membaca surat serta kutipan perpisahan 22 anggota kelas.
               </p>
            </div>

            {/* Panel Status Mode Edit Kapsul */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
               {isAdmin ? (
                  <>
                     <span className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-emerald-400/45 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                        <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Mode Edit Kapsul Terbuka</span>
                     </span>
                     {lastSavedAt && (
                        <span className="mono-tabular rounded-xl border border-sky-400/35 bg-sky-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-sky-700 dark:text-sky-200">
                           Tersimpan {lastSavedAt}
                        </span>
                     )}
                     <button
                        type="button"
                        onClick={handleResetDefaultCapsule}
                        title="Kembalikan isi kapsul ke data awal"
                        className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset</span>
                     </button>
                  </>
               ) : (
                  <button
                     type="button"
                     onClick={openLoginModal}
                     className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:border-amber-400/45 hover:text-foreground">
                     <Lock className="h-3.5 w-3.5 text-amber-500" />
                     <span>Login Admin untuk Edit Isi Kado 3D</span>
                  </button>
               )}
            </div>
         </div>

         {/* =====================================================================
          2. PANGGUNG UTAMA 3 OBJEK 3D INTERAKTIF (VINYL + GIFT BOX + CUBE)
             RESPONSIF DI HP (360px-430px) & DESKTOP 12-COLUMN STAGE
         ===================================================================== */}
         <div className="relative z-10 mt-6 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
            {/* KIRI (3 KOLOM): PEMUTAR VINYL 3D & PILIHAN TRACK NOSTALGIA */}
            <div className="obsidian-pill flex flex-col items-center justify-between rounded-2xl p-4 sm:p-5 lg:col-span-4">
               <div className="flex w-full items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                     <Disc3 className="h-3.5 w-3.5 text-sky-500" />
                     <span>Turntable Memori 3D</span>
                  </span>
                  <span className="mono-tabular rounded-md bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:text-sky-300">
                     {currentTrack.code}
                  </span>
               </div>

               {/* Komponen 3D Vinyl Asli (100% Utuh) */}
               <div className="my-2 flex w-full justify-center overflow-hidden">
                  <VinylDisc3D
                     trackTitle={currentTrack.title}
                     trackArtist={currentTrack.artist}
                     coverImage={currentTrack.coverImage}
                  />
               </div>

               {/* Pemilih Track Vinyl (Card Grid 3 Tombol Kompak) */}
               <div className="w-full border-t border-[var(--color-border)] pt-3">
                  <div className="mb-2 flex items-center justify-between text-[10px] text-muted-foreground">
                     <span className="inline-flex items-center gap-1 font-semibold">
                        <Music className="h-3 w-3 text-amber-500" />
                        <span>Pilih Piringan Lagu Kelas:</span>
                     </span>
                     <span className="mono-tabular">{currentTrack.bpmLabel}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                     {FAREWELL_PLAYLIST.map((trk, idx) => {
                        const active = idx === activeTrackIndex;
                        return (
                           <button
                              key={trk.id}
                              type="button"
                              onClick={() => setActiveTrackIndex(idx)}
                              className={`rounded-lg px-2 py-1.5 text-left transition ${
                                 active
                                    ? "bg-amber-500/20 border border-amber-400/45 text-amber-700 dark:text-amber-200"
                                    : "obsidian-pill text-muted-foreground hover:text-foreground"
                              }`}>
                              <p className="mono-tabular text-[9px] font-bold">
                                 TRACK 0{idx + 1}
                              </p>
                              <p className="truncate text-[10px] font-semibold">
                                 {trk.title}
                              </p>
                           </button>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* TENGAH (4 KOLOM): KADO PERPISAHAN 3D UTAMA (INTERACTIVE VAULT) */}
            <div className="obsidian-pill relative flex flex-col items-center justify-between rounded-2xl border-amber-400/35 p-4 sm:p-6 lg:col-span-4">
               <div className="flex w-full items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                     <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                     <span>Kapsul Kado Utama 3D</span>
                  </span>
                  <span className="mono-tabular rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                     INTERACTIVE 360°
                  </span>
               </div>

               {/* Komponen Kado 3D Asli (100% Utuh & Tersambung ke State Kapsul) */}
               <div className="my-auto flex w-full justify-center overflow-hidden">
                  <FarewellGiftBox3D
                     key={capsuleVersion}
                     initialData={capsuleData}
                     canEdit={isAdmin}
                     onSaveData={handleSaveCapsuleData}
                  />
               </div>
            </div>

            {/* KANAN (4 KOLOM): KUBUS FOTO 3D YANG TERSINKRONISASI DENGAN ISI KADO */}
            <div className="obsidian-pill flex flex-col items-center justify-between rounded-2xl p-4 sm:p-5 lg:col-span-4">
               <div className="flex w-full items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                     <Images className="h-3.5 w-3.5 text-indigo-500" />
                     <span>Kubus Momen 6 Sisi</span>
                  </span>
                  <span className="mono-tabular rounded-md bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                     {capsuleData.photos.length} FOTO AKTIF
                  </span>
               </div>

               {/* Komponen Kubus 3D Asli (100% Utuh & Menampilkan Foto dari Kapsul) */}
               <div className="my-2 flex w-full justify-center overflow-hidden">
                  <MemoryPhotoCube3D photos={capsuleData.photos} size={164} />
               </div>

               <div className="w-full border-t border-[var(--color-border)] pt-3 text-center">
                  <p className="text-[11px] text-muted-foreground">
                     Geser kubus 3D untuk memutar 6 sisi foto kenangan yang tersimpan di dalam kapsul kelulusan.
                  </p>
               </div>
            </div>
         </div>

         {/* =====================================================================
          3. RINGKASAN SURAT & QUOTES TEMAN SEKELAS (CARD GRID 2 KOLOM DI HP)
         ===================================================================== */}
         <div className="relative z-10 mt-6 border-t border-[var(--color-border)] pt-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
               <div className="inline-flex items-center gap-2">
                  <MessageSquareQuote className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                     Cuplikan Surat & Quotes Anggota XII PPLG 1 ({capsuleData.quotes.length})
                  </h3>
               </div>

               <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-500" />
                  <span>
                     Klik tombol{" "}
                     <strong className="text-foreground">
                        Buka Kado Perpisahan 3D
                     </strong>{" "}
                     di atas untuk melihat album penuh
                  </span>
               </span>
            </div>

            {/* Cuplikan Pesan Utama Kelas */}
            <div className="obsidian-pill mt-3 rounded-xl p-4">
               <p className="text-xs italic leading-relaxed text-foreground sm:text-sm">
                  &ldquo;{capsuleData.main_message}&rdquo;
               </p>
            </div>

            {/* Grid Quotes Teman Sekelas: WAJIB Card Grid 2 Kolom di HP (grid-cols-2 lg:grid-cols-3) */}
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
               {capsuleData.quotes.map((item, idx) => (
                  <div
                     key={item.id}
                     className="obsidian-pill flex flex-col justify-between rounded-xl p-3 sm:p-4">
                     <div>
                        <div className="flex items-center justify-between gap-1">
                           <span className="mono-tabular rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300">
                              QUOTE #{String(idx + 1).padStart(2, "0")}
                           </span>
                           <span className="mono-tabular truncate text-[10px] font-semibold text-muted-foreground">
                              {item.role ?? "XII PPLG 1"}
                           </span>
                        </div>
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-foreground">
                           &ldquo;{item.quote}&rdquo;
                        </p>
                     </div>

                     <div className="mt-3 border-t border-[var(--color-border)] pt-2">
                        <p className="truncate text-xs font-bold text-sky-600 dark:text-sky-300">
                           {item.author_name}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
