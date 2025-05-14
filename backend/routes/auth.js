const express = require('express');
const router = express.Router();
const {
  login,
  register,
  forgotPassword,
  resetPassword,
} = require('../controller/auth');
const { verifyToken } = require('../middleware/auth');
const { updateProfile } = require('../controller/auth');

router.post('/login', login);
router.post('/reset-password/:token', resetPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/register', register);
router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Autenticado!', user: req.user });
});
router.put('/update-profile', verifyToken, updateProfile);

module.exports = router;
