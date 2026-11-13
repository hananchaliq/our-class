"use client";

import * as React from "react";
import {
   CheckCircle2,
   Cloud,
   Database,
   Eye,
   EyeOff,
   KeyRound,
   Lock,
   LogOut,
   Mail,
   ShieldCheck,
   Sparkles,
   X,
} from "lucide-react";
import {
   DEFAULT_SHARED_CLASS_EMAIL,
   DEFAULT_SHARED_CLASS_PASS,
   useClassAuth,
} from "./class-auth-provider";

interface AdminAccessButtonProps {
   variant?: "rail" | "mobile" | "topbar";
   className?: string;
}

export function AdminAccessButton({
   variant = "rail",
   className = "",
}: AdminAccessButtonProps) {
   const { isAdmin, openLoginModal } = useClassAuth();

   if (variant === "mobile") {
      return (
         <button
            type="button"
            onClick={openLoginModal}
            aria-label={isAdmin ? "Status Admin Aktif" : "Buka Login Admin Kelas"}
            className={`obsidian-pill inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
               isAdmin
                  ? "border-emerald-400/45 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "border-sky-400/35 bg-sky-500/10 text-foreground hover:border-sky-400/55"
            } ${className}`}>
            {isAdmin ? (
               <>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300 shrink-0" />
                  <span>Admin Active</span>
               </>
            ) : (
               <>
                  <KeyRound className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300 shrink-0" />
                  <span>Admin Login</span>
               </>
            )}
         </button>
      );
   }

   if (variant === "topbar") {
      return (
         <button
            type="button"
            onClick={openLoginModal}
            className={`obsidian-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
               isAdmin
                  ? "border-emerald-400/45 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                  : "border-indigo-400/35 bg-indigo-500/10 text-foreground hover:border-indigo-400/60"
            } ${className}`}>
            {isAdmin ? (
               <>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300 shrink-0" />
                  <span>Admin Active</span>
               </>
            ) : (
               <>
                  <KeyRound className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-300 shrink-0" />
                  <span>Admin Login</span>
               </>
            )}
         </button>
      );
   }

   // Default: "rail" (Sudut bawah Desktop Left Navigation Rail)
   return (
      <button
         type="button"
         onClick={openLoginModal}
         className={`obsidian-pill group relative flex w-full items-center justify-between gap-2.5 rounded-xl p-2.5 text-left transition-all duration-200 ${
            isAdmin
               ? "border-emerald-400/45 bg-emerald-500/15 hover:bg-emerald-500/20"
               : "border-indigo-400/35 bg-indigo-500/10 hover:border-sky-400/50 hover:bg-sky-500/15"
         } ${className}`}>
         <div className="flex items-center gap-2.5 min-w-0">
            <span
               className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                  isAdmin
                     ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                     : "border-indigo-400/35 bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 group-hover:text-sky-500 dark:group-hover:text-sky-300"
               }`}>
               {isAdmin ? (
                  <ShieldCheck className="h-4 w-4" />
               ) : (
                  <KeyRound className="h-4 w-4" />
               )}
            </span>
            <div className="flex flex-col min-w-0">
               <span className="truncate text-xs font-semibold text-foreground">
                  {isAdmin ? "Admin Active" : "Admin Login"}
               </span>
               <span className="truncate text-[10px] text-muted-foreground">
                  {isAdmin ? "Mode CRUD Kelas Aktif" : "1 Akun Kelas Bersama"}
               </span>
            </div>
         </div>

         <span
            className={`mono-tabular shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
               isAdmin
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-200"
                  : "bg-indigo-500/20 text-indigo-700 dark:text-indigo-200"
            }`}>
            {isAdmin ? "ON" : "AUTH"}
         </span>
      </button>
   );
}

export function AdminLoginModal() {
   const {
      isAdmin,
      isSupabaseConnected,
      session,
      isModalOpen,
      isLoading,
      closeLoginModal,
      loginSharedAccount,
      logoutAdmin,
   } = useClassAuth();

   const [email, setEmail] = React.useState(DEFAULT_SHARED_CLASS_EMAIL);
   const [password, setPassword] = React.useState("");
   const [showPassword, setShowPassword] = React.useState(false);
   const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

   React.useEffect(() => {
      if (!isModalOpen) {
         setErrorMsg(null);
      }
   }, [isModalOpen]);

   React.useEffect(() => {
      if (!isModalOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            closeLoginModal();
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isModalOpen, closeLoginModal]);

   if (!isModalOpen) return null;

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      const res = await loginSharedAccount(email, password);
      if (!res.ok && res.error) {
         setErrorMsg(res.error);
      } else {
         setPassword("");
      }
   };

   const handleFillDemo = () => {
      setEmail(DEFAULT_SHARED_CLASS_EMAIL);
      setPassword(DEFAULT_SHARED_CLASS_PASS);
      setErrorMsg(null);
   };

   return (
      <div
         role="dialog"
         aria-modal="true"
         aria-labelledby="class-auth-modal-title"
         className="fixed inset-0 z-50 flex items-center justify-center p-4">
         {/* Backdrop */}
         <div
            onClick={closeLoginModal}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
         />

         {/* Modal Container (Flat Surface Glassmorphism — Tanpa 3D Tilt) */}
         <div className="obsidian-surface relative z-10 w-full max-w-md overflow-hidden p-6 sm:p-7">
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-4">
               <div className="flex items-center gap-3">
                  <span
                     className={`obsidian-pill flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isAdmin
                           ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-500 dark:text-emerald-300"
                           : "border-sky-400/40 bg-sky-500/15 text-sky-500 dark:text-sky-300 glow-cyan"
                     }`}>
                     {isAdmin ? (
                        <ShieldCheck className="h-5 w-5" />
                     ) : (
                        <Lock className="h-5 w-5" />
                     )}
                  </span>
                  <div>
                     <span className="mono-tabular text-[11px] font-semibold tracking-wider text-sky-600 dark:text-sky-300">
                        XII PPLG 1 · SUPABASE & SHARED AUTH
                     </span>
                     <h2
                        id="class-auth-modal-title"
                        className="text-lg font-bold tracking-tight text-foreground">
                        {isAdmin
                           ? "Status Akses Admin Kelas"
                           : "Login Akun Kelas Bersama"}
                     </h2>
                  </div>
               </div>

               <button
                  type="button"
                  onClick={closeLoginModal}
                  aria-label="Tutup modal"
                  className="obsidian-pill inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
               </button>
            </div>

            {/* Indikator Koneksi Database Supabase vs Local Mode */}
            <div className="obsidian-pill mt-4 flex items-center justify-between gap-2 rounded-xl px-3.5 py-2 text-[11px]">
               <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                  {isSupabaseConnected ? (
                     <Cloud className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                     <Database className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  <span>Status Backend:</span>
               </span>
               <span
                  className={`mono-tabular font-bold ${
                     isSupabaseConnected
                        ? "text-emerald-600 dark:text-emerald-300"
                        : "text-amber-600 dark:text-amber-300"
                  }`}>
                  {isSupabaseConnected
                     ? "SUPABASE CLOUD AKTIF"
                     : "MODE LOKAL (SIAP VERCEL ENV)"}
               </span>
            </div>

            {isAdmin && session ? (
               /* State Ketika Sudah Login (Admin Active) */
               <div className="mt-4 flex flex-col gap-4">
                  <div className="obsidian-pill flex flex-col gap-2 rounded-xl border-emerald-400/35 bg-emerald-500/10 p-4">
                     <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                           <CheckCircle2 className="h-4 w-4" />
                           <span>Admin Active (Akses CRUD Penuh)</span>
                        </span>
                        <span className="mono-tabular text-[11px] text-muted-foreground">
                           {session.mode === "supabase" ? "SUPABASE" : "SHARED"}
                        </span>
                     </div>
                     <p className="text-xs leading-relaxed text-muted-foreground">
                        Seluruh fitur CRUD (Edit 22 ID Card Siswa, Surat & Foto Kado 3D, Jadwal Mapel/Piket, serta Galeri Project PPLG) kini terbuka untuk sesi ini.
                     </p>
                     <div className="mt-1 flex items-center justify-between border-t border-[var(--color-border)] pt-2 text-[11px]">
                        <span className="text-muted-foreground">Akun Aktif:</span>
                        <span className="mono-tabular font-semibold text-foreground">
                           {session.email}
                        </span>
                     </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-1">
                     <button
                        type="button"
                        onClick={closeLoginModal}
                        className="obsidian-pill rounded-xl px-4 py-2 text-xs font-semibold text-foreground hover:border-sky-400/40">
                        Lanjut Kelola Kelas
                     </button>
                     <button
                        type="button"
                        onClick={logoutAdmin}
                        disabled={isLoading}
                        className="obsidian-pill inline-flex items-center gap-1.5 rounded-xl border-rose-400/40 bg-rose-500/15 px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-200 hover:bg-rose-500/25">
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Keluar Sesi Admin</span>
                     </button>
                  </div>
               </div>
            ) : (
               /* Form Login 1 Akun Kelas Bersama */
               <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                     Pengunjung publik bebas menjelajahi 22 ID Card 3D dan membuka Kado Perpisahan tanpa login. Masuk dengan <strong>1 akun bersama XII PPLG 1</strong> (atau akun Supabase Auth Anda) untuk membuka fitur CRUD.
                  </p>

                  {errorMsg && (
                     <div
                        role="alert"
                        className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-300">
                        {errorMsg}
                     </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                     <label
                        htmlFor="shared-admin-email"
                        className="text-xs font-medium text-foreground">
                        Email Akun Kelas / Supabase Auth
                     </label>
                     <div className="relative flex items-center">
                        <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                           id="shared-admin-email"
                           type="email"
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="admin@xiipplg1.sch.id"
                           className="obsidian-pill w-full rounded-xl py-2.5 pr-3.5 pl-10 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-sky-400 focus:outline-none"
                        />
                     </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                     <div className="flex items-center justify-between">
                        <label
                           htmlFor="shared-admin-password"
                           className="text-xs font-medium text-foreground">
                           Password Bersama
                        </label>
                        <button
                           type="button"
                           onClick={handleFillDemo}
                           className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-300 hover:underline">
                           <Sparkles className="h-3 w-3" />
                           <span>Isi Otomatis Akun Kelas</span>
                        </button>
                     </div>
                     <div className="relative flex items-center">
                        <KeyRound className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                           id="shared-admin-password"
                           type={showPassword ? "text" : "password"}
                           required
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="Masukkan password kelas..."
                           className="obsidian-pill w-full rounded-xl py-2.5 pr-10 pl-10 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-sky-400 focus:outline-none"
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword((prev) => !prev)}
                           aria-label={
                              showPassword
                                 ? "Sembunyikan password"
                                 : "Tampilkan password"
                           }
                           className="absolute right-3 text-muted-foreground hover:text-foreground">
                           {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                           ) : (
                              <Eye className="h-4 w-4" />
                           )}
                        </button>
                     </div>
                  </div>

                  {/* Informasi Kredensial Bersama */}
                  <div className="obsidian-pill flex items-center justify-between rounded-xl px-3.5 py-2 text-[11px] text-muted-foreground">
                     <span>Akun Bersama Default:</span>
                     <span className="mono-tabular font-semibold text-foreground">
                        {DEFAULT_SHARED_CLASS_EMAIL} / {DEFAULT_SHARED_CLASS_PASS}
                     </span>
                  </div>

                  <div className="mt-1 flex items-center justify-end gap-2.5">
                     <button
                        type="button"
                        onClick={closeLoginModal}
                        className="obsidian-pill rounded-xl px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
                        Batal
                     </button>
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="obsidian-pill inline-flex items-center gap-2 rounded-xl border-sky-400/45 bg-sky-500/20 px-5 py-2.5 text-xs font-semibold text-sky-700 dark:text-sky-200 hover:bg-sky-500/30 glow-cyan disabled:opacity-50">
                        <ShieldCheck className="h-4 w-4" />
                        <span>
                           {isLoading
                              ? "Memverifikasi..."
                              : "Masuk sebagai Admin Kelas"}
                        </span>
                     </button>
                  </div>
               </form>
            )}
         </div>
      </div>
   );
}
