const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true }
}, { timestamps: true });

// Prevent duplicate attendance for same student/course/date
// Unique index removed to allow multiple attendance sessions per day

module.exports = mongoose.model('Attendance', attendanceSchema);
