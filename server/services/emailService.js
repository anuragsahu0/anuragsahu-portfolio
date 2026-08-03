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
    console.log('📬 [DEMO MODE - RECRUITER INQUIRY LOGGED]');
    console.log('Recipient Target:', config.recipientEmail);
    console.log('Sender:', fullName, `<${email}>`);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('========================================\n');
    return { success: true, mode: 'demo_logged' };
  }
};

/**
 * Sends automated Thank You / Auto-Reply Email to the visitor/recruiter.
 * SLA: 24-48 Hours Response Guarantee.
 */
const sendAutoReplyEmail = async ({ fullName, email, subject }) => {
  const mailOptions = {
    from: `"Anurag Sahu" <${config.recipientEmail}>`,
    to: email,
    subject: `Thank you for contacting Anurag Sahu | Message Received ⚡`,
    text: `
Hi ${fullName},

Thank you for reaching out through my portfolio website! I have received your message regarding "${subject}".

RESPONSE SLA TIMELINE:
I am reviewing your inquiry and will personally reply to your email within 24 to 48 hours.

In the meantime, feel free to explore my latest code builds:
GitHub: https://github.com/anuragsahu0
LinkedIn: https://www.linkedin.com/in/anurag-sahu-5a46b9360/

Best regards,
Anurag Sahu
B.Tech CSE (AI & ML) Sophomore
shivasahu0612@gmail.com
    `,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #030712; color: #f9fafb; padding: 32px; border-radius: 16px; border: 1px solid #06b6d4; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #06b6d4; margin: 0; font-size: 22px;">⚡ ANURAG SAHU • PORTFOLIO</h2>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Full-Stack Web Architect & AI/ML Sophomore</p>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <p style="font-size: 16px; color: #ffffff; margin-top: 0;">Hi <strong>${fullName}</strong>,</p>
          
          <p style="color: #d1d5db; line-height: 1.6;">
            Thank you for reaching out through my portfolio website! I have received your message regarding <strong>"${subject}"</strong>.
          </p>

          <div style="padding: 14px; background: rgba(6,182,212,0.1); border-left: 4px solid #06b6d4; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #06b6d4; font-weight: bold; font-size: 14px;">
              ⏰ Response SLA Timeline:
            </p>
            <p style="margin: 4px 0 0 0; color: #e0f2fe; font-size: 14px;">
              I am reviewing your inquiry and will personally reply to your email within <strong>24 to 48 hours</strong>.
            </p>
          </div>

          <p style="color: #9ca3af; font-size: 13px; margin-bottom: 0;">
            In the meantime, feel free to explore my latest code builds on <a href="https://github.com/anuragsahu0" style="color: #06b6d4;">GitHub</a> or connect with me on <a href="https://www.linkedin.com/in/anurag-sahu-5a46b9360/" style="color: #8b5cf6;">LinkedIn</a>.
          </p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #6b7280; font-size: 12px;">
          Best regards,<br/>
          <strong style="color: #ffffff;">Anurag Sahu</strong><br/>
          B.Tech CSE (AI & ML) Sophomore<br/>
          <a href="mailto:shivasahu0612@gmail.com" style="color: #06b6d4;">shivasahu0612@gmail.com</a>
        </div>
      </div>
    `,
  };

  if (transporter) {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } else {
    console.log('\n========================================');
    console.log('🤖 [AUTO-REPLY SENT TO VISITOR]');
    console.log('To:', fullName, `<${email}>`);
    console.log('Subject:', mailOptions.subject);
    console.log('SLA Guarantee: 24-48 Hours Response');
    console.log('========================================\n');
    return { success: true, mode: 'auto_reply_demo' };
  }
};

module.exports = { sendContactEmail, sendAutoReplyEmail };
