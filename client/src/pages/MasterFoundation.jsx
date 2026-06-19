import React, { useState, useEffect } from 'react';
import { Users, Camera, Plus, IndianRupee } from 'lucide-react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

export default function MasterFoundation() {
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  
  // Forms State
  const [empForm, setEmpForm] = useState({ name: '', role: 'Lead Photographer', phone: '', baseDayRate: '' });
  const [serForm, setSerForm] = useState({ name: '', basePrice: '', descriptions: [''] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const empRes = await api.get('/employees');
      const serRes = await api.get('/services');
      setEmployees(empRes.data);
      setServices(serRes.data);
    } catch (err) {
      toast.error('Failed to load foundation data');
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees', {
        name: empForm.name,
        role: empForm.role,
        phone: empForm.phone,
        baseDayRate: Number(empForm.baseDayRate),
        dayRate: Number(empForm.baseDayRate)
      });
      setEmpForm({ name: '', role: 'Lead Photographer', phone: '', baseDayRate: '' });
      toast.success('Crew member added to master list!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add crew member');
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', {
        name: serForm.name,
        basePrice: Number(serForm.basePrice),
        descriptions: serForm.descriptions
      });
      setSerForm({ name: '', basePrice: '', descriptions: [''] });
      toast.success('Service package added to master list!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add service');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-teal-600 rounded-lg text-white flex items-center justify-center">
            <Users size={20}/>
          </div>
          Studio Foundation Master
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage core studio service packages and crew members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- CREW MASTER --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-md font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Users className="text-teal-600" size={18}/> Crew Master
            </h2>
            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{employees.length} Staff</span>
          </div>

          <form onSubmit={addEmployee} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-slate-50 p-4 rounded-xl">
            <input 
              className="p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 ring-teal-500 outline-none bg-white" 
              placeholder="Name" 
              value={empForm.name}
              onChange={(e) => setEmpForm({...empForm, name: e.target.value})}
              required 
            />
            <select 
              className="p-2.5 rounded-lg border border-slate-200 text-sm bg-white"
              value={empForm.role}
              onChange={(e) => setEmpForm({...empForm, role: e.target.value})}
            >
              <option value="Lead Photographer">Lead Photographer</option>
              <option value="Photographer">Photographer</option>
              <option value="Cinematographer">Cinematographer</option>
              <option value="Drone Pilot">Drone Pilot</option>
              <option value="Editor">Editor</option>
              <option value="Assistant">Assistant</option>
            </select>
            <input 
              className="p-2.5 rounded-lg border border-slate-200 text-sm bg-white" 
              placeholder="Day Rate (₹)" 
              type="number"
              value={empForm.baseDayRate}
              onChange={(e) => setEmpForm({...empForm, baseDayRate: e.target.value})}
              required
            />
            <button type="submit" className="bg-teal-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-teal-700 transition py-2.5">
              <Plus size={16}/> Add Staff
            </button>
          </form>

          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
            {employees.map(emp => (
              <div key={emp._id} className="flex justify-between items-center py-3 hover:bg-slate-50/50 transition px-2 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{emp.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{emp.role}</p>
                </div>
                <p className="font-mono text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                  ₹{emp.baseDayRate?.toLocaleString('en-IN') || emp.dayRate?.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
            {employees.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-8">No crew registered in database.</p>
            )}
          </div>
        </div>

        {/* --- SERVICE MASTER --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-md font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Camera className="text-rose-600" size={18}/> Service Master
            </h2>
            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{services.length} Packages</span>
          </div>

          <form onSubmit={addService} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-slate-50 p-4 rounded-xl">
            <input 
              className="p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 ring-rose-500 outline-none col-span-1 sm:col-span-2 bg-white" 
              placeholder="Package Name (e.g. Premium Wedding)" 
              value={serForm.name}
              onChange={(e) => setSerForm({...serForm, name: e.target.value})}
              required 
            />
            <input 
              className="p-2.5 rounded-lg border border-slate-200 text-sm bg-white" 
              placeholder="Base Price (₹)" 
              type="number"
              value={serForm.basePrice}
              onChange={(e) => setSerForm({...serForm, basePrice: e.target.value})}
              required
            />
            <button type="submit" className="bg-rose-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-rose-700 transition py-2.5">
              <Plus size={16}/> Add Service
            </button>
          </form>

          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
            {services.map(ser => (
              <div key={ser._id} className="flex justify-between items-center py-3 hover:bg-slate-50/50 transition px-2 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{ser.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Standard Package</p>
                </div>
                <p className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                  ₹{ser.basePrice?.toLocaleString('en-IN') || 0}
                </p>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-8">No service packages registered in database.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
