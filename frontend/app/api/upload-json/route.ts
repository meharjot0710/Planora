import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Faculty, Student, Course, Room } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || !['faculty', 'students', 'courses', 'rooms'].includes(type)) {
      return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    // Read and parse the JSON file
    const text = await file.text();
    let jsonData;
    
    try {
      jsonData = JSON.parse(text);
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    // Convert single object to array if needed
    if (!Array.isArray(jsonData)) {
      // Check if it's a valid object
      if (typeof jsonData !== 'object' || jsonData === null) {
        return NextResponse.json({ error: 'JSON data must be an object or array of objects' }, { status: 400 });
      }
      jsonData = [jsonData];
    }

    // Validate that all items in the array are objects
    if (!jsonData.every(item => typeof item === 'object' && item !== null)) {
      return NextResponse.json({ error: 'All items in the JSON array must be objects' }, { status: 400 });
    }

    let count = 0;
    const errors: string[] = [];

    // Process data based on type
    switch (type) {
      case 'faculty':
        for (const item of jsonData) {
          try {
            // Check if faculty already exists
            const existingFaculty = await Faculty.findOne({ 
              $or: [
                { facultyId: item.facultyId },
                { email: item.email }
              ]
            });

            if (existingFaculty) {
              // Update existing faculty
              await Faculty.updateOne(
                { _id: existingFaculty._id },
                { ...item, updatedAt: new Date() }
              );
            } else {
              // Create new faculty
              await Faculty.create(item);
            }
            count++;
          } catch (error) {
            console.error('Faculty creation error:', error);
            errors.push(`Faculty ${item.facultyId || item.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        break;

      case 'students':
        for (const item of jsonData) {
          try {
            // Check if student already exists
            const existingStudent = await Student.findOne({ 
              $or: [
                { studentId: item.studentId },
                { email: item.email },
                { rollNumber: item.rollNumber }
              ]
            });

            if (existingStudent) {
              // Update existing student
              await Student.updateOne(
                { _id: existingStudent._id },
                { ...item, updatedAt: new Date() }
              );
            } else {
              // Create new student
              await Student.create(item);
            }
            count++;
          } catch (error) {
            console.error('Student creation error:', error);
            errors.push(`Student ${item.studentId || item.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        break;

      case 'courses':
        for (const item of jsonData) {
          try {
            // Check if course already exists
            const existingCourse = await Course.findOne({ 
              $or: [
                { courseId: item.courseId },
                { courseCode: item.courseCode }
              ]
            });

            if (existingCourse) {
              // Update existing course
              await Course.updateOne(
                { _id: existingCourse._id },
                { ...item, updatedAt: new Date() }
              );
            } else {
              // Create new course
              await Course.create(item);
            }
            count++;
          } catch (error) {
            console.error('Course creation error:', error);
            errors.push(`Course ${item.courseId || item.courseName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        break;

      case 'rooms':
        for (const item of jsonData) {
          try {
            // Check if room already exists
            const existingRoom = await Room.findOne({ 
              $or: [
                { roomId: item.roomId },
                { roomNumber: item.roomNumber }
              ]
            });

            if (existingRoom) {
              // Update existing room
              await Room.updateOne(
                { _id: existingRoom._id },
                { ...item, updatedAt: new Date() }
              );
            } else {
              // Create new room
              await Room.create(item);
            }
            count++;
          } catch (error) {
            console.error('Room creation error:', error);
            errors.push(`Room ${item.roomId || item.roomNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    // Prepare response
    const response: {
      message: string;
      count: number;
      type: string;
      errors?: string[];
    } = {
      message: `Successfully processed ${count} ${type} records`,
      count,
      type
    };

    if (errors.length > 0) {
      response.errors = errors;
      response.message += ` (${errors.length} errors occurred)`;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'JSON upload endpoint' });
}
