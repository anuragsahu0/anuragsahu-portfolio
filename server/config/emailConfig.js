require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  recipientEmail: process.env.RECIPIENT_EMAIL || 'shivasahu0612@gmail.com',
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
