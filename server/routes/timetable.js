const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { auth, admin } = require('../middleware/authMiddleware');

router.get('/', timetableController.getTimetable);

// Admin only
router.post('/', auth, admin, timetableController.createTimetable);

module.exports = router;
