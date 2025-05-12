const pool = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter = require('../config/email');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, is_admin',
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];
    res
      .status(201)
      .json({ message: 'Usuário registrado com sucesso', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    const user = result.rows[0];

    if (!user)
      return res.status(404).json({ message: 'Usuário não encontrado' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = NOW() + INTERVAL '1 hour' WHERE id = $2",
      [resetToken, user.id]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: user.email,
      subject: 'Redefinir senha - Glamour',
      html: `<p>Clique <a href="${resetLink}">aqui</a> para redefinir sua senha.</p>`,
    });

    res.status(200).json({ message: 'E-mail enviado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar', error });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );

    const user = result.rows[0];
    if (!user)
      return res.status(400).json({ message: 'Token inválido ou expirado' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [hashed, user.id]
    );

    res.status(200).json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao redefinir senha', error });
  }
};
