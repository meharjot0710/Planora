"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Timetable Design — Minimal Colors
// Visual-only presentational component inspired by the provided image.
// Uses a reduced, soft palette: a single accent (blue) + a secondary gentle green for labs.
// Layout: title/header resembling classroom header, compact table, subtle shadows.

const SLOTS = [
  { id: "S1", label: "09:00 - 10:00" },
  { id: "S2", label: "10:00 - 11:00" },
  { id: "S3", label: "11:00 - 12:00" },
  { id: "S4", label: "12:00 - 14:00" },
  { id: "S5", label: "14:00 - 15:00" },
  { id: "S6", label: "15:00 - 16:00" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const EXAMPLE_GRID = {
  Mon: {
    S1: { course: "Calculus", faculty: "F301", room: "R-301", type: "Lecture", batches: ["B1"] },
    S2: { course: "Physics", faculty: "F302", room: "R-302", type: "Lecture", batches: ["B1"] },
    S3: { course: "Programming", faculty: "F303", room: "R-303", type: "Lecture", batches: ["B1"] },
    S4: null, // Lunch / Break
    S5: { course: "DBMS", faculty: "F305", room: "R-305", type: "Lecture", batches: ["B1"] },
    S6: { course: "Algorithms", faculty: "F304", room: "R-304", type: "Lecture", batches: ["B1"] },
  },
  Tue: {
    S1: { course: "Calculus", faculty: "F301", room: "R-301", type: "Lecture", batches: ["B1"] },
    S2: { course: "Physics", faculty: "F302", room: "R-302", type: "Lecture", batches: ["B1"] },
    S3: { course: "Programming", faculty: "F303", room: "R-303", type: "Lecture", batches: ["B1"] },
    S4: null, // Lunch / Break
    S5: { course: "DBMS", faculty: "F305", room: "R-305", type: "Lecture", batches: ["B1"] },
    S6: null,
  },
  Wed: {
    S1: { course: "Algorithms", faculty: "F304", room: "R-304", type: "Lecture", batches: ["B1"] },
    S2: { course: "Calculus", faculty: "F301", room: "R-301", type: "Lecture", batches: ["B1"] },
    S3: null,
    S4: null, // Lunch / Break
    S5: { course: "Physics", faculty: "F302", room: "R-302", type: "Lecture", batches: ["B1"] },
    S6: { course: "Programming", faculty: "F303", room: "R-303", type: "Lecture", batches: ["B1"] },
  },
  Thu: {
    S1: { course: "DBMS", faculty: "F305", room: "R-305", type: "Lecture", batches: ["B1"] },
    S2: { course: "Algorithms", faculty: "F304", room: "R-304", type: "Lecture", batches: ["B1"] },
    S3: { course: "Calculus", faculty: "F301", room: "R-301", type: "Lecture", batches: ["B1"] },
    S4: null, // Lunch / Break
    S5: { course: "Physics", faculty: "F302", room: "R-302", type: "Lecture", batches: ["B1"] },
    S6: null,
  },
  Fri: {
    S1: { course: "Programming", faculty: "F303", room: "R-303", type: "Lecture", batches: ["B1"] },
    S2: { course: "DBMS", faculty: "F305", room: "R-305", type: "Lecture", batches: ["B1"] },
    S3: { course: "Physics", faculty: "F302", room: "R-302", type: "Lecture", batches: ["B1"] },
    S4: null, // Lunch / Break
    S5: { course: "Algorithms", faculty: "F304", room: "R-304", type: "Lecture", batches: ["B1"] },
    S6: { course: "Calculus", faculty: "F301", room: "R-301", type: "Lecture", batches: ["B1"] },
  },
};

function Cell({ cell, compact = false, tone = "soft" }) {
  if (!cell)
    return <div className={`p-2 ${compact ? 'text-[11px]' : 'text-sm'} text-gray-500`}>—</div>;

  // Subject-based palette; tone: soft | medium | dark
  const SUBJECT_COLORS = {
    calculus: "sky",
    physics: "violet",
    programming: "emerald",
    algorithms: "amber",
    dbms: "rose",
  };
  const subjectKey = String(cell.course || "").toLowerCase();
  const base = SUBJECT_COLORS[subjectKey] || "gray";

  let bgClass = "";
  let borderClass = "";
  let isDark = false;
  if (tone === "dark") {
    bgClass = `bg-${base}-600`;
    borderClass = `border-${base}-700`;
    isDark = true;
  } else if (tone === "medium") {
    bgClass = `bg-${base}-100`;
    borderClass = `border-${base}-200`;
  } else {
    bgClass = `bg-${base}-50`;
    borderClass = `border-${base}-100`;
  }

  const subtleText = isDark ? "text-white/80" : "text-gray-600";
  const strongText = isDark ? "text-white" : "text-gray-700";
  const badgeBorder = isDark ? "border-white/30 text-white" : "border text-gray-700";

  return (
    <div className={`p-2 rounded-md border ${bgClass} ${borderClass} ${compact ? 'text-[12px]' : ''} ${isDark ? 'text-white' : ''}`}>
      <div className="flex items-center justify-between">
        <div className={`text-sm font-semibold leading-tight ${strongText}`}>{cell.course}</div>
        <div className={`text-xs font-mono ${subtleText}`}>{cell.room}</div>
      </div>
      <div className={`text-xs mt-1 ${subtleText}`}>{cell.faculty}</div>
      <div className="text-xs mt-2 flex items-center gap-2">
        <div className={`px-2 py-0.5 text-[11px] rounded-full ${badgeBorder}`}>{cell.type}</div>
        <div className={`text-[11px] ${subtleText}`}>{cell.batches.join(", ")}</div>
      </div>
    </div>
  );
}

export function TimetableGridMinimal({ grid, title, subtitle, compact = false, tone = "soft" }) {
  return (
    <Card className="shadow-none border">
      <CardContent>
        <div className="mb-4">
          <div className="text-center">
            <div className="inline-block bg-white px-6 py-3 rounded-sm shadow-sm border border-gray-200">
              <div className="text-xl font-semibold">{title || "School / Class"}</div>
              {subtitle ? (
                <div className="mt-1 text-sm text-gray-600">{subtitle}</div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="overflow-auto">
          <table className={`w-full table-fixed border-collapse ${compact ? 'text-[12px]' : ''}`}>
            <thead>
              <tr>
                <th className="w-36 sticky left-0 bg-gray-50 z-10 border p-2 text-gray-700">Time</th>
                {DAYS.map((d) => (
                  <th key={d} className="border p-2 text-left text-gray-700">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot.id}>
                  <td className="sticky left-0 bg-gray-50 z-10 border p-2 align-top text-sm text-gray-700">{slot.label}</td>
                  {DAYS.map((d) => (
                  <td key={`${d}-${slot.id}`} className="border p-2 align-top align-middle" style={{ minWidth: 140 }}>
                      <Cell cell={grid?.[d]?.[slot.id] ?? null} compact={compact} tone={tone} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend and actions removed per request */}
      </CardContent>
    </Card>
  );
}

export default function ConflictFreeTimetableMinimalDesign() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <TimetableGridMinimal grid={EXAMPLE_GRID} title={"Class Timetable"} />
      </div>
    </div>
  );
}
