import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:border-blue-300 hover:shadow-md transition-all group">
      <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-700">
        <FileText className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-2">{service.name}</h3>
      <p className="text-slate-600 mb-6 flex-1 min-h-[48px]">{service.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6 border-t border-slate-100 pt-4">
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Processing</p>
          <p className="text-sm font-semibold text-slate-800">{service.processingTime}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fee</p>
          <p className="text-sm font-semibold text-slate-800">{service.fee}</p>
        </div>
      </div>
      
      <Link 
        to={`/apply?service=${service.id}`}
        className="inline-flex items-center text-blue-700 font-bold hover:text-blue-800"
      >
        Apply Now 
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
