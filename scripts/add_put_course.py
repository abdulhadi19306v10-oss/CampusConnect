import os

# 1. Update courseController.js
controller_path = 'server/controllers/courseController.js'
with open(controller_path, 'r') as f:
    controller = f.read()

if 'updateCourse' not in controller:
    new_method = """
exports.updateCourse = async (req, res) => {
  try {
    const Course = require('../models/Course');
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
"""
    with open(controller_path, 'a') as f:
        f.write(new_method)

# 2. Update courses.js routes
routes_path = 'server/routes/courses.js'
with open(routes_path, 'r') as f:
    routes = f.read()

if 'router.put' not in routes:
    routes = routes.replace(
        'module.exports = router;',
        "router.put('/:id', auth, admin, courseController.updateCourse);\n\nmodule.exports = router;"
    )
    with open(routes_path, 'w') as f:
        f.write(routes)

print("Backend API for PUT /courses/:id added")
