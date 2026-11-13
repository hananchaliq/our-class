export interface LanyardLink {
   label: string;
   href: string;
}

export interface LanyardMember {
   id: string;
   name: string;
   role: string;
   team?: string;
   image: string;
   bio?: string;
   tags?: string[];
   links?: LanyardLink[];
   tone?: 1 | 2 | 3 | 4 | 5;
   drop?: number;
}

export interface ClassStudent extends LanyardMember {
   absen: number;
   division: "Frontend" | "Backend" | "UI/UX & Creative" | "Game & Mobile";
}

export interface FarewellQuote {
   id: string;
   author_name: string;
   role?: string;
   quote: string;
   tone?: 1 | 2 | 3 | 4 | 5;
}

export interface FarewellMemoryPhoto {
   id: string;
   title: string;
   description: string;
   image_url: string;
   taken_date: string;
   category: "farewell_photo" | "class_gallery" | "pplg_project";
}

export interface FarewellBoxPayload {
   headline: string;
   subheadline: string;
   main_message: string;
   graduation_year: string;
   audio_title?: string;
   audio_url?: string;
   photos: FarewellMemoryPhoto[];
   quotes: FarewellQuote[];
}

export const INITIAL_PPLG1_STUDENTS: ClassStudent[] = [
   {
      id: "pplg1-01",
      absen: 1,
      name: "Adi Pratama",
      role: "Full-Stack Developer",
      team: "XII PPLG 1 · #01",
      division: "Backend",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      bio: "Suka ngulik arsitektur API dan optimasi query PostgreSQL tengah malam.",
      tags: ["Next.js", "Supabase", "PostgreSQL"],
      links: [{ label: "github.com/adipratama", href: "https://github.com" }],
      tone: 1,
      drop: 4,
   },
   {
      id: "pplg1-02",
      absen: 2,
      name: "Alya Nabila",
      role: "UI/UX Engineer",
      team: "XII PPLG 1 · #02",
      division: "UI/UX & Creative",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
      bio: "Obsesi sama Swiss-grid, dark mode obsidian, dan micro-interaction halus.",
      tags: ["Figma", "Tailwind v4", "Design System"],
      links: [{ label: "dribbble.com/alyanb", href: "https://dribbble.com" }],
      tone: 5,
      drop: 18,
   },
   {
      id: "pplg1-03",
      absen: 3,
      name: "Bagas Prakoso",
      role: "Game Developer",
      team: "XII PPLG 1 · #03",
      division: "Game & Mobile",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
      bio: "Bikin shader dan 3D asset di Blender sampai kipas laptop bunyi kayak jet.",
      tags: ["Unity", "Blender", "C#"],
      links: [{ label: "itch.io/bagasdev", href: "https://itch.io" }],
      tone: 3,
      drop: 0,
   },
   {
      id: "pplg1-04",
      absen: 4,
      name: "Citra Kirana",
      role: "Frontend Architect",
      team: "XII PPLG 1 · #04",
      division: "Frontend",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80",
      bio: "Kalau animasinya belum 60fps, berarti belum siap di-push ke production.",
      tags: ["React", "Framer Motion", "TypeScript"],
      links: [{ label: "github.com/citrakrn", href: "https://github.com" }],
      tone: 2,
      drop: 12,
   },
   {
      id: "pplg1-05",
      absen: 5,
      name: "Daffa Ramadhan",
      role: "Backend Engineer",
      team: "XII PPLG 1 · #05",
      division: "Backend",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      bio: "Spesialis auth, realtime websocket, dan penjaga server kelas.",
      tags: ["Laravel", "Go", "Docker"],
      links: [{ label: "github.com/daffarmd", href: "https://github.com" }],
      tone: 4,
      drop: 22,
   },
   {
      id: "pplg1-06",
      absen: 6,
      name: "Eka Putra",
      role: "Mobile Developer",
      team: "XII PPLG 1 · #06",
      division: "Game & Mobile",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      bio: "Build APK sekali jalan tanpa error Gradle adalah kebahagiaan tertinggi.",
      tags: ["Flutter", "Dart", "Firebase"],
      links: [{ label: "github.com/ekaputra", href: "https://github.com" }],
      tone: 1,
      drop: 8,
   },
   {
      id: "pplg1-07",
      absen: 7,
      name: "Fajar Nugraha",
      role: "DevOps & Cloud",
      team: "XII PPLG 1 · #07",
      division: "Backend",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80",
      bio: "Tukang deploy proyek satu kelas ke Vercel dan ngatur DNS.",
      tags: ["Linux", "Vercel", "CI/CD"],
      links: [{ label: "github.com/fajarnugraha", href: "https://github.com" }],
      tone: 3,
      drop: 15,
   },
   {
      id: "pplg1-08",
      absen: 8,
      name: "Gita Savitri",
      role: "Creative Technologist",
      team: "XII PPLG 1 · #08",
      division: "UI/UX & Creative",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
      bio: "Menggabungkan ilustrasi digital dengan CSS 3D dan WebGL interaktif.",
      tags: ["Three.js", "CSS 3D", "Illustrator"],
      links: [{ label: "behance.net/gitasv", href: "https://behance.net" }],
      tone: 5,
      drop: 6,
   },
   {
      id: "pplg1-09",
      absen: 9,
      name: "Hanan Chaliq",
      role: "Hybrid Full-Stack Dev",
      team: "XII PPLG 1 · #09",
      division: "Frontend",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
      bio: "Membangun ekosistem web modern dengan Next.js, Laravel, dan presisi visual.",
      tags: ["Next.js", "Supabase", "Laravel"],
      links: [{ label: "naan.my.id", href: "https://naan.my.id" }],
      tone: 1,
      drop: 10,
   },
   {
      id: "pplg1-10",
      absen: 10,
      name: "Indah Permata",
      role: "Product Designer",
      team: "XII PPLG 1 · #10",
      division: "UI/UX & Creative",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80",
      bio: "Selalu memastikan flow aplikasi tugas akhir ramah pengguna dan estetik.",
      tags: ["UI/UX", "Prototyping", "Wireframe"],
      links: [{ label: "dribbble.com/indahp", href: "https://dribbble.com" }],
      tone: 2,
      drop: 19,
   },
   {
      id: "pplg1-11",
      absen: 11,
      name: "Jovan Mahendra",
      role: "Systems Programmer",
      team: "XII PPLG 1 · #11",
      division: "Backend",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
      bio: "Hobi ngoprek algoritma kompetitif dan optimasi memori.",
      tags: ["Rust", "C++", "Algorithms"],
      links: [{ label: "github.com/jovanmh", href: "https://github.com" }],
      tone: 4,
      drop: 3,
   },
   {
      id: "pplg1-12",
      absen: 12,
      name: "Kayla Putri",
      role: "Frontend Developer",
      team: "XII PPLG 1 · #12",
      division: "Frontend",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
      bio: "Menyulap desain Figma yang rumit jadi komponen React yang rapi.",
      tags: ["React", "Tailwind", "Next.js"],
      links: [{ label: "github.com/kaylaptr", href: "https://github.com" }],
      tone: 5,
      drop: 14,
   },
   {
      id: "pplg1-13",
      absen: 13,
      name: "Lutfi Hakim",
      role: "Game Designer",
      team: "XII PPLG 1 · #13",
      division: "Game & Mobile",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&auto=format&fit=crop&q=80",
      bio: "Merancang level design, mekanik boss fight, dan pixel art.",
      tags: ["Godot", "Aseprite", "GDScript"],
      links: [{ label: "itch.io/lutfihakim", href: "https://itch.io" }],
      tone: 3,
      drop: 21,
   },
   {
      id: "pplg1-14",
      absen: 14,
      name: "M. Rizky",
      role: "Backend Developer",
      team: "XII PPLG 1 · #14",
      division: "Backend",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
      bio: "Kalau database sudah ter-normalisasi 3NF, hati rasanya tenang.",
      tags: ["MySQL", "PHP", "Laravel"],
      links: [{ label: "github.com/mrizkydev", href: "https://github.com" }],
      tone: 2,
      drop: 7,
   },
   {
      id: "pplg1-15",
      absen: 15,
      name: "Nadia Shafira",
      role: "QA & Documentation",
      team: "XII PPLG 1 · #15",
      division: "UI/UX & Creative",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80",
      bio: "Penemu bug tersembunyi H-1 sebelum presentasi ujian praktik.",
      tags: ["Playwright", "Testing", "Notion"],
      links: [{ label: "github.com/nadiashf", href: "https://github.com" }],
      tone: 4,
      drop: 16,
   },
   {
      id: "pplg1-16",
      absen: 16,
      name: "Naufal Dzaki",
      role: "Mobile Engineer",
      team: "XII PPLG 1 · #16",
      division: "Game & Mobile",
      image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80",
      bio: "Eksplorasi aplikasi multi-platform dan integrasi sensor perangkat.",
      tags: ["React Native", "Kotlin", "Expo"],
      links: [{ label: "github.com/naufaldz", href: "https://github.com" }],
      tone: 1,
      drop: 5,
   },
   {
      id: "pplg1-17",
      absen: 17,
      name: "Putri Maharani",
      role: "Motion & 3D Artist",
      team: "XII PPLG 1 · #17",
      division: "UI/UX & Creative",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&auto=format&fit=crop&q=80",
      bio: "Bikin bumper video angkatan dan aset 3D low-poly untuk web kelas.",
      tags: ["Blockbench", "Remotion", "After Effects"],
      links: [{ label: "behance.net/putrimhr", href: "https://behance.net" }],
      tone: 3,
      drop: 12,
   },
   {
      id: "pplg1-18",
      absen: 18,
      name: "Raihan Akbar",
      role: "Full-Stack Developer",
      team: "XII PPLG 1 · #18",
      division: "Frontend",
      image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&auto=format&fit=crop&q=80",
      bio: "Kopi hitam, lo-fi beats, dan dua monitor penuh terminal.",
      tags: ["Next.js", "Prisma", "tRPC"],
      links: [{ label: "github.com/raihanakbar", href: "https://github.com" }],
      tone: 2,
      drop: 20,
   },
   {
      id: "pplg1-19",
      absen: 19,
      name: "Salma Aulia",
      role: "Frontend Engineer",
      team: "XII PPLG 1 · #19",
      division: "Frontend",
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=300&auto=format&fit=crop&q=80",
      bio: "Pecinta aksesibilitas web dan tipografi yang bersih.",
      tags: ["HTML/CSS", "Accessibility", "Vue"],
      links: [{ label: "github.com/salmaaulia", href: "https://github.com" }],
      tone: 5,
      drop: 8,
   },
   {
      id: "pplg1-20",
      absen: 20,
      name: "Tegar Satria",
      role: "Game Programmer",
      team: "XII PPLG 1 · #20",
      division: "Game & Mobile",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
      bio: "Ngoprek AI pathfinding dan physics engine buat proyek game sekolah.",
      tags: ["Unity", "Physics", "ShaderGraph"],
      links: [{ label: "github.com/tegarsatria", href: "https://github.com" }],
      tone: 4,
      drop: 15,
   },
   {
      id: "pplg1-21",
      absen: 21,
      name: "Vina Oktavia",
      role: "Data & Backend",
      team: "XII PPLG 1 · #21",
      division: "Backend",
      image: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=300&auto=format&fit=crop&q=80",
      bio: "Mengolah data statistik sekolah dan integrasi dashboard analitik.",
      tags: ["Python", "Supabase", "SQL"],
      links: [{ label: "github.com/vinaokt", href: "https://github.com" }],
      tone: 1,
      drop: 2,
   },
   {
      id: "pplg1-22",
      absen: 22,
      name: "Zaki Firmansyah",
      role: "Security & Network",
      team: "XII PPLG 1 · #22",
      division: "Backend",
      image: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=300&auto=format&fit=crop&q=80",
      bio: "Memastikan aplikasi kelas aman dari SQL injection dan XSS.",
      tags: ["CyberSecurity", "Linux", "Networking"],
      links: [{ label: "github.com/zakifrm", href: "https://github.com" }],
      tone: 3,
      drop: 17,
   },
];

export const INITIAL_FAREWELL_DATA: FarewellBoxPayload = {
   headline: "Kapsul Waktu & Memori Kelulusan XII PPLG 1",
   subheadline: "22 Baris Logika, Ribuan Komit Kenangan — Angkatan 2026",
   graduation_year: "2026",
   main_message: "Terima kasih untuk tiga tahun penuh tawa, error merah di terminal menjelang deadline, lembur PKL bareng, sampai akhirnya semua kode yang kita tulis membawa kita ke garis kelulusan ini. Ke mana pun langkah kalian setelah ini—kuliah, kerja, atau membangun karya sendiri—jangan pernah lupakan kalau kita pernah berjuang di satu ruang lab yang sama sebagai keluarga besar XII PPLG 1.",
   audio_title: "Memori Lab PPLG 1 — Lo-Fi Farewell Mix",
   photos: [
      {
         id: "mem-1",
         title: "Sidang Akhir & Pameran Karya PPLG 1",
         description: "Hari ketika 22 aplikasi dan game kita dipamerkan bersama.",
         image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
         taken_date: "2026-04-18",
         category: "farewell_photo",
      },
      {
         id: "mem-2",
         title: "Lembur Proyek di Lab Komputer",
         description: "Momen debugging berjamaah ditemani kopi dan musik lo-fi.",
         image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
         taken_date: "2026-02-11",
         category: "farewell_photo",
      },
      {
         id: "mem-3",
         title: "Juara Umum Class Meeting",
         description: "Bukti anak coding juga jago di lapangan dan kompetisi desain.",
         image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
         taken_date: "2026-03-25",
         category: "farewell_photo",
      },
      {
         id: "mem-4",
         title: "Foto Bersama Sebelum Pelepasan",
         description: "22 anggota lengkap dengan seragam kebanggaan.",
         image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80",
         taken_date: "2026-05-02",
         category: "farewell_photo",
      },
   ],
   quotes: [
      {
         id: "q-1",
         author_name: "Hanan Chaliq",
         role: "Absen #09",
         quote: "Kita masuk belajar sintaks dasar, kita lulus membawa karya dan persaudaraan seumur hidup.",
         tone: 1,
      },
      {
         id: "q-2",
         author_name: "Alya Nabila",
         role: "Absen #02",
         quote: "Bakal kangen suasana lab sore-sore waktu semua panik ngejar revisi UI/UX.",
         tone: 5,
      },
      {
         id: "q-3",
         author_name: "Fajar Nugraha",
         role: "Absen #07",
         quote: "Status deployment XII PPLG 1: Ready for Production di dunia nyata. Sukses terus bre!",
         tone: 3,
      },
   ],
};
