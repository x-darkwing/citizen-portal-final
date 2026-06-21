import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function Apply() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';
  
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    cnic: '',
    phone: '',
    email: '',
    serviceType: initialService,
    district: '',
    additionalNotes: ''
  });
  
  const [status, setStatus] = useState({ loading: false, success: false, appId: null, error: null });

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, appId: null, error: null });
    
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ loading: false, success: true, appId: data.id, error: null });
      } else {
        setStatus({ loading: false, success: false, appId: null, error: data.message });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, appId: null, error: 'Network error occurred' });
    }
  };

  if (status.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-12 px-8 shadow sm:rounded-lg text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">Your application has been received successfully.</p>
          <div className="bg-gray-50 p-4 rounded-md mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Tracking ID</p>
            <p className="text-2xl font-mono text-blue-700 mt-1">{status.appId}</p>
          </div>
          <Link to={`/status?id=${status.appId}`} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Track Application Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl shadow-blue-50/50 sm:rounded-2xl overflow-hidden border border-slate-200">
          <div className="px-6 py-8 border-b border-slate-200 bg-blue-50/50">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Service Application</h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">Please fill out the form below carefully. All fields marked with * are required.</p>
          </div>
          
          <div className="px-6 py-8">
            {status.error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative font-medium text-sm">
                {status.error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Full Name *</label>
                  <div className="mt-1">
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="shadow-sm focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-slate-300 rounded-lg border p-3 outline-none transition-colors" placeholder="John Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">CNIC Number *</label>
                  <div className="mt-1">
                    <input required type="text" name="cnic" value={formData.cnic} onChange={handleChange} pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}" title="Format: 12345-1234567-1" placeholder="12345-1234567-1" className="shadow-sm focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-slate-300 border rounded-lg p-3 outline-none transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Phone Number *</label>
                  <div className="mt-1">
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="shadow-sm focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-slate-300 border rounded-lg p-3 outline-none transition-colors" placeholder="0300-1234567" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Email Address</label>
                  <div className="mt-1">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="shadow-sm focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-slate-300 border rounded-lg p-3 outline-none transition-colors" placeholder="you@example.com" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Service Type *</label>
                  <div className="mt-1">
                    <select required name="serviceType" value={formData.serviceType} onChange={handleChange} className="shadow-sm focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-slate-300 border rounded-lg p-3 outline-none bg-white transition-colors">
                      <option value="">Select a service</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">District *</label>
                  <div className="mt-1">
                    <select required name="district" value={formData.district} onChange={handleChange} className="shadow-sm focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-slate-300 border rounded-lg p-3 outline-none bg-white transition-colors">
                      <option value="">Select your district</option>
                      <option value="Mardan">Mardan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Swabi">Swabi</option>
                      <option value="Nowshera">Nowshera</option>
                      <option value="Charsadda">Charsadda</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Additional Notes</label>
                  <div className="mt-1">
                    <textarea name="additionalNotes" rows={3} value={formData.additionalNotes} onChange={handleChange} className="shadow-sm focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border border-slate-300 rounded-lg p-3 outline-none transition-colors" placeholder="Any specific details regarding your application..."></textarea>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Upload Supporting Document</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-slate-600 justify-center font-medium mt-2">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-bold text-blue-700 hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-600">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 mt-8">
                <div className="flex justify-end space-x-4">
                  <button type="button" className="bg-white py-3 px-6 border border-slate-300 rounded-xl shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={status.loading} className="inline-flex justify-center py-3 px-8 border border-transparent shadow-xl shadow-blue-200 text-sm font-bold rounded-xl text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 transition-all">
                    {status.loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
