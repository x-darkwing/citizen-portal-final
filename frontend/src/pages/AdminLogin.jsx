import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });
    
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setStatus({ loading: false, error: data.message });
      }
    } catch(err) {
      setStatus({ loading: false, error: 'Network communication error' });
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight">
          Admin Portal Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200">
          
          {status.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative text-sm font-medium">
              {status.error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Username / Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LogIn className="h-4 w-4 text-slate-400" />
                </div>
                <input name="email" type="text" required value={formData.email} onChange={handleChange} className="focus:ring-blue-600 focus:border-blue-600 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 border outline-none transition-colors" placeholder="admin" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Password</label>
              <div className="mt-1">
                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors" />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={status.loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-xl shadow-blue-200 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition-all uppercase tracking-wider">
                {status.loading ? 'Authenticating...' : 'Sign in as Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
