const Announcement = require('../models/Announcement');

class AnnouncementRepository {
  async create(data) {
    const announcement = new Announcement(data);
    return await announcement.save();
  }
  async findAll() {
    return await Announcement.find().sort({ createdAt: -1 }).populate('author', 'name');
  }
  async findById(id) {
    return await Announcement.findById(id).populate('author', 'name');
  }
  async findPublished() {
    return await Announcement.find({ isPublished: true }).sort({ date: -1 }).populate('author', 'name');
  }
  async update(id, data) {
    return await Announcement.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id) {
    return await Announcement.findByIdAndDelete(id);
  }
}
module.exports = new AnnouncementRepository();
