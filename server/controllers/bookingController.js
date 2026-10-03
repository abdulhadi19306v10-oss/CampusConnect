const bookingService = require('../services/bookingService');

exports.getFacilities = async (req, res) => {
  try {
    const facilities = await bookingService.getAllFacilities();
    res.json({ success: true, data: facilities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const data = { ...req.body, studentId: req.user.id };
    const booking = await bookingService.createBooking(data);
    res.status(201).json({ success: true, data: booking, message: 'Booking submitted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.myBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getStudentBookings(req.user.id);
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
    res.json({ success: true, data: booking, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
    res.json({ success: true, data: booking, message: 'Status updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
