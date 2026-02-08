import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

const steps = ['Service', 'Date & Time', 'Details', 'Confirm'];

interface BookingStepperProps {
  currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              index + 1 < currentStep
                ? 'bg-primary-600 text-white'
                : index + 1 === currentStep
                ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                : 'bg-slate-200 text-slate-500'
            )}>
              {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className={cn(
              'text-xs mt-1.5 hidden sm:block',
              index + 1 <= currentStep ? 'text-primary-600 font-medium' : 'text-slate-400'
            )}>{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              'w-12 sm:w-20 h-0.5 mx-2',
              index + 1 < currentStep ? 'bg-primary-600' : 'bg-slate-200'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}
