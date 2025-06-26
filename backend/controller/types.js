const pool = require('../config/db');

exports.getAllTypes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, 
              ARRAY_AGG(st.name) AS sub_types
       FROM types t
       LEFT JOIN sub_types st ON st.type_id = t.id
       WHERE t.is_deleted = false
       GROUP BY t.id
       ORDER BY t.name ASC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar tipos:', error);
    res.status(500).json({ message: 'Erro ao buscar tipos', error });
  }
};

exports.getTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT t.*, 
              ARRAY_AGG(st.name) AS sub_types
       FROM types t
       LEFT JOIN sub_types st ON st.type_id = t.id
       WHERE t.id = $1 AND t.is_deleted = false
       GROUP BY t.id`,
      [id]
    );
    const type = result.rows[0];

    if (!type) {
      return res.status(404).json({ message: 'Tipo não encontrado' });
    }

    res.status(200).json(type);
  } catch (error) {
    console.error('Erro ao buscar tipo:', error);
    res.status(500).json({ message: 'Erro ao buscar tipo', error });
  }
};

exports.createType = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO types (name) VALUES ($1) RETURNING *',
      [name]
    );
    res
      .status(201)
      .json({ message: 'Tipo criado com sucesso', type: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar tipo:', error);
    res.status(500).json({ message: 'Erro ao criar tipo', error });
  }
};

exports.updateType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const result = await pool.query(
      'UPDATE types SET name = $1 WHERE id = $2 AND is_deleted = false RETURNING *',
      [name, id]
    );

    const updatedType = result.rows[0];

    if (!updatedType) {
      return res
        .status(404)
        .json({ message: 'Tipo não encontrado ou foi marcado como deletado' });
    }

    res
      .status(200)
      .json({ message: 'Tipo atualizado com sucesso', type: updatedType });
  } catch (error) {
    console.error('Erro ao atualizar tipo:', error);
    res.status(500).json({ message: 'Erro ao atualizar tipo', error });
  }
};

exports.softDeleteType = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE types SET is_deleted = true WHERE id = $1 RETURNING *',
      [id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Tipo não encontrado' });
    }
    res
      .status(200)
      .json({ message: 'Tipo removido (soft delete) com sucesso' });
  } catch (error) {
    console.error('Erro ao remover tipo:', error);
    res.status(500).json({ message: 'Erro ao remover tipo', error });
  }
};
