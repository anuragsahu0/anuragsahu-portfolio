import { useState, useRef, useEffect } from 'react';

export const Dropdown = ({ trigger, items = [], align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-48 rounded-xl bg-[#070B16] border border-slate-800 shadow-xl py-1 z-30 focus:outline-none`}
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                item.danger
                  ? 'text-rose-400 hover:bg-rose-500/10'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
              }`}
              role="menuitem"
            >
              {item.icon && <item.icon className="w-3.5 h-3.5" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
