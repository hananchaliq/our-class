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
   description:
      "Arsip digital, direktori interaktif 22 developer, bento dashboard kelas, dan kapsul memori kelulusan 3D XII PPLG 1.",
   openGraph: {
      title: "XII PPLG 1 — Class of 2026",
      description:
         "Arsip digital, direktori interaktif 22 developer, bento dashboard kelas, dan kapsul memori kelulusan 3D XII PPLG 1.",
      type: "website",
   },
   twitter: {
      card: "summary_large_image",
      title: "XII PPLG 1 — Class of 2026",
      description:
         "Arsip digital, direktori interaktif 22 developer, bento dashboard kelas, dan kapsul memori kelulusan 3D XII PPLG 1.",
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html
         lang="id"
         suppressHydrationWarning
         className={`${plusJakarta.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
         style={
            {
               "--font-sans": plusJakarta.style.fontFamily,
               "--font-mono": jetbrainsMono.style.fontFamily,
            } as React.CSSProperties
         }>
         <body
            suppressHydrationWarning
            className={`${plusJakarta.className} obsidian-ambient-canvas relative min-h-full flex flex-col text-foreground selection:bg-sky-500/25 selection:text-sky-600 dark:selection:bg-sky-400/25 dark:selection:text-sky-200`}>
            {/* Subtle Swiss-Grid & Film Grain Backdrop Layer (Non-Interactive) */}
            <div
               aria-hidden="true"
               className="swiss-grid-overlay pointer-events-none fixed inset-0 z-0"
            />
            <div
               aria-hidden="true"
               className="film-grain-overlay pointer-events-none fixed inset-0 z-0"
            />

            {/* Main Application Content */}
            <div className="relative z-10 flex min-h-screen flex-1 flex-col">
               {children}
            </div>
         </body>
      </html>
   );
}
