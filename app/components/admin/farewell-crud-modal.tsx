"use client";

import * as React from "react";
import {
   CheckCircle2,
   CloudUpload,
   FileText,
   Gift,
   Images,
   MessageSquareQuote,
   Plus,
   Save,
   Trash2,
   Upload,
   X,
} from "lucide-react";
import {
   type FarewellBoxPayload,
   type FarewellMemoryPhoto,
   type FarewellQuote,
} from "@/app/types/class-system";
import { uploadClassAsset } from "@/lib/supabase/client";

interface FarewellCrudModalProps {
   isOpen: boolean;
   capsuleData: FarewellBoxPayload;
   isSupabaseConnected: boolean;
   isSyncing: boolean;
   onClose: () => void;
   onSaveCapsule: (updated: FarewellBoxPayload) => Promise<void>;
   onSyncAllToSupabase: () => Promise<void>;
}

export function FarewellCrudModal({
   isOpen,
   capsuleData,
   isSupabaseConnected,
   isSyncing,
   onClose,
   onSaveCapsule,
   onSyncAllToSupabase,
}: FarewellCrudModalProps) {
   const [activeTab, setActiveTab] = React.useState<
      "letter" | "photos" | "quotes"
   >("letter");

   // Tab 1: Surat Utama & Headline Kapsul
   const [headline, setHeadline] = React.useState(capsuleData.headline);
   const [subheadline, setSubheadline] = React.useState(
      capsuleData.subheadline
   );
   const [graduationYear, setGraduationYear] = React.useState(
      capsuleData.graduation_year
   );
   const [mainMessage, setMainMessage] = React.useState(
      capsuleData.main_message
   );

   // Tab 2: Tambah Foto Kenangan Kado 3D
   const [photoTitle, setPhotoTitle] = React.useState("");
   const [photoDesc, setPhotoDesc] = React.useState("");
   const [photoDate, setPhotoDate] = React.useState("2026-05-15");
   const [photoUrl, setPhotoUrl] = React.useState("");
   const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);

   // Tab 3: Tambah Quote Teman Sekelas
   const [quoteAuthor, setQuoteAuthor] = React.useState("");
   const [quoteRole, setQuoteRole] = React.useState("Absen #01 · XII PPLG 1");
   const [quoteText, setQuoteText] = React.useState("");

   const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
   const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

   React.useEffect(() => {
      if (!isOpen) return;
      setHeadline(capsuleData.headline);
      setSubheadline(capsuleData.subheadline);
      setGraduationYear(capsuleData.graduation_year);
      setMainMessage(capsuleData.main_message);
      setStatusMsg(null);
      setErrorMsg(null);
   }, [isOpen, capsuleData]);

   if (!isOpen) return null;

   const handleSaveLetter = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      setStatusMsg(null);

      if (!headline.trim() || !mainMessage.trim()) {
         setErrorMsg("Judul kapsul dan isi surat perpisahan wajib diisi.");
         return;
      }

      const updated: FarewellBoxPayload = {
         ...capsuleData,
         headline: headline.trim(),
         subheadline: subheadline.trim(),
         graduation_year: graduationYear.trim() || "2026",
         main_message: mainMessage.trim(),
      };

      await onSaveCapsule(updated);
      setStatusMsg(
         isSupabaseConnected
            ? "Surat utama perpisahan berhasil disimpan ke tabel Supabase public.farewell_box!"
            : "Surat utama perpisahan berhasil diperbarui di Kado 3D!"
      );
   };

   const handleUploadFarewellPhoto = async (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploadingPhoto(true);
      setErrorMsg(null);
      setStatusMsg(null);

      const { publicUrl, error } = await uploadClassAsset(file, "farewell");
      setIsUploadingPhoto(false);

      if (error || !publicUrl) {
         setErrorMsg(error ?? "Gagal mengunggah foto kenangan.");
         return;
      }

      setPhotoUrl(publicUrl);
      setStatusMsg(
         isSupabaseConnected
            ? "Foto berhasil diunggah ke Supabase Storage (class-assets/farewell)."
            : "Foto berhasil dimuat ke form (Mode Lokal Data URL)."
      );
   };

   const handleAddPhoto = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      setStatusMsg(null);

      if (!photoTitle.trim() || !photoUrl.trim()) {
         setErrorMsg("Judul momen dan URL/file foto kenangan wajib diisi.");
         return;
      }

      const newPhoto: FarewellMemoryPhoto = {
         id: `mem-${Date.now()}`,
         title: photoTitle.trim(),
         description:
            photoDesc.trim() || "Dokumentasi kenangan XII PPLG 1 — Angkatan 2026.",
         image_url: photoUrl.trim(),
         taken_date: photoDate.trim() || "2026-05-15",
         category: "farewell_photo",
      };

      const updated: FarewellBoxPayload = {
         ...capsuleData,
         photos: [newPhoto, ...capsuleData.photos],
      };

      await onSaveCapsule(updated);
      setPhotoTitle("");
      setPhotoDesc("");
      setPhotoUrl("");
      setStatusMsg(
         "Foto kenangan baru ditambahkan ke Kado 3D & Kubus Memori 6 Sisi!"
      );
   };

   const handleDeletePhoto = async (photoId: string) => {
      if (capsuleData.photos.length <= 1) {
         setErrorMsg(
            "Minimal harus tersisa 1 foto kenangan untuk ditampilkan pada Kubus 3D."
         );
         return;
      }
      const updated: FarewellBoxPayload = {
         ...capsuleData,
         photos: capsuleData.photos.filter((p) => p.id !== photoId),
      };
      await onSaveCapsule(updated);
      setStatusMsg("Foto kenangan dihapus dari kapsul kado 3D.");
   };

   const handleAddQuote = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      setStatusMsg(null);

      if (!quoteAuthor.trim() || !quoteText.trim()) {
         setErrorMsg("Nama siswa dan isi kutipan perpisahan wajib diisi.");
         return;
      }

      const newQuote: FarewellQuote = {
         id: `q-${Date.now()}`,
         author_name: quoteAuthor.trim(),
         role: quoteRole.trim() || "Anggota XII PPLG 1",
         quote: quoteText.trim(),
         tone: ((capsuleData.quotes.length % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      };

      const updated: FarewellBoxPayload = {
         ...capsuleData,
         quotes: [newQuote, ...capsuleData.quotes],
      };

      await onSaveCapsule(updated);
      setQuoteAuthor("");
      setQuoteText("");
      setStatusMsg(
         "Quote perpisahan baru berhasil ditambahkan ke Kado 3D & Panggung Perpisahan!"
      );
   };

   const handleDeleteQuote = async (quoteId: string) => {
      const updated: FarewellBoxPayload = {
         ...capsuleData,
         quotes: capsuleData.quotes.filter((q) => q.id !== quoteId),
      };
      await onSaveCapsule(updated);
      setStatusMsg("Quote berhasil dihapus.");
   };

   return (
      <div
         role="dialog"
         aria-modal="true"
         aria-label="Manajemen CRUD Kapsul Kado 3D Perpisahan"
         className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md sm:p-6"
         onClick={onClose}>
         <div
            className="obsidian-surface relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-amber-400/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            {/* Header Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
               <div className="flex items-center gap-2.5">
                  <span className="obsidian-pill flex h-9 w-9 items-center justify-center rounded-xl border-amber-400/40 bg-amber-500/15 text-amber-500">
                     <Gift className="h-4 w-4" />
                  </span>
                  <div>
                     <span className="mono-tabular text-[10px] font-bold tracking-widest text-amber-600 dark:text-amber-300 uppercase">
                        FASE 16 · FULL CRUD SUPABASE · FAREWELL CAPSULE 2026
                     </span>
                     <h2 className="text-base font-bold text-foreground sm:text-lg">
                        Kelola Isi Kado 3D, Foto Kubus & Quotes Perpisahan
                     </h2>
                  </div>
               </div>

               <div className="flex flex-wrap items-center gap-2">
                  {isSupabaseConnected && (
                     <button
                        type="button"
                        disabled={isSyncing}
                        onClick={async () => {
                           await onSyncAllToSupabase();
                           setStatusMsg(
                              "Seluruh surat, foto kado, dan quotes berhasil disinkronkan ke Supabase!"
                           );
                        }}
                        className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-sky-400/45 bg-sky-500/15 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-200 disabled:opacity-50">
                        <CloudUpload className="h-3.5 w-3.5" />
                        <span>
                           {isSyncing
                              ? "Menyinkronkan..."
                              : "Sync Kapsul ke Supabase"}
                        </span>
                     </button>
                  )}

                  <button
                     type="button"
                     onClick={onClose}
                     aria-label="Tutup modal CRUD kado"
                     className="obsidian-pill rounded-xl p-1.5 text-muted-foreground hover:text-foreground">
                     <X className="h-4 w-4" />
                  </button>
               </div>
            </div>

            {/* Tab Navigasi Internal Modal */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] px-5 py-3 sm:px-6">
               {(
                  [
                     {
                        key: "letter",
                        label: "Surat Perpisahan Utama",
                        icon: FileText,
                     },
                     {
                        key: "photos",
                        label: `Foto Kenangan & Kubus 3D (${capsuleData.photos.length})`,
                        icon: Images,
                     },
                     {
                        key: "quotes",
                        label: `Quotes Teman Sekelas (${capsuleData.quotes.length})`,
                        icon: MessageSquareQuote,
                     },
                  ] as const
               ).map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.key;
                  return (
                     <button
                        key={tab.key}
                        type="button"
                        onClick={() => {
                           setActiveTab(tab.key);
                           setStatusMsg(null);
                           setErrorMsg(null);
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                           active
                              ? "bg-amber-500/20 text-amber-700 dark:text-amber-200 border border-amber-400/45 glow-amber"
                              : "obsidian-pill text-muted-foreground hover:text-foreground"
                        }`}>
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                     </button>
                  );
               })}
            </div>

            {/* Area Konten Tab */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
               {statusMsg && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-200">
                     <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                     <span>{statusMsg}</span>
                  </div>
               )}

               {errorMsg && (
                  <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-300">
                     {errorMsg}
                  </div>
               )}

               {/* TAB 1: EDIT SURAT PERPISAHAN UTAMA */}
               {activeTab === "letter" && (
                  <form onSubmit={handleSaveLetter} className="flex flex-col gap-4">
                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-2 flex flex-col gap-1">
                           <label className="text-xs font-semibold text-foreground">
                              Judul Kapsul Perpisahan (Headline)
                           </label>
                           <input
                              type="text"
                              required
                              value={headline}
                              onChange={(e) => setHeadline(e.target.value)}
                              className="obsidian-pill rounded-xl px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-amber-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex flex-col gap-1">
                           <label className="text-xs font-semibold text-foreground">
                              Tahun Angkatan
                           </label>
                           <input
                              type="text"
                              required
                              value={graduationYear}
                              onChange={(e) => setGraduationYear(e.target.value)}
                              className="obsidian-pill mono-tabular rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:border-amber-400 focus:outline-none"
                           />
                        </div>
                     </div>

                     <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-foreground">
                           Sub-Judul Kapsul (Subheadline)
                        </label>
                        <input
                           type="text"
                           value={subheadline}
                           onChange={(e) => setSubheadline(e.target.value)}
                           className="obsidian-pill rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:border-amber-400 focus:outline-none"
                        />
                     </div>

                     <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-foreground">
                           Isi Surat Perpisahan Utama XII PPLG 1
                        </label>
                        <textarea
                           rows={5}
                           required
                           value={mainMessage}
                           onChange={(e) => setMainMessage(e.target.value)}
                           className="obsidian-pill rounded-xl px-3.5 py-2.5 text-xs leading-relaxed text-foreground focus:border-amber-400 focus:outline-none"
                        />
                     </div>

                     <div className="flex justify-end pt-2">
                        <button
                           type="submit"
                           disabled={isSyncing}
                           className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-amber-400/50 bg-amber-500/20 px-5 py-2.5 text-xs font-semibold text-amber-700 dark:text-amber-200 glow-amber disabled:opacity-50">
                           <Save className="h-3.5 w-3.5" />
                           <span>
                              {isSyncing
                                 ? "Menyimpan..."
                                 : "Simpan Surat Perpisahan"}
                           </span>
                        </button>
                     </div>
                  </form>
               )}

               {/* TAB 2: KELOLA FOTO KENANGAN KADO 3D & KUBUS 6 SISI */}
               {activeTab === "photos" && (
                  <div className="flex flex-col gap-5">
                     <form
                        onSubmit={handleAddPhoto}
                        className="obsidian-pill flex flex-col gap-3 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-foreground">
                              Tambah Foto Kenangan ke Kado 3D & Kubus Memori
                           </span>
                           <label className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-300 hover:underline">
                              <Upload className="h-3.5 w-3.5" />
                              <span>
                                 {isUploadingPhoto
                                    ? "Mengunggah..."
                                    : "Upload File Foto"}
                              </span>
                              <input
                                 type="file"
                                 accept="image/*"
                                 onChange={handleUploadFarewellPhoto}
                                 className="hidden"
                              />
                           </label>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                           <input
                              type="text"
                              required
                              value={photoTitle}
                              onChange={(e) => setPhotoTitle(e.target.value)}
                              placeholder="Judul momen (cth: Sidang UKK)"
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                           <input
                              type="text"
                              required
                              value={photoUrl}
                              onChange={(e) => setPhotoUrl(e.target.value)}
                              placeholder="URL Foto / Hasil Upload Storage"
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                           <input
                              type="date"
                              value={photoDate}
                              onChange={(e) => setPhotoDate(e.target.value)}
                              className="obsidian-pill mono-tabular rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex flex-col gap-2.5 sm:flex-row">
                           <input
                              type="text"
                              value={photoDesc}
                              onChange={(e) => setPhotoDesc(e.target.value)}
                              placeholder="Deskripsi singkat momen kenangan..."
                              className="obsidian-pill flex-1 rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                           <button
                              type="submit"
                              disabled={isSyncing || isUploadingPhoto}
                              className="obsidian-pill inline-flex items-center justify-center gap-1.5 rounded-xl border-sky-400/45 bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-700 dark:text-sky-200 shrink-0">
                              <Plus className="h-3.5 w-3.5" />
                              <span>Tambah Foto</span>
                           </button>
                        </div>
                     </form>

                     {/* Daftar Foto Kenangan (Card Grid 2 Kolom di HP) */}
                     <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {capsuleData.photos.map((photo) => (
                           <div
                              key={photo.id}
                              className="obsidian-pill flex flex-col justify-between overflow-hidden rounded-xl">
                              <div>
                                 <div className="aspect-video w-full overflow-hidden bg-slate-900">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                       src={photo.image_url}
                                       alt={photo.title}
                                       className="h-full w-full object-cover"
                                    />
                                 </div>
                                 <div className="p-3">
                                    <p className="mono-tabular text-[10px] font-semibold text-sky-600 dark:text-sky-300">
                                       {photo.taken_date}
                                    </p>
                                    <h4 className="mt-0.5 line-clamp-1 text-xs font-bold text-foreground">
                                       {photo.title}
                                    </h4>
                                    <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                                       {photo.description}
                                    </p>
                                 </div>
                              </div>

                              <div className="border-t border-[var(--color-border)] px-3 py-2 flex justify-end">
                                 <button
                                    type="button"
                                    onClick={() => handleDeletePhoto(photo.id)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-300 hover:underline">
                                    <Trash2 className="h-3 w-3" />
                                    <span>Hapus</span>
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* TAB 3: KELOLA QUOTES TEMAN SEKELAS */}
               {activeTab === "quotes" && (
                  <div className="flex flex-col gap-5">
                     <form
                        onSubmit={handleAddQuote}
                        className="obsidian-pill flex flex-col gap-3 rounded-xl p-4">
                        <span className="text-xs font-bold text-foreground">
                           Tambah Quote / Pesan Kesan Teman Sekelas
                        </span>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                           <input
                              type="text"
                              required
                              value={quoteAuthor}
                              onChange={(e) => setQuoteAuthor(e.target.value)}
                              placeholder="Nama Siswa (cth: Hanan Chaliq)"
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-amber-400 focus:outline-none"
                           />
                           <input
                              type="text"
                              value={quoteRole}
                              onChange={(e) => setQuoteRole(e.target.value)}
                              placeholder="Absen / Jabatan (cth: Absen #09)"
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-amber-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex flex-col gap-2.5 sm:flex-row">
                           <input
                              type="text"
                              required
                              value={quoteText}
                              onChange={(e) => setQuoteText(e.target.value)}
                              placeholder="Tulis kutipan perpisahan..."
                              className="obsidian-pill flex-1 rounded-xl px-3 py-2 text-xs text-foreground focus:border-amber-400 focus:outline-none"
                           />
                           <button
                              type="submit"
                              disabled={isSyncing}
                              className="obsidian-pill inline-flex items-center justify-center gap-1.5 rounded-xl border-amber-400/45 bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-200 shrink-0">
                              <Plus className="h-3.5 w-3.5" />
                              <span>Tambah Quote</span>
                           </button>
                        </div>
                     </form>

                     {/* Daftar Quotes (Card Grid 2 Kolom di HP) */}
                     <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {capsuleData.quotes.map((q) => (
                           <div
                              key={q.id}
                              className="obsidian-pill flex flex-col justify-between rounded-xl p-3.5">
                              <p className="text-xs leading-relaxed text-foreground">
                                 &ldquo;{q.quote}&rdquo;
                              </p>
                              <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-2">
                                 <div className="min-w-0">
                                    <p className="truncate text-xs font-bold text-sky-600 dark:text-sky-300">
                                       {q.author_name}
                                    </p>
                                    <p className="mono-tabular truncate text-[10px] text-muted-foreground">
                                       {q.role}
                                    </p>
                                 </div>
                                 <button
                                    type="button"
                                    onClick={() => handleDeleteQuote(q.id)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-300 hover:underline shrink-0">
                                    <Trash2 className="h-3 w-3" />
                                    <span>Hapus</span>
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
