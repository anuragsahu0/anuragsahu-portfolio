const express = require('express');
const router = express.Router();
const { trackEvent, getAnalyticsSummary, getRealtimeAnalytics } = require('../controllers/analyticsController');

router.post('/analytics/track', trackEvent);
router.get('/analytics/summary', getAnalyticsSummary);
router.get('/analytics/realtime', getRealtimeAnalytics);
router.get('/admin/analytics/realtime', getRealtimeAnalytics);

module.exports = router;
