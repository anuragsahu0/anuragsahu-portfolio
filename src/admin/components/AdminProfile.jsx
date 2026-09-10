import { Shield, ChevronDown, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const AdminProfile = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'AS';
  const displayName = user?.email ? user.email.split('@')[0] : 'Administrator';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Admin User Menu"
      >
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[100px]">
            {displayName}
          </p>
          <p className="text-[10px] text-cyan-400 font-mono leading-none mt-0.5">Owner</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#070B16] border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-2 border-b border-slate-800/80">
            <p className="text-xs font-semibold text-slate-100">{user?.email || 'admin@anuragsahu.dev'}</p>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-emerald-400">
              <Shield className="w-3 h-3" />
              <span>Verified Owner Role</span>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
