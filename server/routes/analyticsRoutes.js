const express = require('express');
const router = express.Router();
const {
  trackEvent,
  checkVpnEndpoint,
  reverseGeocodeEndpoint,
  getAnalyticsSummary,
  getRealtimeAnalytics,
  getIpLogs,
  clearIpLogs,
  syncVault,
} = require('../controllers/analyticsController');

router.post('/analytics/track', trackEvent);
router.get('/analytics/reverse-geocode', reverseGeocodeEndpoint);
router.post('/analytics/reverse-geocode', reverseGeocodeEndpoint);
router.get('/security/vpn-check', checkVpnEndpoint);
router.post('/security/vpn-check', checkVpnEndpoint);
router.post('/analytics/sync-vault', syncVault);
router.post('/admin/analytics/sync-vault', syncVault);
router.get('/analytics/summary', getAnalyticsSummary);
router.get('/analytics/realtime', getRealtimeAnalytics);
router.get('/admin/analytics/realtime', getRealtimeAnalytics);
router.get('/analytics/ip-logs', getIpLogs);
router.get('/admin/analytics/ip-logs', getIpLogs);
router.delete('/admin/analytics/ip-logs', clearIpLogs);

module.exports = router;
