"use client";

import * as React from "react";
import {
   CheckCircle2,
   CloudUpload,
   Plus,
   RotateCcw,
   Save,
   Trash2,
   Upload,
   UserCheck,
   UserPlus,
   Users,
   X,
} from "lucide-react";
import { type ClassStudent } from "@/app/types/class-system";
import { uploadClassAsset } from "@/lib/supabase/client";

interface StudentCrudModalProps {
   isOpen: boolean;
   students: ClassStudent[];
   initialSelectedStudent?: ClassStudent | null;
   isSupabaseConnected: boolean;
   isSyncing: boolean;
   onClose: () => void;
   onSaveStudent: (student: ClassStudent, isNew: boolean) => Promise<void>;
   onDeleteStudent: (studentId: string) => Promise<void>;
   onSyncAllToSupabase: () => Promise<void>;
   onResetDefaultStudents: () => Promise<void>;
}

const DIVISIONS: ClassStudent["division"][] = [
   "Frontend",
   "Backend",
   "UI/UX & Creative",
   "Game & Mobile",
];

export function StudentCrudModal({
   isOpen,
   students,
   initialSelectedStudent,
   isSupabaseConnected,
   isSyncing,
   onClose,
   onSaveStudent,
   onDeleteStudent,
   onSyncAllToSupabase,
   onResetDefaultStudents,
}: StudentCrudModalProps) {
   const [mode, setMode] = React.useState<"edit" | "create">("edit");
   const [selectedId, setSelectedId] = React.useState<string>(
      initialSelectedStudent?.id ?? students[0]?.id ?? "pplg1-01"
   );

   // Form state
   const [absen, setAbsen] = React.useState<number>(1);
   const [name, setName] = React.useState<string>("");
   const [role, setRole] = React.useState<string>("");
   const [division, setDivision] =
      React.useState<ClassStudent["division"]>("Frontend");
   const [image, setImage] = React.useState<string>("");
   const [bio, setBio] = React.useState<string>("");
   const [tagsInput, setTagsInput] = React.useState<string>("");
   const [linkLabel, setLinkLabel] = React.useState<string>("");
   const [linkHref, setLinkHref] = React.useState<string>("");
   const [tone, setTone] = React.useState<1 | 2 | 3 | 4 | 5>(1);

   const [isUploading, setIsUploading] = React.useState(false);
   const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
   const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

   const populateFormFromStudent = React.useCallback((s: ClassStudent) => {
      setAbsen(s.absen);
      setName(s.name);
      setRole(s.role);
      setDivision(s.division);
      setImage(s.image);
      setBio(s.bio ?? "");
      setTagsInput((s.tags ?? []).join(", "));
      setLinkLabel(s.links?.[0]?.label ?? "");
      setLinkHref(s.links?.[0]?.href ?? "https://github.com");
      setTone((s.tone as 1 | 2 | 3 | 4 | 5) ?? 1);
   }, []);

   React.useEffect(() => {
      if (!isOpen) return;
      setStatusMsg(null);
      setErrorMsg(null);

      if (initialSelectedStudent) {
         setMode("edit");
         setSelectedId(initialSelectedStudent.id);
         populateFormFromStudent(initialSelectedStudent);
      } else if (students.length > 0) {
         const first =
            students.find((s) => s.id === selectedId) ?? students[0]!;
         setMode("edit");
         setSelectedId(first.id);
         populateFormFromStudent(first);
      }
   }, [
      isOpen,
      initialSelectedStudent,
      students,
      selectedId,
      populateFormFromStudent,
   ]);

   if (!isOpen) return null;

   const handleSelectExisting = (student: ClassStudent) => {
      setMode("edit");
      setSelectedId(student.id);
      setStatusMsg(null);
      setErrorMsg(null);
      populateFormFromStudent(student);
   };

   const handleSwitchToCreate = () => {
      const nextAbsen =
         students.reduce((max, s) => Math.max(max, s.absen), 0) + 1;
      setMode("create");
      setStatusMsg(null);
      setErrorMsg(null);
      setAbsen(nextAbsen);
      setName("");
      setRole("Full-Stack Developer");
      setDivision("Frontend");
      setImage(
         "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
      );
      setBio("Anggota keluarga besar XII PPLG 1 — Angkatan 2026.");
      setTagsInput("Next.js, TypeScript, Supabase");
      setLinkLabel("github.com/username");
      setLinkHref("https://github.com");
      setTone(1);
   };

   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      setErrorMsg(null);
      setStatusMsg(null);

      const { publicUrl, error } = await uploadClassAsset(file, "avatars");
      setIsUploading(false);

      if (error || !publicUrl) {
         setErrorMsg(error ?? "Gagal mengunggah foto profil siswa.");
         return;
      }

      setImage(publicUrl);
      setStatusMsg(
         isSupabaseConnected
            ? "Foto berhasil diunggah ke Supabase Storage (class-assets/avatars)."
            : "Foto berhasil dimuat (Mode Lokal Data URL)."
      );
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      setStatusMsg(null);

      if (!name.trim() || !role.trim() || !image.trim()) {
         setErrorMsg("Nama lengkap, role, dan URL/file foto wajib diisi.");
         return;
      }

      const paddedAbsen = String(absen).padStart(2, "0");
      const studentId =
         mode === "create" ? `pplg1-${paddedAbsen}-${Date.now().toString().slice(-3)}` : selectedId;

      const parsedTags = tagsInput
         .split(",")
         .map((t) => t.trim())
         .filter(Boolean);

      const updatedStudent: ClassStudent = {
         id: studentId,
         absen: Number(absen) || 1,
         name: name.trim(),
         role: role.trim(),
         team: `XII PPLG 1 · #${paddedAbsen}`,
         division,
         image: image.trim(),
         bio: bio.trim(),
         tags: parsedTags.length > 0 ? parsedTags : ["PPLG 1"],
         links: linkLabel.trim()
            ? [
                 {
                    label: linkLabel.trim(),
                    href: linkHref.trim() || "https://github.com",
                 },
              ]
            : [],
         tone,
         drop: (Number(absen) * 7) % 22,
      };

      await onSaveStudent(updatedStudent, mode === "create");
      setMode("edit");
      setSelectedId(updatedStudent.id);
      setStatusMsg(
         isSupabaseConnected
            ? `Data #${paddedAbsen} ${updatedStudent.name} berhasil disimpan ke Supabase & ID Card 3D!`
            : `Data #${paddedAbsen} ${updatedStudent.name} berhasil diperbarui di ID Card 3D!`
      );
   };

   const handleDelete = async () => {
      if (mode === "create") return;
      if (students.length <= 1) {
         setErrorMsg("Minimal harus tersisa 1 siswa di dalam rel ID Card.");
         return;
      }
      await onDeleteStudent(selectedId);
      const remaining = students.filter((s) => s.id !== selectedId);
      if (remaining[0]) {
         handleSelectExisting(remaining[0]);
      }
      setStatusMsg("Data siswa berhasil dihapus.");
   };

   return (
      <div
         role="dialog"
         aria-modal="true"
         aria-label="Manajemen CRUD Data 22 Siswa XII PPLG 1"
         className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md sm:p-6"
         onClick={onClose}>
         <div
            className="obsidian-surface relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-sky-400/35 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            {/* Header Modal CRUD Siswa */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
               <div className="flex items-center gap-2.5">
                  <span className="obsidian-pill flex h-9 w-9 items-center justify-center rounded-xl border-sky-400/40 bg-sky-500/15 text-sky-500">
                     <Users className="h-4 w-4" />
                  </span>
                  <div>
                     <span className="mono-tabular text-[10px] font-bold tracking-widest text-sky-600 dark:text-sky-300 uppercase">
                        FASE 15 · FULL CRUD SUPABASE · TABEL PUBLIC.STUDENTS
                     </span>
                     <h2 className="text-base font-bold text-foreground sm:text-lg">
                        Manajemen Biodata & ID Card 3D Siswa ({students.length} Anggota)
                     </h2>
                  </div>
               </div>

               <div className="flex flex-wrap items-center gap-2">
                  <button
                     type="button"
                     onClick={handleSwitchToCreate}
                     className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-emerald-400/45 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                     <UserPlus className="h-3.5 w-3.5" />
                     <span>+ Siswa Baru</span>
                  </button>

                  {isSupabaseConnected && (
                     <button
                        type="button"
                        disabled={isSyncing}
                        onClick={async () => {
                           await onSyncAllToSupabase();
                           setStatusMsg(
                              "Seluruh daftar siswa berhasil disinkronkan (Upsert) ke tabel Supabase public.students!"
                           );
                        }}
                        className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-sky-400/45 bg-sky-500/15 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-200 disabled:opacity-50">
                        <CloudUpload className="h-3.5 w-3.5" />
                        <span>
                           {isSyncing ? "Menyinkronkan..." : "Sync Semua ke Supabase"}
                        </span>
                     </button>
                  )}

                  <button
                     type="button"
                     onClick={onClose}
                     aria-label="Tutup modal CRUD siswa"
                     className="obsidian-pill rounded-xl p-1.5 text-muted-foreground hover:text-foreground">
                     <X className="h-4 w-4" />
                  </button>
               </div>
            </div>

            {/* Body Modal: Pemilih Nomor Absen + Form Edit Lengkap */}
            <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 sm:p-6 lg:grid-cols-12">
               {/* Kiri (4 Kolom Desktop): Daftar Cepat Siswa (Card Grid 2 Kolom di HP) */}
               <div className="flex flex-col gap-3 lg:col-span-5">
                  <div className="flex items-center justify-between text-xs">
                     <span className="font-semibold text-foreground">
                        Pilih Anggota Kelas (01–{String(students.length).padStart(2, "0")}):
                     </span>
                     <button
                        type="button"
                        onClick={async () => {
                           await onResetDefaultStudents();
                           setStatusMsg("Data 22 siswa dikembalikan ke bawaan awal.");
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground">
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset Default</span>
                     </button>
                  </div>

                  {/* Card Grid 2 Kolom untuk Memilih Siswa */}
                  <div className="grid max-h-[360px] grid-cols-2 gap-2 overflow-y-auto pr-1 lg:max-h-[460px]">
                     {students.map((s) => {
                        const isSelected =
                           mode === "edit" && s.id === selectedId;
                        const code = String(s.absen).padStart(2, "0");
                        return (
                           <button
                              key={s.id}
                              type="button"
                              onClick={() => handleSelectExisting(s)}
                              className={`obsidian-pill flex items-center gap-2 rounded-xl p-2 text-left transition ${
                                 isSelected
                                    ? "border-sky-400 bg-sky-500/20 glow-cyan"
                                    : "hover:border-sky-400/35"
                              }`}>
                              <span className="mono-tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-[10px] font-bold text-sky-600 dark:text-sky-300">
                                 #{code}
                              </span>
                              <div className="min-w-0">
                                 <p className="truncate text-xs font-bold text-foreground">
                                    {s.name}
                                 </p>
                                 <p className="truncate text-[10px] text-muted-foreground">
                                    {s.division}
                                 </p>
                              </div>
                           </button>
                        );
                     })}
                  </div>
               </div>

               {/* Kanan (7 Kolom Desktop): Form Biodata & Foto ID Card 3D */}
               <form
                  onSubmit={handleSubmit}
                  className="flex flex-col justify-between gap-4 lg:col-span-7">
                  <div className="flex flex-col gap-3.5">
                     <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-300">
                           {mode === "create" ? (
                              <>
                                 <Plus className="h-3.5 w-3.5" />
                                 <span>Tambah Anggota Baru ke Rel 3D</span>
                              </>
                           ) : (
                              <>
                                 <UserCheck className="h-3.5 w-3.5" />
                                 <span>
                                    Edit ID Card #{String(absen).padStart(2, "0")} — {name}
                                 </span>
                              </>
                           )}
                        </span>
                        <span className="mono-tabular text-[11px] text-muted-foreground">
                           ID: {mode === "create" ? "AUTO" : selectedId}
                        </span>
                     </div>

                     {statusMsg && (
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-200">
                           <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                           <span>{statusMsg}</span>
                        </div>
                     )}

                     {errorMsg && (
                        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-300">
                           {errorMsg}
                        </div>
                     )}

                     {/* Baris 1: Nomor Absen, Nama Lengkap & Tone Warna */}
                     <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              No. Absen
                           </label>
                           <input
                              type="number"
                              min={1}
                              max={99}
                              required
                              value={absen}
                              onChange={(e) => setAbsen(Number(e.target.value))}
                              className="obsidian-pill mono-tabular rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>

                        <div className="col-span-1 flex flex-col gap-1 sm:col-span-2">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              Nama Lengkap Siswa
                           </label>
                           <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Nama siswa..."
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              Tone Lanyard (1-5)
                           </label>
                           <select
                              value={tone}
                              onChange={(e) =>
                                 setTone(
                                    Number(e.target.value) as 1 | 2 | 3 | 4 | 5
                                 )
                              }
                              className="obsidian-pill mono-tabular rounded-xl px-2.5 py-2 text-xs font-semibold text-foreground focus:border-sky-400 focus:outline-none">
                              <option value={1}>Tone 1 (Cyan)</option>
                              <option value={2}>Tone 2 (Emerald)</option>
                              <option value={3}>Tone 3 (Amber)</option>
                              <option value={4}>Tone 4 (Indigo)</option>
                              <option value={5}>Tone 5 (Rose)</option>
                           </select>
                        </div>
                     </div>

                     {/* Baris 2: Role Spesialisasi & Divisi Teknis */}
                     <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              Role / Spesialisasi
                           </label>
                           <input
                              type="text"
                              required
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                              placeholder="Full-Stack Developer"
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              Divisi Teknis PPLG 1
                           </label>
                           <select
                              value={division}
                              onChange={(e) =>
                                 setDivision(
                                    e.target.value as ClassStudent["division"]
                                 )
                              }
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:border-sky-400 focus:outline-none">
                              {DIVISIONS.map((div) => (
                                 <option key={div} value={div}>
                                    {div}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {/* Baris 3: Foto Profil (URL + Upload ke Supabase Storage) */}
                     <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              Foto ID Card (URL / Upload File ke Storage)
                           </label>
                           <label className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-300 hover:underline">
                              <Upload className="h-3 w-3" />
                              <span>
                                 {isUploading
                                    ? "Mengunggah..."
                                    : "Upload File Foto"}
                              </span>
                              <input
                                 type="file"
                                 accept="image/*"
                                 onChange={handleFileUpload}
                                 className="hidden"
                              />
                           </label>
                        </div>

                        <div className="flex items-center gap-2.5">
                           <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-slate-900">
                              {image && (
                                 // eslint-disable-next-line @next/next/no-img-element
                                 <img
                                    src={image}
                                    alt={name}
                                    className="h-full w-full object-cover"
                                 />
                              )}
                           </div>
                           <input
                              type="text"
                              required
                              value={image}
                              onChange={(e) => setImage(e.target.value)}
                              placeholder="https://..."
                              className="obsidian-pill w-full rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>
                     </div>

                     {/* Baris 4: Bio Belakang ID Card 3D */}
                     <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">
                           Bio / Catatan di Sisi Belakang ID Card 3D
                        </label>
                        <textarea
                           rows={2}
                           value={bio}
                           onChange={(e) => setBio(e.target.value)}
                           placeholder="Tulis bio singkat siswa..."
                           className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                        />
                     </div>

                     {/* Baris 5: Tech Stack Tags & Link Portofolio */}
                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              Tech Stack (Pisahkan Koma)
                           </label>
                           <input
                              type="text"
                              value={tagsInput}
                              onChange={(e) => setTagsInput(e.target.value)}
                              placeholder="Next.js, Supabase, Go"
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              Label Portofolio
                           </label>
                           <input
                              type="text"
                              value={linkLabel}
                              onChange={(e) => setLinkLabel(e.target.value)}
                              placeholder="github.com/username"
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>

                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold text-muted-foreground">
                              URL Portofolio
                           </label>
                           <input
                              type="url"
                              value={linkHref}
                              onChange={(e) => setLinkHref(e.target.value)}
                              placeholder="https://github.com"
                              className="obsidian-pill rounded-xl px-3 py-2 text-xs text-foreground focus:border-sky-400 focus:outline-none"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Footer Tombol Simpan & Hapus */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3.5">
                     {mode === "edit" ? (
                        <button
                           type="button"
                           onClick={handleDelete}
                           disabled={isSyncing}
                           className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-rose-400/40 bg-rose-500/15 px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-200 hover:bg-rose-500/25">
                           <Trash2 className="h-3.5 w-3.5" />
                           <span>Hapus Siswa</span>
                        </button>
                     ) : (
                        <span className="text-xs text-muted-foreground">
                           Mode tambah siswa baru
                        </span>
                     )}

                     <div className="flex items-center gap-2">
                        <button
                           type="button"
                           onClick={onClose}
                           className="obsidian-pill rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground">
                           Selesai
                        </button>
                        <button
                           type="submit"
                           disabled={isSyncing || isUploading}
                           className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-sky-400/50 bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-700 dark:text-sky-200 glow-cyan disabled:opacity-50">
                           <Save className="h-3.5 w-3.5" />
                           <span>
                              {isSyncing
                                 ? "Menyimpan..."
                                 : mode === "create"
                                   ? "Tambahkan ke Rel 3D"
                                   : "Simpan Perubahan ID Card"}
                           </span>
                        </button>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}
