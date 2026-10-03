const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { auth, admin } = require('../middleware/authMiddleware');

router.get('/my-complaints', auth, complaintController.myComplaints);
router.post('/', auth, complaintController.submitComplaint);

// Admin only
router.get('/', auth, admin, complaintController.getAllComplaints);
router.put('/:id/status', auth, admin, complaintController.updateStatus);

module.exports = router;
