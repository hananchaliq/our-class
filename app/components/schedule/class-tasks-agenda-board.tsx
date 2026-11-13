"use client";

import * as React from "react";
import {
   AlertCircle,
   CalendarCheck2,
   CheckCircle2,
   Clock,
   Flag,
   ListTodo,
   MapPin,
   Plus,
   Sparkles,
} from "lucide-react";
import { useClassAuth } from "../auth/class-auth-provider";
import { TasksCrudModal } from "../admin/tasks-crud-modal";
import {
   getSupabaseBrowserClient,
   isSupabaseConfigured,
} from "@/lib/supabase/client";

export type TaskStatus = "in_progress" | "urgent" | "completed";

export interface ClassTaskItem {
   id: string;
   code: string;
   title: string;
   subject: string;
   division:
      | "Semua Divisi"
      | "Frontend"
      | "Backend"
      | "UI/UX & Creative"
      | "Game & Mobile";
   deadline: string;
   status: TaskStatus;
   progressPct: number;
}

export interface ClassAgendaEvent {
   id: string;
   code: string;
   title: string;
   dateLabel: string;
   location: string;
   category: "Akademik" | "UKK Industri" | "Kelulusan";
   isHighlighted?: boolean;
}

export const INITIAL_CLASS_TASKS: ClassTaskItem[] = [
   {
      id: "task-01",
      code: "TSK-01",
      title: "Finalisasi ERD & Skema RLS PostgreSQL",
      subject: "Basis Data & Supabase",
      division: "Backend",
      deadline: "18 Feb 2026",
      status: "completed",
      progressPct: 100,
   },
   {
      id: "task-02",
      code: "TSK-02",
      title: "Integrasi 22 ID Card Lanyard 3D & Biodata",
      subject: "Pemrograman Web Next.js",
      division: "Frontend",
      deadline: "24 Feb 2026",
      status: "completed",
      progressPct: 100,
   },
   {
      id: "task-03",
      code: "TSK-03",
      title: "Audit Design System Obsidian & Daylight",
      subject: "UI/UX & Prototyping",
      division: "UI/UX & Creative",
      deadline: "02 Mar 2026",
      status: "in_progress",
      progressPct: 85,
   },
   {
      id: "task-04",
      code: "TSK-04",
      title: "Optimasi Build APK Flutter & Shader Gim",
      subject: "Rekayasa Gim & Mobile",
      division: "Game & Mobile",
      deadline: "08 Mar 2026",
      status: "in_progress",
      progressPct: 78,
   },
   {
      id: "task-05",
      code: "TSK-05",
      title: "Pengumpulan Laporan Teknis & Pitch Deck UKK",
      subject: "Proyek Akhir PPLG",
      division: "Semua Divisi",
      deadline: "15 Mar 2026",
      status: "urgent",
      progressPct: 65,
   },
   {
      id: "task-06",
      code: "TSK-06",
      title: "Kurasi Foto Kenangan & Quotes Kado 3D",
      subject: "Kapsul Kelulusan 2026",
      division: "Semua Divisi",
      deadline: "10 Apr 2026",
      status: "in_progress",
      progressPct: 90,
   },
];

export const INITIAL_CLASS_AGENDAS: ClassAgendaEvent[] = [
   {
      id: "agd-01",
      code: "STEP 01",
      title: "Simulasi & Pra-UKK Rekayasa Perangkat Lunak",
      dateLabel: "10–14 Feb 2026",
      location: "Lab RPL Utama",
      category: "Akademik",
   },
   {
      id: "agd-02",
      code: "STEP 02",
      title: "Uji Kompetensi Keahlian (UKK) Eksternal",
      dateLabel: "02–07 Mar 2026",
      location: "Lab Server & Penguji Industri",
      category: "UKK Industri",
      isHighlighted: true,
   },
   {
      id: "agd-03",
      code: "STEP 03",
      title: "Pemotretan Buku Tahunan & Video Angkatan",
      dateLabel: "21 Mar 2026",
      location: "Studio & Lapangan Utama",
      category: "Kelulusan",
   },
   {
      id: "agd-04",
      code: "STEP 04",
      title: "Gelar Karya & Demo Aplikasi 22 Developer",
      dateLabel: "18 Apr 2026",
      location: "Aula SMK & Galeri Web",
      category: "UKK Industri",
   },
   {
      id: "agd-05",
      code: "STEP 05",
      title: "Seremoni Kelulusan & Pembukaan Kado 3D",
      dateLabel: "15 Mei 2026",
      location: "Panggung Utama & Web 2026",
      category: "Kelulusan",
      isHighlighted: true,
   },
   {
      id: "agd-06",
      code: "STEP 06",
      title: "Malam Keakraban & Pelepasan XII PPLG 1",
      dateLabel: "23 Mei 2026",
      location: "Hall Perpisahan Angkatan",
      category: "Kelulusan",
   },
];

const TASKS_STORAGE_KEY = "pplg1-tasks-v1";
const AGENDAS_STORAGE_KEY = "pplg1-agendas-v1";

interface ClassTasksAgendaBoardProps {
   initialTasks?: ClassTaskItem[];
   initialAgendas?: ClassAgendaEvent[];
   onOpenAdminTaskModal?: () => void;
}

export function ClassTasksAgendaBoard({
   initialTasks = INITIAL_CLASS_TASKS,
   initialAgendas = INITIAL_CLASS_AGENDAS,
   onOpenAdminTaskModal,
}: ClassTasksAgendaBoardProps) {
   const { isAdmin, openLoginModal } = useClassAuth();
   const [tasks, setTasks] = React.useState<ClassTaskItem[]>(initialTasks);
   const [agendas, setAgendas] =
      React.useState<ClassAgendaEvent[]>(initialAgendas);
   const [statusFilter, setStatusFilter] = React.useState<"all" | TaskStatus>(
      "all"
   );
   const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

   // Muat daftar tugas & agenda dari localStorage + Supabase public.class_tasks
   React.useEffect(() => {
      let isMounted = true;

      try {
         const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
         if (savedTasks) {
            const parsed = JSON.parse(savedTasks) as ClassTaskItem[];
            if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
               setTasks(parsed);
            }
         }

         const savedAgendas = window.localStorage.getItem(AGENDAS_STORAGE_KEY);
         if (savedAgendas) {
            const parsedAgendas = JSON.parse(
               savedAgendas
            ) as ClassAgendaEvent[];
            if (
               Array.isArray(parsedAgendas) &&
               parsedAgendas.length > 0 &&
               isMounted
            ) {
               setAgendas(parsedAgendas);
            }
         }
      } catch {
         // Abaikan error localStorage
      }

      async function fetchTasksFromSupabase() {
         if (!isSupabaseConfigured()) return;
         const supabase = getSupabaseBrowserClient();
         if (!supabase) return;

         const { data, error } = await supabase
            .from("class_tasks")
            .select("*")
            .order("code", { ascending: true });

         if (error || !data || data.length === 0 || !isMounted) return;

         const mapped: ClassTaskItem[] = data.map((row) => ({
            id: String(row.id),
            code: String(row.code ?? "TSK"),
            title: String(row.title ?? "Tugas Kelas"),
            subject: String(row.subject ?? "Produktif PPLG"),
            division: (row.division as ClassTaskItem["division"]) ?? "Semua Divisi",
            deadline: String(row.deadline ?? "2026"),
            status: (row.status as TaskStatus) ?? "in_progress",
            progressPct: Number(row.progress_pct ?? 0),
         }));

         if (mapped.length > 0 && isMounted) {
            setTasks(mapped);
            try {
               window.localStorage.setItem(
                  TASKS_STORAGE_KEY,
                  JSON.stringify(mapped)
               );
            } catch {
               // Ignore
            }
         }
      }

      fetchTasksFromSupabase();

      return () => {
         isMounted = false;
      };
   }, []);

   const persistTasksLocal = (nextTasks: ClassTaskItem[]) => {
      setTasks(nextTasks);
      try {
         window.localStorage.setItem(
            TASKS_STORAGE_KEY,
            JSON.stringify(nextTasks)
         );
      } catch {
         // Ignore
      }
   };

   const upsertTaskToSupabase = async (taskItem: ClassTaskItem) => {
      if (!isSupabaseConfigured()) return;
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { error } = await supabase.from("class_tasks").upsert(
         {
            id: taskItem.id,
            code: taskItem.code,
            title: taskItem.title,
            subject: taskItem.subject,
            division: taskItem.division,
            deadline: taskItem.deadline,
            status: taskItem.status,
            progress_pct: taskItem.progressPct,
            updated_at: new Date().toISOString(),
         },
         { onConflict: "id" }
      );

      if (error) {
         throw new Error(error.message);
      }
   };

   const syncAllTasksToSupabase = async (targetTasks = tasks) => {
      if (!isSupabaseConfigured()) return;
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const rows = targetTasks.map((t) => ({
         id: t.id,
         code: t.code,
         title: t.title,
         subject: t.subject,
         division: t.division,
         deadline: t.deadline,
         status: t.status,
         progress_pct: t.progressPct,
         updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
         .from("class_tasks")
         .upsert(rows, { onConflict: "id" });

      if (error) {
         throw new Error(error.message);
      }
   };

   const handleSaveSingleTask = async (taskItem: ClassTaskItem) => {
      const exists = tasks.some((t) => t.id === taskItem.id);
      const nextTasks = exists
         ? tasks.map((t) => (t.id === taskItem.id ? taskItem : t))
         : [...tasks, taskItem];

      persistTasksLocal(nextTasks);
      if (isSupabaseConfigured()) {
         await upsertTaskToSupabase(taskItem);
      }
   };

   const handleDeleteSingleTask = async (taskId: string) => {
      const nextTasks = tasks.filter((t) => t.id !== taskId);
      persistTasksLocal(nextTasks);

      if (isSupabaseConfigured()) {
         const supabase = getSupabaseBrowserClient();
         if (supabase) {
            await supabase.from("class_tasks").delete().eq("id", taskId);
         }
      }
   };

   const handleSaveAgendas = async (nextAgendas: ClassAgendaEvent[]) => {
      setAgendas(nextAgendas);
      try {
         window.localStorage.setItem(
            AGENDAS_STORAGE_KEY,
            JSON.stringify(nextAgendas)
         );
      } catch {
         // Ignore
      }
   };

   const handleResetDefault = async () => {
      setTasks(INITIAL_CLASS_TASKS);
      setAgendas(INITIAL_CLASS_AGENDAS);
      try {
         window.localStorage.removeItem(TASKS_STORAGE_KEY);
         window.localStorage.removeItem(AGENDAS_STORAGE_KEY);
      } catch {
         // Ignore
      }
      if (isSupabaseConfigured()) {
         await syncAllTasksToSupabase(INITIAL_CLASS_TASKS);
      }
   };

   const filteredTasks = React.useMemo(() => {
      if (statusFilter === "all") return tasks;
      return tasks.filter((t) => t.status === statusFilter);
   }, [tasks, statusFilter]);

   const completedCount = React.useMemo(
      () => tasks.filter((t) => t.status === "completed").length,
      [tasks]
   );

   const handleToggleTaskStatus = (taskId: string) => {
      let toggledItem: ClassTaskItem | null = null;
      const nextTasks = tasks.map((item) => {
         if (item.id !== taskId) return item;
         const nextStatus: TaskStatus =
            item.status === "completed" ? "in_progress" : "completed";
         const updated: ClassTaskItem = {
            ...item,
            status: nextStatus,
            progressPct: nextStatus === "completed" ? 100 : 80,
         };
         toggledItem = updated;
         return updated;
      });

      persistTasksLocal(nextTasks);
      if (toggledItem && isSupabaseConfigured()) {
         void upsertTaskToSupabase(toggledItem).catch(() => {
            // Abaikan error latar belakang
         });
      }
   };

   return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
         {/* =================================================================
          1. PANEL KIRI: PAPAN TUGAS & DEADLINE KELAS (7 KOLOM DESKTOP)
             MENGGUNAKAN CARD GRID 2 KOLOM (grid-cols-2) DI LAYAR HP
         ================================================================= */}
         <div className="obsidian-surface flex flex-col justify-between p-5 sm:p-6 lg:col-span-7">
            <div>
               {/* Header Papan Tugas */}
               <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                     <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-300">
                        <ListTodo className="h-3.5 w-3.5 shrink-0" />
                        <span className="mono-tabular tracking-widest uppercase">
                           TRACKER TUGAS & SPRINT UKK PPLG 1
                        </span>
                     </div>
                     <h3 className="mt-1 text-base font-bold tracking-tight text-foreground sm:text-lg">
                        Papan Tugas & Target Penyelesaian Kelas
                     </h3>
                  </div>

                  {/* Filter Status Tugas */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                     <div
                        role="group"
                        aria-label="Filter status tugas kelas"
                        className="obsidian-pill inline-flex items-center gap-1 rounded-xl p-1">
                        {(
                           [
                              { key: "all", label: `Semua (${tasks.length})` },
                              { key: "in_progress", label: "Aktif" },
                              { key: "urgent", label: "Prioritas" },
                              {
                                 key: "completed",
                                 label: `Selesai (${completedCount})`,
                              },
                           ] as const
                        ).map((tab) => {
                           const active = statusFilter === tab.key;
                           return (
                              <button
                                 key={tab.key}
                                 type="button"
                                 onClick={() => setStatusFilter(tab.key)}
                                 className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition whitespace-nowrap ${
                                    active
                                       ? "bg-sky-500/20 text-sky-700 dark:text-sky-200 border border-sky-400/35 glow-cyan"
                                       : "text-muted-foreground hover:text-foreground border border-transparent"
                                 }`}>
                                 {tab.label}
                              </button>
                           );
                        })}
                     </div>

                     {isAdmin && (
                        <button
                           type="button"
                           onClick={() => {
                              if (onOpenAdminTaskModal) {
                                 onOpenAdminTaskModal();
                              } else {
                                 setIsTaskModalOpen(true);
                              }
                           }}
                           className="obsidian-pill inline-flex items-center gap-1 rounded-xl border-emerald-400/45 bg-emerald-500/15 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-200 whitespace-nowrap">
                           <Plus className="h-3.5 w-3.5" />
                           <span>Kelola Tugas</span>
                        </button>
                     )}
                     {!isAdmin && onOpenAdminTaskModal && (
                        <button
                           type="button"
                           onClick={openLoginModal}
                           className="sr-only">
                           Login Admin
                        </button>
                     )}
                  </div>
               </div>

               {/* Grid Tugas: WAJIB Card Grid 2 Kolom di HP (grid-cols-2) */}
               <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
                  {filteredTasks.map((task) => {
                     const isDone = task.status === "completed";
                     const isUrgent = task.status === "urgent";

                     return (
                        <div
                           key={task.id}
                           className={`obsidian-pill flex flex-col justify-between rounded-xl p-3 sm:p-4 transition-all duration-200 ${
                              isDone
                                 ? "border-emerald-400/35 bg-emerald-500/5"
                                 : isUrgent
                                   ? "border-amber-400/45 bg-amber-500/10"
                                   : "hover:border-sky-400/35"
                           }`}>
                           <div>
                              {/* Baris Atas: Kode Tugas & Status */}
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                 <span className="mono-tabular text-[10px] font-bold text-muted-foreground">
                                    {task.code}
                                 </span>

                                 <button
                                    type="button"
                                    onClick={() =>
                                       handleToggleTaskStatus(task.id)
                                    }
                                    title="Klik untuk ubah status selesai/aktif"
                                    className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold transition ${
                                       isDone
                                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                          : isUrgent
                                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                                            : "bg-sky-500/20 text-sky-700 dark:text-sky-300"
                                    }`}>
                                    {isDone ? (
                                       <>
                                          <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                                          <span>SELESAI</span>
                                       </>
                                    ) : isUrgent ? (
                                       <>
                                          <AlertCircle className="h-2.5 w-2.5 shrink-0" />
                                          <span>PRIORITAS</span>
                                       </>
                                    ) : (
                                       <>
                                          <Clock className="h-2.5 w-2.5 shrink-0" />
                                          <span>AKTIF</span>
                                       </>
                                    )}
                                 </button>
                              </div>

                              {/* Judul Tugas */}
                              <h4
                                 className={`mt-2 line-clamp-2 text-xs sm:text-sm font-bold leading-snug ${
                                    isDone
                                       ? "text-muted-foreground line-through"
                                       : "text-foreground"
                                 }`}>
                                 {task.title}
                              </h4>

                              {/* Mata Pelajaran & Divisi */}
                              <p className="mt-1 truncate text-[11px] text-muted-foreground">
                                 {task.subject}
                              </p>
                           </div>

                           {/* Progress Bar & Deadline */}
                           <div className="mt-3 flex flex-col gap-1.5 border-t border-[var(--color-border)] pt-2.5">
                              <div className="flex items-center justify-between text-[10px]">
                                 <span className="truncate font-medium text-muted-foreground">
                                    {task.division}
                                 </span>
                                 <span className="mono-tabular font-bold text-foreground">
                                    {task.progressPct}%
                                 </span>
                              </div>

                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
                                 <div
                                    style={{ width: `${task.progressPct}%` }}
                                    className={`h-full rounded-full transition-all duration-300 ${
                                       isDone
                                          ? "bg-emerald-400"
                                          : isUrgent
                                            ? "bg-amber-400"
                                            : "bg-sky-400"
                                    }`}
                                 />
                              </div>

                              <div className="flex items-center justify-between pt-0.5 text-[10px] text-muted-foreground">
                                 <span>Tenggat:</span>
                                 <span className="mono-tabular font-semibold text-foreground">
                                    {task.deadline}
                                 </span>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* Footer Ringkasan Papan Tugas */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3.5 text-xs text-muted-foreground">
               <span>
                  Klik label status pada kartu untuk menandai tugas selesai.
               </span>
               <span className="mono-tabular font-semibold text-foreground">
                  {completedCount}/{tasks.length} Target Tuntas
               </span>
            </div>
         </div>

         {/* =================================================================
          2. PANEL KANAN: AGENDA PENTING & MILESTONE KELULUSAN (5 KOLOM DESKTOP)
             MENGGUNAKAN CARD GRID 2 KOLOM (grid-cols-2) DI LAYAR HP
         ================================================================= */}
         <div className="obsidian-surface flex flex-col justify-between p-5 sm:p-6 lg:col-span-5">
            <div>
               <div className="flex items-start justify-between gap-2">
                  <div>
                     <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                        <CalendarCheck2 className="h-3.5 w-3.5 shrink-0" />
                        <span className="mono-tabular tracking-widest uppercase">
                           ROADMAP & AGENDA KELAS 2026
                        </span>
                     </div>
                     <h3 className="mt-1 text-base font-bold tracking-tight text-foreground sm:text-lg">
                        Milestone Menuju Kelulusan PPLG 1
                     </h3>
                  </div>

                  <span className="mono-tabular rounded-lg border border-indigo-400/35 bg-indigo-500/15 px-2.5 py-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-200 shrink-0">
                     {agendas.length} AGENDA
                  </span>
               </div>

               {/* Grid Agenda: WAJIB Card Grid 2 Kolom di HP (grid-cols-2) */}
               <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {agendas.map((event) => (
                     <div
                        key={event.id}
                        className={`obsidian-pill flex flex-col justify-between rounded-xl p-3 transition-all duration-200 ${
                           event.isHighlighted
                              ? "border-indigo-400/45 bg-indigo-500/10 glow-indigo"
                              : "hover:border-indigo-400/30"
                        }`}>
                        <div>
                           <div className="flex items-center justify-between gap-1">
                              <span className="mono-tabular rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:text-indigo-200">
                                 {event.code}
                              </span>
                              <Flag
                                 className={`h-3 w-3 shrink-0 ${
                                    event.isHighlighted
                                       ? "text-amber-500 dark:text-amber-300"
                                       : "text-muted-foreground"
                                 }`}
                              />
                           </div>

                           <h4 className="mt-2 line-clamp-2 text-xs font-bold leading-snug text-foreground">
                              {event.title}
                           </h4>
                        </div>

                        <div className="mt-3 flex flex-col gap-1 border-t border-[var(--color-border)] pt-2 text-[10px]">
                           <span className="mono-tabular font-semibold text-sky-600 dark:text-sky-300">
                              {event.dateLabel}
                           </span>
                           <span className="inline-flex items-center gap-1 truncate text-muted-foreground">
                              <MapPin className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{event.location}</span>
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Footer Ringkasan Agenda */}
            <div className="obsidian-pill mt-4 flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-xs">
               <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground truncate">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-300 shrink-0" />
                  <span className="truncate">
                     Puncak Seremoni & Kapsul Kado 3D
                  </span>
               </span>
               <a
                  href="#farewell-gift-section"
                  className="mono-tabular font-bold text-amber-600 dark:text-amber-300 hover:underline shrink-0">
                  15 MEI 2026 →
               </a>
            </div>
         </div>

         {/* =================================================================
          3. MODAL ADMIN CRUD TUGAS & AGENDA KELULUSAN
         ================================================================= */}
         <TasksCrudModal
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            tasks={tasks}
            agendas={agendas}
            onSaveTask={handleSaveSingleTask}
            onDeleteTask={handleDeleteSingleTask}
            onSaveAgendas={handleSaveAgendas}
            onResetDefault={handleResetDefault}
            onSyncTasksToSupabase={() => syncAllTasksToSupabase(tasks)}
         />
      </div>
   );
}
