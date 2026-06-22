import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, FileText, CheckCircle, XCircle, Clock, Search,
  User, Phone, Mail, MapPin, StickyNote, CalendarDays,
  ChevronRight, ShieldCheck, RotateCcw, Inbox, AlertTriangle
} from 'lucide-react';

const STATUS_CONFIG = {
  Pending:  { icon: Clock,         bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400', border: 'border-yellow-200' },
  Approved: { icon: CheckCircle,   bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500',  border: 'border-green-200' },
  Rejected: { icon: XCircle,       bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500',    border: 'border-red-200' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400', border: 'border-slate-200' };
  const Icon = cfg.icon || Clock;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin/login'); return; }
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
        // keep selected app in sync
        setSelectedApp(prev => prev ? (data.find(a => a.id === prev.id) || null) : null);
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
      } else {
        setError('Failed to fetch applications');
      }
    } catch {
      setError('Network communication error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchApplications();
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
      }
    } catch {
      alert('Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const filtered = useMemo(() => {
    return applications.filter(app => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        (app.fullName || '').toLowerCase().includes(q) ||
        (app.cnic || '').includes(q) ||
        (app.id || '').toLowerCase().includes(q) ||
        (app.serviceType || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total:    applications.length,
    pending:  applications.filter(a => a.status === 'Pending').length,
    approved: applications.filter(a => a.status === 'Approved').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  }), [applications]);

  return (
    <div className="flex-1 flex flex-col bg-slate-100 min-h-0">

      {/* Admin Top Bar */}
      <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-bold uppercase tracking-widest text-slate-200">Admin Control Panel</span>
          <span className="hidden sm:block text-xs text-slate-500">— DESC Portal, Mardan</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300 transition-colors border border-slate-700"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5 flex-1 min-h-0">

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={FileText}     label="Total"    value={stats.total}    color="bg-slate-700" />
            <StatCard icon={Clock}        label="Pending"  value={stats.pending}  color="bg-yellow-500" />
            <StatCard icon={CheckCircle}  label="Approved" value={stats.approved} color="bg-green-600" />
            <StatCard icon={XCircle}      label="Rejected" value={stats.rejected} color="bg-red-600" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Main Panel */}
          <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">

            {/* Applications List */}
            <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0 w-full lg:w-[420px]">
              {/* Search & Filter */}
              <div className="p-4 border-b border-slate-100 space-y-3">
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Incoming Requests</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, CNIC, ID, service…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-2 w-full text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div className="flex gap-1 flex-wrap">
                  {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        statusFilter === s
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                      {s === 'Pending' && stats.pending > 0 && (
                        <span className="ml-1.5 bg-yellow-400 text-yellow-900 rounded-full px-1.5 py-0.5 text-[10px] font-black">{stats.pending}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {loading ? (
                  <div className="p-10 text-center text-slate-400 text-sm font-medium">Loading requests…</div>
                ) : filtered.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center gap-3 text-slate-400">
                    <Inbox className="w-10 h-10" />
                    <p className="text-sm font-medium">No applications found.</p>
                  </div>
                ) : (
                  filtered.map(app => {
                    const cfg = STATUS_CONFIG[app.status] || {};
                    const isSelected = selectedApp?.id === app.id;
                    return (
                      <button
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className={`w-full text-left px-4 py-3.5 flex items-center gap-3 transition-colors hover:bg-slate-50 ${isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot || 'bg-slate-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{app.fullName}</p>
                          <p className="text-xs text-slate-500 truncate">{app.serviceType} · {app.id}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <StatusBadge status={app.status} />
                          <span className="text-[10px] text-slate-400">{new Date(app.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="hidden lg:flex flex-1 flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {!selectedApp ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400 p-10">
                  <FileText className="w-14 h-14 opacity-30" />
                  <p className="text-sm font-medium text-center">Select an application from the list to review its details and take action.</p>
                </div>
              ) : (
                <>
                  {/* Detail Header */}
                  <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-black text-slate-900">{selectedApp.fullName}</h2>
                        <StatusBadge status={selectedApp.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-mono">{selectedApp.id}</p>
                    </div>
                    <p className="text-xs text-slate-400 shrink-0 text-right">
                      Submitted<br />
                      <span className="font-semibold text-slate-600">{new Date(selectedApp.submittedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* Service Info */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Requested Service</p>
                      <p className="text-base font-bold text-blue-900">{selectedApp.serviceType}</p>
                      <DetailRow icon={MapPin} label="District" value={selectedApp.district} />
                    </div>

                    {/* Applicant Details */}
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Applicant Information</p>
                      <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <DetailRow icon={User}         label="Full Name" value={selectedApp.fullName} />
                        <DetailRow icon={FileText}     label="CNIC"      value={selectedApp.cnic} />
                        <DetailRow icon={Phone}        label="Phone"     value={selectedApp.phone} />
                        <DetailRow icon={Mail}         label="Email"     value={selectedApp.email || '—'} />
                        <DetailRow icon={CalendarDays} label="Submitted" value={new Date(selectedApp.submittedAt).toLocaleString('en-PK')} />
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedApp.additionalNotes && (
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Additional Notes</p>
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                          <StickyNote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-900">{selectedApp.additionalNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Footer */}
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Admin Action</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(selectedApp.id, 'Approved')}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve Request
                          </button>
                          <button
                            onClick={() => handleStatusChange(selectedApp.id, 'Rejected')}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject Request
                          </button>
                        </>
                      )}
                      {selectedApp.status !== 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(selectedApp.id, 'Pending')}
                          disabled={actionLoading}
                          className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset to Pending
                        </button>
                      )}
                      {actionLoading && (
                        <span className="text-xs text-slate-500 self-center ml-2">Updating…</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
