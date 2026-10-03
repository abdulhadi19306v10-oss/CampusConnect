const adminService = require('../services/adminService');

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
      const students = await adminService.getAllStudents();
      res.json({ success: true, data: students });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
}

exports.getFaculty = async (req, res) => {
  try {
      const faculty = await adminService.getAllFaculty();
      res.json({ success: true, data: faculty });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
}

exports.updateUser = async (req, res) => {
  try {
      const user = await adminService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user, message: 'User updated successfully' });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
}

exports.deleteUser = async (req, res) => {
  try {
      await adminService.deleteUser(req.params.id);
      res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
}
