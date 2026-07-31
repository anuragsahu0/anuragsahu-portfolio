const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getMessages,
  markMessageRead,
  archiveMessage,
  getActivityLogs,
} = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');

router.get('/admin/dashboard', verifyToken, getAdminDashboardStats);
router.get('/admin/messages', verifyToken, getMessages);
router.put('/admin/messages/:id/read', verifyToken, markMessageRead);
router.put('/admin/messages/:id/archive', verifyToken, archiveMessage);
router.get('/admin/logs', verifyToken, getActivityLogs);

module.exports = router;
