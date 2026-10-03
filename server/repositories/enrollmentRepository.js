const Enrollment = require('../models/Enrollment');

class EnrollmentRepository {
  async create(studentId, courseId) {
    const enrollment = new Enrollment({ studentId, courseId });
    return await enrollment.save();
  }
  async findByStudent(studentId) {
    return await Enrollment.find({ studentId, status: 'ENROLLED' }).populate('courseId');
  }
  async findByCourse(courseId) {
    return await Enrollment.find({ courseId, status: 'ENROLLED' }).populate('studentId', 'name studentId email');
  }
  async findOne(studentId, courseId) {
    return await Enrollment.findOne({ studentId, courseId, status: 'ENROLLED' });
  }
  async delete(studentId, courseId) {
    return await Enrollment.findOneAndDelete({ studentId, courseId });
  }
}
module.exports = new EnrollmentRepository();
