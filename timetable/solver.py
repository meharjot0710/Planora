# solver.py
from collections import defaultdict
from ortools.sat.python import cp_model

MAX_SECONDS = 30
NUM_WORKERS = 8

# def run_solver(courses, students, faculty, rooms):
#     """
#     Build timetable from data using CP-SAT solver.
#     Returns:
#         timetable: dict -> roomId -> day -> list of sessions [{start, end, faculty, course}]
#         validation: dict -> errors, warnings
#     """

#     # ---------- Normalize keys ----------
#     courses_map = {c.get("courseId", c.get("course_id")): c for c in courses}
#     rooms_map = {r.get("roomId", r.get("room_id")): r for r in rooms}
#     students_map = {s.get("studentId", s.get("student_id")): s for s in students}
#     faculty_map = {f.get("facultyId", f.get("faculty_id")): f for f in faculty}

#     course_ids = list(courses_map.keys())
#     room_ids = list(rooms_map.keys())
#     student_ids = list(students_map.keys())
#     faculty_ids = list(faculty_map.keys())

#     # ---------- Timeslots ----------
#     timeslots = [
#         "Mon-09:00", "Mon-10:00", "Mon-11:00", "Mon-12:00", "Mon-14:00", "Mon-15:00", "Mon-16:00",
#         "Tue-09:00", "Tue-10:00", "Tue-11:00", "Tue-12:00", "Tue-14:00", "Tue-15:00", "Tue-16:00",
#         "Wed-09:00", "Wed-10:00", "Wed-11:00", "Wed-12:00", "Wed-14:00", "Wed-15:00", "Wed-16:00",
#         "Thu-09:00", "Thu-10:00", "Thu-11:00", "Thu-12:00", "Thu-14:00", "Thu-15:00", "Thu-16:00",
#         "Fri-09:00", "Fri-10:00", "Fri-11:00", "Fri-12:00", "Fri-14:00", "Fri-15:00", "Fri-16:00"
#     ]

#     # ---------- Model ----------
#     model = cp_model.CpModel()

#     # z[c,t,r]: course c in timeslot t at room r
#     z = {}
#     for c in course_ids:
#         ctype = courses_map[c].get("type", "lecture")
#         for t in timeslots:
#             for r in room_ids:
#                 r_type = rooms_map[r].get("type", "lecture")
#                 if (ctype == "lab" and r_type != "lab") or (ctype == "lecture" and r_type == "lab"):
#                     continue
#                 z[(c, t, r)] = model.NewBoolVar(f"z_{c}_{t}_{r}")

#     # a[s,c,t,r]: student s attends course c at t,r
#     a = {}
#     for s in student_ids:
#         for c in students_map[s].get("courses", []):
#             if c not in course_ids:
#                 continue
#             for t in timeslots:
#                 for r in room_ids:
#                     if (c, t, r) in z:
#                         a[(s, c, t, r)] = model.NewBoolVar(f"a_{s}_{c}_{t}_{r}")

#     # ---------- Constraints ----------

#     # 1) Each student must attend exact weekly_lectures
#     for s in student_ids:
#         for c in students_map[s].get("courses", []):
#             if c not in course_ids:
#                 continue
#             needed = courses_map[c].get("weekly_lectures", 1)
#             vars_sc = [a[(ss, cc, t, r)] for (ss, cc, t, r) in a if ss == s and cc == c]
#             if vars_sc:
#                 model.Add(sum(vars_sc) == needed)

#     # 2) Student can attend a session only if session exists
#     for (s, c, t, r), var in a.items():
#         model.Add(var <= z[(c, t, r)])

#     # 3) Room capacity
#     for (c, t, r), zvar in z.items():
#         session_students = [a[(s, c, t, r)] for s in student_ids if (s, c, t, r) in a]
#         if session_students:
#             cap = rooms_map[r].get("capacity", 9999)
#             model.Add(sum(session_students) <= cap * zvar)

#     # 4) One course per room per timeslot
#     for t in timeslots:
#         for r in room_ids:
#             vars_room_slot = [z[(c, t, r)] for c in course_ids if (c, t, r) in z]
#             if vars_room_slot:
#                 model.Add(sum(vars_room_slot) <= 1)

#     # 5) Student cannot attend two courses at same time
#     for s in student_ids:
#         for t in timeslots:
#             vars_student_slot = [a[(ss, c, tt, r)] for (ss, c, tt, r) in a if ss == s and tt == t]
#             if vars_student_slot:
#                 model.Add(sum(vars_student_slot) <= 1)

#     # 6) Faculty cannot teach two sessions at same timeslot and max hours/week
#     course_faculty = {}
#     faculty_courses = defaultdict(list)
#     for c in course_ids:
#         f = courses_map[c].get("faculty")
#         course_faculty[c] = f
#         if f:
#             faculty_courses[f].append(c)

#     for f, f_courses in faculty_courses.items():
#         for t in timeslots:
#             vars_faculty_slot = [z[(c, t, r)] for c in f_courses for r in room_ids if (c, t, r) in z]
#             if vars_faculty_slot:
#                 model.Add(sum(vars_faculty_slot) <= 1)

#     for f, f_courses in faculty_courses.items():
#         max_h = faculty_map.get(f, {}).get("max_hours_per_week", None)
#         if max_h is not None:
#             vars_faculty_total = [z[(c, t, r)] for c in f_courses for t in timeslots for r in room_ids if (c, t, r) in z]
#             if vars_faculty_total:
#                 model.Add(sum(vars_faculty_total) <= max_h)

#     # ---------- Objective ----------
#     model.Maximize(sum(a.values()))

#     # ---------- Solve ----------
#     solver = cp_model.CpSolver()
#     solver.parameters.max_time_in_seconds = MAX_SECONDS
#     solver.parameters.num_search_workers = NUM_WORKERS
#     status = solver.Solve(model)

#     validation = {"errors": [], "warnings": []}

#     if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
#         validation["errors"].append("No feasible solution found")
#         return {}, validation

#     # ---------- Build room-centric timetable ----------
#     timetable = defaultdict(lambda: defaultdict(list))  # room -> day -> list of sessions

#     for (c, t, r), var in z.items():
#         if solver.Value(var) == 1:
#             day, start = t.split("-")
#             timetable[r][day].append({
#                 "start": start,
#                 "end": str(int(start.split(":")[0])+1).zfill(2) + ":" + start.split(":")[1],
#                 "faculty": courses_map[c].get("faculty"),
#                 "course": c
#             })

#     return dict(timetable), validation

# timetable_solver_with_validation.py
# def run_solver(courses, students, faculty, rooms):
#     """
#     courses, students, faculty, rooms: list of dicts from MongoDB
#     returns:
#         sessions: list of dicts as above
#         validation: dict {errors: [], warnings: []}
#     """
#     from ortools.sat.python import cp_model
#     from collections import defaultdict

#     timeslots = [
#         "Mon-09:00", "Mon-10:00", "Mon-11:00", "Mon-12:00", "Mon-14:00", "Mon-15:00", "Mon-16:00",
#         "Tue-09:00", "Tue-10:00", "Tue-11:00", "Tue-12:00", "Tue-14:00", "Tue-15:00", "Tue-16:00",
#         "Wed-09:00", "Wed-10:00", "Wed-11:00", "Wed-12:00", "Wed-14:00", "Wed-15:00", "Wed-16:00",
#         "Thu-09:00", "Thu-10:00", "Thu-11:00", "Thu-12:00", "Thu-14:00", "Thu-15:00", "Thu-16:00",
#         "Fri-09:00", "Fri-10:00", "Fri-11:00", "Fri-12:00", "Fri-14:00", "Fri-15:00", "Fri-16:00"
#     ]

#     # Build maps
#     courses_map = {c["course_id"]: c for c in courses}
#     rooms_map = {r["room_id"]: r for r in rooms}
#     students_map = {s["student_id"]: s for s in students}
#     faculty_map = {f["faculty_id"]: f for f in faculty}

#     course_ids = list(courses_map.keys())
#     room_ids = list(rooms_map.keys())
#     student_ids = list(students_map.keys())
#     faculty_ids = list(faculty_map.keys())

#     model = cp_model.CpModel()
#     z, a = {}, {}

#     # Session vars
#     for c in course_ids:
#         ctype = courses_map[c].get("type", "lecture")
#         for t in timeslots:
#             for r in room_ids:
#                 rtype = rooms_map[r].get("type", "lecture")
#                 if (ctype == "lab" and rtype != "lab") or (ctype == "lecture" and rtype == "lab"):
#                     continue
#                 z[(c, t, r)] = model.NewBoolVar(f"z_{c}_{t}_{r}")

#     # Attendance vars
#     for s in student_ids:
#         for c in students_map[s].get("courses", []):
#             if c not in course_ids:
#                 continue
#             for t in timeslots:
#                 for r in room_ids:
#                     if (c, t, r) in z:
#                         a[(s, c, t, r)] = model.NewBoolVar(f"a_{s}_{c}_{t}_{r}")

#     # Example constraints: student-course count
#     for s in student_ids:
#         for c in students_map[s].get("courses", []):
#             needed = courses_map[c].get("weekly_lectures", 1)
#             vars_sc = [a[(ss, cc, t, r)] for (ss, cc, t, r) in a if ss==s and cc==c]
#             if vars_sc:
#                 model.Add(sum(vars_sc) == needed)

#     # a <= z
#     for (s, c, t, r), var in a.items():
#         model.Add(var <= z[(c, t, r)])

#     # Only 1 course per room per timeslot
#     for t in timeslots:
#         for r in room_ids:
#             vars_room_slot = [z[(c, t, r)] for c in course_ids if (c, t, r) in z]
#             if vars_room_slot:
#                 model.Add(sum(vars_room_slot) <= 1)

#     # Faculty constraints
#     course_faculty = {c: courses_map[c]["faculty"] for c in course_ids}
#     faculty_courses = defaultdict(list)
#     for c,f in course_faculty.items():
#         faculty_courses[f].append(c)

#     for f, f_courses in faculty_courses.items():
#         for t in timeslots:
#             vars_fac_slot = [z[(c,t,r)] for c in f_courses for r in room_ids if (c,t,r) in z]
#             if vars_fac_slot:
#                 model.Add(sum(vars_fac_slot) <= 1)
#         max_h = faculty_map[f].get("max_hours_per_week", 999)
#         vars_total = [z[(c,t,r)] for c in f_courses for t in timeslots for r in room_ids if (c,t,r) in z]
#         if vars_total:
#             model.Add(sum(vars_total) <= max_h)

#     # Objective
#     model.Maximize(sum(a.values()))

#     solver = cp_model.CpSolver()
#     solver.parameters.max_time_in_seconds = 30
#     status = solver.Solve(model)

#     if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
#         return [], {"errors":["No feasible solution"], "warnings":[]}

#     # Build output
#     sessions = []
#     for (c, t, r), var in z.items():
#         if solver.Value(var)==1:
#             sessions.append({
#                 "roomId": r,
#                 "day": t.split("-")[0],
#                 "startTime": t.split("-")[1],
#                 "endTime": f"{int(t.split('-')[1].split(':')[0])+1:02d}:00",  # +1 hour
#                 "courseId": c,
#                 "facultyId": courses_map[c]["faculty"],
#                 "studentIds": [s for (s_,c_,t_,r_) in a if c_==c and t_==t and r_==r and solver.Value(a[(s_,c_,t_,r_)])==1]
#             })
#     return sessions, {"errors": [], "warnings": []}



def run_solver(courses, students, faculty, rooms):
    """
    courses, students, faculty, rooms: list of dicts from MongoDB
    returns:
        sessions: list of dicts to insert into timetable collection
        validation: dict with errors and warnings
    """
    from ortools.sat.python import cp_model
    from collections import defaultdict

    # Timeslots (you can adjust as needed)
    timeslots = [
        "Mon-09:00", "Mon-10:00", "Mon-11:00", "Mon-12:00", "Mon-14:00", "Mon-15:00", "Mon-16:00",
        "Tue-09:00", "Tue-10:00", "Tue-11:00", "Tue-12:00", "Tue-14:00", "Tue-15:00", "Tue-16:00",
        "Wed-09:00", "Wed-10:00", "Wed-11:00", "Wed-12:00", "Wed-14:00", "Wed-15:00", "Wed-16:00",
        "Thu-09:00", "Thu-10:00", "Thu-11:00", "Thu-12:00", "Thu-14:00", "Thu-15:00", "Thu-16:00",
        "Fri-09:00", "Fri-10:00", "Fri-11:00", "Fri-12:00", "Fri-14:00", "Fri-15:00", "Fri-16:00"
    ]

    # Build quick lookup maps
    courses_map = {c["courseId"]: c for c in courses}
    rooms_map = {r["roomId"]: r for r in rooms if r.get("isAvailable", True)}
    students_map = {s["studentId"]: s for s in students}
    faculty_map = {f["facultyId"]: f for f in faculty}

    course_ids = list(courses_map.keys())
    room_ids = list(rooms_map.keys())
    student_ids = list(students_map.keys())
    faculty_ids = list(faculty_map.keys())

    # CP-SAT model
    model = cp_model.CpModel()
    z, a = {}, {}

    # 1️⃣ Create session variables z[c,t,r]
    for c in course_ids:
        ctype = courses_map[c].get("type", "lecture")  # default type
        for t in timeslots:
            for r in room_ids:
                rtype = rooms_map[r]["roomType"]
                if (ctype == "lab" and rtype != "lab") or (ctype == "lecture" and rtype == "lab"):
                    continue
                z[(c, t, r)] = model.NewBoolVar(f"z_{c}_{t}_{r}")

    # 2️⃣ Create student attendance variables a[s,c,t,r]
    for s in student_ids:
        for c in students_map[s].get("courses", []):
            if c not in course_ids:
                continue
            for t in timeslots:
                for r in room_ids:
                    if (c, t, r) in z:
                        a[(s, c, t, r)] = model.NewBoolVar(f"a_{s}_{c}_{t}_{r}")

    # 3️⃣ Constraints

    # 3a) Each student must attend exactly the number of weekly lectures
    for s in student_ids:
        for c in students_map[s].get("courses", []):
            needed = courses_map[c].get("weekly_lectures", 1)
            vars_sc = [a[(ss, cc, t, r)] for (ss, cc, t, r) in a if ss==s and cc==c]
            if vars_sc:
                model.Add(sum(vars_sc) == needed)

    # 3b) If student attends, session exists
    for (s,c,t,r), var in a.items():
        model.Add(var <= z[(c,t,r)])

    # 3c) Room capacity
    for (c,t,r), zvar in z.items():
        session_students = [a[(s,c,t,r)] for s in student_ids if (s,c,t,r) in a]
        if session_students:
            cap = rooms_map[r]["capacity"]
            model.Add(sum(session_students) <= cap * zvar)

    # 3d) One course per room per timeslot
    for t in timeslots:
        for r in room_ids:
            vars_room_slot = [z[(c,t,r)] for c in course_ids if (c,t,r) in z]
            if vars_room_slot:
                model.Add(sum(vars_room_slot) <= 1)

    # 3e) Student cannot be in two sessions at same timeslot
    for s in student_ids:
        for t in timeslots:
            vars_st = [a[(ss, c, tt, r)] for (ss,c,tt,r) in a if ss==s and tt==t]
            if vars_st:
                model.Add(sum(vars_st) <= 1)

    # 3f) Faculty cannot teach two sessions at same timeslot & max hours/week
    course_faculty = {c: courses_map[c].get("faculty") for c in course_ids}
    faculty_courses = defaultdict(list)
    for c,fid in course_faculty.items():
        if fid:
            faculty_courses[fid].append(c)

    for f, f_courses in faculty_courses.items():
        for t in timeslots:
            vars_fac_slot = [z[(c,t,r)] for c in f_courses for r in room_ids if (c,t,r) in z]
            if vars_fac_slot:
                model.Add(sum(vars_fac_slot) <= 1)
        max_h = faculty_map.get(f, {}).get("max_hours_per_week", 999)
        vars_total = [z[(c,t,r)] for c in f_courses for t in timeslots for r in room_ids if (c,t,r) in z]
        if vars_total:
            model.Add(sum(vars_total) <= max_h)

    # Objective: maximize assigned student-course slots
    model.Maximize(sum(a.values()))

    # 4️⃣ Solve
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 30
    status = solver.Solve(model)

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return [], {"errors":["No feasible solution"], "warnings":[]}

    # 5️⃣ Build output
    sessions = []
    for (c, t, r), var in z.items():
        if solver.Value(var)==1:
            sessions.append({
                "roomId": r,
                "day": t.split("-")[0],
                "startTime": t.split("-")[1],
                "endTime": f"{int(t.split('-')[1].split(':')[0])+1:02d}:00",  # +1 hour
                "courseId": c,
                "facultyId": courses_map[c].get("faculty"),
                "studentIds": [s for (s_,c_,t_,r_) in a if c_==c and t_==t and r_==r and solver.Value(a[(s_,c_,t_,r_)])==1]
            })

    return sessions, {"errors": [], "warnings": []}
