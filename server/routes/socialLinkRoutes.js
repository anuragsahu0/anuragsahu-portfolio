const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/socialLinkController');
const { verifyToken } = require('../middleware/auth');

// Public
router.get('/social-links', getAll);

// Admin (protected)
router.post('/admin/social-links', verifyToken, create);
router.put('/admin/social-links/:id', verifyToken, update);
router.delete('/admin/social-links/:id', verifyToken, remove);

module.exports = router;
