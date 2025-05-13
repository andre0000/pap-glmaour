const pool = require('../config/db');

// Adicionar item ao carrinho
exports.addToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({
        message:
          'Campos obrigatórios ausentes: user_id, product_id ou quantity',
      });
    }

    const result = await pool.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, product_id, quantity]
    );

    res.status(201).json({
      message: 'Item adicionado ao carrinho com sucesso',
      item: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    res.status(500).json({
      message: 'Erro ao adicionar item ao carrinho',
      error,
    });
  }
};

// Obter todos os itens do carrinho de um usuário
exports.getCartItems = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1 AND is_deleted = false`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Carrinho vazio' });
    }

    res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error('Erro ao buscar itens do carrinho:', error);
    res.status(500).json({
      message: 'Erro ao buscar itens do carrinho',
      error,
    });
  }
};

// Atualizar quantidade de um item no carrinho
exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cart
       SET quantity = $1
       WHERE id = $2 AND is_deleted = false
       RETURNING *`,
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'Item não encontrado no carrinho' });
    }

    res.status(200).json({
      message: 'Quantidade do item no carrinho atualizada com sucesso',
      item: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar item no carrinho:', error);
    res.status(500).json({
      message: 'Erro ao atualizar item no carrinho',
      error,
    });
  }
};

// Remover um item do carrinho
exports.removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE cart 
       SET is_deleted = true 
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: 'Item não encontrado no carrinho' });
    }

    res.status(200).json({ message: 'Item removido do carrinho com sucesso' });
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    res.status(500).json({
      message: 'Erro ao remover item do carrinho',
      error,
    });
  }
};
