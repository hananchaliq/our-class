"use client";

import * as React from "react";
import { INITIAL_FAREWELL_DATA, type FarewellMemoryPhoto } from "../../types/class-system";

export interface VinylDisc3DProps {
   trackTitle?: string;
   trackArtist?: string;
   coverImage?: string;
   audioUrl?: string;
   className?: string;
}

export function VinylDisc3D({ trackTitle = "See You Again on Production", trackArtist = "XII PPLG 1 · Class of 2026", coverImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80", audioUrl, className = "" }: VinylDisc3DProps) {
   const [playing, setPlaying] = React.useState(false);
   const [tilt, setTilt] = React.useState({ x: 24, y: -16 });
   const audioRef = React.useRef<HTMLAudioElement | null>(null);

   const togglePlay = () => {
      const next = !playing;
      setPlaying(next);
      if (audioRef.current && audioUrl) {
         if (next) audioRef.current.play().catch(() => {});
         else audioRef.current.pause();
      }
   };

   return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
         {audioUrl && <audio ref={audioRef} src={audioUrl} loop preload="none" />}

         <div
            className="scene-3d relative flex h-64 w-64 cursor-pointer items-center justify-center"
            onClick={togglePlay}
            onPointerMove={(e: React.PointerEvent<HTMLDivElement>) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const nx = (e.clientX - rect.left) / rect.width - 0.5;
               const ny = (e.clientY - rect.top) / rect.height - 0.5;
               setTilt({ x: 22 - ny * 20, y: -14 + nx * 24 });
            }}
            role="button"
            tabIndex={0}
            aria-label={`Pemutar Piringan Hitam 3D ${trackTitle}`}
            onKeyDown={e => {
               if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  togglePlay();
               }
            }}>
            <div
               className="object-3d relative h-48 w-48 transition-transform duration-200 ease-out"
               style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
               }}>
               <div aria-hidden="true" className="absolute inset-2 rounded-full bg-black/80 blur-xl" style={{ transform: "translateZ(-18px)" }} />

               {[-6, -4, -2].map(z => (
                  <div key={z} aria-hidden="true" className="absolute inset-0 rounded-full border border-white/10 bg-[#06080d]" style={{ transform: `translateZ(${z}px)` }} />
               ))}

               <div
                  className={`object-3d absolute inset-0 rounded-full border border-white/15 shadow-2xl ${playing ? "animate-[spin_5s_linear_infinite]" : ""}`}
                  style={{
                     background: "repeating-radial-gradient(circle at 50% 50%, #090c14 0px, #090c14 3px, #141b2d 4px, #090c14 5px)",
                     boxShadow: playing ? "0 0 35px rgba(56, 189, 248, 0.35), inset 0 0 20px rgba(251, 146, 60, 0.2)" : "0 12px 30px rgba(0,0,0,0.75)",
                  }}>
                  <div
                     aria-hidden="true"
                     className="pointer-events-none absolute inset-0 rounded-full opacity-45"
                     style={{
                        background: "conic-gradient(from 45deg, transparent 0deg, rgba(56,189,248,0.28) 35deg, transparent 70deg, transparent 180deg, rgba(251,146,60,0.25) 215deg, transparent 250deg)",
                     }}
                  />

                  <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-amber-400/60 shadow-inner">
                     <img src={coverImage} alt="" className="h-full w-full object-cover" draggable={false} />
                     <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-[#07090E]" />
                  </div>
               </div>

               <div
                  className="object-3d absolute -right-3 top-2 h-32 w-3 origin-top transition-transform duration-500"
                  style={{
                     transform: `translateZ(14px) rotateZ(${playing ? 24 : 4}deg)`,
                  }}>
                  <div className="mx-auto h-5 w-5 rounded-full border border-white/25 bg-slate-800 shadow" />
                  <div className="mx-auto h-24 w-1 bg-gradient-to-b from-slate-300 to-slate-500" />
                  <div className="mx-auto h-4 w-3 rounded-xs bg-amber-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
               </div>
            </div>
         </div>

         <div className="obsidian-pill flex items-center gap-3 rounded-full px-4 py-2">
            <span className={`h-2.5 w-2.5 rounded-full ${playing ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-slate-500"}`} />
            <div className="text-left">
               <p className="text-xs font-semibold text-slate-100">{trackTitle}</p>
               <p className="font-mono text-[10px] text-slate-400">{trackArtist}</p>
            </div>
            <button type="button" onClick={togglePlay} className="ml-2 cursor-pointer rounded-full bg-sky-500/20 px-2.5 py-1 font-mono text-[10px] font-semibold text-sky-300 hover:bg-sky-500/30">
               {playing ? "PAUSE" : "PLAY"}
            </button>
         </div>
      </div>
   );
}

export interface MemoryPhotoCube3DProps {
   photos?: FarewellMemoryPhoto[];
   size?: number;
   className?: string;
}

export function MemoryPhotoCube3D({ photos = INITIAL_FAREWELL_DATA.photos, size = 168, className = "" }: MemoryPhotoCube3DProps) {
   const [rot, setRot] = React.useState({ x: -16, y: 34 });
   const [autoSpin, setAutoSpin] = React.useState(true);
   const drag = React.useRef({ down: false, sx: 0, sy: 0, bx: -16, by: 34 });

   const sixFaces = React.useMemo(() => {
      const base = photos.length > 0 ? photos : INITIAL_FAREWELL_DATA.photos;
      return Array.from({ length: 6 }, (_, i) => base[i % base.length]!);
   }, [photos]);

   React.useEffect(() => {
      if (!autoSpin) return;
      let raf = 0;
      const animate = () => {
         setRot(prev => ({ x: prev.x, y: (prev.y + 0.35) % 360 }));
         raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
   }, [autoSpin]);

   const half = size / 2;

   const faceTransforms = [`translateZ(${half}px)`, `rotateY(180deg) translateZ(${half}px)`, `rotateY(90deg) translateZ(${half}px)`, `rotateY(-90deg) translateZ(${half}px)`, `rotateX(90deg) translateZ(${half}px)`, `rotateX(-90deg) translateZ(${half}px)`];

   return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
         <div
            className="scene-3d relative flex h-64 w-64 cursor-grab items-center justify-center active:cursor-grabbing"
            onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
               setAutoSpin(false);
               drag.current = {
                  down: true,
                  sx: e.clientX,
                  sy: e.clientY,
                  bx: rot.x,
                  by: rot.y,
               };
               e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e: React.PointerEvent<HTMLDivElement>) => {
               if (!drag.current.down) return;
               const dx = e.clientX - drag.current.sx;
               const dy = e.clientY - drag.current.sy;
               setRot({
                  x: drag.current.bx - dy * 0.6,
                  y: drag.current.by + dx * 0.6,
               });
            }}
            onPointerUp={() => {
               drag.current.down = false;
            }}>
            <div
               className="object-3d relative"
               style={{
                  width: size,
                  height: size,
                  transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
               }}>
               {sixFaces.map((face: FarewellMemoryPhoto, idx: number) => (
                  <div
                     key={`${face.id}-${idx}`}
                     className="absolute inset-0 overflow-hidden rounded-xl border border-sky-400/35 bg-[#0A0E17] shadow-[0_0_25px_rgba(0,0,0,0.75)]"
                     style={{
                        transform: faceTransforms[idx],
                     }}>
                     <img src={face.image_url} alt={face.title} draggable={false} className="h-full w-full object-cover opacity-85" />
                     <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5">
                        <p className="font-mono text-[9px] text-sky-400">MOMEN #{idx + 1}</p>
                        <p className="truncate text-[11px] font-semibold text-white">{face.title}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="mt-1 flex items-center gap-2">
            <button type="button" onClick={() => setAutoSpin(s => !s)} className="obsidian-pill cursor-pointer rounded-full px-3 py-1 font-mono text-[10px] text-slate-300 hover:text-white">
               {autoSpin ? "Pause Orbit 3D" : "Putar Otomatis 3D"}
            </button>
         </div>
      </div>
   );
}
