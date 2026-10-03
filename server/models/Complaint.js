const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true, enum: ['Academic', 'Facility', 'Technical', 'Administration', 'Other'] },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  adminResponse: { type: String }
}, { timestamps: true });

complaintSchema.index({ status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
