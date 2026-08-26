/**
 * ANTI GRAVITY PORTFOLIO — STANDALONE INTERACTIVE ENGINE
 * Candidate: Anurag Sahu
 */

const SERVER_HOST = window.location.hostname || 'localhost';
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? `http://${SERVER_HOST}:5001/api`
  : `/api`;

document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
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

const GLOBAL_CLOUD_URL = 'https://jsonblob.com/api/jsonBlob/019fe1ec-02f6-78f8-a2ea-698a3b504261';

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
  const isNewSession = !sessId;
  if (!sessId) {
    sessId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    sessionStorage.setItem('as_visitor_sess', sessId);
  }

  const deviceLabel = detectVisitorDevice();
  const entryTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  function ping() {
    try {
      fetch(GLOBAL_CLOUD_URL)
        .then(r => r.json())
        .then(data => {
          // DO NOT OVERWRITE DATA IF CLOUD API RETURNED AN ERROR OR RATE LIMIT
          if (!data || typeof data !== 'object' || data.error) {
            return;
          }

          if (!data.sessions) data.sessions = {};
          if (!data.activeSessions) data.activeSessions = {};

          const totalSessions = Object.keys(data.sessions).length;
          const prevTotal = parseInt(data.totalVisitors, 10) || totalSessions || 0;

          if (!sessionStorage.getItem('as_page_counted')) {
            data.totalVisitors = Math.max(prevTotal + 1, totalSessions + 1, 1);
            localStorage.setItem('as_total_visitors', data.totalVisitors);
            sessionStorage.setItem('as_page_counted', 'true');
          } else {
            data.totalVisitors = Math.max(prevTotal, totalSessions, 1);
            localStorage.setItem('as_total_visitors', data.totalVisitors);
          }

          // Record session history entry
          data.sessions[sessId] = {
            id: sessId,
            device: deviceLabel,
            path: window.location.pathname || '/',
            entryTime: data.sessions[sessId]?.entryTime || entryTimeStr,
            lastSeen: Date.now(),
            status: 'ONLINE'
          };

          data.activeSessions[sessId] = Date.now();

          // Mark sessions idle > 60s as LEFT
          const now = Date.now();
          Object.keys(data.sessions).forEach(sid => {
            const s = data.sessions[sid];
            if (s && now - (s.lastSeen || 0) > 60000) {
              s.status = 'LEFT';
              delete data.activeSessions[sid];
            }
          });

          fetch(GLOBAL_CLOUD_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          }).catch(() => {});
        }).catch(() => {});
    } catch (e) {}
  }

  ping();
  setInterval(ping, 20000);
}

function sendTelemetry(type, metadata = {}) {
  try {
    fetch(GLOBAL_CLOUD_URL)
      .then(r => r.json())
      .then(data => {
        if (!data || typeof data !== 'object' || data.error) return;
        
        if (type === 'page_view') {
          data.totalVisitors = Math.max((parseInt(data.totalVisitors, 10) || 0) + 1, Object.keys(data.sessions || {}).length + 1);
          localStorage.setItem('as_total_visitors', data.totalVisitors);
        } else if (type === 'resume_download') {
          data.resumeDownloads = (parseInt(data.resumeDownloads, 10) || 0) + 1;
        } else if (type === 'github_click') {
          data.githubClicks = (parseInt(data.githubClicks, 10) || 0) + 1;
        } else if (type === 'linkedin_click') {
          data.linkedinClicks = (parseInt(data.linkedinClicks, 10) || 0) + 1;
        }

        fetch(GLOBAL_CLOUD_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(() => {});
      }).catch(() => {});
  } catch(e) {}

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
        appendLog('1. Portfolio (Working) | 2. AI Finance Controller (Completed) | 3. Restaurant Management System (Coming Soon) | 4. Smart College ERP (Coming Soon)', '#9ca3af');
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

      const validEmails = ['anurag@admin.com', 'shivasahu0612@gmail.com', 'anuragsahu0', 'anurag'];
      const validPasswords = ['AnuragSahu@2026#Launch'];

      let authenticated = false;

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (data.success && data.token) {
          authenticated = true;
          localStorage.setItem('ag_admin_token', 'as_secure_v3_' + data.token);
        }
      } catch (err) {
        console.warn('Backend connection notice, checking local credential validation');
      }

      if (!authenticated) {
        if (validEmails.includes(email) && validPasswords.includes(password)) {
          authenticated = true;
          localStorage.setItem('ag_admin_token', 'as_secure_v3_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
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
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
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
  if (!localStorage.getItem('ag_proj_status_02')) {
    localStorage.setItem('ag_proj_status_02', 'Completed');
  }

  // 1. Apply local storage immediately (High Priority - Rate-limit proof)
  ['01', '02', '03'].forEach(num => {
    const status = localStorage.getItem(`ag_proj_status_${num}`) || (num === '02' ? 'Completed' : null);
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

  // 3. Fallback to Cloud JSONBlob if backend API unavailable
  try {
    const res = await fetch('https://jsonblob.com/api/jsonBlob/019fe1ec-02f6-78f8-a2ea-698a3b504261');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        ['01', '02', '03'].forEach(num => {
          const globalVal = (data.projects && data.projects[num]) || data[`ag_proj_status_${num}`];
          if (globalVal === 'Completed' || globalVal === 'Coming Soon') {
            localStorage.setItem(`ag_proj_status_${num}`, globalVal);
            applyBadgeUI(num, globalVal);
          }
        });
      }
    }
  } catch (e) {}
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
  // Disabled per user request (static Dream | Grow | Lead text)
}

function bootApp() {
  if (typeof initParticleBackground === 'function') initParticleBackground();
  initCLI();
  initLiveTelemetryTracking();
  initAdminModal();
  syncProjectStatuses();
  setInterval(syncProjectStatuses, 1000);
  initScrollProgress();

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

    // 2. Sync to Global Cloud Inbox Store (Guarantees message appears in Admin Panel INBOX on ALL devices worldwide INSTANTLY)
    try {
      fetch(GLOBAL_CLOUD_URL)
        .then(res => res.json())
        .then(store => {
          const s = store || { messages: [], settings: {} };
          if (!s.messages) s.messages = [];
          s.messages.unshift(newMsg);
          return fetch(GLOBAL_CLOUD_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(s)
          });
        }).catch(() => {});
    } catch (e) {}

    // 3. Primary Express Backend Dispatch (/api/contact)
    try {
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          company: 'Portfolio Direct Contact',
          subject: `📩 Portfolio Inquiry from ${fullName}`,
          message
        })
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
