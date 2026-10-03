const Facility = require('../models/Facility');

class FacilityRepository {
  async create(data) {
    const facility = new Facility(data);
    return await facility.save();
  }
  async findAll() {
    return await Facility.find();
  }
  async findById(id) {
    return await Facility.findById(id);
  }
  async update(id, data) {
    return await Facility.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id) {
    return await Facility.findByIdAndDelete(id);
  }
  async count() {
    return await Facility.countDocuments();
  }
}
module.exports = new FacilityRepository();
