const nodemailer = require('nodemailer');
const config = require('../config/emailConfig');

/**
 * Email Service Service Layer
 * Sends recruiter messages to shivasahu0612@gmail.com using Nodemailer.
 * Features a fallback logger if SMTP credentials have not been configured yet.
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

const sendContactEmail = async ({ fullName, email, company, subject, message }) => {
  const mailOptions = {
    from: `"${fullName}" <${config.recipientEmail}>`,
    replyTo: email,
    to: config.recipientEmail,
    subject: `[ANTI GRAVITY PORTFOLIO] ${subject} (From: ${fullName}${company ? ` @ ${company}` : ''})`,
    text: `
=== NEW RECRUITER CONTACT INQUIRY ===

Candidate: Anurag Sahu
Sender Name: ${fullName}
Sender Email: ${email}
Company / Organization: ${company || 'N/A'}
Subject: ${subject}

Message Content:
----------------------------------------
${message}
----------------------------------------
Timestamp: ${new Date().toISOString()}
Reply directly to this email to contact ${fullName} (${email}).
    `,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #030712; color: #f9fafb; padding: 24px; border-radius: 12px; border: 1px solid #06b6d4;">
        <h2 style="color: #06b6d4; margin-top: 0;">⚡ Anti Gravity Recruiter Inquiry</h2>
        <p><strong>Candidate:</strong> Anurag Sahu</p>
        <p><strong>From:</strong> ${fullName} (&lt;<a href="mailto:${email}" style="color: #8b5cf6;">${email}</a>&gt;)</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border-color: rgba(255,255,255,0.1);" />
        <h4 style="color: #f9fafb;">Message:</h4>
        <p style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; font-family: monospace; white-space: pre-wrap;">${message}</p>
        <p style="font-size: 11px; color: #9ca3af; margin-top: 20px;">Sent via Anti Gravity Portfolio API for Anurag Sahu (shivasahu0612@gmail.com).</p>
      </div>
    `,
  };

  if (transporter) {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } else {
    // Development / Demo Fallback Mode: Log message to console safely
    console.log('\n========================================');
    console.log('📬 [DEMO MODE - SMTP CREDENTIALS NOT SET]');
    console.log('Recipient Target:', config.recipientEmail);
    console.log('Sender:', fullName, `<${email}>`);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('========================================\n');
    return { success: true, mode: 'demo_logged' };
  }
};

module.exports = { sendContactEmail };
