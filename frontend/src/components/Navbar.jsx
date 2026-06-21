import { Link } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-blue-800 text-white shadow-lg border-b-4 border-blue-900 px-4 sm:px-8 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
              <Building2 className="h-8 w-8 text-blue-800" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl leading-none uppercase tracking-tight">DESC Portal</span>
              <span className="text-[10px] opacity-80 uppercase tracking-widest font-semibold hidden sm:block">Digital Innovation Center, Mardan</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-6 items-center text-sm font-semibold tracking-wide">
            <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
            <Link to="/services" className="hover:text-blue-200 transition-colors">Services</Link>
            <Link to="/apply" className="hover:text-blue-200 transition-colors">Apply</Link>
            <Link to="/status" className="hover:text-blue-200 transition-colors">Track Status</Link>
            <Link to="/login" className="bg-blue-600 px-5 py-2 rounded-md hover:bg-blue-500 transition-all border border-blue-400">
              Login / Register
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-blue-100 hover:text-white p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {isOpen && (
          <div className="md:hidden mt-4 border-t border-blue-700 pt-4">
            <div className="flex flex-col space-y-2 text-sm font-semibold tracking-wide">
              <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition-colors px-2 py-1">Home</Link>
              <Link to="/services" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition-colors px-2 py-1">Services</Link>
              <Link to="/apply" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition-colors px-2 py-1">Apply</Link>
              <Link to="/status" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition-colors px-2 py-1">Track Status</Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="bg-blue-600 text-center px-5 py-2 mt-2 rounded-md hover:bg-blue-500 transition-all border border-blue-400">
                Login / Register
              </Link>
            </div>
          </div>
        )}
      </nav>
      <div className="bg-blue-900 text-white py-2 px-4 sm:px-8 flex items-center shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center space-x-2 animate-pulse">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span className="text-xs font-medium uppercase tracking-wider text-blue-100">Portal powered by CloudForge Solutions — Systems Online</span>
        </div>
      </div>
    </>
  );
}
