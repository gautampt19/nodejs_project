# Node.js Project – API with Sequelize

A modular Node.js REST API using Express and Sequelize ORM, supporting user management and post creation with robust authentication, validation, and error handling.

---

**Project Structure**
src/
│
├── config/
│ └── database.js # Sequelize database connection setup
│
├── controllers/
│ ├── post.controller.js # Business logic for post CRUD
│ └── user.controller.js # Business logic for user CRUD, auth, etc.
│
├── middleware/
│ └── auth.js # JWT authentication and authorization middleware
│
├── models/
│ ├── post.model.js # Sequelize Post model definition
│ └── user.model.js # Sequelize User model definition
│
├── routes/
│ ├── post.routes.js # Express routes for posts
│ └── user.routes.js # Express routes for users
│
├── utils/
│ ├── ApiError.js # Custom error class for consistent error responses
│ ├── ApiResponse.js # Custom response class for success responses
│ └── asyncHandler.js # Utility to wrap async route handlers
│
└── index.js # Entry point: sets up Express app, middleware, routes, and server

---

## **Key Components**

- **config/database.js**  
  Sets up the Sequelize connection to your SQL database using ES6 import syntax.

- **models/**  
  Contains Sequelize models for `User` and `Post`, including fields, relationships, and instance methods (e.g., password validation).

- **controllers/**  
  Implements the core business logic for users and posts, including registration, login, CRUD operations, and secure token handling.

- **routes/**  
  Maps HTTP endpoints to controller functions for both users and posts.

- **middleware/auth.js**  
  Protects routes by verifying JWTs and attaching the authenticated user to the request.

- **utils/**  
  Provides reusable helpers for error handling (`ApiError`), standardized API responses (`ApiResponse`), and async error forwarding (`asyncHandler`).

- **index.js**  
  Main application file that initializes the Express server, applies middleware, mounts routes, and starts listening for requests.

---

## **How It Works**

- **Users** can register, log in, update details, change passwords, and delete their accounts.
- **Posts** can be created, read, updated, and deleted by authenticated users; each post is linked to its creator.
- **Authentication** uses JWT tokens, with secure password hashing and refresh token support.
- **Error handling** is consistent and centralized, making the API robust and predictable.

---

## **Getting Started**

1. Clone the repository.
2. Install dependencies:  
   `npm install`
3. Configure your database and environment variables.
4. Run migrations (if any) and start the server:  
   `npm run dev`
5. Use the provided API endpoints for user and post management.

---
