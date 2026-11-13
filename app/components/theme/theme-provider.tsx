"use client";

import * as React from "react";

export type ClassTheme = "dark" | "light";

interface ThemeContextValue {
   theme: ClassTheme;
   mounted: boolean;
   setTheme: (theme: ClassTheme) => void;
   toggleTheme: () => void;
}

const STORAGE_KEY = "pplg1-theme-preference";

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function applyThemeToDOM(nextTheme: ClassTheme) {
   if (typeof document === "undefined") return;
   const root = document.documentElement;
   if (nextTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
   } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
   }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
   const [theme, setThemeState] = React.useState<ClassTheme>("dark");
   const [mounted, setMounted] = React.useState(false);

   React.useEffect(() => {
      try {
         const saved = window.localStorage.getItem(STORAGE_KEY) as ClassTheme | null;
         const resolved: ClassTheme = saved === "light" || saved === "dark" ? saved : "dark";
         setThemeState(resolved);
         applyThemeToDOM(resolved);
      } catch {
         applyThemeToDOM("dark");
      }
      setMounted(true);
   }, []);

   const setTheme = React.useCallback((nextTheme: ClassTheme) => {
      setThemeState(nextTheme);
      applyThemeToDOM(nextTheme);
      try {
         window.localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch {
         // Abaikan jika storage diblokir pada mode privat
      }
   }, []);

   const toggleTheme = React.useCallback(() => {
      setThemeState((prev) => {
         const next: ClassTheme = prev === "dark" ? "light" : "dark";
         applyThemeToDOM(next);
         try {
            window.localStorage.setItem(STORAGE_KEY, next);
         } catch {
            // Abaikan jika storage diblokir
         }
         return next;
      });
   }, []);

   const value = React.useMemo(
      () => ({
         theme,
         mounted,
         setTheme,
         toggleTheme,
      }),
      [theme, mounted, setTheme, toggleTheme]
   );

   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
   const context = React.useContext(ThemeContext);
   if (!context) {
      throw new Error("useTheme harus digunakan di dalam ThemeProvider");
   }
   return context;
}
