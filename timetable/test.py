from pymongo import MongoClient

client = MongoClient("mongodb+srv://user:user%40123@himanshudhall.huinsh2.mongodb.net/")
db = client["planora"]

# Add a temporary test course to trigger listener
db.courses.insert_one({
    "courseId": "21",
    "courseCode": "21",
    "courseName": "Listener Test Course",
    "department": "Test Dept",
    "credits": 1,
    "semester": "Fall",
    "year": 2025,
    "faculty": "FAC_TEST",
    "description": "Testing listener",
    "prerequisites": [],
    "createdAt": "2025-09-19T17:44:11.312+00:00",
    "updatedAt": "2025-09-19T17:44:11.312+00:00",
    "__v": 0
})
