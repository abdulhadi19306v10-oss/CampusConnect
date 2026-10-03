const bookingRepository = require('../repositories/bookingRepository');
const facilityRepository = require('../repositories/facilityRepository');

class BookingService {
  async getAllFacilities() {
    return await facilityRepository.findAll();
  }

  async createBooking(data) {
    const facility = await facilityRepository.findById(data.facilityId);
    if (!facility || !facility.isActive) {
      throw new Error('Facility is not available');
    }

    const conflict = await bookingRepository.findOverlapping(data.facilityId, data.date, data.startTime, data.endTime);
    if (conflict) {
      throw new Error('Facility is already booked for this time');
    }

    return await bookingRepository.create(data);
  }

  async getStudentBookings(studentId) {
    return await bookingRepository.findByStudent(studentId);
  }

  async getAllBookings() {
    return await bookingRepository.findAll();
  }

  async updateBookingStatus(id, status) {
    return await bookingRepository.update(id, { status });
  }
  
  async cancelBooking(id, studentId) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new Error('Booking not found');
    if (booking.studentId.toString() !== studentId.toString()) {
      throw new Error('Not authorized to cancel this booking');
    }
    if (booking.status !== 'PENDING' && booking.status !== 'APPROVED') {
      throw new Error('Booking cannot be cancelled in its current state');
    }
    return await bookingRepository.update(id, { status: 'CANCELLED' });
  }
}

module.exports = new BookingService();
