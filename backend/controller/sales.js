const pool = require('../config/db');

exports.createSale = async (req, res) => {
  const { discount = 0, product_id } = req.body;

  try {
    if (!product_id) {
      return res
        .status(400)
        .json({ message: 'Produto do desconto é obrigatório' });
    }

    // Buscar o preço do produto para calcular desconto
    const resultProduct = await pool.query(
      'SELECT price FROM products WHERE id = $1',
      [product_id]
    );

    const product = resultProduct.rows[0];
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const originalPrice = parseFloat(product.price);
    const discountPercent = discount / 100;
    const finalTotal = originalPrice - originalPrice * discountPercent;

    const result = await pool.query(
      `INSERT INTO sales (total, discount, final_total, product_id) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
      [originalPrice, discountPercent, finalTotal, product_id]
    );

    const sale = result.rows[0];

    res.status(201).json({
      message: 'Desconto adicionado com sucesso à venda',
      sale,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erro ao adicionar desconto à venda',
      error,
    });
  }
};

exports.editSale = async (req, res) => {
  const { id } = req.params;
  const { discount = 0, product_id } = req.body;

  try {
    if (!product_id) {
      return res
        .status(400)
        .json({ message: 'Produto do desconto é obrigatório' });
    }

    // Buscar o preço original do produto
    const resultProduct = await pool.query(
      'SELECT price FROM products WHERE id = $1',
      [product_id]
    );

    const product = resultProduct.rows[0];
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const originalPrice = parseFloat(product.price);
    const discountPercent = discount / 100;
    const finalTotal = originalPrice - originalPrice * discountPercent;

    const result = await pool.query(
      `UPDATE sales 
         SET total = $1, discount = $2, final_total = $3, product_id = $4 
         WHERE id = $5 
         RETURNING *`,
      [originalPrice, discountPercent, finalTotal, product_id, id]
    );

    const updatedSale = result.rows[0];
    if (!updatedSale) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }

    res.status(200).json({
      message: 'Desconto da venda atualizado com sucesso',
      sale: updatedSale,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erro ao atualizar o desconto da venda',
      error,
    });
  }
};
