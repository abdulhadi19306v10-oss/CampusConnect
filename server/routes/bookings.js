const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, admin } = require('../middleware/authMiddleware');

router.get('/facilities', bookingController.getFacilities);
router.get('/my-bookings', auth, bookingController.myBookings);
router.post('/', auth, bookingController.createBooking);
router.put('/:id/cancel', auth, bookingController.cancelBooking);

// Admin only
router.get('/', auth, admin, bookingController.getAllBookings);
router.put('/:id/status', auth, admin, bookingController.updateStatus);

module.exports = router;
