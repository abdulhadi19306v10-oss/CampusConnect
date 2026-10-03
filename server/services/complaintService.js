const complaintRepository = require('../repositories/complaintRepository');

class ComplaintService {
  async submitComplaint(data) {
    return await complaintRepository.create(data);
  }

  async getStudentComplaints(studentId) {
    return await complaintRepository.findByStudent(studentId);
  }

  async getAllComplaints() {
    return await complaintRepository.findAll();
  }

  async updateComplaintStatus(id, status, adminResponse) {
    return await complaintRepository.update(id, { status, adminResponse });
  }
}

module.exports = new ComplaintService();
