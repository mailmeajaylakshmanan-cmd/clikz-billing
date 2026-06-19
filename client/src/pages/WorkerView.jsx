import { useState } from 'react';
import {
  Calendar, MapPin, Clock, Briefcase, Award, CheckCircle,
  Smartphone, UserCheck, AlertCircle, Compass, ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function WorkerView() {
  const initialJobs = [
    {
      id: 201,
      title: 'Priya & Karthik Wedding',
      date: 'Aug 15, 2026',
      reportTime: '06:00 AM (Sharp)',
      venue: 'Taj Connemara Ballroom, Chennai',
      role: 'Cinematographer (Lead)',
      agreedPay: 8000,
      marked: false,
      details: 'Dispatched for Main Wedding film + Teaser moments. Attire: Black Formals.'
    },
    {
      id: 202,
      title: 'Sneha & Rahul Reception',
      date: 'July 20, 2026',
      reportTime: '04:00 PM',
      venue: 'Grand Castle Palace Grounds, Bangalore',
      role: 'Drone Cinematographer',
      agreedPay: 10000,
      marked: true,
      details: 'Indoor/outdoor flight clearance secured. Coverage of entry and couple photoshoot.'
    },
    {
      id: 203,
      title: 'Ananya & Vikram Pre-Shoot',
      date: 'Sept 02, 2026',
      reportTime: '05:30 AM',
      venue: 'Bandra Fort, Mumbai',
      role: 'Candid Photographer',
      agreedPay: 7500,
      marked: false,
      details: 'Bring 50mm and 85mm prime lenses. Concept: Sunrise aesthetic.'
    }
  ];

  const [jobs, setJobs] = useState(initialJobs);

  const handleMarkPresent = (jobId) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        if (job.marked) {
          toast.success('Attendance unmarked.');
          return { ...job, marked: false };
        } else {
          toast.success('Attendance Marked! Your GPS Location and Timestamp have been logged.');
          return { ...job, marked: true };
        }
      }
      return job;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Worker Portal</h1>
        <p className="text-sm text-slate-500 mt-1">Mobile-first field staff schedule &amp; dispatcher logs</p>
      </div>

      <div className="flex justify-center">
        {/* Mobile Device Frame Simulation */}
        <div className="w-full max-w-[390px] bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800 relative overflow-hidden">
          
          {/* Speaker & camera notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-950 rounded-full" />
          </div>

          {/* Screen Content */}
          <div className="bg-slate-50 rounded-[30px] overflow-hidden pt-6 pb-4 min-h-[580px] flex flex-col">
            
            {/* App bar inside mobile */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Crew Member View</span>
                <span className="text-sm font-bold">Anand Krishnan</span>
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            {/* Content area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[460px]">
              
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                <span>My Assignments</span>
                <span>{jobs.length} Active Jobs</span>
              </div>

              {/* Jobs List */}
              <div className="space-y-3.5">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                    
                    {/* Event name & Status */}
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight leading-tight">
                        {job.title}
                      </h3>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        job.marked ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {job.marked ? 'Present' : 'Assigned'}
                      </span>
                    </div>

                    {/* Logistics metadata */}
                    <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-50 py-2.5">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-slate-400" />
                        <span>Date: <strong>{job.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-slate-400" />
                        <span>Report Time: <strong>{job.reportTime}</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">{job.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={12} className="text-slate-400" />
                        <span>Role: <strong className="text-slate-700">{job.role}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award size={12} className="text-slate-400" />
                        <span>Agreed Pay: <strong className="text-emerald-600">₹{job.agreedPay.toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <p className="text-[10px] text-slate-400 leading-normal italic">
                      Note: {job.details}
                    </p>

                    {/* Attendance trigger button */}
                    <button
                      type="button"
                      onClick={() => handleMarkPresent(job.id)}
                      className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        job.marked 
                          ? 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      {job.marked ? (
                        <><CheckCircle size={13} /> Registered Present</>
                      ) : (
                        <><UserCheck size={13} /> Mark Attendance</>
                      )}
                    </button>

                  </div>
                ))}
              </div>

              {/* Safety banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white flex items-start gap-3">
                <ShieldAlert size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed text-slate-400">
                  <span className="font-bold text-slate-200 block">Crew Safety Regulations</span>
                  Always report 15 mins prior. Charge all camera/drone batteries overnight. Keep emergency backup contacts active.
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
