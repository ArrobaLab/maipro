# MaiPro Client Application

## Overview
This directory will contain the React frontend application for MaiPro.

## Features to Implement

### Pages
1. **Home Page** - Landing page with service categories
2. **Service Listings** - Browse available services
3. **Provider Search** - Search and filter providers
4. **Provider Profile** - View provider details and reviews
5. **Booking Form** - Create service requests
6. **User Dashboard** - View bookings and profile
7. **Provider Dashboard** - Manage bookings and profile
8. **Login/Register** - Authentication pages

### Components
- Navbar
- ServiceCard
- ProviderCard
- BookingList
- ReviewList
- SearchFilter
- AuthForm

### Services (API Integration)
- authService.js - Handle authentication
- providerService.js - Provider operations
- bookingService.js - Booking management
- serviceService.js - Service catalog
- reviewService.js - Reviews and ratings

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm start
```

## Technology Stack
- React 18
- React Router v6
- Axios for API calls
- Context API for state management
- CSS Modules or Styled Components

## Future Enhancements
- Progressive Web App (PWA)
- Real-time notifications
- Google Maps integration
- Payment gateway integration
- Mobile responsive design
