const complaintService = require('../services/complaintService');

exports.submitComplaint = async (req, res) => {
  try {
    const data = { ...req.body, studentId: req.user.id };
    const complaint = await complaintService.submitComplaint(data);
    res.status(201).json({ success: true, data: complaint, message: 'Complaint submitted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.myComplaints = async (req, res) => {
  try {
    const complaints = await complaintService.getStudentComplaints(req.user.id);
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await complaintService.getAllComplaints();
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const complaint = await complaintService.updateComplaintStatus(req.params.id, req.body.status, req.body.adminResponse);
    res.json({ success: true, data: complaint, message: 'Complaint updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
