"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

interface ThemeSwitcherProps {
   variant?: "pill" | "icon";
   className?: string;
}

export function ThemeSwitcher({ variant = "pill", className = "" }: ThemeSwitcherProps) {
   const { theme, mounted, setTheme, toggleTheme } = useTheme();
   const isDark = !mounted || theme === "dark";

   if (variant === "icon") {
      return (
         <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Beralih ke mode Daylight Glass" : "Beralih ke mode Obsidian Dark"}
            title={isDark ? "Mode: Obsidian Dark (Klik untuk Daylight Glass)" : "Mode: Daylight Glass (Klik untuk Obsidian Dark)"}
            className={`obsidian-pill group relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-all duration-200 hover:border-sky-400/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${className}`}>
            <Sun
               className={`h-4 w-4 text-amber-500 transition-all duration-200 ${
                  isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
               }`}
            />
            <Moon
               className={`absolute h-4 w-4 text-sky-400 transition-all duration-200 ${
                  isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
               }`}
            />
         </button>
      );
   }

   return (
      <div
         role="group"
         aria-label="Pengatur tema tampilan"
         className={`obsidian-pill inline-flex items-center gap-1 rounded-full p-1 ${className}`}>
         <button
            type="button"
            onClick={() => setTheme("dark")}
            aria-pressed={isDark}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
               isDark
                  ? "bg-sky-500/20 text-sky-600 dark:text-sky-200 border border-sky-400/35 glow-cyan"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}>
            <Moon className="h-3.5 w-3.5 shrink-0" />
            <span>Obsidian</span>
         </button>

         <button
            type="button"
            onClick={() => setTheme("light")}
            aria-pressed={!isDark}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
               !isDark
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-200 border border-amber-400/40 glow-amber"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}>
            <Sun className="h-3.5 w-3.5 shrink-0" />
            <span>Daylight</span>
         </button>
      </div>
   );
}
