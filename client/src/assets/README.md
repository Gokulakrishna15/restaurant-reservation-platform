# 🍴 FoodieHub - Restaurant Reservation Platform

A complete MERN stack web application for discovering restaurants, making reservations, leaving reviews, and managing dining experiences.

## ✨ Features

- **🔍 Search & Filter**: Find restaurants by cuisine, location, price range, dietary options, and special features
- **📅 Reservation System**: Book tables with real-time availability checking and prevent double bookings
- **⭐ User Reviews**: Leave ratings, comments, and photos on restaurants you've visited
- **💳 Stripe Payment**: Secure payment integration for reservations
- **👨‍💼 Admin Dashboard**: Manage restaurants, view all reservations and reviews
- **🔐 JWT Authentication**: Secure user authentication with role-based access
- **📱 Responsive Design**: Mobile-friendly interface built with TailwindCSS

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Payment**: Stripe
- **Database**: MongoDB Atlas
- **Deployment**: Netlify (Frontend), Render (Backend)

## 📦 Installation

### Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Update with your credentials
npm start
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📝 Environment Variables

Create `.env` files in both `server` and `client` folders:

## 🎯 Usage

1. **Register** a new account
2. **Browse** restaurants and filter by preferences
3. **Make Reservation** and proceed to payment
4. **Leave Reviews** after visiting
5. **View Recommendations** based on your activity
6. **Admin Access** for managing restaurants (if admin)

## 📚 API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Restaurants Endpoints
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/search?cuisine=...&location=...` - Search restaurants
- `POST /api/restaurants` - Create restaurant (admin)
- `PUT /api/restaurants/:id` - Update restaurant (admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (admin)

### Reservations Endpoints
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/my` - Get user's reservations
- `GET /api/reservations` - Get all reservations (admin)
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Cancel reservation

### Reviews Endpoints
- `POST /api/reviews` - Create review
- `GET /api/reviews/restaurant/:id` - Get restaurant reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PUT /api/reviews/:id/respond` - Respond to review (admin)

## 🔐 Security

- Passwords hashed with bcryptjs
- JWT tokens with 7-day expiration
- Role-based access control (User/Admin)
- Protected routes and API endpoints
- Secure payment processing with Stripe
- Environment variables for sensitive data

## 📄 License

This project is open-source and available under the MIT License.

## 👨‍💻 Author

Created as an assessment project for restaurant reservation platform development.

---

**Happy coding! 🚀**