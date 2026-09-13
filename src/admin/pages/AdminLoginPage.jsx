import { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  LayoutDashboard,
  Layers,
  Briefcase,
  BarChart2,
  Settings,
  LogOut,
  Folder,
  Edit3,
  BarChart3,
  MessageSquare,
  Zap,
  Code2,
  Fingerprint,
} from 'lucide-react';

export const AdminLoginPage = ({ onLogin, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [liveClock, setLiveClock] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      const dateStr = now.toLocaleDateString('en-GB', options);
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setLiveClock(`${dateStr} • ${timeStr}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const emailTrimmed = email.trim();
    if (!emailTrimmed || !password) {
      setValidationError('Please provide both administrator ID and password.');
      return;
    }

    const isValidIdentifier =
      emailTrimmed.toLowerCase() === 'anuragsahu' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);
    if (!isValidIdentifier) {
      setValidationError('Please enter a valid administrator ID or email address.');
      return;
    }

    onLogin(emailTrimmed, password, remember);
  };

  return (
    <div className="min-h-screen bg-[#030614] text-slate-100 flex items-center justify-center p-3 sm:p-5 lg:p-7 xl:p-8 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-slate-900/90 border border-cyan-500/50 text-xs text-cyan-200 shadow-2xl backdrop-blur-md animate-bounce">
          {toast}
        </div>
      )}

      {/* SVG Gradient Definition */}
      <svg className="hidden" width="0" height="0">
        <defs>
          <linearGradient id="asBrandGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#06b6d4" />
            <stop offset="75%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>

      {/* Atmospheric Cosmic Nebula Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 left-1/3 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-32 right-0 w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[150px]" />
        <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Main Container: 3-Pane Responsive Grid */}
      <div className="relative z-10 w-full max-w-[1580px] mx-auto flex flex-col lg:flex-row gap-5 xl:gap-7 items-stretch justify-center">
        
        {/* PANE 1: LEFT NAVIGATION SIDEBAR (Desktop) */}
        <aside className="hidden lg:flex w-52 xl:w-60 shrink-0 bg-[#060a1c]/85 border border-slate-800/80 rounded-3xl p-5 flex-col justify-between backdrop-blur-xl shadow-2xl">
          <div>
            {/* Logo & Brand Header */}
            <div className="flex items-center gap-3 px-1 py-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <svg viewBox="0 0 54 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]">
                  <path d="M6 36 L18 8 L27 8 L36 30 L28 30 L25 21 L16 36 Z" fill="url(#asBrandGradReact)" />
                  <path d="M22 28 C22 21, 40 22, 40 15 C40 10, 31 8, 26 11 L27 6 C34 4, 46 6, 46 15 C46 22, 29 22, 29 28 C29 32, 35 33, 40 31 L39 36 C32 38, 22 36, 22 28 Z" fill="url(#asBrandGradReact)" opacity="0.95" />
                </svg>
              </div>
              <div>
                <h2 className="text-xs font-bold tracking-tight text-white font-sans">Anurag Sahu</h2>
                <p className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5">Personal Control Panel</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="mt-8 space-y-1.5" aria-label="Sidebar navigation preview">
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/35 via-blue-500/15 to-transparent border-l-2 border-cyan-400 text-cyan-300 font-medium text-xs shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-default">
                <LayoutDashboard className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-default">
                <Layers className="w-4 h-4 shrink-0" />
                <span>Portfolio</span>
              </div>
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-default">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Projects</span>
              </div>
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-default">
                <BarChart2 className="w-4 h-4 shrink-0" />
                <span>Analytics</span>
              </div>
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-default">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Messages</span>
              </div>
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-default">
                <Settings className="w-4 h-4 shrink-0" />
                <span>Settings</span>
              </div>
            </nav>
          </div>

          {/* Profile Widget */}
          <div className="pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2.5 px-2 py-1 mb-2">
              <div className="relative">
                <img src="/assets/anurag-portrait-sm.webp" alt="Anurag Sahu" className="w-8 h-8 rounded-full object-cover border border-cyan-500/30" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#060a1c] shadow-[0_0_6px_#10b981]" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">Anurag Sahu</p>
                <p className="text-[10px] text-slate-400 font-mono">Owner</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500 font-mono select-none">
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Logout</span>
            </div>
          </div>
        </aside>

        {/* PANE 2: CENTER WORKSPACE PREVIEW (Desktop) */}
        <main className="hidden lg:flex flex-col flex-1 bg-[#05091d]/70 border border-slate-800/80 rounded-3xl p-6 xl:p-8 backdrop-blur-xl justify-between shadow-2xl relative overflow-hidden">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 font-mono">Welcome Back,</p>
                <h1 className="text-2xl xl:text-3xl font-bold text-white tracking-tight mt-0.5">
                  Anurag <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">Sahu</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-mono tracking-wider mt-1 flex items-center gap-2">
                  <span>Control</span> • <span>Monitor</span> • <span>Manage</span>
                </p>
                <p className="text-xs text-slate-400 max-w-xl mt-2 leading-relaxed">
                  Your personal portfolio is live. Stay in control of your projects, analytics and user activity — all from here.
                </p>
              </div>

              {/* Status & Live Clock */}
              <div className="flex flex-col items-end gap-2.5 shrink-0">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="text-left">
                    <span className="font-semibold block leading-none text-emerald-300">System Online</span>
                    <span className="text-[9px] text-emerald-400/80 block mt-0.5">All services running</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-mono tracking-wider">
                  {liveClock}
                </div>
              </div>
            </div>

            {/* 4 Telemetry Metric Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 my-5">
              <div className="p-4 rounded-2xl bg-[#080d26]/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="mt-3">
                  <p className="text-[11px] text-slate-400 font-mono">Total Visits</p>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-xl font-bold text-white font-mono">12.4K</span>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5 font-semibold">↑ 12%</span>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60">
                  <svg className="w-full h-5 overflow-visible" viewBox="0 0 100 20" fill="none">
                    <path d="M 0 16 Q 25 19 40 11 T 75 14 T 100 4" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080d26]/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="mt-3">
                  <p className="text-[11px] text-slate-400 font-mono">Projects Live</p>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-xl font-bold text-white font-mono">8</span>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5 font-semibold">↑ 100%</span>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60">
                  <svg className="w-full h-5 overflow-visible" viewBox="0 0 100 20" fill="none">
                    <path d="M 0 17 Q 30 18 50 14 T 80 8 T 100 5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080d26]/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="mt-3">
                  <p className="text-[11px] text-slate-400 font-mono">Messages</p>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-xl font-bold text-white font-mono">24</span>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5 font-semibold">↑ 8%</span>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60">
                  <svg className="w-full h-5 overflow-visible" viewBox="0 0 100 20" fill="none">
                    <path d="M 0 15 Q 25 17 55 9 T 80 13 T 100 6" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080d26]/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="mt-3">
                  <p className="text-[11px] text-slate-400 font-mono">Uptime</p>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-xl font-bold text-white font-mono">99.9%</span>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5 font-semibold">↑ 0.1%</span>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60">
                  <svg className="w-full h-5 overflow-visible" viewBox="0 0 100 20" fill="none">
                    <path d="M 0 14 Q 30 15 60 11 T 85 8 T 100 7" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="my-2">
              <div className="mb-2.5">
                <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">Quick Actions</h3>
                <p className="text-[11px] text-slate-500 font-mono">Manage your portfolio elements</p>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#080d26]/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-center justify-between text-xs text-slate-300 group cursor-default">
                  <div className="flex items-center gap-2.5">
                    <Folder className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-slate-200">Manage Projects</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="p-3 rounded-xl bg-[#080d26]/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-center justify-between text-xs text-slate-300 group cursor-default">
                  <div className="flex items-center gap-2.5">
                    <Edit3 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-slate-200">Update Content</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="p-3 rounded-xl bg-[#080d26]/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-center justify-between text-xs text-slate-300 group cursor-default">
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-slate-200">View Analytics</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="p-3 rounded-xl bg-[#080d26]/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-center justify-between text-xs text-slate-300 group cursor-default">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-slate-200">Check Messages</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Lower Mountain & Water Horizon */}
          <div className="mt-4 relative rounded-2xl h-48 xl:h-56 overflow-hidden border border-slate-800/90 bg-gradient-to-b from-[#060b24] via-[#040819] to-[#02030b] flex items-end p-5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-2 left-1/4 w-80 h-36 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-6 right-1/4 w-72 h-32 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            <svg className="absolute bottom-0 left-0 right-0 w-full h-28 text-[#080e2a] pointer-events-none" viewBox="0 0 800 130" preserveAspectRatio="none" fill="currentColor">
              <path d="M0,130 L0,70 L50,45 L130,68 L220,30 L310,65 L400,18 L490,60 L580,28 L670,70 L740,45 L800,75 L800,130 Z" opacity="0.35" fill="#0c1740" />
              <path d="M0,130 L0,88 L80,65 L170,95 L270,50 L360,85 L440,35 L520,75 L620,50 L710,90 L800,80 L800,130 Z" opacity="0.6" fill="#060c22" />
              <line x1="0" y1="128" x2="800" y2="128" stroke="#00f2fe" strokeWidth="1.5" opacity="0.75" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-cyan-500/15 via-blue-500/5 to-transparent pointer-events-none" />

            {/* Neon Script */}
            <div className="relative z-10 select-none pb-1 pl-2 font-serif">
              <div className="text-2xl xl:text-3xl text-cyan-200 font-bold -rotate-3 leading-tight tracking-wide drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] font-sans italic">
                Dream<br />
                <span className="ml-3 text-cyan-100">Build</span><br />
                <span className="ml-6 text-white relative inline-block">
                  Repeat
                  <svg className="absolute -bottom-2 -left-3 w-32 h-5 overflow-visible" viewBox="0 0 120 20" fill="none">
                    <path d="M 5 10 Q 60 20 115 6" stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Floating Live Badge */}
            <div className="relative z-10 ml-auto pb-1">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 transition-all hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>Your Portfolio Live at anuragsahu.com</span>
                <ArrowRight className="w-3.5 h-3.5 -rotate-45" />
              </a>
            </div>
          </div>
        </main>

        {/* PANE 3: RIGHT ADMIN ACCESS LOGIN CARD */}
        <section className="w-full lg:w-[400px] xl:w-[440px] shrink-0 flex flex-col justify-center">
          <div className="bg-[#06091a]/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 xl:p-9 shadow-[0_0_40px_rgba(6,182,212,0.12),0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
            
            {/* Ambient Card Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Ribbon AS Monogram */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-purple-500/20 border border-cyan-500/50 flex items-center justify-center p-2.5 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                <svg viewBox="0 0 54 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]">
                  <path d="M6 36 L18 8 L27 8 L36 30 L28 30 L25 21 L16 36 Z" fill="url(#asBrandGradReact)" />
                  <path d="M22 28 C22 21, 40 22, 40 15 C40 10, 31 8, 26 11 L27 6 C34 4, 46 6, 46 15 C46 22, 29 22, 29 28 C29 32, 35 33, 40 31 L39 36 C32 38, 22 36, 22 28 Z" fill="url(#asBrandGradReact)" opacity="0.95" />
                </svg>
              </div>
            </div>

            {/* Headings */}
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">Admin Access</h2>
              <p className="text-xs text-cyan-400 font-mono mt-1 tracking-wide">Enter your credentials to continue</p>
            </div>

            {/* Error Alert Pill */}
            {(error || validationError) && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-300 shadow-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{validationError || error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-300 font-mono mb-1.5">
                  Email / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="admin-email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="anurag@example.com"
                    autoComplete="username"
                    className="w-full bg-[#080d24] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/70 font-mono transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-300 font-mono mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full bg-[#080d24] border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/70 font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Master credentials belong solely to Anurag Sahu.')}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline text-xs transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#00b4d8] via-[#0077b6] to-[#7209b7] hover:from-[#0096c7] hover:to-[#560bad] text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-[0_4px_25px_rgba(0,180,216,0.35)] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#06091a] px-3 text-[11px] text-slate-500 font-mono uppercase tracking-wider relative z-10">
                or
              </span>
            </div>

            {/* Secondary Biometrics Button */}
            <button
              type="button"
              onClick={() => showToast('Biometrics currently in private staging for site owner.')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-800/90 bg-[#080d24]/70 hover:bg-[#0d1538] text-slate-300 hover:text-white transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Fingerprint className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Use Biometrics</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-slate-800/90 text-slate-400 border border-slate-700/60">
                Coming Soon
              </span>
            </button>
          </div>

          {/* Security Notice Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center leading-relaxed">
            <Lock className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <span>This is a private access panel. Only authorized users can access this area.</span>
          </div>
        </section>

      </div>
    </div>
  );
};

