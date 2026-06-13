import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

export default function Manage() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', descriptions: '' });
  const [loading, setLoading] = useState(false);

  function fetchServices() {
    api.get('/services').then(res => setServices(res.data));
  }

  useEffect(() => {
    fetchServices();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const descriptionsArray = form.descriptions.split(',').map(d => d.trim()).filter(Boolean);
      await api.post('/services', { ...form, descriptions: descriptionsArray });
      toast.success('Service added');
      setForm({ name: '', descriptions: '' });
      setShowForm(false);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding service');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete('/services/' + id);
      toast.success('Service deleted');
      fetchServices();
    } catch (err) {
      toast.error('Error deleting service');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Manage Services</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Add Service</button>
      </div>

      {showForm && (
        <div className="card p-5 mb-6">
          <h2 className="font-medium text-gray-900 mb-4">New Service</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Service Name *</label>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Drone Shoot" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Descriptions (comma separated)</label>
              <input className="input" value={form.descriptions} onChange={e => setForm(f => ({ ...f, descriptions: e.target.value }))} placeholder="e.g. Half Day, Full Day" />
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Add Service'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Service Name</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Descriptions</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map(s => (
              <tr key={s._id || s.name} className="hover:bg-gray-50">
                <td className="px-5 py-3.5 font-medium text-gray-900">{s.name}</td>
                <td className="px-5 py-3.5 text-gray-600">{s.descriptions?.join(', ') || '—'}</td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan="3" className="text-center py-12 text-gray-400">No services yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
