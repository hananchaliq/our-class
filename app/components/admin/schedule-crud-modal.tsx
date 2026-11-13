"use client";

import * as React from "react";
import {
   BookOpen,
   Brush,
   CalendarClock,
   CheckCircle2,
   CloudUpload,
   Pencil,
   Plus,
   RotateCcw,
   Save,
   Trash2,
   X,
} from "lucide-react";
import {
   INITIAL_CLASS_SCHEDULES,
   INITIAL_PIKET_GROUPS,
   SCHOOL_DAYS,
   type DayPiketConfig,
   type ScheduleSubjectItem,
   type SchoolDayName,
} from "../schedule/class-schedule-archive";
import {
   INITIAL_PPLG1_STUDENTS,
   type ClassStudent,
} from "@/app/types/class-system";
import {
   getSupabaseBrowserClient,
   isSupabaseConfigured,
} from "@/lib/supabase/client";

interface ScheduleCrudModalProps {
   isOpen: boolean;
   onClose: () => void;
   schedules: ScheduleSubjectItem[];
   piketGroups: DayPiketConfig[];
   students?: ClassStudent[];
   initialSelectedDay?: SchoolDayName;
   onSaveSchedulesAndPiket: (
      nextSchedules: ScheduleSubjectItem[],
      nextPiketGroups: DayPiketConfig[]
   ) => Promise<void> | void;
   onResetDefault: () => Promise<void> | void;
   onSyncAllToSupabase?: () => Promise<void>;
}

export function ScheduleCrudModal({
   isOpen,
   onClose,
   schedules,
   piketGroups,
   students = INITIAL_PPLG1_STUDENTS,
   initialSelectedDay = "Senin",
   onSaveSchedulesAndPiket,
   onResetDefault,
   onSyncAllToSupabase,
}: ScheduleCrudModalProps) {
   const [activeTab, setActiveTab] = React.useState<"lessons" | "piket">(
      "lessons"
   );
   const [selectedDay, setSelectedDay] =
      React.useState<SchoolDayName>(initialSelectedDay);

   // Form state untuk Mata Pelajaran (Lessons)
   const [editingSubjectId, setEditingSubjectId] = React.useState<
      string | null
   >(null);
   const [slotCode, setSlotCode] = React.useState("JAM 01–03");
   const [timeRange, setTimeRange] = React.useState("07:00 – 09:15");
   const [subjectName, setSubjectName] = React.useState("");
   const [category, setCategory] = React.useState<"produktif" | "umum">(
      "produktif"
   );
   const [roomOrNote, setRoomOrNote] = React.useState("Lab RPL 1");
   const [teacherOrFocus, setTeacherOrFocus] = React.useState("");

   // Form state untuk Regu Piket Harian
   const [shortCode, setShortCode] = React.useState("REGU 01");
   const [zoneFocus, setZoneFocus] = React.useState("");
   const [selectedAbsenList, setSelectedAbsenList] = React.useState<number[]>(
      []
   );

   const [isSaving, setIsSaving] = React.useState(false);
   const [isSyncing, setIsSyncing] = React.useState(false);
   const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);
   const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

   // Sinkronkan hari aktif saat modal dibuka
   React.useEffect(() => {
      if (isOpen) {
         setSelectedDay(initialSelectedDay);
         setFeedbackMsg(null);
         setErrorMsg(null);
      }
   }, [isOpen, initialSelectedDay]);

   // Muat konfigurasi piket hari terpilih
   React.useEffect(() => {
      const currentPiket =
         piketGroups.find((g) => g.day === selectedDay) ??
         INITIAL_PIKET_GROUPS.find((g) => g.day === selectedDay) ??
         INITIAL_PIKET_GROUPS[0];

      if (currentPiket) {
         setShortCode(currentPiket.shortCode);
         setZoneFocus(currentPiket.zoneFocus);
         setSelectedAbsenList([...currentPiket.absenList].sort((a, b) => a - b));
      }
      resetLessonForm();
   }, [selectedDay, piketGroups]);

   // Tutup dengan tombol Escape
   React.useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isOpen, onClose]);

   if (!isOpen) return null;

   const dayLessons = schedules.filter((item) => item.day === selectedDay);

   function resetLessonForm() {
      setEditingSubjectId(null);
      setSlotCode("JAM 01–03");
      setTimeRange("07:00 – 09:15");
      setSubjectName("");
      setCategory("produktif");
      setRoomOrNote("Lab RPL 1");
      setTeacherOrFocus("");
   }

   const handleSelectLessonToEdit = (item: ScheduleSubjectItem) => {
      setEditingSubjectId(item.id);
      setSlotCode(item.slotCode);
      setTimeRange(item.timeRange);
      setSubjectName(item.subjectName);
      setCategory(item.category);
      setRoomOrNote(item.roomOrNote);
      setTeacherOrFocus(item.teacherOrFocus);
      setFeedbackMsg(null);
      setErrorMsg(null);
   };

   const handleSubmitLesson = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!subjectName.trim()) {
         setErrorMsg("Nama mata pelajaran wajib diisi.");
         return;
      }

      setIsSaving(true);
      setErrorMsg(null);
      setFeedbackMsg(null);

      try {
         const newOrUpdated: ScheduleSubjectItem = {
            id:
               editingSubjectId ??
               `${selectedDay.toLowerCase()}-${Date.now().toString(36)}`,
            day: selectedDay,
            slotCode: slotCode.trim() || "JAM 01–02",
            timeRange: timeRange.trim() || "07:00 – 08:30",
            subjectName: subjectName.trim(),
            category,
            roomOrNote: roomOrNote.trim() || "Lab RPL 1",
            teacherOrFocus:
               teacherOrFocus.trim() || "Materi Produktif XII PPLG 1",
         };

         const nextSchedules = editingSubjectId
            ? schedules.map((s) =>
                 s.id === editingSubjectId ? newOrUpdated : s
              )
            : [...schedules, newOrUpdated];

         await onSaveSchedulesAndPiket(nextSchedules, piketGroups);
         setFeedbackMsg(
            editingSubjectId
               ? `Sesi "${newOrUpdated.subjectName}" pada hari ${selectedDay} berhasil diperbarui.`
               : `Sesi baru "${newOrUpdated.subjectName}" ditambahkan ke hari ${selectedDay}.`
         );
         resetLessonForm();
      } catch (err) {
         setErrorMsg(
            err instanceof Error
               ? err.message
               : "Gagal menyimpan sesi pelajaran."
         );
      } finally {
         setIsSaving(false);
      }
   };

   const handleDeleteLesson = async (item: ScheduleSubjectItem) => {
      setIsSaving(true);
      setErrorMsg(null);
      setFeedbackMsg(null);

      try {
         const nextSchedules = schedules.filter((s) => s.id !== item.id);
         await onSaveSchedulesAndPiket(nextSchedules, piketGroups);
         if (editingSubjectId === item.id) {
            resetLessonForm();
         }
         setFeedbackMsg(
            `Sesi "${item.subjectName}" dihapus dari jadwal hari ${selectedDay}.`
         );
      } catch (err) {
         setErrorMsg(
            err instanceof Error ? err.message : "Gagal menghapus sesi pelajaran."
         );
      } finally {
         setIsSaving(false);
      }
   };

   const handleToggleAbsenMember = (absenNum: number) => {
      setSelectedAbsenList((prev) =>
         prev.includes(absenNum)
            ? prev.filter((n) => n !== absenNum)
            : [...prev, absenNum].sort((a, b) => a - b)
      );
   };

   const handleSavePiketDay = async (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedAbsenList.length === 0) {
         setErrorMsg("Pilih minimal 1 nomor absen siswa untuk regu piket ini.");
         return;
      }

      setIsSaving(true);
      setErrorMsg(null);
      setFeedbackMsg(null);

      try {
         const updatedGroup: DayPiketConfig = {
            day: selectedDay,
            shortCode: shortCode.trim() || "REGU PIKET",
            zoneFocus:
               zoneFocus.trim() || "Area Lab RPL & Ruang Kelas XII PPLG 1",
            absenList: [...selectedAbsenList].sort((a, b) => a - b),
         };

         const exists = piketGroups.some((g) => g.day === selectedDay);
         const nextPiketGroups = exists
            ? piketGroups.map((g) =>
                 g.day === selectedDay ? updatedGroup : g
              )
            : [...piketGroups, updatedGroup];

         await onSaveSchedulesAndPiket(schedules, nextPiketGroups);
         setFeedbackMsg(
            `Regu piket hari ${selectedDay} (${updatedGroup.absenList.length} siswa) berhasil disimpan.`
         );
      } catch (err) {
         setErrorMsg(
            err instanceof Error ? err.message : "Gagal menyimpan regu piket."
         );
      } finally {
         setIsSaving(false);
      }
   };

   const handleTriggerSync = async () => {
      if (!onSyncAllToSupabase) return;
      setIsSyncing(true);
      setErrorMsg(null);
      setFeedbackMsg(null);
      try {
         await onSyncAllToSupabase();
         setFeedbackMsg(
            "Seluruh jadwal 6 hari (Senin–Sabtu) & regu piket berhasil disinkronkan ke tabel public.schedules Supabase."
         );
      } catch (err) {
         setErrorMsg(
            err instanceof Error
               ? err.message
               : "Gagal melakukan sinkronisasi ke Supabase."
         );
      } finally {
         setIsSyncing(false);
      }
   };

   const handleTriggerReset = async () => {
      setIsSaving(true);
      setErrorMsg(null);
      setFeedbackMsg(null);
      try {
         await onResetDefault();
         setFeedbackMsg(
            "Jadwal mata pelajaran & regu piket berhasil dikembalikan ke data awal XII PPLG 1."
         );
         resetLessonForm();
      } finally {
         setIsSaving(false);
      }
   };

   const supabaseReady =
      isSupabaseConfigured() && Boolean(getSupabaseBrowserClient());

   return (
      <div
         role="dialog"
         aria-modal="true"
         aria-labelledby="schedule-crud-modal-title"
         className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-md sm:p-5">
         <div className="obsidian-surface flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-2xl">
            {/* =================================================================
             1. HEADER MODAL CRUD JADWAL & PIKET
            ================================================================= */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
               <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-300">
                     <CalendarClock className="h-4 w-4" />
                     <span className="mono-tabular tracking-widest uppercase">
                        ADMIN CRUD · JADWAL MAPEL & PIKET HARIAN
                     </span>
                  </div>
                  <h2
                     id="schedule-crud-modal-title"
                     className="mt-0.5 text-base font-bold text-foreground sm:text-lg">
                     Kelola Jadwal Produktif & Regu Piket 22 Siswa (Senin–Sabtu)
                  </h2>
               </div>

               <div className="flex flex-wrap items-center gap-2">
                  <span
                     className={`mono-tabular inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold ${
                        supabaseReady
                           ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                           : "border-amber-400/40 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                     }`}>
                     <span
                        className={`h-1.5 w-1.5 rounded-full ${
                           supabaseReady ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                     />
                     {supabaseReady
                        ? "SUPABASE PUBLIC.SCHEDULES READY"
                        : "MODE PENYIMPANAN LOKAL"}
                  </span>

                  <button
                     type="button"
                     onClick={onClose}
                     aria-label="Tutup modal kelola jadwal"
                     className="obsidian-pill inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground">
                     <X className="h-4 w-4" />
                  </button>
               </div>
            </div>

            {/* =================================================================
             2. PEMILIH HARI (SENIN - SABTU) & TAB MODE (MAPEL / PIKET)
            ================================================================= */}
            <div className="flex flex-col gap-3 border-b border-[var(--color-border)] bg-[var(--color-elevated)]/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
               {/* Pemilih 6 Hari */}
               <div className="flex flex-wrap items-center gap-1.5">
                  {SCHOOL_DAYS.map((d) => {
                     const active = selectedDay === d.day;
                     return (
                        <button
                           key={d.day}
                           type="button"
                           onClick={() => setSelectedDay(d.day)}
                           className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                              active
                                 ? "bg-sky-500/20 text-sky-700 dark:text-sky-200 border border-sky-400/45 glow-cyan"
                                 : "obsidian-pill text-muted-foreground hover:text-foreground"
                           }`}>
                           {d.day}
                        </button>
                     );
                  })}
               </div>

               {/* Tab Sub-Editor: Mata Pelajaran vs Regu Piket */}
               <div className="obsidian-pill inline-flex items-center gap-1 self-start rounded-xl p-1 sm:self-auto">
                  <button
                     type="button"
                     onClick={() => setActiveTab("lessons")}
                     className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        activeTab === "lessons"
                           ? "bg-sky-500/20 text-sky-700 dark:text-sky-200 border border-sky-400/35"
                           : "text-muted-foreground hover:text-foreground"
                     }`}>
                     <BookOpen className="h-3.5 w-3.5" />
                     <span>Mata Pelajaran ({dayLessons.length})</span>
                  </button>

                  <button
                     type="button"
                     onClick={() => setActiveTab("piket")}
                     className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        activeTab === "piket"
                           ? "bg-amber-500/20 text-amber-700 dark:text-amber-200 border border-amber-400/35"
                           : "text-muted-foreground hover:text-foreground"
                     }`}>
                     <Brush className="h-3.5 w-3.5" />
                     <span>Regu Piket ({selectedAbsenList.length} Siswa)</span>
                  </button>
               </div>
            </div>

            {/* Notifikasi Status */}
            {(feedbackMsg || errorMsg) && (
               <div className="px-5 pt-3">
                  {feedbackMsg && (
                     <div className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-3.5 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-200">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{feedbackMsg}</span>
                     </div>
                  )}
                  {errorMsg && (
                     <div className="flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/15 px-3.5 py-2 text-xs font-medium text-rose-700 dark:text-rose-200">
                        <span>{errorMsg}</span>
                     </div>
                  )}
               </div>
            )}

            {/* =================================================================
             3. BODY MODAL: TAB MATA PELAJARAN ATAU TAB REGU PIKET
            ================================================================= */}
            <div className="flex-1 overflow-y-auto p-5">
               {activeTab === "lessons" ? (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                     {/* Kolom Kiri: Daftar Sesi Pelajaran Hari Terpilih */}
                     <div className="flex flex-col gap-3 lg:col-span-7">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                              Daftar Sesi Hari {selectedDay} ({dayLessons.length}{" "}
                              Mapel)
                           </h3>
                           <button
                              type="button"
                              onClick={resetLessonForm}
                              className="obsidian-pill inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-sky-600 dark:text-sky-300">
                              <Plus className="h-3 w-3" />
                              <span>Sesi Baru</span>
                           </button>
                        </div>

                        {dayLessons.length === 0 ? (
                           <div className="obsidian-pill rounded-xl p-6 text-center text-xs text-muted-foreground">
                              Belum ada sesi pelajaran untuk hari {selectedDay}.
                              Tambahkan melalui formulir di sebelah kanan.
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              {dayLessons.map((item) => {
                                 const isEditing =
                                    editingSubjectId === item.id;
                                 return (
                                    <div
                                       key={item.id}
                                       className={`obsidian-pill flex flex-col justify-between rounded-xl p-3.5 transition ${
                                          isEditing
                                             ? "border-sky-400/60 bg-sky-500/15 glow-cyan"
                                             : ""
                                       }`}>
                                       <div>
                                          <div className="flex items-center justify-between gap-1 text-[10px]">
                                             <span className="mono-tabular font-bold text-sky-600 dark:text-sky-300">
                                                {item.slotCode}
                                             </span>
                                             <span className="mono-tabular text-muted-foreground">
                                                {item.timeRange}
                                             </span>
                                          </div>
                                          <h4 className="mt-1.5 text-xs font-bold text-foreground sm:text-sm">
                                             {item.subjectName}
                                          </h4>
                                          <p className="mt-1 text-[11px] text-muted-foreground">
                                             {item.teacherOrFocus}
                                          </p>
                                       </div>

                                       <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-2 text-[10px]">
                                          <span className="font-medium text-muted-foreground">
                                             {item.roomOrNote} ·{" "}
                                             <strong className="uppercase text-foreground">
                                                {item.category}
                                             </strong>
                                          </span>

                                          <div className="flex items-center gap-1">
                                             <button
                                                type="button"
                                                onClick={() =>
                                                   handleSelectLessonToEdit(item)
                                                }
                                                className="obsidian-pill inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-sky-600 dark:text-sky-300">
                                                <Pencil className="h-2.5 w-2.5" />
                                                <span>Edit</span>
                                             </button>
                                             <button
                                                type="button"
                                                disabled={isSaving}
                                                onClick={() =>
                                                   handleDeleteLesson(item)
                                                }
                                                className="obsidian-pill inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-rose-600 dark:text-rose-300">
                                                <Trash2 className="h-2.5 w-2.5" />
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        )}
                     </div>

                     {/* Kolom Kanan: Form Tambah / Edit Sesi Pelajaran */}
                     <form
                        onSubmit={handleSubmitLesson}
                        className="obsidian-pill flex flex-col gap-3.5 rounded-xl p-4 lg:col-span-5">
                        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
                           <span className="text-xs font-bold text-foreground">
                              {editingSubjectId
                                 ? `Edit Sesi Pelajaran (${selectedDay})`
                                 : `Tambah Sesi Pelajaran (${selectedDay})`}
                           </span>
                           {editingSubjectId && (
                              <button
                                 type="button"
                                 onClick={resetLessonForm}
                                 className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                                 Batal Edit
                              </button>
                           )}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Kode Jam (Slot)
                              </label>
                              <input
                                 type="text"
                                 value={slotCode}
                                 onChange={(e) => setSlotCode(e.target.value)}
                                 placeholder="JAM 01–03"
                                 className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                              />
                           </div>
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Rentang Waktu
                              </label>
                              <input
                                 type="text"
                                 value={timeRange}
                                 onChange={(e) => setTimeRange(e.target.value)}
                                 placeholder="07:00 – 09:15"
                                 className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="block text-[11px] font-semibold text-muted-foreground">
                              Nama Mata Pelajaran
                           </label>
                           <input
                              type="text"
                              required
                              value={subjectName}
                              onChange={(e) => setSubjectName(e.target.value)}
                              placeholder="Contoh: Pemrograman Web & Next.js"
                              className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Kategori Mapel
                              </label>
                              <select
                                 value={category}
                                 onChange={(e) =>
                                    setCategory(
                                       e.target.value as "produktif" | "umum"
                                    )
                                 }
                                 className="obsidian-pill mt-1 w-full rounded-lg bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none">
                                 <option
                                    value="produktif"
                                    className="bg-slate-900 text-white">
                                    Produktif PPLG
                                 </option>
                                 <option
                                    value="umum"
                                    className="bg-slate-900 text-white">
                                    Mapel Umum
                                 </option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Ruangan / Lab
                              </label>
                              <input
                                 type="text"
                                 value={roomOrNote}
                                 onChange={(e) => setRoomOrNote(e.target.value)}
                                 placeholder="Lab RPL 1"
                                 className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="block text-[11px] font-semibold text-muted-foreground">
                              Fokus Materi / Guru Pengampu
                           </label>
                           <input
                              type="text"
                              value={teacherOrFocus}
                              onChange={(e) =>
                                 setTeacherOrFocus(e.target.value)
                              }
                              placeholder="Contoh: App Router & Server Actions"
                              className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                           />
                        </div>

                        <button
                           type="submit"
                           disabled={isSaving}
                           className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50">
                           <Save className="h-3.5 w-3.5" />
                           <span>
                              {isSaving
                                 ? "Menyimpan..."
                                 : editingSubjectId
                                   ? "Simpan Perubahan Sesi"
                                   : "Tambah ke Jadwal Hari " + selectedDay}
                           </span>
                        </button>
                     </form>
                  </div>
               ) : (
                  /* TAB 2: KELOLA REGU PIKET HARIAN */
                  <form
                     onSubmit={handleSavePiketDay}
                     className="flex flex-col gap-4">
                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                           <label className="block text-[11px] font-semibold text-muted-foreground">
                              Kode Regu Piket ({selectedDay})
                           </label>
                           <input
                              type="text"
                              value={shortCode}
                              onChange={(e) => setShortCode(e.target.value)}
                              placeholder="REGU 01"
                              className="obsidian-pill mt-1 w-full rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-[11px] font-semibold text-muted-foreground">
                              Area Fokus Kebersihan & Tanggung Jawab
                           </label>
                           <input
                              type="text"
                              value={zoneFocus}
                              onChange={(e) => setZoneFocus(e.target.value)}
                              placeholder="Meja Lab Depan, Papan Tulis & Proyektor"
                              className="obsidian-pill mt-1 w-full rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                           />
                        </div>
                     </div>

                     <div>
                        <div className="flex items-center justify-between">
                           <label className="text-xs font-bold text-foreground">
                              Pilih Anggota Piket Hari {selectedDay} (Klik Nomor
                              Absen #01–#22)
                           </label>
                           <span className="mono-tabular text-xs font-semibold text-amber-600 dark:text-amber-300">
                              {selectedAbsenList.length} Siswa Terpilih
                           </span>
                        </div>

                        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                           {students.map((st) => {
                              const isSelected = selectedAbsenList.includes(
                                 st.absen
                              );
                              const code = String(st.absen).padStart(2, "0");
                              return (
                                 <button
                                    key={st.id}
                                    type="button"
                                    onClick={() =>
                                       handleToggleAbsenMember(st.absen)
                                    }
                                    className={`obsidian-pill flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs transition ${
                                       isSelected
                                          ? "border-amber-400/55 bg-amber-500/20 text-foreground"
                                          : "text-muted-foreground hover:text-foreground"
                                    }`}>
                                    <div className="min-w-0">
                                       <div className="mono-tabular text-[10px] font-bold text-amber-600 dark:text-amber-300">
                                          ABSEN #{code}
                                       </div>
                                       <div className="truncate font-semibold text-foreground">
                                          {st.name}
                                       </div>
                                    </div>
                                    <span
                                       className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                          isSelected
                                             ? "bg-amber-400"
                                             : "bg-slate-600/40"
                                       }`}
                                    />
                                 </button>
                              );
                           })}
                        </div>
                     </div>

                     <div className="flex justify-end pt-2">
                        <button
                           type="submit"
                           disabled={isSaving}
                           className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50">
                           <Save className="h-3.5 w-3.5" />
                           <span>
                              {isSaving
                                 ? "Menyimpan..."
                                 : `Simpan Regu Piket Hari ${selectedDay}`}
                           </span>
                        </button>
                     </div>
                  </form>
               )}
            </div>

            {/* =================================================================
             4. FOOTER MODAL: SYNC SUPABASE & RESET DEFAULT
            ================================================================= */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] bg-[var(--color-elevated)]/50 px-5 py-3.5">
               <div className="flex flex-wrap items-center gap-2">
                  <button
                     type="button"
                     disabled={isSaving || isSyncing}
                     onClick={handleTriggerReset}
                     className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50">
                     <RotateCcw className="h-3.5 w-3.5" />
                     <span>Reset Default</span>
                  </button>

                  {onSyncAllToSupabase && (
                     <button
                        type="button"
                        disabled={isSyncing || isSaving}
                        onClick={handleTriggerSync}
                        className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-emerald-400/45 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-200 disabled:opacity-50">
                        <CloudUpload className="h-3.5 w-3.5" />
                        <span>
                           {isSyncing
                              ? "Menyinkronkan..."
                              : "Sync 6 Hari ke Supabase"}
                        </span>
                     </button>
                  )}
               </div>

               <button
                  type="button"
                  onClick={onClose}
                  className="obsidian-pill rounded-xl px-4 py-1.5 text-xs font-bold text-foreground">
                  Selesai & Tutup
               </button>
            </div>
         </div>
      </div>
   );
}
