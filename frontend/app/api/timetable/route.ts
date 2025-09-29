import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Course, Faculty } from '@/lib/schemas';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();

    // Access the timetable collection directly
    const db = mongoose.connection.db;
    const timetableCollection = db.collection('timetable');
    
    // Fetch the latest timetable
    const timetable = await timetableCollection.findOne();
    console.log("timetable",timetable);
    
    if (!timetable) {
      return NextResponse.json({ 
        data: null, 
        message: 'No timetable found' 
      });
    }

    // The schedule is already a regular object, not a Map
    const scheduleObj = timetable.schedule || {};

    // Fetch course and faculty details for enrichment
    const courseIds = new Set<string>();
    const facultyIds = new Set<string>();
    
    // Extract all course and faculty IDs from the schedule
    for (const roomId in scheduleObj) {
      for (const day in scheduleObj[roomId]) {
        for (const slot of scheduleObj[roomId][day]) {
          courseIds.add(slot.courseId);
          facultyIds.add(slot.faculties);
        }
      }
    }

    // Fetch course and faculty details
    const courses = await Course.find({ courseId: { $in: Array.from(courseIds) } });
    const faculties = await Faculty.find({ facultyId: { $in: Array.from(facultyIds) } });

    // Create lookup maps
    const courseMap = new Map(courses.map(c => [c.courseId, c]));
    const facultyMap = new Map(faculties.map(f => [f.facultyId, f]));

    // Enrich the schedule with course and faculty details
    const enrichedSchedule: Record<string, Record<string, Array<{
      time: string;
      faculties: string;
      courseId: string;
      course?: typeof Course;
      faculty?: typeof Faculty;
    }>>> = {};
    for (const roomId in scheduleObj) {
      enrichedSchedule[roomId] = {};
      for (const day in scheduleObj[roomId]) {
        enrichedSchedule[roomId][day] = scheduleObj[roomId][day].map((slot: { time: string; faculties: string; courseId: string }) => ({
          ...slot,
          course: courseMap.get(slot.courseId),
          faculty: facultyMap.get(slot.faculties)
        }));
      }
    }
    console.log("enrichedSchedule",enrichedSchedule);
    return NextResponse.json({
      data: {
        _id: timetable._id,
        schedule: enrichedSchedule,
        validation: timetable.validation || {},
        createdAt: timetable.createdAt,
        updatedAt: timetable.updatedAt
      }
    });

  } catch (error) {
    console.error('Timetable fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
