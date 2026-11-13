# XII PPLG 1 — Class of 2026 Digital Archive & 3D Memory Capsule

Transformasi penuh repositori **`hananchaliq/our-class`** menjadi platform arsip digital, direktori interaktif 22 developer, bento-dashboard kelas, dan kapsul memori kelulusan 3D dengan arsitektur **Dual-Theme (Obsidian Dark & Daylight Glass)**, navigasi Left Rail ala dashboard modern (terinspirasi referensi visual yang dilampirkan), aturan **2-Column Mobile Card Grid**, serta persistensi **Supabase Auth & Database/Storage**.

### User Review & Critical Decisions

> [!IMPORTANT]
> **Konfirmasi Pembacaan Repositori & Protokol Eksekusi Bertahap (1 Fase per Respons):**
> Seluruh struktur dan isi repositori `hananchaliq/our-class` (`app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/types/class-system.ts`, serta 5 komponen di `app/components/3d/`) telah dibaca dan dianalisis 100%. Klik tombol **Proceed** di bawah rencana ini agar mode perencanaan selesai dan saya langsung mengeksekusi **FASE 1 SAJA** lengkap dengan kode utuh siap-push dan saran `git commit`.

- **Protokol Eksekusi Ketat (Hard Stop per Fase)**: Setiap giliran hanya mengeksekusi **1 Fase** dari total 20 Fase dengan output kode lengkap siap salin ke VS Code dan pesan `git commit`, lalu berhenti total menunggu instruksi Anda.
- **Zero Destructive 3D Preservation**: Seluruh logika fisika pegas, matriks rotasi, dan tipe prop pada komponen 3D (`TeamLanyardRail`, `ClassLanyardShowcase`, `FarewellGiftBox3D`, `TechKeycap3D`, `GraduationCap3D`, `VinylDisc3D`, `MemoryPhotoCube3D`) dipertahankan 100% tanpa perubahan destruktif.
- **Dual-Theme CSS Token Compatibility**: Mode **Obsidian Dark** (`#07090E`) dan **Daylight Glass** (`#F4F7FB`) menggunakan `@custom-variant dark (&:where(.dark, .dark *));` pada Tailwind CSS v4 dengan tetap menjaga variabel `--color-card`, `--color-background`, dan `--color-chart-1..5` milik `TeamLanyardRail`.
- **Aturan Mobile-First 2-Column Card Grid**: Seluruh data terstruktur (Jadwal Mapel, Daftar Piket, Papan Tugas/Deadline) dilarang dirender sebagai `<table>` melebar di layar HP dan wajib menggunakan `grid-cols-2` yang ringkas dan bebas *horizontal overflow*.

---

### 1. Overview & Core Concept

- **What It Does**: Menyediakan rumah digital permanen bagi 22 siswa **XII PPLG 1 — Angkatan 2026** yang memadukan panggung objek 3D interaktif (22 ID Card Lanyard 3D dan Kado Perpisahan 3D) dengan Bento Dashboard kelas (telemetri waktu nyata WIB, countdown kelulusan, grafik aktivitas divisi, jadwal mapel & piket, papan tugas, etalase project PPLG, dan galeri foto) yang dapat dikelola melalui **1 Akun Admin Kelas Bersama**.
- **Target Audience / Persona**: Ke-22 siswa XII PPLG 1, wali kelas, guru produktif PPLG, serta pengunjung publik yang melihat portofolio karya dan kenangan angkatan 2026.
- **Key Value**: Mengubah halaman showcase statis menjadi aplikasi kelas full-stack yang responsif di layar HP maupun desktop, beridentitas Swiss-Grid & Bento Glassmorphism presisi, serta terhubung ke Supabase dengan fallback otomatis ke data lokal.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Eksplorasi Publik & Tema Dinamis**: Pengunjung membuka halaman dengan sambutan Bento Hero (Live Clock WIB, Countdown Kelulusan 2026, objek 3D `TechKeycap3D` & `GraduationCap3D`), dapat mengganti tema **Obsidian Dark / Daylight Glass**, atau menekan `Ctrl + K` untuk pencarian instan.
  2. **Interaksi 22 ID Card 3D (Section 2)**: Pengunjung menarik, mengayunkan, dan membalik ke-22 kartu lanyard siswa berdasarkan filter divisi (`Frontend`, `Backend`, `UI/UX & Creative`, `Game & Mobile`) atau nomor absen `01`–`22`.
  3. **Bento Jadwal, Piket, Tugas & Etalase Karya**: Pengunjung menelusuri jadwal mapel produktif/umum dan piket (`Senin`–`Sabtu`) serta tracker tugas kelas dalam format **Card Grid 2 Kolom** di HP, lalu menjelajahi tab `PPLG Projects` dan `Galeri Momen Kelas`.
  4. **Kapsul Memori & Kado Perpisahan 3D**: Pengunjung memutar `VinylDisc3D`, `MemoryPhotoCube3D`, dan membuka `FarewellGiftBox3D` untuk membaca surat perpisahan angkatan, album foto kenangan, dan quotes teman sekelas.
  5. **Mode Admin Kelas (1 Akun Bersama)**: Siswa menekan tombol `Admin Login` di sudut bawah Left Rail (desktop) atau header (mobile), masuk dengan 1 akun bersama, dan memperoleh kontrol CRUD penuh.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: **Swiss-Grid Technical Precision meets Atmospheric Bento Dashboard** (terinspirasi dari referensi visual Tracle: permukaan kaca datar berlapis halus, pencahayaan ambient radial indigo/cyan yang terukur, hierarki metrik tajam, dan navigasi rel vertikal di sisi kiri).
  - *Color Palette & Mood*:
    - **Obsidian Dark (Default — `.dark`)**: Canvas `#07090E`, Surface Card `rgba(15, 20, 32, 0.68)`, Solid Surface `#0C101A`, Hairline Border `rgba(255, 255, 255, 0.075)`, Foreground `#F8FAFC`, Muted Foreground `#94A3B8`.
    - **Daylight Glass (Light Mode — `:root`)**: Canvas `#F4F7FB`, Surface Card `rgba(255, 255, 255, 0.78)`, Solid Surface `#FFFFFF`, Hairline Border `rgba(15, 23, 42, 0.085)`, Foreground `#0F172A`, Muted Foreground `#64748B`.
    - **Preserved 3D & Telemetry Accents**: `--color-chart-1` (`#38BDF8` Neon Cyan), `--color-chart-2` (`#818CF8` Electric Indigo), `--color-chart-3` (`#FB923C` Warm Amber), `--color-chart-4` (`#34D399` Emerald Mint), `--color-chart-5` (`#F472B6` Rose Coral).
  - *Typography & Hierarchy*:
    - **Display & UI Prose**: `Plus Jakarta Sans` (`--font-sans`).
    - **Telemetry & Numerical Data**: `JetBrains Mono` (`--font-mono`) dengan `tabular-nums` wajib untuk nomor absen `01`–`22`, jam live WIB, countdown kelulusan, dan angka statistik.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Theme CSS Variable Architecture dengan `@custom-variant dark`**
  - *Chosen Approach*: Mendefinisikan token Daylight Glass pada `:root` dan Obsidian Dark pada `.dark` (dengan `<html class="dark">` sebagai default), disertai `@custom-variant dark (&:where(.dark, .dark *));` di `app/globals.css`.
  - *Why*: Menjaga kompatibilitas 100% dengan kalkulasi `color-mix(in oklab, ...)` pada `TeamLanyardRail` di mode gelap maupun terang.
- **Decision 2: Card Grid 2 Kolom (`grid-cols-2`) Pengganti Tabel di Layar Mobile**
  - *Chosen Approach*: Menyusun Jadwal Mapel, Daftar Piket, dan Papan Tugas menggunakan `grid-cols-2` di mobile tanpa elemen `<table>` melebar.
  - *Why*: Menjamin proporsi layar HP (`360px`–`430px`) bebas *horizontal overflow*.
- **Decision 3: Hybrid Supabase Persistence dengan Graceful Local Fallback**
  - *Chosen Approach*: Mendukung penuh Supabase Auth, Database, dan Storage `class-assets` sekaligus fallback otomatis ke `INITIAL_PPLG1_STUDENTS` dan `INITIAL_FAREWELL_DATA` bila `.env.local` belum diisi.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌────────────────────────────────────────────────────────────────────────────┐
│                   RootLayout (Plus Jakarta Sans + JetBrains Mono)          │
│       Dual-Theme Engine (:root Daylight Glass / .dark Obsidian Default)    │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
┌──────────────────────────────────────┐     ┌───────────────────────────────┐
│   Navigation & Global Providers      │     │   Supabase & Fallback Layer   │
│ ├─ ThemeProvider (Dark / Light)      │     │ ├─ Auth (1 Shared Admin Acct) │
│ ├─ SharedAdminAuthProvider           │◄───►│ ├─ PostgreSQL 6 Core Tables   │
│ ├─ DesktopLeftRail + MobileBottomDock│     │ ├─ Storage Bucket:class-assets│
│ └─ CommandPaletteModal (Ctrl + K)    │     │ └─ Fallback: INITIAL_PPLG1_*  │
└──────────────────┬───────────────────┘     └───────────────┬───────────────┘
                   │                                         │
                   ▼                                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    Main Bento & 3D Archive Viewport                        │
│  1. Bento Hero & Live Telemetry + TechKeycap3D & GraduationCap3D           │
│  2. ClassLanyardShowcase + TeamLanyardRail (22 Interactive 3D ID Cards)    │
│  3. Schedule, Piket & Tasks Bento (2-Column Mobile Card Grids)             │
│  4. PPLG Projects & Class Memory Gallery + Lightbox                        │
│  5. Farewell 3D Stage (VinylDisc3D + FarewellGiftBox3D + MemoryPhotoCube3D)│
└────────────────────────────────────────────────────────────────────────────┘
```

- **Urutan Eksekusi 20 Fase (1 Fase per Respons)**:
  - **Fase 1**: Dual-Theme Design System (`app/globals.css` & `app/layout.tsx`)
  - **Fase 2**: Theme Context & Interactive Theme Switcher
  - **Fase 3**: Navigasi Utama (Desktop Left Rail + Mobile Bottom Floating Dock)
  - **Fase 4**: Tombol Khusus `Admin Login` & Shared Class Auth Modal
  - **Fase 5**: Bento Hero & Live Class Telemetry
  - **Fase 6**: Interactive Class Activity & Progress Bento Widgets
  - **Fase 7**: Quick Command Palette & Instant Search (`Ctrl + K`)
  - **Fase 8**: Integrasi & Penyempurnaan Section 2 (`ClassLanyardShowcase`)
  - **Fase 9**: Arsip Jadwal Mapel & Piket Kenangan (2-Column Mobile Card Grid)
  - **Fase 10**: Papan Tugas, Deadline & Agenda Kelas
  - **Fase 11**: Etalase Project Karya PPLG 1 & Galeri Foto Kelas
  - **Fase 12**: Penyempurnaan Ruang Perpisahan 3D (`FarewellGiftBox3D` + Props)
  - **Fase 13**: Arsitektur Database & Storage Supabase (`supabase/schema.sql`)
  - **Fase 14**: Koneksi Supabase Auth pada Tombol `Admin Login`
  - **Fase 15**: Full CRUD Supabase: Manajemen Data 22 Siswa (ID Card 3D)
  - **Fase 16**: Full CRUD Supabase: Manajemen Isi Kado 3D Perpisahan
  - **Fase 17**: Full CRUD Supabase: Upload & Kelola Galeri Foto & Project PPLG
  - **Fase 18**: Full CRUD Supabase: Kelola Jadwal Mapel, Piket & Agenda Kelas
  - **Fase 19**: Audit Responsivitas Mobile & Penyempurnaan Komposisi Layar Kecil
  - **Fase 20**: Final Polish, Clean Build Check & Panduan Deploy Vercel
