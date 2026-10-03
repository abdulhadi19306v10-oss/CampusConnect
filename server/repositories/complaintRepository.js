const Complaint = require('../models/Complaint');

class ComplaintRepository {
  async create(data) {
    const complaint = new Complaint(data);
    return await complaint.save();
  }
  async findAll() {
    return await Complaint.find().populate('studentId', 'name studentId email');
  }
  async findByStudent(studentId) {
    return await Complaint.find({ studentId });
  }
  async findById(id) {
    return await Complaint.findById(id);
  }
  async update(id, data) {
    return await Complaint.findByIdAndUpdate(id, data, { new: true });
  }
  async countOpen() {
    return await Complaint.countDocuments({ status: 'OPEN' });
  }
}
module.exports = new ComplaintRepository();
