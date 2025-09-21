#!/usr/bin/env python3
"""
Comprehensive database fix script
Fixes nested courses arrays and other data issues
"""

from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import json

# MongoDB connection
MONGO_URI = "mongodb+srv://user:user%40123@himanshudhall.huinsh2.mongodb.net/"
DB_NAME = "planora"

def fix_student_courses():
    """Fix nested courses arrays in student documents"""
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client[DB_NAME]
        
        print("🔧 Fixing student courses data...")
        
        # Find all students with nested courses
        students = list(db.students.find())
        fixed_count = 0
        
        for student in students:
            courses = student.get('courses', [])
            if courses and isinstance(courses[0], list):
                # Flatten the nested array
                flat_courses = []
                for course in courses:
                    if isinstance(course, list):
                        flat_courses.extend(course)
                    else:
                        flat_courses.append(course)
                
                # Update the document
                db.students.update_one(
                    {'_id': student['_id']},
                    {'$set': {'courses': flat_courses}}
                )
                
                print(f"✅ Fixed student {student['studentId']}: {courses} -> {flat_courses}")
                fixed_count += 1
        
        print(f"🎉 Fixed {fixed_count} student documents")
        return True
        
    except ServerSelectionTimeoutError:
        print("❌ Could not connect to MongoDB")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def verify_data_structure():
    """Verify the data structure after fixes"""
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client[DB_NAME]
        
        print("\n🔍 Verifying data structure...")
        
        # Check students
        students = list(db.students.find())
        print(f"📊 Found {len(students)} students")
        if students:
            sample_student = students[0]
            print(f"Sample student courses: {sample_student.get('courses', [])}")
            print(f"Type: {type(sample_student.get('courses', []))}")
        
        # Check courses
        courses = list(db.courses.find())
        print(f"📊 Found {len(courses)} courses")
        if courses:
            sample_course = courses[0]
            print(f"Sample course: {sample_course.get('courseId')} - {sample_course.get('courseName')}")
            print(f"Weekly lectures: {sample_course.get('weeklyLectures')}")
        
        # Check faculties
        faculties = list(db.faculties.find())
        print(f"📊 Found {len(faculties)} faculties")
        if faculties:
            sample_faculty = faculties[0]
            print(f"Sample faculty: {sample_faculty.get('facultyId')} - {sample_faculty.get('name')}")
            print(f"Max hours per week: {sample_faculty.get('max_hours_per_week')}")
        
        # Check rooms
        rooms = list(db.rooms.find())
        print(f"📊 Found {len(rooms)} rooms")
        if rooms:
            sample_room = rooms[0]
            print(f"Sample room: {sample_room.get('roomId')} - {sample_room.get('roomNumber')}")
            print(f"Room type: {sample_room.get('roomType')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying data: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Starting database fix process...")
    
    # Fix student courses
    if fix_student_courses():
        print("✅ Student courses fixed successfully")
    else:
        print("❌ Failed to fix student courses")
        return
    
    # Verify data structure
    if verify_data_structure():
        print("✅ Data verification completed")
    else:
        print("❌ Data verification failed")
        return
    
    print("\n🎉 Database fix completed successfully!")
    print("You can now run the timetable solver: python one.py")

if __name__ == "__main__":
    main()
