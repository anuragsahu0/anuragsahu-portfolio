require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  provider: process.env.EMAIL_PROVIDER || 'smtp',
  emailFrom: process.env.EMAIL_FROM || process.env.SMTP_USER || 'shivasahu0612@gmail.com',
  contactNotificationEmail:
    process.env.CONTACT_NOTIFICATION_EMAIL || process.env.RECIPIENT_EMAIL || 'shivasahu0612@gmail.com',
  recipientEmail:
    process.env.CONTACT_NOTIFICATION_EMAIL || process.env.RECIPIENT_EMAIL || 'shivasahu0612@gmail.com',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },
};
