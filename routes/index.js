//API route for sign up and sign in
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

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
const searchRoutes = require('./routes/searchRoutes');
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
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

