# Zuvee's E-Commerce Platform

A full-stack, scalable, and modern e-commerce platform for selling fans and air conditioners, featuring Google OAuth authentication, admin dashboard, and a dedicated rider app. Built with React.js, Node.js, Express, and MongoDB.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts & Commands](#scripts--commands)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Admin & Rider Panel](#admin--rider-panel)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Product Catalog**: Fans and ACs with multiple color/size variants, images, and features
- **Google OAuth Authentication**: Secure sign-in for users, admins, and riders
- **Role-Based Access**: Admin, Rider, and Customer roles
- **Shopping Cart & Checkout**: Add to cart, view cart, and checkout (mock payment)
- **Order Management**: Place orders, track status, and admin/rider order management
- **Admin Dashboard**: Manage products, orders, and riders
- **Rider PWA**: Progressive Web App for riders to manage deliveries
- **Responsive UI**: Built with React.js and Tailwind CSS, with modern animations (framer-motion)
- **Cloudinary Integration**: All product images are uploaded to Cloudinary for reliability

---

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, framer-motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Google OAuth 2.0
- **Cloud Storage**: Cloudinary
- **Other**: Axios, dotenv, passport, JWT, Admin dashboard, PWA for riders

---

## Project Structure
```
zuvee-2/
├── client/                # React frontend
├── rider-app/             # Rider PWA frontend
├── server/                # Node.js/Express backend
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/           # Local images for seeding
│   ├── .env               # Environment variables
│   ├── package.json
│   └── ...
└── README.md
```

---

## Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/Lokesh-Bijarniya/Zuvees-ecommerce.git
cd Zuvees-ecommerce
```

### 2. **Install Dependencies**
- **Backend**
  ```bash
  cd server
  npm install
  ```
- **Frontend (Customer)**
  ```bash
  cd ../client
  npm install
  ```
- **Rider App**
  ```bash
  cd ../rider-app
  npm install
  ```

### 3. **Setup Environment Variables**
- Copy `.env.example` to `.env` in `/server` and fill in your credentials:
  ```env
  PORT=5050
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  CLIENT_URL=http://localhost:3000
  RIDER_URL=http://localhost:3000
  GOOGLE_CALLBACK_URL=http://localhost:5050/api/auth/google/callback
  CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
  CLOUDINARY_API_KEY=your_cloudinary_api_key
  CLOUDINARY_API_SECRET=your_cloudinary_api_secret
  ```

---

## Scripts & Commands
- **Start Backend (dev):** `npm run dev` (in `/server`)
- **Start Frontend:** `npm start` (in `/client`)
- **Start Rider App:** `npm start` (in `/rider-app`)
- **Destroy Data:** `node utils/seeder.js -d` (in `/server`)

---

## Authentication
- **Google OAuth** is used for all users (customers, admins, riders)
- Only pre-approved emails can log in (see `approvedEmails` in the seeder)
- JWT is used for API authentication

---

## API Endpoints (Backend)
- `/api/products` — Product listing, detail, create, update, delete
- `/api/orders` — Create order, get orders, update status
- `/api/users` — User management
- `/api/auth` — Google OAuth login
- `/api/admin` — Admin-specific routes
- `/api/rider` — Rider-specific routes

---

## Admin & Rider Panel
- **Admin Dashboard:**
  - View and manage all products, orders, and riders
  - Change order status, assign riders
- **Rider App (PWA):**
  - Riders log in with Google
  - View assigned orders, update status (delivered/undelivered)
  - Mobile-responsive

---

## Deployment
- Update `.env` with production credentials
- Build frontend and rider-app for production:
  ```bash
  cd client && npm run build
  cd ../rider-app && npm run build
  ```
- Deploy `/server`, `/client/build`, and `/rider-app/build` to your production server or cloud platform

---

## Contributing
Pull requests are welcome! Please open an issue first to discuss your ideas or report bugs.

---

## License
[MIT](LICENSE)

---

## Credits
- Built by [Lokesh Bijarniya](https://github.com/Lokesh-Bijarniya)
- Images provided by [Unsplash](https://unsplash.com/) (royalty-free)
- Special thanks to all open-source contributors!

---

## Questions?
Open an issue on [GitHub](https://github.com/Lokesh-Bijarniya/Zuvees-ecommerce/issues) or contact the maintainer.
# Zuvees-ecommerce
# Zuvees-ecommerce
# Zuvees-ecommerce
# Zuvees-ecommerce
# Zuvees-ecommerce
# Zuvees-ecommerce
