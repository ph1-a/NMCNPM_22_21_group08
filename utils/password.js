const bcrypt = require('bcrypt');

module.exports = {
  hashPassword: async (password) => await bcrypt.hash(password, 10),
  comparePassword: async (raw, hash) => await bcrypt.compare(raw, hash)
};
