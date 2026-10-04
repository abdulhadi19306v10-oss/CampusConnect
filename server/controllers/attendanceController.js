const Attendance = require('../models/Attendance');

// Mark or update attendance for a course on a specific date (idempotent)
exports.markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body;
    if (!courseId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: courseId, date, and records array required' });
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Remove any existing records for this course on this day to avoid duplicate entries
    await Attendance.deleteMany({
      course: courseId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const now = new Date();
    targetDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    const docsToInsert = records.map(r => ({
      student: r.studentId,
      course: courseId,
      date: targetDate,
      status: r.status || 'Present'
    }));

    if (docsToInsert.length > 0) {
      await Attendance.insertMany(docsToInsert);
    }

    res.json({
      success: true,
      message: `Attendance successfully saved for ${docsToInsert.length} students.`,
      count: docsToInsert.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student's personal attendance records
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id })
      .populate('course', 'courseCode title')
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Course cumulative stats per student
exports.getCourseStats = async (req, res) => {
  try {
    const records = await Attendance.find({ course: req.params.courseId });
    const stats = {};
    records.forEach(r => {
      const sId = r.student.toString();
      if (!stats[sId]) stats[sId] = { present: 0, absent: 0, late: 0, total: 0 };
      stats[sId].total++;
      if (r.status === 'Present') stats[sId].present++;
      else if (r.status === 'Absent') stats[sId].absent++;
      else if (r.status === 'Late') stats[sId].late++;
    });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get attendance records for a specific date and course (for terminal pre-population)
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { courseId, date } = req.params;
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      course: courseId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('student', 'name studentId email');

    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get session history for a course (past dates with attendance summaries)
exports.getCourseHistory = async (req, res) => {
  try {
    const records = await Attendance.find({ course: req.params.courseId }).sort({ date: -1 });

    const sessionMap = {};
    records.forEach(r => {
      const dateStr = new Date(r.date).toISOString().split('T')[0];
      if (!sessionMap[dateStr]) {
        sessionMap[dateStr] = {
          date: dateStr,
          rawDate: r.date,
          total: 0,
          present: 0,
          absent: 0,
          late: 0
        };
      }
      sessionMap[dateStr].total++;
      if (r.status === 'Present') sessionMap[dateStr].present++;
      else if (r.status === 'Absent') sessionMap[dateStr].absent++;
      else if (r.status === 'Late') sessionMap[dateStr].late++;
    });

    const sessions = Object.values(sessionMap).sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
