const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { auth, admin, adminOrFaculty } = require('../middleware/authMiddleware');

router.get('/', announcementController.getPublished);

// Admin only
router.get('/all', auth, admin, announcementController.getAll);
router.delete('/:id', auth, admin, announcementController.deleteAnnouncement);

// Admin or Faculty
router.post('/', auth, adminOrFaculty, announcementController.createAnnouncement);

module.exports = router;
