const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, required: true },
  instructor: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
