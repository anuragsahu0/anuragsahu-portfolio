const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/educationController');
const { verifyToken } = require('../middleware/auth');

// Public
router.get('/education', getAll);

// Admin (protected)
router.post('/admin/education', verifyToken, create);
router.put('/admin/education/:id', verifyToken, update);
router.delete('/admin/education/:id', verifyToken, remove);

module.exports = router;
