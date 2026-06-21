import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-[calc(100vh-130px)]">
      {/* Hero Section */}
      <section className="w-full lg:w-3/5 p-6 sm:p-10 flex flex-col justify-center bg-white">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
          Fast, Transparent,<br/>
          <span className="text-blue-700">Digital Governance.</span>
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
          Official Digital Services Portal for citizens of Mardan. Access essential government certifications, licenses, and tracking systems with efficiency and ease.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/apply" className="bg-blue-700 text-center text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all text-lg">
            Apply Now
          </Link>
          <Link to="/services" className="bg-slate-100 text-center text-slate-700 px-8 py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-200 transition-all text-lg">
            View All Services
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Process Time</p>
                <p className="text-sm font-semibold text-slate-800">24-48 Hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Success Rate</p>
                <p className="text-sm font-semibold text-slate-800">98% Digital Issuance</p>
              </div>
            </div>
          </div>
      </section>

      {/* Featured Services */}
      <section className="w-full lg:w-2/5 bg-slate-50 p-6 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-black text-blue-700 uppercase tracking-[0.2em] mb-4">Featured Services</h2>
            
            <div className="space-y-3">
              {[
                { icon: 'BC', iconClass: 'bg-blue-50 text-blue-700', title: 'Birth Certificate', desc: 'Digital Verification Available' },
                { icon: 'DC', iconClass: 'bg-amber-50 text-amber-600', title: 'Domicile Certificate', desc: 'Fast Track Processing' },
                { icon: 'BL', iconClass: 'bg-emerald-50 text-emerald-600', title: 'Business License', desc: 'Industry Compliance' }
              ].map((feature, i) => (
                <Link to="/apply" key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-300 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className={`${feature.iconClass} w-12 h-12 rounded-lg flex items-center justify-center font-bold`}>
                      {feature.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700">{feature.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">{feature.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-800 p-6 rounded-2xl text-white shadow-xl shadow-blue-200 mt-8">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-3">Track Application</p>
            <div className="flex space-x-2">
              <Link to="/status" className="flex-1 bg-white text-center text-blue-800 px-4 py-3 rounded-lg font-bold text-sm uppercase hover:bg-blue-50 transition-colors">
                Track Status Now
              </Link>
            </div>
            <p className="text-[10px] mt-3 opacity-70 leading-relaxed">Enter your tracking ID or CNIC to check the current status of your government request.</p>
        </div>
      </section>
    </div>
  );
}
