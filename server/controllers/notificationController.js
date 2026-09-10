const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const FALLBACK_NOTIFICATIONS = [
  {
    _id: 'notif-1',
    type: 'SYSTEM',
    title: 'Control Center v2.0 Online',
    message: 'Anurag Sahu Control Center CMS backend architecture is operational.',
    isRead: false,
    createdAt: new Date(),
  },
];

const getNotifications = async (req, res, next) => {
  try {
    const { unreadOnly } = req.query;
    const filter = {};
    if (unreadOnly === 'true') filter.isRead = false;

    let notifications = [];
    try {
      if (Notification.db && Notification.db.readyState === 1) {
        notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50).lean();
      }
    } catch (dbErr) {}

    if (!notifications || notifications.length === 0) {
      notifications = FALLBACK_NOTIFICATIONS;
    }

    return sendSuccess(res, { count: notifications.length, notifications });
  } catch (err) {
    next(err);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    let notif = null;

    try {
      if (Notification.db && Notification.db.readyState === 1) {
        notif = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
      }
    } catch (dbErr) {}

    if (!notif) {
      const item = FALLBACK_NOTIFICATIONS.find((n) => n._id === id);
      if (item) {
        item.isRead = true;
        notif = item;
      }
    }

    return sendSuccess(res, notif || { _id: id, isRead: true });
  } catch (err) {
    next(err);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (Notification.db && Notification.db.readyState === 1) {
        deleted = await Notification.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = FALLBACK_NOTIFICATIONS.findIndex((n) => n._id === id);
      if (idx !== -1) {
        deleted = FALLBACK_NOTIFICATIONS.splice(idx, 1)[0];
      }
    }

    return sendSuccess(res, { message: 'Notification removed.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
  deleteNotification,
};
