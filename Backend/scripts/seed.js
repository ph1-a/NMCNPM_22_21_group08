const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { hashPassword } = require('../utils/password');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

function runAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function seed() {
  const now = new Date().toISOString();

  // Users
  const users = [
    { id: uuidv4(), email: 'alice@example.com', password: await hashPassword('password123'), name: 'Alice' },
    { id: uuidv4(), email: 'bob@example.com', password: await hashPassword('password123'), name: 'Bob' },
    { id: uuidv4(), email: 'carol@example.com', password: await hashPassword('password123'), name: 'Carol' },
  ];
  for (const u of users) {
    await runAsync('INSERT INTO Users (id, email, password, name, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)', [u.id, u.email, u.password, u.name, now, now]);
  }

  // Restaurants
  const restaurants = [
    { id: uuidv4(), name: 'Ocean Delight', description: 'Seafood specialist', location: 'Downtown' },
    { id: uuidv4(), name: 'Pizza Palace', description: 'Best pizza in town', location: 'Uptown' },
    { id: uuidv4(), name: 'Sushi House', description: 'Fresh sushi', location: 'Midtown' },
  ];
  for (const r of restaurants) {
    await runAsync('INSERT INTO Restaurants (id, name, description, location, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)', [r.id, r.name, r.description, r.location, now, now]);
  }

  // MenuItems
  const baseUrl = 'http://10.0.2.2:3000/images/';
  const menuitems = [
    { id: uuidv4(), name: 'Grilled Salmon', category: 'Seafood', price: 10.99, rating: 4.5, reviewCount: 3, distance: 1.2, image: baseUrl + 'food (1).jpg', description: 'Fresh Atlantic salmon grilled to perfection.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Pepperoni Pizza', category: 'Pizza', price: 8.99, rating: 4.7, reviewCount: 2, distance: 2.5, image: baseUrl + 'food (2).jpg', description: 'Classic pepperoni pizza.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Tuna Sushi', category: 'Sushi', price: 12.5, rating: 4.8, reviewCount: 1, distance: 0.8, image: baseUrl + 'food (3).jpg', description: 'Fresh tuna sushi.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Pad Thai', category: 'Thai', price: 11.99, rating: 4.6, reviewCount: 4, distance: 1.5, image: baseUrl + 'food (4).jpg', description: 'Classic Thai stir-fried noodles with peanuts.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Chicken Tikka Masala', category: 'Indian', price: 13.99, rating: 4.7, reviewCount: 5, distance: 2.1, image: baseUrl + 'food (5).jpg', description: 'Grilled chicken in spiced curry sauce.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Beef Pho', category: 'Vietnamese', price: 9.99, rating: 4.5, reviewCount: 6, distance: 1.8, image: baseUrl + 'food (6).jpg', description: 'Traditional Vietnamese noodle soup.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Greek Salad', category: 'Mediterranean', price: 8.99, rating: 4.4, reviewCount: 3, distance: 1.3, image: baseUrl + 'food (7).jpg', description: 'Fresh salad with feta and olives.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Korean BBQ Ribs', category: 'Korean', price: 16.99, rating: 4.8, reviewCount: 7, distance: 2.2, image: baseUrl + 'food (8).jpg', description: 'Marinated beef ribs with side dishes.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Vegan Curry', category: 'Indian', price: 10.99, rating: 4.3, reviewCount: 4, distance: 1.6, image: baseUrl + 'food (9).jpg', description: 'Mixed vegetables in spiced curry sauce.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Miso Ramen', category: 'Japanese', price: 12.99, rating: 4.7, reviewCount: 5, distance: 1.4, image: baseUrl + 'food (10).jpg', description: 'Traditional Japanese noodle soup.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Falafel Wrap', category: 'Middle Eastern', price: 7.99, rating: 4.5, reviewCount: 6, distance: 2.0, image: baseUrl + 'food (11).jpg', description: 'Crispy chickpea patties in pita.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Shrimp Pad See Ew', category: 'Thai', price: 13.99, rating: 4.6, reviewCount: 4, distance: 1.7, image: baseUrl + 'food (12).jpg', description: 'Stir-fried wide rice noodles with shrimp.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Chicken Shawarma', category: 'Middle Eastern', price: 9.99, rating: 4.7, reviewCount: 8, distance: 1.9, image: baseUrl + 'food (13).jpg', description: 'Marinated chicken with garlic sauce.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Bibimbap', category: 'Korean', price: 11.99, rating: 4.8, reviewCount: 5, distance: 2.3, image: baseUrl + 'food (14).jpg', description: 'Korean rice bowl with vegetables.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Tom Yum Soup', category: 'Thai', price: 8.99, rating: 4.5, reviewCount: 4, distance: 1.5, image: baseUrl + 'food (15).jpg', description: 'Spicy and sour Thai soup.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Hummus Plate', category: 'Middle Eastern', price: 7.99, rating: 4.4, reviewCount: 6, distance: 1.8, image: baseUrl + 'food (16).jpg', description: 'Creamy chickpea dip with pita.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Kimchi Fried Rice', category: 'Korean', price: 10.99, rating: 4.6, reviewCount: 5, distance: 2.1, image: baseUrl + 'food (17).jpg', description: 'Fried rice with fermented vegetables.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Green Curry', category: 'Thai', price: 12.99, rating: 4.7, reviewCount: 7, distance: 1.6, image: baseUrl + 'food (18).jpg', description: 'Coconut curry with vegetables.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Baklava', category: 'Dessert', price: 5.99, rating: 4.8, reviewCount: 9, distance: 1.4, image: baseUrl + 'food (19).jpg', description: 'Sweet pastry with honey and nuts.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Mango Sticky Rice', category: 'Dessert', price: 6.99, rating: 4.9, reviewCount: 6, distance: 2.0, image: baseUrl + 'food (20).jpg', description: 'Sweet sticky rice with fresh mango.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Matcha Ice Cream', category: 'Dessert', price: 4.99, rating: 4.7, reviewCount: 8, distance: 1.7, image: baseUrl + 'food (21).jpg', description: 'Green tea flavored ice cream.', restaurantId: restaurants[2].id }
  ];
  for (const m of menuitems) {
    await runAsync('INSERT INTO MenuItems (id, name, category, price, rating, reviewCount, distance, image, description, restaurantId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [m.id, m.name, m.category, m.price, m.rating, m.reviewCount, m.distance, m.image, m.description, m.restaurantId, now, now]);
  }

  // Reviews
  const reviews = [
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[0].id, username: 'Alice', userInitial: 'A', comment: 'Amazing salmon! Perfectly cooked.', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[0].id, username: 'Bob', userInitial: 'B', comment: 'Great taste and fresh ingredients.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[1].id, username: 'Carol', userInitial: 'C', comment: 'Best pizza ever!', rating: 5 },
  ];
  for (const r of reviews) {
    await runAsync('INSERT INTO Reviews (id, userId, menuItemId, username, userInitial, comment, rating, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [r.id, r.userId, r.menuItemId, r.username, r.userInitial, r.comment, r.rating, now, now]);
  }

  // Orders
  const orders = [
    { id: uuidv4(), userId: users[0].id, restaurantId: restaurants[0].id, address: '123 Main St', status: 'Pending', total: 10.99 },
    { id: uuidv4(), userId: users[1].id, restaurantId: restaurants[1].id, address: '456 Oak Ave', status: 'Paid', total: 8.99 },
    { id: uuidv4(), userId: users[2].id, restaurantId: restaurants[2].id, address: '789 Pine Rd', status: 'Pending', total: 12.5 },
  ];
  for (const o of orders) {
    await runAsync('INSERT INTO Orders (id, userId, restaurantId, address, status, total, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [o.id, o.userId, o.restaurantId, o.address, o.status, o.total, now, now]);
  }

  // Transactions
  const transactions = [
    { id: uuidv4(), orderId: orders[0].id, paymentMethod: 'Credit Card', amount: 10.99, status: 'Completed' },
    { id: uuidv4(), orderId: orders[1].id, paymentMethod: 'PayPal', amount: 8.99, status: 'Completed' },
    { id: uuidv4(), orderId: orders[2].id, paymentMethod: 'Credit Card', amount: 12.5, status: 'Pending' },
  ];
  for (const t of transactions) {
    await runAsync('INSERT INTO Transactions (id, orderId, paymentMethod, amount, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)', [t.id, t.orderId, t.paymentMethod, t.amount, t.status, now, now]);
  }

  db.close();
  console.log('Database seeded successfully!');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  db.close();
}); 