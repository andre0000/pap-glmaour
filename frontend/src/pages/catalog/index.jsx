import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddButton from "../../components/addProductButton";
import AddProductModal from "../../modals/addProduct";
import AddToCartModal from "../../modals/addToCart";
import "./styles.css";

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao parsear usuário:", error);
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const data = await response.json();
        setProducts(data);
        console.log("Produtos recebidos do backend:", data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProducts();
  }, []);

  const openCartModal = (product) => {
    setSelectedProduct(product);
    setShowCartModal(true);
  };

  const closeCartModal = () => {
    setSelectedProduct(null);
    setShowCartModal(false);
  };

  const latestProducts = [...products]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 9);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="title m-0">{t("title.allProducts")}</h2>
        {user?.is_admin && (
          <div className="add-button-wrapper">
            <AddButton onClick={() => setShowAddModal(true)} />
          </div>
        )}
      </div>

      <div className="row">
        {latestProducts.map((product) => {
          return (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 mb-4">
              <div
                className="product-card"
                onClick={() => openCartModal(product)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-img"
                />

                <div className="product-hover">
                  <button className="add-icon">+</button>
                </div>
                <div className="product-info">
                  <h5 className="product-name">{product.name}</h5>
                  <p className="product-price">
                    € {Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <AddProductModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />
      {selectedProduct && user && (
        <AddToCartModal
          product={selectedProduct}
          show={showCartModal}
          handleClose={closeCartModal}
          user={user}
        />
      )}
    </div>
  );
};

export default CatalogPage;
