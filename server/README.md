
# Bus Booking System Backend

This is the backend API for the Bus Booking System built with Express, MongoDB, and Node.js.

## Installation

1. Make sure you have Node.js and MongoDB installed on your system.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start MongoDB if it's not running:
   ```bash
   mongod
   ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires authentication)

### Routes

- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route by ID
- `POST /api/routes` - Create a new route (requires authentication)
- `PUT /api/routes/:id` - Update a route (requires authentication)
- `DELETE /api/routes/:id` - Delete a route (requires authentication)

### Schedules

- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/:id` - Get schedule by ID
- `POST /api/schedules` - Create a new schedule (requires authentication)
- `PUT /api/schedules/:id` - Update a schedule (requires authentication)
- `DELETE /api/schedules/:id` - Delete a schedule (requires authentication)
