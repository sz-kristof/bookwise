import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchServices } from '../api/services';
import { createBooking } from '../api/bookings';
import type { Service } from '../types';
import { BookingStepper } from '../components/booking/BookingStepper';
import { ServiceSelector } from '../components/booking/ServiceSelector';
import { CalendarPicker } from '../components/booking/CalendarPicker';
import { TimeSlotGrid } from '../components/booking/TimeSlotGrid';
import { BookingForm } from '../components/booking/BookingForm';
import { BookingConfirmation } from '../components/booking/BookingConfirmation';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

export function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientData, setClientData] = useState({ clientName: '', clientEmail: '', clientPhone: '', notes: '' });

  useEffect(() => {
    fetchServices().then(data => {
      setServices(data);
      const preselect = searchParams.get('service');
      if (preselect) {
        const found = data.find(s => s.id === parseInt(preselect));
        if (found) {
          setSelectedService(found);
          setStep(2);
        }
      }
    }).finally(() => setLoading(false));
  }, [searchParams]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleFormSubmit = (data: typeof clientData) => {
    setClientData(data);
    setStep(4);
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    try {
      const booking = await createBooking({
        serviceId: selectedService.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedTime,
        clientName: clientData.clientName,
        clientEmail: clientData.clientEmail,
        clientPhone: clientData.clientPhone || undefined,
        notes: clientData.notes || undefined,
      });
      navigate('/booking-success', {
        state: {
          booking,
          service: selectedService,
          date: selectedDate.toISOString(),
          time: selectedTime,
        },
      });
    } catch {
      addToast('Failed to create booking. The time slot may no longer be available.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <BookingStepper currentStep={step} />

      {step > 1 && step < 4 && (
        <button onClick={goBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}

      {step === 1 && (
        <ServiceSelector services={services} selected={selectedService} onSelect={handleServiceSelect} />
      )}

      {step === 2 && selectedService && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Pick a Date & Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CalendarPicker selected={selectedDate} onSelect={handleDateSelect} />
            {selectedDate && (
              <TimeSlotGrid
                date={format(selectedDate, 'yyyy-MM-dd')}
                serviceId={selectedService.id}
                selected={selectedTime}
                onSelect={handleTimeSelect}
              />
            )}
          </div>
          {selectedTime && (
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setStep(3)} size="lg">
                Continue
              </Button>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <BookingForm onSubmit={handleFormSubmit} />
      )}

      {step === 4 && selectedService && selectedDate && selectedTime && (
        <BookingConfirmation
          service={selectedService}
          date={selectedDate}
          time={selectedTime}
          clientName={clientData.clientName}
          clientEmail={clientData.clientEmail}
          clientPhone={clientData.clientPhone}
          notes={clientData.notes}
          onConfirm={handleConfirm}
          onBack={goBack}
          loading={submitting}
        />
      )}
    </div>
  );
}
