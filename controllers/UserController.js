const UserService = require('../services/UserService');

module.exports = {
  signUp: async (req, res) => {
    try {
      const user = await UserService.register(req.body);
      res.status(201).json({ user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  signIn: async (req, res) => {
    try {
      const result = await UserService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
};
