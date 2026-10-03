import os

repo_dir = 'server/repositories'
db_file = 'server/config/db.js'

db_content = """const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};
module.exports = { connectDB };
"""

user_repo = """const User = require('../models/User');

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
"""

course_repo = """const Course = require('../models/Course');

class CourseRepository {
  async create(courseData) {
    const course = new Course(courseData);
    return await course.save();
  }
  async findAll() {
    return await Course.find();
  }
  async findById(id) {
    return await Course.findById(id);
  }
  async update(id, updateData) {
    return await Course.findByIdAndUpdate(id, updateData, { new: true });
  }
  async delete(id) {
    return await Course.findByIdAndDelete(id);
  }
  async count() {
    return await Course.countDocuments();
  }
  async incrementEnrollment(id) {
    return await Course.findByIdAndUpdate(id, { $inc: { enrolledCount: 1 } });
  }
  async decrementEnrollment(id) {
    return await Course.findByIdAndUpdate(id, { $inc: { enrolledCount: -1 } });
  }
}
module.exports = new CourseRepository();
"""

announcement_repo = """const Announcement = require('../models/Announcement');

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
  async update(id, data) {
    return await Announcement.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id) {
    return await Announcement.findByIdAndDelete(id);
  }
}
module.exports = new AnnouncementRepository();
"""

booking_repo = """const Booking = require('../models/Booking');

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
"""

complaint_repo = """const Complaint = require('../models/Complaint');

class ComplaintRepository {
  async create(data) {
    const complaint = new Complaint(data);
    return await complaint.save();
  }
  async findAll() {
    return await Complaint.find().populate('studentId', 'name studentId email');
  }
  async findByStudent(studentId) {
    return await Complaint.find({ studentId });
  }
  async findById(id) {
    return await Complaint.findById(id);
  }
  async update(id, data) {
    return await Complaint.findByIdAndUpdate(id, data, { new: true });
  }
  async countOpen() {
    return await Complaint.countDocuments({ status: 'OPEN' });
  }
}
module.exports = new ComplaintRepository();
"""

enrollment_repo = """const Enrollment = require('../models/Enrollment');

class EnrollmentRepository {
  async create(studentId, courseId) {
    const enrollment = new Enrollment({ studentId, courseId });
    return await enrollment.save();
  }
  async findByStudent(studentId) {
    return await Enrollment.find({ studentId, status: 'ENROLLED' }).populate('courseId');
  }
  async findByCourse(courseId) {
    return await Enrollment.find({ courseId, status: 'ENROLLED' }).populate('studentId', 'name studentId email');
  }
  async findOne(studentId, courseId) {
    return await Enrollment.findOne({ studentId, courseId, status: 'ENROLLED' });
  }
  async delete(studentId, courseId) {
    return await Enrollment.findOneAndDelete({ studentId, courseId });
  }
}
module.exports = new EnrollmentRepository();
"""

facility_repo = """const Facility = require('../models/Facility');

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
"""

timetable_repo = """const Timetable = require('../models/Timetable');

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
"""

with open(db_file, 'w') as f:
    f.write(db_content)

repos = {
    'userRepository.js': user_repo,
    'courseRepository.js': course_repo,
    'announcementRepository.js': announcement_repo,
    'bookingRepository.js': booking_repo,
    'complaintRepository.js': complaint_repo,
    'enrollmentRepository.js': enrollment_repo,
    'facilityRepository.js': facility_repo,
    'timetableRepository.js': timetable_repo
}

for name, content in repos.items():
    with open(os.path.join(repo_dir, name), 'w') as f:
        f.write(content)

print("All repositories rewritten.")
