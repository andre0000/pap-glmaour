const pool = require("../config/db");

// Adicionar produto
exports.addProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    supplier_id,
    gender,
    type_id,
    sub_type_id,
    imageUrl,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO products 
       (name, description, price, stock, gender, supplier_id, type_id, sub_type_id, image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id, name, description, price, stock, gender, supplier_id, type_id, sub_type_id, image AS "imageUrl"`,
      [
        name,
        description,
        price,
        stock,
        gender,
        supplier_id,
        type_id,
        sub_type_id,
        imageUrl,
      ]
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
  const { name, description, price, stock, supplier_id, type_id, imageUrl } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE products SET 
         name = $1, 
         description = $2, 
         price = $3, 
         stock = $4, 
         gender= $5,
         supplier_id = $6, 
         type_id = $7, 
         image = $8
       WHERE id = $9 AND is_deleted = false
       RETURNING id, name, description, price, stock, gender, supplier_id, type_id, image AS "imageUrl"`,
      [
        name,
        description,
        price,
        stock,
        gender,
        supplier_id,
        type_id,
        imageUrl,
        id,
      ]
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

// Buscar todos os produtos
exports.getProduct = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.stock, 
        p.gender,
        p.supplier_id, 
        p.type_id, 
        p.sub_type_id,
        p.is_deleted, 
        p.created_at, 
        p.updated_at,
        p.image AS "imageUrl"
      FROM products p
      WHERE p.is_deleted = false
      ORDER BY p.name ASC`
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

exports.getTypesAndSubTypes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT capotype AS type, sub_type FROM products WHERE is_deleted = false"
    );

    const types = {};
    result.rows.forEach(({ type, sub_type }) => {
      if (!type) return;
      if (!types[type]) types[type] = [];
      if (sub_type && !types[type].includes(sub_type)) {
        types[type].push(sub_type);
      }
    });

    // Retorna como array para o frontend
    const typesArray = Object.entries(types).map(([type, sub_types]) => ({
      type,
      sub_types,
    }));

    res.status(200).json(typesArray);
  } catch (error) {
    console.error("Erro ao buscar tipos e subtipos:", error);
    res.status(500).json({ message: "Erro ao buscar tipos e subtipos", error });
  }
};
