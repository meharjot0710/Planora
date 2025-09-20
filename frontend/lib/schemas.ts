import mongoose from 'mongoose';

// Faculty Schema
const facultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  phone: { type: String },
  office: { type: String },
  max_hours_week : { type: Number},
  subjects: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Student Schema
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  batch: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  phone: { type: String },
  address: { type: String },
  courses: [{ type: [String] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Course Schema
const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  department: { type: String, required: true },
  credits: { type: Number, required: true },
  weeklylecture: { type: Number, required:true},
  semester: { type: String, required: true },
  year: { type: Number, required: true },
  faculty: { type: String }, // Faculty ID
  description: { type: String },
  prerequisites: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Room Schema
const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  roomNumber: { type: String, required: true, unique: true },
  building: { type: String, required: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true },
  roomType: { type: String, required: true, enum: ['lecture', 'lab', 'seminar', 'conference', 'other'] },
  facilities: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
export const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);
export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

// Type definitions for TypeScript
export interface FacultyType {
  _id?: string;
  facultyId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone?: string;
  office?: string;
  subjects?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudentType {
  _id?: string;
  studentId: string;
  name: string;
  email: string;
  rollNumber: string;
  batch: string;
  department: string;
  year: number;
  phone?: string;
  address?: string;
  courses?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseType {
  _id?: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  department: string;
  credits: number;
  semester: string;
  year: number;
  faculty?: string;
  description?: string;
  prerequisites?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomType {
  _id?: string;
  roomId: string;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  roomType: 'lecture' | 'lab' | 'seminar' | 'conference' | 'other';
  facilities?: string[];
  isAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
