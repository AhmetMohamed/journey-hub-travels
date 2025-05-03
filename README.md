
# BusGo - Bus Booking System

## Project Structure

This project is organized into two main directories:

- `client`: Contains all frontend code built with React, TypeScript, and Tailwind CSS
- `server`: Contains all backend code built with Express, MongoDB, and Node.js

## Deployment on Vercel

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the following environment variables in your Vercel project:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret for JWT token generation

## Local Development

To run the project locally:

1. Start the backend server:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   npm install
   npm run dev
   ```

3. Access the application at `http://localhost:8080`

## API Endpoints

See `server/README.md` for a complete list of API endpoints.
