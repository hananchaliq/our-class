"use client";

import * as React from "react";
import {
   Calendar,
   ChevronLeft,
   ChevronRight,
   Code2,
   ExternalLink,
   Eye,
   FolderGit2,
   Images,
   Layers,
   Plus,
   Search,
   Sparkles,
   UserCheck,
   X,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { GalleryCrudModal } from "../admin/gallery-crud-modal";
import { useClassAuth } from "../auth/class-auth-provider";

const PROJECTS_STORAGE_KEY = "pplg1-projects-v1";
const GALLERY_STORAGE_KEY = "pplg1-gallery-photos-v1";

export type ProjectDivision =
   | "Frontend"
   | "Backend"
   | "UI/UX & Creative"
   | "Game & Mobile";

export interface ClassProjectShowcaseItem {
   id: string;
   code: string;
   title: string;
   summary: string;
   division: ProjectDivision;
   authorName: string;
   authorAbsen: number;
   authorStudentId: string;
   techStack: string[];
   imageUrl: string;
   repoUrl: string;
   demoUrl?: string;
   createdAt: string;
   featured?: boolean;
}

export interface ClassGalleryMemoryItem {
   id: string;
   code: string;
   title: string;
   description: string;
   imageUrl: string;
   takenDate: string;
   location: string;
   tag: "Momen Lab" | "UKK & Pameran" | "Class Meeting" | "Angkatan 2026";
}

export const INITIAL_PPLG_PROJECTS: ClassProjectShowcaseItem[] = [
   {
      id: "prj-01",
      code: "PRJ-01",
      title: "Portal Digital & Kapsul 3D XII PPLG 1",
      summary:
         "Ekosistem arsip digital kelas dengan 22 ID Card Lanyard 3D interaktif, Bento Telemetry, dan Kapsul Memori Kelulusan 2026.",
      division: "Frontend",
      authorName: "Hanan Chaliq",
      authorAbsen: 9,
      authorStudentId: "pplg1-09",
      techStack: ["Next.js 15", "Tailwind v4", "Supabase"],
      imageUrl:
         "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80",
      repoUrl: "https://github.com/hananchaliq/our-class",
      demoUrl: "#hero-section",
      createdAt: "Feb 2026",
      featured: true,
   },
   {
      id: "prj-02",
      code: "PRJ-02",
      title: "Garuda Cloud — Distributed Auth & API Gateway",
      summary:
         "Layanan autentikasi terpusat dengan kebijakan Row Level Security PostgreSQL, rate-limiting Redis, dan audit log otomatis.",
      division: "Backend",
      authorName: "Adi Pratama & Daffa R.",
      authorAbsen: 1,
      authorStudentId: "pplg1-01",
      techStack: ["Go", "PostgreSQL", "Docker"],
      imageUrl:
         "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80",
      repoUrl: "https://github.com",
      createdAt: "Jan 2026",
      featured: true,
   },
   {
      id: "prj-03",
      code: "PRJ-03",
      title: "Obsidian Swiss UI — Design System Kit",
      summary:
         "Dokumentasi komponen Figma dan token warna adaptif Daylight Glass & Obsidian Dark untuk standar proyek UKK PPLG 1.",
      division: "UI/UX & Creative",
      authorName: "Alya Nabila & Gita S.",
      authorAbsen: 2,
      authorStudentId: "pplg1-02",
      techStack: ["Figma", "Design Token", "CSS 3D"],
      imageUrl:
         "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&auto=format&fit=crop&q=80",
      repoUrl: "https://dribbble.com",
      createdAt: "Feb 2026",
   },
   {
      id: "prj-04",
      code: "PRJ-04",
      title: "CyberRift 2026 — 3D Tactical Arena Game",
      summary:
         "Gim aksi taktis 3D dengan custom shader pencahayaan neon, AI pathfinding dinamis, dan mode LAN multiplayer satu lab.",
      division: "Game & Mobile",
      authorName: "Bagas Prakoso & Tegar S.",
      authorAbsen: 3,
      authorStudentId: "pplg1-03",
      techStack: ["Unity 3D", "C#", "ShaderGraph"],
      imageUrl:
         "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&auto=format&fit=crop&q=80",
      repoUrl: "https://itch.io",
      createdAt: "Mar 2026",
      featured: true,
   },
   {
      id: "prj-05",
      code: "PRJ-05",
      title: "SakuSekolah — Aplikasi Presensi & Koperasi Mobile",
      summary:
         "Aplikasi mobile lintas platform dengan pemindaian QR presensi siswa real-time dan notifikasi agenda kelas.",
      division: "Game & Mobile",
      authorName: "Eka Putra & Naufal D.",
      authorAbsen: 6,
      authorStudentId: "pplg1-06",
      techStack: ["Flutter", "Dart", "Supabase"],
      imageUrl:
         "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&auto=format&fit=crop&q=80",
      repoUrl: "https://github.com",
      createdAt: "Feb 2026",
   },
   {
      id: "prj-06",
      code: "PRJ-06",
      title: "PPLG Pulse — Telemetri Server & Analitik Lab",
      summary:
         "Dashboard pemantauan beban server praktikum, status deployment Vercel satu kelas, dan keamanan jaringan lokal.",
      division: "Backend",
      authorName: "Fajar Nugraha & Zaki F.",
      authorAbsen: 7,
      authorStudentId: "pplg1-07",
      techStack: ["Linux", "Python", "Next.js"],
      imageUrl:
         "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
      repoUrl: "https://github.com",
      createdAt: "Mar 2026",
   },
];

export const INITIAL_CLASS_GALLERY_PHOTOS: ClassGalleryMemoryItem[] = [
   {
      id: "gal-01",
      code: "MEM-01",
      title: "Sidang Akhir & Pameran Karya UKK PPLG 1",
      description:
         "Momen ketika 22 siswa mempresentasikan aplikasi web, sistem backend, desain UI/UX, dan gim di hadapan penguji industri.",
      imageUrl:
         "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
      takenDate: "18 Apr 2026",
      location: "Aula Utama & Lab RPL",
      tag: "UKK & Pameran",
   },
   {
      id: "gal-02",
      code: "MEM-02",
      title: "Lembur Debugging & Integrasi Database",
      description:
         "Suasana sore hari di Lab RPL Utama saat seluruh divisi menyatukan endpoint API dan menyempurnakan tampilan antarmuka.",
      imageUrl:
         "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80",
      takenDate: "11 Feb 2026",
      location: "Lab RPL Utama",
      tag: "Momen Lab",
   },
   {
      id: "gal-03",
      code: "MEM-03",
      title: "Juara Umum Class Meeting & E-Sports",
      description:
         "Kekompakan XII PPLG 1 di luar jam coding—membawa pulang piala bergilir antar jurusan semester akhir.",
      imageUrl:
         "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80",
      takenDate: "25 Mar 2026",
      location: "Lapangan & Gor Sekolah",
      tag: "Class Meeting",
   },
   {
      id: "gal-04",
      code: "MEM-04",
      title: "Sesi Foto Buku Tahunan Angkatan 2026",
      description:
         "Dokumentasi formasi lengkap 22 anggota XII PPLG 1 dengan identitas jaket jurusan kebanggaan.",
      imageUrl:
         "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80",
      takenDate: "02 Mei 2026",
      location: "Studio & Taman Kampus",
      tag: "Angkatan 2026",
   },
   {
      id: "gal-05",
      code: "MEM-05",
      title: "Workshop Arsitektur Cloud & Keamanan Siber",
      description:
         "Sesi berbagi ilmu internal antar divisi mengenai deployment modern, containerization, dan pengujian penetrasi web.",
      imageUrl:
         "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80",
      takenDate: "29 Jan 2026",
      location: "Lab Server & Jaringan",
      tag: "Momen Lab",
   },
   {
      id: "gal-06",
      code: "MEM-06",
      title: "Persiapan Kapsul Waktu & Malam Pelepasan",
      description:
         "Pengumpulan surat perpisahan, kutipan berkesan, dan rekaman memori untuk dikunci ke dalam Kado 3D Kelas.",
      imageUrl:
         "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000&auto=format&fit=crop&q=80",
      takenDate: "10 Mei 2026",
      location: "Ruang Kreatif PPLG 1",
      tag: "Angkatan 2026",
   },
];

interface LightboxSlide {
   id: string;
   code: string;
   title: string;
   subtitle: string;
   description: string;
   imageUrl: string;
   metaLeft: string;
   metaRight: string;
   badges: string[];
   externalHref?: string;
   studentId?: string;
}

interface ClassProjectGalleryProps {
   initialProjects?: ClassProjectShowcaseItem[];
   initialGalleryPhotos?: ClassGalleryMemoryItem[];
   onOpenAdminGalleryModal?: () => void;
}

export function ClassProjectGallery({
   initialProjects = INITIAL_PPLG_PROJECTS,
   initialGalleryPhotos = INITIAL_CLASS_GALLERY_PHOTOS,
   onOpenAdminGalleryModal,
}: ClassProjectGalleryProps) {
   const { isAdmin, isSupabaseConnected } = useClassAuth();

   const [projects, setProjects] =
      React.useState<ClassProjectShowcaseItem[]>(initialProjects);
   const [photos, setPhotos] =
      React.useState<ClassGalleryMemoryItem[]>(initialGalleryPhotos);

   const [activeView, setActiveView] = React.useState<
      "all" | "projects" | "photos"
   >("all");
   const [divisionFilter, setDivisionFilter] = React.useState<
      "Semua" | ProjectDivision
   >("Semua");
   const [searchQuery, setSearchQuery] = React.useState("");
   const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(
      null
   );
   const [lightboxSource, setLightboxSource] = React.useState<
      "projects" | "photos"
   >("photos");

   // State Modal CRUD Fase 17
   const [isCrudModalOpen, setIsCrudModalOpen] = React.useState(false);
   const [isSyncing, setIsSyncing] = React.useState(false);

   // 1. Muat data Project & Galeri Foto dari Supabase (tabel memories) atau localStorage
   React.useEffect(() => {
      let isMounted = true;

      const loadGalleryData = async () => {
         const supabase = getSupabaseBrowserClient();

         if (supabase) {
            const { data, error } = await supabase
               .from("memories")
               .select("*")
               .in("category", ["pplg_project", "class_gallery"])
               .order("created_at", { ascending: false });

            if (!error && Array.isArray(data) && data.length > 0 && isMounted) {
               const dbProjects = data
                  .filter((r) => r.category === "pplg_project")
                  .map((r) => ({
                     id: String(r.id),
                     code: String(r.code ?? "PRJ-01"),
                     title: String(r.title),
                     summary: String(r.description ?? ""),
                     division:
                        (r.division as ProjectDivision) ?? "Frontend",
                     authorName: String(r.author_name ?? "XII PPLG 1"),
                     authorAbsen: Number(r.author_absen ?? 1),
                     authorStudentId: String(
                        r.author_student_id ?? "pplg1-01"
                     ),
                     techStack: Array.isArray(r.tech_stack)
                        ? r.tech_stack
                        : ["Next.js", "Supabase"],
                     imageUrl: String(r.image_url),
                     repoUrl: String(r.repo_url ?? "https://github.com"),
                     demoUrl: String(r.demo_url ?? ""),
                     createdAt: String(r.taken_date ?? "2026"),
                     featured: true,
                  }));

               const dbPhotos = data
                  .filter((r) => r.category === "class_gallery")
                  .map((r) => ({
                     id: String(r.id),
                     code: String(r.code ?? "MEM-01"),
                     title: String(r.title),
                     description: String(r.description ?? ""),
                     imageUrl: String(r.image_url),
                     takenDate: String(r.taken_date ?? "2026"),
                     location: String(r.location ?? "Lab RPL Utama"),
                     tag:
                        (r.tag as ClassGalleryMemoryItem["tag"]) ??
                        "Angkatan 2026",
                  }));

               if (dbProjects.length > 0) setProjects(dbProjects);
               if (dbPhotos.length > 0) setPhotos(dbPhotos);
               return;
            }
         }

         // Fallback localStorage
         try {
            const rawPrj = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
            if (rawPrj && isMounted) {
               const parsed = JSON.parse(rawPrj) as ClassProjectShowcaseItem[];
               if (Array.isArray(parsed) && parsed.length > 0) {
                  setProjects(parsed);
               }
            }
            const rawPho = window.localStorage.getItem(GALLERY_STORAGE_KEY);
            if (rawPho && isMounted) {
               const parsed = JSON.parse(rawPho) as ClassGalleryMemoryItem[];
               if (Array.isArray(parsed) && parsed.length > 0) {
                  setPhotos(parsed);
               }
            }
         } catch {
            // Abaikan
         }
      };

      loadGalleryData();
      return () => {
         isMounted = false;
      };
   }, []);

   // 2. Fungsi CRUD Project Karya PPLG (Supabase + Local)
   const handleSaveProject = async (
      item: ClassProjectShowcaseItem,
      isNew: boolean
   ) => {
      setIsSyncing(true);
      const next = isNew
         ? [item, ...projects]
         : projects.map((p) => (p.id === item.id ? item : p));
      setProjects(next);
      try {
         window.localStorage.setItem(
            PROJECTS_STORAGE_KEY,
            JSON.stringify(next)
         );
      } catch {
         // Abaikan
      }

      const supabase = getSupabaseBrowserClient();
      if (supabase) {
         await supabase.from("memories").upsert(
            {
               id: item.id,
               code: item.code,
               title: item.title,
               description: item.summary,
               image_url: item.imageUrl,
               taken_date: item.createdAt,
               location: `Divisi ${item.division}`,
               category: "pplg_project",
               division: item.division,
               author_name: item.authorName,
               author_absen: item.authorAbsen,
               author_student_id: item.authorStudentId,
               tech_stack: item.techStack,
               repo_url: item.repoUrl,
               demo_url: item.demoUrl ?? "",
               tag: item.division,
            },
            { onConflict: "id" }
         );
      }
      setIsSyncing(false);
   };

   const handleDeleteProject = async (projectId: string) => {
      setIsSyncing(true);
      const next = projects.filter((p) => p.id !== projectId);
      setProjects(next);
      try {
         window.localStorage.setItem(
            PROJECTS_STORAGE_KEY,
            JSON.stringify(next)
         );
      } catch {
         // Abaikan
      }

      const supabase = getSupabaseBrowserClient();
      if (supabase) {
         await supabase.from("memories").delete().eq("id", projectId);
      }
      setIsSyncing(false);
   };

   // 3. Fungsi CRUD Galeri Foto Kelas (Supabase + Local)
   const handleSavePhoto = async (
      item: ClassGalleryMemoryItem,
      isNew: boolean
   ) => {
      setIsSyncing(true);
      const next = isNew
         ? [item, ...photos]
         : photos.map((m) => (m.id === item.id ? item : m));
      setPhotos(next);
      try {
         window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(next));
      } catch {
         // Abaikan
      }

      const supabase = getSupabaseBrowserClient();
      if (supabase) {
         await supabase.from("memories").upsert(
            {
               id: item.id,
               code: item.code,
               title: item.title,
               description: item.description,
               image_url: item.imageUrl,
               taken_date: item.takenDate,
               location: item.location,
               category: "class_gallery",
               tag: item.tag,
            },
            { onConflict: "id" }
         );
      }
      setIsSyncing(false);
   };

   const handleDeletePhoto = async (photoId: string) => {
      setIsSyncing(true);
      const next = photos.filter((m) => m.id !== photoId);
      setPhotos(next);
      try {
         window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(next));
      } catch {
         // Abaikan
      }

      const supabase = getSupabaseBrowserClient();
      if (supabase) {
         await supabase.from("memories").delete().eq("id", photoId);
      }
      setIsSyncing(false);
   };

   // 4. Sync Semua Project & Galeri ke Supabase
   const handleSyncAllToSupabase = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;
      setIsSyncing(true);

      const prjRows = projects.map((item) => ({
         id: item.id,
         code: item.code,
         title: item.title,
         description: item.summary,
         image_url: item.imageUrl,
         taken_date: item.createdAt,
         location: `Divisi ${item.division}`,
         category: "pplg_project",
         division: item.division,
         author_name: item.authorName,
         author_absen: item.authorAbsen,
         author_student_id: item.authorStudentId,
         tech_stack: item.techStack,
         repo_url: item.repoUrl,
         demo_url: item.demoUrl ?? "",
         tag: item.division,
      }));

      const phoRows = photos.map((item) => ({
         id: item.id,
         code: item.code,
         title: item.title,
         description: item.description,
         image_url: item.imageUrl,
         taken_date: item.takenDate,
         location: item.location,
         category: "class_gallery",
         tag: item.tag,
      }));

      await supabase
         .from("memories")
         .upsert([...prjRows, ...phoRows], { onConflict: "id" });
      setIsSyncing(false);
   };

   const handleResetDefaults = async () => {
      setProjects(INITIAL_PPLG_PROJECTS);
      setPhotos(INITIAL_CLASS_GALLERY_PHOTOS);
      try {
         window.localStorage.removeItem(PROJECTS_STORAGE_KEY);
         window.localStorage.removeItem(GALLERY_STORAGE_KEY);
      } catch {
         // Abaikan
      }
   };

   const filteredProjects = React.useMemo(() => {
      return projects.filter((project) => {
         const matchesDivision =
            divisionFilter === "Semua" || project.division === divisionFilter;
         const q = searchQuery.trim().toLowerCase();
         if (!q) return matchesDivision;
         return (
            matchesDivision &&
            (project.title.toLowerCase().includes(q) ||
               project.authorName.toLowerCase().includes(q) ||
               project.techStack.some((t) => t.toLowerCase().includes(q)))
         );
      });
   }, [projects, divisionFilter, searchQuery]);

   const filteredPhotos = React.useMemo(() => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return photos;
      return photos.filter(
         (photo) =>
            photo.title.toLowerCase().includes(q) ||
            photo.description.toLowerCase().includes(q) ||
            photo.tag.toLowerCase().includes(q)
      );
   }, [photos, searchQuery]);

   const activeSlides: LightboxSlide[] = React.useMemo(() => {
      if (lightboxSource === "projects") {
         return filteredProjects.map((p) => ({
            id: p.id,
            code: p.code,
            title: p.title,
            subtitle: `${p.authorName} (Absen #${String(p.authorAbsen).padStart(2, "0")}) · Divisi ${p.division}`,
            description: p.summary,
            imageUrl: p.imageUrl,
            metaLeft: p.createdAt,
            metaRight: p.division,
            badges: p.techStack,
            externalHref: p.repoUrl,
            studentId: p.authorStudentId,
         }));
      }
      return filteredPhotos.map((m) => ({
         id: m.id,
         code: m.code,
         title: m.title,
         subtitle: `${m.location} · ${m.takenDate}`,
         description: m.description,
         imageUrl: m.imageUrl,
         metaLeft: m.takenDate,
         metaRight: m.tag,
         badges: [m.tag, m.location],
      }));
   }, [lightboxSource, filteredProjects, filteredPhotos]);

   const currentSlide =
      lightboxIndex !== null ? activeSlides[lightboxIndex] ?? null : null;

   const openProjectLightbox = (idx: number) => {
      setLightboxSource("projects");
      setLightboxIndex(idx);
   };

   const openPhotoLightbox = (idx: number) => {
      setLightboxSource("photos");
      setLightboxIndex(idx);
   };

   const closeLightbox = React.useCallback(() => {
      setLightboxIndex(null);
   }, []);

   const stepLightbox = React.useCallback(
      (delta: number) => {
         if (lightboxIndex === null || activeSlides.length === 0) return;
         setLightboxIndex(
            (lightboxIndex + delta + activeSlides.length) % activeSlides.length
         );
      },
      [lightboxIndex, activeSlides.length]
   );

   React.useEffect(() => {
      if (lightboxIndex === null) return;
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") closeLightbox();
         if (e.key === "ArrowRight") stepLightbox(1);
         if (e.key === "ArrowLeft") stepLightbox(-1);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [lightboxIndex, closeLightbox, stepLightbox]);

   const handleJumpToStudentLanyard = (studentId: string) => {
      closeLightbox();
      window.dispatchEvent(
         new CustomEvent("pplg1:select-student", {
            detail: { studentId },
         })
      );
      const lanyardEl = document.getElementById("lanyard-section");
      if (lanyardEl) {
         lanyardEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
   };

   return (
      <div className="flex flex-col gap-5">
         {/* =====================================================================
          1. HEADER & KONTROL FILTER ETALASE KARYA + GALERI FOTO
         ===================================================================== */}
         <div className="obsidian-surface p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
               <div>
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                     <FolderGit2 className="h-3.5 w-3.5 shrink-0" />
                     <span className="mono-tabular tracking-widest uppercase">
                        SECTION 04 · REPOSITORI KARYA & DOKUMENTASI VISUAL
                     </span>
                  </div>
                  <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                     Etalase Project PPLG 1 & Galeri Momen Kelas
                  </h2>
                  <p className="mt-1 max-w-2xl text-xs sm:text-sm text-muted-foreground">
                     Arsip karya rekayasa perangkat lunak dari 4 divisi teknis serta dokumentasi foto kenangan angkatan 2026. Klik kartu atau foto untuk membuka pratinjau penuh.
                  </p>
               </div>

               {/* Tab View Switcher + Tombol Admin */}
               <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                  <div
                     role="tablist"
                     aria-label="Pilih tampilan karya atau galeri foto"
                     className="obsidian-pill inline-flex items-center gap-1 rounded-xl p-1">
                     {(
                        [
                           {
                              key: "all",
                              label: "Semua Arsip",
                              count: projects.length + photos.length,
                           },
                           {
                              key: "projects",
                              label: "Project Karya",
                              count: projects.length,
                           },
                           {
                              key: "photos",
                              label: "Galeri Foto",
                              count: photos.length,
                           },
                        ] as const
                     ).map((tab) => {
                        const active = activeView === tab.key;
                        return (
                           <button
                              key={tab.key}
                              type="button"
                              role="tab"
                              aria-selected={active}
                              onClick={() => setActiveView(tab.key)}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                                 active
                                    ? "bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 border border-indigo-400/35 glow-indigo"
                                    : "text-muted-foreground hover:text-foreground border border-transparent"
                              }`}>
                              <span>{tab.label}</span>
                              <span className="mono-tabular rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[10px]">
                                 {tab.count}
                              </span>
                           </button>
                        );
                     })}
                  </div>

                  {isAdmin && (
                     <button
                        type="button"
                        onClick={() => {
                           onOpenAdminGalleryModal?.();
                           setIsCrudModalOpen(true);
                        }}
                        className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-emerald-400/45 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-200 whitespace-nowrap">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Kelola Karya & Foto (CRUD)</span>
                     </button>
                  )}
               </div>
            </div>

            {/* Baris Filter Divisi & Pencarian Cepat */}
            <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center">
               {/* Filter Divisi Project */}
               <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <Layers className="mr-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  {(
                     [
                        "Semua",
                        "Frontend",
                        "Backend",
                        "UI/UX & Creative",
                        "Game & Mobile",
                     ] as const
                  ).map((div) => {
                     const active = divisionFilter === div;
                     return (
                        <button
                           key={div}
                           type="button"
                           onClick={() => setDivisionFilter(div)}
                           className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition whitespace-nowrap ${
                              active
                                 ? "bg-sky-500/20 text-sky-700 dark:text-sky-200 border border-sky-400/35 glow-cyan"
                                 : "obsidian-pill text-muted-foreground hover:text-foreground"
                           }`}>
                           {div}
                        </button>
                     );
                  })}
               </div>

               {/* Input Pencarian Karya / Momen */}
               <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Cari project, stack, foto..."
                     aria-label="Cari project atau galeri foto"
                     className="obsidian-pill w-full rounded-xl py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none"
                  />
                  {searchQuery && (
                     <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        aria-label="Reset pencarian"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        <X className="h-3.5 w-3.5" />
                     </button>
                  )}
               </div>
            </div>
         </div>

         {/* =====================================================================
          2. SUB-SECTION A: ETALASE PROJECT KARYA PPLG 1
             WAJIB CARD GRID 2 KOLOM DI HP (grid-cols-2 lg:grid-cols-3)
         ===================================================================== */}
         {(activeView === "all" || activeView === "projects") && (
            <div className="obsidian-surface p-5 sm:p-6">
               <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                     <Code2 className="h-4 w-4 text-sky-600 dark:text-sky-300" />
                     <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                        Etalase Karya Aplikasi & Gim Siswa ({filteredProjects.length})
                     </h3>
                  </div>
                  <span className="mono-tabular text-[11px] font-semibold text-muted-foreground">
                     KLIK KARTU UNTUK DETAIL
                  </span>
               </div>

               {filteredProjects.length === 0 ? (
                  <div className="obsidian-pill mt-4 rounded-xl p-6 text-center text-xs text-muted-foreground">
                     Tidak ada karya yang cocok dengan filter pencarian saat ini.
                  </div>
               ) : (
                  <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
                     {filteredProjects.map((project, idx) => (
                        <article
                           key={project.id}
                           className="obsidian-pill group flex flex-col justify-between overflow-hidden rounded-xl transition-all duration-200 hover:border-sky-400/45">
                           <div>
                              {/* Thumbnail Gambar Project (Klik untuk Lightbox) */}
                              <div
                                 role="button"
                                 tabIndex={0}
                                 onClick={() => openProjectLightbox(idx)}
                                 onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                       e.preventDefault();
                                       openProjectLightbox(idx);
                                    }
                                 }}
                                 className="relative aspect-16/10 w-full cursor-pointer overflow-hidden bg-slate-900">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                 <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                                 {/* Kode & Divisi di Atas Gambar */}
                                 <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between gap-1">
                                    <span className="mono-tabular rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-sky-300 backdrop-blur-md">
                                       {project.code}
                                    </span>
                                    <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md truncate">
                                       {project.division}
                                    </span>
                                 </div>

                                 {/* Tombol Hover Lightbox */}
                                 <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-black/75 px-2 py-1 text-[10px] font-semibold text-white opacity-90 transition group-hover:bg-sky-500 group-hover:text-slate-950">
                                    <Eye className="h-3 w-3" />
                                    <span className="hidden sm:inline">Preview</span>
                                 </div>
                              </div>

                              {/* Konten Teks Kartu */}
                              <div className="p-3 sm:p-4">
                                 <h4 className="line-clamp-2 text-xs font-bold leading-snug text-foreground sm:text-sm">
                                    {project.title}
                                 </h4>
                                 <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                                    {project.summary}
                                 </p>

                                 {/* Tech Stack Badges */}
                                 <div className="mt-2.5 flex flex-wrap gap-1">
                                    {project.techStack.map((tech) => (
                                       <span
                                          key={tech}
                                          className="mono-tabular rounded bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-sky-700 dark:text-sky-300">
                                          {tech}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           {/* Footer Kreator & Link */}
                           <div className="flex items-center justify-between gap-1.5 border-t border-[var(--color-border)] px-3 py-2.5 text-[10px] sm:px-4">
                              <button
                                 type="button"
                                 onClick={() =>
                                    handleJumpToStudentLanyard(
                                       project.authorStudentId
                                    )
                                 }
                                 title="Lihat ID Card 3D kreator ini"
                                 className="inline-flex items-center gap-1 truncate font-semibold text-muted-foreground hover:text-sky-600 dark:hover:text-sky-300">
                                 <UserCheck className="h-3 w-3 shrink-0 text-sky-500" />
                                 <span className="truncate">
                                    {project.authorName}
                                 </span>
                              </button>

                              <a
                                 href={project.repoUrl}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="mono-tabular inline-flex items-center gap-1 shrink-0 font-bold text-indigo-600 dark:text-indigo-300 hover:underline">
                                 <span>Repo</span>
                                 <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                           </div>
                        </article>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* =====================================================================
          3. SUB-SECTION B: GALERI FOTO MOMEN & KENANGAN KELAS
             WAJIB CARD GRID 2 KOLOM DI HP (grid-cols-2 lg:grid-cols-3)
         ===================================================================== */}
         {(activeView === "all" || activeView === "photos") && (
            <div className="obsidian-surface p-5 sm:p-6">
               <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                     <Images className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                     <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                        Galeri Dokumentasi & Momen Kelas ({filteredPhotos.length})
                     </h3>
                  </div>
                  <span className="mono-tabular text-[11px] font-semibold text-muted-foreground">
                     LIGHTBOX INTERAKTIF
                  </span>
               </div>

               {filteredPhotos.length === 0 ? (
                  <div className="obsidian-pill mt-4 rounded-xl p-6 text-center text-xs text-muted-foreground">
                     Tidak ada foto kenangan yang cocok dengan kata kunci pencarian.
                  </div>
               ) : (
                  <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
                     {filteredPhotos.map((photo, idx) => (
                        <div
                           key={photo.id}
                           role="button"
                           tabIndex={0}
                           onClick={() => openPhotoLightbox(idx)}
                           onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                 e.preventDefault();
                                 openPhotoLightbox(idx);
                              }
                           }}
                           className="obsidian-pill group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl text-left transition-all duration-200 hover:border-amber-400/45">
                           <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-900">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                 src={photo.imageUrl}
                                 alt={photo.title}
                                 loading="lazy"
                                 className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                              <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between gap-1">
                                 <span className="mono-tabular rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md">
                                    {photo.code}
                                 </span>
                                 <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md truncate">
                                    {photo.tag}
                                 </span>
                              </div>

                              <div className="absolute inset-x-2.5 bottom-2.5">
                                 <h4 className="line-clamp-2 text-xs font-bold leading-snug text-white sm:text-sm">
                                    {photo.title}
                                 </h4>
                              </div>
                           </div>

                           <div className="flex flex-col justify-between gap-2 p-3 sm:p-3.5">
                              <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                                 {photo.description}
                              </p>

                              <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-2 text-[10px] text-muted-foreground">
                                 <span className="mono-tabular inline-flex items-center gap-1 font-semibold text-foreground">
                                    <Calendar className="h-3 w-3 text-amber-500" />
                                    {photo.takenDate}
                                 </span>
                                 <span className="truncate">{photo.location}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* =====================================================================
          4. MODAL LIGHTBOX PREVIEW GAMBAR & DETAIL KARYA (KEYBOARD ACCESSIBLE)
         ===================================================================== */}
         {currentSlide && (
            <div
               role="dialog"
               aria-modal="true"
               aria-label={`Pratinjau ${currentSlide.title}`}
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
               onClick={closeLightbox}>
               <div
                  className="obsidian-surface relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-sky-400/35 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}>
                  {/* Baris Header Lightbox */}
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3 sm:px-6">
                     <div className="flex items-center gap-2 truncate">
                        <span className="mono-tabular rounded-md bg-sky-500/20 px-2 py-0.5 text-xs font-bold text-sky-600 dark:text-sky-300">
                           {currentSlide.code}
                        </span>
                        <span className="truncate text-xs font-semibold text-muted-foreground">
                           {currentSlide.metaRight}
                        </span>
                     </div>

                     <div className="flex items-center gap-1.5">
                        <button
                           type="button"
                           onClick={() => stepLightbox(-1)}
                           aria-label="Sebelumnya"
                           className="obsidian-pill rounded-lg p-1.5 text-foreground hover:border-sky-400/45">
                           <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="mono-tabular px-1.5 text-xs font-semibold text-muted-foreground">
                           {(lightboxIndex ?? 0) + 1} / {activeSlides.length}
                        </span>
                        <button
                           type="button"
                           onClick={() => stepLightbox(1)}
                           aria-label="Berikutnya"
                           className="obsidian-pill rounded-lg p-1.5 text-foreground hover:border-sky-400/45">
                           <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                           type="button"
                           onClick={closeLightbox}
                           aria-label="Tutup pratinjau"
                           className="obsidian-pill ml-1 rounded-lg p-1.5 text-foreground hover:border-rose-400/45">
                           <X className="h-4 w-4" />
                        </button>
                     </div>
                  </div>

                  {/* Area Gambar Utama */}
                  <div className="relative max-h-[52vh] w-full overflow-hidden bg-slate-950">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img
                        src={currentSlide.imageUrl}
                        alt={currentSlide.title}
                        className="mx-auto max-h-[52vh] w-full object-contain"
                     />
                  </div>

                  {/* Area Detail Informasi Bawah */}
                  <div className="flex flex-col gap-3 overflow-y-auto p-4 sm:p-6">
                     <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                           <h3 className="text-base font-bold text-foreground sm:text-lg">
                              {currentSlide.title}
                           </h3>
                           <p className="mt-0.5 text-xs font-medium text-sky-600 dark:text-sky-300">
                              {currentSlide.subtitle}
                           </p>
                        </div>
                        <span className="mono-tabular shrink-0 rounded-lg border border-[var(--color-border)] px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                           {currentSlide.metaLeft}
                        </span>
                     </div>

                     <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {currentSlide.description}
                     </p>

                     <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                        <div className="flex flex-wrap gap-1.5">
                           {currentSlide.badges.map((b) => (
                              <span
                                 key={b}
                                 className="mono-tabular rounded-md bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-200">
                                 {b}
                              </span>
                           ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                           {currentSlide.studentId && (
                              <button
                                 type="button"
                                 onClick={() =>
                                    handleJumpToStudentLanyard(
                                       currentSlide.studentId!
                                    )
                                 }
                                 className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground hover:border-sky-400/45">
                                 <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                                 <span>Lihat ID Card 3D Kreator</span>
                              </button>
                           )}

                           {currentSlide.externalHref && (
                              <a
                                 href={currentSlide.externalHref}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500/20 border border-sky-400/45 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-200">
                                 <span>Buka Repositori</span>
                                 <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* =====================================================================
          5. MODAL CRUD GALERI FOTO & PROJECT KARYA PPLG 1 (FASE 17)
         ===================================================================== */}
         <GalleryCrudModal
            isOpen={isCrudModalOpen}
            projects={projects}
            photos={photos}
            isSupabaseConnected={isSupabaseConnected}
            isSyncing={isSyncing}
            onClose={() => setIsCrudModalOpen(false)}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            onSavePhoto={handleSavePhoto}
            onDeletePhoto={handleDeletePhoto}
            onSyncAllToSupabase={handleSyncAllToSupabase}
            onResetDefaults={handleResetDefaults}
         />
      </div>
   );
}
