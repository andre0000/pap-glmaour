const pool = require('../db');

exports.createSale = async (req, res) => {
  const { user_id, products } = req.body; // Products is an array of { product_id, quantity }

  try {
    const total = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const discount = 0; // Can be added if needed
    const finalTotal = total - discount;

    const result = await pool.query(
      'INSERT INTO sales (user_id, total, discount, final_total) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, total, discount, finalTotal]
    );

    const sale = result.rows[0];

    // Insert Sale Items
    for (const item of products) {
      await pool.query(
        'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5)',
        [
          sale.id,
          item.product_id,
          item.quantity,
          item.price,
          item.price * item.quantity,
        ]
      );
    }

    res.status(201).json({ message: 'Venda criada com sucesso', sale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar venda', error });
  }
};

exports.editSale = async (req, res) => {
  const { id } = req.params;
  const { user_id, products } = req.body; // Products is an array of { product_id, quantity }

  try {
    const total = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const discount = 0; // Can be adjusted if needed
    const finalTotal = total - discount;

    // Update Sale
    const result = await pool.query(
      'UPDATE sales SET user_id = $1, total = $2, discount = $3, final_total = $4 WHERE id = $5 RETURNING *',
      [user_id, total, discount, finalTotal, id]
    );

    const updatedSale = result.rows[0];
    if (!updatedSale)
      return res.status(404).json({ message: 'Venda não encontrada' });

    // Delete existing sale items
    await pool.query('DELETE FROM sale_items WHERE sale_id = $1', [id]);

    // Insert updated Sale Items
    for (const item of products) {
      await pool.query(
        'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5)',
        [
          updatedSale.id,
          item.product_id,
          item.quantity,
          item.price,
          item.price * item.quantity,
        ]
      );
    }

    res
      .status(200)
      .json({ message: 'Venda atualizada com sucesso', sale: updatedSale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao editar venda', error });
  }
};
