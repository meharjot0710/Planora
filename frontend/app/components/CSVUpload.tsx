'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Calendar, Building, BookOpen, Users } from 'lucide-react';
import Papa from 'papaparse';

interface TimetableEntry {
  subject: string;
  teacher: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface CSVUploadProps {
  onUpload: (data: TimetableEntry[]) => void;
}

export default function CSVUpload({ onUpload }: CSVUploadProps) {
  const [selectedType, setSelectedType] = useState<'faculty' | 'students' | 'courses' | 'rooms'>('faculty');

  const dataTypes = [
    { key: 'faculty', label: 'Faculty', icon: Users, description: 'Upload faculty information' },
    { key: 'students', label: 'Students', icon: Users, description: 'Upload student information' },
    { key: 'courses', label: 'Courses', icon: BookOpen, description: 'Upload course information' },
    { key: 'rooms', label: 'Rooms', icon: Building, description: 'Upload room information' }
  ] as const;

  const fetchFacultyData = async () => {
    const response = await fetch('/api/data?type=faculty');
    const data = await response.json();
    return data;
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6">
          {/* Data Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Data Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dataTypes.map(({ key, label, icon: Icon, description }) => (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedType === key
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Icon className="h-6 w-6 mb-2" />
                  <div className="font-medium">{label}</div>
                  <div className="text-sm text-gray-500">{description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedType === 'faculty' && (
          <div>
            <h1>Faculty</h1>
          </div>
        )}
        {selectedType === 'students' && 
        <div>
        </div>
        }
        {selectedType === 'courses' && 
        <div>
        </div>
        }
        {selectedType === 'rooms' && 
        <div>
        </div>
        }
      </div>
  );
}
