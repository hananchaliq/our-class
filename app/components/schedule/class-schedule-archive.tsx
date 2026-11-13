"use client";

import * as React from "react";
import {
   ArrowUpRight,
   BookOpen,
   Brush,
   CalendarClock,
   Clock,
   Code2,
   Sparkles,
   Users,
} from "lucide-react";
import {
   INITIAL_PPLG1_STUDENTS,
   type ClassStudent,
} from "@/app/types/class-system";
import { useClassAuth } from "../auth/class-auth-provider";
import { ScheduleCrudModal } from "../admin/schedule-crud-modal";
import {
   getSupabaseBrowserClient,
   isSupabaseConfigured,
} from "@/lib/supabase/client";

export type SchoolDayName =
   | "Senin"
   | "Selasa"
   | "Rabu"
   | "Kamis"
   | "Jumat"
   | "Sabtu";

export interface ScheduleSubjectItem {
   id: string;
   day: SchoolDayName;
   slotCode: string;
   timeRange: string;
   subjectName: string;
   category: "produktif" | "umum";
   roomOrNote: string;
   teacherOrFocus: string;
}

export interface DayPiketConfig {
   day: SchoolDayName;
   shortCode: string;
   zoneFocus: string;
   absenList: number[];
}

export const SCHOOL_DAYS: {
   day: SchoolDayName;
   short: string;
   absenRange: string;
}[] = [
   { day: "Senin", short: "SEN", absenRange: "#01–#04" },
   { day: "Selasa", short: "SEL", absenRange: "#05–#08" },
   { day: "Rabu", short: "RAB", absenRange: "#09–#12" },
   { day: "Kamis", short: "KAM", absenRange: "#13–#16" },
   { day: "Jumat", short: "JUM", absenRange: "#17–#19" },
   { day: "Sabtu", short: "SAB", absenRange: "#20–#22" },
];

export const INITIAL_CLASS_SCHEDULES: ScheduleSubjectItem[] = [
   // SENIN
   {
      id: "mon-1",
      day: "Senin",
      slotCode: "JAM 01–03",
      timeRange: "07:00 – 09:15",
      subjectName: "Pemrograman Web & Next.js",
      category: "produktif",
      roomOrNote: "Lab RPL 1",
      teacherOrFocus: "App Router & Server Actions",
   },
   {
      id: "mon-2",
      day: "Senin",
      slotCode: "JAM 04–06",
      timeRange: "09:30 – 11:45",
      subjectName: "Basis Data & PostgreSQL",
      category: "produktif",
      roomOrNote: "Lab RPL 1",
      teacherOrFocus: "Skema Relasional & RLS Policy",
   },
   {
      id: "mon-3",
      day: "Senin",
      slotCode: "JAM 07–08",
      timeRange: "12:30 – 14:00",
      subjectName: "Matematika Terapan",
      category: "umum",
      roomOrNote: "R. Teori 12",
      teacherOrFocus: "Logika Diskrit & Matriks",
   },
   {
      id: "mon-4",
      day: "Senin",
      slotCode: "JAM 09–10",
      timeRange: "14:00 – 15:30",
      subjectName: "Bahasa Indonesia",
      category: "umum",
      roomOrNote: "R. Teori 12",
      teacherOrFocus: "Penulisan Laporan Teknis UKK",
   },

   // SELASA
   {
      id: "tue-1",
      day: "Selasa",
      slotCode: "JAM 01–04",
      timeRange: "07:00 – 10:00",
      subjectName: "Pengembangan Gim & Shader 3D",
      category: "produktif",
      roomOrNote: "Lab Multimedia",
      teacherOrFocus: "Unity 3D, C# & Physics Engine",
   },
   {
      id: "tue-2",
      day: "Selasa",
      slotCode: "JAM 05–07",
      timeRange: "10:15 – 12:15",
      subjectName: "Pemrograman Perangkat Bergerak",
      category: "produktif",
      roomOrNote: "Lab RPL 2",
      teacherOrFocus: "Flutter, Dart & State Management",
   },
   {
      id: "tue-3",
      day: "Selasa",
      slotCode: "JAM 08–09",
      timeRange: "13:00 – 14:30",
      subjectName: "Bahasa Inggris Teknis",
      category: "umum",
      roomOrNote: "R. Bahasa",
      teacherOrFocus: "Technical Documentation & Pitching",
   },
   {
      id: "tue-4",
      day: "Selasa",
      slotCode: "JAM 10",
      timeRange: "14:30 – 15:30",
      subjectName: "Pendidikan Pancasila",
      category: "umum",
      roomOrNote: "R. Teori 12",
      teacherOrFocus: "Etika Digital & Kewarganegaraan",
   },

   // RABU
   {
      id: "wed-1",
      day: "Rabu",
      slotCode: "JAM 01–04",
      timeRange: "07:00 – 10:00",
      subjectName: "Arsitektur Backend & REST API",
      category: "produktif",
      roomOrNote: "Lab Server PPLG",
      teacherOrFocus: "Laravel, Go, JWT & Microservices",
   },
   {
      id: "wed-2",
      day: "Rabu",
      slotCode: "JAM 05–07",
      timeRange: "10:15 – 12:15",
      subjectName: "DevOps, Cloud & Kontainerisasi",
      category: "produktif",
      roomOrNote: "Lab Server PPLG",
      teacherOrFocus: "Docker, CI/CD & Vercel Deployment",
   },
   {
      id: "wed-3",
      day: "Rabu",
      slotCode: "JAM 08–09",
      timeRange: "13:00 – 14:30",
      subjectName: "Produk Kreatif & Kewirausahaan",
      category: "produktif",
      roomOrNote: "R. Inkubator",
      teacherOrFocus: "Manajemen Produk SaaS & Pitch Deck",
   },
   {
      id: "wed-4",
      day: "Rabu",
      slotCode: "JAM 10",
      timeRange: "14:30 – 15:30",
      subjectName: "Bimbingan Karir & Industri",
      category: "umum",
      roomOrNote: "R. Teori 12",
      teacherOrFocus: "Review CV & Portofolio GitHub",
   },

   // KAMIS
   {
      id: "thu-1",
      day: "Kamis",
      slotCode: "JAM 01–03",
      timeRange: "07:00 – 09:15",
      subjectName: "UI/UX Design System & Prototyping",
      category: "produktif",
      roomOrNote: "Studio Kreatif",
      teacherOrFocus: "Figma Auto-Layout & Swiss-Grid",
   },
   {
      id: "thu-2",
      day: "Kamis",
      slotCode: "JAM 04–06",
      timeRange: "09:30 – 11:45",
      subjectName: "Frontend Interaktif & WebGL",
      category: "produktif",
      roomOrNote: "Lab RPL 1",
      teacherOrFocus: "Tailwind CSS v4, Motion & CSS 3D",
   },
   {
      id: "thu-3",
      day: "Kamis",
      slotCode: "JAM 07–08",
      timeRange: "12:30 – 14:00",
      subjectName: "Pendidikan Agama & Budi Pekerti",
      category: "umum",
      roomOrNote: "R. Teori 12",
      teacherOrFocus: "Akhlak Profesi & Integritas",
   },
   {
      id: "thu-4",
      day: "Kamis",
      slotCode: "JAM 09–10",
      timeRange: "14:00 – 15:30",
      subjectName: "Sejarah Indonesia",
      category: "umum",
      roomOrNote: "R. Teori 12",
      teacherOrFocus: "Transformasi Teknologi Nusantara",
   },

   // JUMAT
   {
      id: "fri-1",
      day: "Jumat",
      slotCode: "JAM 01–03",
      timeRange: "07:00 – 09:00",
      subjectName: "Sprint Proyek Akhir & UKK PPLG",
      category: "produktif",
      roomOrNote: "Lab RPL Utama",
      teacherOrFocus: "Integrasi Full-Stack & Database",
   },
   {
      id: "fri-2",
      day: "Jumat",
      slotCode: "JAM 04–05",
      timeRange: "09:15 – 10:45",
      subjectName: "Quality Assurance & Automated Test",
      category: "produktif",
      roomOrNote: "Lab RPL Utama",
      teacherOrFocus: "Playwright Testing & Bug Triage",
   },
   {
      id: "fri-3",
      day: "Jumat",
      slotCode: "JAM 06–07",
      timeRange: "11:00 – 11:45",
      subjectName: "Code Review & Standup Kelas",
      category: "produktif",
      roomOrNote: "Lab RPL Utama",
      teacherOrFocus: "Evaluasi Commit Mingguan 22 Siswa",
   },
   {
      id: "fri-4",
      day: "Jumat",
      slotCode: "JAM 08",
      timeRange: "13:00 – 14:00",
      subjectName: "Olahraga & Kebugaran",
      category: "umum",
      roomOrNote: "Lapangan Utama",
      teacherOrFocus: "Futsal & Kebugaran Angkatan",
   },

   // SABTU
   {
      id: "sat-1",
      day: "Sabtu",
      slotCode: "JAM 01–02",
      timeRange: "07:30 – 09:00",
      subjectName: "Kurasi Portofolio & Demo Karya",
      category: "produktif",
      roomOrNote: "Lab RPL 1",
      teacherOrFocus: "Showcase Project 4 Divisi Teknis",
   },
   {
      id: "sat-2",
      day: "Sabtu",
      slotCode: "JAM 03–04",
      timeRange: "09:15 – 10:45",
      subjectName: "Komunitas Open-Source Kelas",
      category: "produktif",
      roomOrNote: "Lab RPL 1",
      teacherOrFocus: "Pemeliharaan Repo our-class 2026",
   },
   {
      id: "sat-3",
      day: "Sabtu",
      slotCode: "JAM 05–06",
      timeRange: "11:00 – 12:15",
      subjectName: "Dokumentasi Kapsul Kelulusan",
      category: "umum",
      roomOrNote: "Studio Kelas",
      teacherOrFocus: "Sesi Foto, Album Memori & Kado 3D",
   },
   {
      id: "sat-4",
      day: "Sabtu",
      slotCode: "JAM 07",
      timeRange: "12:30 – 13:30",
      subjectName: "Evaluasi Wali Kelas & Kebersihan",
      category: "umum",
      roomOrNote: "Ruang XII PPLG 1",
      teacherOrFocus: "Penutupan Pekan & Operasi Semut",
   },
];

export const INITIAL_PIKET_GROUPS: DayPiketConfig[] = [
   {
      day: "Senin",
      shortCode: "REGU 01",
      zoneFocus: "Meja Lab Depan, Papan Tulis & Proyektor",
      absenList: [1, 2, 3, 4],
   },
   {
      day: "Selasa",
      shortCode: "REGU 02",
      zoneFocus: "Baris Workstation Kiri & Rak Kabel LAN",
      absenList: [5, 6, 7, 8],
   },
   {
      day: "Rabu",
      shortCode: "REGU 03",
      zoneFocus: "Baris Workstation Kanan & Sudut Server",
      absenList: [9, 10, 11, 12],
   },
   {
      day: "Kamis",
      shortCode: "REGU 04",
      zoneFocus: "Area Studio Kreatif, Kaca & Koridor Kelas",
      absenList: [13, 14, 15, 16],
   },
   {
      day: "Jumat",
      shortCode: "REGU 05",
      zoneFocus: "Sterilisasi Lab Utama & Penataan Kursi",
      absenList: [17, 18, 19],
   },
   {
      day: "Sabtu",
      shortCode: "REGU 06",
      zoneFocus: "Pengecekan Akhir Pekan & Penguncian Lab",
      absenList: [20, 21, 22],
   },
];

const SCHEDULES_STORAGE_KEY = "pplg1-schedules-v1";
const PIKET_STORAGE_KEY = "pplg1-piket-v1";

interface ClassScheduleArchiveProps {
   students?: ClassStudent[];
   schedules?: ScheduleSubjectItem[];
   onOpenAdminScheduleModal?: () => void;
}

export function ClassScheduleArchive({
   students = INITIAL_PPLG1_STUDENTS,
   schedules: initialSchedulesProp = INITIAL_CLASS_SCHEDULES,
   onOpenAdminScheduleModal,
}: ClassScheduleArchiveProps) {
   const { isAdmin, openLoginModal } = useClassAuth();
   const [schedulesList, setSchedulesList] =
      React.useState<ScheduleSubjectItem[]>(initialSchedulesProp);
   const [piketGroups, setPiketGroups] =
      React.useState<DayPiketConfig[]>(INITIAL_PIKET_GROUPS);

   const [selectedDay, setSelectedDay] = React.useState<SchoolDayName>("Senin");
   const [todayName, setTodayName] = React.useState<SchoolDayName | null>(null);
   const [categoryFilter, setCategoryFilter] = React.useState<
      "all" | "produktif" | "umum"
   >("all");
   const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);

   // 1. Deteksi hari aktif WIB secara otomatis saat komponen dimuat
   React.useEffect(() => {
      try {
         const dayStr = new Intl.DateTimeFormat("id-ID", {
            timeZone: "Asia/Jakarta",
            weekday: "long",
         }).format(new Date());

         const matched = SCHOOL_DAYS.find(
            (d) => d.day.toLowerCase() === dayStr.toLowerCase()
         );
         if (matched) {
            setTodayName(matched.day);
            setSelectedDay(matched.day);
         }
      } catch {
         // Gunakan default Senin
      }
   }, []);

   // 2. Muat data jadwal & piket dari localStorage + Supabase public.schedules
   React.useEffect(() => {
      let isMounted = true;

      try {
         const savedSchedules = window.localStorage.getItem(
            SCHEDULES_STORAGE_KEY
         );
         if (savedSchedules) {
            const parsed = JSON.parse(savedSchedules) as ScheduleSubjectItem[];
            if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
               setSchedulesList(parsed);
            }
         }

         const savedPiket = window.localStorage.getItem(PIKET_STORAGE_KEY);
         if (savedPiket) {
            const parsedPiket = JSON.parse(savedPiket) as DayPiketConfig[];
            if (
               Array.isArray(parsedPiket) &&
               parsedPiket.length > 0 &&
               isMounted
            ) {
               setPiketGroups(parsedPiket);
            }
         }
      } catch {
         // Abaikan bila localStorage tidak tersedia
      }

      async function fetchSchedulesFromSupabase() {
         if (!isSupabaseConfigured()) return;
         const supabase = getSupabaseBrowserClient();
         if (!supabase) return;

         const { data, error } = await supabase
            .from("schedules")
            .select("*");

         if (error || !data || data.length === 0 || !isMounted) return;

         const loadedLessons: ScheduleSubjectItem[] = [];
         const loadedPiket: DayPiketConfig[] = [];

         for (const row of data) {
            const dayName = row.day_name as SchoolDayName;
            if (Array.isArray(row.lessons)) {
               for (const lesson of row.lessons) {
                  loadedLessons.push({
                     id: String(lesson.id ?? `${dayName}-${Math.random()}`),
                     day: dayName,
                     slotCode: String(lesson.slotCode ?? "JAM 01–02"),
                     timeRange: String(lesson.timeRange ?? "07:00 – 08:30"),
                     subjectName: String(
                        lesson.subjectName ?? "Mata Pelajaran PPLG"
                     ),
                     category:
                        lesson.category === "umum" ? "umum" : "produktif",
                     roomOrNote: String(lesson.roomOrNote ?? "Lab RPL 1"),
                     teacherOrFocus: String(
                        lesson.teacherOrFocus ?? "Materi XII PPLG 1"
                     ),
                  });
               }
            }

            if (Array.isArray(row.piket_members)) {
               loadedPiket.push({
                  day: dayName,
                  shortCode: String(row.piket_group_code ?? "REGU PIKET"),
                  zoneFocus: String(
                     row.piket_target_area ?? "Lab RPL & Ruang XII PPLG 1"
                  ),
                  absenList: row.piket_members
                     .map((n: unknown) => Number(n))
                     .filter((n: number) => !Number.isNaN(n)),
               });
            }
         }

         if (loadedLessons.length > 0 && isMounted) {
            setSchedulesList(loadedLessons);
            try {
               window.localStorage.setItem(
                  SCHEDULES_STORAGE_KEY,
                  JSON.stringify(loadedLessons)
               );
            } catch {
               // Ignore
            }
         }

         if (loadedPiket.length > 0 && isMounted) {
            const mergedPiket = INITIAL_PIKET_GROUPS.map(
               (def) => loadedPiket.find((p) => p.day === def.day) ?? def
            );
            setPiketGroups(mergedPiket);
            try {
               window.localStorage.setItem(
                  PIKET_STORAGE_KEY,
                  JSON.stringify(mergedPiket)
               );
            } catch {
               // Ignore
            }
         }
      }

      fetchSchedulesFromSupabase();

      return () => {
         isMounted = false;
      };
   }, []);

   // Helper untuk menyinkronkan jadwal 6 hari ke tabel public.schedules
   const syncSchedulesToSupabase = React.useCallback(
      async (
         targetSchedules: ScheduleSubjectItem[],
         targetPiketGroups: DayPiketConfig[]
      ) => {
         if (!isSupabaseConfigured()) return;
         const supabase = getSupabaseBrowserClient();
         if (!supabase) return;

         const rowsPayload = SCHOOL_DAYS.map((dayMeta) => {
            const lessonsForDay = targetSchedules.filter(
               (s) => s.day === dayMeta.day
            );
            const piketForDay =
               targetPiketGroups.find((p) => p.day === dayMeta.day) ??
               INITIAL_PIKET_GROUPS.find((p) => p.day === dayMeta.day) ??
               INITIAL_PIKET_GROUPS[0];

            const coordinatorStudent = students.find(
               (st) => st.absen === piketForDay.absenList[0]
            );

            return {
               id: `day-${dayMeta.day.toLowerCase()}`,
               day_name: dayMeta.day,
               day_code: dayMeta.short,
               focus_theme:
                  lessonsForDay[0]?.subjectName ?? "Produktif XII PPLG 1",
               room_summary: lessonsForDay[0]?.roomOrNote ?? "Lab RPL 1",
               lessons: lessonsForDay,
               piket_group_code: piketForDay.shortCode,
               piket_coordinator:
                  coordinatorStudent?.name ?? "Koordinator Regu",
               piket_target_area: piketForDay.zoneFocus,
               piket_members: piketForDay.absenList,
               updated_at: new Date().toISOString(),
            };
         });

         const { error } = await supabase
            .from("schedules")
            .upsert(rowsPayload, { onConflict: "id" });

         if (error) {
            throw new Error(error.message);
         }
      },
      [students]
   );

   const handleSaveSchedulesAndPiket = async (
      nextSchedules: ScheduleSubjectItem[],
      nextPiketGroups: DayPiketConfig[]
   ) => {
      setSchedulesList(nextSchedules);
      setPiketGroups(nextPiketGroups);

      try {
         window.localStorage.setItem(
            SCHEDULES_STORAGE_KEY,
            JSON.stringify(nextSchedules)
         );
         window.localStorage.setItem(
            PIKET_STORAGE_KEY,
            JSON.stringify(nextPiketGroups)
         );
      } catch {
         // Ignore
      }

      if (isSupabaseConfigured()) {
         await syncSchedulesToSupabase(nextSchedules, nextPiketGroups);
      }
   };

   const handleResetDefault = async () => {
      setSchedulesList(INITIAL_CLASS_SCHEDULES);
      setPiketGroups(INITIAL_PIKET_GROUPS);

      try {
         window.localStorage.removeItem(SCHEDULES_STORAGE_KEY);
         window.localStorage.removeItem(PIKET_STORAGE_KEY);
      } catch {
         // Ignore
      }

      if (isSupabaseConfigured()) {
         await syncSchedulesToSupabase(
            INITIAL_CLASS_SCHEDULES,
            INITIAL_PIKET_GROUPS
         );
      }
   };

   const daySubjects = React.useMemo(() => {
      return schedulesList.filter((item) => {
         if (item.day !== selectedDay) return false;
         if (categoryFilter !== "all" && item.category !== categoryFilter) {
            return false;
         }
         return true;
      });
   }, [schedulesList, selectedDay, categoryFilter]);

   const activePiketGroup = React.useMemo(() => {
      return (
         piketGroups.find((g) => g.day === selectedDay) ??
         INITIAL_PIKET_GROUPS.find((g) => g.day === selectedDay) ??
         INITIAL_PIKET_GROUPS[0]
      );
   }, [piketGroups, selectedDay]);

   const piketStudents = React.useMemo(() => {
      return activePiketGroup.absenList
         .map((absenNum) => students.find((s) => s.absen === absenNum))
         .filter((s): s is ClassStudent => Boolean(s));
   }, [activePiketGroup, students]);

   const handleJumpToStudentCard = (student: ClassStudent) => {
      const lanyardEl = document.getElementById("lanyard-section");
      if (lanyardEl) {
         lanyardEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      window.dispatchEvent(
         new CustomEvent("pplg1:select-student", {
            detail: { absen: student.absen, studentId: student.id },
         })
      );
   };

   return (
      <div className="obsidian-surface flex flex-col gap-6 p-5 sm:p-7">
         {/* =================================================================
          1. HEADER SECTION 03 & TAB HARI (SENIN - SABTU)
         ================================================================= */}
         <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
               <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-300">
                  <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                  <span className="mono-tabular tracking-widest uppercase">
                     SECTION 03 · ARSIP JADWAL MAPEL & PIKET KENANGAN
                  </span>
               </div>
               <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Jadwal Produktif PPLG & Regu Piket Harian
               </h2>
               <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Disusun dalam format{" "}
                  <strong className="font-semibold text-foreground">
                     Card Grid 2 Kolom
                  </strong>{" "}
                  yang ringkas untuk layar HP maupun desktop. Klik nama petugas
                  piket untuk melihat ID Card 3D-nya.
               </p>
            </div>

            {/* Kontrol Filter Kategori Mapel & Tombol Edit Admin */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
               <div
                  role="group"
                  aria-label="Filter kategori mata pelajaran"
                  className="obsidian-pill inline-flex items-center gap-1 rounded-xl p-1">
                  {(
                     [
                        { key: "all", label: "Semua Mapel" },
                        { key: "produktif", label: "Produktif PPLG" },
                        { key: "umum", label: "Mapel Umum" },
                     ] as const
                  ).map((tab) => {
                     const active = categoryFilter === tab.key;
                     return (
                        <button
                           key={tab.key}
                           type="button"
                           onClick={() => setCategoryFilter(tab.key)}
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
                        if (onOpenAdminScheduleModal) {
                           onOpenAdminScheduleModal();
                        } else {
                           setIsScheduleModalOpen(true);
                        }
                     }}
                     className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-emerald-400/45 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-200 whitespace-nowrap">
                     <Sparkles className="h-3.5 w-3.5" />
                     <span>Kelola Jadwal & Piket</span>
                  </button>
               )}
               {!isAdmin && onOpenAdminScheduleModal && (
                  <button
                     type="button"
                     onClick={openLoginModal}
                     className="sr-only">
                     Login Admin
                  </button>
               )}
            </div>
         </div>

         {/* Pemilih 6 Hari Sekolah (Grid 3 Kolom di HP, Baris Penuh di Tablet/Desktop) */}
         <div
            role="tablist"
            aria-label="Pilih hari jadwal Senin sampai Sabtu"
            className="grid grid-cols-3 gap-2 border-y border-[var(--color-border)] py-3.5 sm:grid-cols-6">
            {SCHOOL_DAYS.map((item) => {
               const isSelected = selectedDay === item.day;
               const isToday = todayName === item.day;
               const dayPiket = piketGroups.find((g) => g.day === item.day);
               const dynamicAbsenRange =
                  dayPiket && dayPiket.absenList.length > 0
                     ? `#${String(dayPiket.absenList[0]).padStart(2, "0")}–#${String(
                          dayPiket.absenList[dayPiket.absenList.length - 1]
                       ).padStart(2, "0")}`
                     : item.absenRange;

               return (
                  <button
                     key={item.day}
                     type="button"
                     role="tab"
                     aria-selected={isSelected}
                     onClick={() => setSelectedDay(item.day)}
                     className={`obsidian-pill flex flex-col items-start justify-between rounded-xl p-2.5 text-left transition-all duration-200 ${
                        isSelected
                           ? "border-sky-400/50 bg-sky-500/15 glow-cyan"
                           : "hover:border-sky-400/30"
                     }`}>
                     <div className="flex w-full items-center justify-between gap-1">
                        <span
                           className={`mono-tabular text-[10px] font-bold tracking-wider ${
                              isSelected
                                 ? "text-sky-600 dark:text-sky-300"
                                 : "text-muted-foreground"
                           }`}>
                           {item.short}
                        </span>
                        {isToday && (
                           <span className="mono-tabular rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
                              HARI INI
                           </span>
                        )}
                     </div>

                     <span className="mt-1 truncate text-xs sm:text-sm font-bold text-foreground">
                        {item.day}
                     </span>

                     <span className="mono-tabular mt-0.5 text-[10px] text-muted-foreground">
                        Piket {dynamicAbsenRange}
                     </span>
                  </button>
               );
            })}
         </div>

         {/* =================================================================
          2. ARSIP MATA PELAJARAN HARIAN (WAJIB CARD GRID 2 KOLOM DI HP)
         ================================================================= */}
         <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
               <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <BookOpen className="h-4 w-4 text-sky-500 dark:text-sky-300 shrink-0" />
                  <span>Mata Pelajaran Hari {selectedDay}</span>
               </div>
               <span className="mono-tabular text-[11px] text-muted-foreground">
                  {daySubjects.length} Sesi Pelajaran
               </span>
            </div>

            {/* Card Grid 2 Kolom di HP (grid-cols-2), 4 Kolom di Layar Lebar */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
               {daySubjects.map((sub) => {
                  const isProduktif = sub.category === "produktif";
                  return (
                     <div
                        key={sub.id}
                        className="obsidian-pill flex flex-col justify-between rounded-xl p-3 sm:p-4">
                        <div>
                           {/* Baris Atas: Jam & Kode Sesi */}
                           <div className="flex flex-wrap items-center justify-between gap-1">
                              <span
                                 className={`mono-tabular text-[10px] font-bold ${
                                    isProduktif
                                       ? "text-sky-600 dark:text-sky-300"
                                       : "text-indigo-600 dark:text-indigo-300"
                                 }`}>
                                 {sub.slotCode}
                              </span>
                              <span className="mono-tabular inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                                 <Clock className="h-2.5 w-2.5 shrink-0" />
                                 <span>{sub.timeRange}</span>
                              </span>
                           </div>

                           {/* Nama Mata Pelajaran */}
                           <h3 className="mt-2 line-clamp-2 text-xs sm:text-sm font-bold leading-snug text-foreground">
                              {sub.subjectName}
                           </h3>

                           {/* Topik / Fokus Materi */}
                           <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                              {sub.teacherOrFocus}
                           </p>
                        </div>

                        {/* Footer Kartu Mapel */}
                        <div className="mt-3 flex items-center justify-between gap-1 border-t border-[var(--color-border)] pt-2 text-[10px]">
                           <span className="inline-flex items-center gap-1 font-medium text-foreground truncate">
                              <Code2 className="h-3 w-3 shrink-0 text-sky-500 dark:text-sky-300" />
                              <span className="truncate">{sub.roomOrNote}</span>
                           </span>
                           <span className="mono-tabular font-semibold text-muted-foreground uppercase shrink-0">
                              {isProduktif ? "PPLG" : "UMUM"}
                           </span>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         {/* =================================================================
          3. DAFTAR PETUGAS PIKET HARIAN (WAJIB CARD GRID 2 KOLOM DI HP)
         ================================================================= */}
         <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-5">
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
               <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Brush className="h-4 w-4 text-amber-500 dark:text-amber-300 shrink-0" />
                  <span>
                     Regu Piket Hari {selectedDay} ({activePiketGroup.shortCode})
                  </span>
               </div>
               <span className="text-[11px] text-muted-foreground">
                  Area Tugas:{" "}
                  <strong className="font-medium text-foreground">
                     {activePiketGroup.zoneFocus}
                  </strong>
               </span>
            </div>

            {/* Card Grid 2 Kolom di HP (grid-cols-2), 4 Kolom di Desktop */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
               {piketStudents.map((student) => {
                  const absenCode = String(student.absen).padStart(2, "0");
                  return (
                     <button
                        key={student.id}
                        type="button"
                        onClick={() => handleJumpToStudentCard(student)}
                        className="obsidian-pill group flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 hover:border-amber-400/45 hover:bg-amber-500/10">
                        <div className="flex items-center justify-between gap-2">
                           <span className="mono-tabular rounded-md border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                              ABSEN #{absenCode}
                           </span>
                           <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-500" />
                        </div>

                        <div className="mt-2.5">
                           <div className="truncate text-xs sm:text-sm font-bold text-foreground">
                              {student.name}
                           </div>
                           <div className="truncate text-[11px] text-muted-foreground">
                              {student.role}
                           </div>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between border-t border-[var(--color-border)] pt-2 text-[10px] text-muted-foreground">
                           <span className="inline-flex items-center gap-1 truncate">
                              <Users className="h-3 w-3 shrink-0 text-sky-500 dark:text-sky-300" />
                              <span className="truncate">{student.division}</span>
                           </span>
                           <span className="mono-tabular font-semibold text-sky-600 dark:text-sky-300 shrink-0">
                              ID 3D
                           </span>
                        </div>
                     </button>
                  );
               })}
            </div>
         </div>

         {/* =================================================================
          4. MODAL ADMIN CRUD JADWAL & PIKET HARIAN
         ================================================================= */}
         <ScheduleCrudModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            schedules={schedulesList}
            piketGroups={piketGroups}
            students={students}
            initialSelectedDay={selectedDay}
            onSaveSchedulesAndPiket={handleSaveSchedulesAndPiket}
            onResetDefault={handleResetDefault}
            onSyncAllToSupabase={() =>
               syncSchedulesToSupabase(schedulesList, piketGroups)
            }
         />
      </div>
   );
}
