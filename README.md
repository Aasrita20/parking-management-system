# 🅿️ ParkPulse - Modern Full Stack Parking Management System

ParkPulse is a modern, responsive, full-stack web application for smart parking management. It enables users to browse parking facilities, view live interactive floor maps, reserve parking slots, simulate barrier gate entry/exit, and perform automated parking fee calculations.

---

## 🚀 Features

- **JWT Authentication & Role Control**: User and Admin roles with protected API routes.
- **Interactive Visual Floor Grid**: Color-coded live slots map (Green = Available, Yellow = Reserved, Red = Occupied, Gray = Maintenance).
- **Vehicle Categories**: Cars, Motorcycles/Bikes, EV Charging Slots, and Heavy Vehicles/Trucks.
- **Automated Parking Fee Engine**: Dynamic fee calculation based on duration ($T_{\text{exit}} - T_{\text{entry}}$) and vehicle category rates.
- **Vehicle Barrier Control**: Simulate check-in (Entry) and check-out (Exit with instant invoice calculation).
- **Digital Receipts**: Printable/downloadable invoice receipts for completed bookings.
- **Role-Based Dashboards**:
  - **Admin**: Facility CRUD, slot management, live occupancy rate analytics, global barrier gate feed, total revenue.
  - **User**: Active reservations, spending summary, quick booking, ticket printouts.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend**: Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), Bcrypt.js, Morgan
- **Database**: MongoDB Atlas Cluster (pre-configured)

---

## 🔑 Configured Demo Credentials

MongoDB Atlas URI is pre-configured in `backend/.env`.

### 🛡️ Admin Account:
- **Email**: `aasrita.t2006@gmail.com`
- **Password**: `admin123`

### 👤 Driver Account:
- **Email**: `user@parking.com`
- **Password**: `user123`

---

## 📦 Setup & Execution Guide

### 1. Backend Setup:
```bash
cd backend
npm install
npm run seed      # (Optional) Populates sample parking lots, slots, and demo accounts
npm run dev       # Starts Express API server on http://localhost:5000
```

### 2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev       # Starts Vite React App on http://localhost:3000
```

---

## 📁 Directory Structure Overview

```
parking-management-system/
├── backend/
│   ├── config/db.js             # MongoDB Mongoose connection
│   ├── controllers/             # Auth, Lots, Slots, Bookings logic
│   ├── middleware/              # JWT & Error handling
│   ├── models/                  # User, ParkingLot, ParkingSlot, Booking schemas
│   ├── routes/                  # REST API endpoints
│   ├── utils/                   # Fee calculator & database seeder
│   └── server.js                # Express entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/          # SlotGrid, LotCard, BookModal, CheckInOutModal, ReceiptModal
│   │   ├── context/             # AuthContext, ToastContext
│   │   ├── pages/               # Dashboard, Lots, LotDetails, Bookings, Admin
│   │   ├── services/api.js      # Fetch API wrapper with JWT headers
│   │   └── App.jsx              # Routes configuration
└── API_DOCUMENTATION.md         # Full REST API Reference
```
