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
  initCmsDynamicHydration();
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

  async function ping() {
    try {
      const res = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'heartbeat',
          path: window.location.pathname || '/',
          metadata: { device: deviceLabel, sessId }
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.activeUsersCount) {
          try {
            const bc = new BroadcastChannel('anurag_portfolio_realtime');
            bc.postMessage({ type: 'telemetry_updated', activeUsers: json.activeUsersCount });
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  ping();
  setInterval(ping, 25000);
}

function sendTelemetry(type, metadata = {}) {
  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        path: window.location.pathname || '/',
        metadata: {
          ...metadata,
          device: detectVisitorDevice()
        }
      })
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

    // Real-Time Backend API Delivery
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          name: fullName,
          email,
          company: 'Direct Inquiry',
          subject: `📩 Portfolio Inquiry from ${fullName}`,
          message,
        }),
      });

      const json = await res.json().catch(() => null);

      if (res.ok) {
        sendTelemetry('contact_submission', { sender: fullName, email });
        showToast('✓ Message Received! Check your email inbox for confirmation.');
        showSuccessModal(fullName, email);
        contactForm.reset();
      } else {
        const errorMsg =
          json?.error?.message || json?.message || (res.status === 429 ? 'Too many submissions. Please wait a moment.' : 'Could not deliver message. Please try again.');
        showToast(errorMsg);
      }
    } catch (err) {
      showToast('Network error. Please check your connection and try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span><i data-lucide="send" style="width: 16px;"></i>';
        if (window.lucide) window.lucide.createIcons();
      }
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

/* -------------------------------------------------------------------------- */
/* Phase 8 — Live CMS & Website Integration Engine                            */
/* Admin → Database → Public Read API (/api/public/site) → Public DOM        */
/* -------------------------------------------------------------------------- */

const CMS_SITE_CACHE_KEY = 'as_public_site_cache';

async function initCmsDynamicHydration() {
  await initCmsIntegration();
}

async function initCmsIntegration() {
  function setMetaTag(attribute, key, content) {
    if (!content) return;
    let el = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attribute, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function setLinkTag(rel, href, type) {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
    if (type) el.setAttribute('type', type);
  }

  function applyCmsData(site) {
    if (!site) return;

    // ─── 1. SEO & Metadata Rehydration ──────────────────────────────────────
    if (site.seo) {
      const seo = site.seo;
      if (seo.title) {
        document.title = seo.title;
        setMetaTag('name', 'title', seo.title);
      }
      if (seo.description) setMetaTag('name', 'description', seo.description);
      if (seo.canonicalUrl) setLinkTag('canonical', seo.canonicalUrl);
      if (seo.keywords) setMetaTag('name', 'keywords', seo.keywords);
      if (seo.author) setMetaTag('name', 'author', seo.author);
      if (seo.robotsDirective) setMetaTag('name', 'robots', seo.robotsDirective);

      if (seo.openGraph) {
        if (seo.openGraph.title) setMetaTag('property', 'og:title', seo.openGraph.title);
        if (seo.openGraph.description) setMetaTag('property', 'og:description', seo.openGraph.description);
        if (seo.openGraph.image) setMetaTag('property', 'og:image', seo.openGraph.image);
        if (seo.openGraph.url) setMetaTag('property', 'og:url', seo.openGraph.url);
      }

      if (seo.twitter) {
        if (seo.twitter.card) setMetaTag('name', 'twitter:card', seo.twitter.card);
        if (seo.twitter.title) setMetaTag('name', 'twitter:title', seo.twitter.title);
        if (seo.twitter.description) setMetaTag('name', 'twitter:description', seo.twitter.description);
        if (seo.twitter.image) setMetaTag('name', 'twitter:image', seo.twitter.image);
      }

      if (seo.faviconUrl) {
        const ext = seo.faviconUrl.split('.').pop().toLowerCase();
        const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : 'image/webp';
        setLinkTag('icon', seo.faviconUrl, mime);
      }
      if (seo.appleTouchIconUrl) {
        setLinkTag('apple-touch-icon', seo.appleTouchIconUrl);
      }
    }

    // ─── 2. Active Resume Rehydration ───────────────────────────────────────
    if (site.resume && site.resume.url) {
      const resumeUrl = site.resume.url;
      document.querySelectorAll('a').forEach((link) => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        const text = (link.textContent || '').toLowerCase();
        if (
          href.includes('resume') ||
          text.includes('resume') ||
          link.id === 'hero-resume-btn' ||
          link.id === 'footer-resume-btn'
        ) {
          link.setAttribute('href', resumeUrl);
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    }

    // ─── 3. Global Settings & Maintenance ───────────────────────────────────
    if (site.settings) {
      const settings = site.settings;

      if (settings.maintenanceMode && !window.location.pathname.startsWith('/admin')) {
        if (!document.getElementById('maintenance-banner')) {
          const banner = document.createElement('div');
          banner.id = 'maintenance-banner';
          banner.style.cssText =
            'position:fixed;top:0;left:0;right:0;z-index:99999;background:#b45309;color:#fff;text-align:center;padding:10px 16px;font-size:12px;font-family:monospace;font-weight:600;box-shadow:0 2px 10px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;gap:8px;';
          banner.innerHTML = `<span>⚠️ ${settings.maintenanceMessage || 'System undergoing scheduled optimization.'}</span>`;
          document.body.prepend(banner);
        }
      } else {
        const banner = document.getElementById('maintenance-banner');
        if (banner) banner.remove();
      }

      if (settings.contactFormEnabled === false) {
        const submitBtn = document.querySelector('#contact-form button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submissions Temporarily Paused';
          submitBtn.style.opacity = '0.6';
          submitBtn.style.cursor = 'not-allowed';
        }
      }

      if (settings.resumeButtonEnabled === false) {
        document.querySelectorAll('a').forEach((link) => {
          const text = (link.textContent || '').toLowerCase();
          if (text.includes('resume')) {
            link.style.display = 'none';
          }
        });
      }

      if (settings.footerText) {
        const footerSpan = document.querySelector('footer .footer-content span');
        if (footerSpan) footerSpan.textContent = settings.footerText;
      }
    }

    // ─── 4. Hero Section Rehydration ────────────────────────────────────────
    if (site.hero) {
      const hero = site.hero;
      if (hero.mainHeading) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
          heroTitle.textContent = hero.mainHeading + (hero.highlightedText ? ` ${hero.highlightedText}` : '');
        }
      }

      if (hero.description || hero.subtitle) {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
          heroSubtitle.innerHTML = hero.description || hero.subtitle;
        }
      }

      if (hero.supportingText) {
        const tagline = document.querySelector('.hero-tagline');
        if (tagline) {
          const spans = tagline.querySelectorAll('span');
          if (spans.length >= 3) {
            spans[2].textContent = hero.supportingText;
          }
        }
      }

      if (hero.availabilityBadge) {
        const typewriter = document.getElementById('red-typewriter-text');
        if (typewriter) typewriter.textContent = hero.availabilityBadge;
      }

      const primaryCta = document.querySelector('.hero-actions a.btn-primary');
      if (primaryCta) {
        if (hero.primaryCtaLabel) {
          const span = primaryCta.querySelector('span');
          if (span) span.textContent = hero.primaryCtaLabel;
        }
        if (hero.primaryCtaUrl) primaryCta.setAttribute('href', hero.primaryCtaUrl);
      }

      if (hero.profileImage) {
        const portraitImg = document.querySelector('.portrait-inner-frame img');
        if (portraitImg && hero.profileImage !== '/assets/anurag-portrait-sm.webp') {
          portraitImg.src = hero.profileImage;
        }
      }
    }

    // ─── 5. Profile & Contact Rehydration ───────────────────────────────────
    if (site.profile) {
      const profile = site.profile;
      if (profile.email) {
        document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
          a.setAttribute('href', `mailto:${profile.email}`);
          if (a.textContent.includes('@')) a.textContent = profile.email;
        });
      }
      if (profile.github) {
        document.querySelectorAll('a[href*="github.com"]').forEach((a) => {
          a.setAttribute('href', profile.github);
        });
      }
      if (profile.linkedin) {
        document.querySelectorAll('a[href*="linkedin.com"]').forEach((a) => {
          a.setAttribute('href', profile.linkedin);
        });
      }
    }

    // ─── 6. About Section Rehydration ───────────────────────────────────────
    if (site.about) {
      const about = site.about;
      if (about.title) {
        const heading = document.getElementById('about-heading');
        if (heading) heading.textContent = about.title;
      }

      let narrativeText = '';
      if (about.personalNarrative && about.personalNarrative.length) {
        narrativeText = about.personalNarrative.map((p) => p.text).join(' ');
      } else if (about.description) {
        narrativeText = about.description;
      }

      if (narrativeText) {
        const paraEl = document.getElementById('about-char-para');
        if (paraEl) {
          let html = '';
          const chars = narrativeText.split('');
          chars.forEach((ch, i) => {
            const display = ch === ' ' ? '\u00A0' : ch;
            html += `<span style="position:relative;display:inline-block;"><span style="opacity:0.3;user-select:none;" aria-hidden="true">${display}</span><span id="ac${i}" style="position:absolute;top:0;left:0;opacity:0.85;transition:opacity 0.2s ease;">${display}</span></span>`;
          });
          paraEl.innerHTML = html;
        }
      }
    }

    // ─── 7. Coding Profiles / Social Links ──────────────────────────────────
    if (site.socialLinks && site.socialLinks.length) {
      site.socialLinks.forEach((link) => {
        const p = (link.platform || '').toLowerCase();
        if (p.includes('leetcode')) {
          const el = document.getElementById('leetcode-link-card');
          if (el && link.url) el.setAttribute('href', link.url);
        } else if (p.includes('geeks') || p.includes('gfg')) {
          const el = document.getElementById('gfg-link-card');
          if (el && link.url) el.setAttribute('href', link.url);
        }
      });
    }

    // ─── 8. Projects Section Dynamic Rehydration ────────────────────────────
    if (site.projects && site.projects.length) {
      const formatStatus = (st) => {
        const s = (st || '').toUpperCase();
        if (s === 'COMPLETED') {
          return { label: 'Completed', symbol: '🟢', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', color: '#10b981' };
        }
        if (s === 'WORKING' || s === 'IN_PROGRESS') {
          return { label: 'Working', symbol: '🟢', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', color: '#06b6d4' };
        }
        return { label: 'Coming Soon', symbol: '🟡', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b' };
      };

      // In-place badge update for standard cards
      site.projects.forEach((proj, i) => {
        const idxStr = `0${i + 1}`.slice(-2);
        const badge = document.getElementById(`main-project-status-${idxStr}`);
        if (badge) {
          const fs = formatStatus(proj.status);
          badge.textContent = `${fs.symbol} Status: ${fs.label}`;
          badge.style.background = fs.bg;
          badge.style.borderColor = fs.border;
          badge.style.color = fs.color;
        }
      });
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons();
      } catch (e) {}
    }
  }

  // 1. Instant Cache Hydration (0ms Stale-While-Revalidate)
  try {
    const rawCache = sessionStorage.getItem(CMS_SITE_CACHE_KEY);
    if (rawCache) {
      const cachedData = JSON.parse(rawCache);
      applyCmsData(cachedData);
    }
  } catch (e) {}

  // 2. Fresh Network Fetch & Live Rehydration
  try {
    const res = await fetch(`${API_BASE}/public/site`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        applyCmsData(json.data);
        try {
          sessionStorage.setItem(CMS_SITE_CACHE_KEY, JSON.stringify(json.data));
        } catch (e) {}
      }
    }
  } catch (err) {
    console.debug('[initCmsIntegration] Falling back to bundled content:', err.message);
  }

  // 3. Real-Time Cross-Tab Broadcast Channel Listener
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel('anurag_portfolio_realtime');
      bc.addEventListener('message', async (ev) => {
        if (ev && ev.data && (ev.data.type === 'cms_content_updated' || ev.data.type === 'project_updated')) {
          try {
            const res = await fetch(`${API_BASE}/public/site?_t=${Date.now()}`);
            if (res.ok) {
              const json = await res.json();
              if (json && json.success && json.data) {
                applyCmsData(json.data);
                try {
                  sessionStorage.setItem(CMS_SITE_CACHE_KEY, JSON.stringify(json.data));
                } catch (e) {}
              }
            }
          } catch (e) {}
        }
      });
    } catch (e) {}
  }
}


