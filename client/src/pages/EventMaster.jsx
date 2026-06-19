import { useState } from 'react';
import {
  MessageSquare, User, Calendar, MapPin, Film, Check,
  CreditCard, ArrowRight, ExternalLink, ShieldCheck, Mail, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EventMaster() {
  const events = [
    {
      id: 'CWF-0001',
      client: { name: 'Priya & Karthik', phone: '+919876543210', email: 'priya.karthik@gmail.com', address: 'No 45, Sterling Road, Nungambakkam, Chennai' },
      event: 'Grand Wedding & Reception Film',
      date: 'Aug 15, 2026',
      location: 'Taj Connemara Ballroom, Chennai',
      status: 'Confirmed',
      progressStep: 1, // 0: Enquiry, 1: Confirmed, 2: Completed
      billing: { total: 150000, paid: 50000, balance: 100000 },
      services: [
        { name: 'Cinematic Highlight Film', rate: 85000, spec: '4K Cinematic Highlight Reel (5-8 mins)' },
        { name: 'Candid Photography', rate: 45000, spec: 'senior candid photographer coverage' },
        { name: 'Pre-Wedding Shoot', rate: 20000, spec: 'including concept video and teaser' }
      ]
    },
    {
      id: 'CWF-0002',
      client: { name: 'Sneha & Rahul', phone: '+918765432109', email: 'sneha.rahul@yahoo.com', address: 'Flat 302, Royal Residency, Jayanagar 4th Block, Bangalore' },
      event: 'Reception Ceremony Video & Portraiture',
      date: 'July 20, 2026',
      location: 'Grand Castle Palace Grounds, Bangalore',
      status: 'Completed',
      progressStep: 2,
      billing: { total: 85000, paid: 85000, balance: 0 },
      services: [
        { name: 'Candid Photography', rate: 45000, spec: 'Candid wedding moments coverage' },
        { name: 'Traditional Photography', rate: 40000, spec: 'Traditional photography + premium album' }
      ]
    },
    {
      id: 'CWF-0003',
      client: { name: 'Ananya & Vikram', phone: '+917654321098', email: 'ananya.vikram@gmail.com', address: 'Bungalow 7, Sea Breeze Enclave, Bandra West, Mumbai' },
      event: 'Engagement Cinematic Teaser',
      date: 'Sept 02, 2026',
      location: 'Crystal Room, Taj Lands End, Mumbai',
      status: 'Enquiry',
      progressStep: 0,
      billing: { total: 65000, paid: 15000, balance: 50000 },
      services: [
        { name: 'Wedding Teaser', rate: 30000, spec: 'Cinematic teaser covering highlights' },
        { name: 'Candid Photography', rate: 35000, spec: 'Engagement candid highlights' }
      ]
    }
  ];

  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const activeEvent = events[activeEventIndex];

  const steps = ['Enquiry Created', 'Booking Confirmed', 'Project Completed'];

  const pctPaid = Math.min(100, Math.round((activeEvent.billing.paid / activeEvent.billing.total) * 100));

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ${activeEvent.client.name}, this is CLIKZ Wedding Films. Just confirming details for your upcoming event "${activeEvent.event}" on ${activeEvent.date}.`);
    const cleanPhone = activeEvent.client.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    toast.success('Opening WhatsApp chat!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Event Master</h1>
          <p className="text-sm text-slate-500 mt-1">Centralized event logistics &amp; production manager</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase">Select Active Event:</label>
          <select
            value={activeEventIndex}
            onChange={(e) => setActiveEventIndex(Number(e.target.value))}
            className="border border-slate-200 rounded-lg text-sm bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {events.map((e, idx) => (
              <option key={e.id} value={idx}>{e.id} - {e.client.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal Status Stepper */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          {steps.map((step, idx) => (
            <div key={step} className="flex-1 w-full flex items-center">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  idx <= activeEvent.progressStep
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {idx < activeEvent.progressStep ? <Check size={16} /> : (idx + 1)}
                </div>
                <div className="text-center md:text-left">
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    idx <= activeEvent.progressStep ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {idx === 0 && 'Lead Registered'}
                    {idx === 1 && 'Advance Received'}
                    {idx === 2 && 'Media Delivered'}
                  </p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block flex-1 h-0.5 mx-8 bg-slate-100">
                  <div className={`h-full bg-emerald-600 transition-all`} style={{ width: idx < activeEvent.progressStep ? '100%' : '0%' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Logistics, Services & Payments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Payment Progress Bar card */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-emerald-600" />
              Payment Milestone Progress
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-medium">Billed Milestone</span>
                  <p className="text-2xl font-bold text-slate-800">
                    ₹{activeEvent.billing.paid.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-medium text-slate-400">paid of ₹{activeEvent.billing.total.toLocaleString('en-IN')} total</span>
                  </p>
                </div>
                <span className="text-sm font-bold text-emerald-600">{pctPaid}% Settled</span>
              </div>
              
              {/* Custom stacked progress bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${pctPaid}%` }} />
                <div className="bg-amber-400 h-full transition-all" style={{ width: `${100 - pctPaid}%` }} />
              </div>
              
              {/* Legends */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-50 text-xs">
                <div>
                  <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2" />
                  <span className="text-slate-400">Advance Paid: </span>
                  <span className="font-semibold text-slate-800">₹{activeEvent.billing.paid.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="inline-block w-2.5 h-2.5 bg-amber-400 rounded-full mr-2" />
                  <span className="text-slate-400">Balance Due: </span>
                  <span className="font-semibold text-slate-800">₹{activeEvent.billing.balance.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Grand Total: </span>
                  <span className="font-bold text-slate-800">₹{activeEvent.billing.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booked Services */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Film size={16} className="text-emerald-600" />
              Service Line Items &amp; Deliverables
            </h2>
            <div className="divide-y divide-slate-100">
              {activeEvent.services.map((svc) => (
                <div key={svc.name} className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{svc.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">{svc.spec}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    ₹{svc.rate.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Client Contact Info & Sidebar Actions */}
        <div className="space-y-6">
          
          {/* Client Details Sidebar Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{activeEvent.client.name}</p>
                <p className="text-xs text-slate-400">Client ID: CLI-{activeEvent.id.split('-')[1]}</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Phone size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Phone Number</span>
                  <span className="text-slate-800 font-medium">{activeEvent.client.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Email Address</span>
                  <span className="text-slate-800 font-medium">{activeEvent.client.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Billing Address</span>
                  <span className="text-slate-800 font-medium leading-relaxed">{activeEvent.client.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-sm shadow-emerald-600/10 transition-colors"
              >
                <MessageSquare size={14} /> Send WhatsApp Message
              </button>
            </div>
          </div>

          {/* Project Metadata Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Logistics</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block">Shoot Event</span>
                <span className="font-semibold text-slate-200">{activeEvent.event}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date of Shoot</span>
                <span className="font-semibold text-slate-200">{activeEvent.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Venue Location</span>
                <span className="font-semibold text-slate-200">{activeEvent.location}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck size={14} /> Contract Active &amp; Insured
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
