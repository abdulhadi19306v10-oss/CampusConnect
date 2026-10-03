const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:MM
  endTime: { type: String, required: true }, // HH:MM
  purpose: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'], default: 'PENDING' }
}, { timestamps: true });

bookingSchema.index({ date: 1, facilityId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
