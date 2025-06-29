const pool = require("../config/db");

exports.addToCart = async (req, res) => {
  const { user_id, product_id, quantity, size, bought = false } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes: user_id, product_id ou quantity",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO cart (user_id, product_id, quantity, size, bought, is_deleted)
       VALUES ($1, $2, $3, $4, $5, false)
       RETURNING *`,
      [user_id, product_id, quantity, size, bought]
    );

    res.status(201).json({
      message: "Item adicionado ao carrinho com sucesso",
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao adicionar item ao carrinho:", error);
    res.status(500).json({
      message: "Erro ao adicionar item ao carrinho",
      error,
    });
  }
};

exports.getCartItems = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT cart.id, cart.product_id, cart.quantity, cart.size, cart.bought, 
              products.name, products.price, products.image
       FROM cart
       JOIN products ON cart.product_id = products.id
       WHERE cart.user_id = $1 AND cart.is_deleted = false AND cart.bought = false
       ORDER BY cart.id ASC`,
      [user_id]
    );

    res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error("Erro ao buscar itens do carrinho:", error);
    res.status(500).json({
      message: "Erro ao buscar itens do carrinho",
      error,
    });
  }
};

exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity, size, bought } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cart
       SET 
         quantity = COALESCE($1, quantity),
         size = COALESCE($2, size),
         bought = COALESCE($3, bought)
       WHERE id = $4 AND is_deleted = false
       RETURNING *`,
      [quantity, size, bought, id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Item não encontrado no carrinho" });
    }

    res.status(200).json({
      message: "Item do carrinho atualizado com sucesso",
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar item no carrinho:", error);
    res.status(500).json({
      message: "Erro ao atualizar item no carrinho",
      error,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE cart SET is_deleted = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Item não encontrado no carrinho" });
    }

    res.status(200).json({ message: "Item removido do carrinho com sucesso" });
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    res.status(500).json({
      message: "Erro ao remover item do carrinho",
      error,
    });
  }
};

exports.getBoughtItems = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cart.id, cart.product_id, cart.quantity, cart.size, cart.user_id, 
              products.name, products.price, products.image
       FROM cart
       JOIN products ON cart.product_id = products.id
       WHERE cart.is_deleted = false AND cart.bought = true
       ORDER BY cart.id ASC`
    );
    res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error("Erro ao buscar itens comprados:", error);
    res.status(500).json({
      message: "Erro ao buscar itens comprados",
      error,
    });
  }
};

exports.clearCart = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE cart
       SET is_deleted = true
       WHERE user_id = $1 AND is_deleted = false AND bought = false
       RETURNING *`,
      [user_id]
    );

    res.status(200).json({
      message: "Carrinho limpo com sucesso",
      deletedCount: result.rowCount,
    });
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error);
    res.status(500).json({
      message: "Erro ao limpar carrinho",
      error,
    });
  }
};

exports.markCartAsBought = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE cart
       SET bought = true
       WHERE user_id = $1 AND is_deleted = false AND bought = false
       RETURNING *`,
      [user_id]
    );

    res.status(200).json({
      message: "Itens do carrinho marcados como comprados",
      updatedCount: result.rowCount,
      items: result.rows,
    });
  } catch (error) {
    console.error("Erro ao marcar itens como comprados:", error);
    res.status(500).json({
      message: "Erro ao marcar itens como comprados",
      error,
    });
  }
};
