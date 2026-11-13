"use client";

import * as React from "react";

/* ============================================================================
   1. TECH KEYCAP 3D (OBJEK MECHANICAL KEYCAP 3D INTERAKTIF)
   ============================================================================ */

export interface TechKeycap3DProps {
   label?: string;
   sublabel?: string;
   onPressTrigger?: () => void;
   className?: string;
}

export function TechKeycap3D({ label = "PPLG-1", sublabel = "CLASS · 22", onPressTrigger, className = "" }: TechKeycap3DProps) {
   const [rot, setRot] = React.useState({ x: -24, y: -28 });
   const [pressed, setPressed] = React.useState(false);
   const [pressCount, setPressCount] = React.useState(0);
   const drag = React.useRef({ down: false, sx: 0, sy: 0, bx: -24, by: -28, moved: false });

   const triggerKey = () => {
      setPressed(true);
      setPressCount(c => c + 1);
      onPressTrigger?.();
      window.setTimeout(() => setPressed(false), 180);
   };

   return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
         <div
            className="scene-3d relative flex h-56 w-56 cursor-grab items-center justify-center active:cursor-grabbing"
            onPointerDown={e => {
               drag.current = {
                  down: true,
                  sx: e.clientX,
                  sy: e.clientY,
                  bx: rot.x,
                  by: rot.y,
                  moved: false,
               };
               e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={e => {
               if (!drag.current.down) return;
               const dx = e.clientX - drag.current.sx;
               const dy = e.clientY - drag.current.sy;
               if (Math.hypot(dx, dy) > 5) drag.current.moved = true;
               setRot({
                  x: Math.max(-55, Math.min(25, drag.current.bx - dy * 0.5)),
                  y: drag.current.by + dx * 0.7,
               });
            }}
            onPointerUp={() => {
               if (!drag.current.down) return;
               const moved = drag.current.moved;
               drag.current.down = false;
               if (!moved) triggerKey();
            }}
            role="button"
            tabIndex={0}
            aria-label={`Mechanical Keycap 3D ${label}`}
            onKeyDown={e => {
               if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  triggerKey();
               }
            }}>
            <div
               className="object-3d relative h-28 w-28 transition-transform duration-100 ease-out"
               style={{
                  transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
               }}>
               {/* Switch Housing & Underglow LED Base (Diam di Bawah) */}
               <div
                  className="absolute inset-0 rounded-2xl border border-sky-400/50 bg-[#070B14]"
                  style={{
                     transform: "rotateX(90deg) translateZ(-36px)",
                     boxShadow: pressed ? "0 0 42px 8px rgba(251, 146, 60, 0.75)" : "0 0 28px 4px rgba(56, 189, 248, 0.5)",
                  }}
               />

               {/* Batang Mechanical Stem (Cyan Switch Stem) */}
               <div
                  className="object-3d absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 bg-sky-400/80"
                  style={{
                     transform: "translateZ(-16px)",
                  }}
               />

               {/* Badan Keycap 3D (Turun 10px saat ditekan) */}
               <div
                  className="object-3d absolute inset-0 transition-transform duration-100"
                  style={{
                     transform: `translateY(${pressed ? 11 : 0}px)`,
                  }}>
                  {/* Permukaan Atas Keycap (Dish Top) */}
                  <div
                     className="absolute inset-2 flex flex-col items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-[#161F33] via-[#0E1422] to-[#080B12] shadow-inner"
                     style={{
                        transform: "rotateX(90deg) translateZ(26px)",
                        boxShadow: "inset 0 2px 6px rgba(255,255,255,0.18), 0 0 15px rgba(56,189,248,0.25)",
                     }}>
                     <span className="font-mono text-lg font-bold tracking-wider text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">{label}</span>
                     <span className="mt-0.5 font-mono text-[9px] tracking-[0.2em] text-amber-300/90">{sublabel}</span>
                  </div>

                  {/* Sisi Depan Keycap */}
                  <div
                     className="absolute inset-x-2 top-8 flex h-12 items-end justify-center rounded-b-lg border-x border-b border-white/10 bg-gradient-to-b from-[#121A2B] to-[#090D16] pb-1.5"
                     style={{
                        transform: "translateZ(48px) rotateX(-12deg)",
                     }}>
                     <span className="font-mono text-[8px] tracking-widest text-slate-400">Commits: {pressCount}</span>
                  </div>

                  {/* Sisi Belakang Keycap */}
                  <div
                     className="absolute inset-x-2 top-8 h-12 rounded-b-lg border-x border-b border-white/10 bg-[#070A11]"
                     style={{
                        transform: "rotateY(180deg) translateZ(48px) rotateX(-12deg)",
                     }}
                  />

                  {/* Sisi Kanan Keycap */}
                  <div
                     className="absolute inset-x-2 top-8 h-12 rounded-b-lg border-x border-b border-white/10 bg-[#0D1320]"
                     style={{
                        transform: "rotateY(90deg) translateZ(48px) rotateX(-12deg)",
                     }}
                  />

                  {/* Sisi Kiri Keycap */}
                  <div
                     className="absolute inset-x-2 top-8 h-12 rounded-b-lg border-x border-b border-white/10 bg-[#0D1320]"
                     style={{
                        transform: "rotateY(-90deg) translateZ(48px) rotateX(-12deg)",
                     }}
                  />
               </div>
            </div>
         </div>
         <span className="font-mono text-[11px] text-slate-400">Klik untuk tekan switch · Drag 360°</span>
      </div>
   );
}

/* ============================================================================
   2. GRADUATION CAP 3D (OBJEK TOGA KELULUSAN 3D INTERAKTIF)
   ============================================================================ */

export interface GraduationCap3DProps {
   year?: string;
   className?: string;
}

export function GraduationCap3D({ year = "2026", className = "" }: GraduationCap3DProps) {
   const [rot, setRot] = React.useState({ x: -22, y: 38 });
   const [tossed, setTossed] = React.useState(false);
   const drag = React.useRef({ down: false, sx: 0, sy: 0, bx: -22, by: 38, moved: false });

   const triggerToss = () => {
      if (tossed) return;
      setTossed(true);
      setRot(r => ({ x: r.x, y: r.y + 360 }));
      window.setTimeout(() => setTossed(false), 750);
   };

   return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
         <div
            className="scene-3d relative flex h-56 w-56 cursor-grab items-center justify-center active:cursor-grabbing"
            onPointerDown={e => {
               drag.current = {
                  down: true,
                  sx: e.clientX,
                  sy: e.clientY,
                  bx: rot.x,
                  by: rot.y,
                  moved: false,
               };
               e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={e => {
               if (!drag.current.down) return;
               const dx = e.clientX - drag.current.sx;
               const dy = e.clientY - drag.current.sy;
               if (Math.hypot(dx, dy) > 5) drag.current.moved = true;
               setRot({
                  x: Math.max(-55, Math.min(25, drag.current.bx - dy * 0.5)),
                  y: drag.current.by + dx * 0.7,
               });
            }}
            onPointerUp={() => {
               if (!drag.current.down) return;
               const moved = drag.current.moved;
               drag.current.down = false;
               if (!moved) triggerToss();
            }}
            role="button"
            tabIndex={0}
            aria-label="Toga Kelulusan 3D XII PPLG 1">
            <div
               className="object-3d relative h-32 w-32 transition-all duration-700 ease-out"
               style={{
                  transform: `translateY(${tossed ? -38 : 0}px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
               }}>
               {/* Papan Atas Mortarboard (Persegi 3D) */}
               <div
                  className="object-3d absolute inset-0 flex items-center justify-center rounded-sm border border-sky-400/40 bg-gradient-to-br from-[#131B2E] via-[#0B101D] to-[#07090E]"
                  style={{
                     transform: "rotateX(90deg) translateZ(24px)",
                     boxShadow: "0 0 25px rgba(56, 189, 248, 0.2), inset 0 0 18px rgba(56, 189, 248, 0.15)",
                  }}>
                  {/* Garis Lis Emas/Cyan */}
                  <div className="pointer-events-none absolute inset-2 border border-amber-400/35" />
                  <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-slate-300/80">XII PPLG 1</span>
                  {/* Kancing Tengah Toga */}
                  <div className="h-4 w-4 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,146,60,0.8)]" style={{ transform: "translateZ(4px)" }} />
               </div>

               {/* Rumbai Toga 3D (Golden Tassel) */}
               <div
                  className="object-3d absolute left-1/2 top-1/2 h-20 w-1.5 origin-top bg-gradient-to-b from-amber-300 via-amber-500 to-orange-600"
                  style={{
                     transform: "translateZ(64px) translateY(-20px) rotateZ(12deg)",
                  }}>
                  <div className="mt-16 -ml-2 rounded bg-amber-400 px-1 py-0.5 font-mono text-[7px] font-extrabold text-slate-950 shadow">{year}</div>
               </div>

               {/* 4 Sisi Kopiah Bawah Toga (Skullcap Base) */}
               {[0, 90, 180, -90].map(angle => (
                  <div
                     key={angle}
                     className="absolute left-6 right-6 top-10 h-11 rounded-b-xl border-x border-b border-sky-400/25 bg-gradient-to-b from-[#0E1525] to-[#070A12]"
                     style={{
                        transform: `rotateY(${angle}deg) translateZ(40px)`,
                     }}
                  />
               ))}
            </div>
         </div>
         <span className="font-mono text-[11px] text-slate-400">Klik untuk lempar toga · Drag 360°</span>
      </div>
   );
}
