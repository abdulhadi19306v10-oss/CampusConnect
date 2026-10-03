const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  credits: { type: Number, required: true },
  department: { type: String, required: true },
  instructor: { type: String },
  capacity: { type: Number, required: true },
  enrolledCount: { type: Number, default: 0 }
}, { timestamps: true });



module.exports = mongoose.model('Course', courseSchema);
