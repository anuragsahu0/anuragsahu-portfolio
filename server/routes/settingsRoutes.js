const express = require('express');
const router = express.Router();
const { getAll, upsert } = require('../controllers/settingsController');
const { verifyToken } = require('../middleware/auth');

// Public & Global Sync
router.get('/settings', getAll);
router.post('/settings', upsert);
router.put('/settings', upsert);

// Admin (protected)
router.put('/admin/settings', verifyToken, upsert);

module.exports = router;
