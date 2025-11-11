const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', apiLimiter, auth, getProfile);
router.put('/profile', apiLimiter, auth, updateProfile);

module.exports = router;
