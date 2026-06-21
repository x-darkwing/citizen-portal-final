import { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import { Search } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching services:", err);
        setLoading(false);
      });
  }, []);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Government Services</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Browse and apply for official district services from the DESC Digital Portal.</p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-600 focus:border-blue-600 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-4 border outline-none text-slate-700 shadow-sm"
              placeholder="Search for a service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            <p className="mt-4 text-slate-500 text-sm font-medium uppercase tracking-widest">Loading services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
            {filteredServices.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 text-lg font-medium">No services found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
