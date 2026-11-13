"use client";

import * as React from "react";
import { INITIAL_FAREWELL_DATA, type FarewellBoxPayload, type FarewellMemoryPhoto, type FarewellQuote } from "../../types/class-system";

export interface FarewellGiftBox3DProps {
   initialData?: FarewellBoxPayload;
   canEdit?: boolean;
   onSaveData?: (updated: FarewellBoxPayload) => void;
   className?: string;
}

export function FarewellGiftBox3D({ initialData = INITIAL_FAREWELL_DATA, canEdit = true, onSaveData, className = "" }: FarewellGiftBox3DProps) {
   const [data, setData] = React.useState<FarewellBoxPayload>(initialData);
   const [isOpen, setIsOpen] = React.useState(false);
   const [vaultVisible, setVaultVisible] = React.useState(false);
   const [rot, setRot] = React.useState({ x: -18, y: 32 });
   const dragRef = React.useRef({
      active: false,
      startX: 0,
      startY: 0,
      baseX: -18,
      baseY: 32,
      moved: false,
   });

   const [isEditingMessage, setIsEditingMessage] = React.useState(false);
   const [draftHeadline, setDraftHeadline] = React.useState(data.headline);
   const [draftMessage, setDraftMessage] = React.useState(data.main_message);

   const [newQuoteAuthor, setNewQuoteAuthor] = React.useState("");
   const [newQuoteRole, setNewQuoteRole] = React.useState("");
   const [newQuoteText, setNewQuoteText] = React.useState("");

   const [newPhotoTitle, setNewPhotoTitle] = React.useState("");
   const [newPhotoDesc, setNewPhotoDesc] = React.useState("");
   const [newPhotoUrl, setNewPhotoUrl] = React.useState("");

   const updateAndSync = (next: FarewellBoxPayload) => {
      setData(next);
      onSaveData?.(next);
   };

   const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      dragRef.current = {
         active: true,
         startX: e.clientX,
         startY: e.clientY,
         baseX: rot.x,
         baseY: rot.y,
         moved: false,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
   };

   const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.hypot(dx, dy) > 6) dragRef.current.moved = true;
      const nextX = Math.max(-42, Math.min(10, dragRef.current.baseX - dy * 0.45));
      const nextY = dragRef.current.baseY + dx * 0.65;
      setRot({ x: nextX, y: nextY });
   };

   const handlePointerUp = () => {
      if (!dragRef.current.active) return;
      const wasMoved = dragRef.current.moved;
      dragRef.current.active = false;
      if (!wasMoved) {
         if (!isOpen) {
            setIsOpen(true);
            window.setTimeout(() => setVaultVisible(true), 650);
         } else {
            setVaultVisible(true);
         }
      }
   };

   const handleAddQuote = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newQuoteAuthor.trim() || !newQuoteText.trim()) return;
      const created: FarewellQuote = {
         id: `q-${Date.now()}`,
         author_name: newQuoteAuthor.trim(),
         role: newQuoteRole.trim() || "Anggota XII PPLG 1",
         quote: newQuoteText.trim(),
         tone: ((data.quotes.length % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      };
      updateAndSync({ ...data, quotes: [created, ...data.quotes] });
      setNewQuoteAuthor("");
      setNewQuoteRole("");
      setNewQuoteText("");
   };

   const handleDeleteQuote = (id: string) => {
      updateAndSync({
         ...data,
         quotes: data.quotes.filter((q: FarewellQuote) => q.id !== id),
      });
   };

   const handleAddPhoto = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newPhotoTitle.trim() || !newPhotoUrl.trim()) return;
      const created: FarewellMemoryPhoto = {
         id: `mem-${Date.now()}`,
         title: newPhotoTitle.trim(),
         description: newPhotoDesc.trim() || "Kenangan XII PPLG 1",
         image_url: newPhotoUrl.trim(),
         taken_date: new Date().toISOString().slice(0, 10),
         category: "farewell_photo",
      };
      updateAndSync({ ...data, photos: [created, ...data.photos] });
      setNewPhotoTitle("");
      setNewPhotoDesc("");
      setNewPhotoUrl("");
   };

   const handleDeletePhoto = (id: string) => {
      updateAndSync({
         ...data,
         photos: data.photos.filter((p: FarewellMemoryPhoto) => p.id !== id),
      });
   };

   const handleSaveMainMessage = () => {
      updateAndSync({
         ...data,
         headline: draftHeadline,
         main_message: draftMessage,
      });
      setIsEditingMessage(false);
   };

   const S = 180;
   const H = S / 2;
   const LID_S = 192;
   const LID_H = LID_S / 2;
   const LID_DEPTH = 38;

   return (
      <div className={`relative flex flex-col items-center ${className}`}>
         <div
            className="scene-3d relative flex h-[380px] w-full max-w-[440px] cursor-grab select-none items-center justify-center active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            role="button"
            tabIndex={0}
            aria-label="Kado 3D Perpisahan XII PPLG 1. Klik untuk membuka atau geser untuk memutar."
            onKeyDown={e => {
               if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsOpen(true);
                  window.setTimeout(() => setVaultVisible(true), 600);
               }
            }}>
            <div
               aria-hidden="true"
               className="pointer-events-none absolute bottom-8 h-16 w-56 rounded-full blur-2xl transition-all duration-700"
               style={{
                  background: isOpen ? "radial-gradient(circle, rgba(251,146,60,0.55) 0%, rgba(56,189,248,0.35) 60%, transparent 100%)" : "radial-gradient(circle, rgba(56,189,248,0.28) 0%, rgba(251,146,60,0.18) 65%, transparent 100%)",
               }}
            />

            <div className="object-3d animate-float-3d">
               <div
                  className="object-3d relative transition-transform duration-150 ease-out"
                  style={{
                     width: S,
                     height: S,
                     transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
                  }}>
                  <div
                     aria-hidden="true"
                     className="object-3d pointer-events-none absolute inset-4 rounded-full transition-all duration-700"
                     style={{
                        transform: `translateY(${isOpen ? -45 : 0}px) scale(${isOpen ? 1.35 : 0.4})`,
                        opacity: isOpen ? 1 : 0,
                        background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(251,146,60,0.75) 38%, rgba(56,189,248,0.4) 72%, transparent 100%)",
                        filter: "blur(14px)",
                     }}
                  />

                  {/* Depan */}
                  <div
                     className="object-3d absolute inset-0 flex items-center justify-center border border-sky-400/30"
                     style={{
                        background: "linear-gradient(160deg, #0f172a 0%, #07090e 100%)",
                        boxShadow: "inset 0 0 28px rgba(56, 189, 248, 0.14)",
                        transform: `translateZ(${H}px)`,
                     }}>
                     <div className="h-full w-7 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 shadow-[0_0_16px_rgba(251,146,60,0.5)]" />
                     <div className="absolute rounded-md border border-white/15 bg-[#07090E]/90 px-3 py-1.5 text-center shadow-lg">
                        <p className="font-mono text-[10px] font-semibold tracking-[0.22em] text-sky-400">XII PPLG 1</p>
                        <p className="text-[9px] text-slate-300">CLASS OF 2026</p>
                     </div>
                  </div>

                  {/* Belakang */}
                  <div
                     className="absolute inset-0 flex items-center justify-center border border-sky-400/25"
                     style={{
                        background: "linear-gradient(160deg, #0b1120 0%, #06080c 100%)",
                        transform: `rotateY(180deg) translateZ(${H}px)`,
                     }}>
                     <div className="h-full w-7 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600" />
                  </div>

                  {/* Kanan */}
                  <div
                     className="absolute inset-0 flex items-center justify-center border border-amber-400/25"
                     style={{
                        background: "linear-gradient(160deg, #0d1322 0%, #07090e 100%)",
                        transform: `rotateY(90deg) translateZ(${H}px)`,
                     }}>
                     <div className="h-full w-7 bg-gradient-to-b from-sky-400 via-cyan-500 to-blue-600 shadow-[0_0_16px_rgba(56,189,248,0.45)]" />
                  </div>

                  {/* Kiri */}
                  <div
                     className="absolute inset-0 flex items-center justify-center border border-amber-400/25"
                     style={{
                        background: "linear-gradient(160deg, #0d1322 0%, #07090e 100%)",
                        transform: `rotateY(-90deg) translateZ(${H}px)`,
                     }}>
                     <div className="h-full w-7 bg-gradient-to-b from-sky-400 via-cyan-500 to-blue-600" />
                  </div>

                  {/* Bawah */}
                  <div
                     className="absolute inset-0 border border-white/10 bg-[#05070b]"
                     style={{
                        transform: `rotateX(-90deg) translateZ(${H}px)`,
                        boxShadow: "0 0 45px rgba(0, 0, 0, 0.9)",
                     }}
                  />

                  {/* Rongga Dalam Atas */}
                  <div
                     className="absolute inset-0 flex items-center justify-center border border-amber-300/40"
                     style={{
                        background: "radial-gradient(circle, #fb923c 0%, #1e1b4b 70%, #07090e 100%)",
                        transform: `rotateX(90deg) translateZ(${H - 2}px)`,
                     }}>
                     <span className="font-mono text-xs font-bold tracking-widest text-white drop-shadow">MEMORI 2026</span>
                  </div>

                  {/* Tutup Kado 3D */}
                  <div
                     className="object-3d absolute transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                     style={{
                        width: LID_S,
                        height: LID_S,
                        left: -6,
                        top: -6,
                        transformOrigin: `50% 0% -${LID_H}px`,
                        transform: isOpen ? "translateY(-54px) translateZ(-28px) rotateX(68deg)" : "translateY(-4px) rotateX(0deg)",
                     }}>
                     <div
                        className="object-3d absolute inset-0 flex items-center justify-center border border-sky-300/40"
                        style={{
                           background: "linear-gradient(135deg, #111a2e 0%, #090d16 100%)",
                           transform: `rotateX(90deg) translateZ(${LID_H}px)`,
                        }}>
                        <div className="absolute h-full w-8 bg-gradient-to-b from-amber-300 via-orange-500 to-amber-600 shadow-[0_0_15px_rgba(251,146,60,0.6)]" />
                        <div className="absolute h-8 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(56,189,248,0.6)]" />

                        <div className="object-3d relative flex items-center justify-center" style={{ transform: "translateZ(18px)" }}>
                           <div className="absolute h-10 w-10 rounded-full border-4 border-amber-400 shadow-[0_0_18px_rgba(251,146,60,0.65)]" style={{ transform: "rotateX(65deg) rotateY(-25deg) translateX(-12px)" }} />
                           <div className="absolute h-10 w-10 rounded-full border-4 border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.65)]" style={{ transform: "rotateX(65deg) rotateY(25deg) translateX(12px)" }} />
                           <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-amber-400 to-sky-400 shadow-md" />
                        </div>
                     </div>

                     <div className="absolute inset-x-0 top-0 flex items-center justify-center border border-white/15 bg-[#101829]" style={{ height: LID_DEPTH, transform: `translateZ(${LID_H}px)` }}>
                        <div className="h-full w-8 bg-amber-500" />
                     </div>
                     <div className="absolute inset-x-0 top-0 flex items-center justify-center border border-white/15 bg-[#0c1220]" style={{ height: LID_DEPTH, transform: `rotateY(180deg) translateZ(${LID_H}px)` }}>
                        <div className="h-full w-8 bg-amber-500" />
                     </div>
                     <div className="absolute inset-x-0 top-0 flex items-center justify-center border border-white/15 bg-[#0e1525]" style={{ height: LID_DEPTH, transform: `rotateY(90deg) translateZ(${LID_H}px)` }}>
                        <div className="h-full w-8 bg-sky-400" />
                     </div>
                     <div className="absolute inset-x-0 top-0 flex items-center justify-center border border-white/15 bg-[#0e1525]" style={{ height: LID_DEPTH, transform: `rotateY(-90deg) translateZ(${LID_H}px)` }}>
                        <div className="h-full w-8 bg-sky-400" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <button
               type="button"
               onClick={() => {
                  if (!isOpen) {
                     setIsOpen(true);
                     window.setTimeout(() => setVaultVisible(true), 550);
                  } else {
                     setVaultVisible(true);
                  }
               }}
               className="obsidian-pill cursor-pointer rounded-full border-amber-400/40 bg-amber-500/15 px-5 py-2 text-xs font-semibold tracking-wide text-amber-200 transition hover:bg-amber-500/25 glow-amber">
               {isOpen ? "Buka Ruang Kenangan XII PPLG 1" : "Buka Kado Perpisahan 3D"}
            </button>

            {isOpen && (
               <button
                  type="button"
                  onClick={() => {
                     setVaultVisible(false);
                     setIsOpen(false);
                  }}
                  className="obsidian-pill cursor-pointer rounded-full px-4 py-2 text-xs text-slate-300 hover:text-white">
                  Tutup Kembali Kado
               </button>
            )}
         </div>
         <p className="mt-2 text-center font-mono text-[11px] text-slate-400">Drag kado untuk memutar 360° · Klik kado untuk membuka kapsul perpisahan</p>

         {vaultVisible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={data.headline}>
               <div className="obsidian-surface relative max-h-[90vh] w-full max-w-5xl overflow-y-auto p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
                     <div>
                        <span className="inline-block rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-0.5 font-mono text-[11px] text-amber-300">FAREWELL CAPSULE · {data.graduation_year}</span>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">{data.headline}</h2>
                        <p className="mt-1 text-sm text-slate-400">{data.subheadline}</p>
                     </div>
                     <button type="button" onClick={() => setVaultVisible(false)} className="obsidian-pill cursor-pointer rounded-full px-3.5 py-1.5 font-mono text-xs text-slate-300 hover:border-white/30 hover:text-white">
                        ESC / Tutup ✕
                     </button>
                  </div>

                  <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                     <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-sky-400">Surat Perpisahan Kelas</span>
                        {canEdit && (
                           <button
                              type="button"
                              onClick={() => {
                                 setDraftHeadline(data.headline);
                                 setDraftMessage(data.main_message);
                                 setIsEditingMessage(!isEditingMessage);
                              }}
                              className="cursor-pointer font-mono text-xs text-amber-300 hover:underline">
                              {isEditingMessage ? "Batal Edit" : "Edit Surat"}
                           </button>
                        )}
                     </div>

                     {isEditingMessage ? (
                        <div className="mt-3 space-y-3">
                           <input type="text" value={draftHeadline} onChange={e => setDraftHeadline(e.target.value)} className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-sky-400" placeholder="Judul Pesan Perpisahan" />
                           <textarea rows={4} value={draftMessage} onChange={e => setDraftMessage(e.target.value)} className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-sky-400" placeholder="Tulis pesan perpisahan untuk XII PPLG 1..." />
                           <button type="button" onClick={handleSaveMainMessage} className="cursor-pointer rounded-lg bg-sky-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400">
                              Simpan Perubahan
                           </button>
                        </div>
                     ) : (
                        <p className="mt-3 text-sm leading-relaxed text-slate-200 md:text-base">&ldquo;{data.main_message}&rdquo;</p>
                     )}
                  </div>

                  <div className="mt-8">
                     <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-medium text-slate-100">Album Foto Kenangan ({data.photos.length})</h3>
                        <span className="font-mono text-xs text-slate-400">Bisa ditambah/dikurangi oleh anggota kelas</span>
                     </div>

                     <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {data.photos.map((photo: FarewellMemoryPhoto) => (
                           <div key={photo.id} className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B0F19]">
                              <div className="aspect-video w-full overflow-hidden bg-slate-900">
                                 <img src={photo.image_url} alt={photo.title} className="h-full w-full object-cover" loading="lazy" />
                              </div>
                              <div className="p-4">
                                 <div className="flex items-start justify-between gap-2">
                                    <div>
                                       <p className="font-mono text-[10px] text-sky-400">{photo.taken_date}</p>
                                       <h4 className="mt-0.5 text-sm font-semibold text-slate-100">{photo.title}</h4>
                                    </div>
                                    {canEdit && (
                                       <button type="button" onClick={() => handleDeletePhoto(photo.id)} className="cursor-pointer rounded bg-rose-500/15 px-2 py-0.5 font-mono text-[10px] text-rose-300 hover:bg-rose-500/30">
                                          Hapus
                                       </button>
                                    )}
                                 </div>
                                 <p className="mt-1 text-xs text-slate-400">{photo.description}</p>
                              </div>
                           </div>
                        ))}
                     </div>

                     {canEdit && (
                        <form onSubmit={handleAddPhoto} className="mt-4 grid grid-cols-1 gap-2.5 rounded-xl border border-dashed border-white/15 bg-white/[0.01] p-4 sm:grid-cols-4">
                           <input type="text" value={newPhotoTitle} onChange={e => setNewPhotoTitle(e.target.value)} placeholder="Judul Momen (cth: Bukber Kelas)" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400" />
                           <input type="url" value={newPhotoUrl} onChange={e => setNewPhotoUrl(e.target.value)} placeholder="URL Foto (Supabase Storage / Link)" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400" />
                           <input type="text" value={newPhotoDesc} onChange={e => setNewPhotoDesc(e.target.value)} placeholder="Catatan singkat momen..." className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400" />
                           <button type="submit" className="cursor-pointer rounded-lg border border-sky-400/40 bg-sky-500/20 px-4 py-2 text-xs font-medium text-sky-200 hover:bg-sky-500/30">
                              + Tambah Foto
                           </button>
                        </form>
                     )}
                  </div>

                  <div className="mt-8">
                     <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-medium text-slate-100">Quotes & Pesan Teman Sekelas ({data.quotes.length})</h3>
                        <span className="font-mono text-xs text-slate-400">Opsional · Bebas tambah atau hapus</span>
                     </div>

                     {data.quotes.length === 0 ? (
                        <p className="mt-3 text-xs text-slate-500">Belum ada quotes yang ditambahkan. Gunakan form di bawah jika ingin mengisi pesan.</p>
                     ) : (
                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                           {data.quotes.map((q: FarewellQuote) => (
                              <div key={q.id} className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0B0F19]/90 p-4">
                                 <p className="text-xs leading-relaxed text-slate-200">&ldquo;{q.quote}&rdquo;</p>
                                 <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                                    <div>
                                       <p className="text-xs font-semibold text-slate-100">{q.author_name}</p>
                                       <p className="font-mono text-[10px] text-slate-400">{q.role}</p>
                                    </div>
                                    {canEdit && (
                                       <button type="button" onClick={() => handleDeleteQuote(q.id)} className="cursor-pointer font-mono text-[10px] text-rose-400 hover:underline">
                                          Hapus
                                       </button>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {canEdit && (
                        <form onSubmit={handleAddQuote} className="mt-4 grid grid-cols-1 gap-2.5 rounded-xl border border-dashed border-white/15 bg-white/[0.01] p-4 sm:grid-cols-4">
                           <input type="text" value={newQuoteAuthor} onChange={e => setNewQuoteAuthor(e.target.value)} placeholder="Nama Siswa" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-amber-400" />
                           <input type="text" value={newQuoteRole} onChange={e => setNewQuoteRole(e.target.value)} placeholder="Absen / Role (Opsional)" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-amber-400" />
                           <input type="text" value={newQuoteText} onChange={e => setNewQuoteText(e.target.value)} placeholder="Tulis quote / kesan pesan singkat..." className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-amber-400" />
                           <button type="submit" className="cursor-pointer rounded-lg border border-amber-400/40 bg-amber-500/20 px-4 py-2 text-xs font-medium text-amber-200 hover:bg-amber-500/30">
                              + Tambah Quote
                           </button>
                        </form>
                     )}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default FarewellGiftBox3D;
