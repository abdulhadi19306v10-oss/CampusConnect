const courseRepository = require('../repositories/courseRepository');
const enrollmentRepository = require('../repositories/enrollmentRepository');

class CourseService {
  async getAllCourses() {
    return await courseRepository.findAll();
  }

  async getCourseById(id) {
    return await courseRepository.findById(id);
  }

  async createCourse(courseData) {
    return await courseRepository.create(courseData);
  }

  async updateCourse(id, courseData) {
    return await courseRepository.update(id, courseData);
  }

  async deleteCourse(id) {
    return await courseRepository.delete(id);
  }

  async enrollStudent(studentId, courseId) {
    const course = await courseRepository.findById(courseId);
    if (!course) throw new Error('Course not found');
    if (course.enrolledCount >= course.capacity) throw new Error('Course capacity is full');

    const existingEnrollment = await enrollmentRepository.findOne(studentId, courseId);
    if (existingEnrollment) throw new Error('Student already enrolled in this course');

    const enrollment = await enrollmentRepository.create(studentId, courseId);
    await courseRepository.incrementEnrollment(courseId);
    
    return enrollment;
  }

  async dropCourse(studentId, courseId) {
    const enrollment = await enrollmentRepository.findOne(studentId, courseId);
    if (!enrollment) throw new Error('Enrollment not found');

    await enrollmentRepository.delete(studentId, courseId);
    await courseRepository.decrementEnrollment(courseId);
  }

  async getStudentEnrollments(studentId) {
    return await enrollmentRepository.findByStudent(studentId);
  }
}

module.exports = new CourseService();
