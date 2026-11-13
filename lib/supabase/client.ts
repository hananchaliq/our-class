import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const rawSupabaseAnonKey =
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

/**
 * Mengecek apakah kredensial Supabase sudah dikonfigurasi dengan URL valid
 * (bukan string kosong dan bukan placeholder).
 */
export function isSupabaseConfigured(): boolean {
   if (!rawSupabaseUrl || !rawSupabaseAnonKey) return false;
   if (
      rawSupabaseUrl.includes("YOUR_PROJECT_ID") ||
      rawSupabaseUrl === "MY_SUPABASE_URL" ||
      rawSupabaseAnonKey === "MY_SUPABASE_ANON_KEY"
   ) {
      return false;
   }
   return rawSupabaseUrl.startsWith("https://");
}

let browserClient: SupabaseClient | null = null;

/**
 * Mengembalikan instance singleton Supabase Client di browser jika sudah dikonfigurasi,
 * atau `null` jika environment variable belum diisi (sehingga aplikasi otomatis
 * menggunakan fallback lokal tanpa crash).
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
   if (!isSupabaseConfigured()) return null;
   if (!browserClient) {
      browserClient = createClient(rawSupabaseUrl, rawSupabaseAnonKey, {
         auth: {
            persistSession: true,
            autoRefreshToken: true,
         },
      });
   }
   return browserClient;
}

export type ClassAssetFolder =
   | "avatars"
   | "gallery"
   | "projects"
   | "farewell";

/**
 * Mengunggah file gambar ke Supabase Storage bucket `class-assets`.
 * Apabila Supabase belum dikonfigurasi di `.env.local` / Vercel, otomatis
 * mengonversi file menjadi Data URL lokal agar fitur upload tetap berjalan mulus.
 */
export async function uploadClassAsset(
   file: File,
   folder: ClassAssetFolder = "gallery"
): Promise<{ publicUrl: string | null; error: string | null }> {
   const supabase = getSupabaseBrowserClient();

   // Fallback Data URL apabila Supabase belum dikonfigurasi
   if (!supabase) {
      return new Promise((resolve) => {
         const reader = new FileReader();
         reader.onload = () => {
            resolve({
               publicUrl:
                  typeof reader.result === "string" ? reader.result : null,
               error: null,
            });
         };
         reader.onerror = () => {
            resolve({
               publicUrl: null,
               error: "Gagal membaca file gambar lokal.",
            });
         };
         reader.readAsDataURL(file);
      });
   }

   const cleanName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, "-")
      .replace(/-+/g, "-");
   const filePath = `${folder}/${Date.now()}-${cleanName}`;

   const { error: uploadError } = await supabase.storage
      .from("class-assets")
      .upload(filePath, file, {
         cacheControl: "3600",
         upsert: false,
      });

   if (uploadError) {
      return {
         publicUrl: null,
         error: uploadError.message,
      };
   }

   const { data } = supabase.storage
      .from("class-assets")
      .getPublicUrl(filePath);

   return {
      publicUrl: data.publicUrl,
      error: null,
   };
}
