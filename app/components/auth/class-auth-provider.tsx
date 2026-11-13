"use client";

import * as React from "react";

export interface ClassAdminSession {
   email: string;
   roleLabel: string;
   loggedInAt: string;
   mode: "local-shared" | "supabase";
}

interface ClassAuthContextValue {
   isAdmin: boolean;
   session: ClassAdminSession | null;
   isModalOpen: boolean;
   isLoading: boolean;
   openLoginModal: () => void;
   closeLoginModal: () => void;
   loginSharedAccount: (
      email: string,
      password: string
   ) => Promise<{ ok: boolean; error?: string }>;
   logoutAdmin: () => Promise<void>;
}

const AUTH_STORAGE_KEY = "pplg1-shared-admin-session";

// Kredensial default 1 Akun Kelas Bersama (Fallback sebelum Supabase Auth Fase 14 aktif)
export const DEFAULT_SHARED_CLASS_EMAIL = "admin@xiipplg1.sch.id";
export const DEFAULT_SHARED_CLASS_PASS = "pplg1-2026";

const ClassAuthContext = React.createContext<ClassAuthContextValue | undefined>(
   undefined
);

export function ClassAuthProvider({ children }: { children: React.ReactNode }) {
   const [session, setSession] = React.useState<ClassAdminSession | null>(null);
   const [isModalOpen, setIsModalOpen] = React.useState(false);
   const [isLoading, setIsLoading] = React.useState(false);

   React.useEffect(() => {
      try {
         const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
         if (raw) {
            const parsed = JSON.parse(raw) as ClassAdminSession;
            if (parsed && parsed.email) {
               setSession(parsed);
            }
         }
      } catch {
         // Abaikan bila localStorage tidak tersedia
      }
   }, []);

   const openLoginModal = React.useCallback(() => {
      setIsModalOpen(true);
   }, []);

   const closeLoginModal = React.useCallback(() => {
      setIsModalOpen(false);
   }, []);

   const loginSharedAccount = React.useCallback(
      async (
         email: string,
         password: string
      ): Promise<{ ok: boolean; error?: string }> => {
         setIsLoading(true);
         const cleanEmail = email.trim().toLowerCase();
         const cleanPass = password.trim();

         // Simulasi latensi verifikasi halus
         await new Promise((resolve) => setTimeout(resolve, 260));

         if (!cleanEmail || !cleanPass) {
            setIsLoading(false);
            return {
               ok: false,
               error: "Email dan password akun kelas bersama wajib diisi.",
            };
         }

         const isValidFallback =
            (cleanEmail === DEFAULT_SHARED_CLASS_EMAIL ||
               cleanEmail === "xiipplg1@gmail.com" ||
               cleanEmail === "ananxpplg1@gmail.com") &&
            (cleanPass === DEFAULT_SHARED_CLASS_PASS ||
               cleanPass === "xiipplg1" ||
               cleanPass === "2026");

         if (!isValidFallback) {
            setIsLoading(false);
            return {
               ok: false,
               error: "Kredensial tidak cocok. Gunakan akun bersama: admin@xiipplg1.sch.id / pplg1-2026",
            };
         }

         const nextSession: ClassAdminSession = {
            email: cleanEmail,
            roleLabel: "Shared Class Admin · XII PPLG 1",
            loggedInAt: new Date().toISOString(),
            mode: "local-shared",
         };

         setSession(nextSession);
         try {
            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
         } catch {
            // Abaikan bila storage penuh
         }

         setIsLoading(false);
         setIsModalOpen(false);
         return { ok: true };
      },
      []
   );

   const logoutAdmin = React.useCallback(async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 150));
      setSession(null);
      try {
         window.localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
         // Abaikan
      }
      setIsLoading(false);
      setIsModalOpen(false);
   }, []);

   const value = React.useMemo(
      () => ({
         isAdmin: Boolean(session),
         session,
         isModalOpen,
         isLoading,
         openLoginModal,
         closeLoginModal,
         loginSharedAccount,
         logoutAdmin,
      }),
      [
         session,
         isModalOpen,
         isLoading,
         openLoginModal,
         closeLoginModal,
         loginSharedAccount,
         logoutAdmin,
      ]
   );

   return (
      <ClassAuthContext.Provider value={value}>{children}</ClassAuthContext.Provider>
   );
}

export function useClassAuth(): ClassAuthContextValue {
   const context = React.useContext(ClassAuthContext);
   if (!context) {
      throw new Error("useClassAuth harus digunakan di dalam ClassAuthProvider");
   }
   return context;
}
