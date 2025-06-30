const express = require('express');
const router = express.Router();
const LoginUser = require('../Models/Login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const exist = await LoginUser.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already registered" });

    // Hash the password before saving
    const hashed = await bcrypt.hash(password, 10);

    const newUser = new LoginUser({ email, password: hashed });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Server error during registration",
      error: err.message,
    });
  }
});

// LOGIN route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await LoginUser.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid Email" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Create JWT token with user ID
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error during login",
      error: err.message,
    });
  }
});

module.exports = router;
