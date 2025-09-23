import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import { Faculty, Student, Course, Room } from '../../../lib/schemas';

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    await connectDB();

    const { type } = params;
    const body = await request.json();

    if (!['faculty', 'students', 'courses', 'rooms'].includes(type)) {
      return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'faculty':
        result = await Faculty.create({ ...body, createdAt: new Date(), updatedAt: new Date() });
        break;
      case 'students':
        result = await Student.create({ ...body, createdAt: new Date(), updatedAt: new Date() });
        break;
      case 'courses':
        result = await Course.create({ ...body, createdAt: new Date(), updatedAt: new Date() });
        break;
      case 'rooms':
        result = await Room.create({ ...body, createdAt: new Date(), updatedAt: new Date() });
        break;
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Record created successfully', data: result });

  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
