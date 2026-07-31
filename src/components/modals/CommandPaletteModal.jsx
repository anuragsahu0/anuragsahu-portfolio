import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Code2, FileText, Mail, Github, Linkedin, HelpCircle, ShieldAlert } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SITE_CONFIG } from '@/constants/config';
import { AdminDashboardModal } from '@/components/admin/AdminDashboardModal';

/**
 * CommandPaletteModal Component (Ctrl + K)
 * Interactive telemetry terminal overlay with 'admin' dashboard trigger.
 */
export const CommandPaletteModal = ({ isOpen, onClose, onCopyEmail, onToggleTheme }) => {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState([
    { text: `[INITIALIZING ${SITE_CONFIG.name.toUpperCase()} TELEMETRY CLI PROTOCOL...]`, type: 'info' },
    { text: "Type 'help' to list available commands or 'admin' for telemetry stats.", type: 'cyan' },
  ]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputVal('');
    }
  }, [isOpen]);

  if (!isOpen && !isAdminOpen) return null;

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = inputVal.trim().toLowerCase();
      if (!cmd) return;

      const newLogs = [...logs, { text: `anurag@dev:~$ ${cmd}`, type: 'user' }];

      switch (cmd) {
        case 'help':
          newLogs.push({
            text: 'Available Commands:\n' +
                  '  admin      - Launch Telemetry Admin Dashboard\n' +
                  '  resume     - Download ATS Resume PDF\n' +
                  '  projects   - View featured projects list\n' +
                  '  skills     - View technical skill matrix\n' +
                  '  contact    - Display direct email\n' +
                  '  github     - Open GitHub profile\n' +
                  '  linkedin   - Open LinkedIn profile\n' +
                  '  clear      - Clear terminal window',
            type: 'system',
          });
          break;
        case 'admin':
          setIsAdminOpen(true);
          newLogs.push({ text: '⚡ Launching Telemetry Admin Dashboard...', type: 'cyan' });
          break;
        case 'resume':
          newLogs.push({ text: 'Downloading ATS Resume PDF...', type: 'cyan' });
          window.open(SITE_CONFIG.resumeUrl, '_blank');
          break;
        case 'projects':
          newLogs.push({ text: '1. NeuralGravity GNN Engine | 2. QuantVibe HFT Engine | 3. ZeroGravity Design Terminal', type: 'system' });
          break;
        case 'skills':
          newLogs.push({ text: 'STACK: React, Node.js, Python, PyTorch, C++, FastAPI, PostgreSQL, Docker', type: 'system' });
          break;
        case 'contact':
          newLogs.push({ text: `EMAIL: ${SITE_CONFIG.email}`, type: 'cyan' });
          onCopyEmail();
          break;
        case 'github':
          newLogs.push({ text: `Opening GitHub: ${SITE_CONFIG.github}`, type: 'system' });
          window.open(SITE_CONFIG.github, '_blank');
          break;
        case 'linkedin':
          newLogs.push({ text: `Opening LinkedIn: ${SITE_CONFIG.linkedin}`, type: 'system' });
          window.open(SITE_CONFIG.linkedin, '_blank');
          break;
        case 'clear':
          setLogs([]);
          setInputVal('');
          return;
        default:
          newLogs.push({ text: `Command not found: '${cmd}'. Type 'help' for available commands.`, type: 'error' });
          break;
      }

      setLogs(newLogs);
      setInputVal('');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl"
            >
              <GlassCard className="p-0 border-nebula-cyan/40 bg-black/90 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/5 font-mono text-xs text-muted">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-nebula-cyan" />
                    <span className="font-bold text-starlight">{SITE_CONFIG.name.toUpperCase()} TELEMETRY CLI v2.4</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsAdminOpen(true)}
                      className="px-2 py-0.5 rounded bg-nebula-cyan/10 border border-nebula-cyan/30 text-nebula-cyan font-bold hover:bg-nebula-cyan/20 transition-colors flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3 h-3" />
                      <span>Admin</span>
                    </button>
                    <button onClick={onClose} className="hover:text-starlight">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Log Terminal Window */}
                <div className="p-4 max-h-72 overflow-y-auto space-y-2 font-mono text-xs leading-relaxed text-left">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={
                        log.type === 'cyan' ? 'text-nebula-cyan font-semibold' :
                        log.type === 'user' ? 'text-starlight font-bold' :
                        log.type === 'error' ? 'text-rose-400' : 'text-muted'
                      }
                    >
                      <pre className="whitespace-pre-wrap font-mono">{log.text}</pre>
                    </div>
                  ))}
                </div>

                {/* Command Line Input */}
                <div className="p-3 border-t border-white/10 bg-black/60 flex items-center gap-2 font-mono text-xs">
                  <span className="text-nebula-cyan font-bold">anurag@dev:~$</span>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleCommand}
                    placeholder="type 'help' or 'admin'..."
                    autoFocus
                    className="w-full bg-transparent text-starlight placeholder:text-dim outline-none"
                  />
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded Telemetry Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </>
  );
};
