-- ============================================================================
-- XII PPLG 1 — CLASS OF 2026 DIGITAL ARCHIVE & 3D GRADUATION CAPSULE
-- SUPABASE POSTGRESQL SCHEMA, INITIAL SEED, RLS POLICIES & STORAGE BUCKET
-- Cara Pakai: Salin seluruh isi file ini ke Supabase Dashboard -> SQL Editor -> Run
-- ============================================================================

-- 1. TABEL DATA 22 SISWA (ID CARD 3D LANYARD RAIL)
CREATE TABLE IF NOT EXISTS public.students (
   id TEXT PRIMARY KEY,
   absen INTEGER NOT NULL UNIQUE CHECK (absen >= 1 AND absen <= 99),
   name TEXT NOT NULL,
   role TEXT NOT NULL,
   team TEXT NOT NULL DEFAULT 'XII PPLG 1',
   division TEXT NOT NULL CHECK (division IN ('Frontend', 'Backend', 'UI/UX & Creative', 'Game & Mobile')),
   image TEXT NOT NULL,
   bio TEXT DEFAULT '',
   tags JSONB NOT NULL DEFAULT '[]'::jsonb,
   links JSONB NOT NULL DEFAULT '[]'::jsonb,
   tone INTEGER NOT NULL DEFAULT 1 CHECK (tone >= 1 AND tone <= 5),
   drop INTEGER NOT NULL DEFAULT 8,
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABEL KAPSUL UTAMA KADO 3D PERPISAHAN (FAREWELL BOX)
CREATE TABLE IF NOT EXISTS public.farewell_box (
   id TEXT PRIMARY KEY DEFAULT 'capsule-2026',
   headline TEXT NOT NULL,
   subheadline TEXT NOT NULL,
   main_message TEXT NOT NULL,
   graduation_year TEXT NOT NULL DEFAULT '2026',
   audio_title TEXT DEFAULT 'Memori Lab PPLG 1 — Lo-Fi Farewell Mix',
   audio_url TEXT DEFAULT '',
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL QUOTES & PESAN TEMAN SEKELAS (FAREWELL QUOTES)
CREATE TABLE IF NOT EXISTS public.farewell_quotes (
   id TEXT PRIMARY KEY,
   author_name TEXT NOT NULL,
   role TEXT DEFAULT 'Anggota XII PPLG 1',
   quote TEXT NOT NULL,
   tone INTEGER NOT NULL DEFAULT 1 CHECK (tone >= 1 AND tone <= 5),
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABEL MEMORIES (FOTO KADO 3D, GALERI MOMEN KELAS & ETALASE PROJECT PPLG)
CREATE TABLE IF NOT EXISTS public.memories (
   id TEXT PRIMARY KEY,
   code TEXT NOT NULL DEFAULT 'MEM-01',
   title TEXT NOT NULL,
   description TEXT NOT NULL DEFAULT '',
   image_url TEXT NOT NULL,
   taken_date TEXT NOT NULL DEFAULT '2026',
   location TEXT NOT NULL DEFAULT 'Lab RPL Utama',
   category TEXT NOT NULL CHECK (category IN ('farewell_photo', 'class_gallery', 'pplg_project')),
   division TEXT DEFAULT 'Frontend',
   author_name TEXT DEFAULT 'XII PPLG 1',
   author_absen INTEGER DEFAULT 1,
   author_student_id TEXT DEFAULT 'pplg1-01',
   tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
   repo_url TEXT DEFAULT 'https://github.com',
   demo_url TEXT DEFAULT '',
   tag TEXT DEFAULT 'Angkatan 2026',
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABEL JADWAL MAPEL & REGU PIKET HARIAN (SENIN - SABTU)
CREATE TABLE IF NOT EXISTS public.schedules (
   id TEXT PRIMARY KEY,
   day_name TEXT NOT NULL UNIQUE CHECK (day_name IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')),
   day_code TEXT NOT NULL,
   focus_theme TEXT NOT NULL,
   room_summary TEXT NOT NULL,
   lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
   piket_group_code TEXT NOT NULL,
   piket_coordinator TEXT NOT NULL,
   piket_target_area TEXT NOT NULL DEFAULT 'Lab RPL & Kelas XII PPLG 1',
   piket_members JSONB NOT NULL DEFAULT '[]'::jsonb,
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABEL TRACKER TUGAS & DEADLINE KELAS
CREATE TABLE IF NOT EXISTS public.class_tasks (
   id TEXT PRIMARY KEY,
   code TEXT NOT NULL,
   title TEXT NOT NULL,
   subject TEXT NOT NULL,
   division TEXT NOT NULL CHECK (division IN ('Semua Divisi', 'Frontend', 'Backend', 'UI/UX & Creative', 'Game & Mobile')),
   deadline TEXT NOT NULL,
   status TEXT NOT NULL CHECK (status IN ('in_progress', 'urgent', 'completed')),
   progress_pct INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS) & POLICIES (BACA PUBLIK + TULIS ADMIN)
-- ============================================================================

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farewell_box ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farewell_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_tasks ENABLE ROW LEVEL SECURITY;

-- Kebijakan Baca Publik (Semua pengunjung dapat melihat data kelas)
DROP POLICY IF EXISTS "Public Read Students" ON public.students;
CREATE POLICY "Public Read Students" ON public.students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Farewell Box" ON public.farewell_box;
CREATE POLICY "Public Read Farewell Box" ON public.farewell_box FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Farewell Quotes" ON public.farewell_quotes;
CREATE POLICY "Public Read Farewell Quotes" ON public.farewell_quotes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Memories" ON public.memories;
CREATE POLICY "Public Read Memories" ON public.memories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Schedules" ON public.schedules;
CREATE POLICY "Public Read Schedules" ON public.schedules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Class Tasks" ON public.class_tasks;
CREATE POLICY "Public Read Class Tasks" ON public.class_tasks FOR SELECT USING (true);

-- Kebijakan Tulis (Mendukung Supabase Auth maupun Shared Class Admin Session)
DROP POLICY IF EXISTS "Class Admin Write Students" ON public.students;
CREATE POLICY "Class Admin Write Students" ON public.students
   FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Class Admin Write Farewell Box" ON public.farewell_box;
CREATE POLICY "Class Admin Write Farewell Box" ON public.farewell_box
   FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Class Admin Write Farewell Quotes" ON public.farewell_quotes;
CREATE POLICY "Class Admin Write Farewell Quotes" ON public.farewell_quotes
   FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Class Admin Write Memories" ON public.memories;
CREATE POLICY "Class Admin Write Memories" ON public.memories
   FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Class Admin Write Schedules" ON public.schedules;
CREATE POLICY "Class Admin Write Schedules" ON public.schedules
   FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Class Admin Write Class Tasks" ON public.class_tasks;
CREATE POLICY "Class Admin Write Class Tasks" ON public.class_tasks
   FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- SUPABASE STORAGE BUCKET: class-assets (FOTO SISWA, GALERI & THUMBNAIL KARYA)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('class-assets', 'class-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public View Class Assets" ON storage.objects;
CREATE POLICY "Public View Class Assets" ON storage.objects
   FOR SELECT USING (bucket_id = 'class-assets');

DROP POLICY IF EXISTS "Class Admin Upload Class Assets" ON storage.objects;
CREATE POLICY "Class Admin Upload Class Assets" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'class-assets');

DROP POLICY IF EXISTS "Class Admin Update Class Assets" ON storage.objects;
CREATE POLICY "Class Admin Update Class Assets" ON storage.objects
   FOR UPDATE USING (bucket_id = 'class-assets');

DROP POLICY IF EXISTS "Class Admin Delete Class Assets" ON storage.objects;
CREATE POLICY "Class Admin Delete Class Assets" ON storage.objects
   FOR DELETE USING (bucket_id = 'class-assets');

-- ============================================================================
-- INITIAL SEED DATA: KAPSUL UTAMA KADO 3D PERPISAHAN
-- ============================================================================

INSERT INTO public.farewell_box (id, headline, subheadline, main_message, graduation_year, audio_title)
VALUES (
   'capsule-2026',
   'Kapsul Waktu & Memori Kelulusan XII PPLG 1',
   '22 Baris Logika, Ribuan Komit Kenangan — Angkatan 2026',
   'Terima kasih untuk tiga tahun penuh tawa, error merah di terminal menjelang deadline, lembur PKL bareng, sampai akhirnya semua kode yang kita tulis membawa kita ke garis kelulusan ini. Ke mana pun langkah kalian setelah ini—kuliah, kerja, atau membangun karya sendiri—jangan pernah lupakan kalau kita pernah berjuang di satu ruang lab yang sama sebagai keluarga besar XII PPLG 1.',
   '2026',
   'Memori Lab PPLG 1 — Lo-Fi Farewell Mix'
)
ON CONFLICT (id) DO NOTHING;
