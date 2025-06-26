import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./styles.css";

const AdminSettings = () => {
  const [products, setProducts] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);

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

  // Buscar produtos comprados
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

  useEffect(() => {
    fetchProducts();
    fetchBoughtItems();
    fetchUsers();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({ ...product });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este produto?")) {
      await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    }
  };

  const getUserNameById = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : "Desconhecido";
  };

  const handleSave = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/products/${editingProduct}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setEditingProduct(null);
    fetchProducts();
  };

  console.log("users:", users);
  console.log("boughtItems:", boughtItems);

  return (
    <div className="admin-page">
      <h2 className="admin-section-title">🛍️ Todos os Produtos</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Stock</th>
            <th>Ações</th>
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
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="action-button cancel-button"
                    >
                      Cancelar
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

      <h2 className="admin-section-title">📦 Produtos Comprados</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Tamanho</th>
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
    </div>
  );
};

export default AdminSettings;
