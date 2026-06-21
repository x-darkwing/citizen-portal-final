import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      setError('Network communication error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchApplications(); // refreshing the data
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
      }
    } catch(err) {
      alert("Failed to update status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
      case 'Approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        app.cnic.includes(searchTerm) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'Pending').length;
    const approved = applications.filter(a => a.status === 'Approved').length;
    const rejected = applications.filter(a => a.status === 'Rejected').length;
    return { total, pending, approved, rejected };
  }, [applications]);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow border border-slate-200 p-5">
            <div className="text-sm font-medium text-slate-500 mb-1 flex items-center"><FileText className="w-4 h-4 mr-2" /> Total</div>
            <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow border border-slate-200 p-5">
            <div className="text-sm font-medium text-yellow-600 mb-1 flex items-center"><Clock className="w-4 h-4 mr-2" /> Pending</div>
            <div className="text-2xl font-black text-yellow-700">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow border border-slate-200 p-5">
            <div className="text-sm font-medium text-green-600 mb-1 flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Approved</div>
            <div className="text-2xl font-black text-green-700">{stats.approved}</div>
          </div>
          <div className="bg-white rounded-lg shadow border border-slate-200 p-5">
            <div className="text-sm font-medium text-red-600 mb-1 flex items-center"><XCircle className="w-4 h-4 mr-2" /> Rejected</div>
            <div className="text-2xl font-black text-red-700">{stats.rejected}</div>
          </div>
        </div>

        <div className="bg-white shadow border border-slate-200 sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-lg leading-6 font-bold text-slate-900">All Applications</h3>
            <div className="flex w-full sm:w-auto space-x-4">
              <div className="relative flex-1 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search name, CNIC, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 border outline-none"
                />
              </div>
              <div className="w-32">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 border outline-none px-3"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-medium">Loading applications...</div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">No applications found.</div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID / Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{app.id}</div>
                        <div className="text-xs text-slate-500">{new Date(app.submittedAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">{app.fullName}</div>
                        <div className="text-xs text-slate-500">{app.cnic}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {app.serviceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {app.status === 'Pending' && (
                          <>
                            <button onClick={() => handleStatusChange(app.id, 'Approved')} className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md transition-colors">Approve</button>
                            <button onClick={() => handleStatusChange(app.id, 'Rejected')} className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors">Reject</button>
                          </>
                        )}
                        {app.status !== 'Pending' && (
                          <button onClick={() => handleStatusChange(app.id, 'Pending')} className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 px-3 py-1 rounded-md transition-colors">Reset</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
