import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Lock,
  AlertTriangle,
  Eye,
  EyeOff,
  FastForward,
  Volume2,
  VolumeX,
  Crosshair,
  Shield,
} from 'lucide-react';

export const AdminLoginPage = ({ onLogin, isLoading, error }) => {
  const [email, setEmail] = useState('anuragsahu');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [toast, setToast] = useState(null);

  // HUD Animation States
  const [hudActive, setHudActive] = useState(true);
  const [hudPillText, setHudPillText] = useState('Targeting');
  const [hudPillClass, setHudPillClass] = useState(
    'mt-1 px-4 py-1 rounded-full bg-[#00e5cc] text-[#02181b] font-bold text-xs tracking-wider uppercase shadow-[0_0_15px_#00e5cc]'
  );
  const [audioMuted, setAudioMuted] = useState(false);
  const [telemetry, setTelemetry] = useState([0.356, 0.357, 0.358, 0.359, 0.360]);

  const audioCtxRef = useRef(null);

  const playSynthSound = useCallback((type) => {
    if (audioMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'ping') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.07);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'lock') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1180, now);
        osc.frequency.setValueAtTime(1760, now + 0.06);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (_) {}
  }, [audioMuted]);

  // Live telemetry oscillation
  useEffect(() => {
    if (!hudActive) return;
    const base = [0.356, 0.357, 0.358, 0.359, 0.360];
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count % 12 === 0) playSynthSound('ping');
      const jitter = (Math.random() - 0.5) * 0.0015;
      setTelemetry(base.map((n) => Number((n + jitter).toFixed(3))));
    }, 90);
    return () => clearInterval(interval);
  }, [hudActive, playSynthSound]);

  // Auto transition timeline
  useEffect(() => {
    if (!hudActive) return;
    setHudPillText('Targeting');
    setHudPillClass(
      'mt-1 px-4 py-1 rounded-full bg-[#00e5cc] text-[#02181b] font-bold text-xs tracking-wider uppercase shadow-[0_0_15px_#00e5cc]'
    );

    const lockTimer = setTimeout(() => {
      setHudPillText('Target Acquired');
      setHudPillClass(
        'mt-1 px-4 py-1 rounded-full bg-emerald-400 text-[#02181b] font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_#10b981] animate-pulse'
      );
      playSynthSound('lock');
    }, 2300);

    const transitionTimer = setTimeout(() => {
      setHudActive(false);
    }, 3200);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        setHudActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(lockTimer);
      clearTimeout(transitionTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hudActive, playSynthSound]);

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

    onLogin(emailTrimmed, password, remember);
  };

  return (
    <div className="min-h-screen bg-[#011517] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none font-mono">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 text-xs text-cyan-200 shadow-2xl backdrop-blur-md animate-bounce">
          {toast}
        </div>
      )}

      {/* Atmospheric Cyber Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00e5cc]/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 right-10 w-[500px] h-[500px] bg-[#008f82]/15 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#00e5cc_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      {/* ============================================================ */}
      {/* 1. HUD RADAR TARGETING BOOT ANIMATION (Images 1 & 2)         */}
      {/* ============================================================ */}
      {hudActive && (
        <div
          className="fixed inset-0 z-50 bg-[#030708] flex flex-col items-center justify-between p-4 sm:p-7 select-none font-mono text-cyan-400 overflow-hidden transition-all duration-700 cursor-pointer"
          onClick={() => setHudActive(false)}
        >
          {/* Grid & Scanlines */}
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#00e5cc_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(0,229,204,0.12)_0%,transparent_65%)]" />

          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between relative z-20 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHudActive(false);
              }}
              className="px-3 py-1.5 rounded border border-cyan-500/40 bg-[#041619]/80 text-[11px] hover:bg-cyan-500/20 hover:border-cyan-400 text-cyan-300 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,229,204,0.15)]"
            >
              <span>Skip Scan [ESC]</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-cyan-300">
                User1100101
              </span>
              <span className="text-[10px] text-cyan-400 -mt-0.5 animate-bounce">▼</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAudioMuted(!audioMuted);
              }}
              className="p-1.5 rounded border border-cyan-500/40 bg-[#041619]/80 hover:bg-cyan-500/20 text-cyan-300 text-xs transition-all shadow-[0_0_10px_rgba(0,229,204,0.15)]"
              title="Toggle audio"
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Center Stage Reticle */}
          <div className="relative z-20 flex items-center justify-center my-auto w-full max-w-4xl">
            {/* Left Telemetry */}
            <div className="hidden sm:flex items-center gap-3 xl:gap-5 pr-2">
              <div className="flex flex-col items-end gap-1 text-[11px] font-mono select-none">
                <span className="text-cyan-500/50">{telemetry[0]}</span>
                <span className="text-cyan-400/80">{telemetry[1]}</span>
                <div className="px-2 py-0.5 rounded border border-cyan-400 bg-cyan-500/20 text-cyan-200 font-bold shadow-[0_0_12px_rgba(0,229,204,0.5)]">
                  {telemetry[2]}
                </div>
                <span className="text-cyan-400/80">{telemetry[3]}</span>
                <span className="text-cyan-500/50">{telemetry[4]}</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                <span className="text-sm font-mono">+</span>
                <span className="text-sm font-mono">&gt;</span>
              </div>
            </div>

            {/* Reticle Radar SVG */}
            <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] flex items-center justify-center shrink-0">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 380 380" fill="none">
                <polygon
                  points="65,15 315,15 365,65 365,315 315,365 65,365 15,315 15,65"
                  stroke="#00e5cc"
                  strokeWidth="1.5"
                  strokeOpacity="0.65"
                  fill="none"
                />
                <circle cx="190" cy="190" r="135" stroke="#00e5cc" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
                <circle cx="190" cy="55" r="3.5" fill="#00e5cc" />
                <circle cx="190" cy="325" r="3.5" fill="#00e5cc" />
                <circle cx="55" cy="190" r="3.5" fill="#00e5cc" />
                <circle cx="325" cy="190" r="3.5" fill="#00e5cc" />

                {/* Left & Right Glowing Arcs */}
                <path d="M 75 130 A 135 135 0 0 0 75 250" stroke="#00e5cc" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <path d="M 305 130 A 135 135 0 0 1 305 250" stroke="#00e5cc" strokeWidth="4.5" strokeLinecap="round" fill="none" />

                {/* Dark Inner Visor */}
                <circle cx="190" cy="190" r="95" fill="#051214" fillOpacity="0.95" stroke="#00e5cc" strokeWidth="1.2" strokeOpacity="0.45" />
                <line x1="85" y1="190" x2="295" y2="190" stroke="#00e5cc" strokeWidth="1" strokeOpacity="0.65" />
                <line x1="190" y1="85" x2="190" y2="295" stroke="#00e5cc" strokeWidth="1" strokeOpacity="0.65" />
                <circle cx="190" cy="190" r="6" stroke="#00e5cc" strokeWidth="1.5" fill="none" />
              </svg>

              {/* Rotating Sweep Beam */}
              <div className="absolute w-[184px] h-[184px] rounded-full overflow-hidden pointer-events-none animate-spin" style={{ animationDuration: '2.8s' }}>
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg at 50% 50%, rgba(0, 229, 204, 0.5) 0deg, rgba(0, 229, 204, 0.05) 45deg, transparent 60deg, transparent 360deg)',
                  }}
                />
              </div>
            </div>

            {/* Right Telemetry */}
            <div className="hidden sm:flex items-center gap-3 xl:gap-5 pl-2">
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                <span className="text-sm font-mono">&lt;</span>
                <span className="text-sm font-mono">+</span>
              </div>
              <div className="flex flex-col items-start gap-1 text-[11px] font-mono select-none">
                <span className="text-cyan-500/50">{telemetry[0]}</span>
                <span className="text-cyan-400/80">{telemetry[1]}</span>
                <div className="px-2 py-0.5 rounded border border-cyan-400 bg-cyan-500/20 text-cyan-200 font-bold shadow-[0_0_12px_rgba(0,229,204,0.5)]">
                  {telemetry[2]}
                </div>
                <span className="text-cyan-400/80">{telemetry[3]}</span>
                <span className="text-cyan-500/50">{telemetry[4]}</span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="w-full max-w-md flex flex-col items-center relative z-20 pb-4 space-y-3.5">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">MODE</span>
              <div className={hudPillClass}>{hudPillText}</div>
            </div>

            <div className="w-64 sm:w-72 py-2.5 px-4 bg-[#051417]/90 border border-cyan-500/50 rounded-lg text-center text-xs sm:text-sm text-cyan-200 font-mono shadow-[0_0_15px_rgba(0,229,204,0.15)] flex items-center justify-center gap-1">
              <span>anuragsahu</span>
              <span className="w-1.5 h-4 bg-cyan-400 animate-pulse inline-block" />
            </div>

            <p className="text-[10px] text-cyan-500/60 tracking-wider">CLICK ANYWHERE OR PRESS ESC TO OPEN LOGIN</p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. CYBERNETIC TERMINAL LOGIN SCREEN (Image 3)                */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full max-w-[430px] mx-auto select-none">
        {/* Replay HUD Radar Button */}
        <button
          type="button"
          onClick={() => setHudActive(true)}
          className="fixed top-4 right-4 z-30 px-3 py-1.5 rounded border border-[#00e6c3]/40 bg-[#02181b]/80 text-[#00e6c3] hover:bg-[#00e6c3]/15 hover:border-[#00e6c3] text-xs font-mono transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,230,195,0.2)]"
          title="Replay HUD Radar Targeting Animation"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>HUD Radar</span>
        </button>

        {/* Outer Cyber Chassis Plate */}
        <div
          className="relative bg-[#021a1d] border-2 border-[#008f82] p-5 sm:p-7 pt-9 shadow-[0_0_40px_rgba(0,143,130,0.3)]"
          style={{
            clipPath:
              'polygon(0 35px, 35px 35px, 35px 0, calc(100% - 60px) 0, 100% 60px, 100% 100%, 0 100%)',
          }}
        >
          {/* Ventilation Louvers (////) */}
          <div className="absolute top-2.5 left-24 right-28 h-5 overflow-hidden pointer-events-none opacity-40">
            <div
              className="w-full h-full"
              style={{
                background:
                  'repeating-linear-gradient(45deg, #00e6c3 0, #00e6c3 5px, transparent 5px, transparent 14px)',
              }}
            />
          </div>

          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-12 bg-[#008f82]" />

          {/* Recessed Inner Vessel with Neon Glow */}
          <div className="relative bg-[#032125] border-2 border-[#00e6c3] p-5 sm:p-7 shadow-[0_0_35px_rgba(0,230,195,0.45),inset_0_0_30px_rgba(0,230,195,0.25)]">
            <div className="absolute -top-1 left-8 w-6 h-1.5 bg-[#00e6c3]" />
            <div className="absolute -top-1 right-8 w-6 h-1.5 bg-[#00e6c3]" />
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#00e6c3]" />
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#00e6c3]" />
            <div className="absolute -bottom-1 left-12 w-8 h-1.5 bg-[#00e6c3]" />

            {(error || validationError) && (
              <div className="mb-4 p-3 rounded bg-rose-950/70 border border-rose-500/50 flex items-start gap-2.5 text-xs text-rose-300 font-mono shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{validationError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <div className="w-full flex items-center border-[1.5px] border-[#00e6c3] bg-[#041c20] rounded px-3 py-3 shadow-[0_0_10px_rgba(0,230,195,0.15)] focus-within:border-[#00ffcc] focus-within:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all">
                  <div className="w-8 flex items-center justify-center text-[#00e6c3] shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <input
                    id="admin-email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Username"
                    autoComplete="username"
                    className="w-full bg-transparent border-none text-sm font-mono text-[#00f5d4] placeholder:text-[#008f82] focus:outline-none pl-2"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="relative w-full flex items-center border-[1.5px] border-[#00e6c3] bg-[#041c20] rounded px-3 py-3 shadow-[0_0_10px_rgba(0,230,195,0.15)] focus-within:border-[#00ffcc] focus-within:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all">
                  <div className="w-8 flex items-center justify-center text-[#00e6c3] shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full bg-transparent border-none text-sm font-mono text-[#00f5d4] placeholder:text-[#008f82] focus:outline-none pl-2 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#008f82] hover:text-[#00e6c3] transition-colors p-1 shrink-0"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#00e6c3] hover:text-[#00ffcc] select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-[#00e6c3] bg-[#02181b] text-[#00e6c3] focus:ring-[#00e6c3]/50 focus:ring-offset-0"
                  />
                  <span>✓ Stay Sign in</span>
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Master credentials belong solely to Anurag Sahu.')}
                  className="text-[#00e6c3] hover:text-[#00ffcc] hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Cyber Button */}
              <div className="pt-3 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-48 py-2.5 px-6 border-2 border-[#00e6c3] bg-[#032125] hover:bg-[#00e6c3] hover:text-[#021416] text-[#00e6c3] font-mono font-bold text-sm tracking-widest uppercase transition-all duration-200 shadow-[0_0_15px_rgba(0,230,195,0.3)] hover:shadow-[0_0_35px_rgba(0,230,195,0.85)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-cyan-400 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Notice Footer */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-[#00a896]/70 font-mono flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00e6c3]" />
            <span>SECURE PROTOCOL // ANURAG SAHU CONTROL CENTER</span>
          </p>
        </div>
      </div>
    </div>
  );
};


