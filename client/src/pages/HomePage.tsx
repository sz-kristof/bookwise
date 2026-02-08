import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices } from '../api/services';
import type { Service } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { formatPrice, formatDuration } from '../lib/utils';
import { APP_NAME, APP_TAGLINE } from '../lib/constants';
import { Clock, DollarSign, ArrowRight, CalendarCheck, Shield, Zap } from 'lucide-react';

export function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices().then(setServices).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="mt-4 text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">{APP_TAGLINE}</p>
          <p className="mt-2 text-primary-200 max-w-xl mx-auto">
            Book your appointment in seconds. Choose a service, pick a time, and you're all set.
          </p>
          <Link to="/book">
            <Button size="lg" className="mt-8 bg-white text-primary-700 hover:bg-primary-50 shadow-lg">
              Book an Appointment <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: CalendarCheck, title: 'Easy Booking', desc: 'Select your service, date, and time in a simple step-by-step process.' },
            { icon: Zap, title: 'Instant Confirmation', desc: 'Receive immediate confirmation with all appointment details.' },
            { icon: Shield, title: 'Reliable Service', desc: 'Your appointments are securely managed with real-time availability.' },
          ].map(f => (
            <div key={f.title} className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 py-16" id="services">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">Our Services</h2>
        <p className="text-slate-500 text-center mt-2 mb-10">Choose from our range of professional services</p>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <Card key={service.id} className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                  <h3 className="font-semibold text-slate-900">{service.name}</h3>
                </div>
                {service.description && (
                  <p className="text-sm text-slate-500 mb-4">{service.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDuration(service.duration)}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatPrice(service.price)}</span>
                  </div>
                  <Link to={`/book?service=${service.id}`}>
                    <Button size="sm">Book</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
