# 🎓 Planora - School Management System

A comprehensive school management system with automated timetable generation, role-based access control, and modern web interface. Built with Next.js and Python optimization algorithms.

![Planora](https://img.shields.io/badge/Planora-School%20Management-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Python](https://img.shields.io/badge/Python-3.12-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## ✨ Features

### 🎯 **Role-Based Access Control**
- **Administrator**: Upload CSV/JSON files, manage timetable data, oversee system
- **Teacher**: View personal teaching schedule and class information
- **Student**: Access class timetable and schedule details

### 📊 **Data Management**
- **CSV Upload**: Drag-and-drop interface for timetable data import
- **JSON Upload**: Bulk data import for faculty, students, courses, and rooms
- **Data Validation**: Comprehensive validation with error handling
- **Sample Downloads**: Pre-formatted sample files for easy setup

### 🧠 **Intelligent Timetable Generation**
- **Constraint Programming**: Uses Google OR-Tools CP-SAT solver
- **Real-time Updates**: Automatic timetable regeneration on data changes
- **Optimization**: Maximizes student-course assignments while respecting constraints
- **Conflict Resolution**: Prevents scheduling conflicts and double-booking

### 🎨 **Modern User Interface**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Timetables**: Week and day view with color-coded classes
- **Drag & Drop**: Intuitive file upload experience
- **Real-time Feedback**: Live validation and error reporting

## 🏗️ Architecture

### Frontend (Next.js)
```
frontend/
├── app/
│   ├── components/          # Reusable UI components
│   ├── admin/              # Administrator dashboard
│   ├── teacher/            # Teacher interface
│   ├── user/               # Student interface
│   └── api/                # API routes
├── lib/                    # Database schemas and utilities
└── sample-data/            # Sample data files
```

### Backend (Python)
```
timetable/
├── solver.py              # OR-Tools constraint programming solver
├── one.py                 # MongoDB change streams and real-time updates
└── test.py                # Testing utilities
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.12+
- MongoDB Atlas account or local MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/planora.git
   cd planora
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # or
   pnpm install
   ```

3. **Backend Setup**
   ```bash
   cd timetable
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   # Create .env.local in frontend directory
   cp frontend/env-sample.txt frontend/.env.local
   
   # Edit .env.local with your MongoDB URI
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/planora
   ```

5. **Start the Application**
   ```bash
   # Terminal 1: Start Next.js frontend
   cd frontend
   npm run dev
   
   # Terminal 2: Start Python backend
   cd timetable
   python one.py
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Teacher: http://localhost:3000/teacher
   - Student: http://localhost:3000/user

## 📋 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Administrator | admin | admin123 |
| Teacher | teacher | teacher123 |
| Student | user | user123 |

## 🗄️ Database Schema

### Faculty
```typescript
{
  facultyId: string (unique),
  name: string,
  email: string (unique),
  department: string,
  designation: string,
  max_hours_week: number,
  subjects: string[],
  phone?: string,
  office?: string
}
```

### Student
```typescript
{
  studentId: string (unique),
  name: string,
  email: string (unique),
  rollNumber: string (unique),
  batch: string,
  department: string,
  year: number,
  courses: string[],
  phone?: string,
  address?: string
}
```

### Course
```typescript
{
  courseId: string (unique),
  courseCode: string (unique),
  courseName: string,
  department: string,
  credits: number,
  weeklylecture: number,
  semester: string,
  year: number,
  faculty: string,
  prerequisites: string[]
}
```

### Room
```typescript
{
  roomId: string (unique),
  roomNumber: string (unique),
  building: string,
  floor: number,
  capacity: number,
  roomType: 'lecture' | 'lab' | 'seminar' | 'conference' | 'other',
  facilities: string[],
  isAvailable: boolean
}
```

## 🔧 API Endpoints

### Data Management
- `GET /api/data?type={faculty|students|courses|rooms}` - Retrieve paginated data
- `DELETE /api/data?type={type}&id={id}` - Delete specific record

### File Upload
- `POST /api/upload-json` - Upload JSON files for bulk data import

## 🧮 Timetable Optimization

The system uses **Google OR-Tools CP-SAT solver** with the following constraints:

1. **Student Requirements**: Each student must attend required weekly lectures
2. **Room Capacity**: Sessions cannot exceed room capacity
3. **Faculty Availability**: No double-booking for faculty members
4. **Time Conflicts**: Students cannot attend multiple sessions simultaneously
5. **Room Compatibility**: Lab courses require lab rooms, lectures require lecture rooms
6. **Faculty Hours**: Respect maximum weekly teaching hours per faculty

## 📁 Sample Data

The project includes comprehensive sample data:
- **5 Faculty members** across multiple departments
- **6 Students** with varied course enrollments
- **12 Courses** with prerequisites and faculty assignments
- **12 Rooms** including lecture halls, labs, and specialized facilities

## 🛠️ Technologies Used

### Frontend
- **Next.js 15.5.3** - React framework with App Router
- **TypeScript 5.0** - Type-safe JavaScript
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **MongoDB 6.20.0** - Database driver
- **Mongoose 8.18.1** - MongoDB ODM
- **PapaParse 5.5.3** - CSV parsing library
- **Lucide React** - Icon library

### Backend
- **Python 3.12** - Programming language
- **OR-Tools 9.14.6206** - Constraint programming solver
- **PyMongo 4.15.1** - MongoDB driver
- **Pandas 2.3.2** - Data manipulation
- **NumPy 2.3.3** - Numerical computing

## 📸 Screenshots

### Admin Dashboard
- CSV/JSON upload interface
- Timetable overview
- Data management tools

### Teacher Interface
- Personal teaching schedule
- Class information
- Week/day view options

### Student Portal
- Class timetable
- Course details
- Schedule management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Environment files are blocked by global ignore (use `env-sample.txt` as template)
- Change streams may fall back to polling in some MongoDB configurations
- Large datasets may require increased solver timeout

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Advanced reporting and analytics
- [ ] Integration with external calendar systems
- [ ] Multi-language support
- [ ] Advanced user management
- [ ] Email notifications
- [ ] Conflict resolution suggestions

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

## 🙏 Acknowledgments

- Google OR-Tools for constraint programming capabilities
- Next.js team for the excellent React framework
- MongoDB for the flexible database solution
- Tailwind CSS for the utility-first styling approach

---

**Made with ❤️ for educational institutions worldwide**
