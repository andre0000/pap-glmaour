import { useState } from "react";
import "./styles.css";
import Swal from "sweetalert2";

const SupplierModal = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return alert("Token inválido");
    if (!name.trim()) return alert("O nome é obrigatório");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone, address }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Erro ao adicionar fornecedor: ${err}`);
      }

      Swal.fire({
        icon: "success",
        title: t("success.title"),
        text: t("success.supplierAdded"),
      });
      onCreated();
      onClose();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar fornecedor. Verifique o console.");
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  if (!isOpen) return null;

  return (
    <div className="supplier-modal-overlay">
      <div className="supplier-modal">
        <h3>Adicionar Fornecedor</h3>

        <input
          type="text"
          placeholder="Nome *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="supplier-modal-actions">
          {" "}
          <button onClick={handleSubmit}>Salvar</button>
          <button onClick={onClose} className="cancel-btn">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;
