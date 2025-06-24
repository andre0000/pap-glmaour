const pool = require("../config/db");

exports.addProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    supplier_id,
    image,
    capotype,
    sub_type,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price, stock, supplier_id, image, type, sub_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, description, price, stock, supplier_id, image, type, sub_type]
    );

    const newProduct = result.rows[0];
    res
      .status(201)
      .json({ message: "Produto adicionado com sucesso", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar produto", error });
  }
};

exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, supplier_id, type, sub_type } =
    req.body;

  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, stock = $4, supplier_id = $5, type = $6, sub_type = $7 WHERE id = $8 AND is_deleted = false RETURNING *",
      [name, description, price, stock, supplier_id, type, sub_type, id]
    );

    const updatedProduct = result.rows[0];
    if (!updatedProduct)
      return res.status(404).json({
        message: "Produto não encontrado ou foi marcado como deletado",
      });

    res.status(200).json({
      message: "Produto atualizado com sucesso",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao editar produto", error });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE is_deleted = false ORDER BY name DESC"
    );

    const products = result.rows;

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos", error });
  }
};

exports.softDeleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE products SET is_deleted = true WHERE id = $1 RETURNING *",
      [id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res
      .status(200)
      .json({ message: "Produto removido (soft delete) com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao remover produto", error });
  }
};
