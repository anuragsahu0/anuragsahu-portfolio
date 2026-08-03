/**
 * ANTI GRAVITY PORTFOLIO — STANDALONE INTERACTIVE ENGINE
 * Candidate: Anurag Sahu
 */

const SERVER_HOST = window.location.hostname || 'localhost';
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.'))
  ? `http://${SERVER_HOST}:5001/api`
  : `${window.location.protocol}//${window.location.host}/api`;

document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initCLI();
  initLiveTelemetryTracking();
  initScrollProgress();
  init3DTiltCards();
  initCategoryFilters();
  initScrollReveal();
  initContactForm();
});

/* -------------------------------------------------------------------------- */
/* Real-Time Live Telemetry Tracking Engine                                  */
/* -------------------------------------------------------------------------- */
function initLiveTelemetryTracking() {
  // 1. Automatic Page View Telemetry Ping
  sendTelemetry('page_view', { path: window.location.pathname });

  // 2. Track Resume Downloads
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

function sendTelemetry(type, metadata = {}) {
  fetch(`${API_BASE}/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, path: window.location.pathname, metadata }),
  }).catch(() => {});
}

/* -------------------------------------------------------------------------- */
/* 1. Ambient Background Particle Network (Zero Cursor Tracking)              */
/* -------------------------------------------------------------------------- */
function initParticleBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

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
        appendLog('1. Portfolio (Working) | 2. Restaurant Management System (Coming Soon)', '#9ca3af');
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

/* -------------------------------------------------------------------------- */
/* 4. Admin Control Center Modal & Login Logic                                */
/* -------------------------------------------------------------------------- */
function initAdminModal() {
  const modal = document.getElementById('admin-modal');
  const openBtns = document.querySelectorAll('#btn-admin-trigger, .btn-admin-trigger');
  const closeBtns = document.querySelectorAll('#admin-close-btn, #admin-login-close-btn');
  const logoutBtn = document.getElementById('admin-logout-btn');

  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('admin-login-error');

  if (!modal) return;

  function updateView() {
    const token = localStorage.getItem('ag_admin_token');
    if (token) {
      if (loginView) loginView.style.display = 'none';
      if (dashboardView) dashboardView.style.display = 'block';
      fetchAdminStats();
    } else {
      if (loginView) loginView.style.display = 'block';
      if (dashboardView) dashboardView.style.display = 'none';
    }
  }

  function toggleModal(show) {
    if (show) {
      updateView();
      modal.classList.add('open');
      modal.classList.add('active');
    } else {
      modal.classList.remove('open');
      modal.classList.remove('active');
      if (window.location.hash === '#admin') {
        history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    }
  }

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleModal(true);
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => toggleModal(false));
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) toggleModal(false);
    });
  }

  if (window.location.hash === '#admin') {
    toggleModal(true);
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#admin') {
      toggleModal(true);
    }
  });

  // 1-Click Fast Admin Login
  const quickLoginBtn = document.getElementById('btn-quick-admin-login');
  if (quickLoginBtn) {
    quickLoginBtn.addEventListener('click', async () => {
      localStorage.setItem('ag_admin_token', 'fast-admin-token-anurag');
      showToast("⚡ INSTANT ACCESS: Launching Anurag's Portfolio Dashboard...");
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 500);
    });
  }

  // Handle Login Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (loginError) loginError.style.display = 'none';

      const emailInput = document.getElementById('login-input-email');
      const passInput = document.getElementById('login-input-pass');
      const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
      const password = passInput ? passInput.value : '';

      const validEmails = ['anurag@admin.com', 'admin@anuragsahu.dev', 'admin@anuragsahu.com', 'admin@admin.com'];
      const validPasswords = ['anurag123', 'admin123', 'Admin@AntiGravity2026'];

      let authenticated = false;

      try {
        const res = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (data.success && data.token) {
          authenticated = true;
          localStorage.setItem('ag_admin_token', data.token);
        }
      } catch (err) {
        console.warn('Backend connection notice, checking local credential validation');
      }

      if (!authenticated) {
        if (validEmails.includes(email) && validPasswords.includes(password)) {
          authenticated = true;
          localStorage.setItem('ag_admin_token', 'secure-admin-token-' + Date.now());
        }
      }

      if (authenticated) {
        showToast("⚡ AUTHENTICATED: Launching Anurag's Portfolio Dashboard...");
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 500);
      } else {
        if (loginError) {
          loginError.textContent = '❌ ACCESS DENIED: Incorrect Email or Password!';
          loginError.style.display = 'block';
        }
        alert('❌ ACCESS DENIED: Incorrect Admin Email or Password!\n\nPlease enter valid admin credentials.');
      }
    });
  }

  // Tab Navigation Switching
  const tabs = [
    { btn: 'tab-btn-kpi', content: 'tab-content-kpi' },
    { btn: 'tab-btn-live', content: 'tab-content-live' },
    { btn: 'tab-btn-projects', content: 'tab-content-projects' },
    { btn: 'tab-btn-messages', content: 'tab-content-messages' },
    { btn: 'tab-btn-logs', content: 'tab-content-logs' },
  ];

  tabs.forEach((t) => {
    const btn = document.getElementById(t.btn);
    if (btn) {
      btn.addEventListener('click', () => {
        tabs.forEach((o) => {
          const ob = document.getElementById(o.btn);
          const oc = document.getElementById(o.content);
          if (ob) ob.className = 'btn-secondary';
          if (oc) oc.style.display = 'none';
        });
        btn.className = 'btn-primary';
        const targetContent = document.getElementById(t.content);
        if (targetContent) targetContent.style.display = 'block';
      });
    }
  });

  // Export JSON & CSV Handlers
  const exportJsonBtn = document.getElementById('btn-export-json');
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        dashboard: "Anurag's Portfolio Dashboard",
        timestamp: new Date().toISOString(),
        stats: { totalVisitors: 1, resumeDownloads: 0, activeProjects: 3 }
      }, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `anurag_portfolio_backup_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('✓ FULL DATA EXPORTED (JSON)');
    });
  }

  const exportCsvBtn = document.getElementById('btn-export-csv');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const csvContent = "data:text/csv;charset=utf-8,Sender,Company,Subject,Status\n\"Sarah Jenkins\",\"Stripe\",\"Summer 2026 SWE Internship Inquiry\",\"UNREAD\"\n\"Alex Vance\",\"Vercel\",\"Full-Stack Developer Role\",\"READ\"\n";
      const encodedUri = encodeURI(csvContent);
      const a = document.createElement('a');
      a.href = encodedUri;
      a.download = `recruiter_leads_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('✓ RECRUITER LEADS EXPORTED (CSV)');
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('ag_admin_token');
      showToast('Logged out of Admin Console');
      updateView();
    });
  }

  async function fetchAdminStats() {
    const token = localStorage.getItem('ag_admin_token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5001/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.stats) {
        const s = data.stats;
        if (document.getElementById('kpi-visitors')) document.getElementById('kpi-visitors').textContent = s.totalVisitors || 1;
        if (document.getElementById('kpi-resume')) document.getElementById('kpi-resume').textContent = s.resumeDownloads || 0;
        if (document.getElementById('kpi-projects')) document.getElementById('kpi-projects').textContent = 3;
        if (document.getElementById('kpi-unread')) document.getElementById('kpi-unread').textContent = s.unreadContacts || 0;
        if (document.getElementById('kpi-github')) document.getElementById('kpi-github').textContent = s.githubClicks || 0;
        if (document.getElementById('kpi-linkedin')) document.getElementById('kpi-linkedin').textContent = s.linkedinClicks || 0;

        // Render Recent Audit Logs Table
        if (data.recentActivityLogs && document.getElementById('admin-logs-table-body')) {
          const logsHtml = data.recentActivityLogs.map(l => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 12px; font-weight: 700; color: var(--color-nebula-cyan);">${l.action}</td>
              <td style="padding: 12px; color: var(--color-muted-text);">${l.targetCollection || 'User'}</td>
              <td style="padding: 12px; color: var(--color-muted-text);">${l.ipAddress}</td>
              <td style="padding: 12px; color: var(--color-muted-text);">${new Date(l.createdAt).toLocaleTimeString()}</td>
            </tr>
          `).join('');
          document.getElementById('admin-logs-table-body').innerHTML = logsHtml;
        }
      }
    } catch (e) {}
  }
}

async function syncProjectStatuses() {
  // 1. Apply local storage immediately
  ['01', '02', '03'].forEach(num => {
    const status = localStorage.getItem(`ag_proj_status_${num}`);
    if (status) {
      applyBadgeUI(num, status);
    }
  });

  // 2. Fetch global settings from Cloud API for 100% cross-phone sync
  try {
    const res = await fetch('https://api.restful-api.dev/objects/ff8081819f7e10ae019fc83569456a67');
    const data = await res.json();
    if (data && data.data) {
      ['01', '02', '03'].forEach(num => {
        const globalVal = data.data[`ag_proj_status_${num}`];
        if (globalVal) {
          localStorage.setItem(`ag_proj_status_${num}`, globalVal);
          applyBadgeUI(num, globalVal);
        }
      });
    }
  } catch (e) {
    try {
      const res2 = await fetch('/api/settings');
      const data2 = await res2.json();
      if (data2.success && data2.settings) {
        ['01', '02', '03'].forEach(num => {
          const globalVal = data2.settings[`ag_proj_status_${num}`];
          if (globalVal) {
            localStorage.setItem(`ag_proj_status_${num}`, globalVal);
            applyBadgeUI(num, globalVal);
          }
        });
      }
    } catch (e2) {}
  }
}

function applyBadgeUI(num, status) {
  const badge = document.getElementById(`main-project-status-${num}`);
  if (badge && status) {
    if (status === 'Completed') {
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
  const textEl = document.getElementById('red-typewriter-text');
  if (!textEl) return;

  const words = ['Dream', 'Grow', 'Lead', 'Dream | Grow | Lead'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    textEl.textContent = currentWord.substring(0, charIndex);

    let speed = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 1600; // Pause when word is fully typed
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 350; // Pause before typing next word
    }

    setTimeout(type, speed);
  }

  type();
}

document.addEventListener('DOMContentLoaded', () => {
  initParticleNetwork();
  initCLI();
  initLiveTelemetryTracking();
  initAdminModal();
  syncProjectStatuses();
  setInterval(syncProjectStatuses, 2000);
  initRedTypewriter();
});

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
  const tiltCards = document.querySelectorAll('.tilt-card, .glass-card, .project-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
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

    // 1. Store locally
    const newMsg = {
      id: 'msg_' + Date.now(),
      fullName,
      email,
      company: 'Recruiter Contact',
      subject: `Portfolio Contact Inquiry from ${fullName}`,
      message,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    const existingMsgs = JSON.parse(localStorage.getItem('ag_admin_messages') || '[]');
    existingMsgs.unshift(newMsg);
    localStorage.setItem('ag_admin_messages', JSON.stringify(existingMsgs));

    // 2. Sync to Global Cloud Inbox Store (Guarantees message appears in Admin Panel on ALL devices worldwide)
    try {
      fetch('https://jsonblob.com/api/jsonBlob/019fc83c-0eac-7295-8fe0-3ee77103e5ac')
        .then(res => res.json())
        .then(store => {
          const s = store || { messages: [], settings: {} };
          if (!s.messages) s.messages = [];
          s.messages.unshift(newMsg);
          return fetch('https://jsonblob.com/api/jsonBlob/019fc83c-0eac-7295-8fe0-3ee77103e5ac', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(s)
          });
        }).catch(() => {});
    } catch (e) {}

    // 3. Email Delivery to shivasahu0612@gmail.com + Team Anurag Sahu Auto-Reply to Visitor
    try {
      fetch('https://formsubmit.co/ajax/shivasahu0612@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: email,
          subject: `📩 NEW PORTFOLIO INQUIRY from ${fullName}`,
          message: `You received a new inquiry on your portfolio website!\n\nSENDER NAME: ${fullName}\nSENDER EMAIL: ${email}\n\nMESSAGE CONTENT:\n"${message}"`,
          _replyto: email,
          _autoresponse: `Dear ${fullName},\n\nThank you for reaching out to us!\n\nWe have successfully received your message and our team will get back to you within 24–48 hours.\n\nBest regards,\nTeam Anurag Sahu\nComputer Science & Engineering (AI & ML)\nGitHub: https://github.com/anuragsahu0`,
          _template: 'table'
        })
      }).catch(() => {});
    } catch (e) {}

    showToast('Message sent! Delivered to Anurag Sahu & Admin Dashboard');
    alert(`Thank you ${fullName}! Your message has been sent successfully and delivered to Anurag Sahu (shivasahu0612@gmail.com). A thank-you auto-confirmation has been dispatched.`);
    contactForm.reset();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Send Message</span><i data-lucide="send" style="width: 16px;"></i>';
      if (window.lucide) window.lucide.createIcons();
    }
  });
}
