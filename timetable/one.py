import pathway as pw
from pymongo import MongoClient
from solver import run_solver

# --- CONFIG ---
MONGO_URI = "mongodb+srv://user:user%40123@himanshudhall.huinsh2.mongodb.net/"
DB_NAME = "planora"

# Mongo connection
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# --- Define MongoDB Streams (Pathway Tables) ---
courses = pw.io.mongodb.read(
    uri=MONGO_URI,
    db=DB_NAME,
    collection="courses",
    primary_key="courseId",
    autocommit_duration_ms=1000
)

students = pw.io.mongodb.read(
    uri=MONGO_URI,
    db=DB_NAME,
    collection="students",
    primary_key="studentId",
    autocommit_duration_ms=1000
)

faculty = pw.io.mongodb.read(
    uri=MONGO_URI,
    db=DB_NAME,
    collection="faculty",
    primary_key="facultyId",
    autocommit_duration_ms=1000
)

rooms = pw.io.mongodb.read(
    uri=MONGO_URI,
    db=DB_NAME,
    collection="rooms",
    primary_key="roomId",
    autocommit_duration_ms=1000
)

# Combine tables into one "change signal"
all_changes = pw.union(courses, students, faculty, rooms)

# --- UDF to run solver when any change occurs ---
@pw.udf
def generate_timetable_on_change(*args):
    print("🔄 Change detected in DB, re-running solver...")
    timetable, validation = run_solver()

    # Store result into MongoDB
    db.timetable.delete_many({})
    if timetable:
        db.timetable.insert_many(timetable)
        print(f"✅ Timetable regenerated. {len(timetable)} sessions saved.")
    else:
        print("⚠️ No feasible timetable found.", validation)


# --- Apply UDF ---
_ = all_changes.without(["_id"]).select(
    trigger=generate_timetable_on_change(
        *all_changes.columns()
    )
)

# Start Pathway engine
if __name__ == "__main__":
    print("🚀 Pathway listener started. Watching for changes...")
    pw.run()
