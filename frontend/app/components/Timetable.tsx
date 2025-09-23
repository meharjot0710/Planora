"use client";

import React, { useState, useEffect } from "react";

const SLOTS = [
  { id: "S1", label: "09:00 - 10:00" },
  { id: "S2", label: "10:00 - 11:00" },
  { id: "S3", label: "11:00 - 12:00" },
  { id: "S4", label: "12:00 - 14:00" },
  { id: "S5", label: "14:00 - 15:00" },
  { id: "S6", label: "15:00 - 16:00" },
];

const DAYS = ["mon", "tue", "wed", "thu", "fri"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// Helper function to map time to slot
const getSlotFromTime = (time: string) => {
  const timeMap: { [key: string]: string } = {
    "09:00 - 10:00": "S1",
    "10:00 - 11:00": "S2", 
    "11:00 - 12:00": "S3",
    "12:00 - 14:00": "S4",
    "14:00 - 15:00": "S5",
    "15:00 - 16:00": "S6"
  };
  return timeMap[time] || null;
};

// Transform MongoDB data to component format
const transformScheduleData = (scheduleData: any, filterType: string = 'all', filterValue: string = '') => {
  const transformedGrid: any = {};
  
  // Initialize all days
  DAYS.forEach(day => {
    transformedGrid[day] = {};
    SLOTS.forEach(slot => {
      transformedGrid[day][slot.id] = null;
    });
  });

  // Fill in the actual schedule data
  if (scheduleData) {
    Object.keys(scheduleData).forEach(roomId => {
      const roomSchedule = scheduleData[roomId];
      
      // Apply room filter
      if (filterType === 'room' && filterValue && roomId !== filterValue) {
        return;
      }
      
      Object.keys(roomSchedule).forEach(day => {
        if (transformedGrid[day]) {
          roomSchedule[day].forEach((slot: any) => {
            const slotId = getSlotFromTime(slot.time);
            const facultyName = slot.faculty?.name || slot.faculties;
            
            // Apply faculty filter
            if (filterType === 'faculty' && filterValue && facultyName !== filterValue) {
              return;
            }
            
            if (slotId && transformedGrid[day][slotId] === null) {
              transformedGrid[day][slotId] = {
                course: slot.course?.courseName || slot.courseId,
                faculty: facultyName,
                room: roomId,
                type: "Lecture",
                batches: ["B1"]
              };
            }
          });
        }
      });
    });
  }

  return transformedGrid;
};

function Cell({ cell, compact = false, tone = "soft" }: { cell: any; compact?: boolean; tone?: string }) {
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
  const base = (SUBJECT_COLORS as any)[subjectKey] || "gray";

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

export function TimetableGridMinimal({ grid, title, subtitle, compact = false, tone = "soft" }: { grid: any; title?: string; subtitle?: string; compact?: boolean; tone?: string }) {
  return (
    <div className="bg-white shadow-none border rounded-lg">
      <div className="p-6">
        <div className="mb-4">
          <div className="text-center">
            <div className="inline-block bg-white px-6 py-3 rounded-sm shadow-sm border border-gray-200">
              <div className="text-xl text-black font-semibold">{title || "School / Class"}</div>
            </div>
          </div>
        </div>

        <div className="overflow-auto">
          <table className={`w-full table-fixed border-collapse ${compact ? 'text-[12px]' : ''}`}>
            <thead>
              <tr>
                <th className="w-36 sticky left-0 bg-gray-50 z-10 border p-2 text-gray-700">Time</th>
                {DAY_LABELS.map((d, index) => (
                  <th key={d} className="border p-2 text-left text-gray-700">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot.id}>
                  <td className="sticky left-0 bg-gray-50 z-10 border p-2 align-top text-sm text-gray-700">{slot.label}</td>
                  {DAYS.map((d, index) => (
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
      </div>
    </div>
  );
}

export default function ConflictFreeTimetableMinimalDesign() {
  const [timetableData, setTimetableData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'room' | 'faculty'>('all');
  const [filterValue, setFilterValue] = useState<string>('');
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [availableFaculties, setAvailableFaculties] = useState<string[]>([]);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/timetable');
        const result = await response.json();
        
        if (response.ok) {
          setTimetableData(result.data);
          
          // Extract available rooms and faculties for filtering
          if (result.data && result.data.schedule) {
            const rooms = Object.keys(result.data.schedule);
            setAvailableRooms(rooms);
            
            const faculties = new Set<string>();
            Object.values(result.data.schedule).forEach((roomSchedule: any) => {
              Object.values(roomSchedule).forEach((daySlots: any) => {
                daySlots.forEach((slot: any) => {
                  if (slot.faculty && slot.faculty.name) {
                    faculties.add(slot.faculty.name);
                  } else if (slot.faculties) {
                    faculties.add(slot.faculties);
                  }
                });
              });
            });
            setAvailableFaculties(Array.from(faculties));
          }
        } else {
          setError(result.error || 'Failed to fetch timetable');
        }
      } catch (err) {
        setError('Failed to fetch timetable');
        console.error('Error fetching timetable:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading timetable...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!timetableData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-500">No timetable data available</p>
          </div>
        </div>
      </div>
    );
  }

  const transformedGrid = transformScheduleData(timetableData.schedule, filterType, filterValue);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Filter Controls */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by:</label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as 'all' | 'room' | 'faculty');
                  setFilterValue('');
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="room">Room</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            {filterType === 'room' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Room:</label>
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="px-3 py-2 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a room</option>
                  {availableRooms.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </div>
            )}

            {filterType === 'faculty' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Faculty:</label>
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="px-3 py-2 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a faculty</option>
                  {availableFaculties.map(faculty => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>
            )}

            {(filterType === 'room' || filterType === 'faculty') && filterValue && (
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterValue('');
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        <TimetableGridMinimal 
          grid={transformedGrid} 
          title={filterType === 'all' ? "Class Timetable" : 
                 filterType === 'room' ? `Timetable for Room: ${filterValue}` :
                 `Timetable for Faculty: ${filterValue}`}
          subtitle={`Last updated: ${new Date(timetableData.updatedAt).toLocaleDateString()}`}
        />
      </div>
    </div>
  );
}
