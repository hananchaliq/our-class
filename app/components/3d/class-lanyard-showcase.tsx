"use client";

import * as React from "react";
import { TeamLanyardRail } from "./team-lanyard-rail";
import { INITIAL_PPLG1_STUDENTS, type ClassStudent } from "@/app/types/class-system";

export interface ClassLanyardShowcaseProps {
  students?: ClassStudent[];
  className?: string;
}

type FilterMode =
  | "batch-1"
  | "batch-2"
  | "batch-3"
  | "Frontend"
  | "Backend"
  | "UI/UX & Creative"
  | "Game & Mobile"
  | "all";

const FILTER_TABS: { id: FilterMode; label: string; badge: string }[] = [
  { id: "batch-1", label: "Rel 1 (Absen 01–08)", badge: "8" },
  { id: "batch-2", label: "Rel 2 (Absen 09–15)", badge: "7" },
  { id: "batch-3", label: "Rel 3 (Absen 16–22)", badge: "7" },
  { id: "Frontend", label: "Frontend", badge: "Div" },
  { id: "Backend", label: "Backend", badge: "Div" },
  { id: "UI/UX & Creative", label: "UI/UX", badge: "Div" },
  { id: "Game & Mobile", label: "Game & Mobile", badge: "Div" },
  { id: "all", label: "Semua Siswa (Carousel)", badge: "22" },
];

export function ClassLanyardShowcase({
  students = INITIAL_PPLG1_STUDENTS,
  className = "",
}: ClassLanyardShowcaseProps) {
  const [filter, setFilter] = React.useState<FilterMode>("batch-1");
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
  const [flippedIdx, setFlippedIdx] = React.useState<number | null>(null);

  const filteredStudents = React.useMemo(() => {
    switch (filter) {
      case "batch-1":
        return students.filter((s: ClassStudent) => s.absen >= 1 && s.absen <= 8);
      case "batch-2":
        return students.filter((s: ClassStudent) => s.absen >= 9 && s.absen <= 15);
      case "batch-3":
        return students.filter((s: ClassStudent) => s.absen >= 16 && s.absen <= 22);
      case "Frontend":
      case "Backend":
      case "UI/UX & Creative":
      case "Game & Mobile":
        return students.filter((s: ClassStudent) => s.division === filter);
      case "all":
      default:
        return students;
    }
  }, [students, filter]);

  const handleFilterChange = (nextFilter: FilterMode) => {
    setActiveIdx(null);
    setFlippedIdx(null);
    setFilter(nextFilter);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2 px-4">
        {FILTER_TABS.map((tab) => {
          const isSelected = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleFilterChange(tab.id)}
              className={`obsidian-pill inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "border-sky-400/50 bg-sky-500/15 text-slate-50 glow-cyan"
                  : "text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  isSelected
                    ? "bg-sky-400/25 text-sky-300"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      <TeamLanyardRail
        items={filteredStudents}
        eyebrow="DIRECTORY ANGGOTA · XII PPLG 1"
        heading="22 Developer, Satu Identitas"
        caption="Tarik tali ke bawah, geser untuk membenturkan kartu, atau klik ID Card untuk membalik biodata."
        autoplay={false}
        active={activeIdx}
        onActiveChange={setActiveIdx}
        flipped={flippedIdx}
        onFlippedChange={setFlippedIdx}
        labels={{
          flip: "Klik atau tekan Enter untuk membalik ID Card",
          back: "Klik lagi atau tekan Esc untuk kembali ke depan",
          show: "Pilih Siswa",
        }}
        className="rounded-2xl border border-white/[0.08]"
      />
    </div>
  );
}

export default ClassLanyardShowcase;