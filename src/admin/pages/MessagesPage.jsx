import { useState, useEffect } from 'react';
import { Mail, Check, Archive, RefreshCw, Eye } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { DataCard } from '../components/DataCard';
import { SearchInput } from '../components/SearchInput';
import { FilterBar } from '../components/FilterBar';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ErrorState } from '../components/ErrorState';
import { adminApi } from '../services/adminApi';
import { formatDate } from '../utils/adminFormatters';
import { useAdmin } from '../components/AdminContext';

export const MessagesPage = () => {
  const { addToast } = useAdmin();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (activeFilter !== 'all') params.status = activeFilter;
      const res = await adminApi.getMessages(params);
      setMessages(res.messages || []);
    } catch (err) {
      setError(err.message || 'Failed to load messages.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  if (error && messages.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Contact Inquiries"
          description="Review and respond to messages submitted through the public website contact form."
        />
        <ErrorState
          title="Could Not Retrieve Inquiries"
          message={error}
          onRetry={fetchMessages}
        />
      </div>
    );
  }

  const handleMarkRead = async (id) => {
    try {
      await adminApi.markMessageRead(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: 'read' } : m))
      );
      addToast('Message marked as read.', 'success');
    } catch (_err) {
      addToast('Failed to update message status.', 'error');
    }
  };

  const handleArchive = async (id) => {
    try {
      await adminApi.archiveMessage(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: 'archived' } : m))
      );
      addToast('Message archived.', 'info');
    } catch (_err) {
      addToast('Failed to archive message.', 'error');
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.fullName?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  const filterOptions = [
    { value: 'all', label: 'All Inquiries' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'archived', label: 'Archived' },
  ];

  const columns = [
    {
      key: 'fullName',
      header: 'Sender',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-100">{val}</p>
          <p className="text-[11px] text-slate-500 font-mono">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject & Preview',
      render: (val, row) => (
        <div className="max-w-md">
          <p className="font-medium text-slate-200 truncate">{val || 'No subject'}</p>
          <p className="text-[11px] text-slate-500 truncate">{row.message}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val || 'unread'} />,
    },
    {
      key: 'createdAt',
      header: 'Received',
      render: (val) => <span className="font-mono text-slate-400">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedMessage(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
            title="Read Full Message"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status !== 'read' && (
            <button
              onClick={() => handleMarkRead(row._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
              title="Mark as Read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          {row.status !== 'archived' && (
            <button
              onClick={() => handleArchive(row._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Inquiries"
        description="Review and respond to messages submitted through the public website contact form."
        badge={`${filteredMessages.length} Total`}
        actions={
          <button
            onClick={fetchMessages}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070B16] border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <FilterBar
          options={filterOptions}
          activeFilter={activeFilter}
          onSelect={setActiveFilter}
        />
        <SearchInput
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Filter by name, email, or keywords..."
        />
      </div>

      {/* Desktop View: DataTable */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={filteredMessages}
          isLoading={isLoading}
          keyField="_id"
          emptyMessage="No contact messages match your filter."
          onRowClick={(row) => setSelectedMessage(row)}
        />
      </div>

      {/* Mobile View: Fluid DataCards */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">No contact messages found.</div>
        ) : (
          filteredMessages.map((msg) => (
            <DataCard
              key={msg._id}
              title={msg.fullName}
              subtitle={msg.email}
              badge={<StatusBadge status={msg.status || 'unread'} />}
              fields={[
                { label: 'Subject', value: msg.subject || '—' },
                { label: 'Date', value: formatDate(msg.createdAt) },
              ]}
              actions={
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMessage(msg)}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-medium"
                  >
                    View
                  </button>
                  {msg.status !== 'read' && (
                    <button
                      onClick={() => handleMarkRead(msg._id)}
                      className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium"
                    >
                      Read
                    </button>
                  )}
                </div>
              }
              onClick={() => setSelectedMessage(msg)}
            />
          ))
        )}
      </div>

      {/* Message Inspection Modal */}
      {selectedMessage && (
        <Modal
          isOpen={Boolean(selectedMessage)}
          onClose={() => setSelectedMessage(null)}
          title="Inquiry Details"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-100 text-sm">
                  {selectedMessage.fullName}
                </span>
                <StatusBadge status={selectedMessage.status || 'unread'} />
              </div>
              <p className="text-slate-400 font-mono">{selectedMessage.email}</p>
              {selectedMessage.company && (
                <p className="text-slate-500 font-mono">Company: {selectedMessage.company}</p>
              )}
              <p className="text-slate-500 font-mono text-[10px] pt-1">
                Received: {formatDate(selectedMessage.createdAt, { includeTime: true })}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[11px] text-slate-500 uppercase">Subject</span>
              <p className="text-slate-200 font-medium">{selectedMessage.subject || '—'}</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800">
              <span className="font-mono text-[11px] text-slate-500 uppercase">Message Body</span>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                  selectedMessage.subject || 'Portfolio Inquiry'
                )}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>

              <div className="flex items-center gap-2">
                {selectedMessage.status !== 'read' && (
                  <button
                    onClick={() => {
                      handleMarkRead(selectedMessage._id);
                      setSelectedMessage((prev) => ({ ...prev, status: 'read' }));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    Mark Read
                  </button>
                )}
                {selectedMessage.status !== 'archived' && (
                  <button
                    onClick={() => {
                      handleArchive(selectedMessage._id);
                      setSelectedMessage(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    Archive
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
