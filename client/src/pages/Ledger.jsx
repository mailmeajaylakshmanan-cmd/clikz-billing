import { useState } from 'react';
import {
  FileText, IndianRupee, Trash2, Plus, Calendar, DollarSign,
  ArrowUpRight, ArrowDownRight, Printer, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Ledger() {
  // Line items state for interactive builder
  const [lineItems, setLineItems] = useState([
    { service: 'Cinematic Highlight Film', description: '4K UHD Cinema Highlight (5-8 Mins)', qty: 1, rate: 85000 },
    { service: 'Candid Photography', description: 'Senior candid photographer (2 Days)', qty: 1, rate: 45000 }
  ]);

  const [discount, setDiscount] = useState(5000);
  const [advancePaid, setAdvancePaid] = useState(40000);

  // Chronological payment history state
  const payments = [
    { id: 101, ref: 'TXN-9021', client: 'Priya & Karthik', method: 'UPI (GPay)', amount: 50000, category: 'Wedding Films', type: 'income', date: 'June 19, 2026' },
    { id: 102, ref: 'TXN-8832', client: 'Worker Payment', method: 'Bank Transfer', amount: 8000, category: 'Crew Anand', type: 'expense', date: 'June 18, 2026' },
    { id: 103, ref: 'TXN-7643', client: 'Sneha & Rahul', method: 'UPI (PhonePe)', amount: 85000, category: 'Full Settlement', type: 'income', date: 'June 15, 2026' },
    { id: 104, ref: 'TXN-6641', client: 'Studio Rental', method: 'Cash', amount: 15000, category: 'Rent', type: 'expense', date: 'June 01, 2026' }
  ];

  // Calculations for Line Items
  const subTotal = lineItems.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const total = Math.max(0, subTotal - discount);
  const balance = Math.max(0, total - advancePaid);

  // Seeding stats for sticky card
  const totalIncome = payments.filter(p => p.type === 'income').reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = payments.filter(p => p.type === 'expense').reduce((acc, p) => acc + p.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const handleAddItem = () => {
    setLineItems([...lineItems, { service: 'New Service', description: 'Enter details', qty: 1, rate: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (lineItems.length === 1) {
      toast.error('At least one line item is required.');
      return;
    }
    setLineItems(lineItems.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setLineItems(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: field === 'service' || field === 'description' ? value : Number(value) };
      }
      return item;
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">The Ledger</h1>
          <p className="text-sm text-slate-500 mt-1">Invoice line-item builder &amp; Profit and Loss statement</p>
        </div>
      </div>

      {/* Main split view: Line Item Builder (Left) vs P&L (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Line Item Builder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                Line Item Builder
              </h2>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 border border-slate-200 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 transition-colors"
              >
                <Printer size={13} /> Print/PDF
              </button>
            </div>

            {/* Line items list */}
            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-3 border-b border-slate-50 pb-4 md:pb-3 items-end">
                  
                  {/* Service selection/text */}
                  <div className="flex-1 w-full space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service / Package</label>
                    <input
                      type="text"
                      value={item.service}
                      onChange={(e) => handleItemChange(index, 'service', e.target.value)}
                      placeholder="e.g. Cinematic Film"
                      className="w-full border border-slate-200 rounded-lg text-xs py-2 px-3 outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex-1 w-full space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specs Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="e.g. 4K UHD coverage"
                      className="w-full border border-slate-200 rounded-lg text-xs py-2 px-3 outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Qty */}
                  <div className="w-full md:w-20 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Qty</label>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg text-xs py-2 px-3 outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Rate */}
                  <div className="w-full md:w-32 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price (₹)</label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg text-xs py-2 px-3 outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Total indicator */}
                  <div className="w-full md:w-32 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg text-xs py-2 px-3 font-semibold text-slate-700">
                      ₹{(item.qty * item.rate).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              ))}
            </div>

            {/* Add row */}
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-lg transition-colors"
            >
              <Plus size={14} /> Add Line Item
            </button>

            {/* Subtotals & Balances */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Discount (₹)</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-28 text-right border border-slate-200 rounded-lg py-1 px-2 text-xs"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Advance Paid (₹)</span>
                  <input
                    type="number"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(Number(e.target.value))}
                    className="w-28 text-right border border-slate-200 rounded-lg py-1 px-2 text-xs"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between font-medium text-slate-500">
                  <span>Subtotal:</span>
                  <span>₹{subTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-medium text-slate-500">
                  <span>Discount:</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 text-sm pt-1 border-t border-slate-200">
                  <span>Final Total:</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Balance Due:</span>
                  <span>₹{balance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Sticky P&L Summary & Payment History */}
        <div className="space-y-6">
          
          {/* Net Profit Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Profit &amp; Loss Statement</span>
              <p className="text-[11px] text-slate-500 mt-1">Consolidated studio revenues (UPI, cash, cards)</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Total Income:</span>
                <span className="font-semibold text-emerald-400">+ ₹{totalIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Total Expenses:</span>
                <span className="font-semibold text-rose-400">- ₹{totalExpenses.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-xs text-slate-400 font-medium">Net Profit:</span>
                <span className="text-xl font-bold text-emerald-400">
                  ₹{netProfit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-start gap-2.5">
              <Sparkles size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-emerald-300 leading-normal">
                Your studio is performing efficiently with an estimated **{( (netProfit / totalIncome) * 100 ).toFixed(1)}% profit margin** this month.
              </p>
            </div>
          </div>

          {/* Payment History Log */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction History</h3>
            <div className="divide-y divide-slate-100">
              {payments.map(p => (
                <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{p.client}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.date} • {p.method}</p>
                  </div>
                  <span className={`font-bold ${p.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {p.type === 'income' ? '+' : '-'} ₹{p.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
