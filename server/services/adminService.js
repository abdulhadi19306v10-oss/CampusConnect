const userRepository = require('../repositories/userRepository');
const facilityRepository = require('../repositories/facilityRepository');
const courseRepository = require('../repositories/courseRepository');
const bookingRepository = require('../repositories/bookingRepository');
const complaintRepository = require('../repositories/complaintRepository');
const timetableRepository = require('../repositories/timetableRepository');

class AdminService {
  async getDashboardStats() {
    const students = await userRepository.countStudents();
    const courses = await courseRepository.count();
    const facilities = await facilityRepository.count();
    const pendingBookings = await bookingRepository.countPending();
    const openComplaints = await complaintRepository.countOpen();
    
    return {
      totalStudents: students,
      totalCourses: courses,
      totalFacilities: facilities,
      pendingBookings: pendingBookings,
      openComplaints: openComplaints
    };
  }
  
  async getAllStudents() {
      return await userRepository.findAllStudents();
  }
  
  async updateUser(id, data) {
      if (data.password) {
          const bcrypt = require("bcryptjs");
          data.password = await bcrypt.hash(data.password, 10);
      }
      return await userRepository.update(id, data);
  }

  async deleteUser(id) {
      return await userRepository.delete(id);
  }

  async getAllFaculty() {
      return await userRepository.findAllFaculty();
  }
  
  // Facilities
  async addFacility(data) {
      return await facilityRepository.create(data);
  }

  // Timetable
  async getTimetable() {
      return await timetableRepository.findAll();
  }
}

module.exports = new AdminService();
