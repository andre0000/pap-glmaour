import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./styles.css";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import TypeModal from "../../modals/typesModal";

const AdminSettings = () => {
  const [products, setProducts] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();
  const [types, setTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  const fetchBoughtItems = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/bought`);
      if (!res.ok) throw new Error("Erro ao buscar produtos comprados");
      const data = await res.json();
      setBoughtItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error("Erro ao buscar produtos comprados:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me`);
      if (!res.ok) throw new Error("Erro ao buscar utilizadores");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTypesAndSubTypes = async () => {
    try {
      const typesResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/types`
      );
      const subTypesResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/subTypes`
      );

      if (!typesResponse.ok || !subTypesResponse.ok) {
        throw new Error("Erro ao buscar os dados");
      }

      const typesData = await typesResponse.json();
      const subTypesData = await subTypesResponse.json();

      console.log("Tipos recebidos:", typesData);
      console.log("Subtipos recebidos:", subTypesData);

      const processedTypes = typesData.map((type) => ({
        ...type,
        sub_types: subTypesData.filter(
          (subType) => subType.type_id === type.id
        ),
      }));

      setTypes(processedTypes);
    } catch (error) {
      console.error("Erro ao buscar os types e sub_types:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBoughtItems();
    fetchUsers();
    fetchTypesAndSubTypes();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({ ...product });
  };

  const handleDelete = async (id) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      Swal.fire("Erro", t("error.tokenFailed"), "error");
      return;
    }

    const result = await Swal.fire({
      title: t("confirmation.title"),
      text: t("confirmation.text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("confirmation.buttons.confirm"),
      cancelButtonText: t("confirmation.buttons.cancel"),
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products/delete/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          Swal.fire(t("error.updatedTitle"), t("error.updatedText"), "error");
          return;
        }

        Swal.fire(t("success.title"), t("success.productRemoved"), "success");
        fetchProducts();
      } catch (err) {
        console.error("Erro ao apagar produto:", err);
        Swal.fire(t("error.title"), t("error.removeProduct"), "error");
      }
    }
  };

  const handleSave = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${editingProduct}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: t("success.updatedTitle"),
          text: t("success.updatedText"),
          icon: "success",
        });
        fetchProducts();
        setEditingProduct(null);
        setFormData({});
      } else {
        Swal.fire({
          icon: "error",
          title: t("error.updatedTitle"),
          text: t("error.updatedText"),
        });
      }
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      Swal.fire({
        icon: "error",
        title: t("error.updatedTitle"),
        text: "Erro na requisição.",
      });
    }
  };

  return (
    <div className="admin-page">
      <h2 className="admin-section-title">🛍️ {t("title.Products")}</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>{t("label.image")}</th>
            <th>{t("label.name")}</th>
            <th>{t("label.price")}</th>
            <th>{t("label.quantity")}</th>
            <th>{t("label.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) &&
            products.map((p) =>
              editingProduct === p.id ? (
                <tr key={p.id} className="editing-row">
                  <td>
                    <img src={formData.imageUrl} alt={p.name} width="60" />
                  </td>
                  <td>
                    <input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="edit-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="edit-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: parseInt(e.target.value),
                        })
                      }
                      className="edit-input"
                    />
                  </td>
                  <td>
                    <button
                      onClick={handleSave}
                      className="action-button edit-button"
                    >
                      {t("buttons.save")}
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="action-button cancel-button"
                    >
                      {t("buttons.cancel")}
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={p.id}>
                  <td>
                    <img src={p.imageUrl} alt={p.name} width="60" />
                  </td>
                  <td>{p.name}</td>
                  <td>€ {p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(p)}
                      className="icon-button edit-button"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="icon-button delete-button"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
      <h2 className="admin-section-title">📦 {t("title.boughtProducts")}</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>{t("label.image")}</th>
            <th>{t("label.name")}</th>
            <th>{t("label.price")}</th>
            <th>{t("label.quantity")}</th>
            <th>{t("label.size")}</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(boughtItems) &&
            boughtItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt={item.name} width="60" />
                </td>
                <td>{item.name}</td>
                <td>€ {item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.size || "-"}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <TypeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={fetchTypesAndSubTypes}
      />
      <h2 className="admin-section-title">{t("title.subTypes")}</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>{t("label.name")}</th>
            <th>{t("label.type")}</th>
            <th>{t("label.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(types) &&
            types.map((type) =>
              type.sub_types.map((subType) => (
                <tr key={subType.id}>
                  <td>{subType.name}</td>
                  <td>{type.name}</td>
                  <td></td>
                </tr>
              ))
            )}
        </tbody>
      </table>
      <button
        onClick={() => setShowModal(true)}
        className="action-button"
        style={{ marginBottom: "1rem", marginLeft: "80%" }}
      >
        + {t("buttons.addSubType")}
      </button>
    </div>
  );
};

export default AdminSettings;
