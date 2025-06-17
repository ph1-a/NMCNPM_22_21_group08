const User = require('../models/User');

module.exports = {
  createUser: async (userData) => await User.create(userData),
  findUserByEmail: async (email) => await User.findOne({ where: { email } })
};
