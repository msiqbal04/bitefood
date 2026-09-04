# 🍔 BiteFood – Full-Stack Food Delivery Platform

BiteFood is a modern, responsive, mobile-first food delivery web application built with the MERN stack and TypeScript. Inspired by platforms like Swiggy and Zomato, it delivers end-to-end workflows including restaurant menu discovery, smart cart calculations, coupon discounts, simulated multi-channel payments, and administrative controls.

---

## 🚀 Live Demo

- **Frontend App**: [https://bitefood-rosy.vercel.app](https://bitefood-rosy.vercel.app)
- **Backend API**: [https://bitefoodbackend.onrender.com](https://bitefoodbackend.onrender.com)

---

## ✨ Features

- **Storefront & Menus**: Filter restaurants by cuisines, ratings, and dietary preferences (Veg/Non-Veg). Real-time dish stock availability and category indicators.
- **Smart Cart & Billing**: Slide-out billing drawer computing item subtotals, packaging, delivery fees, and automated 5% kitchen taxes.
- **Coupon Engine**: Apply promotional codes like `BITEFOOD` and `WELCOME20` for instant discounts.
- **Simulated Payment Gateways**: Multiple checkout modes including Cash on Delivery (COD), UPI (GPay, PhonePe, Paytm, custom VPA), and card payments with validation delays.
- **Order Tracking**: Seamless dispatch of orders into persistent state with live status tags.
- **Admin Dashboard**: Partner controls to inspect system stats, update order status, and toggle item stock in real time.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (TypeScript) via Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios (with JWT interceptors)
- **Routing**: React Router DOM (v6)
- **Hosting**: Vercel

### Backend
- **Runtime**: Node.js & Express.js (TypeScript runtime via `tsx`)
- **Database**: MongoDB Atlas via Mongoose ODM
- **Security**: JSON Web Tokens (JWT), CORS, bcryptjs
- **Hosting**: Render

---

## 📂 Project Architecture

```text
biteffood/
├── backend/
│   ├── src/
│   │   ├── config/         # Database & environment configurations
│   │   ├── controllers/    # Route controllers (Auth, Restaurant, Order, Menu, Admin)
│   │   ├── middleware/     # Auth, Admin, Upload, & Error handlers
│   │   ├── models/         # Mongoose Schemas (User, Restaurant, Order, etc.)
│   │   ├── routes/         # Express endpoint declarations
│   │   ├── scripts/        # Database seed scripts
│   │   ├── app.ts          # Express application setup
│   │   └── server.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React Context providers (CartContext, AuthContext)
│   │   ├── pages/          # Route views (Home, RestaurantPage, Orders, Admin)
│   │   ├── services/       # Axios API instances & service functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md

cd ../frontend
npm install

Setup Frontend
# Start frontend development server
npm run dev

Setup Backend
cd backend
npm install

# Seed the database with initial restaurant & menu items
npx tsx src/scripts/seed.ts

# Start backend development server
npm run dev