const pool = require('../config/db');

// Criar items para uma venda
exports.addSaleItems = async (req, res) => {
  const { sale_id, items } = req.body;

  try {
    if (!sale_id || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: 'ID da venda ou items inválidos/ausentes' });
    }

    for (const item of items) {
      await pool.query(
        `INSERT INTO sale_items 
         (sale_id, product_id, quantity, unit_price, total_price) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          sale_id,
          item.product_id,
          item.quantity,
          item.unit_price,
          item.unit_price * item.quantity,
        ]
      );
    }

    res.status(201).json({ message: 'Itens da venda adicionados com sucesso' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Erro ao adicionar itens da venda', error });
  }
};

// Atualizar um item específico de uma venda
exports.updateSaleItem = async (req, res) => {
  const { id } = req.params;
  const { quantity, unit_price } = req.body;

  try {
    const total_price = unit_price * quantity;

    const result = await pool.query(
      `UPDATE sale_items 
       SET quantity = $1, unit_price = $2, total_price = $3 
       WHERE id = $4 
       RETURNING *`,
      [quantity, unit_price, total_price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    res
      .status(200)
      .json({ message: 'Item atualizado com sucesso', item: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar item da venda', error });
  }
};

// Remover um item
exports.deleteSaleItem = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM sale_items WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    res.status(200).json({ message: 'Item removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover item da venda', error });
  }
};
