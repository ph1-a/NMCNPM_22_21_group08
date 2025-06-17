const express = require('express');
const router = express.Router();
const userRoutes = require('./UserRoutes');
const searchRoutes = require('./SearchRoutes');
const orderRoutes = require('./OrderRoutes');

// User routes
router.use('/users', userRoutes);

// Search routes
router.use('/search', searchRoutes);

// Order routes
router.use('/orders', orderRoutes);

module.exports = router;

//API route for sign up and sign in
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
//Usage

//POST /api/users/signup
//POST /api/users/signin
//{
//  "email": "user@example.com",
//  "password": "secure123"
//}

//API route for search
app.use('/api/search', searchRoutes);

//Usage
//{
//  "restaurants": [
//    { "id": "...", "name": "Sushi House", "description": "...", "location": "..." }
//  ],
//  "foods": [
//   { "id": "...", "name": "Tuna Sushi", "category": "Japanese", "price": 12.5, //"Restaurant": { ... } }
//  ]
//}

//API Route for order
app.use('/api/orders', orderRoutes);

