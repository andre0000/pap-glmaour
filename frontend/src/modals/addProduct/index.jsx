import { useState, useEffect } from "react";
import "./styles.css";
import { useTranslation } from "react-i18next";

const AddProductModal = ({ show, handleClose }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    gender: "",
    supplier_id: "",
    type: "",
    subType: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [types, setTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/suppliers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok) setSuppliers(data);
        else console.error("Erro ao buscar fornecedores:", data.message);
      } catch (err) {
        console.error("Erro de conexão ao buscar fornecedores:", err);
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/types`);
        const data = await response.json();
        if (response.ok) setTypes(data);
        else console.error("Erro ao buscar tipos:", data.message);
      } catch (err) {
        console.error("Erro de conexão ao buscar tipos:", err);
      }
    };

    fetchSuppliers();
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchSubTypes = async () => {
      if (!form.type) {
        setSubTypes([]);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/subTypes/type/${form.type}`
        );
        const data = await response.json();
        if (response.ok) setSubTypes(data);
        else console.error("Erro ao buscar subtipos:", data.message);
      } catch (err) {
        console.error("Erro de conexão ao buscar subtipos:", err);
      }
    };

    fetchSubTypes();
  }, [form.type]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const payload = {
        ...form,
        type_id: form.type,
        sub_type_id: form.subType,
        imageUrl,
      };
      delete payload.type;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: t("success.title"),
          text: t("success.productAdded"),
        });
        handleClose();
        window.location.reload();
      } else {
        alert(data.message || "Error creating product.");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server.");
    }
  };

  if (!show) return null;

  return (
    <div className="add-product-modal-backdrop" onClick={handleClose}>
      <div
        className="add-product-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="add-product-modal-close" onClick={handleClose}>
          ×
        </button>
        <form className="add-product-form" onSubmit={handleSubmit}>
          <h2 className="add-product-title">{t("title.addProduct")}</h2>

          <div className="flex-column">
            <label>{t("label.name")}</label>
            <div className="inputForm">
              <input
                type="text"
                name="name"
                className="input"
                placeholder={t("placeholder.name")}
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex-column">
            <label>{t("label.description")}</label>
            <div className="inputForm">
              <input
                type="text"
                name="description"
                className="input"
                placeholder={t("placeholder.description")}
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex-column">
            <label>{t("label.price")}</label>
            <div className="inputForm">
              <input
                type="number"
                step="0.01"
                name="price"
                className="input"
                placeholder={t("placeholder.price")}
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex-column">
            <label>{t("label.gender")}</label>
            <div className="inputForm">
              <select
                name="gender"
                className="input"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">{t("options.gender")}</option>
                <option value="men">{t("options.men")}</option>
                <option value="women">{t("options.women")}</option>
                <option value="unisex">{t("options.unisex")}</option>
              </select>
            </div>
          </div>

          <div className="flex-column">
            <label>{t("label.stock")}</label>
            <div className="inputForm">
              <input
                type="number"
                name="stock"
                className="input"
                placeholder={t("placeholder.stock")}
                value={form.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex-column">
            <label>{t("label.supplier")}</label>
            <div className="inputForm">
              <select
                name="supplier_id"
                className="input"
                value={form.supplier_id}
                onChange={handleChange}
                required
              >
                <option value="">{t("options.supplier")}</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-column">
            <label>{t("label.type")}</label>
            <div className="inputForm">
              <select
                name="type"
                className="input"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value, subType: "" })
                }
                required
              >
                <option value="">{t("options.type")}</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-column">
            <label>{t("label.subType")}</label>
            <div className="inputForm">
              <select
                name="subType"
                className="input"
                value={form.subType}
                onChange={handleChange}
                required
              >
                <option value="">{t("options.subType")}</option>
                {subTypes.map((subType) => (
                  <option key={subType.id} value={subType.id}>
                    {subType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo simplificado para a URL da imagem */}
          <div className="flex-column">
            <label>{t("label.imageUrl")}</label>
            <div className="inputForm">
              <input
                type="text"
                name="image"
                className="input"
                placeholder={t("placeholder.urlImage")}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>

          <button className="button-submit" type="submit">
            {t("buttons.addProduct")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
