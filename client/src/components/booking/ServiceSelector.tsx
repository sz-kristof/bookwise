import type { Service } from '../../types';
import { Card } from '../ui/Card';
import { formatPrice, formatDuration, cn } from '../../lib/utils';
import { Clock, DollarSign } from 'lucide-react';

interface ServiceSelectorProps {
  services: Service[];
  selected: Service | null;
  onSelect: (service: Service) => void;
}

export function ServiceSelector({ services, selected, onSelect }: ServiceSelectorProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Choose a Service</h2>
      <p className="text-slate-500 text-sm mb-6">Select the service you'd like to book</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map(service => (
          <Card
            key={service.id}
            onClick={() => onSelect(service)}
            className={cn(
              'p-5 cursor-pointer transition-all duration-200 hover:shadow-md',
              selected?.id === service.id
                ? 'ring-2 ring-primary-500 border-primary-500'
                : 'hover:border-slate-300'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: service.color }} />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(service.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
