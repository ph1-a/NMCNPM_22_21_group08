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

  // Users (same as original)
  const users = [
    { id: uuidv4(), email: 'alice@example.com', password: await '123321', name: 'Alice' },
    { id: uuidv4(), email: 'bob@example.com', password: await hashPassword('password123'), name: 'Bob' },
    { id: uuidv4(), email: 'carol@example.com', password: await hashPassword('password123'), name: 'Carol' },
  ];
  for (const u of users) {
    await runAsync('INSERT INTO Users (id, email, password, name, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)', [u.id, u.email, u.password, u.name, now, now]);
  }

  // Restaurants (same as original)
  const restaurants = [
    { id: uuidv4(), name: 'Ocean Delight', description: 'Seafood specialist', location: 'Downtown' },
    { id: uuidv4(), name: 'Pizza Palace', description: 'Best pizza in town', location: 'Uptown' },
    { id: uuidv4(), name: 'Sushi House', description: 'Fresh sushi', location: 'Midtown' },
  ];
  for (const r of restaurants) {
    await runAsync('INSERT INTO Restaurants (id, name, description, location, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)', [r.id, r.name, r.description, r.location, now, now]);
  }

  // MenuItems (same as original)
  const menuitems = [
    { id: uuidv4(), name: 'Grilled Salmon', category: 'Seafood', price: 10.99, rating: 4.5, reviewCount: 3, distance: 1.2, image: 'food(1).jpg', description: 'Fresh Atlantic salmon grilled to perfection.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Pepperoni Pizza', category: 'Pizza', price: 8.99, rating: 4.7, reviewCount: 2, distance: 2.5, image: 'food(2).jpg', description: 'Classic pepperoni pizza.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Tuna Sushi', category: 'Sushi', price: 12.5, rating: 4.8, reviewCount: 1, distance: 0.8, image: 'food(3).jpg', description: 'Fresh tuna sushi.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Pad Thai', category: 'Thai', price: 11.99, rating: 4.6, reviewCount: 4, distance: 1.5, image: 'food(4).jpg', description: 'Classic Thai stir-fried noodles with peanuts.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Chicken Tikka Masala', category: 'Indian', price: 13.99, rating: 4.7, reviewCount: 5, distance: 2.1, image: 'food(5).jpg', description: 'Grilled chicken in spiced curry sauce.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Beef Pho', category: 'Vietnamese', price: 9.99, rating: 4.5, reviewCount: 6, distance: 1.8, image: 'food(6).jpg', description: 'Traditional Vietnamese noodle soup.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Greek Salad', category: 'Mediterranean', price: 8.99, rating: 4.4, reviewCount: 3, distance: 1.3, image: 'food(7).jpg', description: 'Fresh salad with feta and olives.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Korean BBQ Ribs', category: 'Korean', price: 16.99, rating: 4.8, reviewCount: 7, distance: 2.2, image: 'food(8).jpg', description: 'Marinated beef ribs with side dishes.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Vegan Curry', category: 'Indian', price: 10.99, rating: 4.3, reviewCount: 4, distance: 1.6, image: 'food(9).jpg', description: 'Mixed vegetables in spiced curry sauce.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Miso Ramen', category: 'Japanese', price: 12.99, rating: 4.7, reviewCount: 5, distance: 1.4, image: 'food(10).jpg', description: 'Traditional Japanese noodle soup.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Falafel Wrap', category: 'Middle Eastern', price: 7.99, rating: 4.5, reviewCount: 6, distance: 2.0, image: 'food(11).jpg', description: 'Crispy chickpea patties in pita.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Shrimp Pad See Ew', category: 'Thai', price: 13.99, rating: 4.6, reviewCount: 4, distance: 1.7, image: 'food(12).jpg', description: 'Stir-fried wide rice noodles with shrimp.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Chicken Shawarma', category: 'Middle Eastern', price: 9.99, rating: 4.7, reviewCount: 8, distance: 1.9, image: 'food(13).jpg', description: 'Marinated chicken with garlic sauce.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Bibimbap', category: 'Korean', price: 11.99, rating: 4.8, reviewCount: 5, distance: 2.3, image: 'food(14).jpg', description: 'Korean rice bowl with vegetables.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Tom Yum Soup', category: 'Thai', price: 8.99, rating: 4.5, reviewCount: 4, distance: 1.5, image: 'food(15).jpg', description: 'Spicy and sour Thai soup.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Hummus Plate', category: 'Middle Eastern', price: 7.99, rating: 4.4, reviewCount: 6, distance: 1.8, image: 'food(16).jpg', description: 'Creamy chickpea dip with pita.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Kimchi Fried Rice', category: 'Korean', price: 10.99, rating: 4.6, reviewCount: 5, distance: 2.1, image: 'food(17).jpg', description: 'Fried rice with fermented vegetables.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Green Curry', category: 'Thai', price: 12.99, rating: 4.7, reviewCount: 7, distance: 1.6, image: 'food(18).jpg', description: 'Coconut curry with vegetables.', restaurantId: restaurants[2].id },
    { id: uuidv4(), name: 'Baklava', category: 'Dessert', price: 5.99, rating: 4.8, reviewCount: 9, distance: 1.4, image: 'food(19).jpg', description: 'Sweet pastry with honey and nuts.', restaurantId: restaurants[0].id },
    { id: uuidv4(), name: 'Mango Sticky Rice', category: 'Dessert', price: 6.99, rating: 4.9, reviewCount: 6, distance: 2.0, image: 'food(20).jpg', description: 'Sweet sticky rice with fresh mango.', restaurantId: restaurants[1].id },
    { id: uuidv4(), name: 'Matcha Ice Cream', category: 'Dessert', price: 4.99, rating: 4.7, reviewCount: 8, distance: 1.7, image: 'food(21).jpg', description: 'Green tea flavored ice cream.', restaurantId: restaurants[2].id }
  ];
  for (const m of menuitems) {
    await runAsync('INSERT INTO MenuItems (id, name, category, price, rating, reviewCount, distance, image, description, restaurantId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [m.id, m.name, m.category, m.price, m.rating, m.reviewCount, m.distance, m.image, m.description, m.restaurantId, now, now]);
  }

  // Reviews (three reviews per menu item)
  const reviews = [
    // Grilled Salmon
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[0].id, username: 'Alice', userInitial: 'A', comment: 'The Grilled Salmon was perfectly cooked with a crispy exterior!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[0].id, username: 'Bob', userInitial: 'B', comment: 'Fresh and flavorful salmon, great seasoning.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[0].id, username: 'Carol', userInitial: 'C', comment: 'Loved the salmon, but the portion could be larger.', rating: 4 },
    // Pepperoni Pizza
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[1].id, username: 'Alice', userInitial: 'A', comment: 'Best pizza ever! Crispy crust and gooey cheese.', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[1].id, username: 'Bob', userInitial: 'B', comment: 'Really tasty pizza, generous pepperoni!', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[1].id, username: 'Carol', userInitial: 'C', comment: 'Solid pizza, but a bit greasy for my taste.', rating: 4 },
    // Tuna Sushi
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[2].id, username: 'Alice', userInitial: 'A', comment: 'Super fresh tuna sushi, melts in your mouth!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[2].id, username: 'Bob', userInitial: 'B', comment: 'Great sushi, very clean flavors.', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[2].id, username: 'Carol', userInitial: 'C', comment: 'Tasty, but I prefer more wasabi on the side.', rating: 4 },
    // Pad Thai
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[3].id, username: 'Alice', userInitial: 'A', comment: 'Perfect balance of sweet and spicy in this Pad Thai!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[3].id, username: 'Bob', userInitial: 'B', comment: 'Really good noodles, peanuts add nice crunch.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[3].id, username: 'Carol', userInitial: 'C', comment: 'Tasty, but could use more veggies.', rating: 4 },
    // Chicken Tikka Masala
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[4].id, username: 'Alice', userInitial: 'A', comment: 'Creamy and flavorful tikka masala, love it!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[4].id, username: 'Bob', userInitial: 'B', comment: 'Spices were spot on, great with naan.', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[4].id, username: 'Carol', userInitial: 'C', comment: 'Good, but a bit too spicy for me.', rating: 4 },
    // Beef Pho
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[5].id, username: 'Alice', userInitial: 'A', comment: 'Amazing broth, so comforting and flavorful!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[5].id, username: 'Bob', userInitial: 'B', comment: 'Great pho, fresh herbs make it pop.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[5].id, username: 'Carol', userInitial: 'C', comment: 'Tasty, but the beef was a bit chewy.', rating: 4 },
    // Greek Salad
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[6].id, username: 'Alice', userInitial: 'A', comment: 'Fresh and crisp salad, feta is amazing!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[6].id, username: 'Bob', userInitial: 'B', comment: 'Great salad, olives add nice tang.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[6].id, username: 'Carol', userInitial: 'C', comment: 'Nice, but could use more dressing.', rating: 4 },
    // Korean BBQ Ribs
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[7].id, username: 'Alice', userInitial: 'A', comment: 'These ribs are to die for! So tender!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[7].id, username: 'Bob', userInitial: 'B', comment: 'Loved the marinade, sides were great too.', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[7].id, username: 'Carol', userInitial: 'C', comment: 'Tasty, but a bit pricey for the portion.', rating: 4 },
    // Vegan Curry
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[8].id, username: 'Alice', userInitial: 'A', comment: 'Delicious vegan curry, full of flavor!', rating: 4 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[8].id, username: 'Bob', userInitial: 'B', comment: 'Great veggie mix, spices were perfect.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[8].id, username: 'Carol', userInitial: 'C', comment: 'Good, but I prefer a creamier curry.', rating: 4 },
    // Miso Ramen
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[9].id, username: 'Alice', userInitial: 'A', comment: 'Perfect ramen, broth is so rich!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[9].id, username: 'Bob', userInitial: 'B', comment: 'Really tasty, noodles were perfect.', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[9].id, username: 'Carol', userInitial: 'C', comment: 'Great, but could use more toppings.', rating: 4 },
    // Falafel Wrap
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[10].id, username: 'Alice', userInitial: 'A', comment: 'Crispy falafel, love the pita!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[10].id, username: 'Bob', userInitial: 'B', comment: 'Tasty wrap, great for a quick meal.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[10].id, username: 'Carol', userInitial: 'C', comment: 'Good, but the sauce was a bit mild.', rating: 4 },
    // Shrimp Pad See Ew
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[11].id, username: 'Alice', userInitial: 'A', comment: 'Shrimp was perfectly cooked, so flavorful!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[11].id, username: 'Bob', userInitial: 'B', comment: 'Great noodles, shrimp adds nice touch.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[11].id, username: 'Carol', userInitial: 'C', comment: 'Tasty, but a bit too oily for me.', rating: 4 },
    // Chicken Shawarma
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[12].id, username: 'Alice', userInitial: 'A', comment: 'Amazing shawarma, garlic sauce is perfect!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[12].id, username: 'Bob', userInitial: 'B', comment: 'Really juicy chicken, great spices.', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[12].id, username: 'Carol', userInitial: 'C', comment: 'Good, but I wanted more veggies in it.', rating: 4 },
    // Bibimbap
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[13].id, username: 'Alice', userInitial: 'A', comment: 'Love the colorful veggies in this bibimbap!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[13].id, username: 'Bob', userInitial: 'B', comment: 'Great mix of flavors, sauce is amazing.', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[13].id, username: 'Carol', userInitial: 'C', comment: 'Tasty, but rice was a bit dry.', rating: 4 },
    // Tom Yum Soup
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[14].id, username: 'Alice', userInitial: 'A', comment: 'Perfect spicy and sour balance in this soup!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[14].id, username: 'Bob', userInitial: 'B', comment: 'Really refreshing, great flavors.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[14].id, username: 'Carol', userInitial: 'C', comment: 'Good, but a bit too spicy for me.', rating: 4 },
    // Hummus Plate
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[15].id, username: 'Alice', userInitial: 'A', comment: 'Creamy hummus, pita was so soft!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[15].id, username: 'Bob', userInitial: 'B', comment: 'Great appetizer, very fresh.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[15].id, username: 'Carol', userInitial: 'C', comment: 'Nice, but could use more olive oil.', rating: 4 },
    // Kimchi Fried Rice
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[16].id, username: 'Alice', userInitial: 'A', comment: 'Kimchi adds such a great kick to this rice!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[16].id, username: 'Bob', userInitial: 'B', comment: 'Really tasty, love the tangy flavor.', rating: 4 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[16].id, username: 'Carol', userInitial: 'C', comment: 'Good, but a bit too spicy for my taste.', rating: 4 },
    // Green Curry
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[17].id, username: 'Alice', userInitial: 'A', comment: 'Creamy and spicy, this curry is perfect!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[17].id, username: 'Bob', userInitial: 'B', comment: 'Great veggie curry, nice coconut flavor.', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[17].id, username: 'Carol', userInitial: 'C', comment: 'Tasty, but could use more heat.', rating: 4 },
    // Baklava
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[18].id, username: 'Alice', userInitial: 'A', comment: 'So sweet and crunchy, love this baklava!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[18].id, username: 'Bob', userInitial: 'B', comment: 'Great dessert, honey is perfect.', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[18].id, username: 'Carol', userInitial: 'C', comment: 'Really sweet, maybe too much for me.', rating: 4 },
    // Mango Sticky Rice
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[19].id, username: 'Alice', userInitial: 'A', comment: 'Perfect dessert, mango is so fresh!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[19].id, username: 'Bob', userInitial: 'B', comment: 'Sweet and sticky, great combo.', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[19].id, username: 'Carol', userInitial: 'C', comment: 'Tasty, but the rice was a bit heavy.', rating: 4 },
    // Matcha Ice Cream
    { id: uuidv4(), userId: users[0].id, menuItemId: menuitems[20].id, username: 'Alice', userInitial: 'A', comment: 'Love the matcha flavor, so creamy!', rating: 5 },
    { id: uuidv4(), userId: users[1].id, menuItemId: menuitems[20].id, username: 'Bob', userInitial: 'B', comment: 'Great ice cream, perfect end to a meal.', rating: 5 },
    { id: uuidv4(), userId: users[2].id, menuItemId: menuitems[20].id, username: 'Carol', userInitial: 'C', comment: 'Nice, but I prefer a stronger matcha taste.', rating: 4 }
  ];
  for (const r of reviews) {
    await runAsync('INSERT INTO Reviews (id, userId, menuItemId, username, userInitial, comment, rating, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [r.id, r.userId, r.menuItemId, r.username, r.userInitial, r.comment, r.rating, now, now]);
  }

  // Orders (same as original)
  const orders = [
    { id: uuidv4(), userId: users[0].id, restaurantId: restaurants[0].id, address: '123 Main St', status: 'Pending', total: 10.99 },
    { id: uuidv4(), userId: users[1].id, restaurantId: restaurants[1].id, address: '456 Oak Ave', status: 'Paid', total: 8.99 },
    { id: uuidv4(), userId: users[2].id, restaurantId: restaurants[2].id, address: '789 Pine Rd', status: 'Pending', total: 12.5 },
  ];
  for (const o of orders) {
    await runAsync('INSERT INTO Orders (id, userId, restaurantId, address, status, total, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [o.id, o.userId, o.restaurantId, o.address, o.status, o.total, now, now]);
  }

  // Transactions (same as original)
  const transactions = [
    { id: uuidv4(), orderId: orders[0].id, paymentMethod: 'Credit Card', amount: 10.99, status: 'Completed' },
    { id: uuidv4(), orderId: orders[1].id, paymentMethod: 'PayPal', amount: 8.99, status: 'Completed' },
    { id: uuidv4(), orderId: orders[2].id, paymentMethod: 'Credit Card', amount: 12.5, status: 'Pending' },
  ];
  for (const t of transactions) {
    await runAsync('INSERT INTO Transactions (id, orderId, paymentMethod, amount, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)', [t.id, t.orderId, t.paymentMethod, t.amount, t.status, now, now]);
  }
}

seed().catch(err => {
  console.error('Seeding error:', err);
  db.close();
});