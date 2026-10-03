const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, admin } = require('../middleware/authMiddleware');

router.get('/stats', auth, admin, adminController.getDashboardStats);
router.get('/students', auth, admin, adminController.getStudents);
router.get('/faculty', auth, admin, adminController.getFaculty);

router.put('/users/:id', auth, admin, adminController.updateUser);
router.delete('/users/:id', auth, admin, adminController.deleteUser);

module.exports = router;
