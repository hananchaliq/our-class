import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
   subsets: ["latin"],
   weight: ["400", "500", "600", "700"],
   variable: "--font-jakarta",
});

const jetbrainsMono = JetBrains_Mono({
   subsets: ["latin"],
   weight: ["400", "500", "600", "700"],
   variable: "--font-jetbrains",
});

export const metadata: Metadata = {
   title: "XII PPLG 1 — Class of 2026",
   description: "Arsip digital, direktori 22 developer, dan kapsul memori kelulusan XII PPLG 1.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
   return (
      <html
         lang="id"
         className={`${plusJakarta.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
         style={
            {
               "--font-sans": plusJakarta.style.fontFamily,
               "--font-mono": jetbrainsMono.style.fontFamily,
            } as React.CSSProperties
         }>
         <body className={`${plusJakarta.className} obsidian-ambient-canvas min-h-full flex flex-col text-foreground selection:bg-sky-400/25 selection:text-sky-200`}>{children}</body>
      </html>
   );
}
