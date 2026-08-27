# 🎓 ScholarStream – Scholarship Management Platform

ScholarStream is a full-stack **MERN-based Scholarship Management Platform** designed to connect students with scholarship opportunities from universities and organizations.

The platform allows students to discover scholarships, view detailed information, apply for scholarships, make application payments, track their applications, and submit reviews. Administrators and moderators can manage scholarships, users, applications, reviews, and platform analytics.

---

## 🌐 Live Website

**Live Site:** https://scholarship-management-portal-flax.vercel.app/

**Repository:** https://github.com/Saiful-104/scholarship-management-system

---

## 📌 Project Purpose

Finding suitable scholarships can be difficult because scholarship information is often scattered across different websites.

**ScholarStream** provides a centralized platform where students can easily:

* 🔍 Search for scholarships
* 🎓 Explore scholarship opportunities
* 📄 View complete scholarship details
* 💳 Apply and pay application fees
* 📊 Track application status
* ⭐ Submit scholarship reviews

At the same time, administrators and moderators can efficiently manage the entire scholarship application process.

---

## ✨ Key Features

### 👨‍🎓 Student Features

* User registration and login
* Google social login
* Student role assigned automatically after registration
* Browse all available scholarships
* Search scholarships by:

  * Scholarship Name
  * University Name
  * Degree
* Filter scholarships by:

  * Country
  * Scholarship Category
  * Subject Category
* Sort scholarships by:

  * Application Fee
  * Post Date
* Server-side pagination
* View detailed scholarship information
* Apply for scholarships
* Secure Stripe payment integration
* View payment success/failure status
* Track application status
* Edit pending applications
* Delete pending applications
* Add reviews after application completion
* Edit and delete personal reviews
* View personal profile
* Responsive dashboard

---

### 👨‍💼 Admin Features

* Admin dashboard
* View profile
* Add new scholarships
* Update scholarships
* Delete scholarships
* Manage all users
* Filter users by role
* Promote or demote users
* Delete users
* View platform analytics
* View total users
* View total scholarships
* View total fees collected
* Visual charts and graphs

---

### 🧑‍💻 Moderator Features

* Moderator dashboard
* View profile
* Manage student applications
* View complete application details
* Provide feedback to students
* Update application status
* Change status to:

  * Pending
  * Processing
  * Completed
  * Rejected
* Manage student reviews
* Delete inappropriate reviews

---

## 💳 Payment System

ScholarStream uses **Stripe** for secure scholarship application payments.

### Payment Flow

1. Student selects a scholarship.
2. Student clicks **Apply for Scholarship**.
3. Student is redirected to the checkout page.
4. Student completes the Stripe payment.
5. Successful payment saves the application with:

   * `paymentStatus: paid`
   * `applicationStatus: pending`
6. Student is redirected to the Payment Success page.
7. If payment fails, the application remains unpaid and the student can retry the payment from the dashboard.

---

## 🔐 Authentication & Security

* Firebase Authentication
* Google Social Login
* JWT-based API authentication
* Protected private routes
* Role-based authorization
* Admin middleware
* Moderator middleware
* Firebase configuration secured using environment variables
* MongoDB credentials secured using environment variables

---

## 🗂️ Main Collections

The application uses MongoDB with the following main collections:

### Users

Stores user information such as:

* Name
* Email
* Photo URL
* Role

Roles:

* Student
* Moderator
* Admin

### Scholarships

Stores scholarship information including:

* Scholarship Name
* University Name
* University Image
* Country
* City
* World Ranking
* Subject Category
* Scholarship Category
* Degree
* Tuition Fees
* Application Fees
* Service Charge
* Application Deadline
* Scholarship Post Date
* Posted User Email

### Applications

Stores student application information including:

* Scholarship ID
* User ID
* Student information
* University information
* Application fees
* Service charge
* Application status
* Payment status
* Application date
* Moderator feedback

### Reviews

Stores scholarship reviews including:

* Scholarship ID
* University Name
* Student Name
* Student Email
* Student Image
* Rating
* Review Comment
* Review Date

---

## 🧭 Main Pages

* Home
* All Scholarships
* Scholarship Details
* Login
* Register
* Checkout
* Payment Success
* Payment Failed
* Dashboard
* 404 Error Page

---

## 🏠 Home Page

The home page includes:

* Hero/Banner section
* Scholarship search button
* Top 6 scholarships
* Scholarship cards
* Framer Motion animations
* Success Stories / Testimonials
* FAQ / Contact section

---

## 📚 Scholarship Browsing

The **All Scholarships** page provides:

* Responsive scholarship grid
* Search functionality
* Category filters
* Country filters
* Sorting
* Server-side pagination
* Scholarship cards
* Scholarship details navigation

Each scholarship card displays important information such as:

* University Image
* University Name
* Scholarship Category
* Location
* Application Fee
* View Details button

---

## 📊 Dashboard

ScholarStream provides separate dashboard experiences based on user roles.

### Student Dashboard

* My Profile
* My Applications
* Application Details
* Edit Application
* Pay Application Fee
* Delete Pending Application
* Add Review
* My Reviews

### Moderator Dashboard

* My Profile
* Manage Applications
* Application Details
* Feedback Management
* Application Status Management
* Review Management

### Admin Dashboard

* My Profile
* Add Scholarship
* Manage Scholarships
* Manage Users
* Role Management
* Analytics

---

## 🛠️ Technology Stack

### Frontend

* React.js
* React Router
* Axios
* Tailwind CSS
* DaisyUI
* Firebase Authentication
* Framer Motion
* Recharts
* SweetAlert2

### Backend

* Node.js
* Express.js
* MongoDB
* JSON Web Token (JWT)
* Stripe

### Deployment

* Vercel
* Firebase

---

## 📦 Important NPM Packages

### Client-side

```bash
npm install react react-dom react-router-dom
npm install axios
npm install firebase
npm install framer-motion
npm install sweetalert2
npm install recharts
npm install lucide-react
npm install daisyui
```

### Server-side

```bash
npm install express
npm install mongodb
npm install cors
npm install dotenv
npm install jsonwebtoken
npm install stripe
```

> Package list should be updated if additional packages are used in the final project.

---

## ⚙️ Environment Variables

### Client

Create a `.env` file in the client project:

```env
VITE_API_URL=your_server_api_url

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Server

Create a `.env` file in the server project:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
```

**Never commit `.env` files or secret credentials to GitHub.**

---

## 🚀 Installation & Setup

### 1. Clone the Client Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
cd client
```

### 2. Install Client Dependencies

```bash
npm install
```

### 3. Configure Client Environment Variables

Create a `.env` file and add the required Firebase and API configuration.

### 4. Start the Client

```bash
npm run dev
```

---

### 5. Clone the Server Repository

```bash
git clone YOUR_SERVER_REPOSITORY_URL
cd server
```

### 6. Install Server Dependencies

```bash
npm install
```

### 7. Configure Server Environment Variables

Create a `.env` file and add MongoDB, JWT and Stripe credentials.

### 8. Start the Server

```bash
npm run dev
```

---

## 🔒 Role-Based Access Control

ScholarStream has three different user roles:

| Role      | Main Responsibilities                                     |
| --------- | --------------------------------------------------------- |
| Student   | Browse, apply, pay, track applications and submit reviews |
| Moderator | Manage applications, feedback, statuses and reviews       |
| Admin     | Manage users, scholarships and platform analytics         |

Protected API routes use JWT verification and role-based middleware.

---

## 🔎 Search, Filter, Sort & Pagination

ScholarStream implements server-side:

* Search by scholarship name
* Search by university name
* Search by degree
* Filter by country
* Filter by scholarship category
* Sort by application fee
* Sort by post date
* Pagination

This improves performance and provides a better user experience when working with a large number of scholarships.

---

## 📱 Responsive Design

The platform is designed to work across:

* 📱 Mobile devices
* 📲 Tablets
* 💻 Laptops
* 🖥️ Desktop screens

The UI maintains consistent:

* Typography
* Spacing
* Button styles
* Card sizes
* Alignment
* Color theme

---

## 🎨 UI & UX

ScholarStream focuses on a clean and recruiter-friendly interface.

Key design principles:

* Unique visual design
* Consistent typography
* Proper spacing
* Balanced layouts
* Responsive components
* Equal card dimensions
* Accessible navigation
* Loading states
* Custom 404 page

The project uses **DaisyUI** as the primary UI component framework.

---

## ⏳ Loading & Error Handling

The application provides:

* Loading spinners
* Skeleton loaders
* API error handling
* Payment error handling
* Custom 404 error page
* Protected route handling

---

## 🔮 Future Improvements

Potential future improvements include:

* 🤖 AI-powered scholarship recommendations
* ❤️ Scholarship wishlist
* 📧 Email notifications
* 🔔 Application status notifications
* 📱 Mobile application
* 📈 Advanced admin analytics
* 🔎 More advanced scholarship filtering
* 🌍 Multi-language support

---

## 👨‍💻 Developer

**Saiful Islam & shihab**

Computer Science & Engineering Student

---

## 📄 License

This project was developed for educational and portfolio purposes.

---

⭐ **If you find ScholarStream useful, consider giving the repository a star!**
