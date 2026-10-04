require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../server/config/db');
const bcrypt = require('bcryptjs');

const User = require('../server/models/User');
const Course = require('../server/models/Course');
const Facility = require('../server/models/Facility');
const Announcement = require('../server/models/Announcement');
const Timetable = require('../server/models/Timetable');
const Booking = require('../server/models/Booking');
const Complaint = require('../server/models/Complaint');
const Enrollment = require('../server/models/Enrollment');
const Attendance = require('../server/models/Attendance');

const seedData = async (shouldExit = true) => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  try {
    console.log("Cleaning old database collections...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Facility.deleteMany({});
    await Announcement.deleteMany({});
    await Timetable.deleteMany({});
    await Booking.deleteMany({});
    await Complaint.deleteMany({});
    await Enrollment.deleteMany({});
    await Attendance.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('faculty123', salt);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const studentPasswordHash = await bcrypt.hash('student123', salt);

    console.log("Seeding Administrator...");
    const admin = new User({
      name: 'System Admin',
      email: 'admin@campusconnect.edu',
      password: adminPasswordHash,
      role: 'ADMIN',
      title: 'Senior Systems Administrator',
      phone: '555-0100'
    });
    await admin.save();

    console.log("Seeding Faculty Members...");
    const facultyMembers = [
      {
        name: 'Dr. Smith',
        email: 'faculty1@campusconnect.edu',
        password: defaultPasswordHash,
        role: 'FACULTY',
        department: 'Software Engineering',
        title: 'Associate Professor',
        phone: '555-0201'
      },
      {
        name: 'Prof. Johnson',
        email: 'faculty2@campusconnect.edu',
        password: defaultPasswordHash,
        role: 'FACULTY',
        department: 'Computer Science',
        title: 'Professor & Chair',
        phone: '555-0202'
      },
      {
        name: 'Dr. Lee',
        email: 'faculty3@campusconnect.edu',
        password: defaultPasswordHash,
        role: 'FACULTY',
        department: 'Software Engineering',
        title: 'Assistant Professor',
        phone: '555-0203'
      },
      {
        name: 'Dr. Brown',
        email: 'faculty4@campusconnect.edu',
        password: defaultPasswordHash,
        role: 'FACULTY',
        department: 'Computer Science',
        title: 'Associate Professor',
        phone: '555-0204'
      },
      {
        name: 'Prof. Davis',
        email: 'faculty5@campusconnect.edu',
        password: defaultPasswordHash,
        role: 'FACULTY',
        department: 'Software Engineering',
        title: 'Professor',
        phone: '555-0205'
      }
    ];
    const insertedFaculty = await User.insertMany(facultyMembers);

    console.log("Seeding Students...");
    const studentNames = [
      'Alex Morgan', 'Elena Rostova', 'Marcus Chen', 'Sarah Jenkins', 'David Kim',
      'Priya Sharma', 'Omar Farooq', 'Lucas Vance', 'Chloe Bennett', 'Hannah Abbott',
      'Brian Miller', 'Aisha Patel', 'James Wilson', 'Maya Lin', 'Samuel Torres',
      'Grace Hopper', 'Alan Turing', 'Ada Lovelace', 'Donald Knuth', 'Linus Torvalds'
    ];

    const students = [];
    for (let i = 0; i < studentNames.length; i++) {
      const idx = i + 1;
      students.push({
        name: studentNames[i],
        email: `student${idx}@campusconnect.edu`,
        password: studentPasswordHash,
        role: 'STUDENT',
        studentId: `FA26-BCS-${100 + idx}`,
        department: idx % 2 === 0 ? 'Software Engineering' : 'Computer Science',
        semester: ((idx - 1) % 6) + 1,
        phone: `555-03${idx.toString().padStart(2, '0')}`
      });
    }
    const insertedStudents = await User.insertMany(students);

    console.log("Seeding Courses...");
    const coursesData = [
      {
        courseCode: 'SE101',
        title: 'Introduction to Software Engineering',
        description: 'Fundamentals of software development lifecycles, agile modeling, and requirements engineering.',
        credits: 3,
        department: 'Software Engineering',
        instructor: 'Dr. Smith',
        capacity: 30,
        enrolledCount: 0
      },
      {
        courseCode: 'CS102',
        title: 'Data Structures and Algorithms',
        description: 'Linear and non-linear data structures, asymptotic analysis, trees, graphs, and dynamic programming.',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Prof. Johnson',
        capacity: 40,
        enrolledCount: 0
      },
      {
        courseCode: 'SE201',
        title: 'Software Development and Architecture',
        description: 'Clean Architecture, design patterns, microservices, and modern layered application frameworks.',
        credits: 4,
        department: 'Software Engineering',
        instructor: 'Dr. Lee',
        capacity: 35,
        enrolledCount: 0
      },
      {
        courseCode: 'CS301',
        title: 'Database Systems',
        description: 'Relational data models, normalization, indexing, transaction ACID properties, and NoSQL engines.',
        credits: 3,
        department: 'Computer Science',
        instructor: 'Dr. Brown',
        capacity: 30,
        enrolledCount: 0
      },
      {
        courseCode: 'SE401',
        title: 'Software Testing and Quality Assurance',
        description: 'Automated unit, integration, and load testing paradigms, CI/CD pipelines, and verification metrics.',
        credits: 3,
        department: 'Software Engineering',
        instructor: 'Prof. Davis',
        capacity: 25,
        enrolledCount: 0
      }
    ];
    const insertedCourses = await Course.insertMany(coursesData);

    console.log("Seeding Enrollments...");
    const enrollments = [];

    // Course 0: SE101 (Dr. Smith) -> Students 0..14 (15 students)
    const se101Students = insertedStudents.slice(0, 15);
    se101Students.forEach(s => {
      enrollments.push({ studentId: s._id, courseId: insertedCourses[0]._id, status: 'ENROLLED' });
    });

    // Course 1: CS102 (Prof. Johnson) -> Students 4..19 (16 students)
    const cs102Students = insertedStudents.slice(4, 20);
    cs102Students.forEach(s => {
      enrollments.push({ studentId: s._id, courseId: insertedCourses[1]._id, status: 'ENROLLED' });
    });

    // Course 2: SE201 (Dr. Lee) -> Students 0..11 (12 students)
    const se201Students = insertedStudents.slice(0, 12);
    se201Students.forEach(s => {
      enrollments.push({ studentId: s._id, courseId: insertedCourses[2]._id, status: 'ENROLLED' });
    });

    // Course 3: CS301 (Dr. Brown) -> Students 5..19 (15 students)
    const cs301Students = insertedStudents.slice(5, 20);
    cs301Students.forEach(s => {
      enrollments.push({ studentId: s._id, courseId: insertedCourses[3]._id, status: 'ENROLLED' });
    });

    // Course 4: SE401 (Prof. Davis) -> Students 8..19 (12 students)
    const se401Students = insertedStudents.slice(8, 20);
    se401Students.forEach(s => {
      enrollments.push({ studentId: s._id, courseId: insertedCourses[4]._id, status: 'ENROLLED' });
    });

    await Enrollment.insertMany(enrollments);

    // Update enrolledCounts on courses
    await Course.findByIdAndUpdate(insertedCourses[0]._id, { enrolledCount: se101Students.length });
    await Course.findByIdAndUpdate(insertedCourses[1]._id, { enrolledCount: cs102Students.length });
    await Course.findByIdAndUpdate(insertedCourses[2]._id, { enrolledCount: se201Students.length });
    await Course.findByIdAndUpdate(insertedCourses[3]._id, { enrolledCount: cs301Students.length });
    await Course.findByIdAndUpdate(insertedCourses[4]._id, { enrolledCount: se401Students.length });

    console.log("Seeding Historical Attendance Records...");
    const attendanceRecords = [];

    // Helper to generate past dates
    const getPastDate = (daysAgo) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      d.setHours(9, 30, 0, 0);
      return d;
    };

    // Lecture dates for SE101 (8 lecture sessions over last 4 weeks)
    const se101Dates = [24, 21, 17, 14, 10, 7, 3, 1].map(getPastDate);

    se101Dates.forEach((lectureDate, dateIdx) => {
      se101Students.forEach((student, studentIdx) => {
        let status = 'Present';

        // Student 1 (Alex Morgan) has almost perfect attendance
        if (studentIdx === 0) {
          status = dateIdx === 5 ? 'Late' : 'Present';
        }
        // Student 4 (David Kim) has attendance issues (< 75% at risk for testing warning badges)
        else if (studentIdx === 4) {
          status = (dateIdx % 2 === 0) ? 'Absent' : (dateIdx === 3 ? 'Late' : 'Present');
        }
        // Student 7 (Lucas Vance) also below threshold (~62%)
        else if (studentIdx === 7) {
          status = (dateIdx === 1 || dateIdx === 4 || dateIdx === 6) ? 'Absent' : 'Present';
        }
        // General realistic variation for remaining students (mostly Present, occasional Late or Absent)
        else {
          const rand = (studentIdx * 7 + dateIdx * 13) % 100;
          if (rand < 78) status = 'Present';
          else if (rand < 90) status = 'Late';
          else status = 'Absent';
        }

        attendanceRecords.push({
          student: student._id,
          course: insertedCourses[0]._id,
          date: lectureDate,
          status: status
        });
      });
    });

    // Lecture dates for CS102 (6 sessions)
    const cs102Dates = [20, 16, 13, 9, 6, 2].map(getPastDate);
    cs102Dates.forEach((lectureDate, dateIdx) => {
      cs102Students.forEach((student, studentIdx) => {
        let status = 'Present';
        const rand = (studentIdx * 11 + dateIdx * 17) % 100;
        if (rand < 80) status = 'Present';
        else if (rand < 92) status = 'Late';
        else status = 'Absent';

        attendanceRecords.push({
          student: student._id,
          course: insertedCourses[1]._id,
          date: lectureDate,
          status: status
        });
      });
    });

    // Lecture dates for SE201 (6 sessions)
    const se201Dates = [22, 18, 15, 11, 8, 4].map(getPastDate);
    se201Dates.forEach((lectureDate, dateIdx) => {
      se201Students.forEach((student, studentIdx) => {
        let status = 'Present';
        const rand = (studentIdx * 9 + dateIdx * 19) % 100;
        if (rand < 82) status = 'Present';
        else if (rand < 93) status = 'Late';
        else status = 'Absent';

        attendanceRecords.push({
          student: student._id,
          course: insertedCourses[2]._id,
          date: lectureDate,
          status: status
        });
      });
    });

    await Attendance.insertMany(attendanceRecords);
    console.log(`Seeded ${attendanceRecords.length} historical attendance records.`);

    console.log("Seeding Facilities...");
    const facilitiesData = [
      { name: 'Computer Lab A', type: 'Computer Lab', capacity: 50, isActive: true },
      { name: 'Seminar Hall 1', type: 'Seminar Hall', capacity: 200, isActive: true },
      { name: 'Library Study Room B', type: 'Library Study Room', capacity: 6, isActive: true },
      { name: 'Conference Room C', type: 'Conference Room', capacity: 20, isActive: true },
      { name: 'Robotics & IoT Laboratory', type: 'Computer Lab', capacity: 35, isActive: true },
      { name: 'Main Sports Ground', type: 'Sports Ground', capacity: 500, isActive: true }
    ];
    const insertedFacilities = await Facility.insertMany(facilitiesData);

    console.log("Seeding Bookings...");
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

    const bookings = [
      {
        studentId: insertedStudents[0]._id, // Alex Morgan
        facilityId: insertedFacilities[2]._id, // Study Room B
        date: today,
        startTime: '14:00',
        endTime: '16:00',
        purpose: 'SE101 Sprint Retrospective & Architecture Review',
        status: 'APPROVED'
      },
      {
        studentId: insertedStudents[0]._id, // Alex Morgan
        facilityId: insertedFacilities[0]._id, // Lab A
        date: tomorrow,
        startTime: '10:00',
        endTime: '12:00',
        purpose: 'Benchmark tests for distributed indexing algorithm',
        status: 'PENDING'
      },
      {
        studentId: insertedStudents[1]._id, // Elena Rostova
        facilityId: insertedFacilities[1]._id, // Seminar Hall 1
        date: nextWeek,
        startTime: '15:00',
        endTime: '18:00',
        purpose: 'ACM Student Chapter Hackathon Kickoff Ceremony',
        status: 'APPROVED'
      },
      {
        studentId: insertedStudents[2]._id, // Marcus Chen
        facilityId: insertedFacilities[3]._id, // Conference Room C
        date: today,
        startTime: '11:00',
        endTime: '13:00',
        purpose: 'Robotics Society Executive Committee Meeting',
        status: 'REJECTED'
      }
    ];
    await Booking.insertMany(bookings);

    console.log("Seeding Support Complaints...");
    const complaints = [
      {
        studentId: insertedStudents[0]._id,
        category: 'Academic',
        subject: 'Week 4 Lecture Notes & Slidedeck Missing on Portal',
        description: 'The slidedeck for Architectural Patterns has not yet appeared on the course handouts folder.',
        status: 'RESOLVED',
        adminResponse: 'Handouts have been uploaded to SE101 Materials by Dr. Smith.'
      },
      {
        studentId: insertedStudents[3]._id,
        category: 'Facility',
        subject: 'Lab A Workstation 14 Keyboard & Monitor Cable Faulty',
        description: 'Workstation 14 in Computer Lab A intermittently disconnects from the LAN switch and keyboard is unresponsive.',
        status: 'IN_PROGRESS',
        adminResponse: 'Hardware technician dispatched to inspect and replace peripheral cables.'
      },
      {
        studentId: insertedStudents[1]._id,
        category: 'Technical',
        subject: 'SSID Campus-HighSpeed Dropouts on 2nd Floor Library',
        description: 'Wi-Fi connection drops whenever moving between the main reading room and the group study pods.',
        status: 'OPEN'
      }
    ];
    await Complaint.insertMany(complaints);

    console.log("Seeding Announcements...");
    const announcements = [
      {
        title: 'Fall Semester Mid-Term Examination Schedule',
        description: 'Mid-term examinations will commence from next month. Course-wise detailed schedules are available at the academic affairs desk.',
        category: 'Academic',
        author: admin._id,
        isPublished: true,
        date: new Date()
      },
      {
        title: 'SE101 Project Milestone 1 Guidelines & Rubric',
        description: 'Please submit your architecture diagrams and domain models by Friday 11:59 PM. Peer code reviews will take place during next week\'s lab session.',
        category: 'Academic',
        author: insertedFaculty[0]._id, // Dr. Smith
        isPublished: true,
        date: new Date(Date.now() - 86400000)
      },
      {
        title: 'Central Library Extended Operating Hours for Mid-Terms',
        description: 'The Central Library and Digital Commons study pods will remain open until midnight throughout the examination preparation weeks.',
        category: 'Facility',
        author: admin._id,
        isPublished: true,
        date: new Date(Date.now() - 2 * 86400000)
      },
      {
        title: 'Guest Lecture: Scalable Microservices in Production',
        description: 'Join us this Thursday at 3 PM in Seminar Hall 1 for an industry keynote by Lead Systems Architect on fault-tolerant distributed systems.',
        category: 'Technical',
        author: insertedFaculty[1]._id, // Prof. Johnson
        isPublished: true,
        date: new Date(Date.now() - 3 * 86400000)
      },
      {
        title: 'Campus Network Maintenance Window',
        description: 'Core switches will undergo firmware upgrades on Sunday between 02:00 AM and 04:00 AM. Student portal services may experience momentary pauses.',
        category: 'Technical',
        author: admin._id,
        isPublished: true,
        date: new Date(Date.now() - 4 * 86400000)
      }
    ];
    await Announcement.insertMany(announcements);

    console.log("Seeding Timetable...");
    const timetable = [
      {
        courseId: insertedCourses[0]._id,
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        room: 'Room 101',
        instructor: 'Dr. Smith'
      },
      {
        courseId: insertedCourses[0]._id,
        day: 'Wednesday',
        startTime: '09:00',
        endTime: '10:30',
        room: 'Room 101',
        instructor: 'Dr. Smith'
      },
      {
        courseId: insertedCourses[1]._id,
        day: 'Tuesday',
        startTime: '11:00',
        endTime: '12:30',
        room: 'Lab 1',
        instructor: 'Prof. Johnson'
      },
      {
        courseId: insertedCourses[1]._id,
        day: 'Thursday',
        startTime: '11:00',
        endTime: '12:30',
        room: 'Lab 1',
        instructor: 'Prof. Johnson'
      },
      {
        courseId: insertedCourses[2]._id,
        day: 'Monday',
        startTime: '14:00',
        endTime: '15:30',
        room: 'Room 202',
        instructor: 'Dr. Lee'
      },
      {
        courseId: insertedCourses[2]._id,
        day: 'Thursday',
        startTime: '14:00',
        endTime: '15:30',
        room: 'Room 202',
        instructor: 'Dr. Lee'
      },
      {
        courseId: insertedCourses[3]._id,
        day: 'Wednesday',
        startTime: '11:00',
        endTime: '12:30',
        room: 'Room 105',
        instructor: 'Dr. Brown'
      },
      {
        courseId: insertedCourses[3]._id,
        day: 'Friday',
        startTime: '10:00',
        endTime: '11:30',
        room: 'Room 105',
        instructor: 'Dr. Brown'
      },
      {
        courseId: insertedCourses[4]._id,
        day: 'Tuesday',
        startTime: '14:00',
        endTime: '15:30',
        room: 'Room 204',
        instructor: 'Prof. Davis'
      },
      {
        courseId: insertedCourses[4]._id,
        day: 'Friday',
        startTime: '14:00',
        endTime: '15:30',
        room: 'Room 204',
        instructor: 'Prof. Davis'
      }
    ];
    await Timetable.insertMany(timetable);

    console.log('✅ Seed completed successfully with full faculty, enrollments, and attendance records!');
    if (shouldExit) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    if (shouldExit) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedData(true);
}

module.exports = { seedData };
