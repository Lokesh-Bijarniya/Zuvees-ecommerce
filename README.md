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
- [Improved Setup Instructions](#-improved-setup-instructions)
- [API Documentation](#-api-documentation)
- [Architecture Diagram](#-architecture-diagram)
- [Feature List](#-feature-list)
- [Screenshots & Demo](#-screenshots--demo)
- [More Improvements](#-more-improvements)

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

## Improved Setup Instructions

### Local Development
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lokesh-Bijarniya/Zuvees-ecommerce.git
   cd Zuvees-ecommerce
   ```
2. **Install dependencies:**
   - Backend:
     ```bash
     cd server && npm install
     ```
   - Frontend (Customer):
     ```bash
     cd ../client && npm install
     ```
   - Rider App:
     ```bash
     cd ../rider-app && npm install
     ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in `/server` and fill in all required fields (see below).
4. **Run the apps:**
   - Backend: `npm run dev` (in `/server`)
   - Frontend: `npm start` (in `/client`)
   - Rider App: `npm start` (in `/rider-app`)

### Production Deployment
1. Set up production `.env` variables (MongoDB Atlas, Cloudinary, OAuth, etc.).
2. Build frontend & rider-app:
   ```bash
   cd client && npm run build
   cd ../rider-app && npm run build
   ```
3. Deploy `/server`, `/client/build`, and `/rider-app/build` to your server or cloud provider (e.g., Render, Vercel, Netlify).

---

## API Documentation

- **Swagger UI:** [Not yet implemented] (Recommended: add `/api-docs` using `swagger-jsdoc` & `swagger-ui-express`)
- **Postman Collection:** [Download here](./docs/Zuvee-API.postman_collection.json) *(add this file to your repo!)*
- **Markdown Reference:**

### Example: Create Order
```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "items": [ ... ],
  "shippingAddress": { ... }
}
```

### Main Endpoints
| Method | Endpoint           | Description                  |
|--------|--------------------|------------------------------|
| POST   | /api/auth/google   | Google OAuth login           |
| GET    | /api/products      | List all products            |
| POST   | /api/orders        | Place new order              |
| PATCH  | /api/orders/:id    | Update order status          |
| ...    | ...                | ...                          |

---

## Architecture Diagram
- ![Architecture Diagram](./docs/architecture.png)
- *(Edit or export from [draw.io](https://app.diagrams.net/) or [Excalidraw](https://excalidraw.com/); place the image in `/docs`)*

---

## Feature List
- Product catalog, cart, checkout
- Google OAuth for all roles
- Admin dashboard for order/product management
- Rider PWA for delivery management
- Real-time notifications (Socket.io)
- Cloudinary image uploads
- Responsive, modern UI (Tailwind, framer-motion)
- ...and more!

---

## Screenshots & Demo
- ![Homepage Screenshot](./docs/screenshot-home.png)
- ![Admin Dashboard](./docs/screenshot-admin.png)
- ![Rider App](./docs/screenshot-rider.png)
- *(Add your own screenshots to `/docs`)*
- **Demo Video:** [YouTube Demo](https://youtu.be/your-demo-link) *(replace with your video link)*

---

## More Improvements
- [ ] Add Swagger UI at `/api-docs`
- [ ] Upload Postman collection and architecture diagram to `/docs`
- [ ] Add more screenshots and a short demo video/gif
- [ ] Keep this README up to date as features grow!

---

## Credits
- Built by [Lokesh Bijarniya](https://github.com/Lokesh-Bijarniya)
- Images provided by [Unsplash](https://unsplash.com/) (royalty-free)
- Special thanks to all open-source contributors!

---

## Questions?
Open an issue on [GitHub](https://github.com/Lokesh-Bijarniya/Zuvees-ecommerce/issues) or contact the maintainer.
