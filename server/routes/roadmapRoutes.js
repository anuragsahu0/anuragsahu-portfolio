const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/roadmapController');
const { verifyToken } = require('../middleware/auth');

// Public
router.get('/roadmap', getAll);
router.get('/roadmap/:id', getOne);
router.put('/roadmap/:id', update);

// Admin (protected)
router.post('/admin/roadmap', verifyToken, create);
router.put('/admin/roadmap/:id', update);
router.delete('/admin/roadmap/:id', verifyToken, remove);

module.exports = router;
