import os

seed_file = 'scripts/seed.js'

seed_content = """require('dotenv').config();
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

const seedData = async () => {
  await connectDB();

  try {
    console.log("Cleaning old data...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Facility.deleteMany({});
    await Announcement.deleteMany({});
    await Timetable.deleteMany({});
    await Booking.deleteMany({});
    await Complaint.deleteMany({});
    await Enrollment.deleteMany({});
    
    console.log("Seeding Admin...");
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      name: 'System Admin',
      email: 'admin@campusconnect.edu',
      password: adminPassword,
      role: 'ADMIN'
    });
    await admin.save();
    
    console.log("Seeding Students...");
    const studentPassword = await bcrypt.hash('student123', salt);
    const students = [];
    for(let i = 1; i <= 20; i++) {
        students.push({
            name: `Student ${i}`,
            email: `student${i}@campusconnect.edu`,
            password: studentPassword,
            role: 'STUDENT',
            studentId: `S${1000 + i}`,
            department: i % 2 === 0 ? 'Software Engineering' : 'Computer Science',
            semester: (i % 8) + 1,
            phone: `555-01${i.toString().padStart(2, '0')}`
        });
    }
    await User.insertMany(students);

    console.log("Seeding Courses...");
    const courses = [
      { courseCode: 'SE101', title: 'Introduction to Software Engineering', description: 'Basics of SE', credits: 3, department: 'Software Engineering', instructor: 'Dr. Smith', capacity: 30, enrolledCount: 0 },
      { courseCode: 'CS102', title: 'Data Structures and Algorithms', description: 'Basics of DSA', credits: 4, department: 'Computer Science', instructor: 'Prof. Johnson', capacity: 40, enrolledCount: 0 },
      { courseCode: 'SE201', title: 'Software Development and Architecture', description: 'Advanced SE', credits: 4, department: 'Software Engineering', instructor: 'Dr. Lee', capacity: 35, enrolledCount: 0 },
      { courseCode: 'CS301', title: 'Database Systems', description: 'DB Design', credits: 3, department: 'Computer Science', instructor: 'Dr. Brown', capacity: 30, enrolledCount: 0 },
      { courseCode: 'SE401', title: 'Software Testing and Quality Assurance', description: 'QA', credits: 3, department: 'Software Engineering', instructor: 'Prof. Davis', capacity: 25, enrolledCount: 0 }
    ];
    const insertedCourses = await Course.insertMany(courses);

    console.log("Seeding Facilities...");
    const facilities = [
      { name: 'Computer Lab A', type: 'Computer Lab', capacity: 50, isActive: true },
      { name: 'Seminar Hall 1', type: 'Seminar Hall', capacity: 200, isActive: true },
      { name: 'Library Study Room B', type: 'Library Study Room', capacity: 6, isActive: true },
      { name: 'Conference Room C', type: 'Conference Room', capacity: 20, isActive: true },
      { name: 'Main Sports Ground', type: 'Sports Ground', capacity: 500, isActive: true }
    ];
    await Facility.insertMany(facilities);

    console.log("Seeding Announcements...");
    const announcements = [
      { title: 'Welcome to Fall Semester', description: 'Classes begin next Monday. Please check your timetables.', category: 'Academic', author: admin._id, isPublished: true, date: new Date() },
      { title: 'Library Hours Extended', description: 'The central library will now remain open until midnight during exam week.', category: 'Facility', author: admin._id, isPublished: true, date: new Date() },
      { title: 'Maintenance Notice', description: 'Campus portal will be down for maintenance on Saturday from 2 AM to 4 AM.', category: 'Technical', author: admin._id, isPublished: true, date: new Date() }
    ];
    await Announcement.insertMany(announcements);

    console.log("Seeding Timetable...");
    const timetable = [
        { courseId: insertedCourses[0]._id, day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Room 101', instructor: 'Dr. Smith' },
        { courseId: insertedCourses[0]._id, day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Room 101', instructor: 'Dr. Smith' },
        { courseId: insertedCourses[1]._id, day: 'Tuesday', startTime: '11:00', endTime: '12:30', room: 'Lab 1', instructor: 'Prof. Johnson' },
        { courseId: insertedCourses[2]._id, day: 'Thursday', startTime: '14:00', endTime: '15:30', room: 'Room 202', instructor: 'Dr. Lee' }
    ];
    await Timetable.insertMany(timetable);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
"""

with open(seed_file, 'w') as f:
    f.write(seed_content)

print("Seed file rewritten.")
