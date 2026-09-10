const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { loginRules, validate } = require('../middleware/validate');

router.post('/auth/login', authLimiter, loginRules, validate, login);
router.post('/auth/logout', logout);
router.get('/auth/me', verifyToken, getMe);

module.exports = router;
