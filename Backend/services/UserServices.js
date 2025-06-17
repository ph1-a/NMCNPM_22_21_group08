const { createUser, findUserByEmail } = require('../repositories/UserRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = {
  register: async ({ email, password, name }) => {
    const existing = await findUserByEmail(email);
    if (existing) throw new Error('Email already in use');
    const hashed = await hashPassword(password);
    const user = await createUser({ email, password: hashed, name });
    return { id: user.id, email: user.email, name: user.name };
  },

  login: async ({ email, password }) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const match = await comparePassword(password, user.password);
    if (!match) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }
};
