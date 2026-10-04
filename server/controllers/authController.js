const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const token = await authService.register(req.body);
    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    const token = typeof result === 'string' ? result : result.token;
    const user = result.user || null;
    res.json({ success: true, token, user });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.me = async (req, res) => {
  try {
      const userRepository = require('../repositories/userRepository');
      const user = await userRepository.findById(req.user.id);
      res.json({ success: true, data: user });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
}
