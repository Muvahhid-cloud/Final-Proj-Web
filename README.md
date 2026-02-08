# ☕ Coffee Shop E-Commerce Platform

![Coffee Shop Banner](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-blue?style=for-the-badge)
![RBAC](https://img.shields.io/badge/Security-RBAC-red?style=for-the-badge)

---------------------------------------------------- 

https://final-proj-web-3.onrender.com

A modern, full-featured **coffee shop e-commerce platform** with user authentication, role-based access control (RBAC), order management, and an admin dashboard. Built with **Node.js**, **Express**, **MongoDB**, and **JWT**.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements Coverage](#requirements-coverage)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Authentication & Security](#authentication--security)
- [Admin Dashboard](#admin-dashboard)
- [Usage Examples](#usage-examples)
- [Deployment](#deployment)
- [Advanced Features](#advanced-features)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

This is a **full-stack coffee shop e-commerce platform** designed to handle:
- ✅ User registration and authentication with JWT
- ✅ Product catalog with images and categories
- ✅ Shopping cart and order management
- ✅ User profile management
- ✅ Admin dashboard with role-based access control
- ✅ Order analytics (revenue, order tracking)
- ✅ User and order management by admins
- ✅ Comprehensive validation and error handling

**Topic**: Coffee Shop E-Commerce Platform (E-commerce/ordering system)

---

## ✨ Features

### 👤 User Features
- **Registration & Login**: Secure user authentication with bcrypt password hashing
- **Profile Management**: Update username, email, and password
- **Browse Products**: View coffee and beverage catalog with images, prices, and descriptions
- **Shopping Cart**: Add/remove items, update quantities
- **Order Placement**: Create orders, view order history, track order status
- **Order History**: View all past orders with details and status

### 🛡️ Admin Features
- **Exclusive Admin Registration**: Dedicated admin signup page with phone validation (+7 numbers)
- **Admin Dashboard**: 
  - 📊 View total revenue and order counts in real-time
  - 👥 Manage all registered users
  - 📦 Track all orders across users
  - ❌ Delete users (with cascade to their orders)
  - ❌ Delete individual orders
  - 🔍 View order details and user information

### 🔒 Security & RBAC
- **Role-Based Access Control**: Admin-only endpoints protected by role middleware
- **JWT Tokens**: Secure stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Admin-Only Routes**: `/api/users` (list users), `/api/analytics/*` (revenue/orders), admin deletion endpoints
- **Protected Endpoints**: Regular users cannot access admin routes

### ✅ Validation & Error Handling
- **Email Validation**: Using `validator.js` for format checks
- **Password Requirements**: Validated at registration and profile update
- **Username Validation**: Length checks (2-32 characters)
- **Phone Validation**: Admin registration requires +7 format numbers
- **Global Error Middleware**: Centralized error handling with appropriate HTTP status codes
- **Async Error Wrapper**: `asyncH` middleware for automatic error catching

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) + bcrypt |
| **Validation** | validator.js |
| **Frontend UI** | HTML5 + CSS3 + Vanilla JavaScript |
| **Security** | CORS, role-based middleware, helmet (optional) |

---

## 📊 Requirements Coverage

### ✅ PROJECT SETUP 
- [x] **Topic Selected**: Coffee Shop E-Commerce Platform ☕
- [x] **Node.js + Express**: Main server in `server.js` and `app.js`
- [x] **Modular Structure**: 
  - Routes: `src/routes/*`
  - Controllers: `src/controllers/*`
  - Models: `src/models/*`
  - Middleware: `src/middleware/*`
- [x] **README.md**: This file (with setup, overview, API docs, screenshots)

### ✅ DATABASE
- [x] **MongoDB**: Connected via `MONGO_URI` environment variable
- [x] **Collections** (3):
  1. **User** - `username`, `email`, `password` (hashed), `role` (user/admin), `createdAt`, `updatedAt`
  2. **Order** - `userId` (ref), `items[]`, `totalPrice`, `status` (pending/completed/cancelled), `timestamps`
  3. **Product** - `name`, `category`, `price`, `imageUrl`, `description`, `inStock`

### ✅ API ENDPOINTS 

#### Authentication (Public - 2 endpoints)
- [x] `POST /api/auth/register` - Register new user with encrypted password
- [x] `POST /api/auth/login` - Authenticate and return JWT token

#### User Management (Private - 3 endpoints)
- [x] `GET /api/users/profile` - Get logged-in user's profile
- [x] `PUT /api/users/profile` - Update profile (username, email)
- [x] `PUT /api/users/password` - Update password

#### Order Management (Private - 5 endpoints)
- [x] `POST /api/orders` - Create new order
- [x] `GET /api/orders` - Get user's orders
- [x] `GET /api/orders/:id` - Get specific order
- [x] `PUT /api/orders/:id` - Update order status
- [x] `DELETE /api/orders/:id` - Delete own order

#### Admin Endpoints (Private - Admin Only)
- [x] `GET /api/users` - List all users (admin only)
- [x] `DELETE /api/users/:id` - Delete user (admin only)
- [x] `GET /api/users/:id/orders` - Get user's orders (admin only)
- [x] `DELETE /api/orders/:id/admin` - Delete order (admin only)
- [x] `GET /api/analytics/revenue` - Get total revenue & order count (admin only)

#### Product Management
- [x] `GET /api/products` - Get all products
- [x] `GET /api/products/:id` - Get specific product

### ✅ AUTHENTICATION & SECURITY
- [x] **JWT Implementation**: 
  - Token generated on login/register
  - Token contains `userId`, `username`, `role`
  - Verified via `auth.middleware.js`
  - Includes 24-hour expiration
- [x] **bcrypt Password Hashing**: 
  - Passwords hashed at registration (salt rounds: 10)
  - Passwords hashed at update
  - Password comparison for login authentication
- [x] **Protected Endpoints**: 
  - `auth.middleware.js` validates JWT on all private routes
  - Returns 401 if invalid/missing token
- [x] **Environment Variables**: 
  - `JWT_SECRET` - Secure token signing
  - `MONGO_URI` - Database connection
  - Stored in `.env` file (not committed)

### ✅ VALIDATION & ERROR HANDLING 
- [x] **Input Validation**:
  - Email validation via `validator.isEmail()`
  - Username validation (2-32 characters)
  - Password validation (strength checks)
  - Phone validation (admin registration only, +7 format)
  - Order items validation
- [x] **Error Handling**:
  - `error.middleware.js` - Global error handler
  - `async.middleware.js` - Async error wrapper
  - Appropriate HTTP status codes:
    - 400: Bad request (validation, missing fields)
    - 401: Unauthorized (invalid token, wrong credentials)
    - 403: Forbidden (access denied, role mismatch)
    - 404: Not found (user, order, product not found)
    - 409: Conflict (duplicate username/email)
    - 500: Internal server error

### ✅ ADVANCED FEATURES

#### 7.1 ROLE-BASED ACCESS CONTROL
- [x] **Roles Implemented**: `user` and `admin`
- [x] **Role Middleware**: `role.middleware.js` checks user role
- [x] **Admin-Only Routes**:
  - `/api/users` (list all users)
  - `/api/users/:id` (delete user)
  - `/api/users/:id/orders` (admin view user's orders)
  - `/api/orders/:id/admin` (admin delete order)
  - `/api/analytics/*` (revenue, orders analytics)
- [x] **Admin Registration**: Dedicated `/api/auth/register-admin` with phone validation
- [x] **Access Levels**:
  - Regular users: Update own profile, create orders, view own orders
  - Admin users: Full user management, order management, analytics access

#### ⏳ 7.2 SMTP Email Service 
- [ ] Nodemailer integration
- [ ] SendGrid/Mailgun API keys
- Note: Can be added for email notifications on order placement, password reset, etc.

### ✅ DEPLOYMENT
- [ ] Application successfully deployed on Render
- [ ] Production build running with environment variables securely configured
- [ ] MongoDB Atlas connected to the deployed backend
- [ ] Automatic redeployment enabled via GitHub integration
---

## 📁 Project Structure

```
coffee-shop-project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js        # Register, login, admin registration
│   │   │   ├── user.controller.js        # Profile, password, admin user management
│   │   │   ├── order.controller.js       # Order CRUD, admin order deletion
│   │   │   ├── product.controller.js     # Product retrieval
│   │   │   └── analytics.controller.js   # Revenue, order analytics
│   │   ├── routes/
│   │   │   ├── auth.routes.js            # Auth endpoints
│   │   │   ├── user.routes.js            # User & admin endpoints
│   │   │   ├── order.routes.js           # Order endpoints
│   │   │   ├── product.routes.js         # Product endpoints
│   │   │   └── analytics.routes.js       # Analytics endpoints
│   │   ├── models/
│   │   │   ├── user.model.js             # User schema (username, email, role)
│   │   │   ├── order.model.js            # Order schema (userId, items, price)
│   │   │   └── product.model.js          # Product schema (name, price, image)
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js        # JWT verification
│   │   │   ├── role.middleware.js        # Role-based access control
│   │   │   ├── error.middleware.js       # Global error handler
│   │   │   ├── async.middleware.js       # Async error wrapper
│   │   │   └── validateObjectId.middleware.js
│   │   └── seed/
│   │       └── SeedProducts.js           # Auto-populate products on startup
│   ├── public/
│   │   ├── pages/
│   │   │   ├── Login.html                # User login page
│   │   │   ├── Register.html             # User registration page
│   │   │   ├── AdminRegister.html        # Admin registration (unique page)
│   │   │   ├── Dashboard.html            # User profile/dashboard
│   │   │   ├── Menu.html                 # Product catalog
│   │   │   ├── Cart.html                 # Shopping cart
│   │   │   ├── Orders.html               # User order history
│   │   │   └── AdminDashboard.html       # Admin management panel
│   │   ├── js/
│   │   │   ├── nav.js                    # Navigation logic
│   │   │   ├── auth.js                   # Login/register handlers
│   │   │   ├── menu.js                   # Product display
│   │   │   ├── cart.js                   # Cart management
│   │   │   ├── adminDashboard.js         # Admin panel logic
│   │   │   └── adminRegister.js          # Admin registration logic
│   │   └── css/
│   │       └── styles.css                # Professional styling
│   ├── app.js                            # Express app configuration
│   ├── server.js                         # Server startup
│   ├── .env                              # Environment variables (not committed)
│   ├── .gitignore                        # Git ignore rules
│   └── package.json                      # Dependencies
└── README.md                             # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud via MongoDB Atlas)

### Step 1: Clone & Navigate
```bash
git clone <repo-url>
cd coffee-shop-project/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create `.env` File
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/coffee-shop
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/coffee-shop

JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=1d

NODE_ENV=development
```

### Step 4: Start MongoDB (if local)
```bash
# On Windows
mongod

# On macOS/Linux
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### Step 5: Start the Server
```bash
npm start
```

You should see:
```
[dotenv@17.2.3] injecting env (3) from .env
MongoDB connected
✅ Seeded ALL products with images
Server: http://localhost:5000
```

### Step 6: Access the App
- **Frontend**: Open browser to `http://localhost:5000`
- **Admin Dashboard**: After login as admin → click "Admin Dashboard"

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201)**:
```json
{
  "message": "User registered",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Register Admin
```http
POST /auth/register-admin
Content-Type: application/json

{
  "username": "admin_user",
  "email": "admin@example.com",
  "password": "AdminPass123!",
  "phone": "+79991234567"
}
```

**Response (201)**:
```json
{
  "message": "Admin registered"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### User Management Endpoints

#### Get Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "_id": "6987a175067e09eb9809ce60",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user"
}
```

#### Update Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "john_updated",
  "email": "newemail@example.com"
}
```

#### Update Password
```http
PUT /users/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

---

### Order Management Endpoints

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "60d5ec49c1234567890abcde",
      "nameSnapshot": "Espresso",
      "priceSnapshot": 3.50,
      "quantity": 2
    }
  ],
  "totalPrice": 7.00
}
```

**Response (201)**:
```json
{
  "_id": "6987a4e9ff85f25ef2cacdb2",
  "userId": "6987a175067e09eb9809ce60",
  "items": [...],
  "totalPrice": 7.00,
  "status": "pending",
  "createdAt": "2026-02-07T20:47:27.463Z"
}
```

#### Get User's Orders
```http
GET /orders
Authorization: Bearer <token>
```

#### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <token>
```

#### Update Order Status
```http
PUT /orders/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Order
```http
DELETE /orders/:id
Authorization: Bearer <token>
```

---

### Admin Endpoints

#### List All Users
```http
GET /users
Authorization: Bearer <admin_token>
```

**Response (200)**:
```json
[
  {
    "_id": "697fa7518da9c500ad31e08e",
    "username": "zayniddin",
    "email": "zainiddin@gmail.com",
    "role": "user",
    "createdAt": "2026-02-01T19:19:45.891Z"
  },
  ...
]
```

#### Delete User (Admin Only)
```http
DELETE /users/:id
Authorization: Bearer <admin_token>
```

#### Get User's Orders (Admin)
```http
GET /users/:id/orders
Authorization: Bearer <admin_token>
```

#### Delete Order (Admin Only)
```http
DELETE /orders/:id/admin
Authorization: Bearer <admin_token>
```

#### Get Revenue & Orders (Admin Only)
```http
GET /analytics/revenue
Authorization: Bearer <admin_token>
```

**Response (200)**:
```json
{
  "totalRevenue": 156.50,
  "ordersCount": 23
}
```

---

## 🔒 Authentication & Security

### JWT Token Structure
```json
{
  "userId": "6987a175067e09eb9809ce60",
  "username": "john_doe",
  "role": "admin",
  "iat": 1707355200,
  "exp": 1707441600
}
```

### Password Security
- **Hash Algorithm**: bcrypt with 10 salt rounds
- **Strength Requirements**: Validated at registration and update
- **Example**: `pass: SecurePass123!`

### Protected Routes Flow
1. Client sends request with `Authorization: Bearer <token>`
2. `auth.middleware.js` extracts and verifies token
3. If valid, token payload (user data) attached to `req.user`
4. If invalid, returns 401 Unauthorized

### RBAC Flow
1. After auth middleware validates token, role middleware checks user role
2. `role("admin")` middleware verifies `req.user.role === "admin"`
3. If mismatch, returns 403 Forbidden
4. If match, request proceeds to controller

---

## 👨‍💼 Admin Dashboard

### Access
1. Register as admin via `/pages/AdminRegister.html` (phone: +7 format)
2. Login with admin credentials
3. Click **"Admin Dashboard"** in navigation

### Features
- **Analytics**: View total revenue and order count
- **User Management**: 
  - List all registered users
  - See each user's order count
  - Delete users and cascade to their orders
- **Order Management**:
  - View all orders across all users
  - See detailed order items
  - Delete orders by ID
- **Real-time Updates**: Dashboard refreshes when users/orders deleted

### Screenshots Description
The admin dashboard includes:
- Coffee-themed brown color scheme (#6f4e37, #a67c52)
- Professional table with hover effects
- Gradient headers for analytics cards
- Delete buttons with confirmation dialogs
- Responsive mobile layout

---


## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, 2-32 chars),
  email: String (unique, validated),
  password: String (bcrypt hashed),
  role: String (enum: ["user", "admin"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    nameSnapshot: String,
    priceSnapshot: Number,
    quantity: Number
  }],
  totalPrice: Number,
  status: String (enum: ["pending", "completed", "cancelled"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Collection
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  price: Number,
  imageUrl: String,
  description: String,
  inStock: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes
| Code | Meaning | Example |
|------|---------|---------|
| **200** | Success | GET request returns data |
| **201** | Created | User/order created |
| **400** | Bad Request | Invalid email format |
| **401** | Unauthorized | Missing/invalid token |
| **403** | Forbidden | User role ≠ admin |
| **404** | Not Found | User/order doesn't exist |
| **409** | Conflict | Duplicate username |
| **500** | Server Error | Database connection failed |

### Error Response Format
```json
{
  "message": "Email already in use",
  "status": 409
}
```

---

## 🎉 Summary of Coverage

| Requirement | Points | Status |
|------------|--------|--------|
| Project Setup | ✅ Complete |
| Database | ✅ Complete |
| API Endpoints | ✅ Complete |
| Authentication & Security | ✅ Complete |
| Validation & Error Handling | ✅ Complete |
| Deployment | ✅ Complete |
| RBAC (Advanced) | ✅ Complete |
| SMTP Email (Advanced) | Not implemented |


---

**Built with ❤️ using Node.js, Express, and MongoDB**

**Last Updated**: February 8, 2026  
**Version**: 1.0.0
