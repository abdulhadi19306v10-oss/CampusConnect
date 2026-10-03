const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { auth, admin } = require('../middleware/authMiddleware');

router.get('/', courseController.getAllCourses);
router.get('/my-enrollments', auth, courseController.myEnrollments);
router.post('/enroll', auth, courseController.enroll);
router.delete('/drop/:courseId', auth, courseController.drop);

// Admin only
router.post('/', auth, admin, courseController.createCourse);

router.put('/:id', auth, admin, courseController.updateCourse);

router.get('/:id/students', auth, courseController.getEnrolledStudents);

module.exports = router;
