import db from '../config/database.js';
import { format, addDays } from 'date-fns';

console.log('Seeding database...');

// Clear existing data
db.exec('DELETE FROM bookings');
db.exec('DELETE FROM services');
db.exec('DELETE FROM availability');
db.exec('DELETE FROM blocked_dates');

// Seed services
const insertService = db.prepare(
  'INSERT INTO services (name, description, duration, price, color) VALUES (?, ?, ?, ?, ?)'
);

const services = [
  ['Initial Consultation', 'Free introductory meeting to discuss your needs and goals.', 30, 0, '#3B82F6'],
  ['Strategy Session', 'In-depth strategy planning session with actionable takeaways.', 60, 75, '#8B5CF6'],
  ['Design Review', 'Comprehensive review of your current design with improvement suggestions.', 45, 50, '#EC4899'],
  ['Full Workshop', 'Hands-on workshop covering all aspects of your project.', 120, 150, '#F59E0B'],
  ['Quick Check-in', 'Brief follow-up session to track progress and answer questions.', 15, 25, '#10B981'],
];

const serviceIds: number[] = [];
for (const s of services) {
  const result = insertService.run(...s);
  serviceIds.push(Number(result.lastInsertRowid));
}

// Seed availability (Mon-Fri 9-17, Sat 10-14, Sun off)
const insertAvailability = db.prepare(
  'INSERT INTO availability (day_of_week, start_time, end_time, is_active) VALUES (?, ?, ?, ?)'
);

insertAvailability.run(0, '10:00', '14:00', 0); // Sunday - off
insertAvailability.run(1, '09:00', '17:00', 1); // Monday
insertAvailability.run(2, '09:00', '17:00', 1); // Tuesday
insertAvailability.run(3, '09:00', '17:00', 1); // Wednesday
insertAvailability.run(4, '09:00', '17:00', 1); // Thursday
insertAvailability.run(5, '09:00', '17:00', 1); // Friday
insertAvailability.run(6, '10:00', '14:00', 1); // Saturday

// Seed some bookings for demo
const insertBooking = db.prepare(
  'INSERT INTO bookings (service_id, client_name, client_email, client_phone, date, start_time, end_time, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

const today = new Date();
const tomorrow = addDays(today, 1);
const nextWeek = addDays(today, 5);

insertBooking.run(serviceIds[0], 'Alice Johnson', 'alice@example.com', '+1-555-0101', format(tomorrow, 'yyyy-MM-dd'), '09:00', '09:30', 'First time client', 'confirmed');
insertBooking.run(serviceIds[1], 'Bob Smith', 'bob@example.com', '+1-555-0102', format(tomorrow, 'yyyy-MM-dd'), '10:00', '11:00', null, 'confirmed');
insertBooking.run(serviceIds[2], 'Carol Williams', 'carol@example.com', null, format(nextWeek, 'yyyy-MM-dd'), '14:00', '14:45', 'Follow-up from last month', 'confirmed');
insertBooking.run(serviceIds[3], 'David Brown', 'david@example.com', '+1-555-0104', format(nextWeek, 'yyyy-MM-dd'), '09:00', '11:00', 'Team workshop - 5 participants', 'confirmed');

console.log('Database seeded successfully!');
console.log(`- ${services.length} services`);
console.log('- 7 availability records');
console.log('- 4 sample bookings');
