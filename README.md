# 🏠 Property Rental & Booking Platform

A modern, secure, and responsive **Property Rental & Booking Platform** that connects **Property Owners** with **Tenants** through an easy-to-use online rental marketplace. Users can discover rental properties, book them securely, pay reservation fees online, manage bookings, leave reviews, and access personalized dashboards based on their roles.

> Designed with a clean UI, secure authentication, role-based access control, Stripe payments, and an intuitive user experience.

---

## 🌐 Live Website

🔗 **Live Site:** https://rent-client-five.vercel.app/

## 💻 Client Repository

🔗 

## ⚙️ Server Repository

🔗 



# ✨ Features

## 🔐 Authentication

- Email & Password Authentication
- Google Social Login
- JWT Authentication
- Protected Routes
- Persistent Login after Refresh
- Role-Based Authorization

---

## 👥 User Roles

### 🏠 Tenant

- Browse all approved properties
- Search properties by location
- Filter by property type
- Sort by price
- View property details
- Add property to Favorites
- Book rental property
- Secure Stripe payment
- View booking history
- Leave ratings & reviews
- Manage profile

---

### 🏡 Property Owner

- Owner Analytics Dashboard
- Add Property
- Update Property
- Delete Property
- View Booking Requests
- Approve/Reject Bookings
- View Monthly Earnings Chart
- Track Total Earnings
- View Admin Rejection Feedback

---

### 👑 Admin

- Manage Users
- Change User Roles
- Approve Properties
- Reject Properties
- Update Properties
- Delete Properties
- Monitor Bookings
- View Transactions
- Moderate Platform

---

# 🚀 Main Features

### 🏠 Home Page

- Beautiful Hero Banner
- Property Search
- Featured Properties
- Customer Reviews
- Why Choose Us
- Recently Added Properties
- Top Rental Locations
- Responsive Layout
- Smooth Framer Motion Animations

---

### 🏢 Property Management

- Add Property
- Update Property
- Delete Property
- Property Approval Workflow
- Pending / Approved / Rejected Status
- Admin Feedback System

---

### ❤️ Favorites

- Save Favorite Properties
- Remove Favorites
- Database Stored Favorites

---

### 📅 Booking System

- Booking Modal
- Move-in Date
- Contact Information
- Additional Notes
- Booking Status
- Payment Status

---

### 💳 Online Payment

- Stripe Payment Gateway
- Reservation Fee Payment
- Transaction History
- Payment Success Page

---

### ⭐ Review System

- Give Rating
- Write Review
- Dynamic Review Display
- Review Date
- Reviewer Information

---

### 📊 Dashboard Analytics

Owner Dashboard includes

- Total Earnings
- Total Properties
- Total Bookings
- Monthly Earnings Line Chart (Recharts)

---

### 🔍 Advanced Search & Filtering

Backend Search & Filtering

Search by

- Location

Filter by

- Property Type

Sort by

- Price Low → High
- Price High → Low

---

### 📄 Pagination

Implemented on multiple pages including:

- All Properties
- Admin Property Management

---

### ⚠️ Error Handling

- Custom 404 Page
- Loading Spinner
- Error Boundary
- Protected Route Handling

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router DOM
- Tailwind CSS
- DaisyUI
- Axios
- Firebase Authentication
- React Hook Form
- Framer Motion
- React Icons
- React Hot Toast
- SweetAlert2
- Recharts
- Stripe
- React Helmet Async

---

## Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Stripe API
- Cookie Parser
- CORS
- dotenv

---

# 📦 NPM Packages

## Client

```json
axios
firebase
framer-motion
react
react-dom
react-router-dom
react-hook-form
react-hot-toast
sweetalert2
react-icons
react-helmet-async
recharts
@stripe/react-stripe-js
@stripe/stripe-js
```

---

## Server

```json
express
mongodb
jsonwebtoken
cookie-parser
cors
dotenv
stripe
```

---



---

# 🔐 Environment Variables

## Client (.env)

```env
VITE_API_URL=

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_STRIPE_PUBLISHABLE_KEY=
```

---

## Server (.env)

```env
PORT=

DB_USER=
DB_PASS=

JWT_SECRET=

STRIPE_SECRET_KEY=
```

---

# ⚙️ Installation Guide

## Clone Client

```bash
git clone https://github.com/your-username/property-rental-client.git
```

```bash
cd property-rental-client
```

```bash
npm install
```

```bash
npm run dev
```

---

## Clone Server

```bash
git clone https://github.com/your-username/property-rental-server.git
```

```bash
cd property-rental-server
```

```bash
npm install
```

```bash
npm run start
```

---

# 🔄 Workflow

## Tenant

```
Register/Login

↓

Browse Properties

↓

View Details

↓

Add Favorite

↓

Book Property

↓

Stripe Payment

↓

Booking Created

↓

Leave Review
```

---

## Owner

```
Login

↓

Add Property

↓

Admin Approval

↓

Receive Booking

↓

Approve Booking

↓

Receive Payment

↓

View Earnings
```

---

## Admin

```
Login

↓

Manage Users

↓

Approve Properties

↓

Monitor Bookings

↓

View Transactions

↓

Manage Platform
```

---

# 📊 Dashboard Modules

## Tenant Dashboard

- My Bookings
- Favorites
- Profile

---

## Owner Dashboard

- Analytics
- Add Property
- My Properties
- Booking Requests

---

## Admin Dashboard

- All Users
- All Properties
- All Bookings
- Transactions

---

# 🔒 Security Features

- JWT Authentication
- Protected APIs
- Role-Based Authorization
- Firebase Authentication
- Environment Variables
- MongoDB Credentials Protection
- Secure Payment Integration
- CORS Protection

---

# 🎨 UI Highlights

- Modern Design
- Fully Responsive
- Recruiter-Friendly Layout
- Equal Card Heights
- Smooth Animations
- Beautiful Dashboard
- Accessible Color Contrast
- Consistent Typography
- Loading States
- Custom Error Pages

---

# 📱 Responsive Design

Supports

- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

---

# 🚀 Future Improvements

- Property Map Integration
- Wishlist Sharing
- Chat Between Owner & Tenant
- Email Notifications
- Push Notifications
- AI Property Recommendation
- Dark Mode
- Rental Agreement PDF
- Multi-language Support

---

# 👨‍💻 Author

### Sushanta Ranjan Sushil

Frontend Developer

📧 Email: sushantarsushil@gmail.com

🌐 GitHub: https://github.com/sushantarsushil-hub


---

# ⭐ Support

If you like this project, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.

---

## 📄 License

This project is developed for educational purposes and portfolio showcase.
