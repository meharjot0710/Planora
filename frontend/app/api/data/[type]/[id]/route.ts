import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Faculty, Student, Course, Room } from '@/lib/schemas';

export async function PUT(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  try {
    await connectDB();

    const { type, id } = params;
    const body = await request.json();

    if (!['faculty', 'students', 'courses', 'rooms'].includes(type)) {
      return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'faculty':
        result = await Faculty.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true });
        break;
      case 'students':
        result = await Student.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true });
        break;
      case 'courses':
        result = await Course.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true });
        break;
      case 'rooms':
        result = await Room.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true });
        break;
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Record updated successfully', data: result });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
