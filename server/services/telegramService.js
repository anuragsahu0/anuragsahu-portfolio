/**
 * ANTI GRAVITY PORTFOLIO — TELEGRAM TELEMETRY NOTIFICATION SERVICE
 * Real-time instant visitor intelligence dispatched directly to owner's Telegram.
 * 
 * Features:
 * - 0.0ms latency non-blocking asynchronous execution
 * - Session & IP deduplication (anti-spam, 1 alert per 30-min session)
 * - Bot & crawler filter (ignores automated crawlers)
 * - Rich HTML formatted telemetry card with Device, IP, Geo, ISP, Screen, Referrer
 */

const https = require('https');

// Cache to prevent Telegram notification spam (ipAddress -> lastNotifiedTimestamp)
const recentNotifications = new Map();
const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes cooldown per IP

/**
 * Clean up old cache entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamp] of recentNotifications.entries()) {
    if (now - timestamp > COOLDOWN_MS) {
      recentNotifications.delete(ip);
    }
  }
}, 10 * 60 * 1000);

/**
 * Escape HTML characters for Telegram HTML parse_mode
 */
function escapeTgHtml(str) {
  if (!str) return 'N/A';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Dispatches a message via Telegram Bot API
 */
async function sendTelegramMessage(text, options = null) {
  let token = process.env.TELEGRAM_BOT_TOKEN;
  let chatId = process.env.TELEGRAM_CHAT_ID;
  let replyMarkup = null;

  if (typeof options === 'string') {
    token = options || token;
    if (arguments.length > 2 && arguments[2]) chatId = arguments[2];
  } else if (options && typeof options === 'object') {
    if (options.token) token = options.token;
    if (options.chatId) chatId = options.chatId;
    if (options.replyMarkup) replyMarkup = options.replyMarkup;
  }

  if (!token || !chatId) {
    console.log('[TelegramService] Bot Token or Chat ID not configured. Telemetry skipped.');
    return { success: false, reason: 'NOT_CONFIGURED' };
  }

  const payloadObj = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };

  if (replyMarkup) {
    payloadObj.reply_markup = replyMarkup;
  }

  const payload = JSON.stringify(payloadObj);

  return new Promise((resolve) => {
    const req = https.request(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 5000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            resolve({ success: data.ok, data });
          } catch (e) {
            resolve({ success: false, error: body });
          }
        });
      }
    );

    req.on('error', (err) => {
      console.warn('[TelegramService] Error sending alert:', err.message);
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'TIMEOUT' });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Format and send visitor detection alert
 */
function notifyVisitorArrival(visitor) {
  // 1. Ignore if no valid visitor or is bot
  if (!visitor || visitor.isBot) return;

  const ip = visitor.ipAddress || 'Unknown IP';

  // 2. Anti-spam deduplication: only 1 alert per IP every 30 minutes
  const now = Date.now();
  const lastAlert = recentNotifications.get(ip);
  if (lastAlert && (now - lastAlert < COOLDOWN_MS)) {
    return; // Already notified recently
  }
  recentNotifications.set(ip, now);

  // 3. Assemble formatted Telegram Card
  const flag = visitor.countryFlag || '🌐';
  const country = visitor.country || 'Unknown Country';
  const city = visitor.city ? `${visitor.city}, ` : '';
  const region = visitor.region ? `${visitor.region}, ` : '';
  const fullLocation = `${flag} ${city}${region}${country}`.trim();

  const device = visitor.deviceModel || visitor.device || 'Desktop PC';
  const browser = visitor.browser || 'Web Browser';
  const os = visitor.os || 'OS';
  const referrer = visitor.referrer && visitor.referrer !== 'Direct' ? visitor.referrer : 'Direct Traffic';
  const page = visitor.page || '/';

  const screen = visitor.screen ? visitor.screen : (visitor.metadata?.screen || 'N/A');
  const network = visitor.network ? visitor.network : (visitor.metadata?.connection || 'WiFi/Broadband');

  // Format IST Timestamp
  const istTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const message = [
    `🛰️ <b>NEW VISITOR DETECTED!</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📱 <b>Device:</b> <code>${escapeTgHtml(device)}</code>`,
    `💻 <b>OS & Browser:</b> <code>${escapeTgHtml(os)} • ${escapeTgHtml(browser)}</code>`,
    `📍 <b>Location:</b> <b>${escapeTgHtml(fullLocation)}</b>`,
    `🌐 <b>IP Address:</b> <code>${escapeTgHtml(ip)}</code>`,
    `🧭 <b>Referrer:</b> <code>${escapeTgHtml(referrer)}</code>`,
    `📄 <b>Landing Page:</b> <code>${escapeTgHtml(page)}</code>`,
    `🖥️ <b>Screen:</b> <code>${escapeTgHtml(screen)}</code>`,
    `📶 <b>Network:</b> <code>${escapeTgHtml(network)}</code>`,
    `⏰ <b>Time (IST):</b> <code>${escapeTgHtml(istTime)}</code>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `⚡ <i>Live Telemetry Engine • anuragsahu.com</i>`
  ].join('\n');

  // Fire-and-forget non-blocking execution (initiates network request immediately)
  return sendTelegramMessage(message).catch((err) => {
    console.warn('[TelegramService] Background dispatch warning:', err.message);
  });
}

/**
 * Format and send Contact Form submission alert to Telegram
 */
function notifyContactSubmission(contact) {
  if (!contact) return;

  const name = contact.fullName || contact.name || 'Anonymous Visitor';
  const email = contact.email || 'No email provided';
  const company = contact.company ? contact.company : 'Direct Message';
  const subject = contact.subject || 'Portfolio Inquiry';
  const messageBody = contact.message || '(Empty message)';
  const ip = contact.ipAddress || 'Unknown IP';

  const flag = contact.countryFlag || '🌐';
  const country = contact.country || 'India';
  const city = contact.city ? `${contact.city}, ` : '';
  const region = contact.region ? `${contact.region}, ` : '';
  const fullLocation = `${flag} ${city}${region}${country}`.trim();

  const device = contact.deviceModel || contact.device || 'Web Browser';
  const browser = contact.browser || '';

  // Format IST Timestamp
  const istTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const message = [
    `📬 <b>NEW DIRECT MESSAGE RECEIVED!</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 <b>From:</b> <b>${escapeTgHtml(name)}</b>`,
    `📧 <b>Email:</b> <code>${escapeTgHtml(email)}</code>`,
    `🏢 <b>Company / Topic:</b> <code>${escapeTgHtml(company)}</code>`,
    `📝 <b>Subject:</b> <code>${escapeTgHtml(subject)}</code>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `💬 <b>Message Content:</b>\n<i>"${escapeTgHtml(messageBody)}"</i>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📍 <b>Location:</b> <b>${escapeTgHtml(fullLocation)}</b>`,
    `🌐 <b>IP Address:</b> <code>${escapeTgHtml(ip)}</code>`,
    `📱 <b>Device:</b> <code>${escapeTgHtml(device)}${browser ? ` • ${escapeTgHtml(browser)}` : ''}</code>`,
    `⏰ <b>Received (IST):</b> <code>${escapeTgHtml(istTime)}</code>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `⚡ <i>Direct Inquiries • anuragsahu.com</i>`
  ].join('\n');

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: `✉️ Reply to ${escapeTgHtml(name).slice(0, 20)}`,
          url: `mailto:${encodeURIComponent(email)}?subject=Re:%20${encodeURIComponent(subject)}`
        }
      ]
    ]
  };

  return sendTelegramMessage(message, { replyMarkup }).catch((err) => {
    console.warn('[TelegramService] Contact dispatch warning:', err.message);
  });
}

module.exports = {
  notifyVisitorArrival,
  notifyContactSubmission,
  sendTelegramMessage,
};
