const sequelize = require('./database');
const { User, Order, OrderItem } = require('../models');
const { hashPassword } = require('../utils/password');

// Define associations
Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Sync all models with the database
sequelize.sync({ force: true }) // Set force: true to drop existing tables
  .then(async () => {
    console.log('Database synchronized successfully');
    
    // Create test user
    const hashedPassword = await hashPassword('password123');
    await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    });
    
    console.log('Test user created successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
    process.exit(1);
  }); 