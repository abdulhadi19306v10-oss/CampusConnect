const Booking = require('../models/Booking');

class BookingRepository {
  async create(data) {
    const booking = new Booking(data);
    return await booking.save();
  }
  async findAll() {
    return await Booking.find().populate('studentId', 'name studentId email').populate('facilityId', 'name type');
  }
  async findByStudent(studentId) {
    return await Booking.find({ studentId }).populate('facilityId', 'name type');
  }
  async findById(id) {
    return await Booking.findById(id);
  }
  async update(id, data) {
    return await Booking.findByIdAndUpdate(id, data, { new: true });
  }
  async countPending() {
    return await Booking.countDocuments({ status: 'PENDING' });
  }
  async findOverlapping(facilityId, date, startTime, endTime) {
    return await Booking.findOne({
      facilityId,
      date,
      status: { $in: ['PENDING', 'APPROVED'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });
  }
}
module.exports = new BookingRepository();
