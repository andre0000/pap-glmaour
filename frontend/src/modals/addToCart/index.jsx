import "./styles.css";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const AddToCartModal = ({ product, show, handleClose, user }) => {
  if (!show) return null;

  const { t } = useTranslation();

  const sizes = ["XS", "S", "M", "L", "XL"];

  const handleAddToCart = async (size) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
          size: size,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao adicionar ao carrinho");
      }

      Swal.fire({
        title: t("success.title"),
        text: t("success.productAdded"),
        icon: "success",
      });
      handleClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="size-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{product.name}</h2>
        <img src={product.imageUrl} alt={product.name} className="modal-img" />
        <p className="modal-choose">{t("modal.chooseSize")}</p>
        <div className="sizes">
          {sizes.map((size) => (
            <button key={size} onClick={() => handleAddToCart(size)}>
              {size}
            </button>
          ))}
        </div>
        <button className="close-btn" onClick={handleClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;
