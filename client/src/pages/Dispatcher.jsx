import React, { useState, useEffect } from 'react';
import { Calendar, UserPlus, CheckCircle, Clock, MapPin, AlertCircle, X, Loader2 } from 'lucide-react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

export default function Dispatcher() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [availableCrew, setAvailableCrew] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [assignForm, setAssignForm] = useState({
    employeeId: '',
    role: '',
    dayRate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDispatcherData();
  }, []);

  const loadDispatcherData = async () => {
    setLoading(true);
    try {
      // 1. Load invoices/events
      const eventsRes = await api.get('/invoices');
      // Filter out completed/fully staffed ones, or show unstaffed/partially staffed
      const pending = (eventsRes.data.invoices || []).filter(
        event => event.staffingStatus !== 'Fully Staffed'
      );
      setPendingEvents(pending);

      // 2. Load crew
      const crewRes = await api.get('/employees');
      setAvailableCrew(crewRes.data || []);
    } catch (err) {
      toast.error('Failed to load dispatch data');
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (event) => {
    setSelectedEvent(event);
    setAssignForm({
      employeeId: '',
      role: '',
      dayRate: ''
    });
    setShowAssignModal(true);
  };

  const handleCrewChange = (empId) => {
    const crew = availableCrew.find(c => c._id === empId);
    if (crew) {
      setAssignForm({
        employeeId: empId,
        role: crew.role || '',
        dayRate: crew.baseDayRate || crew.dayRate || ''
      });
    }
  };

  const handleAssignCrew = async (e) => {
    e.preventDefault();
    if (!assignForm.employeeId) {
      return toast.error('Please select a crew member');
    }

    setSubmitting(true);
    try {
      await api.post('/dispatch/assign-crew', {
        invoiceId: selectedEvent._id,
        employeeId: assignForm.employeeId,
        role: assignForm.role,
        dayRate: Number(assignForm.dayRate)
      });
      
      toast.success('Crew assigned successfully!');
      setShowAssignModal(false);
      loadDispatcherData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Double-booking conflict or server error';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2">
        <h1 className="text-2xl font-bold text-slate-850">Crew Dispatch Center</h1>
        <p className="text-sm text-slate-500 mt-1">Assign crew members to pending events and prevent scheduling conflicts</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <Loader2 className="animate-spin text-teal-600 mr-2" size={20} />
          <span>Loading dispatcher pipelines...</span>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left: Events Needing Staff */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Events Needing Staff</h2>
              <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-medium">
                {pendingEvents.length} Shoots Pending
              </span>
            </div>

            {pendingEvents.map(event => (
              <div key={event._id} className="bg-white border border-slate-100 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm hover:shadow transition-shadow">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      event.staffingStatus === 'Partially Staffed' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {event.staffingStatus || 'Unstaffed'}
                    </span>
                    <h3 className="font-bold text-slate-800">
                      {event.eventDetails?.type || event.event || 'Shoot'} - {event.client?.name}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-slate-400" />
                      {event.eventDetails?.date 
                        ? new Date(event.eventDetails.date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) 
                        : event.eventDate || 'N/A'
                      }
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" />
                      {event.eventDetails?.location || event.location || 'No Location specified'}
                    </span>
                  </div>

                  {/* Assigned Staff Pills */}
                  {event.staffAllocated && event.staffAllocated.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {event.staffAllocated.map((staff, idx) => (
                        <span key={idx} className="inline-flex items-center text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                          {staff.name} ({staff.role})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => openAssignModal(event)}
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex-shrink-0"
                >
                  <UserPlus size={14}/> Assign Crew
                </button>
              </div>
            ))}

            {pendingEvents.length === 0 && (
              <div className="bg-white border rounded-xl p-10 text-center text-slate-400">
                <CheckCircle size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm">All confirmed bookings are fully staffed!</p>
              </div>
            )}
          </div>

          {/* Right: Crew Availability Snapshot */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider px-1">Available Staff</h2>
            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200 space-y-3">
              {availableCrew.map(member => (
                <div key={member._id} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mt-0.5">{member.role}</p>
                  </div>
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    member.status === 'Available' 
                      ? 'bg-emerald-500 animate-pulse' 
                      : 'bg-slate-300'
                  }`} />
                </div>
              ))}
              {availableCrew.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-6">No crew members registered.</p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Assignment Modal popup */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-filter backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-800">Assign Crew Member</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Event: {selectedEvent?.eventDetails?.type || selectedEvent?.event} on{' '}
                  {selectedEvent?.eventDetails?.date 
                    ? new Date(selectedEvent.eventDetails.date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) 
                    : selectedEvent?.eventDate
                  }
                </p>
              </div>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAssignCrew} className="space-y-4 text-xs">
              {/* Select Crew */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Crew Member</label>
                <select
                  value={assignForm.employeeId}
                  onChange={(e) => handleCrewChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg py-2 px-3 outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                  required
                >
                  <option value="">-- Select Crew --</option>
                  {availableCrew.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.role})</option>
                  ))}
                </select>
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Role</label>
                <input
                  type="text"
                  value={assignForm.role}
                  onChange={(e) => setAssignForm({ ...assignForm, role: e.target.value })}
                  placeholder="e.g. Lead Photographer"
                  className="w-full border border-slate-200 rounded-lg py-2 px-3 outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Agreed dayRate */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Day Rate (₹)</label>
                <input
                  type="number"
                  value={assignForm.dayRate}
                  onChange={(e) => setAssignForm({ ...assignForm, dayRate: e.target.value })}
                  placeholder="Rate per day"
                  className="w-full border border-slate-200 rounded-lg py-2 px-3 outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-500 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={12} className="animate-spin" />}
                  Assign Member
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
