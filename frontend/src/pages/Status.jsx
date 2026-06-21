import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Clock, FileCheck, FileCog } from 'lucide-react';

export default function Status() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(initialQuery !== '');
  const [services, setServices] = useState({});

  useEffect(() => {
    // Fetch mapping
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(s => map[s.id] = s.name);
        setServices(map);
      })
      .catch(console.error);
      
    if (initialQuery) {
      handleSearch(new Event('submit'), initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (e, searchQuery = query) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await fetch(`/api/applications/${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch(err) {
      console.error(err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3"/> Pending</span>;
      case 'In Review':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800"><FileCog className="mr-1 h-3 w-3"/> In Review</span>;
      case 'Approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800"><FileCheck className="mr-1 h-3 w-3"/> Approved</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Track Application Status</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Enter your CNIC Number or Application Tracker ID to view the current status of your request.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="sr-only">CNIC or Tracking ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-blue-600 focus:border-blue-600 block w-full pl-10 border-slate-300 rounded-lg py-3 border outline-none sm:text-sm shadow-sm transition-colors"
                  placeholder="e.g. APP-1658..., 12345-1234567-1"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center items-center px-8 py-3 border border-transparent font-bold rounded-lg text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:bg-blue-400 shadow-xl shadow-blue-200 transition-all"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {hasSearched && !loading && applications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="mx-auto w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Applications Found</h3>
            <p className="text-slate-500">We could not find any active records matching your search query.</p>
          </div>
        )}

        {applications.length > 0 && (
          <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tracking ID</th>
                    <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service</th>
                    <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                    <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date Submitted</th>
                    <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">
                        {app.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">
                        {services[app.serviceType] || app.serviceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                        {app.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
