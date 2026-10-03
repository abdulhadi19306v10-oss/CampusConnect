const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // e.g. Computer Lab, Seminar Hall
  capacity: { type: Number, required: true },
  location: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);
