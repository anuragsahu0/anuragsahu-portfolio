const Contact = require('../models/Contact');
const { sendContactEmail } = require('../services/emailService');

/**
 * POST /api/contact
 * Saves contact message to MongoDB AND sends email notification.
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

    // Send email (non-blocking — don't fail if email fails)
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
      // Continue — message was still saved to DB
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been delivered to Anurag Sahu. Expect a response within 12-24 hours.',
      id: contactDoc._id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleContactForm };
