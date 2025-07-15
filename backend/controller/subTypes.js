const pool = require("../config/db");

exports.getAllSubTypes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sub_types WHERE is_deleted = false ORDER BY name ASC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar subtipos:", error);
    res.status(500).json({ message: "Erro ao buscar subtipos", error });
  }
};

exports.getSubTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM sub_types WHERE id = $1 AND is_deleted = false",
      [id]
    );
    const subType = result.rows[0];

    if (!subType) {
      return res.status(404).json({ message: "Subtipo não encontrado" });
    }

    res.status(200).json(subType);
  } catch (error) {
    console.error("Erro ao buscar subtipo:", error);
    res.status(500).json({ message: "Erro ao buscar subtipo", error });
  }
};

exports.createSubType = async (req, res) => {
  const { name, type_id } = req.body;
  const typeCheck = await pool.query("SELECT id FROM types WHERE id = $1", [
    type_id,
  ]);
  if (typeCheck.rowCount === 0) {
    return res.status(400).json({ message: "Tipo (type_id) inválido" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO sub_types (name, type_id) VALUES ($1, $2) RETURNING *",
      [name, type_id]
    );
    res
      .status(201)
      .json({ message: "Subtipo criado com sucesso", subType: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar subtipo:", error);
    res.status(500).json({ message: "Erro ao criar subtipo", error });
  }
};

exports.updateSubType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const result = await pool.query(
      "UPDATE sub_types SET name = $1 WHERE id = $2 AND is_deleted = false RETURNING *",
      [name, id]
    );

    const updatedSubType = result.rows[0];

    if (!updatedSubType) {
      return res.status(404).json({
        message: "Subtipo não encontrado ou foi marcado como deletado",
      });
    }

    res.status(200).json({
      message: "Subtipo atualizado com sucesso",
      subType: updatedSubType,
    });
  } catch (error) {
    console.error("Erro ao atualizar subtipo:", error);
    res.status(500).json({ message: "Erro ao atualizar subtipo", error });
  }
};

exports.softDeleteSubType = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE sub_types SET is_deleted = true WHERE id = $1 RETURNING *",
      [id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: "Subtipo não encontrado" });
    }
    res
      .status(200)
      .json({ message: "Subtipo removido (soft delete) com sucesso" });
  } catch (error) {
    console.error("Erro ao remover subtipo:", error);
    res.status(500).json({ message: "Erro ao remover subtipo", error });
  }
};

exports.getSubTypesByTypeId = async (req, res) => {
  const { typeId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM sub_types WHERE type_id = $1 AND is_deleted = false ORDER BY name ASC",
      [typeId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar subtipos por tipo:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar subtipos por tipo", error });
  }
};
