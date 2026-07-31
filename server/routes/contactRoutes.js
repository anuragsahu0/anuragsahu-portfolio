const express = require('express');
const router = express.Router();
const { handleContactForm } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

// POST /api/contact
router.post('/contact', contactLimiter, handleContactForm);

module.exports = router;

