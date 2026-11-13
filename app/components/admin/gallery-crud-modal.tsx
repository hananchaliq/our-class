"use client";

import * as React from "react";
import {
   CheckCircle2,
   CloudUpload,
   Code2,
   FolderGit2,
   Images,
   Plus,
   RotateCcw,
   Save,
   Trash2,
   Upload,
   X,
} from "lucide-react";
import {
   type ClassGalleryMemoryItem,
   type ClassProjectShowcaseItem,
   type ProjectDivision,
} from "../gallery/class-project-gallery";
import { uploadClassAsset } from "@/lib/supabase/client";

interface GalleryCrudModalProps {
   isOpen: boolean;
   projects: ClassProjectShowcaseItem[];
   photos: ClassGalleryMemoryItem[];
   isSupabaseConnected: boolean;
   isSyncing: boolean;
   onClose: () => void;
   onSaveProject: (
      project: ClassProjectShowcaseItem,
      isNew: boolean
   ) => Promise<void>;
   onDeleteProject: (projectId: string) => Promise<void>;
   onSavePhoto: (
      photo: ClassGalleryMemoryItem,
      isNew: boolean
   ) => Promise<void>;
   onDeletePhoto: (photoId: string) => Promise<void>;
   onSyncAllToSupabase: () => Promise<void>;
   onResetDefaults: () => Promise<void>;
}

const DIVISIONS: ProjectDivision[] = [
   "Frontend",
   "Backend",
   "UI/UX & Creative",
   "Game & Mobile",
];

const GALLERY_TAGS: ClassGalleryMemoryItem["tag"][] = [
   "UKK & Pameran",
   "Momen Lab",
   "Class Meeting",
   "Angkatan 2026",
];

export function GalleryCrudModal({
   isOpen,
   projects,
   photos,
   isSupabaseConnected,
   isSyncing,
   onClose,
   onSaveProject,
   onDeleteProject,
   onSavePhoto,
   onDeletePhoto,
   onSyncAllToSupabase,
   onResetDefaults,
}: GalleryCrudModalProps) {
   const [activeTab, setActiveTab] = React.useState<"projects" | "photos">(
      "projects"
   );

   // State Tab 1: Project Karya PPLG
   const [prjMode, setPrjMode] = React.useState<"create" | "edit">("create");
   const [selectedPrjId, setSelectedPrjId] = React.useState<string>("");
   const [prjTitle, setPrjTitle] = React.useState("");
   const [prjSummary, setPrjSummary] = React.useState("");
   const [prjDivision, setPrjDivision] =
      React.useState<ProjectDivision>("Frontend");
   const [prjAuthorName, setPrjAuthorName] = React.useState("");
   const [prjAuthorAbsen, setPrjAuthorAbsen] = React.useState<number>(9);
   const [prjTechInput, setPrjTechInput] = React.useState(
      "Next.js, TypeScript, Supabase"
   );
   const [prjImageUrl, setPrjImageUrl] = React.useState("");
   const [prjRepoUrl, setPrjRepoUrl] = React.useState("https://github.com");
   const [prjCreatedAt, setPrjCreatedAt] = React.useState("Mar 2026");

   // State Tab 2: Galeri Foto Momen Kelas
   const [phoMode, setPhoMode] = React.useState<"create" | "edit">("create");
   const [selectedPhoId, setSelectedPhoId] = React.useState<string>("");
   const [phoTitle, setPhoTitle] = React.useState("");
   const [phoDesc, setPhoDesc] = React.useState("");
   const [phoImageUrl, setPhoImageUrl] = React.useState("");
   const [phoDate, setPhoDate] = React.useState("18 Apr 2026");
   const [phoLocation, setPhoLocation] = React.useState("Lab RPL Utama");
   const [phoTag, setPhoTag] =
      React.useState<ClassGalleryMemoryItem["tag"]>("Momen Lab");

   const [isUploading, setIsUploading] = React.useState(false);
   const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
   const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

   const resetProjectForm = React.useCallback(() => {
      setPrjMode("create");
      setSelectedPrjId("");
      setPrjTitle("");
      setPrjSummary("");
      setPrjDivision("Frontend");
      setPrjAuthorName("");
      setPrjAuthorAbsen(9);
      setPrjTechInput("Next.js, TypeScript, Supabase");
      setPrjImageUrl("");
      setPrjRepoUrl("https://github.com");
      setPrjCreatedAt("Mar 2026");
   }, []);

   const resetPhotoForm = React.useCallback(() => {
      setPhoMode("create");
      setSelectedPhoId("");
      setPhoTitle("");
      setPhoDesc("");
      setPhoImageUrl("");
      setPhoDate("18 Apr 2026");
      setPhoLocation("Lab RPL Utama");
      setPhoTag("Momen Lab");
   }, []);

   React.useEffect(() => {
      if (!isOpen) return;
      setStatusMsg(null);
      setErrorMsg(null);
   }, [isOpen]);

   if (!isOpen) return null;

   const selectProjectForEdit = (p: ClassProjectShowcaseItem) => {
      setPrjMode("edit");
      setSelectedPrjId(p.id);
      setPrjTitle(p.title);
      setPrjSummary(p.summary);
      setPrjDivision(p.division);
      setPrjAuthorName(p.authorName);
      setPrjAuthorAbsen(p.authorAbsen);
      setPrjTechInput(p.techStack.join(", "));
      setPrjImageUrl(p.imageUrl);
      setPrjRepoUrl(p.repoUrl);
      setPrjCreatedAt(p.createdAt);
      setStatusMsg(null);
      setErrorMsg(null);
   };

   const selectPhotoForEdit = (m: ClassGalleryMemoryItem) => {
      setPhoMode("edit");
      setSelectedPhoId(m.id);
      setPhoTitle(m.title);
      setPhoDesc(m.description);
      setPhoImageUrl(m.imageUrl);
      setPhoDate(m.takenDate);
      setPhoLocation(m.location);
      setPhoTag(m.tag);
      setStatusMsg(null);
      setErrorMsg(null);
   };

   const handleUploadAsset = async (
      e: React.ChangeEvent<HTMLInputElement>,
      target: "projects" | "gallery"
   ) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      setErrorMsg(null);
      setStatusMsg(null);

      const { publicUrl, error } = await uploadClassAsset(file, target);
      setIsUploading(false);

      if (error || !publicUrl) {
         setErrorMsg(error ?? "Gagal mengunggah gambar.");
         return;
      }

      if (target === "projects") {
         setPrjImageUrl(publicUrl);
      } else {
         setPhoImageUrl(publicUrl);
      }

      setStatusMsg(
         isSupabaseConnected
            ? `Gambar berhasil diunggah ke Supabase Storage (class-assets/${target})!`
            : "Gambar berhasil dimuat ke form (Mode Lokal Data URL)."
      );
   };

   const handleSubmitProject = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      setStatusMsg(null);

      if (!prjTitle.trim() || !prjAuthorName.trim() || !prjImageUrl.trim()) {
         setErrorMsg("Judul karya, nama kreator, dan gambar wajib diisi.");
         return;
      }

      const isNew = prjMode === "create";
      const nextNum = projects.length + 1;
      const paddedAbsen = String(
         Math.max(1, Math.min(22, Number(prjAuthorAbsen) || 1))
      ).padStart(2, "0");

      const item: ClassProjectShowcaseItem = {
         id: isNew ? `prj-${Date.now()}` : selectedPrjId,
         code: isNew
            ? `PRJ-${String(nextNum).padStart(2, "0")}`
            : projects.find((x) => x.id === selectedPrjId)?.code ?? "PRJ-01",
         title: prjTitle.trim(),
         summary:
            prjSummary.trim() ||
            "Karya rekayasa perangkat lunak siswa XII PPLG 1 — Angkatan 2026.",
         division: prjDivision,
         authorName: prjAuthorName.trim(),
         authorAbsen: Number(prjAuthorAbsen) || 1,
         authorStudentId: `pplg1-${paddedAbsen}`,
         techStack: prjTechInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
         imageUrl: prjImageUrl.trim(),
         repoUrl: prjRepoUrl.trim() || "https://github.com",
         createdAt: prjCreatedAt.trim() || "Mar 2026",
         featured: true,
      };

      await onSaveProject(item, isNew);
      if (isNew) resetProjectForm();
      setStatusMsg(
         isSupabaseConnected
            ? `Karya "${item.title}" berhasil disimpan ke Supabase public.memories!`
            : `Karya "${item.title}" berhasil disimpan ke Etalase Project!`
      );
   };

   const handleSubmitPhoto = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      setStatusMsg(null);

      if (!phoTitle.trim() || !phoImageUrl.trim()) {
         setErrorMsg("Judul dokumentasi dan URL/file foto wajib diisi.");
         return;
      }

      const isNew = phoMode === "create";
      const nextNum = photos.length + 1;

      const item: ClassGalleryMemoryItem = {
         id: isNew ? `gal-${Date.now()}` : selectedPhoId,
         code: isNew
            ? `MEM-${String(nextNum).padStart(2, "0")}`
            : photos.find((x) => x.id === selectedPhoId)?.code ?? "MEM-01",
         title: phoTitle.trim(),
         description:
            phoDesc.trim() ||
            "Dokumentasi kenangan keluarga besar XII PPLG 1 — Angkatan 2026.",
         imageUrl: phoImageUrl.trim(),
         takenDate: phoDate.trim() || "2026",
         location: phoLocation.trim() || "Lab RPL Utama",
         tag: phoTag,
      };

      await onSavePhoto(item, isNew);
      if (isNew) resetPhotoForm();
      setStatusMsg(
         isSupabaseConnected
            ? `Foto "${item.title}" berhasil disimpan ke Supabase public.memories!`
            : `Foto "${item.title}" berhasil disimpan ke Galeri Kelas!`
      );
   };

   return (
      <div
         role="dialog"
         aria-modal="true"
         aria-label="Manajemen CRUD Etalase Karya & Galeri Foto XII PPLG 1"
         className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md sm:p-6"
         onClick={onClose}>
         <div
            className="obsidian-surface relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-indigo-400/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            {/* Header Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
               <div className="flex items-center gap-2.5">
                  <span className="obsidian-pill flex h-9 w-9 items-center justify-center rounded-xl border-indigo-400/40 bg-indigo-500/15 text-indigo-500">
                     <FolderGit2 className="h-4 w-4" />
                  </span>
                  <div>
                     <span className="mono-tabular text-[10px] font-bold tracking-widest text-indigo-600 dark:text-indigo-300 uppercase">
                        FASE 17 · FULL CRUD SUPABASE · TABEL PUBLIC.MEMORIES & STORAGE
                     </span>
                     <h2 className="text-base font-bold text-foreground sm:text-lg">
                        Kelola Etalase Project PPLG 1 & Galeri Foto Kelas
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
                              "Seluruh Project PPLG & Galeri Foto berhasil disinkronkan ke Supabase!"
                           );
                        }}
                        className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-sky-400/45 bg-sky-500/15 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-200 disabled:opacity-50">
                        <CloudUpload className="h-3.5 w-3.5" />
                        <span>
                           {isSyncing
                              ? "Menyinkronkan..."
                              : "Sync Semua ke Supabase"}
                        </span>
                     </button>
                  )}

                  <button
                     type="button"
                     onClick={async () => {
                        await onResetDefaults();
                        setStatusMsg(
                           "Data project & galeri foto dikembalikan ke bawaan awal."
                        );
                     }}
                     className="obsidian-pill inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                     <RotateCcw className="h-3.5 w-3.5" />
                     <span>Reset</span>
                  </button>

                  <button
                     type="button"
                     onClick={onClose}
                     aria-label="Tutup modal CRUD galeri"
                     className="obsidian-pill rounded-xl p-1.5 text-muted-foreground hover:text-foreground">
                     <X className="h-4 w-4" />
                  </button>
               </div>
            </div>

            {/* Tab Switcher: Project Karya vs Galeri Foto */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] px-5 py-3 sm:px-6">
               <div className="flex items-center gap-2">
                  <button
                     type="button"
                     onClick={() => {
                        setActiveTab("projects");
                        setStatusMsg(null);
                        setErrorMsg(null);
                     }}
                     className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                        activeTab === "projects"
                           ? "bg-sky-500/20 text-sky-700 dark:text-sky-200 border border-sky-400/45 glow-cyan"
                           : "obsidian-pill text-muted-foreground hover:text-foreground"
                     }`}>
                     <Code2 className="h-3.5 w-3.5" />
                     <span>Project Karya PPLG ({projects.length})</span>
                  </button>

                  <button
                     type="button"
                     onClick={() => {
                        setActiveTab("photos");
                        setStatusMsg(null);
                        setErrorMsg(null);
                     }}
                     className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                        activeTab === "photos"
                           ? "bg-amber-500/20 text-amber-700 dark:text-amber-200 border border-amber-400/45 glow-amber"
                           : "obsidian-pill text-muted-foreground hover:text-foreground"
                     }`}>
                     <Images className="h-3.5 w-3.5" />
                     <span>Galeri Foto Momen ({photos.length})</span>
                  </button>
               </div>

               <button
                  type="button"
                  onClick={
                     activeTab === "projects"
                        ? resetProjectForm
                        : resetPhotoForm
                  }
                  className="obsidian-pill inline-flex items-center gap-1 rounded-xl border-emerald-400/45 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                     {activeTab === "projects"
                        ? "Form Project Baru"
                        : "Form Foto Baru"}
                  </span>
               </button>
            </div>

            {/* Body Modal */}
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

               {activeTab === "projects" ? (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                     {/* Kiri (5 Kolom): Daftar Project (Card Grid 2 Kolom di HP) */}
                     <div className="flex flex-col gap-2.5 lg:col-span-5">
                        <span className="text-xs font-semibold text-foreground">
                           Klik Kartu untuk Edit / Hapus Karya:
                        </span>
                        <div className="grid max-h-[360px] grid-cols-2 gap-2 overflow-y-auto pr-1">
                           {projects.map((p) => {
                              const active =
                                 prjMode === "edit" && selectedPrjId === p.id;
                              return (
                                 <div
                                    key={p.id}
                                    onClick={() => selectProjectForEdit(p)}
                                    className={`obsidian-pill flex cursor-pointer flex-col justify-between rounded-xl p-2.5 transition ${
                                       active
                                          ? "border-sky-400 bg-sky-500/20 glow-cyan"
                                          : "hover:border-sky-400/35"
                                    }`}>
                                    <div>
                                       <div className="flex items-center justify-between gap-1">
                                          <span className="mono-tabular text-[10px] font-bold text-sky-600 dark:text-sky-300">
                                             {p.code}
                                          </span>
                                          <button
                                             type="button"
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteProject(p.id);
                                             }}
                                             aria-label={`Hapus ${p.title}`}
                                             className="text-rose-500 hover:text-rose-400">
                                             <Trash2 className="h-3 w-3" />
                                          </button>
                                       </div>
                                       <p className="mt-1 line-clamp-2 text-xs font-bold text-foreground">
                                          {p.title}
                                       </p>
                                    </div>
                                    <p className="mt-2 truncate text-[10px] text-muted-foreground">
                                       {p.authorName} · {p.division}
                                    </p>
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     {/* Kanan (7 Kolom): Form Tambah / Edit Project */}
                     <form
                        onSubmit={handleSubmitProject}
                        className="flex flex-col gap-3 lg:col-span-7">
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                           <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-muted-foreground">
                                 Judul Aplikasi / Gim
                              </label>
                              <input
                                 type="text"
                                 required
                                 value={prjTitle}
                                 onChange={(e) => setPrjTitle(e.target.value)}
                                 placeholder="Nama project..."
                                 className="obsidian-pill rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:border-sky-400 focus:outline-none"
                              />
                           </div>

                           <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-muted-foreground">
                                 Divisi Teknis
                              </label>
                              <select
                                 value={prjDivision}
                                 onChange={(e) =>
                                    setPrjDivision(
                                       e.target.value as ProjectDivision
                                    )
                                 }
                                 className="obsidian-pill rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:border-sky-400 focus:outline-none">
                                 {DIVISIONS.map((d) => (
                                    <option key={d} value={d}>
                                       {d}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                           <div className="col-span-2 flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-muted-foreground">
                                 Nama Kreator / Tim Siswa
                              </label>
                              <input
                                 type="text"
                                 required
                                 value={prjAuthorName}
                                 onChange={(e) =>
                                    setPrjAuthorName(e.target.value)
                                 }
                                 placeholder="Hanan Chaliq"
                                 className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                              />
                           </div>

                           <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-muted-foreground">
                                 Absen Kreator (1-22)
                              </label>
                              <input
                                 type="number"
                                 min={1}
                                 max={22}
                                 value={prjAuthorAbsen}
                                 onChange={(e) =>
                                    setPrjAuthorAbsen(Number(e.target.value))
                                 }
                                 className="obsidian-pill mono-tabular rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:border-sky-400 focus:outline-none"
                              />
                           </div>
                        </div>

                        <div className="flex flex-col gap-1">
                           <div className="flex items-center justify-between">
                              <label className="text-[11px] font-semibold text-muted-foreground">
                                 Thumbnail Karya (URL / Upload ke Storage)
                              </label>
                              <label className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-300 hover:underline">
                                 <Upload className="h-3 w-3" />
                                 <span>
                                    {isUploading
                                       ? "Mengunggah..."
                                       : "Upload Screenshot"}
                                 </span>
                                 <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                       handleUploadAsset(e, "projects")
                                    }
                                    className="hidden"
                                 />
                              </label>
                           </div>
                           <input
                              type="text"
                              required
                              value={prjImageUrl}
                              onChange={(e) => setPrjImageUrl(e.target.value)}
                              placeholder="https://..."
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              Ringkasan Fitur / Arsitektur Karya
                           </label>
                           <textarea
                              rows={2}
                              value={prjSummary}
                              onChange={(e) => setPrjSummary(e.target.value)}
                              placeholder="Deskripsi singkat project..."
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                           <input
                              type="text"
                              value={prjTechInput}
                              onChange={(e) => setPrjTechInput(e.target.value)}
                              placeholder="Next.js, Go, Unity"
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                           <input
                              type="url"
                              value={prjRepoUrl}
                              onChange={(e) => setPrjRepoUrl(e.target.value)}
                              placeholder="https://github.com/..."
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                           <input
                              type="text"
                              value={prjCreatedAt}
                              onChange={(e) => setPrjCreatedAt(e.target.value)}
                              placeholder="Mar 2026"
                              className="obsidian-pill mono-tabular rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex justify-end pt-2">
                           <button
                              type="submit"
                              disabled={isSyncing || isUploading}
                              className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-sky-400/50 bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-700 dark:text-sky-200 glow-cyan">
                              <Save className="h-3.5 w-3.5" />
                              <span>
                                 {prjMode === "create"
                                    ? "Tambahkan Karya PPLG"
                                    : "Simpan Perubahan Karya"}
                              </span>
                           </button>
                        </div>
                     </form>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                     {/* Kiri (5 Kolom): Daftar Foto Galeri (Card Grid 2 Kolom di HP) */}
                     <div className="flex flex-col gap-2.5 lg:col-span-5">
                        <span className="text-xs font-semibold text-foreground">
                           Klik Foto untuk Edit / Hapus Dokumentasi:
                        </span>
                        <div className="grid max-h-[360px] grid-cols-2 gap-2 overflow-y-auto pr-1">
                           {photos.map((m) => {
                              const active =
                                 phoMode === "edit" && selectedPhoId === m.id;
                              return (
                                 <div
                                    key={m.id}
                                    onClick={() => selectPhotoForEdit(m)}
                                    className={`obsidian-pill flex cursor-pointer flex-col justify-between rounded-xl p-2.5 transition ${
                                       active
                                          ? "border-amber-400 bg-amber-500/20 glow-amber"
                                          : "hover:border-amber-400/35"
                                    }`}>
                                    <div>
                                       <div className="flex items-center justify-between gap-1">
                                          <span className="mono-tabular text-[10px] font-bold text-amber-600 dark:text-amber-300">
                                             {m.code}
                                          </span>
                                          <button
                                             type="button"
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                onDeletePhoto(m.id);
                                             }}
                                             aria-label={`Hapus ${m.title}`}
                                             className="text-rose-500 hover:text-rose-400">
                                             <Trash2 className="h-3 w-3" />
                                          </button>
                                       </div>
                                       <p className="mt-1 line-clamp-2 text-xs font-bold text-foreground">
                                          {m.title}
                                       </p>
                                    </div>
                                    <p className="mt-2 truncate text-[10px] text-muted-foreground">
                                       {m.takenDate} · {m.tag}
                                    </p>
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     {/* Kanan (7 Kolom): Form Tambah / Edit Foto Galeri */}
                     <form
                        onSubmit={handleSubmitPhoto}
                        className="flex flex-col gap-3 lg:col-span-7">
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                           <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-muted-foreground">
                                 Judul Momen / Dokumentasi
                              </label>
                              <input
                                 type="text"
                                 required
                                 value={phoTitle}
                                 onChange={(e) => setPhoTitle(e.target.value)}
                                 placeholder="Judul momen kelas..."
                                 className="obsidian-pill rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:border-amber-400 focus:outline-none"
                              />
                           </div>

                           <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-muted-foreground">
                                 Kategori Momen
                              </label>
                              <select
                                 value={phoTag}
                                 onChange={(e) =>
                                    setPhoTag(
                                       e.target.value as ClassGalleryMemoryItem["tag"]
                                    )
                                 }
                                 className="obsidian-pill rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:border-amber-400 focus:outline-none">
                                 {GALLERY_TAGS.map((tag) => (
                                    <option key={tag} value={tag}>
                                       {tag}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>

                        <div className="flex flex-col gap-1">
                           <div className="flex items-center justify-between">
                              <label className="text-[11px] font-semibold text-muted-foreground">
                                 File Foto (URL / Upload ke Supabase Storage)
                              </label>
                              <label className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-300 hover:underline">
                                 <Upload className="h-3 w-3" />
                                 <span>
                                    {isUploading
                                       ? "Mengunggah..."
                                       : "Upload Foto Momen"}
                                 </span>
                                 <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                       handleUploadAsset(e, "gallery")
                                    }
                                    className="hidden"
                                 />
                              </label>
                           </div>
                           <input
                              type="text"
                              required
                              value={phoImageUrl}
                              onChange={(e) => setPhoImageUrl(e.target.value)}
                              placeholder="https://..."
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-amber-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              Cerita / Deskripsi Momen
                           </label>
                           <textarea
                              rows={2}
                              value={phoDesc}
                              onChange={(e) => setPhoDesc(e.target.value)}
                              placeholder="Ceritakan momen dokumentasi ini..."
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-amber-400 focus:outline-none"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                           <input
                              type="text"
                              value={phoDate}
                              onChange={(e) => setPhoDate(e.target.value)}
                              placeholder="18 Apr 2026"
                              className="obsidian-pill mono-tabular rounded-xl px-3 py-2 text-xs text-foreground focus:border-amber-400 focus:outline-none"
                           />
                           <input
                              type="text"
                              value={phoLocation}
                              onChange={(e) => setPhoLocation(e.target.value)}
                              placeholder="Lab RPL Utama"
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-amber-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex justify-end pt-2">
                           <button
                              type="submit"
                              disabled={isSyncing || isUploading}
                              className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-amber-400/50 bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-200 glow-amber">
                              <Save className="h-3.5 w-3.5" />
                              <span>
                                 {phoMode === "create"
                                    ? "Tambahkan ke Galeri Foto"
                                    : "Simpan Perubahan Foto"}
                              </span>
                           </button>
                        </div>
                     </form>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
