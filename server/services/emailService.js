const nodemailer = require('nodemailer');
const config = require('../config/emailConfig');

/**
 * Sanitize header strings to prevent email header injection (\r and \n).
 */
function sanitizeHeader(str) {
  if (!str) return '';
  return String(str).replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Escape HTML characters to prevent XSS in email bodies.
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Nodemailer Transporter instance
 */
let transporter = null;

if (config.smtp.auth.user && config.smtp.auth.pass) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.auth.user,
      pass: config.smtp.auth.pass,
    },
  });
}

/**
 * Send Contact Notification Email to Admin/Owner
 */
const sendContactNotificationEmail = async ({
  name,
  fullName,
  email,
  company,
  subject,
  message,
  createdAt,
}) => {
  const senderName = sanitizeHeader(name || fullName || 'Visitor');
  const senderEmail = sanitizeHeader(email);
  const cleanSubject = sanitizeHeader(subject || 'Portfolio Inquiry');
  const safeMessage = String(message || '').trim();
  const safeCompany = sanitizeHeader(company || '');
  const timestamp = createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString();

  const mailOptions = {
    from: `"Portfolio Notification" <${config.emailFrom}>`,
    replyTo: senderEmail,
    to: config.contactNotificationEmail,
    subject: `[Portfolio Inquiry] ${cleanSubject} (From: ${senderName})`,
    text: `
=== NEW CONTACT INQUIRY RECEIVED ===

Sender Name: ${senderName}
Sender Email: ${senderEmail}
Company: ${safeCompany || 'N/A'}
Subject: ${cleanSubject}
Received: ${timestamp}

----------------------------------------
Message Content:
${safeMessage}
----------------------------------------

* Reply directly to this email to respond to ${senderName} (${senderEmail}).
    `.trim(),
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070B16; color: #f1f5f9; padding: 32px 24px; border-radius: 16px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #06b6d4; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.02em;">
            ⚡ New Contact Inquiry
          </h2>
          <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">
            Submitted via Anurag Sahu Personal Portfolio (anuragsahu.com)
          </p>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); padding: 18px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
          <p style="margin: 0 0 8px 0;"><strong style="color: #cbd5e1;">From:</strong> ${escapeHtml(senderName)} (&lt;<a href="mailto:${escapeHtml(senderEmail)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(senderEmail)}</a>&gt;)</p>
          ${safeCompany ? `<p style="margin: 0 0 8px 0;"><strong style="color: #cbd5e1;">Company:</strong> ${escapeHtml(safeCompany)}</p>` : ''}
          <p style="margin: 0 0 8px 0;"><strong style="color: #cbd5e1;">Subject:</strong> ${escapeHtml(cleanSubject)}</p>
          <p style="margin: 0;"><strong style="color: #cbd5e1;">Time:</strong> ${escapeHtml(timestamp)}</p>
        </div>

        <div style="background: #0B1120; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h4 style="color: #94a3b8; margin: 0 0 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Message Content</h4>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #f8fafc; white-space: pre-wrap; font-family: inherit;">${escapeHtml(safeMessage)}</p>
        </div>

        <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #64748b;">
          <p style="margin: 0;">Hit Reply in your email client to respond directly to ${escapeHtml(senderEmail)}.</p>
          <p style="margin: 4px 0 0 0;">Anurag Sahu Control Center • Automated Communication Engine</p>
        </div>
      </div>
    `.trim(),
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId, mode: 'smtp' };
    } catch (err) {
      console.error('[EmailService] SMTP Notification delivery failed:', err.message);
      return { success: false, error: err.message, mode: 'smtp_failed' };
    }
  } else {
    console.log('\n========================================');
    console.log('📬 [EMAIL SERVICE - DEMO MODE LOGGED]');
    console.log('To:', config.contactNotificationEmail);
    console.log('From:', senderName, `<${senderEmail}>`);
    console.log('Subject:', cleanSubject);
    console.log('Message:', safeMessage);
    console.log('========================================\n');
    return { success: true, messageId: `demo-${Date.now()}`, mode: 'demo_logged' };
  }
};

/**
 * Send Direct Admin Reply Email to Visitor
 */
const sendAdminReplyEmail = async ({ to, subject, message, originalSubject }) => {
  const recipientEmail = sanitizeHeader(to);
  const cleanSubject = sanitizeHeader(subject || `Re: ${originalSubject || 'Your Inquiry'}`);
  const safeMessage = String(message || '').trim();

  const mailOptions = {
    from: `"Anurag Sahu" <${config.emailFrom}>`,
    replyTo: config.emailFrom,
    to: recipientEmail,
    subject: cleanSubject,
    text: `
Hi,

${safeMessage}

Best regards,
Anurag Sahu
Computer Science & Engineering | Full-Stack & AI Systems
Portfolio: https://anuragsahu.com
Email: ${config.emailFrom}
    `.trim(),
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070B16; color: #f1f5f9; padding: 32px 24px; border-radius: 16px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #06b6d4; margin: 0; font-size: 20px; font-weight: 700;">
            Anurag Sahu
          </h2>
          <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">
            Full-Stack Developer & AI Systems Engineer
          </p>
        </div>

        <div style="font-size: 14px; line-height: 1.7; color: #f8fafc; margin-bottom: 28px; white-space: pre-wrap;">
${escapeHtml(safeMessage)}
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 20px; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0; font-weight: 600; color: #e2e8f0;">Anurag Sahu</p>
          <p style="margin: 4px 0 0 0;">B.Tech CSE (AI & ML) Sophomore</p>
          <p style="margin: 4px 0 0 0;">
            <a href="https://anuragsahu.com" style="color: #06b6d4; text-decoration: none;">anuragsahu.com</a> • 
            <a href="https://github.com/anuragsahu0" style="color: #06b6d4; text-decoration: none;">GitHub</a> • 
            <a href="mailto:${escapeHtml(config.emailFrom)}" style="color: #06b6d4; text-decoration: none;">${escapeHtml(config.emailFrom)}</a>
          </p>
        </div>
      </div>
    `.trim(),
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId, mode: 'smtp' };
    } catch (err) {
      console.error('[EmailService] SMTP Admin Reply failed:', err.message);
      return { success: false, error: err.message, mode: 'smtp_failed' };
    }
  } else {
    console.log('\n========================================');
    console.log('✉️ [EMAIL SERVICE - ADMIN REPLY DEMO LOGGED]');
    console.log('To:', recipientEmail);
    console.log('Subject:', cleanSubject);
    console.log('Reply Body:', safeMessage);
    console.log('========================================\n');
    return { success: true, messageId: `demo-reply-${Date.now()}`, mode: 'demo_logged' };
  }
};

/**
 * Sends automated Thank You / Auto-Reply Email to the visitor/recruiter.
 * SLA: 24-48 Hours Response Guarantee.
 */
const sendAutoReplyEmail = async ({ fullName, email, subject }) => {
  const recipientName = sanitizeHeader(fullName || 'Visitor');
  const recipientEmail = sanitizeHeader(email);
  const cleanSubject = sanitizeHeader(subject || 'Inquiry');

  const mailOptions = {
    from: `"Anurag Sahu" <${config.emailFrom}>`,
    to: recipientEmail,
    subject: `Thank you for contacting Anurag Sahu | Message Received ⚡`,
    text: `
Hi ${recipientName},

Thank you for reaching out through my portfolio website! I have received your message regarding "${cleanSubject}".

RESPONSE SLA TIMELINE:
I am reviewing your inquiry and will personally reply to your email within 24 to 48 hours.

In the meantime, feel free to explore my latest code builds:
GitHub: https://github.com/anuragsahu0
LinkedIn: https://www.linkedin.com/in/anurag-sahu-5a46b9360/

Best regards,
Anurag Sahu
B.Tech CSE (AI & ML) Sophomore
${config.emailFrom}
    `.trim(),
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070B16; color: #f1f5f9; padding: 32px 24px; border-radius: 16px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #06b6d4; margin: 0; font-size: 20px;">⚡ ANURAG SAHU • PORTFOLIO</h2>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Full-Stack Web Architect & AI/ML Sophomore</p>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: 12px; border: 1px solid #334155;">
          <p style="font-size: 15px; color: #ffffff; margin-top: 0;">Hi <strong>${escapeHtml(recipientName)}</strong>,</p>
          
          <p style="color: #cbd5e1; line-height: 1.6; font-size: 13px;">
            Thank you for reaching out through my portfolio website! I have received your message regarding <strong>"${escapeHtml(cleanSubject)}"</strong>.
          </p>

          <div style="padding: 14px; background: rgba(6,182,212,0.1); border-left: 4px solid #06b6d4; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #06b6d4; font-weight: bold; font-size: 13px;">
              ⏰ Response SLA Timeline:
            </p>
            <p style="margin: 4px 0 0 0; color: #e0f2fe; font-size: 13px;">
              I am reviewing your inquiry and will personally reply to your email within <strong>24 to 48 hours</strong>.
            </p>
          </div>

          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
            In the meantime, feel free to explore my latest code builds on <a href="https://github.com/anuragsahu0" style="color: #06b6d4;">GitHub</a> or connect with me on <a href="https://www.linkedin.com/in/anurag-sahu-5a46b9360/" style="color: #38bdf8;">LinkedIn</a>.
          </p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 11px;">
          Best regards,<br/>
          <strong style="color: #ffffff;">Anurag Sahu</strong><br/>
          B.Tech CSE (AI & ML) Sophomore<br/>
          <a href="mailto:${escapeHtml(config.emailFrom)}" style="color: #06b6d4;">${escapeHtml(config.emailFrom)}</a>
        </div>
      </div>
    `.trim(),
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId, mode: 'smtp' };
    } catch (err) {
      console.error('[EmailService] SMTP Auto-Reply failed:', err.message);
      return { success: false, error: err.message, mode: 'smtp_failed' };
    }
  } else {
    console.log('\n========================================');
    console.log('🤖 [EMAIL SERVICE - AUTO-REPLY DEMO LOGGED]');
    console.log('To:', recipientName, `<${recipientEmail}>`);
    console.log('Subject:', mailOptions.subject);
    console.log('========================================\n');
    return { success: true, messageId: `demo-auto-${Date.now()}`, mode: 'auto_reply_demo' };
  }
};

// Aliases for backward compatibility
const sendContactEmail = sendContactNotificationEmail;

module.exports = {
  sendContactNotificationEmail,
  sendAdminReplyEmail,
  sendAutoReplyEmail,
  sendContactEmail,
  sanitizeHeader,
  escapeHtml,
};
