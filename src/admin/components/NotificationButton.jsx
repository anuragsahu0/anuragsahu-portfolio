import { Bell } from 'lucide-react';

export const NotificationButton = ({ unreadCount = 0, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
      aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
      title="System Notifications"
    >
      <Bell className="w-4 h-4" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
      )}
    </button>
  );
};
