# BookWise - Appointment Scheduling System

A full-stack appointment booking platform built with React, Express, and SQLite. Designed for small businesses (salons, clinics, consultants) to manage their scheduling effortlessly.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white)

## Features

### Client-Facing
- **4-step booking wizard** — Select service, pick date & time, enter details, confirm
- **Real-time availability** — Only available time slots are shown
- **Instant confirmation** — Booking summary with reference number

### Admin Panel
- **Dashboard** — Today's bookings, weekly stats, revenue overview
- **Bookings management** — View, filter, complete, or cancel appointments
- **Services CRUD** — Create, edit, and deactivate services with custom colors
- **Availability editor** — Set weekly hours and block specific dates (holidays, vacations)
- **JWT authentication** — Secure admin access

### Technical
- **Monorepo** with npm workspaces (`client/` + `server/`)
- **TypeScript** end-to-end with strict mode
- **Zod** request validation on all API endpoints
- **REST API** with proper error handling and status codes
- **Conflict detection** — Prevents double-booking of time slots
- **Simulated email notifications** — Logged to server console

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, Tailwind CSS 4, React Router 7 |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite (better-sqlite3) |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Validation | Zod |
| Icons | Lucide React |
| Date Utils | date-fns |

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/sz-kristof/bookwise.git
cd bookwise
npm install
```

### Seed demo data

```bash
npm run seed
```

### Start development servers

```bash
npm run dev
```

This starts both:
- **Client** at `http://localhost:5173`
- **Server** at `http://localhost:3001`

### Admin login

- **Username:** `admin`
- **Password:** `admin123`

Navigate to `/admin/login` to access the admin panel.

## Project Structure

```
bookwise/
├── client/                   # React frontend
│   └── src/
│       ├── api/              # API client (Axios)
│       ├── components/       # UI, layout, booking, admin components
│       ├── context/          # Auth & Toast providers
│       ├── pages/            # Route pages
│       ├── types/            # TypeScript interfaces
│       └── lib/              # Utilities & constants
├── server/                   # Express backend
│   └── src/
│       ├── config/           # Database & app constants
│       ├── controllers/      # Request handlers
│       ├── middleware/        # Auth, validation, error handling
│       ├── routes/           # API route definitions
│       ├── services/         # Business logic (availability, email)
│       └── utils/            # Seed script
└── package.json              # Monorepo workspace config
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | - | Admin login |
| GET | `/api/services` | - | List active services |
| POST | `/api/services` | Admin | Create service |
| PUT | `/api/services/:id` | Admin | Update service |
| DELETE | `/api/services/:id` | Admin | Deactivate service |
| GET | `/api/bookings` | Admin | List bookings (with filters) |
| POST | `/api/bookings` | - | Create booking |
| PATCH | `/api/bookings/:id/status` | Admin | Update status |
| GET | `/api/availability` | - | Weekly schedule |
| PUT | `/api/availability` | Admin | Update schedule |
| GET | `/api/availability/slots` | - | Available time slots |
| POST | `/api/availability/blocked-dates` | Admin | Block a date |

## License

This project is for portfolio/demonstration purposes.
