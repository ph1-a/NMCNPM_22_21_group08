const UserServices = require('../services/UserServices');

module.exports = {
  signUp: async (req, res) => {
    try {
      console.log('SignUp request received:', req.body);
      const user = await UserServices.register(req.body);
      console.log('SignUp successful:', user);
      res.status(201).json({ user });
    } catch (err) {
      console.error('SignUp error:', err);
      res.status(400).json({ error: err.message });
    }
  },

  signIn: async (req, res) => {
    try {
      console.log('SignIn request received:', req.body);
      const result = await UserServices.login(req.body);
      console.log('SignIn successful:', result);
      res.status(200).json(result);
    } catch (err) {
      console.error('SignIn error:', err);
      res.status(401).json({ error: err.message });
    }
  }
};
