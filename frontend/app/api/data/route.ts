import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import { Faculty, Student, Course, Room } from '../../../lib/schemas';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (!type || !['faculty', 'students', 'courses', 'rooms'].includes(type)) {
      return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    let data;
    let total;

    switch (type) {
      case 'faculty':
        data = await Faculty.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        total = await Faculty.countDocuments();
        break;
      case 'students':
        data = await Student.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        total = await Student.countDocuments();
        break;
      case 'courses':
        data = await Course.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        total = await Course.countDocuments();
        break;
      case 'rooms':
        data = await Room.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        total = await Room.countDocuments();
        break;
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Data fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !['faculty', 'students', 'courses', 'rooms'].includes(type)) {
      return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'faculty':
        result = await Faculty.findByIdAndDelete(id);
        break;
      case 'students':
        result = await Student.findByIdAndDelete(id);
        break;
      case 'courses':
        result = await Course.findByIdAndDelete(id);
        break;
      case 'rooms':
        result = await Room.findByIdAndDelete(id);
        break;
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Record deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
