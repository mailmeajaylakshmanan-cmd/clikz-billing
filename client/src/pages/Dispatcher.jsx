import { useState } from 'react';
import {
  Users, Search, Calendar, Check, X, Shield, Filter, Edit, Plus,
  Award, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dispatcher() {
  const initialWorkers = [
    { id: 1, name: 'Anand Krishnan', role: 'Cinematographer', isAvailable: true, rate: 8000, attendance: 'Full' },
    { id: 2, name: 'Vikram Seth', role: 'Drone Pilot', isAvailable: true, rate: 10000, attendance: 'Full' },
    { id: 3, name: 'Shreya Sen', role: 'Candid Photographer', isAvailable: false, rate: 7500, attendance: 'Absent' },
    { id: 4, name: 'Arjun Das', role: 'Editor', isAvailable: true, rate: 5000, attendance: 'Full' },
    { id: 5, name: 'Meera Nair', role: 'Traditional Photographer', isAvailable: true, rate: 6000, attendance: 'Half' },
    { id: 6, name: 'Rahul Bose', role: 'Assistant Director', isAvailable: false, rate: 4000, attendance: 'Absent' }
  ];

  const upcomingEvents = [
    { id: 101, title: 'Ananya & Vikram Wedding (Aug 15)' },
    { id: 102, title: 'Siddharth & Riya Sangeet (Aug 18)' },
    { id: 103, title: 'Meera & Arjun Portraiture (Sept 02)' }
  ];

  const [workers, setWorkers] = useState(initialWorkers);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('2026-08-15');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Quick assignment form state
  const [selectedEvent, setSelectedEvent] = useState(101);
  const [selectedWorker, setSelectedWorker] = useState(1);
  const [assignedRole, setAssignedRole] = useState('Cinematographer');
  const [dayRate, setDayRate] = useState(8000);

  const handleAttendanceChange = (workerId, status) => {
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, attendance: status } : w));
    toast.success(`Attendance updated to: ${status}`);
  };

  const handleQuickAssign = (e) => {
    e.preventDefault();
    const workerObj = workers.find(w => w.id === Number(selectedWorker));
    const eventObj = upcomingEvents.find(ev => ev.id === Number(selectedEvent));
    
    toast.success(`Assigned ${workerObj.name} as ${assignedRole} for ${eventObj.title} at ₹${dayRate}/Day!`);
  };

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.role.toLowerCase().includes(search.toLowerCase());
    const matchesAvailability = availableOnly ? w.isAvailable : true;
    return matchesSearch && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">The Dispatcher</h1>
          <p className="text-sm text-slate-500 mt-1">Manage crew availability, job dispatch, and site attendance</p>
        </div>
      </div>

      {/* Grid: Main Table vs Quick Assign Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Workers and Attendance */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
              
              {/* Search */}
              <div className="relative w-full md:w-72">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={14} className="text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search crew or role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Date & Availability filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border border-slate-200 rounded-lg text-xs bg-white px-2.5 py-1.5 text-slate-700 focus:outline-none"
                  />
                </div>
                
                <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-lg select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-600">Available Only</span>
                </label>
              </div>

            </div>
          </div>

          {/* Crew Assignment Table */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Crew Member</th>
                  <th className="px-5 py-4">Availability</th>
                  <th className="px-5 py-4">Agreed Day Rate</th>
                  <th className="px-5 py-4 text-center">Attendance Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">{worker.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{worker.role}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {worker.isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle size={12} /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          <X size={12} /> Booked Out
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-700">₹{worker.rate.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-400 font-medium"> / Day</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {['Full', 'Half', 'Absent'].map((att) => {
                          const isSelected = worker.attendance === att;
                          let btnStyle = 'border-slate-200 text-slate-400 bg-white hover:bg-slate-50';
                          if (isSelected) {
                            if (att === 'Full') btnStyle = 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/10';
                            if (att === 'Half') btnStyle = 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/10';
                            if (att === 'Absent') btnStyle = 'bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-500/10';
                          }
                          return (
                            <button
                              key={att}
                              type="button"
                              onClick={() => handleAttendanceChange(worker.id, att)}
                              className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${btnStyle}`}
                            >
                              {att}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredWorkers.length === 0 && (
              <div className="text-center py-10">
                <AlertTriangle size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No crew matches the filters selected.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Quick Assign Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Assign Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 text-white">
            <div>
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Award size={15} className="text-emerald-400" />
                Quick Crew Dispatcher
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">Assign crew members to upcoming shoots</p>
            </div>

            <form onSubmit={handleQuickAssign} className="space-y-4">
              
              {/* Event selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Select Shoot Event</label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs py-2 px-3 text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {upcomingEvents.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>

              {/* Worker selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Select Crew Member</label>
                <select
                  value={selectedWorker}
                  onChange={(e) => setSelectedWorker(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs py-2 px-3 text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.id} disabled={!w.isAvailable}>
                      {w.name} ({w.role}) {!w.isAvailable ? ' - [Booked]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role on site */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Role</label>
                <select
                  value={assignedRole}
                  onChange={(e) => setAssignedRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs py-2 px-3 text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Cinematographer">Cinematographer</option>
                  <option value="Candid Photographer">Candid Photographer</option>
                  <option value="Traditional Photographer">Traditional Photographer</option>
                  <option value="Drone Pilot">Drone Pilot</option>
                  <option value="Assistant">Assistant / Gaffer</option>
                </select>
              </div>

              {/* Agreed rate */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Agreed Day Rate (₹)</label>
                <input
                  type="number"
                  value={dayRate}
                  onChange={(e) => setDayRate(Number(e.target.value))}
                  placeholder="Rate per day"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs py-2 px-3 text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm transition-colors mt-2"
              >
                <Plus size={14} /> Assign to Event
              </button>

            </form>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-3.5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crew Health Stats</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Dispatched</span>
                <span className="text-lg font-bold text-slate-700">4 / 6</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Attendance Pct</span>
                <span className="text-lg font-bold text-emerald-600">83.3%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
