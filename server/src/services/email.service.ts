import type { Booking, Service } from '../types/index.js';

export function sendBookingConfirmation(booking: Booking, service: Service): void {
  console.log('========================================');
  console.log('EMAIL NOTIFICATION: Booking Confirmation');
  console.log('========================================');
  console.log(`To: ${booking.client_email}`);
  console.log(`Subject: Your ${service.name} appointment is confirmed`);
  console.log(`Date: ${booking.date} at ${booking.start_time}`);
  console.log(`Duration: ${service.duration} minutes`);
  console.log(`Price: $${service.price.toFixed(2)}`);
  console.log('========================================');
}

export function sendBookingCancellation(booking: Booking, service: Service): void {
  console.log('========================================');
  console.log('EMAIL NOTIFICATION: Booking Cancelled');
  console.log('========================================');
  console.log(`To: ${booking.client_email}`);
  console.log(`Subject: Your ${service.name} appointment has been cancelled`);
  console.log(`Date: ${booking.date} at ${booking.start_time}`);
  console.log('========================================');
}
