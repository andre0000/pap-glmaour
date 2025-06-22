import "./styles.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CartSidebar({ isOpen, toggleCart }) {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) return;

    axios
      .get(`/cart/${user.id}`)
      .then((res) => {
        setCartItems(res.data.items || []);
      })
      .catch(() => setCartItems([]));
  }, []);

  const handleCheckout = () => {
    navigate("/checkout");
  };

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
  } else {
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
            <div>
              <table className="table align-middle">
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                          <div>
                            <div className="fw-bold">{item.name}</div>
                            <div className="text-muted">Size: {item.size}</div>
                            <div className="text-primary">{item.price}€</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
}
