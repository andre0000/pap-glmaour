import "./styles.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CartSidebar({ isOpen, toggleCart }) {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (!storedUser) return;

    setUser(storedUser);
    fetchCartItems(storedUser.id);
  }, [isOpen]);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleRemoveItem = (itemId) => {
    if (!user) return;

    axios
      .put(`${import.meta.env.VITE_API_URL}/cart/${itemId}/remove`)
      .then(() => {
        fetchCartItems(user.id);
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  const handleClearCart = () => {
    if (!user) return;

    axios
      .put(`${import.meta.env.VITE_API_URL}/cart/${user.id}/clear`)
      .then(() => {
        setCartItems([]);
      })
      .catch((err) => console.error("Error clearing cart:", err));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const fetchCartItems = (userId) => {
    if (!userId) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/cart/${userId}`)
      .then((res) => {
        setCartItems(res.data.items || []);
      })
      .catch(() => setCartItems([]));
  };

  return (
    <>
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>{t("title.cart")}</h2>
          <button className="cart-close-btn" onClick={toggleCart}>
            ✕
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <p>{t("cart.empty")}</p>
          ) : (
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-meta">
                      {item.quantity}x | {t("label.productSize")}: {item.size}
                    </div>
                    <div className="cart-item-price">
                      {(item.price * item.quantity).toFixed(2)}€
                    </div>
                  </div>
                  <button
                    className="cart-remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <strong>
              {t("cart.total")}: {total.toFixed(2)}€
            </strong>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            {t("cart.checkout")}
          </button>
          {cartItems.length > 0 && (
            <button className="clear-cart-btn" onClick={handleClearCart}>
              🗑️ {t("buttons.clearCart")}
            </button>
          )}
        </div>
      </div>

      {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}
    </>
  );
}
