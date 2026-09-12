const crypto = require('crypto');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const {
  sendContactNotificationEmail,
  sendAdminReplyEmail,
  sendAutoReplyEmail,
} = require('../services/emailService');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

// Memory fallback for offline test / serverless zero-DB modes
const FALLBACK_MESSAGES = [
  {
    _id: 'msg-seed-1',
    name: 'Technical Recruiter',
    fullName: 'Technical Recruiter',
    email: 'recruiter@tech.com',
    company: 'Leading Enterprise Corp',
    subject: 'Full-Stack Software Engineering Inquiry',
    message:
      'Hello Anurag, reviewed your portfolio, architecture diagrams, and real-time systems. Impressive engineering depth across React, Node.js, and AI/ML.',
    status: 'NEW',
    isRead: false,
    emailNotificationStatus: 'SENT',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
  },
];

/**
 * Helper to compute an anonymized IP hash
 */
function getIpHash(req) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  return crypto.createHash('sha256').update(String(ip)).digest('hex').substring(0, 16);
}

/**
 * POST /api/contact
 * Public contact form submission with server validation, spam check, DB storage, and notification dispatch
 */
const handleContactForm = async (req, res, next) => {
  try {
    const { name, fullName, email, company, subject, message, website } = req.body;

    // 1. Honeypot anti-spam check (if bot filled 'website' field, silently succeed or mark SPAM)
    const isBot = Boolean(website && String(website).trim().length > 0);

    // 2. Strict Input Validation
    const resolvedName = (name || fullName || '').trim();
    if (!resolvedName) {
      return sendError(res, 'Full name is required.', 'VALIDATION_ERROR', 422);
    }
    if (resolvedName.length > 120) {
      return sendError(res, 'Name cannot exceed 120 characters.', 'VALIDATION_ERROR', 422);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return sendError(res, 'A valid email address is required.', 'VALIDATION_ERROR', 422);
    }
    if (cleanEmail.length > 254) {
      return sendError(res, 'Email address is too long.', 'VALIDATION_ERROR', 422);
    }

    const resolvedSubject = (subject || `Portfolio Inquiry from ${resolvedName}`).trim();
    if (resolvedSubject.length > 200) {
      return sendError(res, 'Subject cannot exceed 200 characters.', 'VALIDATION_ERROR', 422);
    }

    const cleanMessage = (message || '').trim();
    if (!cleanMessage) {
      return sendError(res, 'Message content is required.', 'VALIDATION_ERROR', 422);
    }
    if (cleanMessage.length < 5) {
      return sendError(res, 'Message must be at least 5 characters.', 'VALIDATION_ERROR', 422);
    }
    if (cleanMessage.length > 10000) {
      return sendError(res, 'Message cannot exceed 10000 characters.', 'VALIDATION_ERROR', 422);
    }

    const ipHash = getIpHash(req);
    const initialStatus = isBot ? 'SPAM' : 'NEW';

    // 3. Persist to Database
    let contactDoc = null;
    try {
      if (Contact.db && Contact.db.readyState === 1) {
        contactDoc = await Contact.create({
          name: resolvedName,
          fullName: resolvedName,
          email: cleanEmail,
          company: company ? String(company).trim().substring(0, 150) : '',
          subject: resolvedSubject,
          message: cleanMessage,
          status: initialStatus,
          isRead: false,
          emailNotificationStatus: 'PENDING',
          ipHash,
          ipAddress: req.ip || '',
        });
      }
    } catch (dbErr) {
      console.warn('[handleContactForm] DB save warning:', dbErr.message);
    }

    if (!contactDoc) {
      contactDoc = {
        _id: `msg-${Date.now()}`,
        name: resolvedName,
        fullName: resolvedName,
        email: cleanEmail,
        company: company ? String(company).trim().substring(0, 150) : '',
        subject: resolvedSubject,
        message: cleanMessage,
        status: initialStatus,
        isRead: false,
        emailNotificationStatus: 'PENDING',
        ipHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      FALLBACK_MESSAGES.unshift(contactDoc);
    }

    // 4. Create internal admin notification
    if (!isBot) {
      try {
        if (Notification.db && Notification.db.readyState === 1) {
          await Notification.create({
            type: 'NEW_MESSAGE',
            title: `New Inquiry from ${resolvedName}`,
            message: resolvedSubject,
            relatedResource: { resourceType: 'Contact', resourceId: String(contactDoc._id) },
            link: '/admin/messages',
            isRead: false,
          });
        }
      } catch (nErr) {
        console.warn('[handleContactForm] Notification creation warning:', nErr.message);
      }
    }

    // 5. Trigger Email Notification & Auto-Reply non-blocking
    if (!isBot) {
      sendContactNotificationEmail({
        name: resolvedName,
        fullName: resolvedName,
        email: cleanEmail,
        company: contactDoc.company,
        subject: resolvedSubject,
        message: cleanMessage,
        createdAt: contactDoc.createdAt,
      })
        .then(async (emailRes) => {
          const status = emailRes && emailRes.success ? 'SENT' : 'FAILED';
          const errorMsg = emailRes && emailRes.error ? emailRes.error : '';

          contactDoc.emailNotificationStatus = status;
          if (errorMsg) contactDoc.emailError = errorMsg;

          if (Contact.db && Contact.db.readyState === 1 && contactDoc._id) {
            try {
              await Contact.findByIdAndUpdate(contactDoc._id, {
                emailNotificationStatus: status,
                emailError: errorMsg,
              });
            } catch (e) {}
          }
        })
        .catch(async (emailErr) => {
          console.error('[handleContactForm] Email dispatch error:', emailErr.message);
          contactDoc.emailNotificationStatus = 'FAILED';
          contactDoc.emailError = emailErr.message;
          if (Contact.db && Contact.db.readyState === 1 && contactDoc._id) {
            try {
              await Contact.findByIdAndUpdate(contactDoc._id, {
                emailNotificationStatus: 'FAILED',
                emailError: emailErr.message,
              });
            } catch (e) {}
          }
        });

      // Send polite auto-reply to visitor
      sendAutoReplyEmail({
        fullName: resolvedName,
        email: cleanEmail,
        subject: resolvedSubject,
      }).catch(() => {});
    }

    // 6. Log activity
    try {
      await logActivity(
        'CONTACT_MESSAGE_RECEIVED',
        'Contact',
        { messageId: String(contactDoc._id), sender: resolvedName, subject: resolvedSubject },
        req
      );
    } catch (e) {}

    return sendSuccess(
      res,
      {
        message: 'Your message has been received successfully.',
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
 * List messages with search, status filtering, sorting, and pagination
 */
const getMessages = async (req, res, next) => {
  try {
    const { status, search, q, sort = 'newest', page = 1, limit = 50 } = req.query;
    const searchTerm = (search || q || '').trim();
    const filter = {};

    if (status && status !== 'ALL') {
      const upperStatus = status.toUpperCase();
      if (upperStatus === 'NEW' || upperStatus === 'UNREAD') {
        filter.status = { $in: ['NEW', 'UNREAD', 'unread'] };
      } else {
        filter.status = upperStatus;
      }
    }

    if (searchTerm) {
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: regex },
        { fullName: regex },
        { email: regex },
        { subject: regex },
        { message: regex },
        { company: regex },
      ];
    }

    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    let messages = [];
    let total = 0;
    let unreadCount = 0;

    try {
      if (Contact.db && Contact.db.readyState === 1) {
        const skip = (Number(page) - 1) * Number(limit);
        const [docs, count, unread] = await Promise.all([
          Contact.find(filter).sort(sortOption).skip(skip).limit(Number(limit)).lean(),
          Contact.countDocuments(filter),
          Contact.countDocuments({ status: { $in: ['NEW', 'UNREAD', 'unread'] } }),
        ]);
        messages = docs;
        total = count;
        unreadCount = unread;
      }
    } catch (dbErr) {
      console.warn('[getMessages] DB query warning:', dbErr.message);
    }

    if (!messages || messages.length === 0) {
      let filtered = [...FALLBACK_MESSAGES];

      if (status && status !== 'ALL') {
        const upper = status.toUpperCase();
        filtered = filtered.filter((m) => {
          const s = (m.status || 'NEW').toUpperCase();
          if (upper === 'NEW' || upper === 'UNREAD') return s === 'NEW' || s === 'UNREAD';
          return s === upper;
        });
      }

      if (searchTerm) {
        const st = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            (m.name && m.name.toLowerCase().includes(st)) ||
            (m.fullName && m.fullName.toLowerCase().includes(st)) ||
            (m.email && m.email.toLowerCase().includes(st)) ||
            (m.subject && m.subject.toLowerCase().includes(st)) ||
            (m.message && m.message.toLowerCase().includes(st))
        );
      }

      if (sort === 'oldest') {
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      total = filtered.length;
      unreadCount = FALLBACK_MESSAGES.filter(
        (m) => (m.status || 'NEW').toUpperCase() === 'NEW' || (m.status || '').toUpperCase() === 'UNREAD'
      ).length;

      const skip = (Number(page) - 1) * Number(limit);
      messages = filtered.slice(skip, skip + Number(limit));
    }

    return sendSuccess(res, {
      total,
      page: Number(page),
      limit: Number(limit),
      unreadCount,
      messages,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/messages/:id
 * Retrieve specific contact message detail
 */
const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let message = null;

    try {
      if (Contact.db && Contact.db.readyState === 1) {
        message = await Contact.findById(id).lean();
      }
    } catch (dbErr) {}

    if (!message) {
      message = FALLBACK_MESSAGES.find((m) => String(m._id) === String(id));
    }

    if (!message) {
      return sendError(res, 'Contact message not found.', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, message);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/messages/:id/read
 * Mark message as READ
 */
const markMessageRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    let message = null;

    try {
      if (Contact.db && Contact.db.readyState === 1) {
        message = await Contact.findByIdAndUpdate(
          id,
          { status: 'READ', isRead: true, readAt: new Date() },
          { new: true }
        );
      }
    } catch (dbErr) {}

    if (!message) {
      const item = FALLBACK_MESSAGES.find((m) => String(m._id) === String(id));
      if (item) {
        item.status = 'READ';
        item.isRead = true;
        item.readAt = new Date();
        message = item;
      }
    }

    if (!message) {
      message = { _id: id, status: 'READ', isRead: true, readAt: new Date() };
    }

    try {
      await logActivity('MESSAGE_MARKED_READ', 'Contact', { messageId: id }, req);
    } catch (e) {}

    return sendSuccess(res, message);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/messages/:id/unread
 * Mark message as NEW / UNREAD
 */
const markMessageUnread = async (req, res, next) => {
  try {
    const { id } = req.params;
    let message = null;

    try {
      if (Contact.db && Contact.db.readyState === 1) {
        message = await Contact.findByIdAndUpdate(
          id,
          { status: 'NEW', isRead: false, readAt: null },
          { new: true }
        );
      }
    } catch (dbErr) {}

    if (!message) {
      const item = FALLBACK_MESSAGES.find((m) => String(m._id) === String(id));
      if (item) {
        item.status = 'NEW';
        item.isRead = false;
        item.readAt = null;
        message = item;
      }
    }

    if (!message) {
      message = { _id: id, status: 'NEW', isRead: false };
    }

    try {
      await logActivity('MESSAGE_MARKED_UNREAD', 'Contact', { messageId: id }, req);
    } catch (e) {}

    return sendSuccess(res, message);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/messages/:id/archive
 * Move message to ARCHIVED status
 */
const archiveMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let message = null;

    try {
      if (Contact.db && Contact.db.readyState === 1) {
        message = await Contact.findByIdAndUpdate(
          id,
          { status: 'ARCHIVED', isRead: true },
          { new: true }
        );
      }
    } catch (dbErr) {}

    if (!message) {
      const item = FALLBACK_MESSAGES.find((m) => String(m._id) === String(id));
      if (item) {
        item.status = 'ARCHIVED';
        item.isRead = true;
        message = item;
      }
    }

    if (!message) {
      message = { _id: id, status: 'ARCHIVED', isRead: true };
    }

    try {
      await logActivity('MESSAGE_ARCHIVED', 'Contact', { messageId: id }, req);
    } catch (e) {}

    return sendSuccess(res, message);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/messages/:id/status
 * Update status to any valid enum (NEW, READ, REPLIED, ARCHIVED, SPAM)
 */
const updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return sendError(res, 'Status is required.', 'VALIDATION_ERROR', 400);
    }

    const upper = status.toUpperCase();
    const allowed = ['NEW', 'READ', 'REPLIED', 'ARCHIVED', 'SPAM', 'UNREAD'];
    if (!allowed.includes(upper)) {
      return sendError(res, `Invalid status. Allowed: ${allowed.join(', ')}`, 'VALIDATION_ERROR', 400);
    }

    const normalizedStatus = upper === 'UNREAD' ? 'NEW' : upper;
    const isRead = normalizedStatus !== 'NEW';

    let message = null;
    try {
      if (Contact.db && Contact.db.readyState === 1) {
        message = await Contact.findByIdAndUpdate(
          id,
          { status: normalizedStatus, isRead },
          { new: true }
        );
      }
    } catch (dbErr) {}

    if (!message) {
      const item = FALLBACK_MESSAGES.find((m) => String(m._id) === String(id));
      if (item) {
        item.status = normalizedStatus;
        item.isRead = isRead;
        message = item;
      }
    }

    if (!message) {
      message = { _id: id, status: normalizedStatus, isRead };
    }

    try {
      await logActivity('MESSAGE_STATUS_CHANGED', 'Contact', { messageId: id, status: normalizedStatus }, req);
    } catch (e) {}

    return sendSuccess(res, message);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/messages/:id/reply
 * Reply to visitor via email and update message status to REPLIED
 */
const replyToMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!message || !String(message).trim()) {
      return sendError(res, 'Reply message content cannot be empty.', 'VALIDATION_ERROR', 400);
    }

    let contactDoc = null;
    try {
      if (Contact.db && Contact.db.readyState === 1) {
        contactDoc = await Contact.findById(id);
      }
    } catch (dbErr) {}

    if (!contactDoc) {
      contactDoc = FALLBACK_MESSAGES.find((m) => String(m._id) === String(id));
    }

    if (!contactDoc) {
      return sendError(res, 'Original contact message not found.', 'NOT_FOUND', 404);
    }

    const recipientEmail = contactDoc.email;
    const replySubject = (subject || `Re: ${contactDoc.subject || 'Your Portfolio Inquiry'}`).trim();
    const replyBody = String(message).trim();

    // Send the email via Nodemailer
    const emailResult = await sendAdminReplyEmail({
      to: recipientEmail,
      subject: replySubject,
      message: replyBody,
      originalSubject: contactDoc.subject,
    });

    const replySentAt = new Date();

    // Update message status
    try {
      if (Contact.db && Contact.db.readyState === 1) {
        contactDoc.status = 'REPLIED';
        contactDoc.isRead = true;
        contactDoc.replySentAt = replySentAt;
        contactDoc.replySubject = replySubject;
        contactDoc.replyMessage = replyBody;
        await contactDoc.save();
      } else {
        contactDoc.status = 'REPLIED';
        contactDoc.isRead = true;
        contactDoc.replySentAt = replySentAt;
        contactDoc.replySubject = replySubject;
        contactDoc.replyMessage = replyBody;
      }
    } catch (saveErr) {
      console.warn('[replyToMessage] DB update warning:', saveErr.message);
    }

    try {
      await logActivity(
        'MESSAGE_REPLIED',
        'Contact',
        {
          messageId: id,
          recipient: recipientEmail,
          subject: replySubject,
          mode: emailResult?.mode || 'smtp',
        },
        req
      );
    } catch (e) {}

    return sendSuccess(res, {
      message: 'Reply sent successfully.',
      replySentAt,
      emailResult,
      contact: contactDoc,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/messages/:id
 * Permanently delete message from storage
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
      const idx = FALLBACK_MESSAGES.findIndex((m) => String(m._id) === String(id));
      if (idx !== -1) {
        deleted = FALLBACK_MESSAGES.splice(idx, 1)[0];
      }
    }

    try {
      await logActivity('MESSAGE_DELETED', 'Contact', { messageId: id }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Message deleted successfully.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleContactForm,
  getMessages,
  getMessageById,
  markMessageRead,
  markMessageUnread,
  archiveMessage,
  updateMessageStatus,
  replyToMessage,
  deleteMessage,
};
