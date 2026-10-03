const courseService = require('../services/courseService');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.enroll = async (req, res) => {
  try {
    const enrollment = await courseService.enrollStudent(req.user.id, req.body.courseId);
    res.status(201).json({ success: true, data: enrollment, message: 'Successfully enrolled' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.drop = async (req, res) => {
  try {
    await courseService.dropCourse(req.user.id, req.params.courseId);
    res.json({ success: true, message: 'Successfully dropped course' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.myEnrollments = async (req, res) => {
  try {
    const enrollments = await courseService.getStudentEnrollments(req.user.id);
    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const Course = require('../models/Course');
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  try {
    const Enrollment = require('../models/Enrollment');
    const enrollments = await Enrollment.find({ courseId: req.params.id }).populate('studentId', 'name email studentId');
    const students = enrollments.map(e => e.studentId);
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
