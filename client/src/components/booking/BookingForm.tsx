import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  loading?: boolean;
}

export function BookingForm({ onSubmit, loading }: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};
    if (!form.clientName.trim()) newErrors.clientName = 'Name is required';
    if (!form.clientEmail.trim()) newErrors.clientEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) newErrors.clientEmail = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Your Details</h2>
      <p className="text-slate-500 text-sm mb-6">Please provide your contact information</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="clientName"
          label="Full Name *"
          value={form.clientName}
          onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
          error={errors.clientName}
          placeholder="John Smith"
        />
        <Input
          id="clientEmail"
          label="Email Address *"
          type="email"
          value={form.clientEmail}
          onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
          error={errors.clientEmail}
          placeholder="john@example.com"
        />
        <Input
          id="clientPhone"
          label="Phone Number (optional)"
          type="tel"
          value={form.clientPhone}
          onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))}
          placeholder="+1-555-0123"
        />
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            placeholder="Any special requests or information..."
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Booking...' : 'Continue to Confirmation'}
        </Button>
      </form>
    </div>
  );
}
