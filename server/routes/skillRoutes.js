const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/skillController');
const { verifyToken } = require('../middleware/auth');

// Public
router.get('/skills', getAll);
router.get('/skills/:id', getOne);

// Admin (protected)
router.post('/admin/skills', verifyToken, create);
router.put('/admin/skills/:id', verifyToken, update);
router.delete('/admin/skills/:id', verifyToken, remove);

module.exports = router;
