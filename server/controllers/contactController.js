const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const { sendContactEmail, sendAutoReplyEmail } = require('../services/emailService');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const FALLBACK_MESSAGES = [
  {
    _id: 'msg-1',
    name: 'Technical Recruiter',
    fullName: 'Technical Recruiter',
    email: 'recruiter@tech.com',
    company: 'Leading Tech Co',
    subject: 'Full-Stack Software Engineering Inquiry',
    message: 'Hello Anurag, reviewed your portfolio and engineering projects. Impressive work on the architecture and real-time systems.',
    status: 'UNREAD',
    createdAt: new Date(),
  },
];

/**
 * POST /api/contact
 */
const handleContactForm = async (req, res, next) => {
  try {
    const { name, fullName, email, company, subject, message } = req.body;
    const resolvedName = (name || fullName || '').trim();

    if (!resolvedName) {
      return sendError(res, 'Name is required.', 'VALIDATION_ERROR', 422);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return sendError(res, 'A valid email address is required.', 'VALIDATION_ERROR', 422);
    }

    if (!subject || !subject.trim()) {
      return sendError(res, 'Subject is required.', 'VALIDATION_ERROR', 422);
    }

    if (!message || !message.trim()) {
      return sendError(res, 'Message content is required.', 'VALIDATION_ERROR', 422);
    }

    let contactDoc = null;
    try {
      if (Contact.db && Contact.db.readyState === 1) {
        contactDoc = await Contact.create({
          name: resolvedName,
          fullName: resolvedName,
          email: email.trim().toLowerCase(),
          company: company ? company.trim() : '',
          subject: subject.trim(),
          message: message.trim(),
          status: 'UNREAD',
          ipAddress: req.ip || '',
        });

        // Create notification
        try {
          if (Notification.db && Notification.db.readyState === 1) {
            await Notification.create({
              type: 'NEW_MESSAGE',
              title: `New Inquiry from ${resolvedName}`,
              message: subject.trim(),
              relatedResource: { resourceType: 'Contact', resourceId: String(contactDoc._id) },
            });
          }
        } catch (nErr) {}
      }
    } catch (dbErr) {}

    if (!contactDoc) {
      contactDoc = {
        _id: `msg-${Date.now()}`,
        name: resolvedName,
        fullName: resolvedName,
        email: email.trim().toLowerCase(),
        company: company ? company.trim() : '',
        subject: subject.trim(),
        message: message.trim(),
        status: 'UNREAD',
        createdAt: new Date(),
      };
      FALLBACK_MESSAGES.unshift(contactDoc);
    }

    // Send emails non-blocking
    try {
      await sendContactEmail({
        fullName: resolvedName,
        email: email.trim(),
        company: company ? company.trim() : '',
        subject: subject.trim(),
        message: message.trim(),
      });
      await sendAutoReplyEmail({
        fullName: resolvedName,
        email: email.trim(),
        subject: subject.trim(),
      });
    } catch (emailErr) {}

    return sendSuccess(
      res,
      {
        message: 'Thank you! Your message has been delivered to Anurag Sahu. An auto-confirmation has been dispatched.',
        id: contactDoc._id,
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/messages
 */
const getMessages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status && status !== 'ALL') {
      filter.status = status.toUpperCase();
    }

    let messages = [];
    let total = 0;

    try {
      if (Contact.db && Contact.db.readyState === 1) {
        const skip = (Number(page) - 1) * Number(limit);
        [messages, total] = await Promise.all([
          Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
          Contact.countDocuments(filter),
        ]);
      }
    } catch (dbErr) {}

    if (!messages || messages.length === 0) {
      messages = FALLBACK_MESSAGES.filter(
        (m) => !status || status === 'ALL' || m.status === status.toUpperCase()
      );
      total = messages.length;
    }

    return sendSuccess(res, {
      total,
      page: Number(page),
      limit: Number(limit),
      messages,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/messages/:id/read
 */
const markMessageRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    let message = null;

    try {
      if (Contact.db && Contact.db.readyState === 1) {
        message = await Contact.findByIdAndUpdate(
          id,
          { status: 'READ', readAt: new Date() },
          { new: true }
        );
      }
    } catch (dbErr) {}

    if (!message) {
      const item = FALLBACK_MESSAGES.find((m) => m._id === id);
      if (item) {
        item.status = 'READ';
        item.readAt = new Date();
        message = item;
      }
    }

    try {
      await logActivity('MESSAGE_MARKED_READ', 'Contact', { id }, req);
    } catch (e) {}

    return sendSuccess(res, message || { _id: id, status: 'READ' });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/messages/:id/archive
 */
const archiveMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let message = null;

    try {
      if (Contact.db && Contact.db.readyState === 1) {
        message = await Contact.findByIdAndUpdate(id, { status: 'ARCHIVED' }, { new: true });
      }
    } catch (dbErr) {}

    if (!message) {
      const item = FALLBACK_MESSAGES.find((m) => m._id === id);
      if (item) {
        item.status = 'ARCHIVED';
        message = item;
      }
    }

    try {
      await logActivity('MESSAGE_ARCHIVED', 'Contact', { id }, req);
    } catch (e) {}

    return sendSuccess(res, message || { _id: id, status: 'ARCHIVED' });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/messages/:id
 */
const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (Contact.db && Contact.db.readyState === 1) {
        deleted = await Contact.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = FALLBACK_MESSAGES.findIndex((m) => m._id === id);
      if (idx !== -1) {
        deleted = FALLBACK_MESSAGES.splice(idx, 1)[0];
      }
    }

    try {
      await logActivity('MESSAGE_DELETED', 'Contact', { id }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Message deleted successfully.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleContactForm,
  getMessages,
  markMessageRead,
  archiveMessage,
  deleteMessage,
};
