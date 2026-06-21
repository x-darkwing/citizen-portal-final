import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/'); // Redirect to home on success
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
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 font-medium">
          {isLogin ? 'Or ' : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-blue-700 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer uppercase tracking-wider text-[10px]">
            {isLogin ? 'register for a new one' : 'sign in instead'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200">
          
          {status.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative text-sm font-medium">
              {status.error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserPlus className="h-4 w-4 text-slate-400" />
                  </div>
                  <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="focus:ring-blue-600 focus:border-blue-600 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 border outline-none transition-colors" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LogIn className="h-4 w-4 text-slate-400" />
                </div>
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="focus:ring-blue-600 focus:border-blue-600 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 border outline-none transition-colors" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Password</label>
              <div className="mt-1">
                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors" />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={status.loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-xl shadow-blue-200 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 transition-all uppercase tracking-wider">
                {status.loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
