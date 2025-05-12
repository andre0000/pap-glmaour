const pool = require('../config/db');

exports.addProduct = async (req, res) => {
  const { name, description, price, stock, supplier_id } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock, supplier_id]
    );

    const newProduct = result.rows[0];
    res
      .status(201)
      .json({ message: 'Produto adicionado com sucesso', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar produto', error });
  }
};

exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, supplier_id } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, supplier_id = $5 WHERE id = $6 AND is_deleted = false RETURNING *',
      [name, description, price, stock, supplier_id, id]
    );

    const updatedProduct = result.rows[0];
    if (!updatedProduct)
      return res.status(404).json({
        message: 'Produto não encontrado ou foi marcado como deletado',
      });

    res.status(200).json({
      message: 'Produto atualizado com sucesso',
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao editar produto', error });
  }
};
