'use client';

import { useState } from 'react';
import { Upload, FileText, Users, BookOpen, Building, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadResult {
  success: boolean;
  message: string;
  count?: number;
}

export default function JSONUpload() {
  const [selectedType, setSelectedType] = useState<'faculty' | 'students' | 'courses' | 'rooms'>('faculty');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const dataTypes = [
    { key: 'faculty', label: 'Faculty', icon: Users, description: 'Upload faculty information' },
    { key: 'students', label: 'Students', icon: Users, description: 'Upload student information' },
    { key: 'courses', label: 'Courses', icon: BookOpen, description: 'Upload course information' },
    { key: 'rooms', label: 'Rooms', icon: Building, description: 'Upload room information' }
  ] as const;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', selectedType);

      const response = await fetch('/api/upload-json', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: result.message,
          count: result.count
        });
      } else {
        setUploadResult({
          success: false,
          message: result.error || 'Upload failed'
        });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Network error occurred during upload'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const getSampleJSON = () => {
    const samples = {
      faculty: [
        {
          facultyId: "FAC001",
          name: "Dr. John Smith",
          email: "john.smith@university.edu",
          department: "Computer Science",
          designation: "Professor",
          phone: "+1-555-0123",
          office: "CS-101",
          subjects: ["Data Structures", "Algorithms"]
        }
      ],
      students: [
        {
          studentId: "STU001",
          name: "Alice Johnson",
          email: "alice.johnson@student.university.edu",
          rollNumber: "CS2024001",
          batch: "2024",
          department: "Computer Science",
          year: 1,
          phone: "+1-555-0124",
          address: "123 University Ave",
          courses: ["CS101", "CS102"]
        }
      ],
      courses: [
        {
          courseId: "CS101",
          courseCode: "CS101",
          courseName: "Introduction to Programming",
          department: "Computer Science",
          credits: 3,
          semester: "Fall",
          year: 2024,
          faculty: "FAC001",
          description: "Basic programming concepts",
          prerequisites: []
        }
      ],
      rooms: [
        {
          roomId: "ROOM001",
          roomNumber: "CS-101",
          building: "Computer Science Building",
          floor: 1,
          capacity: 50,
          roomType: "lecture",
          facilities: ["Projector", "Whiteboard", "Air Conditioning"],
          isAvailable: true
        }
      ]
    };

    return samples[selectedType];
  };

  const downloadSample = () => {
    const sampleData = getSampleJSON();
    const dataStr = JSON.stringify(sampleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedType}-sample.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadSingleSample = () => {
    const sampleData = getSampleJSON();
    const singleItem = sampleData[0]; // Get the first item for single object sample
    const dataStr = JSON.stringify(singleItem, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedType}-single-sample.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Upload JSON Data</h2>
          <p className="text-gray-600 mt-1">
            Upload JSON files for faculty, students, courses, and rooms to store in the database.
          </p>
        </div>

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

          {/* Sample Download */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">Need a sample format?</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Download a sample JSON file to see the expected format for {selectedType}.
                  <br />
                  <span className="font-medium">Note:</span> You can upload either a single object or an array of objects.
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={downloadSample}
                  className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Array Sample
                </button>
                <button
                  onClick={downloadSingleSample}
                  className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Single Sample
                </button>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".json"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            
            <div className="space-y-4">
              <Upload className={`mx-auto h-12 w-12 ${dragActive ? 'text-red-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isUploading ? 'Uploading...' : 'Drop your JSON file here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse and select a file
                </p>
              </div>
              <div className="text-xs text-gray-400">
                Only .json files are accepted
              </div>
            </div>
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              uploadResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {uploadResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                )}
                <div>
                  <p className={`text-sm font-medium ${
                    uploadResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {uploadResult.message}
                  </p>
                  {uploadResult.count && (
                    <p className="text-sm text-green-600 mt-1">
                      {uploadResult.count} records uploaded successfully
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isUploading && (
            <div className="mt-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-3 text-sm text-gray-600">Processing your file...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
