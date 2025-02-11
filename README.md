# Subscription Tracker API

## Overview
Subscription Tracker API is a Node.js application that helps manage user authentication, subscriptions, and workflows. It is built with Express.js and uses MongoDB as the database.

## Features
- User authentication (Sign Up, Sign In, Sign Out)
- Subscription management
- Workflow handling
- Secure API with JWT authentication

## Technologies Used
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Cookie-based authentication

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Mohanad23o/Subscription-Tracker.git
   ```
2. Navigate to the project folder:
   ```sh
   cd Subscription-Tracker
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up the environment variables:
   - Create a `.env` file in the root directory
   - Add the required values based on `config/env.js`

## Running the Application

Start the development server:
```sh
npm start
```

## API Endpoints

### Authentication
- **POST** `/api/v1/auth/sign-up` - Register a new user
- **POST** `/api/v1/auth/sign-in` - Log in
- **POST** `/api/v1/auth/sign-out` - Log out

### Users
- **GET** `/api/v1/users` - Get all users
- **GET** `/api/v1/users/:id` - Get a single user
- **DELETE** `/api/v1/users/:id` - Delete a user

### Subscriptions
- **GET** `/api/v1/subscriptions` - Get all subscriptions
- **POST** `/api/v1/subscriptions` - Add a new subscription
- **DELETE** `/api/v1/subscriptions/:id` - Delete a subscription

### Workflows
- **GET** `/api/v1/workflows` - Get workflows

## Troubleshooting

If the API returns a **403 Forbidden** error, try commenting out `app.use(arcjetMiddleware);` in `app.js` and restart the app.

Check the logs for more details:
```sh
npm run dev
```

