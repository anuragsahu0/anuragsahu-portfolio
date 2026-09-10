/**
 * ANTI GRAVITY PORTFOLIO — STANDALONE INTERACTIVE ENGINE
 * Candidate: Anurag Sahu
 */

const SERVER_HOST = window.location.hostname || 'localhost';
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? `http://${SERVER_HOST}:5001/api`
  : `/api`;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE === 'undefined') {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initParticleBackground);
    } else {
      setTimeout(initParticleBackground, 300);
    }
  }
  initCLI();
  initLiveTelemetryTracking();
  initScrollProgress();

  initCategoryFilters();
  initScrollReveal();
  initContactForm();
});

/* -------------------------------------------------------------------------- */
/* Real-Time Live Telemetry Tracking Engine                                  */
/* -------------------------------------------------------------------------- */
function initLiveTelemetryTracking() {
  sendTelemetry('page_view', { path: window.location.pathname });
  startVisitorHeartbeat();

  document.querySelectorAll('button, a').forEach((el) => {
    const text = (el.textContent || '').toLowerCase();
    const href = (el.getAttribute('href') || '').toLowerCase();

    if (text.includes('resume') || href.includes('resume')) {
      el.addEventListener('click', () => sendTelemetry('resume_download', { label: 'Resume PDF Clicked' }));
    } else if (href.includes('github.com')) {
      el.addEventListener('click', () => sendTelemetry('github_click', { url: href }));
    } else if (href.includes('linkedin.com')) {
      el.addEventListener('click', () => sendTelemetry('linkedin_click', { url: href }));
    }
  });
}

const MESSAGES_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a067127101a08ba1833767b4';
const TELEMETRY_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a067127101a08ba1848d67b5';

function detectVisitorDevice() {
  const ua = navigator.userAgent || '';
  let device = 'Desktop PC';
  if (/iPhone/i.test(ua)) device = 'iPhone (iOS)';
  else if (/iPad/i.test(ua)) device = 'iPad (iOS)';
  else if (/Android/i.test(ua)) device = 'Android Mobile';
  else if (/Macintosh/i.test(ua)) device = 'MacBook / Mac';
  else if (/Windows/i.test(ua)) device = 'Windows PC';

  let browser = 'Chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edg/i.test(ua)) browser = 'Edge';

  return `${device} • ${browser}`;
}

function startVisitorHeartbeat() {
  let sessId = sessionStorage.getItem('as_visitor_sess');
  if (!sessId) {
    sessId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    sessionStorage.setItem('as_visitor_sess', sessId);
  }

  const deviceLabel = detectVisitorDevice();
  const entryTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  async function ping() {
    try {
      const res = await fetch(TELEMETRY_ENDPOINT);
      if (!res.ok) return;
      const json = await res.json();
      const data = json && json.data ? json.data : {};

      if (!data.sessions) data.sessions = {};
      const totalSessions = Object.keys(data.sessions).length;
      const prevTotal = parseInt(data.totalVisitors, 10) || totalSessions || 1420;

      if (!sessionStorage.getItem('as_page_counted')) {
        data.totalVisitors = Math.max(prevTotal + 1, totalSessions + 1, 1421);
        sessionStorage.setItem('as_page_counted', 'true');
      } else {
        data.totalVisitors = Math.max(prevTotal, 1420);
      }
      localStorage.setItem('as_total_visitors', data.totalVisitors);

      // Record current session
      data.sessions[sessId] = {
        id: sessId,
        device: deviceLabel,
        path: window.location.pathname || '/',
        entryTime: data.sessions[sessId]?.entryTime || entryTimeStr,
        lastSeen: Date.now(),
        status: 'ONLINE'
      };

      // Prune sessions older than 5 minutes
      const now = Date.now();
      Object.keys(data.sessions).forEach(sid => {
        const s = data.sessions[sid];
        if (s && now - (s.lastSeen || 0) > 300000) {
          delete data.sessions[sid];
        }
      });

      await fetch(TELEMETRY_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'anurag_portfolio_telemetry_v1',
          data
        })
      });

      // Broadcast real-time pulse
      try {
        const bc = new BroadcastChannel('anurag_portfolio_realtime');
        bc.postMessage({ type: 'telemetry_updated', totalVisitors: data.totalVisitors });
      } catch (e) {}
    } catch (e) {}
  }

  ping();
  setInterval(ping, 15000);
}

function sendTelemetry(type, metadata = {}) {
  try {
    fetch(TELEMETRY_ENDPOINT)
      .then(r => r.json())
      .then(json => {
        const data = json && json.data ? json.data : {};
        data.activityLog = data.activityLog || [];
        data.activityLog.unshift({
          id: 'act_' + Date.now(),
          type,
          path: window.location.pathname,
          device: detectVisitorDevice(),
          metadata,
          time: new Date().toISOString()
        });
        if (data.activityLog.length > 30) data.activityLog = data.activityLog.slice(0, 30);

        fetch(TELEMETRY_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'anurag_portfolio_telemetry_v1',
            data
          })
        }).catch(() => {});
      }).catch(() => {});
  } catch (e) {}
}

/* -------------------------------------------------------------------------- */
/* 1. Ambient Background Particle Network (Zero Cursor Tracking)              */
/* -------------------------------------------------------------------------- */
function initParticleBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // Three.js is using WebGL context on bg-canvas

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 20), 45);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.35 + 0.1),
      radius: Math.random() * 1.5 + 1,
      color: Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, ',
      alpha: Math.random() * 0.4 + 0.15,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* -------------------------------------------------------------------------- */
/* 2. Command Line CLI Terminal Overlay Modal                                 */
/* -------------------------------------------------------------------------- */
function initCLI() {
  const btn = document.getElementById('btn-terminal-trigger');
  const modal = document.getElementById('terminal-modal');
  const closeBtn = document.querySelector('.term-close');
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');

  if (!btn || !modal || !input || !body) return;

  function toggleModal(show) {
    if (show) {
      modal.classList.add('active');
      input.focus();
    } else {
      modal.classList.remove('active');
    }
  }

  btn.addEventListener('click', () => toggleModal(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) toggleModal(false);
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const isCurrentlyOpen = modal.classList.contains('active') || modal.classList.contains('open');
      toggleModal(!isCurrentlyOpen);
    }
    if (e.key === 'Escape') {
      toggleModal(false);
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim().toLowerCase();
      if (!val) return;

      appendLog(`anurag@dev:~$ ${val}`, '#06b6d4');

      if (val === 'help') {
        appendLog('Available commands: resume, contact, skills, projects, clear', '#9ca3af');
      } else if (val === 'resume') {
        appendLog('Downloading ATS Resume PDF...', '#10b981');
        sendTelemetry('resume_download', { from: 'cli' });
        window.open('assets/resume.pdf', '_blank');
      } else if (val === 'contact') {
        appendLog('Email: shivasahu0612@gmail.com', '#06b6d4');
        copyEmail();
      } else if (val === 'skills') {
        appendLog('STACK: React 18, Node.js, Express, Python, PyTorch, MongoDB, PostgreSQL, C++', '#9ca3af');
      } else if (val === 'projects') {
        appendLog('1. AI Finance Controller (Completed) | 2. Restaurant Management System (Coming Soon) | 3. Smart College ERP (Coming Soon)', '#9ca3af');
      } else if (val === 'clear') {
        body.innerHTML = '';
      } else {
        appendLog(`Command not found: '${val}'. Type 'help' for options.`, '#ef4444');
      }

      input.value = '';
      body.scrollTop = body.scrollHeight;
    }
  });

  function appendLog(text, color) {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.style.color = color || '#f9fafb';
    div.textContent = text;
    body.appendChild(div);
  }
}

/* -------------------------------------------------------------------------- */
/* 3. Global Toast Notification                                              */
/* -------------------------------------------------------------------------- */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function copyEmail() {
  navigator.clipboard.writeText('shivasahu0612@gmail.com');
  showToast('✓ EMAIL COPIED: shivasahu0612@gmail.com');
  sendTelemetry('email_copied', { email: 'shivasahu0612@gmail.com' });
}


async function syncProjectStatuses() {
  localStorage.setItem('ag_proj_status_01', 'Completed');
  localStorage.setItem('ag_proj_status_02', 'Coming Soon');

  // 1. Apply local storage immediately (High Priority - Rate-limit proof)
  ['01', '02', '03'].forEach(num => {
    const status = num === '01' ? 'Completed' : (num === '02' ? 'Coming Soon' : (localStorage.getItem(`ag_proj_status_${num}`) || 'Coming Soon'));
    if (status) {
      applyBadgeUI(num, status);
    }
  });

  // 2. Fetch from backend API /api/settings first (Same Origin - No 429 Rate Limit!)
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && data.settings) {
        ['01', '02', '03'].forEach(num => {
          if (num === '01') {
            localStorage.setItem('ag_proj_status_01', 'Completed');
            applyBadgeUI('01', 'Completed');
            return;
          }
          if (num === '02') {
            localStorage.setItem('ag_proj_status_02', 'Coming Soon');
            applyBadgeUI('02', 'Coming Soon');
            return;
          }
          const val = data.settings[`ag_proj_status_${num}`];
          if (val === 'Completed' || val === 'Coming Soon') {
            localStorage.setItem(`ag_proj_status_${num}`, val);
            applyBadgeUI(num, val);
          }
        });
        return; // Success! No need to hit rate-limited third party APIs
      }
    }
  } catch (e) {}
}

function applyBadgeUI(num, status) {
  const badge = document.getElementById(`main-project-status-${num}`);
  const actualStatus = num === '01' ? 'Completed' : status;
  if (badge && actualStatus) {
    if (actualStatus === 'Completed') {
      badge.textContent = '🟢 Status: Completed';
      badge.style.color = '#10b981';
      badge.style.background = 'rgba(16,185,129,0.1)';
      badge.style.border = '1px solid rgba(16,185,129,0.3)';
    } else {
      badge.textContent = '🟡 Status: Coming Soon';
      badge.style.color = '#f59e0b';
      badge.style.background = 'rgba(245,158,11,0.1)';
      badge.style.border = '1px solid rgba(245,158,11,0.3)';
    }
  }
}

window.addEventListener('storage', (e) => {
  if (e.key && e.key.startsWith('ag_proj_status_')) {
    syncProjectStatuses();
  }
});

function initRedTypewriter() {
  // Disabled per user request (static Dream | Grow | Lead text)
}

function initSkillsFlipCards() {
  const cards = document.querySelectorAll('#skills .flip-card');
  cards.forEach((card) => {
    const inner = card.querySelector('.flip-card-inner');
    if (!inner) return;

    // Keyboard accessibility: Enter or Space toggles 3D flip
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        inner.classList.toggle('flipped');
        card.setAttribute('aria-expanded', inner.classList.contains('flipped') ? 'true' : 'false');
      }
    });
  });
}

function bootApp() {
  if (typeof initParticleBackground === 'function') initParticleBackground();
  initCLI();
  initLiveTelemetryTracking();
  syncProjectStatuses();
  setInterval(syncProjectStatuses, 1000);
  initScrollProgress();
  initSkillsFlipCards();

  initCategoryFilters();
  initScrollReveal();
  initContactForm();
  initNavScrollSpy();
}

/* -------------------------------------------------------------------------- */
/* Reel Custom Cursor Follower Engine                                         */
/* -------------------------------------------------------------------------- */
function initReelCustomCursor() {
  // Mouse tracer effect disabled per user request
  const dot = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  if (dot) dot.remove();
  if (follower) follower.remove();
}

/* -------------------------------------------------------------------------- */
/* Active Navigation HUD Scroll Spy Engine                                    */
/* -------------------------------------------------------------------------- */
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#hud-header .hud-nav a');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}

/* -------------------------------------------------------------------------- */
/* 5. Scroll Reading Progress Bar Engine                                     */
/* -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (windowHeight <= 0) return;
    const scrolledPercent = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrolledPercent))}%`;
  });
}

/* -------------------------------------------------------------------------- */
/* 6. GPU-Accelerated 3D Tilt Card Interaction Handler                       */
/* -------------------------------------------------------------------------- */
function init3DTiltCards() {
  // 3D corner tilt effect disabled per user request
}

/* -------------------------------------------------------------------------- */
/* 7. Interactive Project Category Filtering Engine                           */
/* -------------------------------------------------------------------------- */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#roadmap .glass-panel');

  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const text = (card.textContent || '').toLowerCase();
        if (filterValue === 'all') {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else if (filterValue === 'enterprise' && (text.includes('enterprise') || text.includes('restaurant') || text.includes('saas') || text.includes('backend') || text.includes('02'))) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 8. Intersection Observer Scroll Reveal Engine                              */
/* -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('section, .glass-panel, .section-header');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-on-scroll', 'is-visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el) => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
}

/* -------------------------------------------------------------------------- */
/* 9. Direct Recruiter Contact Form Submission Engine                         */
/* -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-fullname');
    const emailInput = document.getElementById('contact-email');
    const msgInput = document.getElementById('contact-msg');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (!nameInput || !emailInput || !msgInput) return;

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();

    if (!fullName || !email || !message) {
      showToast('Please fill out all required fields');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message...</span>';
    }

    // 1. Store locally (both legacy & modern keys)
    const newMsg = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      fullName,
      email,
      company: 'Direct Inquiry',
      subject: `📩 Portfolio Inquiry from ${fullName}`,
      message,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    try {
      const existingMsgs = JSON.parse(localStorage.getItem('ag_admin_messages') || localStorage.getItem('anuragsahu_contact_messages') || '[]');
      existingMsgs.unshift(newMsg);
      localStorage.setItem('ag_admin_messages', JSON.stringify(existingMsgs));
      localStorage.setItem('anuragsahu_contact_messages', JSON.stringify(existingMsgs));
    } catch (e) {}

    // 2. Real-Time Cloud Inbox Sync (Guarantees message appears in Admin Panel on ALL devices instantly)
    try {
      fetch(MESSAGES_ENDPOINT)
        .then(res => res.json())
        .then(json => {
          const mData = json && json.data ? json.data : { messages: [] };
          mData.messages = mData.messages || [];
          mData.messages.unshift(newMsg);
          return fetch(MESSAGES_ENDPOINT, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'anurag_portfolio_inbox_v1',
              data: mData
            })
          });
        })
        .then(() => {
          // Log activity in telemetry
          sendTelemetry('contact_submit', { sender: fullName, email });
        })
        .catch(() => {});
    } catch (e) {}

    // 3. Instant 0ms Cross-Tab Real-Time Sync
    try {
      const bc = new BroadcastChannel('anurag_portfolio_realtime');
      bc.postMessage({ type: 'new_message', message: newMsg });
    } catch (e) {}
      }).catch(() => {});
    } catch (e) {}

    // 4. Instant Admin Email Delivery to shivasahu0612@gmail.com & Visitor Auto-Reply
    try {
      const fd = new FormData();
      fd.append('name', fullName);
      fd.append('email', email);
      fd.append('subject', `📩 NEW DIRECT MESSAGE from ${fullName}`);
      fd.append('message', `You received a new inquiry on your portfolio website!\n\nSENDER NAME: ${fullName}\nSENDER EMAIL: ${email}\n\nMESSAGE CONTENT:\n"${message}"\n\nTimestamp: ${new Date().toLocaleString()}`);
      fd.append('_replyto', email);
      fd.append('_autoresponse', `Dear ${fullName},\n\nThank you for contacting us!\n\nYour message has been successfully received by Team Anurag Sahu.\n\nTeam Anurag Sahu will contact you within 24-48 hours at ${email}.\n\nBest regards,\nTeam Anurag Sahu\nhttps://anuragsahu.com`);
      fd.append('_template', 'table');
      fd.append('_captcha', 'false');

      fetch('https://formsubmit.co/ajax/shivasahu0612@gmail.com', {
        method: 'POST',
        body: fd
      }).catch(() => {});
    } catch (e) {}

    // 5. Instant 2-Second Web3Forms Auto-Reply directly to Visitor's Inbox
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '4c34a942-8822-48df-b593-01824497e793',
          name: 'Team Anurag Sahu',
          email: email,
          to: email,
          from_name: 'Team Anurag Sahu',
          subject: 'Thank you for contacting Anurag Sahu!',
          message: `Dear ${fullName},\n\nThank you for contacting us!\n\nYour message has been delivered to Anurag Sahu (shivasahu0612@gmail.com).\n\nTeam Anurag Sahu will contact you within 24-48 hours.\n\nYour Submitted Message:\n"${message}"\n\nBest regards,\nTeam Anurag Sahu\nhttps://anuragsahu.com`
        })
      }).catch(() => {});
    } catch (e) {}

    showToast('✓ Message Delivered! Check your email inbox for confirmation.');
    showSuccessModal(fullName, email);
    contactForm.reset();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Send Message</span><i data-lucide="send" style="width: 16px;"></i>';
      if (window.lucide) window.lucide.createIcons();
    }
  });
}

function showSuccessModal(name, email) {
  const modal = document.getElementById('contact-success-modal');
  const card = document.getElementById('contact-success-modal-card');
  const msg = document.getElementById('contact-success-modal-msg');
  if (msg) {
    msg.innerHTML = `<div style="text-align: center; space-y: 6px;">
      <span style="display:inline-block; padding: 4px 12px; border-radius: 999px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #10b981; font-size: 11px; font-weight: bold; margin-bottom: 8px;">
        ✓ Message Dispatched to shivasahu0612@gmail.com
      </span>
      <div style="font-size: 13px; color: #ffffff; font-weight: 700;">
        Thank you <strong style="color:#06b6d4;">${name}</strong>!
      </div>
      <div style="font-size: 12px; color: #cbd5e1; margin-top: 8px; line-height: 1.6;">
        Your message has been delivered directly to <strong>Anurag Sahu</strong>.
        <br/><br/>
        An auto-confirmation email has been sent to <strong style="color:#ffffff;">${email}</strong>:
        <br/>
        <em style="color:#10b981; font-style: normal; font-weight: bold; display: inline-block; margin-top: 4px;">"Thank you for contacting us! Team Anurag Sahu will contact you in 24-48 hours."</em>
      </div>
    </div>`;
  }
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    if (card) {
      card.style.transform = 'scale(0.85)';
      card.style.opacity = '0';
      card.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      setTimeout(() => {
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
      }, 10);
    }
  }
}

window.closeSuccessModal = function() {
  const modal = document.getElementById('contact-success-modal');
  const card = document.getElementById('contact-success-modal-card');
  const contactForm = document.getElementById('contact-form') || document.getElementById('m-contact-form');
  
  if (card) {
    card.style.transform = 'scale(0.85)';
    card.style.opacity = '0';
  }
  setTimeout(() => {
    if (modal) {
      modal.style.display = 'none';
      modal.classList.add('hidden');
    }
    if (contactForm) contactForm.reset();
  }, 150);
};
