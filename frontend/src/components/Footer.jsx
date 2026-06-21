export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white px-4 sm:px-8 py-4 sm:py-3 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 shrink-0">
      <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 sm:mb-0">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        <a href="/admin/login" className="hover:text-white transition-colors">Admin Portal</a>
        <a href="#" className="hover:text-white transition-colors">Contact Us</a>
      </div>
      <div className="text-center sm:text-right">
        <p className="text-[10px] font-bold text-slate-500 tracking-wider">© {new Date().getFullYear()} DESC DIGITAL INNOVATION CENTER, MARDAN</p>
        <p className="text-[9px] font-medium text-slate-600 uppercase tracking-widest mt-1">Powered by CloudForge Solutions</p>
      </div>
    </footer>
  );
}
