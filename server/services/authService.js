const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      ...userData,
      password: hashedPassword
    };

    const user = await userRepository.create(newUser);
    return this.generateToken(user);
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user);
  }

  generateToken(user) {
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret_token', { expiresIn: '1d' });
  }
}

module.exports = new AuthService();
