import os

# 1. Create server/models/Attendance.js
with open('server/models/Attendance.js', 'w') as f:
    f.write("""const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true }
}, { timestamps: true });

// Prevent duplicate attendance for same student/course/date
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
""")

# 2. Add GET /courses/:id/students in courseController and routes
course_controller = ""
with open('server/controllers/courseController.js', 'r') as f:
    course_controller = f.read()

if 'getEnrolledStudents' not in course_controller:
    course_controller += """
exports.getEnrolledStudents = async (req, res) => {
  try {
    const Enrollment = require('../models/Enrollment');
    const enrollments = await Enrollment.find({ course: req.params.id }).populate('student', 'name email studentId');
    const students = enrollments.map(e => e.student);
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
"""
    with open('server/controllers/courseController.js', 'w') as f:
        f.write(course_controller)

course_routes = ""
with open('server/routes/courses.js', 'r') as f:
    course_routes = f.read()

if '/:id/students' not in course_routes:
    course_routes = course_routes.replace('module.exports = router;', "router.get('/:id/students', auth, courseController.getEnrolledStudents);\n\nmodule.exports = router;")
    with open('server/routes/courses.js', 'w') as f:
        f.write(course_routes)

# 3. Create server/routes/attendance.js and controller
with open('server/controllers/attendanceController.js', 'w') as f:
    f.write("""const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body;
    // records is array of { studentId, status }
    
    // Convert date string to start of day for uniqueness
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0,0,0,0);
    
    // Upsert each record
    for (const record of records) {
        await Attendance.findOneAndUpdate(
            { student: record.studentId, course: courseId, date: attendanceDate },
            { status: record.status },
            { upsert: true, new: true }
        );
    }
    
    res.json({ success: true, message: 'Attendance saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id }).populate('course', 'courseCode title');
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
""")

with open('server/routes/attendance.js', 'w') as f:
    f.write("""const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth } = require('../middleware/authMiddleware');

router.post('/', auth, attendanceController.markAttendance);
router.get('/my-attendance', auth, attendanceController.getMyAttendance);

module.exports = router;
""")

# 4. Mount attendance route in server.js
with open('server/server.js', 'r') as f:
    server_js = f.read()
if '/api/attendance' not in server_js:
    server_js = server_js.replace("app.use('/api/courses', require('./routes/courses'));", "app.use('/api/courses', require('./routes/courses'));\napp.use('/api/attendance', require('./routes/attendance'));")
    with open('server/server.js', 'w') as f:
        f.write(server_js)

# 5. Fix Faculty Dashboard and Courses buttons
dashboard_fac = ""
with open('client/faculty/dashboard.html', 'r') as f:
    dashboard_fac = f.read()
dashboard_fac = dashboard_fac.replace('<button class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-users"></i> View Roster</button>', '<a href="attendance.html" class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-users"></i> View Roster</a>')
with open('client/faculty/dashboard.html', 'w') as f:
    f.write(dashboard_fac)

courses_fac = ""
with open('client/faculty/courses.html', 'r') as f:
    courses_fac = f.read()
courses_fac = courses_fac.replace('<button class="btn btn-sm btn-outline-primary me-1"><i class="fa-solid fa-folder-open"></i> Manage</button>', '<a href="attendance.html" class="btn btn-sm btn-outline-primary me-1"><i class="fa-solid fa-folder-open"></i> Manage</a>')
with open('client/faculty/courses.html', 'w') as f:
    f.write(courses_fac)

print("Built backend attendance system")
