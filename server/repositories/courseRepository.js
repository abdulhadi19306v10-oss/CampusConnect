const Course = require('../models/Course');

class CourseRepository {
  async create(courseData) {
    const course = new Course(courseData);
    return await course.save();
  }
  async findAll() {
    return await Course.find();
  }
  async findById(id) {
    return await Course.findById(id);
  }
  async update(id, updateData) {
    return await Course.findByIdAndUpdate(id, updateData, { new: true });
  }
  async delete(id) {
    return await Course.findByIdAndDelete(id);
  }
  async count() {
    return await Course.countDocuments();
  }
  async incrementEnrollment(id) {
    return await Course.findByIdAndUpdate(id, { $inc: { enrolledCount: 1 } });
  }
  async decrementEnrollment(id) {
    return await Course.findByIdAndUpdate(id, { $inc: { enrolledCount: -1 } });
  }
}
module.exports = new CourseRepository();
