# ScholarHub - Backend API

Express.js backend server for the ScholarHub scholarship platform. Provides RESTful APIs for scholarship management, user authentication, applications, reviews, and payments.

**API Base URL:** `http://localhost:3000` (For localhost )

## 📋 Quick Links

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

## 🚀 Features

### Core Functionality

- **User Management**: Registration, login, profile updates
- **Scholarship CRUD**: Create, read, update, delete scholarships
- **Applications**: Submit and track scholarship applications
- **Review System**: Community reviews and ratings
- **Wishlist Management**: Save scholarships
- **Admin Dashboard**: Analytics and user management
- **Payment Processing**: Stripe integration
- **Contact Form**: User inquiries
- **Role-Based Access**: Student, Moderator, Admin roles
- **JWT Authentication**: Secure token-based auth

### Advanced Features

- **Email Verification**: Firebase email authentication
- **MongoDB Transactions**: Data consistency
- **Error Handling**: Comprehensive error responses
- **CORS Configuration**: Secure cross-origin requests
- **Pagination**: Efficient data retrieval

## 🛠️ Tech Stack

- **Runtime**: Node.js v16+
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB (Atlas or local)
- **Authentication**: Firebase Admin SDK
- **Payments**: Stripe API
- **Middleware**: CORS, dotenv
- **Port**: 3000 (configurable)

## 🚀 Getting Started

### Prerequisites

- Node.js v16+ and npm
- MongoDB account (Atlas recommended)
- Firebase project setup
- Stripe account
- Git

### Installation

1. **Clone repository:**

   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file:**

   ```env
   PORT=3000
   CLIENT_DOMAIN=http://localhost:5173
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scholarships
   FB_SERVICE_KEY={"type":"service_account","project_id":"your_project",...}
   STRIPE_SECRET_KEY=sk_test_yourconfigurationkey...
   NODE_ENV=development
   ```

3. **Start server:**
   ```bash
   npm run dev   # Development with nodemon
   npm start     # Production
   ```

Server runs on `http://localhost:3000`

## 📝 Environment Variables

| Variable            | Required | Example                                        |
| ------------------- | -------- | ---------------------------------------------- |
| `PORT`              | No       | 3000                                           |
| `CLIENT_DOMAIN`     | Yes      | http://localhost:5173                          |
| `MONGODB_URI`       | Yes      | mongodb+srv://user:pass@cluster.mongodb.net/db |
| `FB_SERVICE_KEY`    | Yes      | JSON firebase service key                      |
| `STRIPE_SECRET_KEY` | Yes      | sk*test*...                                    |
| `NODE_ENV`          | No       | development \| production                      |

## 🔗 API Endpoints

### Authentication

| Endpoint         | Method | Auth | Description       |
| ---------------- | ------ | ---- | ----------------- |
| `/auth/register` | POST   | No   | Register new user |
| `/auth/login`    | POST   | No   | Login user        |
| `/auth/verify`   | GET    | JWT  | Verify token      |

### Scholarships

| Endpoint            | Method | Auth  | Description            |
| ------------------- | ------ | ----- | ---------------------- |
| `/scholarships`     | GET    | No    | Get all scholarships   |
| `/scholarships/:id` | GET    | No    | Get single scholarship |
| `/top/scholarships` | GET    | No    | Get top 6 scholarships |
| `/scholarships`     | POST   | Admin | Create scholarship     |
| `/scholarships/:id` | PUT    | Admin | Update scholarship     |
| `/scholarships/:id` | DELETE | Admin | Delete scholarship     |

### Applications

| Endpoint                  | Method | Auth      | Description             |
| ------------------------- | ------ | --------- | ----------------------- |
| `/applications`           | GET    | Admin     | Get all applications    |
| `/my-applications/:email` | GET    | Student   | Get user's applications |
| `/apply-scholarship`      | POST   | Student   | Submit application      |
| `/applications/:id`       | PUT    | Moderator | Update app status       |
| `/applications/:id`       | DELETE | Student   | Cancel application      |

### Reviews

| Endpoint                  | Method | Auth        | Description                 |
| ------------------------- | ------ | ----------- | --------------------------- |
| `/reviews`                | GET    | No          | Get all reviews             |
| `/reviews/:scholarshipId` | GET    | No          | Get reviews for scholarship |
| `/reviews`                | POST   | Student     | Submit review               |
| `/reviews/:id`            | PUT    | Student/Mod | Update review               |
| `/reviews/:id`            | DELETE | Moderator   | Delete review               |

### Wishlist

| Endpoint                   | Method | Auth    | Description          |
| -------------------------- | ------ | ------- | -------------------- |
| `/wishlist/:email`         | GET    | Student | Get user's wishlist  |
| `/wishlist`                | POST   | Student | Add to wishlist      |
| `/wishlist/:scholarshipId` | DELETE | Student | Remove from wishlist |

### Users

| Endpoint             | Method | Auth    | Description      |
| -------------------- | ------ | ------- | ---------------- |
| `/users`             | GET    | Admin   | Get all users    |
| `/users/:email`      | GET    | Student | Get user profile |
| `/users/:email`      | PUT    | Student | Update profile   |
| `/users/:email/role` | PUT    | Admin   | Change user role |

### Contact

| Endpoint          | Method | Auth  | Description         |
| ----------------- | ------ | ----- | ------------------- |
| `/contact`        | POST   | No    | Submit contact form |
| `/admin/contacts` | GET    | Admin | Get all contacts    |

### Payments

| Endpoint                   | Method | Auth    | Description           |
| -------------------------- | ------ | ------- | --------------------- |
| `/create-checkout-session` | POST   | Student | Create Stripe session |
| `/payment-success`         | GET    | Student | Verify payment        |

## 📊 Database Schema

### Collections

**scholarships**

```javascript
{
  _id: ObjectId,
  universityName: String,
  universityLogo: String,
  scholarshipName: String,
  category: String,
  subject: [String],
  degree: String,
  tuitionFees: Number,
  country: String,
  postCity: String,
  postDate: Date,
  deadline: Date,
  description: String,
  requirements: [String],
  images: [String],
  rating: Number,
  reviewCount: Number,
  appliedCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**applications**

```javascript
{
  _id: ObjectId,
  scholarshipId: ObjectId,
  studentEmail: String,
  studentName: String,
  status: String, // pending, approved, rejected
  appliedDate: Date,
  degree: String,
  studyGap: String,
  experience: String,
  feedbackResponse: String,
  createdAt: Date
}
```

**reviews**

```javascript
{
  _id: ObjectId,
  scholarshipId: ObjectId,
  email: String,
  rating: Number,
  comment: String,
  status: String, // approved, pending
  helpfulCount: Number,
  createdAt: Date
}
```

**contacts**

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  status: String, // new, replied
  replied: Boolean,
  createdAt: Date
}
```

**wishlist**

```javascript
{
  _id: ObjectId,
  email: String,
  scholarshipId: ObjectId,
  addedAt: Date
}
```

**users**

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  photo: String,
  role: String, // student, moderator, admin
  joinedAt: Date,
  lastLogin: Date
}
```

## 🔐 Authentication & Authorization

### JWT Token Flow

1. User registers/logs in via Firebase
2. Frontend gets ID token from Firebase
3. Frontend sends token in Authorization header
4. Backend verifies token via Firebase Admin SDK
5. Routes use role middleware to authorize

### Role-Based Access

- **Student**: Apply, review, manage wishlist
- **Moderator**: Manage applications, approve reviews
- **Admin**: Full access, manage users & scholarships

## 📦 Dependencies

```json
{
  "express": "^5.1.0",
  "mongodb": "^6.5.0",
  "firebase-admin": "^12.0.0",
  "stripe": "^14.13.0",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5"
}
```

## 🌍 Deployment

### To Vercel

1. **Connect GitHub** to Vercel
2. **Select backend folder**
3. **Set environment variables** in Vercel dashboard
4. **Deploy** - automatic on push to main

### To Render/Railway

1. Create account on platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy from `backend` directory

### To AWS/Azure

1. Create Node.js app instance
2. Connect MongoDB
3. Set environment variables
4. Deploy via Git or CLI

## 🐛 Error Handling

All errors return consistent format:

```javascript
{
  success: false,
  message: "Error description",
  error: {} // Optional details
}
```

**Common Status Codes:**

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## 📝 Logging & Debugging

### Production Cleanup

- All debug console.logs removed
- Error logging via error handlers
- Request logging middleware available

### Development

```env
NODE_ENV=development  # Shows detailed errors
```

## 🚀 Performance Optimization

- MongoDB indexing on frequently queried fields
- Pagination for large datasets
- Query optimization with projections
- Connection pooling via MongoDB driver

## 🐛 Troubleshooting

### MongoDB Connection Failed

- Verify MONGODB_URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### Firebase Auth Error

- Verify FB_SERVICE_KEY JSON format
- Check Firebase project ID matches
- Verify email is registered in Firebase

### Stripe Payment Failed

- Verify STRIPE*SECRET_KEY format (sk_test* or sk*live*)
- Check Stripe account has payment permission
- Verify test cards: 4242 4242 4242 4242

### CORS Issues

- Update CLIENT_DOMAIN in `.env`
- For Netlify frontend, use production URL
- Verify origin header matches CLIENT_DOMAIN

## 📞 Support

- API Documentation: Available in frontend README
- Issues: Check error responses with status codes
- Debugging: Enable development mode in `.env`

## 📄 License

Educational project for assignment purposes.
