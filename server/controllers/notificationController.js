const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const FALLBACK_NOTIFICATIONS = [
  {
    _id: 'notif-1',
    type: 'SYSTEM',
    title: 'Control Center v2.0 Online',
    message: 'Anurag Sahu Control Center CMS backend architecture is operational.',
    isRead: false,
    link: '/admin',
    createdAt: new Date(),
  },
];

/**
 * GET /api/admin/notifications
 * List notifications with unread count, pagination, and unreadOnly filter
 */
const getNotifications = async (req, res, next) => {
  try {
    const { unreadOnly, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (unreadOnly === 'true' || unreadOnly === true) {
      filter.isRead = false;
    }

    let notifications = [];
    let total = 0;
    let unreadCount = 0;

    try {
      if (Notification.db && Notification.db.readyState === 1) {
        const skip = (Number(page) - 1) * Number(limit);
        const [docs, count, unread] = await Promise.all([
          Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
          Notification.countDocuments(filter),
          Notification.countDocuments({ isRead: false }),
        ]);
        notifications = docs;
        total = count;
        unreadCount = unread;
      }
    } catch (dbErr) {
      console.warn('[getNotifications] DB warning:', dbErr.message);
    }

    if (!notifications || notifications.length === 0) {
      let filtered = [...FALLBACK_NOTIFICATIONS];
      if (unreadOnly === 'true' || unreadOnly === true) {
        filtered = filtered.filter((n) => !n.isRead);
      }
      total = filtered.length;
      unreadCount = FALLBACK_NOTIFICATIONS.filter((n) => !n.isRead).length;

      const skip = (Number(page) - 1) * Number(limit);
      notifications = filtered.slice(skip, skip + Number(limit));
    }

    return sendSuccess(res, {
      total,
      page: Number(page),
      limit: Number(limit),
      unreadCount,
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/notifications/:id/read
 * Mark a single notification as read
 */
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
      const item = FALLBACK_NOTIFICATIONS.find((n) => String(n._id) === String(id));
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

/**
 * POST /api/admin/notifications/read-all
 * Mark all unread notifications as read
 */
const markAllNotificationsRead = async (req, res, next) => {
  try {
    let modifiedCount = 0;

    try {
      if (Notification.db && Notification.db.readyState === 1) {
        const result = await Notification.updateMany({ isRead: false }, { isRead: true });
        modifiedCount = result.modifiedCount || 0;
      }
    } catch (dbErr) {}

    FALLBACK_NOTIFICATIONS.forEach((n) => {
      if (!n.isRead) {
        n.isRead = true;
        modifiedCount++;
      }
    });

    return sendSuccess(res, {
      message: 'All notifications marked as read.',
      modifiedCount,
      unreadCount: 0,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/notifications/:id
 * Remove a notification
 */
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
      const idx = FALLBACK_NOTIFICATIONS.findIndex((n) => String(n._id) === String(id));
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
  markAllNotificationsRead,
  deleteNotification,
};
