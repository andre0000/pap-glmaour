const express = require('express');
const router = express.Router();
const pool = require('../config/db');
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
router.get('/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, is_admin, pfp FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ message: 'Erro interno', error: err });
  }
});

router.put('/update-profile', verifyToken, updateProfile);

module.exports = router;
