const Timetable = require('../models/Timetable');

class TimetableRepository {
  async create(data) {
    const timetable = new Timetable(data);
    return await timetable.save();
  }
  async findAll() {
    return await Timetable.find().populate('courseId');
  }
  async findById(id) {
    return await Timetable.findById(id);
  }
  async update(id, data) {
    return await Timetable.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id) {
    return await Timetable.findByIdAndDelete(id);
  }
}
module.exports = new TimetableRepository();
