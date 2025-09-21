'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedData, setUploadedData] = useState<TimetableEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      handleFileUpload(csvFile);
    } else {
      setUploadStatus('error');
      setErrorMessage('Please upload a CSV file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadStatus('uploading');
    setErrorMessage('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as any[];
          
          const requiredFields = ['subject', 'teacher', 'room', 'day', 'startTime', 'endTime'];
          const hasRequiredFields = requiredFields.every(field => 
            data.length > 0 && data[0].hasOwnProperty(field)
          );

          if (!hasRequiredFields) {
            throw new Error(`CSV must contain the following columns: ${requiredFields.join(', ')}`);
          }

          const validData: TimetableEntry[] = data.map((row, index) => {
            if (!row.subject || !row.teacher || !row.room || !row.day || !row.startTime || !row.endTime) {
              throw new Error(`Row ${index + 2} is missing required data`);
            }
            return {
              subject: row.subject.trim(),
              teacher: row.teacher.trim(),
              room: row.room.trim(),
              day: row.day.trim(),
              startTime: row.startTime.trim(),
              endTime: row.endTime.trim()
            };
          });

          setUploadedData(validData);
          setUploadStatus('success');
          onUpload(validData);
        } catch (error) {
          setUploadStatus('error');
          setErrorMessage(error instanceof Error ? error.message : 'Failed to parse CSV file');
        }
      },
      error: (error) => {
        setUploadStatus('error');
        setErrorMessage(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      {
        subject: 'Mathematics',
        teacher: 'Mr. Smith',
        room: 'Room 101',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00'
      },
      {
        subject: 'English Literature',
        teacher: 'Ms. Johnson',
        room: 'Room 102',
        day: 'Monday',
        startTime: '10:15',
        endTime: '11:15'
      },
      {
        subject: 'Physics',
        teacher: 'Dr. Brown',
        room: 'Lab 201',
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '10:00'
      }
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'timetable_sample.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setErrorMessage('');
    setUploadedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Upload className="h-6 w-6 text-gray-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Upload Timetable CSV</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">CSV Format Requirements</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your CSV file must contain the following columns: subject, teacher, room, day, startTime, endTime
            </p>
            <button
              onClick={downloadSampleCSV}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample CSV
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : uploadStatus === 'success'
                ? 'border-green-400 bg-green-50'
                : uploadStatus === 'error'
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {uploadStatus === 'idle' && (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <p className="text-lg font-medium text-gray-900">
                    Upload your timetable CSV file
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Choose File
                  </button>
                </div>
              </div>
            )}

            {uploadStatus === 'uploading' && (
              <div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-lg font-medium text-gray-900">Processing CSV file...</p>
                <p className="text-sm text-gray-600 mt-2">Please wait while we parse your data</p>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <p className="mt-4 text-lg font-medium text-green-900">
                  CSV uploaded successfully!
                </p>
                <p className="text-sm text-green-600 mt-2">
                  {uploadedData.length} timetable entries processed
                </p>
                <button
                  onClick={resetUpload}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Upload Another File
                </button>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div>
                <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <p className="mt-4 text-lg font-medium text-red-900">
                  Upload failed
                </p>
                <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                <button
                  onClick={resetUpload}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {uploadedData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Data Preview</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadedData.slice(0, 10).map((entry, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {entry.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.teacher}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.room}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.day}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.startTime} - {entry.endTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {uploadedData.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Showing first 10 entries of {uploadedData.length} total
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
