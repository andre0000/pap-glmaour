import "./styles.css";
import { useTranslation } from "react-i18next";

export default function CartSidebar({ isOpen, toggleCart }) {
  const { t } = useTranslation();

  return (
    <>
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>{t("title.cart")}</h2>
          <button className="close-btn" onClick={toggleCart}>
            ✕
          </button>
        </div>

        <div className="cart-content">
          <p>{t("cart.empty")}</p>
        </div>

        <div className="cart-footer">
          <button className="checkout-btn">{t("cart.checkout")}</button>
        </div>
      </div>

      {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}
    </>
  );
}
