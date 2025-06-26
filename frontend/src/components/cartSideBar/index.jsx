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
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (!storedUser) return;

    setUser(storedUser);

    axios
      .get(`http://localhost:5000/api/cart/${storedUser.id}`)
      .then((res) => {
        setCartItems(res.data.items || []);
        console.log("Cart response:", res.data);
      })
      .catch(() => setCartItems([]));
  }, []);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!cartItems.length) {
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
            <p>{t("cart.empty")}</p>
          </div>
          <div className="cart-footer">
            <button className="checkout-btn" onClick={handleCheckout}>
              {t("cart.checkout")}
            </button>
          </div>
        </div>
        {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}
      </>
    );
  }

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
                    {item.quantity}x | Size: {item.size}
                  </div>
                  <div className="cart-item-price">
                    {(item.price * item.quantity).toFixed(2)}€
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <strong>Total: {total.toFixed(2)}€</strong>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            {t("cart.checkout")}
          </button>
        </div>
      </div>

      {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}
    </>
  );
}
