const pool = require('../config/db');

// Criar items para uma venda
exports.addSaleItem = async (req, res) => {
  const { product_id, quantity, unit_price } = req.body;

  try {
    if (!product_id || !quantity || !unit_price) {
      return res.status(400).json({
        message:
          'Campos obrigatórios ausentes: product_id, quantity ou unit_price',
      });
    }

    const total_price = quantity * unit_price;

    const result = await pool.query(
      `INSERT INTO sale_items (product_id, quantity, unit_price, total_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [product_id, quantity, unit_price, total_price]
    );

    res.status(201).json({
      message: 'Item de venda adicionado com sucesso',
      item: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    res.status(500).json({
      message: 'Erro ao adicionar item de venda',
      error,
    });
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
      `UPDATE sale_items 
       SET is_deleted = true 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    res.status(200).json({ message: 'Item marcado como removido com sucesso' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Erro ao marcar item como removido', error });
  }
};

// Obter todos os itens de venda
exports.getSaleItems = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM sale_items WHERE is_deleted = false`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum item encontrado' });
    }

    res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error('Erro ao buscar itens de venda:', error);
    res.status(500).json({
      message: 'Erro ao buscar itens de venda',
      error,
    });
  }
};

// Obter um item de venda específico
exports.getSaleItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM sale_items WHERE id = $1 AND is_deleted = false`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    res.status(200).json({ item: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar item de venda:', error);
    res.status(500).json({
      message: 'Erro ao buscar item de venda',
      error,
    });
  }
};
