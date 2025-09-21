# one.py
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from bson.objectid import ObjectId
from collections import defaultdict
from solver import run_solver  # your solver function
import time

# ---------- CONFIG ----------
MONGO_URI = "mongodb+srv://user:user%40123@himanshudhall.huinsh2.mongodb.net/"
DB_NAME = "planora"
WATCHED_COLLECTIONS = ["courses", "students", "faculties", "rooms"]
CHECK_INTERVAL = 5  # seconds if change streams fail
# ----------------------------

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[DB_NAME]

def format_timetable_for_db(sessions):
    """
    Format the solver output into room -> day -> list of {time, faculties, courseId}
    """
    timetable = {}
    for s in sessions:
        if not isinstance(s, dict):
            continue  # safety check
        room = s["roomId"]
        day = s["day"].lower()
        timetable.setdefault(room, {}).setdefault(day, []).append({
            "time": f"{s['startTime']} - {s['endTime']}",
            "faculties": s.get("facultyId", "Unknown"),  # Use facultyId instead of facultiesId
            "courseId": s["courseId"]
        })
    return timetable

def create_or_update_timetable():
    """
    Main function: fetch current DB data, run solver, update timetable collection.
    """
    courses = list(db.courses.find())
    students = list(db.students.find())
    faculties = list(db.faculties.find())
    rooms = list(db.rooms.find())

    print(f"📊 Data loaded: {len(courses)} courses, {len(students)} students, {len(faculties)} faculties, {len(rooms)} rooms")
    
    # Debug: Print sample data structure
    if students:
        print(f"Sample student data: {students[0]}")
    if courses:
        print(f"Sample course data: {courses[0]}")

    if not courses or not students or not faculties or not rooms:
        print("❌ One or more collections are empty. Cannot run solver.")
        return

    # Run solver with DB data
    raw_sessions, validation = run_solver(courses, students, faculties, rooms)
    
    print(f"🔍 Solver returned {len(raw_sessions)} sessions")
    if raw_sessions:
        print(f"Sample session: {raw_sessions[0]}")

    # Format to timetable schema
    formatted = format_timetable_for_db(raw_sessions)

    # Update or create timetable in DB
    timetable_doc = db.timetable.find_one()
    if timetable_doc:
        db.timetable.update_one(
            {"_id": timetable_doc["_id"]},
            {"$set": {"schedule": formatted, "validation": validation}}
        )
        print("✅ Timetable updated.")
    else:
        db.timetable.insert_one({
            "schedule": formatted,
            "validation": validation
        })
        print("✅ Timetable created.")

def watch_collections():
    """
    Watch for changes in the key collections and update timetable automatically.
    """
    try:
        streams = [db[coll].watch(full_document='updateLookup') for coll in WATCHED_COLLECTIONS]
        print("🚀 Change streams started for:", WATCHED_COLLECTIONS)
        create_or_update_timetable()  # initial creation
        while True:
            change_detected = False
            for stream in streams:
                try:
                    change = stream.try_next()
                    if change:
                        change_detected = True
                except Exception as e:
                    print("⚠️ Change stream error:", e)
            if change_detected:
                print("🔄 Change detected. Recomputing timetable...")
                create_or_update_timetable()
            time.sleep(1)
    except ServerSelectionTimeoutError:
        print("❌ Could not start change streams. Falling back to polling...")
        create_or_update_timetable()  # initial run
        while True:
            old_counts = {coll: db[coll].count_documents({}) for coll in WATCHED_COLLECTIONS}
            time.sleep(CHECK_INTERVAL)
            new_counts = {coll: db[coll].count_documents({}) for coll in WATCHED_COLLECTIONS}
            if old_counts != new_counts:
                print("🔄 Change detected via polling. Recomputing timetable...")
                create_or_update_timetable()

if __name__ == "__main__":
    watch_collections()
