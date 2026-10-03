const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'ADMIN', 'FACULTY'], default: 'STUDENT' },
  // Student specific fields
  studentId: { type: String },
  department: { type: String },
  semester: { type: Number },
  title: { type: String },
  phone: { type: String }
}, { timestamps: true });

// Create indexes
userSchema.index({ studentId: 1 });

module.exports = mongoose.model('User', userSchema);
