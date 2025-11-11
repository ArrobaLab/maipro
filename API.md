# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request Body:
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "customer",
  "address": {
    "street": "Calle Principal 123",
    "city": "Ciudad",
    "state": "Estado",
    "zipCode": "12345"
  }
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "customer",
    "phone": "+1234567890"
  }
}
```

### Login
**POST** `/auth/login`

Request Body:
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "customer",
    "phone": "+1234567890"
  }
}
```

### Get Profile
**GET** `/auth/profile` 🔒

Response:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "role": "customer",
  "address": {
    "street": "Calle Principal 123",
    "city": "Ciudad",
    "state": "Estado",
    "zipCode": "12345"
  },
  "isActive": true,
  "rating": {
    "average": 0,
    "count": 0
  },
  "createdAt": "2025-11-11T20:00:00.000Z"
}
```

---

## Provider Endpoints

### Create Provider Profile
**POST** `/providers` 🔒

Request Body:
```json
{
  "businessName": "Plomería Pérez",
  "description": "Servicios profesionales de plomería con 10 años de experiencia",
  "specialties": ["plumbing", "hvac"],
  "serviceArea": {
    "radius": 50,
    "cities": ["Ciudad", "Ciudad Vecina"]
  },
  "availability": {
    "monday": { "available": true, "hours": "8:00-18:00" },
    "tuesday": { "available": true, "hours": "8:00-18:00" },
    "wednesday": { "available": true, "hours": "8:00-18:00" },
    "thursday": { "available": true, "hours": "8:00-18:00" },
    "friday": { "available": true, "hours": "8:00-18:00" },
    "saturday": { "available": true, "hours": "9:00-14:00" },
    "sunday": { "available": false, "hours": "" }
  },
  "pricing": {
    "hourlyRate": 50,
    "minimumCharge": 100
  }
}
```

### Search Providers
**GET** `/providers/search?specialty=plumbing&city=Ciudad&verified=true&minRating=4`

Query Parameters:
- `specialty` - Filter by specialty (optional)
- `city` - Filter by service area city (optional)
- `verified` - Filter verified providers (optional)
- `minRating` - Minimum rating (optional)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

Response:
```json
{
  "providers": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": {
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "phone": "+1234567890",
        "rating": {
          "average": 4.5,
          "count": 20
        }
      },
      "businessName": "Plomería Pérez",
      "description": "Servicios profesionales...",
      "specialties": ["plumbing", "hvac"],
      "verified": true,
      "completedJobs": 45
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 48
}
```

---

## Service Endpoints

### Get Service Categories
**GET** `/services/categories`

Response:
```json
[
  { "value": "plumbing", "label": "Plomería", "icon": "🔧" },
  { "value": "electrical", "label": "Electricidad", "icon": "⚡" },
  { "value": "carpentry", "label": "Carpintería", "icon": "🪚" },
  ...
]
```

### List Services
**GET** `/services?category=plumbing&type=residential&page=1&limit=10`

Response:
```json
{
  "services": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Reparación de Fugas",
      "description": "Reparación profesional de fugas de agua",
      "category": "plumbing",
      "type": "both",
      "pricing": {
        "type": "hourly",
        "amount": 50,
        "currency": "USD"
      },
      "estimatedDuration": {
        "value": 2,
        "unit": "hours"
      },
      "isActive": true
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 25
}
```

---

## Booking Endpoints

### Create Booking
**POST** `/bookings` 🔒

Request Body:
```json
{
  "provider": "507f1f77bcf86cd799439011",
  "service": "507f191e810c19729de860ea",
  "serviceAddress": {
    "street": "Calle Principal 123",
    "city": "Ciudad",
    "state": "Estado",
    "zipCode": "12345",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "scheduledDate": "2025-11-15T10:00:00Z",
  "description": "Necesito reparar una fuga en el baño principal",
  "images": ["https://example.com/image1.jpg"]
}
```

Response:
```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "507f191e810c19729de860ea",
    "customer": "507f1f77bcf86cd799439011",
    "provider": "507f1f77bcf86cd799439012",
    "service": "507f191e810c19729de860ea",
    "status": "pending",
    "serviceAddress": { ... },
    "scheduledDate": "2025-11-15T10:00:00.000Z",
    "description": "Necesito reparar una fuga...",
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2025-11-11T20:00:00.000Z",
        "note": "Booking created"
      }
    ],
    "createdAt": "2025-11-11T20:00:00.000Z"
  }
}
```

### Get My Bookings
**GET** `/bookings/my-bookings?status=pending&page=1&limit=10` 🔒

### Get Provider Bookings
**GET** `/bookings/provider-bookings?status=accepted&page=1&limit=10` 🔒

### Update Booking Status
**PUT** `/bookings/:id/status` 🔒

Request Body:
```json
{
  "status": "accepted",
  "note": "Acepto la solicitud, llegaré a tiempo"
}
```

Status values: `pending`, `accepted`, `in_progress`, `completed`, `cancelled`, `rejected`

### Cancel Booking
**PUT** `/bookings/:id/cancel` 🔒

Request Body:
```json
{
  "reason": "No puedo asistir en esa fecha"
}
```

---

## Review Endpoints

### Create Review
**POST** `/reviews` 🔒

Request Body:
```json
{
  "booking": "507f191e810c19729de860ea",
  "provider": "507f1f77bcf86cd799439012",
  "rating": 5,
  "comment": "Excelente servicio, muy profesional y puntual",
  "images": ["https://example.com/after-work.jpg"]
}
```

Response:
```json
{
  "message": "Review created successfully",
  "review": {
    "_id": "507f191e810c19729de860eb",
    "booking": "507f191e810c19729de860ea",
    "customer": "507f1f77bcf86cd799439011",
    "provider": "507f1f77bcf86cd799439012",
    "rating": 5,
    "comment": "Excelente servicio...",
    "images": ["https://example.com/after-work.jpg"],
    "createdAt": "2025-11-16T10:00:00.000Z"
  }
}
```

### Get Provider Reviews
**GET** `/reviews/provider/:providerId?page=1&limit=10`

Response:
```json
{
  "reviews": [
    {
      "_id": "507f191e810c19729de860eb",
      "customer": {
        "name": "María González",
        "profileImage": "https://example.com/avatar.jpg"
      },
      "rating": 5,
      "comment": "Excelente servicio...",
      "createdAt": "2025-11-16T10:00:00.000Z",
      "response": {
        "text": "Gracias por tu comentario!",
        "respondedAt": "2025-11-16T12:00:00.000Z"
      }
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 28
}
```

### Respond to Review
**POST** `/reviews/:id/respond` 🔒

Request Body:
```json
{
  "text": "¡Gracias por tu comentario! Fue un placer trabajar contigo."
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error or bad request"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid authentication token"
}
```

### 403 Forbidden
```json
{
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Error details (only in development)"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

🔒 = Requires authentication (Bearer token)

All timestamps are in ISO 8601 format (UTC)
