import { useEffect, useState, useCallback } from 'react';
import { fetchServices, createService, updateService, deleteService } from '../../api/services';
import type { Service } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { formatPrice, formatDuration } from '../../lib/utils';
import { Plus, Pencil, Trash2, Clock, DollarSign } from 'lucide-react';

interface ServiceFormData {
  name: string;
  description: string;
  duration: string;
  price: string;
  color: string;
}

const defaultForm: ServiceFormData = { name: '', description: '', duration: '30', price: '0', color: '#3B82F6' };

export function ServicesPage() {
  const { addToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ServiceFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  const loadServices = useCallback(() => {
    setLoading(true);
    fetchServices().then(setServices).finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      description: s.description || '',
      duration: s.duration.toString(),
      price: s.price.toString(),
      color: s.color,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      const data = {
        name: form.name,
        description: form.description || undefined,
        duration: parseInt(form.duration),
        price: parseFloat(form.price),
        color: form.color,
      };

      if (editingId) {
        await updateService(editingId, data);
        addToast('Service updated', 'success');
      } else {
        await createService(data);
        addToast('Service created', 'success');
      }
      setModalOpen(false);
      loadServices();
    } catch {
      addToast('Failed to save service', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this service?')) return;
    try {
      await deleteService(id);
      addToast('Service deactivated', 'success');
      loadServices();
    } catch {
      addToast('Failed to delete service', 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Services</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Add Service</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : services.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-500">No services yet. Create your first service!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <Card key={s.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <h3 className="font-semibold text-slate-900">{s.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4 text-slate-400" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              {s.description && <p className="text-sm text-slate-500 mb-3">{s.description}</p>}
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDuration(s.duration)}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatPrice(s.price)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Service' : 'New Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="svc-name" label="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Strategy Session" />
          <div>
            <label htmlFor="svc-desc" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea id="svc-desc" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Brief description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="svc-duration" label="Duration (min) *" type="number" min="5" max="480" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
            <Input id="svc-price" label="Price ($) *" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="svc-color" className="block text-sm font-medium text-slate-700 mb-1">Color</label>
            <div className="flex items-center gap-3">
              <input id="svc-color" type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-10 h-10 rounded border border-slate-300 cursor-pointer" />
              <span className="text-sm text-slate-500">{form.color}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
