const express = require('express');
const router = express.Router();
const { getAll, upsert } = require('../controllers/settingsController');
const { verifyToken } = require('../middleware/auth');

// Public
router.get('/settings', getAll);

// Admin (protected)
router.put('/admin/settings', verifyToken, upsert);

module.exports = router;
