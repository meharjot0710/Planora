'use client';

import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, Users, Building, BookOpen, GraduationCap } from 'lucide-react';
import { FacultyType, StudentType, CourseType, RoomType } from '../../lib/schemas';

interface DataViewerProps {
  onDataChange?: () => void;
}

type DataType = 'faculty' | 'students' | 'courses' | 'rooms';

export default function DataViewer({ onDataChange }: DataViewerProps) {
  const [selectedType, setSelectedType] = useState<DataType>('faculty');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState<any>({});

  const dataTypes = [
    { key: 'faculty', label: 'Faculty', icon: Users, color: 'blue' },
    { key: 'students', label: 'Students', icon: GraduationCap, color: 'green' },
    { key: 'courses', label: 'Courses', icon: BookOpen, color: 'purple' },
    { key: 'rooms', label: 'Rooms', icon: Building, color: 'orange' }
  ] as const;

  const fetchData = async (type: DataType) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/data?type=${type}&limit=100`);
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedType);
  }, [selectedType]);

  const handleEdit = (record: any) => {
    setEditingId(record._id);
    setEditingData({ ...record });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/data/${selectedType}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData)
      });

      if (response.ok) {
        setEditingId(null);
        setEditingData({});
        fetchData(selectedType);
        onDataChange?.();
      }
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`/api/data?type=${selectedType}&id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData(selectedType);
        onDataChange?.();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`/api/data/${selectedType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });

      if (response.ok) {
        setNewRecord({});
        setShowAddForm(false);
        fetchData(selectedType);
        onDataChange?.();
      }
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  const getColumns = () => {
    switch (selectedType) {
      case 'faculty':
        return [
          { key: 'facultyId', label: 'Faculty ID', editable: true },
          { key: 'name', label: 'Name', editable: true },
          { key: 'email', label: 'Email', editable: true },
          { key: 'department', label: 'Department', editable: true },
          { key: 'designation', label: 'Designation', editable: true },
          { key: 'phone', label: 'Phone', editable: true },
          { key: 'office', label: 'Office', editable: true },
          { key: 'subjects', label: 'Subjects', editable: true, type: 'array' }
        ];
      case 'students':
        return [
          { key: 'studentId', label: 'Student ID', editable: true },
          { key: 'name', label: 'Name', editable: true },
          { key: 'email', label: 'Email', editable: true },
          { key: 'rollNumber', label: 'Roll Number', editable: true },
          { key: 'batch', label: 'Batch', editable: true },
          { key: 'department', label: 'Department', editable: true },
          { key: 'year', label: 'Year', editable: true, type: 'number' },
          { key: 'phone', label: 'Phone', editable: true },
          { key: 'courses', label: 'Courses', editable: true, type: 'array' }
        ];
      case 'courses':
        return [
          { key: 'courseId', label: 'Course ID', editable: true },
          { key: 'courseCode', label: 'Course Code', editable: true },
          { key: 'courseName', label: 'Course Name', editable: true },
          { key: 'department', label: 'Department', editable: true },
          { key: 'credits', label: 'Credits', editable: true, type: 'number' },
          { key: 'weeklylecture', label: 'Weekly Lectures', editable: true, type: 'number' },
          { key: 'semester', label: 'Semester', editable: true },
          { key: 'year', label: 'Year', editable: true, type: 'number' },
          { key: 'faculty', label: 'Faculty', editable: true },
          { key: 'description', label: 'Description', editable: true }
        ];
      case 'rooms':
        return [
          { key: 'roomId', label: 'Room ID', editable: true },
          { key: 'roomNumber', label: 'Room Number', editable: true },
          { key: 'building', label: 'Building', editable: true },
          { key: 'floor', label: 'Floor', editable: true, type: 'number' },
          { key: 'capacity', label: 'Capacity', editable: true, type: 'number' },
          { key: 'roomType', label: 'Room Type', editable: true, type: 'select', options: ['lecture', 'lab', 'seminar', 'conference', 'other'] },
          { key: 'facilities', label: 'Facilities', editable: true, type: 'array' },
          { key: 'isAvailable', label: 'Available', editable: true, type: 'boolean' }
        ];
      default:
        return [];
    }
  };

  const renderCell = (record: any, column: any) => {
    const isEditing = editingId === record._id;
    const value = record[column.key];

    if (isEditing && column.editable) {
      if (column.type === 'array') {
        return (
          <input
            type="text"
            value={Array.isArray(value) ? value.join(', ') : value || ''}
            onChange={(e) => setEditingData({
              ...editingData,
              [column.key]: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            })}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        );
      } else if (column.type === 'boolean') {
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => setEditingData({
              ...editingData,
              [column.key]: e.target.checked
            })}
            className="w-4 h-4"
          />
        );
      } else if (column.type === 'select') {
        return (
          <select
            value={value || ''}
            onChange={(e) => setEditingData({
              ...editingData,
              [column.key]: e.target.value
            })}
            className="w-full px-2 py-1 border rounded text-sm"
          >
            {column.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      } else {
        return (
          <input
            type={column.type || 'text'}
            value={value || ''}
            onChange={(e) => setEditingData({
              ...editingData,
              [column.key]: column.type === 'number' ? Number(e.target.value) : e.target.value
            })}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        );
      }
    }

    if (column.type === 'array' && Array.isArray(value)) {
      return value.join(', ');
    } else if (column.type === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return value || '-';
  };

  const renderAddForm = () => {
    const columns = getColumns();
    return (
      <div className="bg-gray-50 p-4 border rounded-lg mb-4">
        <h3 className="text-lg font-medium mb-4">Add New {dataTypes.find(t => t.key === selectedType)?.label}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {columns.map(column => (
            <div key={column.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {column.label}
              </label>
              {column.type === 'array' ? (
                <input
                  type="text"
                  value={Array.isArray(newRecord[column.key]) ? newRecord[column.key].join(', ') : newRecord[column.key] || ''}
                  onChange={(e) => setNewRecord({
                    ...newRecord,
                    [column.key]: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder={`Enter ${column.label.toLowerCase()}`}
                />
              ) : column.type === 'boolean' ? (
                <input
                  type="checkbox"
                  checked={newRecord[column.key] || false}
                  onChange={(e) => setNewRecord({
                    ...newRecord,
                    [column.key]: e.target.checked
                  })}
                  className="w-4 h-4"
                />
              ) : column.type === 'select' ? (
                <select
                  value={newRecord[column.key] || ''}
                  onChange={(e) => setNewRecord({
                    ...newRecord,
                    [column.key]: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select {column.label}</option>
                  {column.options?.map((option: string) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={column.type || 'text'}
                  value={newRecord[column.key] || ''}
                  onChange={(e) => setNewRecord({
                    ...newRecord,
                    [column.key]: column.type === 'number' ? Number(e.target.value) : e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder={`Enter ${column.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Add Record
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Management</h2>
        <p className="text-gray-600">View and edit faculty, students, courses, and room data</p>
      </div>

      {/* Data Type Selection */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataTypes.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                selectedType === key
                  ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Icon className="h-6 w-6 mb-2" />
              <div className="font-medium">{label}</div>
              <div className="text-sm text-gray-500">{data.length} records</div>
            </button>
          ))}
        </div>
      </div>

      {/* Add New Record Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New {dataTypes.find(t => t.key === selectedType)?.label}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && renderAddForm()}

      {/* Data Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {dataTypes.find(t => t.key === selectedType)?.label} ({data.length} records)
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {getColumns().map(column => (
                    <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((record, index) => (
                  <tr key={record._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {getColumns().map(column => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {renderCell(record, column)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === record._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
