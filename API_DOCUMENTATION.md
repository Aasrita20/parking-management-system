# 📡 ParkPulse API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require a JWT token passed in the Authorization header:
`Authorization: Bearer <your_jwt_token>`

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | User & Admin authentication |
| `GET` | `/api/auth/me` | Private | Fetch current user profile |
| `PUT` | `/api/auth/profile` | Private | Update user details & defaults |

### POST `/api/auth/register`
**Request Payload:**
```json
{
  "name": "Jane Driver",
  "email": "jane@parking.com",
  "password": "user123",
  "phone": "+1 555-019-8822",
  "defaultVehicleNumber": "KA-01-AB-1234",
  "defaultVehicleType": "car"
}
```

---

## 2. Parking Lot Endpoints (`/api/lots`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/lots` | Public | List all parking facilities with live availability counts |
| `GET` | `/api/lots/:id` | Public | Get single parking lot details |
| `POST` | `/api/lots` | Admin | Create a new parking lot & auto-generate initial slots |
| `PUT` | `/api/lots/:id` | Admin | Update lot information & hourly pricing rates |
| `DELETE` | `/api/lots/:id` | Admin | Delete parking lot and associated slots |

---

## 3. Parking Slot Endpoints (`/api/slots`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/slots/lot/:lotId` | Public | Fetch slots for a lot (supports `floor`, `type`, `status` filters) |
| `POST` | `/api/slots` | Admin | Create single parking slot |
| `PUT` | `/api/slots/:id` | Admin | Update slot details/status |
| `DELETE` | `/api/slots/:id` | Admin | Delete slot (must not be occupied) |

---

## 4. Booking & Barrier Gate Endpoints (`/api/bookings`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Reserve a slot |
| `GET` | `/api/bookings/my-bookings` | Private | Fetch current user's booking history |
| `GET` | `/api/bookings/dashboard-stats` | Private | Role-based dashboard analytics |
| `GET` | `/api/bookings/:id/fee-preview` | Private | Live calculation preview before vehicle exit |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel reserved booking |
| `PUT` | `/api/bookings/:id/check-in` | Private/Admin | Vehicle Entry (Mark slot `occupied`) |
| `PUT` | `/api/bookings/:id/check-out` | Private/Admin | Vehicle Exit (Auto fee calculation & free slot) |
| `GET` | `/api/bookings` | Admin | Retrieve all bookings across all facilities |
