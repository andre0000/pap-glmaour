import AddToCartModal from "../../modals/addToCart";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles.css";

const NewArrivals = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const latestProducts = [...products]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 9);

  return (
    <>
      <h2 className="newarrivals-title">{t("title.newarrivals")}</h2>
      <div className="newarrivals-grid">
        {latestProducts.map((product) => (
          <div
            key={product.id}
            className="newarrivals-card"
            onClick={() => openModal(product)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="newarrivals-img"
            />
            <div className="newarrivals-hover">
              <button className="newarrivals-add-icon">+</button>
            </div>
            <div className="newarrivals-info">
              <h3 className="newarrivals-name">{product.name}</h3>
              <p className="newarrivals-price">
                € {Number(product.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <AddToCartModal
          product={selectedProduct}
          show={showModal}
          handleClose={closeModal}
        />
      )}
    </>
  );
};

export default NewArrivals;
