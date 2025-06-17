const sequelize = require('./config/database');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const Review = require('./models/Review');
const Transaction = require('./models/Transaction');

async function initDatabase() {
  try {
    // Sync all models with the database
    await sequelize.sync({ force: true }); // This will drop all tables and recreate them
    console.log('Database tables created successfully');

    // Run the seed script
    require('./scripts/seed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDatabase(); 