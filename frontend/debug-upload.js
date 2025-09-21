// Debug script to test data upload
// Run with: node debug-upload.js

const testData = {
  faculty: [
    {
      facultyId: "FAC_TEST_001",
      name: "Test Professor",
      email: "test.professor@university.edu",
      department: "Computer Science",
      designation: "Professor",
      phone: "+1-555-0000",
      office: "TEST-101",
      max_hours_per_week: 20,
      subjects: ["Test Subject"]
    }
  ],
  students: [
    {
      studentId: "STU_TEST_001",
      name: "Test Student",
      email: "test.student@university.edu",
      rollNumber: "TEST2024001",
      batch: "2024",
      department: "Computer Science",
      year: 1,
      phone: "+1-555-0001",
      address: "Test Address",
      courses: ["CS101"]
    }
  ],
  courses: [
    {
      courseId: "CS_TEST_001",
      courseCode: "CS_TEST_001",
      courseName: "Test Course",
      department: "Computer Science",
      credits: 3,
      weeklyLectures: 3,
      semester: "Fall",
      year: 2024,
      faculty: "FAC_TEST_001",
      description: "Test course description",
      prerequisites: []
    }
  ],
  rooms: [
    {
      roomId: "ROOM_TEST_001",
      roomNumber: "TEST-101",
      building: "Test Building",
      floor: 1,
      capacity: 30,
      roomType: "lecture",
      facilities: ["Projector", "Whiteboard"],
      isAvailable: true
    }
  ]
};

async function testUpload(type, data) {
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('file', blob, `${type}-test.json`);
  formData.append('type', type);

  try {
    const response = await fetch('http://localhost:3000/api/upload-json', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log(`${type} upload result:`, result);
    return result;
  } catch (error) {
    console.error(`${type} upload error:`, error);
    return { error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Starting upload tests...\n');
  
  for (const [type, data] of Object.entries(testData)) {
    console.log(`Testing ${type} upload...`);
    const result = await testUpload(type, data);
    console.log(`Result:`, result);
    console.log('---\n');
  }
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runTests();
} else {
  // Browser environment
  runTests();
}
