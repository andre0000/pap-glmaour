import { useState, useEffect } from "react";
import "./styles.css";

const TypeModal = ({ isOpen, onClose, onCreated }) => {
  const [mode, setMode] = useState("new_subtype");
  const [typeName, setTypeName] = useState("");
  const [subTypeName, setSubTypeName] = useState("");
  const [existingTypes, setExistingTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch(`${import.meta.env.VITE_API_URL}/types`)
        .then((res) => res.json())
        .then((data) => setExistingTypes(data))
        .catch((err) => console.error("Erro ao buscar tipos:", err));
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return alert("Token inválido");

    try {
      if (mode === "new_type") {
        const typeRes = await fetch(`${import.meta.env.VITE_API_URL}/types`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: typeName }),
        });

        if (!typeRes.ok) {
          const err = await typeRes.text();
          throw new Error(`Erro ao criar tipo: ${err}`);
        }

        const newType = await typeRes.json();
        const newTypeId = newType.type?.id;

        if (!newTypeId)
          throw new Error("Resposta inválida: ID do tipo ausente");

        console.log("Novo tipo criado com ID:", newTypeId);
        await createSubType(newTypeId);
      } else {
        if (!selectedTypeId) return alert("Escolha um tipo existente");
        await createSubType(selectedTypeId);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar tipo/subtipo. Verifique o console.");
    }
  };

  const createSubType = async (typeId) => {
    const token = sessionStorage.getItem("token");
    if (!typeId) throw new Error("typeId está indefinido!");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/subTypes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: subTypeName, type_id: typeId }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Erro ao criar subtipo: ${err}`);
    }

    console.log("Subtipo criado com sucesso");
    onCreated();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setMode("new_subtype");
    setTypeName("");
    setSubTypeName("");
    setSelectedTypeId("");
  };

  if (!isOpen) return null;

  return (
    <div className="type-modal-overlay">
      <div className="type-modal">
        <h3>Criar Subtipo</h3>
        <div className="mode-switch">
          <label>
            <input
              type="radio"
              value="new_subtype"
              checked={mode === "new_subtype"}
              onChange={() => setMode("new_subtype")}
            />
            Associar a um tipo existente
          </label>
          <label>
            <input
              type="radio"
              value="new_type"
              checked={mode === "new_type"}
              onChange={() => setMode("new_type")}
            />
            Criar novo tipo
          </label>
        </div>

        {mode === "new_type" ? (
          <input
            type="text"
            placeholder="Nome do novo tipo"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            required
          />
        ) : (
          <select
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(e.target.value)}
            required
          >
            <option value="">Escolha um tipo</option>
            {existingTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          placeholder="Nome do subtipo"
          value={subTypeName}
          onChange={(e) => setSubTypeName(e.target.value)}
          required
        />

        <div className="type-modal-actions">
          <button onClick={handleSubmit}>Salvar</button>
          <button onClick={onClose} className="cancel-btn">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeModal;
