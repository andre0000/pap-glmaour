import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeId = searchParams.get("type_id");
  const subTypeId = searchParams.get("sub_type_id");
  const filter = searchParams.get("filter");
  const gender = searchParams.get("gender");

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
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products`
        );
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const data = await response.json();
        setProducts(data);
        console.log(data);
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

  const chunkProducts = (products, size) => {
    const chunks = [];
    for (let i = 0; i < products.length; i += size) {
      chunks.push(products.slice(i, i + size));
    }
    return chunks;
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (gender === "men" || gender === "women") {
      filtered = filtered.filter(
        (p) => p.gender === gender || p.gender === "unisex"
      );
    }

    if (filter === "new_arrivals") {
      filtered = filtered
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);
    }

    if (typeId) {
      filtered = filtered.filter((p) => p.type_id === typeId);
    }

    if (subTypeId) {
      filtered = filtered.filter((p) => p.sub_type_id === subTypeId);
    }

    return filtered;
  }, [products, filter, gender, typeId, subTypeId]);

  return (
    <>
      <div className="catalog-background">
        <img
          src="https://www.apparelentrepreneurship.com/wp-content/uploads/2019/04/apparel_entrepreneurship_what_your_clothing_brand_needs_to_stay_relevant_2019.jpg"
          alt="Background Left"
          className="bg-img"
        />
        <img
          src="https://cdn.prod.website-files.com/61083e5f5398b157c850d20a/6808fd7f84e7f1bab2bba0e8_660c252e41e2cc4e1aee8a9b_Main%2520Blog%2520Image%2520(1080%2520x%25201080%2520px).png"
          alt="Background Right"
          className="bg-img"
        />
      </div>

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
          {filteredProducts.map((product) => (
            <div
              key={product.id}
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
          ))}
        </div>

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
    </>
  );
};

export default CatalogPage;
