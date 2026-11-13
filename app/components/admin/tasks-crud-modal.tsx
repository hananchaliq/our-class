"use client";

import * as React from "react";
import {
   CalendarCheck2,
   CheckCircle2,
   CloudUpload,
   ListTodo,
   Pencil,
   Plus,
   RotateCcw,
   Save,
   Trash2,
   X,
} from "lucide-react";
import {
   type ClassAgendaEvent,
   type ClassTaskItem,
   type TaskStatus,
} from "../schedule/class-tasks-agenda-board";
import {
   getSupabaseBrowserClient,
   isSupabaseConfigured,
} from "@/lib/supabase/client";

interface TasksCrudModalProps {
   isOpen: boolean;
   onClose: () => void;
   tasks: ClassTaskItem[];
   agendas: ClassAgendaEvent[];
   onSaveTask: (task: ClassTaskItem) => Promise<void> | void;
   onDeleteTask: (taskId: string) => Promise<void> | void;
   onSaveAgendas: (nextAgendas: ClassAgendaEvent[]) => Promise<void> | void;
   onResetDefault: () => Promise<void> | void;
   onSyncTasksToSupabase?: () => Promise<void>;
}

const DIVISION_OPTIONS: ClassTaskItem["division"][] = [
   "Semua Divisi",
   "Frontend",
   "Backend",
   "UI/UX & Creative",
   "Game & Mobile",
];

const AGENDA_CATEGORIES: ClassAgendaEvent["category"][] = [
   "Akademik",
   "UKK Industri",
   "Kelulusan",
];

export function TasksCrudModal({
   isOpen,
   onClose,
   tasks,
   agendas,
   onSaveTask,
   onDeleteTask,
   onSaveAgendas,
   onResetDefault,
   onSyncTasksToSupabase,
}: TasksCrudModalProps) {
   const [activeTab, setActiveTab] = React.useState<"tasks" | "agendas">(
      "tasks"
   );

   // Form state untuk Tugas Kelas
   const [editingTaskId, setEditingTaskId] = React.useState<string | null>(
      null
   );
   const [taskCode, setTaskCode] = React.useState("TSK-07");
   const [taskTitle, setTaskTitle] = React.useState("");
   const [taskSubject, setTaskSubject] = React.useState("");
   const [taskDivision, setTaskDivision] =
      React.useState<ClassTaskItem["division"]>("Semua Divisi");
   const [taskDeadline, setTaskDeadline] = React.useState("25 Mar 2026");
   const [taskStatus, setTaskStatus] =
      React.useState<TaskStatus>("in_progress");
   const [taskProgressPct, setTaskProgressPct] = React.useState<number>(60);

   // Form state untuk Agenda Kelas
   const [editingAgendaId, setEditingAgendaId] = React.useState<string | null>(
      null
   );
   const [agendaCode, setAgendaCode] = React.useState("STEP 07");
   const [agendaTitle, setAgendaTitle] = React.useState("");
   const [agendaDateLabel, setAgendaDateLabel] = React.useState("28 Mei 2026");
   const [agendaLocation, setAgendaLocation] = React.useState("Lab RPL Utama");
   const [agendaCategory, setAgendaCategory] =
      React.useState<ClassAgendaEvent["category"]>("Kelulusan");
   const [agendaHighlighted, setAgendaHighlighted] = React.useState(false);

   const [isSaving, setIsSaving] = React.useState(false);
   const [isSyncing, setIsSyncing] = React.useState(false);
   const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);
   const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

   const resetTaskForm = React.useCallback(
      (nextNum = tasks.length + 1) => {
         setEditingTaskId(null);
         setTaskCode(`TSK-${String(nextNum).padStart(2, "0")}`);
         setTaskTitle("");
         setTaskSubject("");
         setTaskDivision("Semua Divisi");
         setTaskDeadline("25 Mar 2026");
         setTaskStatus("in_progress");
         setTaskProgressPct(60);
      },
      [tasks.length]
   );

   const resetAgendaForm = React.useCallback(
      (nextNum = agendas.length + 1) => {
         setEditingAgendaId(null);
         setAgendaCode(`STEP ${String(nextNum).padStart(2, "0")}`);
         setAgendaTitle("");
         setAgendaDateLabel("28 Mei 2026");
         setAgendaLocation("Lab RPL Utama");
         setAgendaCategory("Kelulusan");
         setAgendaHighlighted(false);
      },
      [agendas.length]
   );

   React.useEffect(() => {
      if (isOpen) {
         setFeedbackMsg(null);
         setErrorMsg(null);
         resetTaskForm(tasks.length + 1);
         resetAgendaForm(agendas.length + 1);
      }
   }, [isOpen, tasks.length, agendas.length, resetTaskForm, resetAgendaForm]);

   React.useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isOpen, onClose]);

   if (!isOpen) return null;

   const handleSelectTaskToEdit = (item: ClassTaskItem) => {
      setEditingTaskId(item.id);
      setTaskCode(item.code);
      setTaskTitle(item.title);
      setTaskSubject(item.subject);
      setTaskDivision(item.division);
      setTaskDeadline(item.deadline);
      setTaskStatus(item.status);
      setTaskProgressPct(item.progressPct);
      setFeedbackMsg(null);
      setErrorMsg(null);
   };

   const handleSubmitTask = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!taskTitle.trim()) {
         setErrorMsg("Judul tugas wajib diisi.");
         return;
      }

      setIsSaving(true);
      setErrorMsg(null);
      setFeedbackMsg(null);

      try {
         const clampedPct = Math.max(
            0,
            Math.min(
               100,
               taskStatus === "completed" ? 100 : Number(taskProgressPct) || 0
            )
         );

         const payload: ClassTaskItem = {
            id: editingTaskId ?? `task-${Date.now().toString(36)}`,
            code: taskCode.trim() || "TSK-NEW",
            title: taskTitle.trim(),
            subject: taskSubject.trim() || "Proyek Produktif PPLG 1",
            division: taskDivision,
            deadline: taskDeadline.trim() || "Segera",
            status: taskStatus,
            progressPct: clampedPct,
         };

         await onSaveTask(payload);
         setFeedbackMsg(
            editingTaskId
               ? `Tugas "${payload.title}" (${payload.code}) berhasil diperbarui.`
               : `Tugas baru "${payload.title}" berhasil ditambahkan.`
         );
         resetTaskForm(tasks.length + (editingTaskId ? 1 : 2));
      } catch (err) {
         setErrorMsg(
            err instanceof Error ? err.message : "Gagal menyimpan tugas kelas."
         );
      } finally {
         setIsSaving(false);
      }
   };

   const handleRemoveTask = async (item: ClassTaskItem) => {
      setIsSaving(true);
      setErrorMsg(null);
      setFeedbackMsg(null);
      try {
         await onDeleteTask(item.id);
         if (editingTaskId === item.id) {
            resetTaskForm(Math.max(1, tasks.length));
         }
         setFeedbackMsg(`Tugas "${item.title}" dihapus dari daftar.`);
      } catch (err) {
         setErrorMsg(
            err instanceof Error ? err.message : "Gagal menghapus tugas kelas."
         );
      } finally {
         setIsSaving(false);
      }
   };

   const handleSelectAgendaToEdit = (item: ClassAgendaEvent) => {
      setEditingAgendaId(item.id);
      setAgendaCode(item.code);
      setAgendaTitle(item.title);
      setAgendaDateLabel(item.dateLabel);
      setAgendaLocation(item.location);
      setAgendaCategory(item.category);
      setAgendaHighlighted(Boolean(item.isHighlighted));
      setFeedbackMsg(null);
      setErrorMsg(null);
   };

   const handleSubmitAgenda = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!agendaTitle.trim()) {
         setErrorMsg("Judul agenda / milestone wajib diisi.");
         return;
      }

      setIsSaving(true);
      setErrorMsg(null);
      setFeedbackMsg(null);

      try {
         const payload: ClassAgendaEvent = {
            id: editingAgendaId ?? `agd-${Date.now().toString(36)}`,
            code: agendaCode.trim() || "STEP",
            title: agendaTitle.trim(),
            dateLabel: agendaDateLabel.trim() || "Mei 2026",
            location: agendaLocation.trim() || "SMK XII PPLG 1",
            category: agendaCategory,
            isHighlighted: agendaHighlighted,
         };

         const nextAgendas = editingAgendaId
            ? agendas.map((a) => (a.id === editingAgendaId ? payload : a))
            : [...agendas, payload];

         await onSaveAgendas(nextAgendas);
         setFeedbackMsg(
            editingAgendaId
               ? `Agenda "${payload.title}" berhasil diperbarui.`
               : `Agenda baru "${payload.title}" berhasil ditambahkan.`
         );
         resetAgendaForm(nextAgendas.length + 1);
      } catch (err) {
         setErrorMsg(
            err instanceof Error ? err.message : "Gagal menyimpan agenda kelas."
         );
      } finally {
         setIsSaving(false);
      }
   };

   const handleDeleteAgenda = async (item: ClassAgendaEvent) => {
      setIsSaving(true);
      setErrorMsg(null);
      setFeedbackMsg(null);
      try {
         const nextAgendas = agendas.filter((a) => a.id !== item.id);
         await onSaveAgendas(nextAgendas);
         if (editingAgendaId === item.id) {
            resetAgendaForm(nextAgendas.length + 1);
         }
         setFeedbackMsg(`Agenda "${item.title}" dihapus dari daftar.`);
      } finally {
         setIsSaving(false);
      }
   };

   const handleTriggerSync = async () => {
      if (!onSyncTasksToSupabase) return;
      setIsSyncing(true);
      setErrorMsg(null);
      setFeedbackMsg(null);
      try {
         await onSyncTasksToSupabase();
         setFeedbackMsg(
            "Seluruh daftar tugas & progres UKK berhasil disinkronkan ke tabel public.class_tasks Supabase."
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
            "Daftar tugas & agenda kelulusan berhasil dikembalikan ke data awal XII PPLG 1."
         );
         resetTaskForm();
         resetAgendaForm();
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
         aria-labelledby="tasks-crud-modal-title"
         className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-md sm:p-5">
         <div className="obsidian-surface flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-2xl">
            {/* =================================================================
             1. HEADER MODAL CRUD TUGAS & AGENDA
            ================================================================= */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
               <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-300">
                     <ListTodo className="h-4 w-4" />
                     <span className="mono-tabular tracking-widest uppercase">
                        ADMIN CRUD · TRACKER TUGAS & AGENDA KELULUSAN
                     </span>
                  </div>
                  <h2
                     id="tasks-crud-modal-title"
                     className="mt-0.5 text-base font-bold text-foreground sm:text-lg">
                     Kelola Papan Tugas UKK & Milestone Kelulusan XII PPLG 1
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
                        ? "SUPABASE PUBLIC.CLASS_TASKS READY"
                        : "MODE PENYIMPANAN LOKAL"}
                  </span>

                  <button
                     type="button"
                     onClick={onClose}
                     aria-label="Tutup modal kelola tugas"
                     className="obsidian-pill inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground">
                     <X className="h-4 w-4" />
                  </button>
               </div>
            </div>

            {/* =================================================================
             2. TAB MODE: TUGAS KELAS VS AGENDA KELULUSAN
            ================================================================= */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-elevated)]/40 px-5 py-3">
               <div className="obsidian-pill inline-flex items-center gap-1 rounded-xl p-1">
                  <button
                     type="button"
                     onClick={() => setActiveTab("tasks")}
                     className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        activeTab === "tasks"
                           ? "bg-sky-500/20 text-sky-700 dark:text-sky-200 border border-sky-400/35 glow-cyan"
                           : "text-muted-foreground hover:text-foreground"
                     }`}>
                     <ListTodo className="h-3.5 w-3.5" />
                     <span>Tugas & Deadline ({tasks.length})</span>
                  </button>

                  <button
                     type="button"
                     onClick={() => setActiveTab("agendas")}
                     className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        activeTab === "agendas"
                           ? "bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 border border-indigo-400/35 glow-indigo"
                           : "text-muted-foreground hover:text-foreground"
                     }`}>
                     <CalendarCheck2 className="h-3.5 w-3.5" />
                     <span>Milestone Agenda ({agendas.length})</span>
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
             3. BODY MODAL: TAB TUGAS KELAS ATAU TAB AGENDA KELULUSAN
            ================================================================= */}
            <div className="flex-1 overflow-y-auto p-5">
               {activeTab === "tasks" ? (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                     {/* Kolom Kiri: Daftar Tugas */}
                     <div className="flex flex-col gap-3 lg:col-span-7">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                              Daftar Tugas & Target Sprint ({tasks.length})
                           </h3>
                           <button
                              type="button"
                              onClick={() => resetTaskForm(tasks.length + 1)}
                              className="obsidian-pill inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-sky-600 dark:text-sky-300">
                              <Plus className="h-3 w-3" />
                              <span>Tugas Baru</span>
                           </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                           {tasks.map((item) => {
                              const isEditing = editingTaskId === item.id;
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
                                          <span className="mono-tabular font-bold text-muted-foreground">
                                             {item.code}
                                          </span>
                                          <span className="mono-tabular font-bold text-sky-600 dark:text-sky-300">
                                             {item.progressPct}% ·{" "}
                                             {item.status.toUpperCase()}
                                          </span>
                                       </div>
                                       <h4 className="mt-1.5 text-xs font-bold text-foreground sm:text-sm">
                                          {item.title}
                                       </h4>
                                       <p className="mt-1 text-[11px] text-muted-foreground">
                                          {item.subject} · {item.division}
                                       </p>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-2 text-[10px]">
                                       <span className="mono-tabular text-muted-foreground">
                                          DL: {item.deadline}
                                       </span>
                                       <div className="flex items-center gap-1">
                                          <button
                                             type="button"
                                             onClick={() =>
                                                handleSelectTaskToEdit(item)
                                             }
                                             className="obsidian-pill inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-sky-600 dark:text-sky-300">
                                             <Pencil className="h-2.5 w-2.5" />
                                             <span>Edit</span>
                                          </button>
                                          <button
                                             type="button"
                                             disabled={isSaving}
                                             onClick={() =>
                                                handleRemoveTask(item)
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
                     </div>

                     {/* Kolom Kanan: Form Tambah / Edit Tugas */}
                     <form
                        onSubmit={handleSubmitTask}
                        className="obsidian-pill flex flex-col gap-3 rounded-xl p-4 lg:col-span-5">
                        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                           <span className="text-xs font-bold text-foreground">
                              {editingTaskId
                                 ? `Edit Tugas (${taskCode})`
                                 : "Tambah Tugas / Target Baru"}
                           </span>
                           {editingTaskId && (
                              <button
                                 type="button"
                                 onClick={() => resetTaskForm(tasks.length + 1)}
                                 className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                                 Batal Edit
                              </button>
                           )}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Kode Tugas
                              </label>
                              <input
                                 type="text"
                                 value={taskCode}
                                 onChange={(e) => setTaskCode(e.target.value)}
                                 placeholder="TSK-07"
                                 className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                              />
                           </div>
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Tenggat Waktu (Deadline)
                              </label>
                              <input
                                 type="text"
                                 value={taskDeadline}
                                 onChange={(e) =>
                                    setTaskDeadline(e.target.value)
                                 }
                                 placeholder="25 Mar 2026"
                                 className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="block text-[11px] font-semibold text-muted-foreground">
                              Judul Tugas / Target
                           </label>
                           <input
                              type="text"
                              required
                              value={taskTitle}
                              onChange={(e) => setTaskTitle(e.target.value)}
                              placeholder="Contoh: Integrasi Database Supabase"
                              className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                           />
                        </div>

                        <div>
                           <label className="block text-[11px] font-semibold text-muted-foreground">
                              Mata Pelajaran / Kategori Proyek
                           </label>
                           <input
                              type="text"
                              value={taskSubject}
                              onChange={(e) => setTaskSubject(e.target.value)}
                              placeholder="Contoh: Basis Data & Supabase"
                              className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Divisi Teknis
                              </label>
                              <select
                                 value={taskDivision}
                                 onChange={(e) =>
                                    setTaskDivision(
                                       e.target
                                          .value as ClassTaskItem["division"]
                                    )
                                 }
                                 className="obsidian-pill mt-1 w-full rounded-lg bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none">
                                 {DIVISION_OPTIONS.map((div) => (
                                    <option
                                       key={div}
                                       value={div}
                                       className="bg-slate-900 text-white">
                                       {div}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Status Tugas
                              </label>
                              <select
                                 value={taskStatus}
                                 onChange={(e) => {
                                    const next = e.target.value as TaskStatus;
                                    setTaskStatus(next);
                                    if (next === "completed") {
                                       setTaskProgressPct(100);
                                    }
                                 }}
                                 className="obsidian-pill mt-1 w-full rounded-lg bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none">
                                 <option
                                    value="in_progress"
                                    className="bg-slate-900 text-white">
                                    Aktif (In Progress)
                                 </option>
                                 <option
                                    value="urgent"
                                    className="bg-slate-900 text-white">
                                    Prioritas (Urgent)
                                 </option>
                                 <option
                                    value="completed"
                                    className="bg-slate-900 text-white">
                                    Selesai (Completed)
                                 </option>
                              </select>
                           </div>
                        </div>

                        <div>
                           <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                              <span>Persentase Progres</span>
                              <span className="mono-tabular font-bold text-foreground">
                                 {taskProgressPct}%
                              </span>
                           </div>
                           <input
                              type="range"
                              min={0}
                              max={100}
                              step={5}
                              value={taskProgressPct}
                              onChange={(e) =>
                                 setTaskProgressPct(Number(e.target.value))
                              }
                              className="mt-1.5 w-full accent-sky-400"
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
                                 : editingTaskId
                                   ? "Simpan Perubahan Tugas"
                                   : "Tambah Tugas ke Papan"}
                           </span>
                        </button>
                     </form>
                  </div>
               ) : (
                  /* TAB 2: KELOLA AGENDA & MILESTONE KELULUSAN */
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                     <div className="flex flex-col gap-3 lg:col-span-7">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                              Daftar Milestone Agenda ({agendas.length})
                           </h3>
                           <button
                              type="button"
                              onClick={() =>
                                 resetAgendaForm(agendas.length + 1)
                              }
                              className="obsidian-pill inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-300">
                              <Plus className="h-3 w-3" />
                              <span>Agenda Baru</span>
                           </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                           {agendas.map((item) => {
                              const isEditing = editingAgendaId === item.id;
                              return (
                                 <div
                                    key={item.id}
                                    className={`obsidian-pill flex flex-col justify-between rounded-xl p-3.5 transition ${
                                       isEditing
                                          ? "border-indigo-400/60 bg-indigo-500/15 glow-indigo"
                                          : ""
                                    }`}>
                                    <div>
                                       <div className="flex items-center justify-between gap-1 text-[10px]">
                                          <span className="mono-tabular font-bold text-indigo-600 dark:text-indigo-300">
                                             {item.code}
                                          </span>
                                          <span className="text-muted-foreground">
                                             {item.category}
                                          </span>
                                       </div>
                                       <h4 className="mt-1.5 text-xs font-bold text-foreground sm:text-sm">
                                          {item.title}
                                       </h4>
                                       <p className="mt-1 text-[11px] text-muted-foreground">
                                          {item.dateLabel} · {item.location}
                                       </p>
                                    </div>

                                    <div className="mt-3 flex items-center justify-end gap-1 border-t border-[var(--color-border)] pt-2">
                                       <button
                                          type="button"
                                          onClick={() =>
                                             handleSelectAgendaToEdit(item)
                                          }
                                          className="obsidian-pill inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                                          <Pencil className="h-2.5 w-2.5" />
                                          <span>Edit</span>
                                       </button>
                                       <button
                                          type="button"
                                          disabled={isSaving}
                                          onClick={() =>
                                             handleDeleteAgenda(item)
                                          }
                                          className="obsidian-pill inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-rose-600 dark:text-rose-300">
                                          <Trash2 className="h-2.5 w-2.5" />
                                       </button>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     <form
                        onSubmit={handleSubmitAgenda}
                        className="obsidian-pill flex flex-col gap-3 rounded-xl p-4 lg:col-span-5">
                        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                           <span className="text-xs font-bold text-foreground">
                              {editingAgendaId
                                 ? `Edit Agenda (${agendaCode})`
                                 : "Tambah Agenda Baru"}
                           </span>
                           {editingAgendaId && (
                              <button
                                 type="button"
                                 onClick={() =>
                                    resetAgendaForm(agendas.length + 1)
                                 }
                                 className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                                 Batal Edit
                              </button>
                           )}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Kode Tahap
                              </label>
                              <input
                                 type="text"
                                 value={agendaCode}
                                 onChange={(e) => setAgendaCode(e.target.value)}
                                 placeholder="STEP 07"
                                 className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                              />
                           </div>
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Tanggal Pelaksanaan
                              </label>
                              <input
                                 type="text"
                                 value={agendaDateLabel}
                                 onChange={(e) =>
                                    setAgendaDateLabel(e.target.value)
                                 }
                                 placeholder="15 Mei 2026"
                                 className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="block text-[11px] font-semibold text-muted-foreground">
                              Nama Kegiatan / Milestone
                           </label>
                           <input
                              type="text"
                              required
                              value={agendaTitle}
                              onChange={(e) => setAgendaTitle(e.target.value)}
                              placeholder="Contoh: Seremoni Kelulusan XII PPLG 1"
                              className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Lokasi Kegiatan
                              </label>
                              <input
                                 type="text"
                                 value={agendaLocation}
                                 onChange={(e) =>
                                    setAgendaLocation(e.target.value)
                                 }
                                 placeholder="Aula Utama SMK"
                                 className="obsidian-pill mt-1 w-full rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                              />
                           </div>
                           <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground">
                                 Kategori
                              </label>
                              <select
                                 value={agendaCategory}
                                 onChange={(e) =>
                                    setAgendaCategory(
                                       e.target
                                          .value as ClassAgendaEvent["category"]
                                    )
                                 }
                                 className="obsidian-pill mt-1 w-full rounded-lg bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none">
                                 {AGENDA_CATEGORIES.map((cat) => (
                                    <option
                                       key={cat}
                                       value={cat}
                                       className="bg-slate-900 text-white">
                                       {cat}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>

                        <label className="inline-flex cursor-pointer items-center gap-2 pt-1 text-xs font-medium text-foreground">
                           <input
                              type="checkbox"
                              checked={agendaHighlighted}
                              onChange={(e) =>
                                 setAgendaHighlighted(e.target.checked)
                              }
                              className="rounded accent-indigo-500"
                           />
                           <span>Sorot sebagai agenda utama (Highlight)</span>
                        </label>

                        <button
                           type="submit"
                           disabled={isSaving}
                           className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-400 disabled:opacity-50">
                           <Save className="h-3.5 w-3.5" />
                           <span>
                              {isSaving
                                 ? "Menyimpan..."
                                 : editingAgendaId
                                   ? "Simpan Perubahan Agenda"
                                   : "Tambah Agenda"}
                           </span>
                        </button>
                     </form>
                  </div>
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

                  {onSyncTasksToSupabase && (
                     <button
                        type="button"
                        disabled={isSyncing || isSaving}
                        onClick={handleTriggerSync}
                        className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-emerald-400/45 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-200 disabled:opacity-50">
                        <CloudUpload className="h-3.5 w-3.5" />
                        <span>
                           {isSyncing
                              ? "Menyinkronkan..."
                              : "Sync Semua Tugas ke Supabase"}
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
