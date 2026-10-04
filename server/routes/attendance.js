const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth } = require('../middleware/authMiddleware');

router.post('/', auth, attendanceController.markAttendance);
router.get('/my-attendance', auth, attendanceController.getMyAttendance);
router.get('/course/:courseId/stats', auth, attendanceController.getCourseStats);
router.get('/course/:courseId/date/:date', auth, attendanceController.getAttendanceByDate);
router.get('/course/:courseId/history', auth, attendanceController.getCourseHistory);

module.exports = router;
