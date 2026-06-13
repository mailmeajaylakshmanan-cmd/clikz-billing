import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

function fmt(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Edit & Add Modal State
  const [activeClient, setActiveClient] = useState(null); // client object or null
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  function fetchClients() {
    setLoading(true);
    api.get('/clients', { params: { search } })
      .then(res => {
        setClients(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Error fetching clients');
        setLoading(false);
      });
  }

  useEffect(() => {
    const t = setTimeout(fetchClients, 300);
    return () => clearTimeout(t);
  }, [search]);

  function handleOpenAdd() {
    setForm({ name: '', phone: '', email: '', address: '' });
    setIsEditMode(false);
    setShowModal(true);
  }

  function handleOpenEdit(client) {
    setActiveClient(client);
    setForm({
      name: client.name || '',
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || ''
    });
    setIsEditMode(true);
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('Name and phone are required');
      return;
    }
    
    try {
      if (isEditMode) {
        await api.put(`/clients/${activeClient._id}`, form);
        toast.success('Client updated successfully');
      } else {
        await api.post('/clients', form);
        toast.success('Client created successfully');
      }
      setShowModal(false);
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving client');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this client? This will NOT delete their invoices, but they will be removed from the clients index.')) return;
    try {
      await api.delete(`/clients/${id}`);
      toast.success('Client deleted');
      fetchClients();
    } catch (err) {
      toast.error('Error deleting client');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
          <p className="text-xs text-gray-500 mt-1">Manage studio clients and track their balances</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary">
          + Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          className="input max-w-xs"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Client Details</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Contact</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-gray-500">Invoices</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Total Paid</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Balance Due</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr><td colSpan="6" className="text-center py-12 text-gray-400">Loading...</td></tr>
            )}
            {!loading && clients.length === 0 && (
              <tr><td colSpan="6" className="text-center py-12 text-gray-400">No clients found</td></tr>
            )}
            {!loading && clients.map(client => (
              <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{client.address || 'No address'}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-gray-700 font-medium">{client.phone}</p>
                  <p className="text-xs text-gray-400">{client.email || 'No email'}</p>
                </td>
                <td className="px-5 py-3.5 text-center font-mono text-gray-600 font-medium">
                  {client.totalInvoices || 0}
                </td>
                <td className="px-5 py-3.5 text-right font-medium text-green-600">
                  {fmt(client.totalPaid)}
                </td>
                <td className="px-5 py-3.5 text-right font-medium">
                  <span className={client.totalBalance > 0 ? 'text-orange-600 font-bold' : 'text-gray-500'}>
                    {fmt(client.totalBalance)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleOpenEdit(client)}
                      className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isEditMode ? 'Edit Client Details' : 'Add New Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                <input
                  className="input"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="e.g. john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Home Address</label>
                <textarea
                  className="input resize-none"
                  rows={2}
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="e.g. 123 Studio Street, Nagercoil"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {isEditMode ? 'Save Changes' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
