const express = require('express');
const router = express.Router();
const { trackEvent, getAnalyticsSummary } = require('../controllers/analyticsController');

router.post('/analytics/track', trackEvent);
router.get('/analytics/summary', getAnalyticsSummary);

module.exports = router;
