import os

# 1. Update attendanceController.js
controller_path = 'server/controllers/attendanceController.js'
with open(controller_path, 'r') as f:
    controller = f.read()

if 'getCourseStats' not in controller:
    new_methods = """
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
"""
    controller += new_methods
    with open(controller_path, 'w') as f:
        f.write(controller)

# 2. Update attendance.js routes
routes_path = 'server/routes/attendance.js'
with open(routes_path, 'r') as f:
    routes = f.read()

if '/course/:courseId/stats' not in routes:
    routes = routes.replace('module.exports = router;', "router.get('/course/:courseId/stats', auth, attendanceController.getCourseStats);\n\nmodule.exports = router;")
    with open(routes_path, 'w') as f:
        f.write(routes)

print("Backend stats endpoint added")
