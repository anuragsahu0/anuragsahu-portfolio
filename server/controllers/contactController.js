const Contact = require('../models/Contact');
const { sendContactEmail, sendAutoReplyEmail } = require('../services/emailService');

/**
 * POST /api/contact
 * Saves contact message to MongoDB AND sends email notification + visitor auto-reply.
 */
const handleContactForm = async (req, res, next) => {
  try {
    const { fullName, email, company, subject, message } = req.body;

    // Server-side validation
    if (!fullName || !fullName.trim())
      return res.status(400).json({ success: false, message: 'Full name is required.' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim()))
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });

    if (!subject || !subject.trim())
      return res.status(400).json({ success: false, message: 'Subject is required.' });

    if (!message || !message.trim())
      return res.status(400).json({ success: false, message: 'Message content is required.' });

    // Save to MongoDB
    const contactDoc = await Contact.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      company: company ? company.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      status: 'unread',
      ipAddress: req.ip || '',
    });

    // 1. Send notification email to Anurag Sahu
    try {
      await sendContactEmail({
        fullName: fullName.trim(),
        email: email.trim(),
        company: company ? company.trim() : '',
        subject: subject.trim(),
        message: message.trim(),
      });
    } catch (emailErr) {
      console.error('[Email] Failed to send notification email:', emailErr.message);
    }

    // 2. Send automated auto-reply email to visitor (SLA: 24-48 Hours)
    try {
      await sendAutoReplyEmail({
        fullName: fullName.trim(),
        email: email.trim(),
        subject: subject.trim(),
      });
    } catch (autoErr) {
      console.error('[Email] Failed to send auto-reply email:', autoErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been delivered to Anurag Sahu. An auto-confirmation email has been sent to your inbox.',
      id: contactDoc._id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleContactForm };
