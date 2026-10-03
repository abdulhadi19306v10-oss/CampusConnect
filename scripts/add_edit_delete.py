import os

# 1. Update adminService.js
service_path = 'server/services/adminService.js'
with open(service_path, 'r') as f:
    service = f.read()

if 'updateUser' not in service:
    service = service.replace(
        'async getAllFaculty() {',
        'async updateUser(id, data) {\n      if (data.password) {\n          const bcrypt = require("bcryptjs");\n          data.password = await bcrypt.hash(data.password, 10);\n      }\n      return await userRepository.update(id, data);\n  }\n\n  async deleteUser(id) {\n      return await userRepository.delete(id);\n  }\n\n  async getAllFaculty() {'
    )
    with open(service_path, 'w') as f:
        f.write(service)

# 2. Update adminController.js
controller_path = 'server/controllers/adminController.js'
with open(controller_path, 'r') as f:
    controller = f.read()

if 'updateUser' not in controller:
    new_methods = """
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
"""
    with open(controller_path, 'a') as f:
        f.write(new_methods)

# 3. Update admin.js routes
routes_path = 'server/routes/admin.js'
with open(routes_path, 'r') as f:
    routes = f.read()

if 'router.put' not in routes:
    routes = routes.replace(
        'module.exports = router;',
        "router.put('/users/:id', auth, admin, adminController.updateUser);\nrouter.delete('/users/:id', auth, admin, adminController.deleteUser);\n\nmodule.exports = router;"
    )
    with open(routes_path, 'w') as f:
        f.write(routes)

# 4. Update api.js
api_path = 'client/js/api.js'
with open(api_path, 'r') as f:
    api = f.read()

if 'updateUser' not in api:
    api = api.replace(
        'getFaculty: () => $.get(`${API_URL}/admin/faculty`),',
        'getFaculty: () => $.get(`${API_URL}/admin/faculty`),\n  updateUser: (id, data) => $.ajax({ url: `${API_URL}/admin/users/${id}`, type: "PUT", data: JSON.stringify(data), contentType: "application/json" }),\n  deleteUser: (id) => $.ajax({ url: `${API_URL}/admin/users/${id}`, type: "DELETE" }),'
    )
    with open(api_path, 'w') as f:
        f.write(api)

print("Backend APIs and frontend API connector updated successfully")
