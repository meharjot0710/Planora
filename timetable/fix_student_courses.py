#!/usr/bin/env python3
"""
Script to fix nested courses arrays in student documents
Run this once to fix existing data in the database
"""

from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

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
        
    except ServerSelectionTimeoutError:
        print("❌ Could not connect to MongoDB")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fix_student_courses()
