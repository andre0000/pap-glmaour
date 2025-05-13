const pool = require('../config/db');

// ➕ Criar fornecedor
exports.addSupplier = async (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'O nome é obrigatório' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO suppliers (name, email, phone, address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, phone, address]
    );

    res.status(201).json({
      message: 'Fornecedor adicionado com sucesso',
      supplier: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao adicionar fornecedor:', error);
    res.status(500).json({ message: 'Erro ao adicionar fornecedor', error });
  }
};

// 🔁 Atualizar fornecedor
exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const result = await pool.query(
      `UPDATE suppliers
       SET name = $1, email = $2, phone = $3, address = $4, updated_at = NOW()
       WHERE id = $5 AND is_deleted = false
       RETURNING *`,
      [name, email, phone, address, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }

    res.status(200).json({
      message: 'Fornecedor atualizado com sucesso',
      supplier: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ message: 'Erro ao atualizar fornecedor', error });
  }
};

// ❌ Remover fornecedor (soft delete)
exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE suppliers SET is_deleted = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }

    res.status(200).json({ message: 'Fornecedor removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover fornecedor:', error);
    res.status(500).json({ message: 'Erro ao remover fornecedor', error });
  }
};

// 📥 Obter todos os fornecedores (não removidos)
exports.getAllSuppliers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM suppliers WHERE is_deleted = false ORDER BY created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({ message: 'Erro ao buscar fornecedores', error });
  }
};

// 🔍 Obter fornecedor por ID
exports.getSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM suppliers WHERE id = $1 AND is_deleted = false`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({ message: 'Erro ao buscar fornecedor', error });
  }
};
