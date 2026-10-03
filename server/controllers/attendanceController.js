const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body;
    // records is array of { studentId, status }
    
    
    // Upsert each record, but use the exact current time mixed with selected date to ensure uniqueness 
    // or just use create() to allow multiple saves. We'll use create to satisfy the user's testing.
    const now = new Date();
    const attendanceDate = new Date(date);
    // Mix the selected date with the current time so it's unique per save click
    attendanceDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    
    for (const record of records) {
        const newAtt = new Attendance({
            student: record.studentId,
            course: courseId,
            date: attendanceDate,
            status: record.status
        });
        await newAtt.save();
    }
    res.json({ success: true, message: 'Attendance saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id }).populate('course', 'courseCode title');
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseStats = async (req, res) => {
  try {
    const records = await Attendance.find({ course: req.params.courseId });
    // Aggregate by student
    const stats = {};
    records.forEach(r => {
        if(!stats[r.student]) stats[r.student] = { present: 0, absent: 0, late: 0, total: 0 };
        stats[r.student].total++;
        if(r.status === 'Present') stats[r.student].present++;
        else if(r.status === 'Absent') stats[r.student].absent++;
        else if(r.status === 'Late') stats[r.student].late++;
    });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
