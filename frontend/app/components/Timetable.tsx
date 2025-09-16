'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

interface TimetableEntry {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface TimetableProps {
  role: 'teacher' | 'user';
  userId?: string;
}

const sampleTimetable: TimetableEntry[] = [
  {
    id: '1',
    subject: 'Mathematics',
    teacher: 'Mr. Smith',
    room: 'Room 101',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    subject: 'English Literature',
    teacher: 'Ms. Johnson',
    room: 'Room 102',
    day: 'Monday',
    startTime: '10:15',
    endTime: '11:15',
    color: 'bg-green-500'
  },
  {
    id: '3',
    subject: 'Physics',
    teacher: 'Dr. Brown',
    room: 'Lab 201',
    day: 'Monday',
    startTime: '11:30',
    endTime: '12:30',
    color: 'bg-purple-500'
  },
  {
    id: '4',
    subject: 'History',
    teacher: 'Prof. Davis',
    room: 'Room 103',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:00',
    color: 'bg-yellow-500'
  },
  {
    id: '5',
    subject: 'Chemistry',
    teacher: 'Dr. Wilson',
    room: 'Lab 202',
    day: 'Tuesday',
    startTime: '10:15',
    endTime: '11:15',
    color: 'bg-red-500'
  },
  {
    id: '6',
    subject: 'Physical Education',
    teacher: 'Coach Taylor',
    room: 'Gymnasium',
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '10:00',
    color: 'bg-orange-500'
  },
  {
    id: '7',
    subject: 'Computer Science',
    teacher: 'Ms. Garcia',
    room: 'Computer Lab',
    day: 'Wednesday',
    startTime: '10:15',
    endTime: '11:15',
    color: 'bg-indigo-500'
  },
  {
    id: '8',
    subject: 'Art',
    teacher: 'Ms. Martinez',
    room: 'Art Studio',
    day: 'Thursday',
    startTime: '09:00',
    endTime: '10:00',
    color: 'bg-pink-500'
  },
  {
    id: '9',
    subject: 'Biology',
    teacher: 'Dr. Anderson',
    room: 'Lab 203',
    day: 'Thursday',
    startTime: '10:15',
    endTime: '11:15',
    color: 'bg-teal-500'
  },
  {
    id: '10',
    subject: 'Geography',
    teacher: 'Mr. Thompson',
    room: 'Room 104',
    day: 'Friday',
    startTime: '09:00',
    endTime: '10:00',
    color: 'bg-cyan-500'
  }
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45',
  '16:00'
];

export default function Timetable({ role, userId }: TimetableProps) {
  const [timetable, setTimetable] = useState<TimetableEntry[]>(sampleTimetable);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const getTimetableForDay = (day: string) => {
    return timetable.filter(entry => entry.day === day);
  };

  const getTimetableForRole = () => {
    if (role === 'teacher') {
      // Filter by teacher name (in a real app, this would be based on logged-in teacher)
      return timetable.filter(entry => entry.teacher === 'Mr. Smith');
    }
    return timetable; // For students, show all classes
  };

  const filteredTimetable = viewMode === 'day' ? getTimetableForDay(selectedDay) : getTimetableForRole();

  const getTimeSlotPosition = (time: string) => {
    const timeIndex = timeSlots.indexOf(time);
    return timeIndex * 4; // Each time slot is 4rem (64px) high
  };

  const getDuration = (startTime: string, endTime: string) => {
    const startIndex = timeSlots.indexOf(startTime);
    const endIndex = timeSlots.indexOf(endTime);
    return (endIndex - startIndex) * 4; // Height in rem
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-gray-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">
                {role === 'teacher' ? 'My Teaching Schedule' : 'My Class Schedule'}
              </h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === 'week'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Week View
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === 'day'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Day View
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'day' && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    selectedDay === day
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-6">
          {viewMode === 'week' ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {days.map((day) => {
                const dayTimetable = getTimetableForDay(day);
                return (
                  <div key={day} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                      {day}
                    </h3>
                    <div className="space-y-3">
                      {dayTimetable.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center">No classes</p>
                      ) : (
                        dayTimetable.map((entry) => (
                          <div
                            key={entry.id}
                            className={`${entry.color} text-white p-3 rounded-lg shadow-sm`}
                          >
                            <div className="font-medium text-sm">{entry.subject}</div>
                            <div className="text-xs opacity-90 mt-1">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {entry.startTime} - {entry.endTime}
                              </div>
                              <div className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {entry.room}
                              </div>
                              {role === 'user' && (
                                <div className="flex items-center mt-1">
                                  <User className="h-3 w-3 mr-1" />
                                  {entry.teacher}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDay} Schedule
              </h3>
              {filteredTimetable.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No classes scheduled for {selectedDay}</p>
              ) : (
                <div className="space-y-3">
                  {filteredTimetable.map((entry) => (
                    <div
                      key={entry.id}
                      className={`${entry.color} text-white p-4 rounded-lg shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-lg">{entry.subject}</div>
                        <div className="text-sm opacity-90">
                          {entry.startTime} - {entry.endTime}
                        </div>
                      </div>
                      <div className="mt-2 text-sm opacity-90">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {entry.room}
                        </div>
                        {role === 'user' && (
                          <div className="flex items-center mt-1">
                            <User className="h-4 w-4 mr-2" />
                            {entry.teacher}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
