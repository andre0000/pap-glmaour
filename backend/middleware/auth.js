const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res
      .status(403)
      .json({ message: 'Acesso negado: administrador apenas' });
  }
  next();
};
