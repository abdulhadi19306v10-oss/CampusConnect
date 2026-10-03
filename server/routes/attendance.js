const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth } = require('../middleware/authMiddleware');

router.post('/', auth, attendanceController.markAttendance);
router.get('/my-attendance', auth, attendanceController.getMyAttendance);

router.get('/course/:courseId/stats', auth, attendanceController.getCourseStats);

module.exports = router;
