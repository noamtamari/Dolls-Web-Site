# Varda's Dolls - Full Stack Application

This is a full-stack web application for Varda's Dolls, an online store where users can browse, add items to their wishlist or cart, and make purchases. The application is built using React for the frontend and Node.js with Express for the backend. MongoDB is used as the database, and Stripe is integrated for payment processing.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

---

## Features

### Client (Frontend)
- Built with React and React Router for seamless navigation.
- Displays a list of dolls with details like size, price, and description.
- Allows users to:
  - Add items to their wishlist.
  - Add items to their cart with size and quantity selection.
  - View and navigate through paginated product listings.
- Responsive design using Bootstrap and custom CSS.

### Server (Backend)
- Built with Node.js and Express.
- Handles user authentication using Passport.js (local and Google OAuth strategies).
- Manages user sessions with MongoDB-backed session storage.
- Provides API endpoints for:
  - Wishlist and cart management.
  - Payment processing using Stripe.
  - User registration and login.
- Serves the React frontend in production.

---

## Technologies Used

### Frontend
- React
- React Router
- Bootstrap
- Axios

### Backend
- Node.js
- Express
- Passport.js (Local and Google OAuth strategies)
- Stripe API
- MongoDB with Mongoose

---

## Project Structure

client/ ├── public/ # Static assets (e.g., favicon, index.html) ├── src/ # React components and logic │ ├── components/ # Reusable components (e.g., StoreContent, DollProduct) │ ├── App.js # Main React component │ ├── index.js # Entry point for React │ └── ... # Other files ├── build/ # Production build (generated by npm run build) └── package.json # Frontend dependencies and scripts

server/ ├── public/ # Static files served by the backend ├── views/ # EJS templates (if used) ├── server.js # Main server file ├── userModel.js # Mongoose schema for users ├── checkOutRoute.js # Routes for checkout functionality ├── ordersRoute.js # Routes for order management ├── paymentRoute.js # Routes for payment processing ├── .env # Environment variables └── package.json # Backend dependencies and scripts

---

## Environment Variables

The following environment variables are required for the application to run:

```env
# Google OAuth
CLIENT_ID=<Your Google OAuth Client ID>
CLIENT_SECRET=<Your Google OAuth Client Secret>
REDIRECT_URI=<Your Google OAuth Redirect URI>

# Stripe API
STRIPE_API_KEY=<Your Stripe Secret Key>

# MongoDB
MONGODB_CONNECTION=<Your MongoDB Connection String>
```

---

## Setup Instructions

### Prerequisites
- Node.js installed on your machine.
- MongoDB database set up.
- Stripe account for payment processing.

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
2. Install dependencies for both the client and server:
    cd client
    npm install
    cd ../server
    npm install
3. Create a .env file in the server directory and add the required environment variables.
4. Start the development servers:
    cd server
    npm start

5. Start the frontend development server:
    cd client
    npm start
6. Open the application in your browser at http://localhost:3000. it may open   automatically.

---

## Available Scripts

### Client

    npm start: Starts the React development server.
    npm run build: Builds the React app for production.
    npm test: Runs tests for the React app.

### Server

    npm start: Starts the Node.js server.
    npm run dev: Starts the server in development mode with live reloading (if using nodemon).

---

## API Endpoints

### Authentication
    POST /api/register: Register a new user.
    POST /api/login: Log in a user.
    POST /api/log-out: Log out a user.
    GET /auth/google: Initiate Google OAuth login.
    GET /auth/google/VardasDolls: Google OAuth callback.

### WishList
    GET /api/set-wishList: Add an item to the wishlist.
    POST /api/update-wishList: Remove an item from the wishlist.


### Cart
    GET /api/addTo-cart: Get the cart items.
    POST /api/addTo-cart: Add an item to the cart.

### Payment
    POST /create-payment-intent: Create a payment intent using Stripe API.

---

## Deployment

### Frontend
1. Build the React app:
    cd client
    npm run build
2. Serve the build/ folder using the backend or a static file server.

### Backend
1. Deploy the server to a hosting platform (e.g., Heroku, Render, AWS).
2. Ensure the .env file is configured correctly on the hosting platform.






   
