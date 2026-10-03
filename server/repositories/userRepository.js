const User = require('../models/User');

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }
  async findByEmail(email) {
    return await User.findOne({ email });
  }
  async findById(id) {
    return await User.findById(id).select('-password');
  }
  async findAllStudents() {
    return await User.find({ role: 'STUDENT' }).select('-password');
  }
  async findAllFaculty() {
    return await User.find({ role: 'FACULTY' }).select('-password');
  }
  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
  async countStudents() {
    return await User.countDocuments({ role: 'STUDENT' });
  }
}
module.exports = new UserRepository();
